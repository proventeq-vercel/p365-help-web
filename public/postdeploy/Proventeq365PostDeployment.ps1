<#
.SYNOPSIS
    Proventeq365 post-deployment configuration — run once after a Marketplace or non-Marketplace
    deployment finishes, to wire up values that only exist after the managed resource group is live.

.DESCRIPTION
    Idempotent. Safe to re-run. Given the deployed (managed) resource group, this script:
      1. Discovers the Front Door profile in that resource group and builds the live frontend URL.
      2. Updates the main app registration's SPA redirect URI to that URL (or -CustomUrl if supplied).
      3. Imports the SPO app-only certificate from the bootstrap Key Vault into the product Key Vault
         deployed in that resource group (skipped if -BootstrapKeyVaultId is not supplied).
      4. Optionally (-ConfigureAiAgent) updates the AI agent Web App's Gov360 base URL / UI link.
      5. Optionally (-GrantNotificationMailbox) grants the daemon app Exchange Online RBAC send-as
         access to the notification mailbox.

    Every step can be skipped independently (see the -Skip* switches) so you can run just the pieces
    you need. Discovery is by resource TYPE within the resource group (Microsoft.Cdn/profiles,
    Microsoft.KeyVault/vaults, Microsoft.Web/sites matching '-aiagent-') rather than by recomputing
    the Bicep-generated name — the 'env' segment of every resource name is a one-way hash
    (uniqueString(resourceGroup().id, region)) that cannot be reproduced reliably outside Bicep.

    TWO-TENANT SUPPORT
    ------------------
    Same split as the prerequisite script: -AppTenantId is where the main app registration (and the
    AI bot app, if any) live; -CustomerTenantId is where the subscription/resource group live. Defaults
    to one tenant when -AppTenantId is omitted. You sign in to each tenant only when a step needs it.

.NOTES
    Requires: Azure CLI (az) >= 2.53, PowerShell 7+ (or Windows PowerShell 5.1 / Cloud Shell).
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string] $CustomerTenantId,

    # Tenant where the main app registration (and AI bot app) live. Defaults to CustomerTenantId.
    [string] $AppTenantId,

    [string] $SubscriptionId,

    [Parameter(Mandatory)]
    [string] $ResourceGroupName,

    [Parameter(Mandatory)]
    [string] $MainAppClientId,

    # Custom domain already mapped to the deployment. When supplied, this is used instead of the
    # Front Door hostname for the SPA redirect URI / AI agent Gov360 URLs.
    [string] $CustomUrl,

    # Resource ID of the bootstrap Key Vault (from the prerequisite script). Required for step 3.
    [string] $BootstrapKeyVaultId,

    # Name of the product Key Vault in -ResourceGroupName. Auto-detected (single KV expected) when omitted.
    [string] $ProductKeyVaultName,

    # Name of the Front Door (Microsoft.Cdn) profile in -ResourceGroupName. Auto-detected when omitted.
    [string] $FrontDoorProfileName,

    [switch] $SkipFrontendRedirect,

    [switch] $SkipSpoCertificate,

    [switch] $ConfigureAiAgent,

    # Name of the AI agent Web App. Auto-detected (name contains '-aiagent-') when omitted and -ConfigureAiAgent is set.
    [string] $AiAgentWebAppName,

    [switch] $GrantNotificationMailbox,

    # Primary SMTP address of the sender mailbox. Required with -GrantNotificationMailbox.
    [string] $NotificationSenderMailbox,

    [switch] $NonInteractive,

    [string] $LogFolder = (Join-Path $PSScriptRoot 'logs')
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if ([string]::IsNullOrWhiteSpace($AppTenantId)) { $AppTenantId = $CustomerTenantId }
$script:IsCrossTenant = $AppTenantId -ne $CustomerTenantId

if (-not (Test-Path $LogFolder)) { New-Item -ItemType Directory -Path $LogFolder -Force | Out-Null }
$script:LogFile = Join-Path $LogFolder ("postdeploy-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))

function Write-Log {
    param(
        [ValidateSet('INFO', 'WARN', 'ERROR', 'SUCCESS')]
        [string] $Level = 'INFO',
        [Parameter(Mandatory)][string] $Message
    )
    $ts = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    $line = "$ts [$Level] $Message"
    Add-Content -Path $script:LogFile -Value $line
    $colour = switch ($Level) { 'ERROR' { 'Red' } 'WARN' { 'Yellow' } 'SUCCESS' { 'Green' } default { 'Gray' } }
    Write-Host $line -ForegroundColor $colour
}

function Invoke-Az {
    param([string[]] $Arguments, [switch] $AllowFailure)
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
    $output = & az @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        if ($AllowFailure) { return $null }
        throw "az $($Arguments -join ' ') failed (exit $LASTEXITCODE): $output"
    }
    return ([string]$output).Trim()
}

function Connect-AzTenant {
    param([string] $TenantId, [string] $Label)
    $current = & az account show --query tenantId -o tsv 2>$null
    if ($LASTEXITCODE -eq 0 -and $current -eq $TenantId) {
        Write-Log -Message "Already signed in to the $Label tenant ($TenantId)."
        return
    }
    Write-Log -Message "Signing in to the $Label tenant ($TenantId)..."
    Write-Host ''
    Write-Host ">> Sign-in required for tenant $TenantId. If a device-code prompt appears below," -ForegroundColor Yellow
    Write-Host ">> open the URL shown and enter the code, then come back here." -ForegroundColor Yellow
    $loginArgs = @('login', '--tenant', $TenantId, '--allow-no-subscriptions', '--output', 'none')
    if (($env:AZUREPS_HOST_ENVIRONMENT -like 'cloud-shell*') -or [bool]$env:ACC_CLOUD) { $loginArgs += '--use-device-code' }
    & az @loginArgs                   # --output none hides the JSON; the device-code prompt (stderr) stays visible
    if ($LASTEXITCODE -ne 0) { throw "Sign-in to tenant $TenantId failed (exit $LASTEXITCODE)." }
    Write-Host ''
    Write-Log -Level SUCCESS -Message "Signed in to the $Label tenant."
}

function Write-JsonFile {
    param([string] $Path, [string] $Json)
    [System.IO.File]::WriteAllText($Path, $Json, (New-Object System.Text.UTF8Encoding($false)))
}

function Get-Slug {
    param([string] $Value)
    $s = $Value.ToLowerInvariant() -replace '[^a-z0-9]', '-' -replace '-+', '-'
    return $s.Trim('-')
}

# Finds exactly one resource of a type in the resource group, optionally filtered by a name substring.
# Prompts to disambiguate (or throws under -NonInteractive) when more than one candidate is found.
function Get-SingleResource {
    param([string] $ResourceType, [string] $NameContains, [string] $Label)
    $all = @(Invoke-Az @('resource', 'list', '-g', $ResourceGroupName, '--resource-type', $ResourceType,
            '--subscription', $SubscriptionId, '--only-show-errors'))
    if ($NameContains) { $all = @($all | Where-Object { $_.name -like "*$NameContains*" }) }
    if ($all.Count -eq 0) { return $null }
    if ($all.Count -eq 1) { return $all[0] }
    if ($NonInteractive) { throw "Multiple $Label resources found in '$ResourceGroupName' and -NonInteractive was set: $($all.name -join ', ')" }
    Write-Host "Multiple ${Label}: resources found in '$ResourceGroupName':" -ForegroundColor Cyan
    for ($i = 0; $i -lt $all.Count; $i++) { Write-Host ("  [{0}] {1}" -f $i, $all[$i].name) }
    return $all[[int](Read-Host 'Enter number')]
}

# ==================================================================================================
# RUN
# ==================================================================================================
Write-Log -Message '=== Proventeq365 post-deployment configuration ==='
Write-Log -Message "ResourceGroupName='$ResourceGroupName'  ConfigureAiAgent=$([bool]$ConfigureAiAgent)  CrossTenant=$($script:IsCrossTenant)"

# ---- Subscription ---------------------------------------------------------------------------------
Connect-AzTenant -TenantId $CustomerTenantId -Label 'infra'
$meInfra = Invoke-Az @('ad', 'signed-in-user', 'show', '--only-show-errors')
$subs = @(Invoke-Az @('account', 'list', '--query', "[?tenantId=='$CustomerTenantId']", '--only-show-errors'))
if ($subs.Count -eq 0) { throw "No subscriptions visible to $($meInfra.userPrincipalName) in tenant $CustomerTenantId." }
if ($SubscriptionId) {
    if (-not ($subs.id -contains $SubscriptionId)) { throw "Subscription '$SubscriptionId' is not in tenant $CustomerTenantId (or not visible to you)." }
}
elseif ($subs.Count -eq 1) {
    $SubscriptionId = $subs[0].id
    Write-Log -Message "One subscription found; using '$($subs[0].name)' ($SubscriptionId)."
}
else {
    if ($NonInteractive) { throw 'Multiple subscriptions found and -SubscriptionId was not supplied (NonInteractive).' }
    Write-Host 'Select a subscription:' -ForegroundColor Cyan
    for ($i = 0; $i -lt $subs.Count; $i++) { Write-Host ("  [{0}] {1}  ({2})" -f $i, $subs[$i].name, $subs[$i].id) }
    $SubscriptionId = $subs[[int](Read-Host 'Enter number')].id
}
Invoke-Az @('account', 'set', '--subscription', $SubscriptionId) | Out-Null
Write-Log -Level SUCCESS -Message "Using subscription $SubscriptionId."

Write-Log -Message "Checking resource group '$ResourceGroupName'..."
$rgExists = (Invoke-AzTsv @('group', 'exists', '-n', $ResourceGroupName, '--subscription', $SubscriptionId)) -eq 'true'
if (-not $rgExists) { throw "Resource group '$ResourceGroupName' not found in subscription $SubscriptionId." }

# ---- Build the frontend URL (Front Door hostname, or -CustomUrl) ----------------------------------
$frontendUrl = $CustomUrl
if (-not $frontendUrl) {
    Write-Log -Message 'Discovering the Front Door profile...'
    $fd = if ($FrontDoorProfileName) {
        Invoke-Az @('resource', 'show', '-g', $ResourceGroupName, '--resource-type', 'Microsoft.Cdn/profiles',
            '-n', $FrontDoorProfileName, '--subscription', $SubscriptionId, '--only-show-errors')
    }
    else {
        Get-SingleResource -ResourceType 'Microsoft.Cdn/profiles' -Label 'Front Door profile'
    }
    if (-not $fd) { throw "No Front Door (Microsoft.Cdn/profiles) resource found in '$ResourceGroupName'. Pass -CustomUrl or -FrontDoorProfileName." }

    Write-Log -Message 'Checking Azure CLI cdn extension...'
    $cdnExtension = & az extension show --name cdn --query name -o tsv 2>$null
    if (-not $cdnExtension) {
        Write-Log -Message 'Azure CLI cdn extension is not installed. Installing...'
        & az extension add --name cdn --yes --only-show-errors
        if ($LASTEXITCODE -ne 0) {
            throw 'Failed to install Azure CLI cdn extension.'
        }
        Write-Log -Level SUCCESS -Message 'Azure CLI cdn extension installed.'
    }
    else {
        Write-Log -Message 'Azure CLI cdn extension is already installed.'
    }

    Write-Log -Message "Reading endpoints for Front Door profile '$($fd.name)'..."
    $endpoints = @(Invoke-Az @('afd', 'endpoint', 'list', '--profile-name', $fd.name, '-g', $ResourceGroupName,
            '--subscription', $SubscriptionId, '--only-show-errors'))
    if ($endpoints.Count -eq 0) { throw "Front Door profile '$($fd.name)' has no endpoints." }
    $frontendUrl = "https://$($endpoints[0].hostName)"
    Write-Log -Level SUCCESS -Message "Discovered Front Door hostname: $frontendUrl (profile '$($fd.name)')."
}
else {
    $frontendUrl = if ($frontendUrl -match '^https?://') { $frontendUrl } else { "https://$frontendUrl" }
    Write-Log -Message "Using supplied custom URL: $frontendUrl"
}

# ---- Step 1: SPA redirect URI on the main app registration ----------------------------------------
if ($SkipFrontendRedirect) {
    Write-Log -Message 'Skipped SPA redirect URI update (-SkipFrontendRedirect).'
}
else {
    Connect-AzTenant -TenantId $AppTenantId -Label 'app'
    Write-Log -Message "Patching spa.redirectUris on app '$MainAppClientId'..."
    $tmp = (New-TemporaryFile).FullName
    try {
        Write-JsonFile -Path $tmp -Json (@{ spa = @{ redirectUris = @($frontendUrl) } } | ConvertTo-Json -Depth 10)
        & az rest --method PATCH --uri "https://graph.microsoft.com/v1.0/applications(appId='$MainAppClientId')" `
            --headers 'Content-Type=application/json' --body "@$tmp" --only-show-errors | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Failed to update spa.redirectUris on app '$MainAppClientId'." }
    }
    finally { Remove-Item $tmp -ErrorAction SilentlyContinue }
    Write-Log -Level SUCCESS -Message "Set SPA redirect URI to $frontendUrl."
    Connect-AzTenant -TenantId $CustomerTenantId -Label 'infra'
}

# ---- Step 2: import the SPO certificate from the bootstrap KV into the product KV -----------------
if ($SkipSpoCertificate) {
    Write-Log -Message 'Skipped SPO certificate import (-SkipSpoCertificate).'
}
elseif (-not $BootstrapKeyVaultId) {
    Write-Log -Level WARN -Message 'No -BootstrapKeyVaultId supplied; skipping SPO certificate import. Pass it, or run with -SkipSpoCertificate to silence this.'
}
else {
    $kvParts = $BootstrapKeyVaultId -split '/'
    $bootSub = $kvParts[2]
    $bootName = $kvParts[-1]
    $productKv = if ($ProductKeyVaultName) {
        [pscustomobject]@{ name = $ProductKeyVaultName }
    }
    else {
        Get-SingleResource -ResourceType 'Microsoft.KeyVault/vaults' -Label 'product Key Vault'
    }
    if (-not $productKv) { throw "No Key Vault found in '$ResourceGroupName'. Pass -ProductKeyVaultName." }

    # Same naming the prerequisite script uses: spo-certificate-<app-tenant-name-slug>, falling back to
    # the unscoped name for bootstrap vaults created before this convention existed.
    $bootTenantName = Invoke-AzTsv @('keyvault', 'show', '--name', $bootName, '--subscription', $bootSub,
        '--query', 'tags.tenantName', '-o', 'tsv', '--only-show-errors') -AllowFailure
    $spoCertName = if ($bootTenantName -and $bootTenantName -ne 'None') { "$(Get-Slug $bootTenantName)" } else { 'spo-certificate' }

    $b64 = Invoke-AzTsv @('keyvault', 'secret', 'show', '--vault-name', $bootName, '--name', $spoCertName,
        '--subscription', $bootSub, '--query', 'value', '-o', 'tsv', '--only-show-errors')
    if (-not $b64) { throw "Bootstrap Key Vault '$bootName' has no '$spoCertName' secret." }

    $pfxPath = (New-TemporaryFile).FullName -replace '\.tmp$', '.pfx'
    try {
        [System.IO.File]::WriteAllBytes($pfxPath, [Convert]::FromBase64String($b64))
        Invoke-Az @('keyvault', 'certificate', 'import', '--vault-name', $productKv.name, '--name', $spoCertName,
            '--file', $pfxPath, '--subscription', $SubscriptionId, '--only-show-errors') | Out-Null
    }
    finally { Remove-Item $pfxPath -ErrorAction SilentlyContinue }
    Write-Log -Level SUCCESS -Message "Imported '$spoCertName' into product Key Vault '$($productKv.name)'."
}

# ---- Step 3: AI agent Gov360 base URL / UI link (optional) ----------------------------------------
if (-not $ConfigureAiAgent) {
    Write-Log -Message 'Skipped AI agent configuration (no -ConfigureAiAgent).'
}
else {
    $aiApp = if ($AiAgentWebAppName) {
        [pscustomobject]@{ name = $AiAgentWebAppName }
    }
    else {
        Get-SingleResource -ResourceType 'Microsoft.Web/sites' -NameContains '-aiagent-' -Label 'AI agent Web App'
    }
    if (-not $aiApp) { throw "No AI agent Web App found in '$ResourceGroupName' (expected a name containing '-aiagent-'). Pass -AiAgentWebAppName, or deploy without -ConfigureAiAgent." }

    Invoke-Az @('webapp', 'config', 'appsettings', 'set', '--name', $aiApp.name, '-g', $ResourceGroupName,
        '--subscription', $SubscriptionId, '--settings',
        "Gov360__BaseUrl=$frontendUrl", "Gov360__UILink=$frontendUrl", '--only-show-errors') | Out-Null
    Write-Log -Level SUCCESS -Message "Set Gov360__BaseUrl / Gov360__UILink on '$($aiApp.name)' to $frontendUrl."
}

# ---- Step 4: notification mailbox Exchange Online RBAC grant (optional) ---------------------------
if (-not $GrantNotificationMailbox) {
    Write-Log -Message 'Skipped notification mailbox grant (no -GrantNotificationMailbox).'
}
else {
    if (-not $NotificationSenderMailbox) { throw '-GrantNotificationMailbox requires -NotificationSenderMailbox.' }
    $grantScript = Join-Path $PSScriptRoot '..\..\Utilities\Scripts\PowerShell\Grant-NotificationMailboxSend.ps1'
    if (-not (Test-Path $grantScript)) { throw "Grant-NotificationMailboxSend.ps1 not found at '$grantScript'." }
    Write-Log -Message "Running Grant-NotificationMailboxSend.ps1 for mailbox '$NotificationSenderMailbox' (Exchange Online — may prompt for its own sign-in)..."
    & $grantScript -AppId $MainAppClientId -SenderMailbox $NotificationSenderMailbox
    Write-Log -Level SUCCESS -Message 'Notification mailbox grant complete.'
}

Write-Host ''
Write-Host '================ SUMMARY ================' -ForegroundColor Green
Write-Host ("Resource group       : {0}" -f $ResourceGroupName)
Write-Host ("Frontend URL         : {0}" -f $frontendUrl)
Write-Host ("SPA redirect updated : {0}" -f (-not $SkipFrontendRedirect))
Write-Host ("SPO cert imported    : {0}" -f ($BootstrapKeyVaultId -and -not $SkipSpoCertificate))
Write-Host ("AI agent configured  : {0}" -f [bool]$ConfigureAiAgent)
Write-Host ("Mailbox grant run    : {0}" -f [bool]$GrantNotificationMailbox)
Write-Host ("Log file: {0}" -f $script:LogFile)
Write-Log -Level SUCCESS -Message 'Done.'
