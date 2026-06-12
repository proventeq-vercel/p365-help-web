---
title: "Azure Prerequisites"
description: "Create a dedicated resource group, set up a deployment identity, grant Owner RBAC, and register the required Azure resource providers for Proventeq365."
---

# Azure Prerequisites

Proventeq365 is deployed into a dedicated Azure resource group within your subscription. Work through the steps below in order.

## Create a Resource Group

**What this does:** Creates an isolated container in your Azure subscription where all Proventeq365 resources will live.

### Steps — Azure Portal

1. Sign in to the Azure Portal (https://portal.azure.com).
2. Search for **Resource groups** and select it.
3. Click **+ Create**.
4. Select your **Subscription**, enter a **Resource group name**, and choose the **Region** that matches where your Microsoft 365 data is stored. To find your M365 data location, visit the [Microsoft 365 data locations](https://learn.microsoft.com/en-us/microsoft-365/enterprise/o365-data-locations) guide.
5. Click **Review + Create**, then **Create**.

### Steps — Azure CLI (alternative)

```bash
az login
az group create --name "<RESOURCE_GROUP_NAME>" --location "<AZURE_REGION>"
```

Replace `<RESOURCE_GROUP_NAME>` with your chosen name and `<AZURE_REGION>` with the target region (e.g. `uksouth`).

## Create a Deployment Identity

**What this does:** Provides Proventeq with a secure identity to use during deployment. Choose one of the two options below — agree the approach with your Proventeq contact first.

### Option A — Create a dedicated user account in your tenant

Use this option if your policy requires Proventeq to use an internal account.

**Steps — Azure Portal**

1. Sign in to the **Azure Portal** (https://portal.azure.com) and go to **Microsoft Entra ID**.
2. Select **Users** > **+ New user** > **Create new user**.
3. Enter a display name and a user principal name (UPN) — for example, `proventeq-deploy@yourdomain.com`.
4. Set a strong temporary password, note it down, and share it with Proventeq via your approved secure channel.
5. Select **Create**.

**Steps — Azure CLI (alternative)**

```bash
az ad user create \
  --display-name "<DISPLAY_NAME>" \
  --user-principal-name "<USERNAME>@<TENANT_DOMAIN>" \
  --password "<TEMPORARY_PASSWORD>"
```

### Option B — Invite Proventeq as a guest user

Use this option if your policy permits external guest access.

**Steps — Azure Portal**

1. Sign in to the **Azure Portal** (https://portal.azure.com) and go to **Microsoft Entra ID**.
2. Select **Users** > **+ New user** > **Invite external user**.
3. Enter the Proventeq email address provided by your Proventeq contact.
4. Add a meaningful display name and click **Invite**.

**Steps — Azure CLI (alternative)**

```bash
az ad user invite \
  --user-email-address "<PROVENTEQ_EMAIL>" \
  --display-name "<DISPLAY_NAME>" \
  --redirect-url "https://portal.azure.com"
```

### Security recommendations for the deployment identity

- **Enable MFA** — Strongly recommended. Even if credentials are compromised, MFA prevents unauthorized sign-in.
- **Limit session lifetime** — Configure short session timeouts and disable persistent sessions to reduce the risk of session hijacking.

## Grant Access to the Resource Group (RBAC)

**What this does:** Gives the deployment identity the permissions it needs to create and manage resources in the resource group.

### Steps — Azure Portal

1. Go to the resource group you created in [Create a Resource Group](#create-a-resource-group).
2. In the left-hand menu, select **Access control (IAM)**.
3. Click **Add** > **Add role assignment**.
4. On the **Role** tab, search for and select **Owner**, then click **Next**.
5. On the **Members** tab, click **+ Select members**. Search for and select the deployment user or Proventeq guest account, then click **Select** and **Next**.
6. On the **Conditions** tab, select **Allow user to assign all roles**, then click **Next**.
7. On the **Assignment type** tab, set the assignment type to **Active** and the duration to **Permanent**, then click **Next**.
8. Click **Review + assign** to complete the setup.

### Steps — Azure CLI (alternative)

```bash
az login
az role assignment create \
  --assignee "<DEPLOYMENT_IDENTITY_UPN_OR_OBJECT_ID>" \
  --role "Owner" \
  --scope "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>"
```

## Register Azure Resource Providers

**What this does:** Authorizes your Azure subscription to use the specific Azure services that Proventeq365 requires. This is a one-time step per subscription.

The following resource providers must be registered:

| Provider namespace |
| --- |
| Microsoft.ManagedIdentity |
| Microsoft.Network |
| Microsoft.ContainerService |
| Microsoft.ContainerRegistry |
| Microsoft.ContainerInstance |
| Microsoft.AlertsManagement |
| Microsoft.AppConfiguration |
| Microsoft.OperationalInsights |
| Microsoft.Insights |
| Microsoft.Storage |
| Microsoft.Web |
| Microsoft.KeyVault |
| Microsoft.Cdn |
| Microsoft.App |
| Microsoft.Authorization |
| Microsoft.Sql |
| Microsoft.Resources |
| Microsoft.ServiceBus |

### Option 1 — Azure Portal

1. Sign in to the **Azure Portal** (https://portal.azure.com).
2. Search for and select **Subscriptions**, then select your target subscription.
3. In the left-hand menu, select **Resource providers**.
4. Search for each provider namespace listed above. If its status is **Not Registered**, select it and click **Register**.
5. Repeat for all providers in the list. Registration usually completes within 1–2 minutes.

### Option 2 — Azure CLI (faster for multiple providers)

Run the following commands after signing in (`az login`) and selecting your target subscription:

```bash
az provider register --namespace Microsoft.ManagedIdentity
az provider register --namespace Microsoft.Network
az provider register --namespace Microsoft.ContainerService
az provider register --namespace Microsoft.ContainerRegistry
az provider register --namespace Microsoft.ContainerInstance
az provider register --namespace Microsoft.AlertsManagement
az provider register --namespace Microsoft.AppConfiguration
az provider register --namespace Microsoft.OperationalInsights
az provider register --namespace Microsoft.Insights
az provider register --namespace Microsoft.Storage
az provider register --namespace Microsoft.Web
az provider register --namespace Microsoft.KeyVault
az provider register --namespace Microsoft.Cdn
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.Authorization
az provider register --namespace Microsoft.Sql
az provider register --namespace Microsoft.Resources
az provider register --namespace Microsoft.ServiceBus
```

To verify that all providers are registered, run:

```bash
az provider list --query "[?registrationState=='Registered'].namespace" --output table
```
