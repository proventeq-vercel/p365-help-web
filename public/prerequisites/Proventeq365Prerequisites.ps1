<#
.SYNOPSIS
    Proventeq365 deployment prerequisite provisioner.

    Creates (or reuses) the Entra app registration and everything under it, optionally a second
    app for the AI chatbot, then writes every value the Marketplace / pipeline deployment needs
    into a BOOTSTRAP KEY VAULT. The Bicep reads them at deploy time, so no app-specific field has to
    be typed into the Azure portal.

.DESCRIPTION
    Idempotent. Safe to re-run. Uses the Azure CLI (az). All Graph / SharePoint permission GUIDs are
    resolved DYNAMICALLY from the service principals by name — no hard-coded GUIDs. No secret value is
    ever printed to stdout.

    TWO-TENANT SUPPORT
    ------------------
    By default everything is created in ONE tenant (-CustomerTenantId): the app registration(s) AND
    the resource group + Key Vault.

    For the split scenario — e.g. an E5 tenant that holds Microsoft 365 / SharePoint where the APP
    must live, and a separate tenant (with the Azure subscription) where the RESOURCE GROUP + KEY
    VAULT must live — pass -AppTenantId. The script interleaves the two tenants rather than running
    fully app-then-infra, so the vault is always checked before anything is minted:
       1. App tenant   (-AppTenantId):      sign in, role check, derive tenantName.
       2. Infra tenant  (-CustomerTenantId): resolve the subscription + deterministic Key Vault name,
                                             and check whether it already holds the client secret, the
                                             SPO certificate and the AI agent secret.
       3. App tenant   (-AppTenantId):      app registration(s), permissions, consent; mint only
                                             whichever of those three secrets step 2 found missing.
       4. Infra tenant  (-CustomerTenantId): resource group, Key Vault, write the secrets/tags, grant
                                             the Appliance Resource Provider + Managed Apps OBO app.
    In the split case the script writes an extra 'tenantId' tag = -AppTenantId so the deployment uses
    the APP tenant for authentication instead of tenant().tenantId. Each tenant switch above is a real
    device-code sign-in unless you're already in that tenant — in the single-tenant case (the default)
    every switch above is a same-tenant no-op, so there's no extra sign-in friction at all.

.NOTES
    Requires: Azure CLI (az) >= 2.53, PowerShell 7+ (recommended; local self-signed cert generation
    uses .NET CertificateRequest). Run in Azure Cloud Shell (PowerShell) or locally.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string] $CustomerTenantId,

    # Optional. Tenant in which the Entra applications are created. When omitted, apps are created in
    # CustomerTenantId (single-tenant default). Set this to the tenant that holds Microsoft 365 /
    # SharePoint (e.g. the E5 tenant) when it differs from the Azure subscription's tenant.
    [string] $AppTenantId,

    [string] $SubscriptionId,

    [Parameter(Mandatory)]
    [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9 ._-]{0,62}$')]
    [string] $ApplicationName,

    [string] $ResourceGroupName,

    [Parameter(Mandatory)]
    [string] $Location,

    [Parameter(Mandatory)]
    [ValidateSet('ReadOnly', 'ReadWrite')]
    [string] $PermissionMode,

    [Parameter(Mandatory)]
    [string] $AcrUsername,

    [Parameter(Mandatory)]
    [securestring] $AcrPassword,

    [string] $PlatformAdminObjectId,

    [string] $FrontendUrl,

    [switch] $ConfigureAiAgent,

    [switch] $GrantAdminConsent,

    [switch] $MultiTenant,

    [string] $KeyVaultName,

    [switch] $ForceNewCert,

    [switch] $RemoveBootstrapKeyVault,

    [switch] $NonInteractive,

    # Deploy Azure AI Foundry / OpenAI (Dynamic Policy + AI Agent LLM). Stored as the 'deployFoundry'
    # Key Vault tag (default false). When true the deployment registers Microsoft.CognitiveServices and
    # deploys the Foundry account/project/model; when false those resources are skipped.
    [switch] $DeployFoundry,

    # Azure region for the Static Web App (limited region set). Stored as the 'staticWebAppRegion' Key
    # Vault tag (default westeurope) and validated against the subscription before deployment.
    [string] $StaticWebAppRegion = 'westeurope',

    [string] $LogFolder = (Join-Path $PSScriptRoot 'logs')
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# By default, create the app registrations in the same tenant as the Azure subscription.
# AppTenantId enables the cross-tenant scenario.
if ([string]::IsNullOrWhiteSpace($AppTenantId)) { $AppTenantId = $CustomerTenantId }
$script:IsCrossTenant = $AppTenantId -ne $CustomerTenantId
$script:IsCloudShell = ($env:AZUREPS_HOST_ENVIRONMENT -like 'cloud-shell*') -or [bool]$env:ACC_CLOUD

# Well-known first-party resource app IDs.
$GraphResourceId = '00000003-0000-0000-c000-000000000000'
$SpoResourceId = '00000003-0000-0ff1-ce00-000000000000'
$ArpDisplayName = 'Appliance Resource Provider'
# Resolves getSecret()/tag references on the main template's parameters before the managed
# resource group (and the Appliance Resource Provider's deny-assignment scope) exists. Same
# appId in every tenant; grant it alongside the ARP or Marketplace managed-app deployments get
# AuthorizationFailed on Microsoft.KeyVault/vaults/read even though the ARP has access.
$ManagedAppsOboAppId = '35cbcc06-defd-44d2-ace4-bc2bf2466970'

# ==================================================================================================
# Logging
# ==================================================================================================
$script:StepIndex = 0
$script:TotalSteps = 19
$script:StatusRows = [System.Collections.Generic.List[object]]::new()

if (-not (Test-Path $LogFolder)) { New-Item -ItemType Directory -Path $LogFolder -Force | Out-Null }
$script:LogFile = Join-Path $LogFolder ("prereq-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))

function Write-Log {
    param(
        [ValidateSet('INFO', 'WARN', 'ERROR', 'SUCCESS', 'DEBUG')]
        [string] $Level = 'INFO',
        [string] $Step = '',
        [Parameter(Mandatory)][string] $Message
    )
    if ($Level -eq 'DEBUG' -and $VerbosePreference -ne 'Continue') { return }
    $ts = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    $stepTag = if ($Step) { " [$Step]" } else { '' }
    $line = "$ts [$Level]$stepTag $Message"
    Add-Content -Path $script:LogFile -Value $line
    $colour = switch ($Level) {
        'ERROR' { 'Red' } 'WARN' { 'Yellow' } 'SUCCESS' { 'Green' } 'DEBUG' { 'DarkGray' } default { 'Gray' }
    }
    Write-Host $line -ForegroundColor $colour
}

function Start-Step {
    param([string] $Name)
    $script:StepIndex++
    $script:CurrentStep = "Step $($script:StepIndex)/$($script:TotalSteps) $Name"
    Write-Log -Level INFO -Step $script:CurrentStep -Message '...'
    return $script:CurrentStep
}

function Set-StepStatus {
    param([string] $Name, [string] $Status, [string] $Detail = '')
    $script:StatusRows.Add([pscustomobject]@{ Step = $Name; Status = $Status; Detail = $Detail })
}

# ==================================================================================================
# az helpers
# ==================================================================================================
function Invoke-Az {
    <# Runs az, throws on non-zero, returns parsed JSON (or $null). #>
    param([string[]] $Arguments, [switch] $AllowFailure)
    Write-Log -Level DEBUG -Step $script:CurrentStep -Message ("az " + ($Arguments -join ' '))
    $output = & az @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        if ($AllowFailure) { return $null }
        throw "az $($Arguments -join ' ') failed (exit $LASTEXITCODE): $output"
    }
    if ([string]::IsNullOrWhiteSpace([string]$output)) { return $null }
    try { return ($output | ConvertFrom-Json) } catch { return $output }
}

function Invoke-AzTsv {
    param([string[]] $Arguments, [switch] $AllowFailure)
    Write-Log -Level DEBUG -Step $script:CurrentStep -Message ("az " + ($Arguments -join ' '))
    $output = & az @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        if ($AllowFailure) { return $null }
        throw "az $($Arguments -join ' ') failed (exit $LASTEXITCODE): $output"
    }
    return ([string]$output).Trim()
}

# Sign in to a tenant, but only if not already there. The interactive/device-code prompt is NOT
# captured (stdout hidden, stderr/device-code stays on screen) so Cloud Shell does not appear to hang.
# --allow-no-subscriptions is required for the app/E5 tenant where the signed-in user has no subscription.
function Connect-AzTenant {
    param([string] $TenantId, [string] $Label)
    $current = & az account show --query tenantId -o tsv 2>$null
    if ($LASTEXITCODE -eq 0 -and $current -eq $TenantId) {
        Write-Log -Level INFO -Message "Already signed in to the $Label tenant ($TenantId)."
        return
    }
    Write-Log -Level INFO -Message "Signing in to the $Label tenant ($TenantId)..."
    Write-Host ''
    Write-Host ">> Sign-in required for tenant $TenantId. If a device-code prompt appears below," -ForegroundColor Yellow
    Write-Host ">> open the URL shown and enter the code, then come back here." -ForegroundColor Yellow
    $loginArgs = @('login', '--tenant', $TenantId, '--allow-no-subscriptions', '--output', 'none')
    if ($script:IsCloudShell) { $loginArgs += '--use-device-code' }
    & az @loginArgs                   # --output none hides the JSON; the device-code prompt (stderr) stays visible
    if ($LASTEXITCODE -ne 0) { throw "Sign-in to tenant $TenantId failed (exit $LASTEXITCODE)." }
    Write-Host ''
    Write-Log -Level SUCCESS -Message "Signed in to the $Label tenant."
}

# BOM-less UTF-8 writer — Windows PowerShell's Set-Content -Encoding utf8 prepends a BOM, which
# makes `az rest --body @file` fail JSON parsing.
function Write-JsonFile {
    param([string] $Path, [string] $Json)
    [System.IO.File]::WriteAllText($Path, $Json, (New-Object System.Text.UTF8Encoding($false)))
}

# Recursively walks a hashtable/array body and forces every named property back into a real
# PowerShell array (@(...) is idempotent on an already-correct array), last line of defence against
# the 0-element-to-null / 1-element-to-scalar unwrapping ConvertTo-Json would otherwise emit.
function ConvertTo-ArraySafeBody {
    param($Value, [string[]] $ArrayProps)
    if ($Value -is [hashtable]) {
        foreach ($key in @($Value.Keys)) {
            $Value[$key] = ConvertTo-ArraySafeBody -Value $Value[$key] -ArrayProps $ArrayProps
            if ($ArrayProps -contains $key) {
                # @($null) is a 1-element array holding $null, not []  — handle that case explicitly.
                if ($null -eq $Value[$key]) { $Value[$key] = @() } else { $Value[$key] = @($Value[$key]) }
            }
        }
        return $Value
    }
    if ($Value -is [array]) {
        for ($i = 0; $i -lt $Value.Count; $i++) { $Value[$i] = ConvertTo-ArraySafeBody -Value $Value[$i] -ArrayProps $ArrayProps }
        return , $Value
    }
    return $Value
}

function Update-Application {
    param([string] $ObjectId, [hashtable] $Body)
    $tmp = (New-TemporaryFile).FullName
    try {
        # PowerShell silently unwraps a script-block result of 0 elements to $null and of exactly 1
        # element to a bare scalar (confirmed: `if ($true) { @('x') }` returns the string 'x', not an
        # array). Graph's application API rejects both for its non-nullable collection properties
        # ("null not allowed" / "StartArray node was expected"), so force every known array-typed
        # property back into a real array immediately before serializing, regardless of how it was built.
        $nonNullableArrayProps = @('preAuthorizedApplications', 'oauth2PermissionScopes', 'identifierUris',
            'requiredResourceAccess', 'resourceAccess', 'keyCredentials', 'redirectUris')
        $Body = ConvertTo-ArraySafeBody -Value $Body -ArrayProps $nonNullableArrayProps
        Write-JsonFile -Path $tmp -Json ($Body | ConvertTo-Json -Depth 20)
        & az rest --method PATCH --uri "https://graph.microsoft.com/v1.0/applications/$ObjectId" `
            --headers 'Content-Type=application/json' --body "@$tmp" --only-show-errors | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "PATCH application $ObjectId failed (exit $LASTEXITCODE)." }
    }
    finally { Remove-Item $tmp -ErrorAction SilentlyContinue }
}

function Get-AppRoleId {
    param($Sp, [string] $Value)
    $role = $Sp.appRoles | Where-Object { $_.value -eq $Value -and ($_.allowedMemberTypes -contains 'Application') }
    if (-not $role) { throw "Application permission '$Value' not found on resource SP '$($Sp.appId)'." }
    return $role.id
}

function Get-ScopeId {
    param($Sp, [string] $Value)
    $scope = $Sp.oauth2PermissionScopes | Where-Object { $_.value -eq $Value }
    if (-not $scope) { throw "Delegated scope '$Value' not found on resource SP '$($Sp.appId)'." }
    return $scope.id
}

function Get-Slug {
    param([string] $Value)
    $s = $Value.ToLowerInvariant() -replace '[^a-z0-9]', '-' -replace '-+', '-'
    return $s.Trim('-')
}

# Deterministic, non-cryptographic hash (MD5 is fine here — purely a naming disambiguator, same
# category as Bicep's uniqueString()). Same input always produces the same output, unlike
# [guid]::NewGuid(), so the derived Key Vault name is stable across re-runs.
function Get-StableHash {
    param([string] $Value)
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
    $hashBytes = [System.Security.Cryptography.MD5]::Create().ComputeHash($bytes)
    return ([System.BitConverter]::ToString($hashBytes) -replace '-', '').ToLowerInvariant()
}

# Escapes a value for use inside an OData string literal (Graph '--filter' queries).
function Get-ODataLiteral {
    param([string] $Value)
    return $Value.Replace("'", "''")
}

# Tri-state secret lookup: $true = exists, $false = vault/secret genuinely missing (safe to mint),
# throws on anything else (RBAC not ready, Forbidden, etc.) rather than silently treating an access
# problem as "missing" and minting an unnecessary rotation.
function Test-KvSecretExists {
    param([string] $VaultName, [string] $Name, [string] $Subscription)
    $output = & az keyvault secret show --vault-name $VaultName --name $Name --subscription $Subscription --query id -o tsv --only-show-errors 2>&1
    if ($LASTEXITCODE -eq 0) { return $true }
    $text = [string]$output
    if ($text -match 'SecretNotFound' -or $text -match 'VaultNotFound' -or $text -match 'ResourceNotFound') { return $false }
    throw "Could not check secret '$Name' in vault '$VaultName' (not a 'not found' response, so stopping rather than risk an unnecessary rotation): $text"
}

# Merges a wanted set of resourceAccess entries (by id+type) into whatever the app already has for
# that resourceAppId, so re-running never drops a permission the app already holds.
function Merge-ResourceAccess {
    param([array] $CurrentRequiredResourceAccess, [string] $ResourceAppId, [array] $Wanted)
    $existingEntry = @($CurrentRequiredResourceAccess | Where-Object { $_.resourceAppId -eq $ResourceAppId }) | Select-Object -First 1
    $merged = [System.Collections.Generic.List[object]]::new()
    if ($existingEntry -and ($existingEntry.PSObject.Properties.Name -contains 'resourceAccess') -and $existingEntry.resourceAccess) {
        foreach ($e in @($existingEntry.resourceAccess)) { $merged.Add(@{ id = [string]$e.id; type = [string]$e.type }) }
    }
    foreach ($w in @($Wanted)) {
        $already = $merged | Where-Object { $_.id -eq $w.id -and $_.type -eq $w.type }
        if (-not $already) { $merged.Add(@{ id = [string]$w.id; type = [string]$w.type }) }
    }
    # Leading comma stops PowerShell unrolling a 1-item array into a single object.
    return , $merged.ToArray()
}

function ConvertFrom-SecureStringPlain {
    param([securestring] $Secure)
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
    try { return [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
    finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

# Self-signed certificate generated locally (tenant/KV independent — works for the cross-tenant case).
function New-SelfSignedCertLocal {
    param([string] $Subject, [int] $Months = 24)
    $rsa = [System.Security.Cryptography.RSA]::Create(2048)
    try {
        $req = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
            "CN=$Subject", $rsa,
            [System.Security.Cryptography.HashAlgorithmName]::SHA256,
            [System.Security.Cryptography.RSASignaturePadding]::Pkcs1)
        $notBefore = [System.DateTimeOffset]::UtcNow.AddMinutes(-5)
        $notAfter = [System.DateTimeOffset]::UtcNow.AddMonths($Months)
        $cert = $req.CreateSelfSigned($notBefore, $notAfter)
        try {
            $pfx = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pfx)
            $cer = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
            return [pscustomobject]@{
                PfxBase64 = [Convert]::ToBase64String($pfx)
                CerBase64 = [Convert]::ToBase64String($cer)
            }
        }
        finally { $cert.Dispose() }
    }
    finally { $rsa.Dispose() }
}

function Set-KvSecret {
    param([string] $VaultName, [string] $Name, [string] $Value, [string] $Subscription)
    $tmp = (New-TemporaryFile).FullName
    try {
        [System.IO.File]::WriteAllText($tmp, $Value, (New-Object System.Text.UTF8Encoding($false)))
        for ($i = 1; $i -le 12; $i++) {
            Invoke-Az @('keyvault', 'secret', 'set', '--vault-name', $VaultName, '--name', $Name,
                '--file', $tmp, '--subscription', $Subscription, '--only-show-errors') -AllowFailure | Out-Null
            if ($LASTEXITCODE -eq 0) { return }
            Start-Sleep -Seconds 10
        }
        throw "Failed to write secret '$Name' after retries (Key Vault RBAC not ready?)."
    }
    finally { Remove-Item $tmp -ErrorAction SilentlyContinue }
}

# ==================================================================================================
# Permission sets (from the prerequisite doc — https://learn.proventeq.com/.../entra-app-registration)
# ==================================================================================================
$PermissionSets = @{
    ReadOnly  = @{
        GraphApp   = @('AuditLog.Read.All', 'ChannelMessage.Read.All', 'Chat.Read.All', 'Directory.Read.All',
            'Group.Read.All', 'Mail.Read', 'Organization.Read.All', 'Reports.Read.All', 'SensitivityLabels.Read.All',
            'Sites.FullControl.All', 'Sites.Read.All', 'User.Read.All')
        GraphDeleg = @('openid', 'profile', 'offline_access')
        SpoApp     = @('Sites.Read.All', 'User.Read.All')
    }
    ReadWrite = @{
        GraphApp   = @('AuditLog.Read.All', 'ChannelMessage.Read.All', 'Chat.Read.All', 'Directory.ReadWrite.All',
            'Group.Read.All', 'Group.ReadWrite.All',
            'InformationProtectionPolicy.Read.All', 'Mail.Read', 'Mail.ReadBasic.All',
            'Organization.Read.All', 'RecordsManagement.Read.All', 'RecordsManagement.ReadWrite.All',
            'Reports.Read.All', 'SensitivityLabels.Read.All', 'Sites.Archive.All', 'Sites.FullControl.All',
            'Sites.Manage.All', 'Sites.Read.All', 'Sites.ReadWrite.All', 'Team.ReadBasic.All',
            'User.Read.All', 'User.ReadBasic.All', 'User.ReadWrite.All')
        GraphDeleg = @('openid', 'profile', 'offline_access', 'User.Read')
        SpoApp     = @('Sites.FullControl.All', 'User.ReadWrite.All')
    }
}

# ==================================================================================================
# RUN
# ==================================================================================================
Write-Log -Level INFO -Message '=== Proventeq365 prerequisite provisioner ==='
Write-Log -Level INFO -Message "Log file: $script:LogFile"
Write-Log -Level INFO -Message "ApplicationName='$ApplicationName'  PermissionMode=$PermissionMode  ConfigureAiAgent=$([bool]$ConfigureAiAgent)  CrossTenant=$($script:IsCrossTenant)"
if ($script:IsCrossTenant) {
    Write-Log -Level WARN -Message "Cross-tenant mode: apps -> $AppTenantId, infra (RG/KV) -> $CustomerTenantId. You will sign in twice."
}

# Values carried from Phase A (app tenant) to Phase B (infra tenant).
$clientSecretValue = $null
$pfxBase64 = $null
$aiSecretValue = $null
$aiAppId = ''
$aiScope = ''

# ==================================================================================================
# PHASE A — app tenant
# ==================================================================================================
$s = Start-Step 'SignIn-AppTenant'
Connect-AzTenant -TenantId $AppTenantId -Label 'app'
$meApp = Invoke-Az @('ad', 'signed-in-user', 'show', '--only-show-errors')
Write-Log -Level SUCCESS -Step $s -Message "Signed in to app tenant $AppTenantId as $($meApp.userPrincipalName)."
Set-StepStatus 'SignIn-AppTenant' 'OK' $meApp.userPrincipalName

# ---- Role pre-flight (consent is granted in the app tenant) -------------------------------------
$s = Start-Step 'RoleCheck'
$dirRoles = Invoke-Az @('rest', '--url',
    'https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.directoryRole?$select=displayName',
    '--only-show-errors') -AllowFailure
$roleNames = @()
if ($dirRoles -and ($dirRoles.PSObject.Properties.Name -contains 'value') -and $dirRoles.value) { $roleNames = @($dirRoles.value.displayName) }
$hasConsent = ($roleNames -contains 'Global Administrator') -or ($roleNames -contains 'Privileged Role Administrator')
$hasAppMgmt = $hasConsent -or ($roleNames -contains 'Cloud Application Administrator') -or ($roleNames -contains 'Application Administrator')
if ($GrantAdminConsent -and -not $hasConsent) {
    throw "-GrantAdminConsent requires Global Administrator or Privileged Role Administrator in the app tenant ($AppTenantId). You hold: $($roleNames -join ', ')."
}
if (-not $hasAppMgmt) { Write-Log -Level WARN -Step $s -Message "You may lack an app-management role in $AppTenantId; app creation could fail. Roles: $($roleNames -join ', ')." }
Set-StepStatus 'RoleCheck' 'OK' "consent=$hasConsent appMgmt=$hasAppMgmt"

# Resolve the Graph + SPO service principals in the app tenant.
$graphSp = Invoke-Az @('ad', 'sp', 'show', '--id', $GraphResourceId, '--only-show-errors')
$spoSp = Invoke-Az @('ad', 'sp', 'show', '--id', $SpoResourceId, '--only-show-errors')

# ---- Derive tenantName (from the app tenant's *.onmicrosoft.com domain) --------------------------
$s = Start-Step 'TenantName'
$org = Invoke-Az @('rest', '--url', 'https://graph.microsoft.com/v1.0/organization?$select=verifiedDomains', '--only-show-errors') -AllowFailure
$tenantName = ''
if ($org -and ($org.PSObject.Properties.Name -contains 'value') -and $org.value) {
    $initial = $org.value[0].verifiedDomains | Where-Object { $_.isInitial -eq $true } | Select-Object -First 1
    if ($initial) { $tenantName = ($initial.name -replace '\.onmicrosoft\.com$', '') }
}
if (-not $tenantName) { Write-Log -Level WARN -Step $s -Message 'Could not derive tenantName; leaving the tag empty.' }
else { Write-Log -Level SUCCESS -Step $s -Message "Derived tenantName='$tenantName'." }
Set-StepStatus 'TenantName' ($(if ($tenantName) { 'OK' } else { 'Empty' })) $tenantName

# Scope the SPO certificate's secret name to the app tenant so multiple app registrations can share
# one bootstrap vault without overwriting each other's certificate.
$spoCertSecretName = if ($tenantName) { "$(Get-Slug $tenantName)" } else { 'spo-certificate' }

# ---- Resolve the subscription + deterministic Key Vault name, and check what it already holds -----
# Needed before minting the client secret / SPO certificate / AI agent secret, so the decision is made
# from the VAULT (what the deployment actually reads via getSecret()) rather than from the app
# registration, which can exist already (e.g. re-run, or a secret lost after a Phase B failure) while
# the vault is empty. Done here, still signed in to the infra tenant — switching to the app tenant
# first and then querying the vault by subscription id does not reliably work across tenants.
$s = Start-Step 'ResolveVaultTarget'
Connect-AzTenant -TenantId $CustomerTenantId -Label 'infra'
$subsEarly = @(Invoke-Az @('account', 'list', '--query', "[?tenantId=='$CustomerTenantId']", '--only-show-errors'))
if ($subsEarly.Count -eq 0) { throw "No subscriptions visible in tenant $CustomerTenantId." }
if ($SubscriptionId) {
    if (-not ($subsEarly.id -contains $SubscriptionId)) { throw "Subscription '$SubscriptionId' is not in tenant $CustomerTenantId (or not visible to you)." }
}
elseif ($subsEarly.Count -eq 1) {
    $SubscriptionId = $subsEarly[0].id
    Write-Log -Level INFO -Step $s -Message "One subscription found; using '$($subsEarly[0].name)' ($SubscriptionId)."
}
else {
    if ($NonInteractive) { throw 'Multiple subscriptions found and -SubscriptionId was not supplied (NonInteractive).' }
    Write-Host 'Select a subscription:' -ForegroundColor Cyan
    for ($i = 0; $i -lt $subsEarly.Count; $i++) { Write-Host ("  [{0}] {1}  ({2})" -f $i, $subsEarly[$i].name, $subsEarly[$i].id) }
    $SubscriptionId = $subsEarly[[int](Read-Host 'Enter number')].id
}
$appSlug = Get-Slug $ApplicationName
if (-not $KeyVaultName) {
    # deterministic: same app + subscription => same vault on every run (Key Vault names are global)
    # trim the slug, never the hash: the hash is the only thing separating two subscriptions with the same app name
    $hash    = (Get-StableHash "$SubscriptionId/$ApplicationName").Substring(0, 4)
    $maxSlug = 24 - 'kv-p365boot-'.Length - 1 - $hash.Length   # 7
    $slug    = $appSlug.Substring(0, [Math]::Min($appSlug.Length, $maxSlug)).TrimEnd('-')
    $KeyVaultName = "kv-p365boot-$slug-$hash"                   # always <= 24, hash always intact
}
# Check the vault itself first. On a first run it doesn't exist yet, so a secret lookup would fail with
# a DNS/connection error (not 'SecretNotFound'). No vault => nothing to reuse => mint everything.
$vaultIdEarly = Invoke-AzTsv @('keyvault', 'show', '-n', $KeyVaultName, '--subscription', $SubscriptionId, '--query', 'id', '-o', 'tsv', '--only-show-errors') -AllowFailure
if (-not $vaultIdEarly) {
    Write-Log -Level INFO -Step $s -Message "Vault '$KeyVaultName' does not exist yet; all credentials will be created."
    $needsClientSecret = $true
    $needsSpoCert      = $true
    $needsAiSecret     = [bool]$ConfigureAiAgent
}
else {
    $needsClientSecret = (-not (Test-KvSecretExists -VaultName $KeyVaultName -Name 'client-secret' -Subscription $SubscriptionId)) -or $ForceNewCert
    $needsSpoCert      = (-not (Test-KvSecretExists -VaultName $KeyVaultName -Name $spoCertSecretName -Subscription $SubscriptionId)) -or $ForceNewCert
    $needsAiSecret     = $ConfigureAiAgent -and ((-not (Test-KvSecretExists -VaultName $KeyVaultName -Name 'aiagent-bot-client-secret' -Subscription $SubscriptionId)) -or $ForceNewCert)
}
Write-Log -Level SUCCESS -Step $s -Message "Target vault '$KeyVaultName' in subscription $SubscriptionId. Needs: client-secret=$needsClientSecret, spo-cert=$needsSpoCert, ai-secret=$needsAiSecret."
Set-StepStatus 'ResolveVaultTarget' 'OK' $KeyVaultName
if ($script:IsCrossTenant) { Connect-AzTenant -TenantId $AppTenantId -Label 'app' }

# ---- Main app registration ----------------------------------------------------------------------
$s = Start-Step 'MainApp'
$signInAudience = if ($MultiTenant) { 'AzureADMultipleOrgs' } else { 'AzureADMyOrg' }
# Exact match only — '--display-name' filters with startswith(), which also matches the AI agent app
# this same script creates ("$ApplicationName AI Agent") and any other app sharing the prefix.
$existingApps = @(Invoke-Az @('ad', 'app', 'list', '--filter', "displayName eq '$(Get-ODataLiteral $ApplicationName)'", '--only-show-errors'))
if ($existingApps.Count -gt 1) { throw "More than one app named '$ApplicationName' in tenant $AppTenantId; pass the appId explicitly or rename the duplicate." }
if ($existingApps.Count -gt 0) {
    $app = $existingApps[0]
    Write-Log -Level INFO -Step $s -Message "Reusing app '$ApplicationName' (appId $($app.appId))."
    Set-StepStatus 'MainApp' 'Reused' $app.appId
}
else {
    $app = Invoke-Az @('ad', 'app', 'create', '--display-name', $ApplicationName, '--sign-in-audience', $signInAudience, '--only-show-errors')
    Write-Log -Level SUCCESS -Step $s -Message "Created app '$ApplicationName' (appId $($app.appId))."
    Set-StepStatus 'MainApp' 'Created' $app.appId
}
$appId = $app.appId
$appObjId = $app.id
$appIdUri = "api://$appId"
$scope = "$appIdUri/access_as_user"

# ---- Expose API -----------------------------------------------------------------------------------
# PATCHing 'api'/'identifierUris'/'spa' replaces those complex properties wholesale, so re-fetch the
# current app and merge: keep every existing scope, pre-authorized app, identifier URI and redirect
# URI, and only add/update what this run owns (the access_as_user scope, $appIdUri, $FrontendUrl).
$s = Start-Step 'ExposeApi'
$currentForApi = Invoke-Az @('ad', 'app', 'show', '--id', $appId, '--only-show-errors')
$currentApiObj = if (($currentForApi.PSObject.Properties.Name -contains 'api') -and $currentForApi.api) { $currentForApi.api } else { $null }
$currentScopesForExpose = @(if ($currentApiObj -and ($currentApiObj.PSObject.Properties.Name -contains 'oauth2PermissionScopes') -and $currentApiObj.oauth2PermissionScopes) { @($currentApiObj.oauth2PermissionScopes) } else { @() })
$currentPreAuthForExpose = @(if ($currentApiObj -and ($currentApiObj.PSObject.Properties.Name -contains 'preAuthorizedApplications') -and $currentApiObj.preAuthorizedApplications) { @($currentApiObj.preAuthorizedApplications) } else { @() })
$existingScope = $currentScopesForExpose | Where-Object { $_.value -eq 'access_as_user' } | Select-Object -First 1
$scopeId = if ($existingScope) { $existingScope.id } else { [guid]::NewGuid().ToString() }
$accessAsUserScope = @{
    id                      = $scopeId
    value                   = 'access_as_user'
    type                    = 'User'
    isEnabled               = $true
    adminConsentDisplayName = 'Access Proventeq365 as the signed-in user'
    adminConsentDescription = 'Allows the Proventeq365 SPA to call the Proventeq365 API on behalf of the signed-in user.'
    userConsentDisplayName  = 'Access Proventeq365 on your behalf'
    userConsentDescription  = 'Allows Proventeq365 to call its API as you.'
}
$mergedScopes = @($currentScopesForExpose | Where-Object { $_.value -ne 'access_as_user' }) + @($accessAsUserScope)
$currentIdentifierUris = @(if (($currentForApi.PSObject.Properties.Name -contains 'identifierUris') -and $currentForApi.identifierUris) { @($currentForApi.identifierUris) } else { @() })
$mergedIdentifierUris = @(if ($currentIdentifierUris -contains $appIdUri) { $currentIdentifierUris } else { @($currentIdentifierUris) + @($appIdUri) })
$apiBody = @{
    identifierUris = $mergedIdentifierUris
    api            = @{
        requestedAccessTokenVersion = 2
        oauth2PermissionScopes      = $mergedScopes
        preAuthorizedApplications   = $currentPreAuthForExpose
    }
}
if ($FrontendUrl) {
    $currentSpaRedirects = @(if (($currentForApi.PSObject.Properties.Name -contains 'spa') -and $currentForApi.spa -and
        ($currentForApi.spa.PSObject.Properties.Name -contains 'redirectUris') -and $currentForApi.spa.redirectUris) { @($currentForApi.spa.redirectUris) } else { @() })
    $mergedSpaRedirects = @(if ($currentSpaRedirects -contains $FrontendUrl) { $currentSpaRedirects } else { @($currentSpaRedirects) + @($FrontendUrl) })
    $apiBody['spa'] = @{ redirectUris = $mergedSpaRedirects }
}
Update-Application -ObjectId $appObjId -Body $apiBody
Write-Log -Level SUCCESS -Step $s -Message "Application ID URI $appIdUri, scope access_as_user."
Set-StepStatus 'ExposeApi' 'OK' $appIdUri

# ---- Permissions --------------------------------------------------------------------------------
# Merge rather than replace: keep every permission (and every other resourceAppId) the app already
# has, add only what this run's -PermissionMode set requires.
$s = Start-Step 'Permissions'
$set = $PermissionSets[$PermissionMode]
$graphAccess = @()
$graphAccess += @($set.GraphApp | ForEach-Object { @{ id = (Get-AppRoleId $graphSp $_); type = 'Role' } })
$graphAccess += @($set.GraphDeleg | ForEach-Object { @{ id = (Get-ScopeId $graphSp $_); type = 'Scope' } })
$spoAccess = @($set.SpoApp | ForEach-Object { @{ id = (Get-AppRoleId $spoSp $_); type = 'Role' } })
$currentForPermissions = Invoke-Az @('ad', 'app', 'show', '--id', $appId, '--only-show-errors')
$currentRRA = @(if (($currentForPermissions.PSObject.Properties.Name -contains 'requiredResourceAccess') -and $currentForPermissions.requiredResourceAccess) { @($currentForPermissions.requiredResourceAccess) } else { @() })
$mergedGraphAccess = Merge-ResourceAccess -CurrentRequiredResourceAccess $currentRRA -ResourceAppId $GraphResourceId -Wanted $graphAccess
$mergedSpoAccess = Merge-ResourceAccess -CurrentRequiredResourceAccess $currentRRA -ResourceAppId $SpoResourceId -Wanted $spoAccess
$otherResourceEntries = @($currentRRA | Where-Object { $_.resourceAppId -ne $GraphResourceId -and $_.resourceAppId -ne $SpoResourceId })
# @() on every collection guarantees Graph receives JSON arrays, even when a collection has 1 item.
$finalRRA = @()
foreach ($o in @($otherResourceEntries)) {
    $finalRRA += @{ resourceAppId = [string]$o.resourceAppId; resourceAccess = @(@($o.resourceAccess) | ForEach-Object { @{ id = [string]$_.id; type = [string]$_.type } }) }
}
$finalRRA += @{ resourceAppId = $GraphResourceId; resourceAccess = @($mergedGraphAccess) }
$finalRRA += @{ resourceAppId = $SpoResourceId;   resourceAccess = @($mergedSpoAccess) }
Update-Application -ObjectId $appObjId -Body @{ requiredResourceAccess = @($finalRRA) }
Write-Log -Level SUCCESS -Step $s -Message "Applied $PermissionMode permissions ($($set.GraphApp.Count) Graph app + $($set.GraphDeleg.Count) delegated + $($set.SpoApp.Count) SPO)."
Set-StepStatus 'Permissions' 'OK' $PermissionMode
Invoke-Az @('ad', 'sp', 'create', '--id', $appId, '--only-show-errors') -AllowFailure | Out-Null

# ---- Admin consent ------------------------------------------------------------------------------
$s = Start-Step 'AdminConsent'
if ($GrantAdminConsent) {
    $consented = $false
    for ($i = 1; $i -le 6 -and -not $consented; $i++) {
        Invoke-Az @('ad', 'app', 'permission', 'admin-consent', '--id', $appId, '--only-show-errors') -AllowFailure | Out-Null
        if ($LASTEXITCODE -eq 0) { $consented = $true; break }
        Write-Log -Level INFO -Step $s -Message "Consent not ready (attempt $i/6); waiting 10s..."
        Start-Sleep -Seconds 10
    }
    if ($consented) { Write-Log -Level SUCCESS -Step $s -Message 'Admin consent granted.'; Set-StepStatus 'AdminConsent' 'Granted' '' }
    else { Write-Log -Level WARN -Step $s -Message 'Admin consent did not complete; grant it from the portal.'; Set-StepStatus 'AdminConsent' 'Deferred' 'portal' }
}
else {
    Write-Log -Level WARN -Step $s -Message 'Skipped (no -GrantAdminConsent). An admin must consent before the product can run.'
    Set-StepStatus 'AdminConsent' 'Skipped' ''
}

# ---- Client secret (value captured for Phase B; mint/reuse decided earlier from the vault) -------
$s = Start-Step 'ClientSecret'
if (-not $needsClientSecret) {
    Write-Log -Level INFO -Step $s -Message "Vault '$KeyVaultName' already holds 'client-secret'. (Use -ForceNewCert to rotate.)"
    Set-StepStatus 'ClientSecret' 'Existing' ''
}
else {
    $clientSecretValue = Invoke-AzTsv @('ad', 'app', 'credential', 'reset', '--id', $appId, '--display-name', 'Proventeq365 deployment',
        '--years', '2', '--append', '--query', 'password', '-o', 'tsv', '--only-show-errors')
    Write-Log -Level SUCCESS -Step $s -Message 'Client secret created (stored in Phase B).'
    Set-StepStatus 'ClientSecret' 'Created' ''
}

# ---- SPO certificate (generated locally; public key appended to the app's existing certificates) --
$s = Start-Step 'SpoCertificate'
if (-not $needsSpoCert) {
    Write-Log -Level INFO -Step $s -Message "Vault '$KeyVaultName' already holds '$spoCertSecretName'. (Use -ForceNewCert to rotate.)"
    Set-StepStatus 'SpoCertificate' 'Existing' ''
}
else {
    $cert = New-SelfSignedCertLocal -Subject "$ApplicationName SPO" -Months 24
    $pfxBase64 = $cert.PfxBase64
    $currentForCert = Invoke-Az @('ad', 'app', 'show', '--id', $appId, '--only-show-errors')
    $currentKeyCreds = @(if (($currentForCert.PSObject.Properties.Name -contains 'keyCredentials') -and $currentForCert.keyCredentials) { @($currentForCert.keyCredentials) } else { @() })
    Update-Application -ObjectId $appObjId -Body @{
        keyCredentials = @($currentKeyCreds) + @(@{ type = 'AsymmetricX509Cert'; usage = 'Verify'; key = $cert.CerBase64; displayName = "CN=$ApplicationName SPO" })
    }
    Write-Log -Level SUCCESS -Step $s -Message 'SPO certificate generated and public key appended to the app (PFX stored in Phase B).'
    Set-StepStatus 'SpoCertificate' 'Created' ''
}

# ---- AI agent app (optional) --------------------------------------------------------------------
$s = Start-Step 'AiAgent'
if ($ConfigureAiAgent) {
    $aiName = "$ApplicationName AI Agent"
    $existingAi = @(Invoke-Az @('ad', 'app', 'list', '--filter', "displayName eq '$(Get-ODataLiteral $aiName)'", '--only-show-errors'))
    if ($existingAi.Count -gt 1) { throw "More than one app named '$aiName' in tenant $AppTenantId; pass the appId explicitly or rename the duplicate." }
    if ($existingAi.Count -gt 0) { $aiApp = $existingAi[0] } else {
        $aiApp = Invoke-Az @('ad', 'app', 'create', '--display-name', $aiName, '--sign-in-audience', $signInAudience, '--only-show-errors')
    }
    $aiAppId = $aiApp.appId
    $aiScope = "api://$aiAppId"
    $aiScopeId = [guid]::NewGuid().ToString()
    if (($aiApp.PSObject.Properties.Name -contains 'api') -and $aiApp.api -and
        ($aiApp.api.PSObject.Properties.Name -contains 'oauth2PermissionScopes') -and $aiApp.api.oauth2PermissionScopes) {
        $ex = $aiApp.api.oauth2PermissionScopes | Where-Object { $_.value -eq 'access_as_user' } | Select-Object -First 1
        if ($ex) { $aiScopeId = $ex.id }
    }
    Update-Application -ObjectId $aiApp.id -Body @{
        identifierUris = @($aiScope)
        web            = @{ redirectUris = @('https://token.botframework.com/.auth/web/redirect') }
        publicClient   = @{ redirectUris = @('https://login.microsoftonline.com/common/oauth2/nativeclient') }
        api            = @{ requestedAccessTokenVersion = 2; oauth2PermissionScopes = @(@{
                    id = $aiScopeId; value = 'access_as_user'; type = 'User'; isEnabled = $true
                    adminConsentDisplayName = 'Access the Proventeq365 AI agent'; adminConsentDescription = 'Access the Proventeq365 AI agent.'
                    userConsentDisplayName = 'Access the Proventeq365 AI agent'; userConsentDescription = 'Access the Proventeq365 AI agent.'
                }) }
    }
    if (-not $needsAiSecret) {
        Write-Log -Level INFO -Step $s -Message 'AI agent secret already in the vault; assuming it matches this app. (Use -ForceNewCert to rotate.)'
    }
    else {
        $aiSecretValue = Invoke-AzTsv @('ad', 'app', 'credential', 'reset', '--id', $aiAppId, '--display-name', 'Proventeq365 AI agent',
            '--years', '2', '--append', '--query', 'password', '-o', 'tsv', '--only-show-errors')
    }

    # Pre-authorize the AI agent app on the main app's access_as_user scope (Expose an API > Authorized
    # client applications), so users aren't prompted to consent twice. Re-fetch the main app fresh —
    # PATCHing 'api' replaces the whole complex property, and ExposeApi's merge ran before this scope existed.
    $currentApp = Invoke-Az @('ad', 'app', 'show', '--id', $appId, '--only-show-errors')
    $currentScopes = @(if (($currentApp.PSObject.Properties.Name -contains 'api') -and $currentApp.api -and
        ($currentApp.api.PSObject.Properties.Name -contains 'oauth2PermissionScopes')) { $currentApp.api.oauth2PermissionScopes } else { @() })
    $existingPreAuth = @()
    if (($currentApp.api.PSObject.Properties.Name -contains 'preAuthorizedApplications') -and $currentApp.api.preAuthorizedApplications) {
        $existingPreAuth = @($currentApp.api.preAuthorizedApplications | Where-Object { $_.appId -ne $aiAppId })
    }
    $preAuth = @($existingPreAuth) + @(@{ appId = $aiAppId; delegatedPermissionIds = @($scopeId) })
    Update-Application -ObjectId $appObjId -Body @{
        api = @{ oauth2PermissionScopes = $currentScopes; preAuthorizedApplications = $preAuth }
    }
    Write-Log -Level SUCCESS -Step $s -Message "AI agent app '$aiName' configured (appId $aiAppId) and pre-authorized on the main app's access_as_user scope."
    Set-StepStatus 'AiAgent' 'Configured' $aiAppId
}
else {
    Write-Log -Level INFO -Step $s -Message 'Skipped (no -ConfigureAiAgent).'
    Set-StepStatus 'AiAgent' 'Skipped' ''
}

# ==================================================================================================
# PHASE B — infra tenant (subscription + resource group + Key Vault)
# ==================================================================================================
# $SubscriptionId and $KeyVaultName were already resolved in 'ResolveVaultTarget' — reused as-is here,
# never re-selected, so Phase B always targets the exact vault the mint/reuse decisions were made against.
$s = Start-Step 'Subscription'
if ($script:IsCrossTenant) { Connect-AzTenant -TenantId $CustomerTenantId -Label 'infra' }
$meInfra = Invoke-Az @('ad', 'signed-in-user', 'show', '--only-show-errors')
$subs = @(Invoke-Az @('account', 'list', '--query', "[?tenantId=='$CustomerTenantId']", '--only-show-errors'))
$subName = ($subs | Where-Object { $_.id -eq $SubscriptionId }).name
if (-not $subName) { throw "Subscription '$SubscriptionId' (resolved earlier in ResolveVaultTarget) is no longer visible in tenant $CustomerTenantId." }
Invoke-Az @('account', 'set', '--subscription', $SubscriptionId) | Out-Null
$subRoles = @(Invoke-Az @('role', 'assignment', 'list', '--assignee', $meInfra.id, '--scope', "/subscriptions/$SubscriptionId",
        '--include-inherited', '--query', '[].roleDefinitionName', '--only-show-errors') -AllowFailure)
if (-not (($subRoles -contains 'Owner') -or ($subRoles -contains 'Contributor'))) {
    Write-Log -Level WARN -Step $s -Message 'You may lack Owner/Contributor on the subscription; RG/KV creation and role assignment could fail.'
}
$kvProv = Invoke-AzTsv @('provider', 'show', '-n', 'Microsoft.KeyVault', '--query', 'registrationState', '-o', 'tsv', '--subscription', $SubscriptionId) -AllowFailure
if ($kvProv -ne 'Registered') { Invoke-Az @('provider', 'register', '-n', 'Microsoft.KeyVault', '--subscription', $SubscriptionId, '--wait') | Out-Null }
Write-Log -Level SUCCESS -Step $s -Message "Using subscription '$subName' ($SubscriptionId)."
Set-StepStatus 'Subscription' 'OK' $subName

# ---- Resource providers -------------------------------------------------------------------------
# Register everything the MAIN deployment needs here, under the privileged prereq identity, so the
# later Marketplace / pipeline deploy identity never has to. Microsoft.CognitiveServices is included
# only when -DeployFoundry is set, because many subscriptions deny it by policy.
$s = Start-Step 'ResourceProviders'
$requiredProviders = @(
    'Microsoft.Web', 'Microsoft.KeyVault', 'Microsoft.Sql', 'Microsoft.App', 'Microsoft.AppConfiguration',
    'Microsoft.Storage', 'Microsoft.ServiceBus', 'Microsoft.ManagedIdentity', 'Microsoft.ContainerRegistry',
    'Microsoft.ContainerInstance', 'Microsoft.Network', 'Microsoft.AlertsManagement',
    'Microsoft.OperationalInsights', 'Microsoft.Insights', 'Microsoft.Authorization', 'Microsoft.Resources',
    'Microsoft.Cdn', 'Microsoft.ContainerService'
)
if ($DeployFoundry -or $ConfigureAiAgent) { $requiredProviders = @('Microsoft.CognitiveServices') + $requiredProviders }
foreach ($provider in $requiredProviders) {
    $provState = Invoke-AzTsv @('provider', 'show', '-n', $provider, '--query', 'registrationState', '-o', 'tsv', '--subscription', $SubscriptionId) -AllowFailure
    if ($provState -eq 'Registered') { Write-Log -Level INFO -Step $s -Message "Provider $provider already registered."; continue }
    Write-Log -Level INFO -Step $s -Message "Registering $provider ..."
    Invoke-Az @('provider', 'register', '-n', $provider, '--subscription', $SubscriptionId, '--wait') -AllowFailure | Out-Null
    $provState = Invoke-AzTsv @('provider', 'show', '-n', $provider, '--query', 'registrationState', '-o', 'tsv', '--subscription', $SubscriptionId) -AllowFailure
    if ($provState -ne 'Registered') { throw "Provider '$provider' did not reach 'Registered' state (current: '$provState'). Register it manually and re-run." }
    Write-Log -Level SUCCESS -Step $s -Message "Provider $provider registered."
}
Set-StepStatus 'ResourceProviders' 'OK' ("{0} providers" -f $requiredProviders.Count)

# ---- Resource group -----------------------------------------------------------------------------
$s = Start-Step 'ResourceGroup'
$appSlug = Get-Slug $ApplicationName
if (-not $ResourceGroupName) { $ResourceGroupName = "rg-proventeq365-$appSlug" }
$rgExists = (Invoke-AzTsv @('group', 'exists', '-n', $ResourceGroupName, '--subscription', $SubscriptionId)) -eq 'true'
if ($rgExists) {
    $rg = Invoke-Az @('group', 'show', '-n', $ResourceGroupName, '--subscription', $SubscriptionId)
    if (($rg.PSObject.Properties.Name -contains 'managedBy') -and $rg.managedBy) {
        throw "Resource group '$ResourceGroupName' is a managed resource group (managedBy set). Choose a normal resource group."
    }
    if ($rg.location -ne $Location) { Write-Log -Level WARN -Step $s -Message "RG '$ResourceGroupName' is in $($rg.location); keeping it. Key Vault will be created in $Location." }
    Write-Log -Level INFO -Step $s -Message "Reusing resource group '$ResourceGroupName'."
    Set-StepStatus 'ResourceGroup' 'Reused' $ResourceGroupName
}
else {
    $today = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd')
    Invoke-Az @('group', 'create', '-n', $ResourceGroupName, '-l', $Location, '--subscription', $SubscriptionId,
        '--tags', 'application=Proventeq365', 'purpose=bootstrap', 'createdBy=p365-prereq-script', "createdOn=$today") | Out-Null
    Write-Log -Level SUCCESS -Step $s -Message "Created resource group '$ResourceGroupName' in $Location."
    Set-StepStatus 'ResourceGroup' 'Created' $ResourceGroupName
}

# ---- Static Web App region validation -----------------------------------------------------------
# Advertised support (resourceTypes locations) does NOT guarantee subscription eligibility: some
# subscriptions deny a region by Azure Policy (RequestDisallowedByAzure). Validate in two steps,
# creating NOTHING: (1) confirm the region is advertised for Microsoft.Web/staticSites; (2) run a
# non-destructive what-if on a throwaway Static Web App definition to surface a policy denial early.
$s = Start-Step 'StaticWebAppRegion'
$swaNorm = ($StaticWebAppRegion -replace '\s', '').ToLower()
$swaLocationsRaw = Invoke-AzTsv @('provider', 'show', '-n', 'Microsoft.Web',
    '--query', "resourceTypes[?resourceType=='staticSites'].locations | [0]", '-o', 'json', '--subscription', $SubscriptionId) -AllowFailure
$swaLocationList = @()
if ($swaLocationsRaw) { try { $swaLocationList = @(($swaLocationsRaw | ConvertFrom-Json) | ForEach-Object { ($_ -replace '\s', '').ToLower() }) } catch { } }
if ($swaLocationList.Count -gt 0 -and ($swaLocationList -notcontains $swaNorm)) {
    Write-Log -Level ERROR -Step $s -Message "Static Web App region '$StaticWebAppRegion' is not advertised for Microsoft.Web/staticSites on this subscription."
    Write-Host 'Advertised Static Web App regions for this subscription:' -ForegroundColor Yellow
    ($swaLocationsRaw | ConvertFrom-Json) | ForEach-Object { Write-Host "  - $_" }
    throw "Static Web App region '$StaticWebAppRegion' is not supported. Re-run with -StaticWebAppRegion set to one of the advertised regions above, or request region access from Microsoft."
}
# Non-destructive policy/eligibility probe (what-if creates nothing; temp template is always cleaned up).
$swaProbeName = "stapp-probe-$((New-Guid).ToString('N').Substring(0,8))"
$swaProbeFile = Join-Path ([System.IO.Path]::GetTempPath()) "swa-probe-$swaProbeName.json"
try {
    (@{
            '$schema'      = 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
            contentVersion = '1.0.0.0'
            resources      = @(@{
                    type       = 'Microsoft.Web/staticSites'
                    apiVersion = '2023-12-01'
                    name       = $swaProbeName
                    location   = $StaticWebAppRegion
                    sku        = @{ name = 'Free'; tier = 'Free' }
                    properties = @{}
                })
        } | ConvertTo-Json -Depth 10) | Set-Content -Path $swaProbeFile -Encoding UTF8
    $whatIfOut = (& az deployment group what-if --resource-group $ResourceGroupName --template-file $swaProbeFile `
            --subscription $SubscriptionId --no-pretty-print --only-show-errors 2>&1 | Out-String)
    if ($LASTEXITCODE -ne 0 -and ($whatIfOut -match 'RequestDisallowedByAzure|Disallowed|LocationNotAvailable|NotAvailableForSubscription|not available in location|[Pp]olicy')) {
        Write-Log -Level ERROR -Step $s -Message "Static Web App region '$StaticWebAppRegion' is advertised but blocked for this subscription."
        Write-Host 'Exact Azure response:' -ForegroundColor Yellow
        Write-Host $whatIfOut
        Write-Host 'Advertised Static Web App regions for this subscription:' -ForegroundColor Yellow
        if ($swaLocationsRaw) { ($swaLocationsRaw | ConvertFrom-Json) | ForEach-Object { Write-Host "  - $_" } }
        throw "Static Web App region '$StaticWebAppRegion' cannot be used on this subscription (advertised support does not guarantee eligibility). Choose another region or request region access from Microsoft, then re-run."
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Log -Level WARN -Step $s -Message "what-if probe did not complete cleanly (non-policy error). Proceeding; the main deployment will surface any hard failure. Detail: $whatIfOut"
        Set-StepStatus 'StaticWebAppRegion' 'Warn' $StaticWebAppRegion
    }
    else {
        Write-Log -Level SUCCESS -Step $s -Message "Static Web App region '$StaticWebAppRegion' is supported and permitted for this subscription."
        Set-StepStatus 'StaticWebAppRegion' 'OK' $StaticWebAppRegion
    }
}
finally {
    if (Test-Path $swaProbeFile) { Remove-Item $swaProbeFile -Force -ErrorAction SilentlyContinue }
}

# ---- Bootstrap Key Vault ------------------------------------------------------------------------
# $KeyVaultName was already resolved in 'ResolveVaultTarget' — reused as-is, never recomputed here.
$s = Start-Step 'KeyVault'
$kvExisting = Invoke-AzTsv @('keyvault', 'show', '-n', $KeyVaultName, '--query', 'id', '-o', 'tsv', '--subscription', $SubscriptionId) -AllowFailure
if (-not $kvExisting) {
    Invoke-Az @('keyvault', 'create', '-n', $KeyVaultName, '-g', $ResourceGroupName, '-l', $Location,
        '--enable-rbac-authorization', 'true', '--enabled-for-template-deployment', 'true', '--subscription', $SubscriptionId) | Out-Null
    Write-Log -Level SUCCESS -Step $s -Message "Created Key Vault '$KeyVaultName'."
    Set-StepStatus 'KeyVault' 'Created' $KeyVaultName
}
else {
    Invoke-Az @('keyvault', 'update', '-n', $KeyVaultName, '--enabled-for-template-deployment', 'true', '--subscription', $SubscriptionId) | Out-Null
    Write-Log -Level INFO -Step $s -Message "Reusing Key Vault '$KeyVaultName'."
    Set-StepStatus 'KeyVault' 'Reused' $KeyVaultName
}
$kvId = Invoke-AzTsv @('keyvault', 'show', '-n', $KeyVaultName, '--query', 'id', '-o', 'tsv', '--subscription', $SubscriptionId)
Invoke-Az @('role', 'assignment', 'create', '--assignee-object-id', $meInfra.id, '--assignee-principal-type', 'User',
    '--role', 'Key Vault Secrets Officer', '--scope', $kvId, '--only-show-errors') -AllowFailure | Out-Null
Write-Log -Level INFO -Step $s -Message 'Waiting for Key Vault RBAC to propagate...'

# ---- Write secrets ------------------------------------------------------------------------------
$s = Start-Step 'Secrets'
if ($clientSecretValue) { Set-KvSecret -VaultName $KeyVaultName -Name 'client-secret' -Value $clientSecretValue -Subscription $SubscriptionId; $clientSecretValue = $null }
else { Write-Log -Level INFO -Step $s -Message "Leaving existing 'client-secret' in the vault." }
$acrPlain = ConvertFrom-SecureStringPlain $AcrPassword
Set-KvSecret -VaultName $KeyVaultName -Name 'acr-password' -Value $acrPlain -Subscription $SubscriptionId
$acrPlain = $null
if ($pfxBase64) { Set-KvSecret -VaultName $KeyVaultName -Name $spoCertSecretName -Value $pfxBase64 -Subscription $SubscriptionId; $pfxBase64 = $null }
else { Write-Log -Level INFO -Step $s -Message "Leaving existing '$spoCertSecretName' in the vault." }
if ($ConfigureAiAgent -and $aiSecretValue) { Set-KvSecret -VaultName $KeyVaultName -Name 'aiagent-bot-client-secret' -Value $aiSecretValue -Subscription $SubscriptionId; $aiSecretValue = $null }
Write-Log -Level SUCCESS -Step $s -Message 'Secrets written.'
Set-StepStatus 'Secrets' 'OK' ''

# ---- Key Vault tags -----------------------------------------------------------------------------
$s = Start-Step 'Tags'
if (-not $PlatformAdminObjectId) { $PlatformAdminObjectId = $meApp.id }
# `az keyvault update` has no --tags; set tags on the vault resource with `az tag create` (full replace).
#Entra ID v2.0 tokens use the API Client ID (GUID) as the 'aud' claim, not the api:// Application ID URI.
$tagArgs = @('tag', 'create', '--resource-id', $kvId, '--subscription', $SubscriptionId, '--tags',
    "clientId=$appId", "acrUsername=$AcrUsername", "audience=$appId", "scope=$scope",
    "tenantName=$tenantName", "adminObjectId=$PlatformAdminObjectId",
    "deployFoundry=$($DeployFoundry.IsPresent.ToString().ToLower())", "staticWebAppRegion=$StaticWebAppRegion")
# Cross-tenant: the deployment must authenticate against the APP tenant, not tenant().tenantId.
if ($script:IsCrossTenant) { $tagArgs += @("tenantId=$AppTenantId") }
if ($ConfigureAiAgent) { $tagArgs += @("aiAgentBotAppId=$aiAppId", "aiAgentApplicationScope=$aiScope") }
Invoke-Az $tagArgs | Out-Null
Write-Log -Level SUCCESS -Step $s -Message ('Key Vault tags set' + $(if ($script:IsCrossTenant) { " (incl. tenantId=$AppTenantId)." } else { '.' }))
Set-StepStatus 'Tags' 'OK' ''

# ---- Grant the Appliance Resource Provider + Managed Applications On Behalf Application ----------
# Two distinct first-party principals read the bootstrap KV during a Marketplace managed-app
# deployment: the ARP manages resources inside the managed resource group; the "Managed
# Applications On Behalf Application" resolves getSecret()/parameter references on the outer
# template before the managed RG exists. Both need a grant or AuthorizationFailed is thrown for
# whichever one was missed.
$s = Start-Step 'ApplianceRP'
$arpId = Invoke-AzTsv @('ad', 'sp', 'list', '--display-name', $ArpDisplayName, '--query', '[0].id', '-o', 'tsv', '--only-show-errors') -AllowFailure
if (-not $arpId) {
    Write-Log -Level WARN -Step $s -Message 'Appliance Resource Provider SP not found. Register Microsoft.Solutions and re-run, or grant it manually (needed for the Marketplace getSecret path).'
    Set-StepStatus 'ApplianceRP' 'Missing' 'register Microsoft.Solutions'
}
else {
    Invoke-Az @('role', 'assignment', 'create', '--assignee-object-id', $arpId, '--assignee-principal-type', 'ServicePrincipal',
        '--role', 'Contributor', '--scope', $kvId, '--only-show-errors') -AllowFailure | Out-Null
    Write-Log -Level SUCCESS -Step $s -Message 'Granted the Appliance Resource Provider Contributor on the vault.'
    Set-StepStatus 'ApplianceRP' 'Granted' $arpId
}
$oboId = Invoke-AzTsv @('ad', 'sp', 'show', '--id', $ManagedAppsOboAppId, '--query', 'id', '-o', 'tsv', '--only-show-errors') -AllowFailure
if (-not $oboId) {
    Write-Log -Level WARN -Step $s -Message 'Managed Applications On Behalf Application SP not found in this tenant; grant it manually once a Marketplace managed-app has been deployed/attempted (needed for the Marketplace getSecret path).'
    Set-StepStatus 'ManagedAppsObo' 'Missing' $ManagedAppsOboAppId
}
else {
    Invoke-Az @('role', 'assignment', 'create', '--assignee-object-id', $oboId, '--assignee-principal-type', 'ServicePrincipal',
        '--role', 'Contributor', '--scope', $kvId, '--only-show-errors') -AllowFailure | Out-Null
    Write-Log -Level SUCCESS -Step $s -Message 'Granted the Managed Applications On Behalf Application Contributor on the vault.'
    Set-StepStatus 'ManagedAppsObo' 'Granted' $oboId
}

# ---- Cleanup / summary --------------------------------------------------------------------------
if ($RemoveBootstrapKeyVault) {
    Invoke-Az @('keyvault', 'delete', '-n', $KeyVaultName, '--subscription', $SubscriptionId) -AllowFailure | Out-Null
    Invoke-Az @('keyvault', 'purge', '-n', $KeyVaultName, '--subscription', $SubscriptionId) -AllowFailure | Out-Null
    Write-Log -Level SUCCESS -Message "Deleted and purged '$KeyVaultName'. (Resource group '$ResourceGroupName' left intact.)"
}

Write-Host ''
Write-Host '================ SUMMARY ================' -ForegroundColor Green
$script:StatusRows | Format-Table -AutoSize | Out-String | Write-Host
Write-Host ("App tenant         : {0}" -f $AppTenantId)
Write-Host ("Infra tenant       : {0}" -f $CustomerTenantId)
Write-Host ("Subscription       : {0} ({1})" -f $subName, $SubscriptionId)
Write-Host ("Resource group     : {0}" -f $ResourceGroupName)
Write-Host ("Bootstrap Key Vault: {0}" -f $kvId)
Write-Host ("App (client) ID    : {0}" -f $appId)
Write-Host ("Audience           : {0}" -f $appId)
Write-Host ("Scope              : {0}" -f $scope)
Write-Host ("Tenant name        : {0}" -f $tenantName)
Write-Host ("SPO cert secret    : {0}" -f $spoCertSecretName)
if ($script:IsCrossTenant) { Write-Host ("tenantId tag       : {0} (app tenant — used for auth)" -f $AppTenantId) }
if ($ConfigureAiAgent) { Write-Host ("AI agent app ID    : {0}" -f $aiAppId) }
Write-Host ("Deploy Foundry     : {0} (deployFoundry tag)" -f $DeployFoundry.IsPresent)
Write-Host ("Static Web App rgn : {0} (staticWebAppRegion tag)" -f $StaticWebAppRegion)
Write-Host ''
Write-Host 'Give the Bootstrap Key Vault resource ID above to the deployment (Marketplace UI picker or the' -ForegroundColor Cyan
Write-Host 'bootstrapKeyVaultId parameter for the pipeline).' -ForegroundColor Cyan
Write-Host ("Log file: {0}" -f $script:LogFile)
Write-Log -Level SUCCESS -Message 'Done.'
