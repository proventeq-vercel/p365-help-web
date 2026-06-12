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

### Azure CLI (alternative)

```bash
az ad app owner add \
  --id <APP_OBJECT_ID> \
  --owner-object-id <USER_OBJECT_ID>
```

## Grant API Permissions

1. In the app registration, go to **Manage** > **API permissions**.
2. Add the required Microsoft Graph and service permissions for your chosen deployment mode:
   - **Read-only mode:** Apply the permissions shown in the Read-only permissions screenshot provided by Proventeq.
   - **Read-write mode:** Apply the permissions shown in the Read-write permissions screenshot provided by Proventeq (this includes additional permissions compared to Read-only).
3. Once all permissions are added, click **Grant Admin Consent for [your organization]** and confirm.

### Read-only mode permissions

#### Microsoft Graph (7 permissions)

| API / Permission | Type | Description | Admin Consent |
| --- | --- | --- | --- |
| Chat.Read.All | Application | Read all chat messages | Yes |
| Group.Read.All | Application | Read all groups | Yes |
| Mail.Read | Application | Read mail in all mailboxes | Yes |
| Mail.ReadBasic.All | Application | Read basic mail in all mailboxes | Yes |
| Sites.Read.All | Application | Read items in all site collections | Yes |
| Team.ReadBasic.All | Delegated | Read the names and descriptions of teams | No |
| User.Read.All | Application | Read all users' full profiles | Yes |

#### SharePoint (2 permissions)

| API / Permission | Type | Description | Admin Consent |
| --- | --- | --- | --- |
| Sites.Read.All | Application | Read items in all site collections | Yes |
| User.Read.All | Application | Read user profiles | Yes |

### Read-write mode permissions

#### Microsoft Graph (23 permissions)

| API / Permission | Type | Description | Admin Consent |
| --- | --- | --- | --- |
| Chat.Create | Application | Create chats | Yes |
| Chat.Read.All | Application | Read all chat messages | Yes |
| Directory.ReadWrite.All | Application | Read and write directory data | Yes |
| Group.Read.All | Application | Read all groups | Yes |
| Group.ReadWrite.All | Application | Read and write all groups | Yes |
| InformationProtectionPolicy.Read.All | Application | Read all published labels and label policies | Yes |
| Mail.Read | Application | Read mail in all mailboxes | Yes |
| Mail.ReadBasic.All | Application | Read basic mail in all mailboxes | Yes |
| offline_access | Delegated | Maintain access to data you have given it access to | No |
| openid | Delegated | Sign users in | No |
| profile | Delegated | View users' basic profile | No |
| RecordsManagement.Read.All | Application | Read Records Management configuration, labels | Yes |
| RecordsManagement.ReadWrite.All | Application | Read and write Records Management configuration | Yes |
| SensitivityLabels.Read.All | Application | Get labels tenant scope | Yes |
| Sites.Archive.All | Application | Archive/reactivate Site Collections without a signature | Yes |
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
