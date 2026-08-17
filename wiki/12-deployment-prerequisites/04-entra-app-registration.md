---
title: "Entra ID App Registration"
description: "Register Proventeq365 in Microsoft Entra ID, assign the Cloud Application Administrator role, and grant the Microsoft Graph and SharePoint API permissions for your deployment mode."
---

# Entra ID App Registration (Microsoft 365)

**What this does:** Registers Proventeq365 as an application in your Microsoft Entra ID tenant and grants it the permissions it needs to access Microsoft 365 services.

> **Note:** You can either follow the steps below or use the [Entra App Creation Script](../appendix/entra-app-script.md) in the Appendix. The specific API permissions depend on your chosen deployment mode (Read-only or Read-write). Proventeq will confirm the exact permissions list before you complete this step.

## Create the App Registration

### Steps — Azure Portal

1. Sign in to the **Azure Portal** (https://portal.azure.com) and go to **Microsoft Entra ID**.
2. Select **App registrations** > **+ New registration**.
3. Enter a meaningful name (e.g. `Proventeq365`), leave the default account type, and click **Register**.
4. Note the **Application (client) ID** and **Directory (tenant) ID** — you will need to share these with Proventeq.

### Steps — Azure CLI (alternative)

```bash
az ad app create \
  --display-name "<APP_NAME>" \
  --sign-in-audience AzureADMyOrg
```

## Assign the Cloud Application Administrator Role

### Steps — Azure Portal

1. In **Microsoft Entra ID**, go to **Roles and administrators**.
2. Search for and select **Cloud Application Administrator**.
3. Click **+ Add assignment**.
4. On the **Members** tab, click **Select member(s)** and add the deployment user account created in [Create a Deployment Identity](./03-azure-prerequisites.md#create-a-deployment-identity).
5. On the **Settings** tab, set the assignment type to **Active**, then confirm.

### Alternative — app registration ownership

If a tenant-wide directory role is not acceptable under your policy, an alternative is to make the deployment identity an **owner of this app registration**. That grants exactly the rights needed to configure the Application ID URI, the scope and the client secret, and nothing else. Agree the approach with your Proventeq contact.

```bash
az ad app owner add \
  --id <APP_OBJECT_ID> \
  --owner-object-id <USER_OBJECT_ID>
```

## Set the Application ID URI

**What this does:** Defines the identifier that Proventeq365 uses to validate API access tokens. This is a **required deployment input**.

> **Who performs this and the two steps that follow.** Where you have granted Proventeq the access described in [Assign the Cloud Application Administrator Role](#assign-the-cloud-application-administrator-role) — either the Cloud Application Administrator role or ownership of this app registration — **Proventeq completes these three steps**. Follow them yourself only if that access has not been granted, and then share the resulting values with your Proventeq contact as listed in [Share Details with Proventeq](./06-next-steps.md#share-details-with-proventeq).

### Steps — Azure Portal

1. In the app registration, go to **Expose an API**.
2. Next to **Application ID URI**, click **Set**.
3. Accept the default `api://<application-client-id>`, or use a verified custom domain form if you prefer, then click **Save**.
4. Record the value — it must be shared with Proventeq exactly as configured.

## Add the access_as_user Scope

**What this does:** Defines the delegated scope that the Proventeq365 user interface requests to call its API. This is a **required deployment input**.

### Steps — Azure Portal

1. In the app registration, go to **Expose an API** and click **+ Add a scope**.
2. Set **Scope name** to `access_as_user`.
3. Set **Who can consent** to **Admins and users**.
4. Provide display names and descriptions for both admin and user consent, then click **Add scope**.

> **Important:** the exact scope string matters. Whatever scope name you create must be shared with Proventeq **verbatim** — it is used unmodified in the deployment configuration and in the user interface.

## Create a Client Secret

**What this does:** Provides the credential the deployment uses to authenticate as the application. This is a **required deployment input**.

### Steps — Azure Portal

1. In the app registration, go to **Certificates & secrets**, then **Client secrets**.
2. Click **+ New client secret**, add a description and an expiry period, then click **Add**.
3. Copy the **Value** immediately — it cannot be retrieved after you leave the page.
4. Share it with Proventeq through your approved secure channel. **Never send it by email.**

### Steps — Azure CLI (alternative)

```bash
az ad app credential reset \
  --id <APP_OBJECT_ID> \
  --display-name "Proventeq365 deployment" \
  --years 1 \
  --append
```

> **Certificate.** In addition to the client secret, Proventeq will upload a public-key certificate to this app registration. It is required for application-only access to SharePoint Online. The private key never leaves Proventeq's key store. This is noted here because certificate upload is normally a change-control item.

## Grant API Permissions

1. In the app registration, go to **Manage** > **API permissions**.
2. Add the required Microsoft Graph and service permissions for your chosen deployment mode:
   - **Read-only mode:** Apply the permissions shown in the Read-only permissions screenshot provided by Proventeq.
   - **Read-write mode:** Apply the permissions shown in the Read-write permissions screenshot provided by Proventeq (this includes additional permissions compared to Read-only).
3. Once all permissions are added, click **Grant Admin Consent for [your organization]** and confirm.

> **Who can grant admin consent.** This step requires **Privileged Role Administrator** or **Global Administrator**. The Cloud Application Administrator role assigned in [Assign the Cloud Application Administrator Role](#assign-the-cloud-application-administrator-role) is **not** sufficient to consent to Microsoft Graph application permissions, so admin consent cannot be performed by Proventeq on your behalf and must be carried out by an administrator in your tenant.

### Read-only mode permissions

#### Microsoft Graph (13 permissions)

| API / Permission | Type | Description | Admin Consent |
| --- | --- | --- | --- |
| AuditLog.Read.All | Application | Required to read sign-in activity for users and service principals. Without it the whole request fails, not just that field. | Yes |
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

#### Microsoft Graph (25 permissions)

| API / Permission | Type | Description | Admin Consent |
| --- | --- | --- | --- |
| AuditLog.Read.All | Application | Read all audit log data | Yes |
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
