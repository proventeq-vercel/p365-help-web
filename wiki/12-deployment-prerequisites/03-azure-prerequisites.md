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

> **Note on region.** All compute, data and messaging resources are deployed into your chosen region. One exception applies: the Proventeq365 user interface is hosted on **Azure Static Web Apps**, which is available in a limited set of Azure regions and may therefore sit in a different region from the rest of your deployment. It holds static application files only — no customer content is stored there and it is not on the data path. Proventeq will confirm the interface region with you before deployment; if your data-residency policy constrains it, please raise it with your Proventeq contact.

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
az rest --method POST \
  --url "https://graph.microsoft.com/v1.0/invitations" \
  --headers "Content-Type=application/json" \
  --body '{"invitedUserEmailAddress":"<PROVENTEQ_EMAIL>","invitedUserDisplayName":"<DISPLAY_NAME>","inviteRedirectUrl":"https://portal.azure.com","sendInvitationMessage":true}'
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

### Two further points on this step

**Reader role at subscription scope.** Please also grant the deployment identity the **Reader** role at subscription scope, in addition to the Owner role on the resource group described in [Grant Access to the Resource Group](#grant-access-to-the-resource-group-rbac). The deployment tooling reads each provider's registration state before it begins, and that read is a subscription-scope operation. Without it the deployment stops at this check even when every provider is already registered.

**Optional feature providers.** Three additional providers are required only if the corresponding optional features are in scope for your deployment. Proventeq will confirm which apply to you before the deployment date:

| Provider namespace | Required for |
| --- | --- |
| Microsoft.Compute | Migrator virtual machines |
| Microsoft.CognitiveServices | AI Agent |
| Microsoft.BotService | AI Agent |

None of the three is needed for a standard deployment.

## Confirm Subscription Quota

**What this does:** Confirms your subscription can actually allocate the resources Proventeq365 requires. New or lightly-used subscriptions frequently have zero quota for one or more of these in a given region.

- **App Service Plan** — 1 × B3 Linux, hosting five web apps and two function apps (six web apps if the AI Agent is in scope).
- **Azure SQL Database** — one database; the SKU is agreed with Proventeq during sizing.
- **Container Apps** — one environment plus nine jobs, sized between 0.25 and 2 vCPU. If all nine run concurrently they request up to **12.75 vCPU** and **25.5 GiB** against the Container Apps quota — that is the figure to check.
- **Storage accounts** — four.
- **Also required:** Front Door (Standard, a global service), Key Vault, App Configuration (Free tier), Log Analytics, Application Insights, and Service Bus (Standard).

## Outbound Connectivity

> **Applies only if** outbound traffic is restricted by firewall, proxy or private networking.

The deployed services require outbound HTTPS access to the following endpoints.

| Endpoint | Purpose |
| --- | --- |
| `crpvqsaasdev.azurecr.io` and `*.blob.core.windows.net` | Container images for the Proventeq365 services are pulled from a Proventeq-managed Azure Container Registry. This is a cross-tenant dependency by design and is usually the item that requires explicit approval. |
| `graph.microsoft.com` and `login.microsoftonline.com` | Microsoft Graph and authentication. |
| `*.sharepoint.com` and `*-admin.sharepoint.com` | SharePoint Online. |
| `*.servicebus.windows.net` | Azure Service Bus. |
| `*.vault.azure.net` and `*.azconfig.io` | Key Vault and App Configuration. |
| `*.database.windows.net` | Azure SQL. |
| `*.wasabisys.com` | Only if Wasabi archiving is in scope. |
| `*.botframework.com`, including the `api.`, `login.` and `token.` hosts | The Teams notification bot. Always required. |
| `management.azure.com` | The Azure Resource Manager API, used to start the discovery and action container jobs. |
| `*.applicationinsights.azure.com` and `*.monitor.azure.com` | Telemetry ingestion from all services. |
| `*.openai.azure.com` and `*.cognitiveservices.azure.com` | Only if the AI Agent is in scope. |
