---
title: "Entra ID App Registration"
description: "What the Proventeq365 prerequisites script creates in Microsoft Entra ID, how admin consent is granted, and the Microsoft Graph and SharePoint API permissions for each deployment mode."
---

# Entra ID App Registration (Microsoft 365)

**What this does:** Proventeq365 connects to your Microsoft 365 tenant through a Microsoft Entra ID **application**. The [prerequisites script](./05-run-prerequisites-script.md) creates and configures this app registration for you — there is no manual portal setup. This page describes what the script creates so you can review it, and lists the API permissions it requests for each deployment mode.

## What the Script Creates

| Item | Detail |
| --- | --- |
| App registration | A single-tenant app registration, named by `-ApplicationName` (for example `Proventeq365`). |
| Application ID URI | `api://<application-client-id>` |
| Delegated scope | `access_as_user` — requested by the Proventeq365 user interface to call its API. |
| API permissions | The Microsoft Graph and SharePoint permissions for your deployment mode — see [API Permissions](#api-permissions). |
| Admin consent | Granted during the run when you pass `-GrantAdminConsent` — see [Grant Admin Consent](#grant-admin-consent). |
| Client secret | Created and written straight into the Bootstrap Key Vault. It is never displayed. |
| SharePoint certificate | A certificate used for application-only access to SharePoint Online. The public key is added to the app registration and the certificate is stored in the Bootstrap Key Vault; the [post-deployment script](./07-run-post-deployment-script.md) imports it into the product Key Vault. The private key never leaves your Key Vaults. |
| Redirect URI | Set by the post-deployment script once the Proventeq365 URL is known, or up front with `-FrontendUrl` if you already have a custom domain. |
| AI agent app registration (optional) | A second app registration named `<ApplicationName> AI Agent`, created only with `-ConfigureAiAgent`. |

The person who runs the script becomes the Proventeq365 **platform administrator** by default. To nominate someone else, pass their Entra object ID with `-PlatformAdminObjectId`.

> **Re-running is safe.** The script reuses the existing app registration and never removes anything it already has — existing permissions, certificates, scopes and redirect URIs are merged with, not replaced by, what a new run adds. A new client secret and SharePoint certificate are created only when you pass `-ForceNewCert`.

## Grant Admin Consent

Proventeq365 cannot access Microsoft 365 or SharePoint until admin consent is granted. Granting admin consent requires **Global Administrator** or **Privileged Role Administrator**. The Application Administrator and Cloud Application Administrator roles are **not** sufficient to consent to Microsoft Graph application permissions.

### Option A — During the script run (recommended)

If the person running the prerequisites script is a Global Administrator or Privileged Role Administrator, include `-GrantAdminConsent` in the command. The script grants consent as part of the run. See [Scenario A](./05-run-prerequisites-script.md#scenario-a--standard-read-write-with-admin-consent).

### Option B — Separately, after the script run

If the person running the script does not hold either role, they run it **without** `-GrantAdminConsent` (see [Scenario F](./05-run-prerequisites-script.md#scenario-f--without-admin-consent)). A Global Administrator then grants consent in one of two ways, using the **App (client) ID** from the script summary.

**Azure Cloud Shell:**

```powershell
az ad app permission admin-consent --id <APP-CLIENT-ID>
```

**Azure portal:**

1. Go to **Microsoft Entra ID** → **App registrations** and open the **Proventeq365** application.
2. Open **API permissions**.
3. Click **Grant admin consent for &lt;your organisation&gt;** and confirm.
4. Confirm that every permission shows **Granted**.

## API Permissions

The script requests the permission set for the deployment mode passed in `-PermissionMode`. See [Deployment Mode](./02-microsoft-365-prerequisites.md#deployment-mode).

- **Application permissions** allow the platform to run its scheduled discovery, reporting and remediation jobs without a user being signed in. These require a one-time **admin consent**.
- **Delegated permissions** are used only when a user signs in to the Proventeq365 portal.
- All access is confined to your own tenant and is **fully revocable** at any time by removing consent in Microsoft Entra ID.

> **`Sites.FullControl.All` appears under two APIs — Microsoft Graph and SharePoint — and these are separate permissions, not a duplicate.** Where a mode lists `Sites.FullControl.All` under both, both are required.

> **Changing mode later.** To move from Read-only to Read-write, re-run the prerequisites script with `-PermissionMode ReadWrite` and `-GrantAdminConsent`; the additional permissions are added and consented. Because the script never removes permissions, moving from Read-write to Read-only means removing the extra permissions manually in **API permissions**.

### Read-only mode permissions

#### Microsoft Graph (15 permissions)

| API / Permission | Type | Description | Admin Consent |
| --- | --- | --- | --- |
| AuditLog.Read.All | Application | Required to read sign-in activity for users and service principals. Without it the whole request fails, not just that field. | Yes |
| ChannelMessage.Read.All | Application | Required for Microsoft Teams discovery — reads Teams channel messages. | Yes |
| Chat.Read.All | Application | Required for Microsoft Teams discovery — reads Teams chats. | Yes |
| Directory.Read.All | Application | Required to read directory roles and members, service principals, app role assignments and OAuth2 permission grants. | Yes |
| Group.Read.All | Application | Read all groups | Yes |
| Mail.Read | Application | Read mail in all mailboxes | Yes |
| offline_access | Delegated | Required for token refresh in the Proventeq365 interface. | No |
| openid | Delegated | Required for user sign-in to the Proventeq365 interface. | No |
| Organization.Read.All | Application | Required for the tenant storage entitlement figure (`subscribedSkus`). Without it storage entitlement is silently reported as zero rather than failing. | Yes |
| profile | Delegated | Required for user sign-in to the Proventeq365 interface. | No |
| Reports.Read.All | Application | Required for tenant usage and site engagement reporting. | Yes |
| SensitivityLabels.Read.All | Application | Required to read sensitivity labels. | Yes |
| Sites.FullControl.All | Application | **Microsoft Graph** — separate from the SharePoint permission of the same name. **Required — do not omit.** Beyond reading site permissions, this grant is required for the tenant-wide site enumeration that all SharePoint discovery starts from, and for site engagement reporting. Without it SharePoint discovery returns nothing. Despite the name, these are read operations; Microsoft Graph exposes no lesser permission for them. | Yes |
| Sites.Read.All | Application | Read items in all site collections | Yes |
| User.Read.All | Application | Read all users' full profiles | Yes |

#### SharePoint (2 permissions)

| API / Permission | Type | Description | Admin Consent |
| --- | --- | --- | --- |
| Sites.Read.All | Application | Read items in all site collections | Yes |
| User.Read.All | Application | Read user profiles | Yes |

### Read-write mode permissions

#### Microsoft Graph (27 permissions)

| API / Permission | Type | Description | Admin Consent |
| --- | --- | --- | --- |
| AuditLog.Read.All | Application | Read all audit log data | Yes |
| ChannelMessage.Read.All | Application | Required for Microsoft Teams discovery — reads Teams channel messages. | Yes |
| Chat.Read.All | Application | Required for Microsoft Teams discovery — reads Teams chats. | Yes |
| Directory.ReadWrite.All | Application | Read and write directory data | Yes |
| Group.Read.All | Application | Read all groups | Yes |
| Group.ReadWrite.All | Application | Read and write all groups | Yes |
| InformationProtectionPolicy.Read.All | Application | Read all published labels and label policies | Yes |
| Mail.Read | Application | Read mail in all mailboxes | Yes |
| Mail.ReadBasic.All | Application | Read basic mail in all mailboxes | Yes |
| offline_access | Delegated | Maintain access to data you have given it access to | No |
| openid | Delegated | Sign users in | No |
| Organization.Read.All | Application | Required for the tenant storage entitlement figure (`subscribedSkus`). | Yes |
| profile | Delegated | View users' basic profile | No |
| RecordsManagement.Read.All | Application | Read Records Management configuration, labels | Yes |
| RecordsManagement.ReadWrite.All | Application | Read and write Records Management configuration | Yes |
| Reports.Read.All | Application | Read all usage reports — required for tenant usage and site engagement reporting | Yes |
| SensitivityLabels.Read.All | Application | Get labels tenant scope | Yes |
| Sites.Archive.All | Application | Archive/reactivate Site Collections without a signature | Yes |
| Sites.FullControl.All | Application | Required for the tenant-wide site enumeration that all SharePoint discovery starts from, for reading site permissions, and for site engagement reporting. | Yes |
| Sites.Manage.All | Application | Create, edit, and delete items and lists in all sites | Yes |
| Sites.Read.All | Application | Read items in all site collections | Yes |
| Sites.ReadWrite.All | Application | Read and write items in all site collections | Yes |
| Team.ReadBasic.All | Application | Get a list of all teams | Yes |
| User.Read | Delegated | Sign in and read user profile | No |
| User.Read.All | Application | Read all users' full profiles | Yes |
| User.ReadBasic.All | Application | Read all users' basic profiles | Yes |
| User.ReadWrite.All | Application | Read and write all users' full profiles | Yes |

#### SharePoint (2 permissions)

| API / Permission | Type | Description | Admin Consent |
| --- | --- | --- | --- |
| Sites.FullControl.All | Application | Have full control of all site collections | Yes |
| User.ReadWrite.All | Application | Read and write user profiles | Yes |
