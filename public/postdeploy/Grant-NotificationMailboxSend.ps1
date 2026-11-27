<#
.SYNOPSIS
    Lets the Proventeq Cloud daemon app send notification emails from ONE mailbox in a tenant,
    using Exchange Online RBAC for Applications (no organisation-wide Mail.Send consent in Entra).

.DESCRIPTION
    Product notification emails are sent with Microsoft Graph sendMail from the mailbox configured in
    App Configuration as Shared:Notification:DefaultSender:Mailbox (seeded from the template parameter
    notificationSenderMailbox), or a tenant's own Shared:Notification:SenderMailboxes:{tenantId}. Run this once
    in the tenant the mailbox lives in. In SaaS that is Proventeq's own tenant: the platform daemon only needs a
    service principal there (New-MgServicePrincipal -AppId <ClientId>), no admin consent.
    The daemon app therefore needs Mail.Send, but only on that mailbox. RBAC for Applications grants exactly
    that: a management scope containing the one mailbox, and the "Application Mail.Send" role assigned to the
    daemon's service principal over that scope.

    Do NOT also grant Mail.Send as an application permission in Entra ID: Exchange adds the two grants
    together, so an Entra grant would let the app send as every mailbox in the tenant.

    Run it in the MAILBOX's tenant, as a member of the Exchange "Organization Management" role group. The
    shared mailbox must exist first (a shared mailbox needs no licence up to 50 GB), for example:
        New-Mailbox -Shared -Name "Proventeq365" -PrimarySmtpAddress proventeq365@contoso.com

    Re-run-safe: an existing service principal pointer, scope or assignment is reused.
    Changes can take 30 minutes to 2 hours to apply (Exchange caches app permissions).

    Reference: https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac

.PARAMETER AppId
    Application (client) id of the daemon app registration the deployment uses for Graph.

.PARAMETER SenderMailbox
    Primary SMTP address of the sender mailbox, the same value as Shared:Notification:DefaultSender:Mailbox (or
    the tenant's own Shared:Notification:SenderMailboxes:{tenantId}).

.PARAMETER ServicePrincipalObjectId
    Object id of the app's service principal in this tenant (Entra ID, Enterprise applications, Object ID; not the
    App registrations object id). When omitted it is looked up with Get-MgServicePrincipal, which needs
    Connect-MgGraph -Scopes Application.Read.All.

.PARAMETER DisplayName
    Name shown for the service principal pointer in Exchange.

.EXAMPLE
    Connect-ExchangeOnline -UserPrincipalName admin@contoso.com
    .\Grant-NotificationMailboxSend.ps1 -AppId 00000000-0000-0000-0000-000000000000 -SenderMailbox proventeq365@contoso.com
#>
param(
    [Parameter(Mandatory = $true)]
    [string] $AppId,

    [Parameter(Mandatory = $true)]
    [string] $SenderMailbox,

    [string] $ServicePrincipalObjectId,

    [string] $DisplayName = "Proventeq365 notifications"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

if (-not (Get-Command Get-ServicePrincipal -ErrorAction SilentlyContinue)) {
    throw "Exchange Online PowerShell is not connected. Run Connect-ExchangeOnline first."
}

$mailbox = Get-Mailbox -Identity $SenderMailbox
$scopeName = "Proventeq365 sender - $($mailbox.PrimarySmtpAddress)"

# The Entra service principal of the app in THIS tenant (created when the tenant consented to the app, or, for a
# tenant that only sends, by New-MgServicePrincipal -AppId <AppId>).
if (-not $ServicePrincipalObjectId) {
    if (-not (Get-Command Get-MgServicePrincipal -ErrorAction SilentlyContinue)) {
        throw "Pass -ServicePrincipalObjectId, or install Microsoft.Graph and run Connect-MgGraph -Scopes Application.Read.All."
    }
    $entraServicePrincipal = Get-MgServicePrincipal -Filter "appId eq '$AppId'"
    if (-not $entraServicePrincipal) {
        throw "No service principal for app $AppId in this tenant. Consent to the app first, or create one with New-MgServicePrincipal -AppId $AppId."
    }
    $ServicePrincipalObjectId = $entraServicePrincipal.Id
}

$exchangeServicePrincipal = Get-ServicePrincipal -Identity $AppId -ErrorAction SilentlyContinue
if (-not $exchangeServicePrincipal) {
    $exchangeServicePrincipal = New-ServicePrincipal -AppId $AppId -ObjectId $ServicePrincipalObjectId -DisplayName $DisplayName
    Write-Host "Created the Exchange service principal pointer for $AppId."
}

$scope = Get-ManagementScope -Identity $scopeName -ErrorAction SilentlyContinue
if (-not $scope) {
    $scope = New-ManagementScope -Name $scopeName -RecipientRestrictionFilter "PrimarySmtpAddress -eq '$($mailbox.PrimarySmtpAddress)'"
    Write-Host "Created management scope '$scopeName'."
}

$assignment = Get-ManagementRoleAssignment -RoleAssignee $exchangeServicePrincipal.Identity -Role "Application Mail.Send" -ErrorAction SilentlyContinue |
    Where-Object { $_.CustomResourceScope -eq $scope.Name }
if (-not $assignment) {
    New-ManagementRoleAssignment -App $exchangeServicePrincipal.Identity -Role "Application Mail.Send" -CustomResourceScope $scope.Name | Out-Null
    Write-Host "Assigned 'Application Mail.Send' over '$scopeName'."
}

Write-Host ""
Write-Host "Check (InScope must be True for the sender mailbox):"
Test-ServicePrincipalAuthorization -Identity $exchangeServicePrincipal.Identity -Resource $mailbox.PrimarySmtpAddress |
    Format-Table RoleName, GrantedPermissions, AllowedResourceScope, InScope
