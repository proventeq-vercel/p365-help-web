---
title: "Azure Prerequisites"
description: "Confirm the access the person running the deployment needs, collect the deployment values, register the required Azure resource providers, and check subscription quota and outbound connectivity for Proventeq365."
---

# Azure Prerequisites

Complete these steps before you run the [prerequisites script](./05-run-prerequisites-script.md).

## Required Access

**What this does:** The deployment is run by one person in your organisation. That person **must** have all of the following in your tenant before starting.

| Access | Where | Why it is needed |
| --- | --- | --- |
| **Application Administrator** or **Cloud Application Administrator**, or a suitable higher role | Microsoft Entra ID (app tenant) | To create and configure the app registration(s). The script warns if it cannot confirm an app-management role; app creation may then fail. |
| **Global Administrator** or **Privileged Role Administrator** | Microsoft Entra ID (app tenant) | Required only when passing `-GrantAdminConsent`. The script stops with an error if that switch is used without one of these roles. |
| **Owner** on the subscription | Azure subscription | To create the bootstrap resource group and Key Vault, **and** to assign roles on the Key Vault: your own access, the *Appliance Resource Provider* and the *Managed Applications On Behalf Application*. |
| **Contributor** on the deployed (managed) resource group, and Key Vault access on both the bootstrap and product Key Vaults | Azure subscription | Needed by the post-deployment script to read the Front Door profile and import the certificate into the product Key Vault. |
| **User Administrator** (or suitable higher role) and Microsoft Graph user-write permissions | Microsoft Entra ID (same tenant only) | Needed only with `-CreateDeployUser`; the script creates a directory user. See [Optional deployment user](./05-run-prerequisites-script.md#optional-deployment-user). |
| Container registry (ACR) username and password | Provided by Proventeq | The Proventeq365 container images are pulled with these. |

> **Important:** Azure role assignments require **Owner** or **User Access Administrator** at the relevant scope. A subscription **Contributor** can create resources but cannot create role assignments; pair Contributor with User Access Administrator if you do not have Owner. The script grants its signed-in identity Key Vault Secrets Officer so it can write secrets.

> **If consent must be granted separately.** An Application Administrator or Cloud Application Administrator with the required Azure access can run the script without `-GrantAdminConsent`; a Global Administrator or Privileged Role Administrator then grants consent separately. See [Grant Admin Consent](./04-entra-app-registration.md#grant-admin-consent).

## Information to Collect

Gather these values before you open Azure Cloud Shell. The examples are samples only.

| Value | Where to find it | Example |
| --- | --- | --- |
| **Tenant ID** | Azure portal → **Microsoft Entra ID** → **Overview** → *Tenant ID* | `3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34` |
| **Subscription ID** (optional) | Azure portal → **Subscriptions** | `9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d` |
| **Azure region** | Your chosen region — see the note below | `uksouth` |
| **ACR username and password** | Provided by Proventeq | `p365-contoso-pull` |
| **Bootstrap resource group name** | Choose a name for a normal, new resource group | `rg-contoso-p365` |
| **Bootstrap Key Vault name** | Choose a name: 3–24 characters, letters, numbers and hyphens, **globally unique** | `kv-p365boot-contoso01` |
| **SQL administrator** | The Entra user or group that should become the SQL Server administrator: its **object ID** and **display name**. This may be one of your own security groups. Asked for during the [Marketplace deployment](./06-deploy-from-azure-marketplace.md). | `SQL Admins` |

> **Note on region.** Choose the region that matches where your Microsoft 365 data is stored. To find your Microsoft 365 data location, see the [Microsoft 365 data locations](https://learn.microsoft.com/en-us/microsoft-365/enterprise/o365-data-locations) guide. All compute, data and messaging resources are deployed into your chosen region. One exception applies: the Proventeq365 user interface is hosted on **Azure Static Web Apps**, which is available in a limited set of Azure regions and may therefore sit in a different region from the rest of your deployment. It holds static application files only — no customer content is stored there and it is not on the data path. Proventeq will confirm the interface region with you before deployment; if your data-residency policy constrains it, please raise it with your Proventeq contact.

## Register Azure Resource Providers

**What this does:** Authorizes your Azure subscription to use the specific Azure services that Proventeq365 requires. This is a one-time step per subscription. It operates at subscription scope, so it must be carried out by someone with Owner or Contributor on the subscription.

The following resource providers must be registered:

| Provider namespace |
| --- |
| Microsoft.Solutions |
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

**Microsoft.Solutions** is the provider behind Azure managed applications, which is how Proventeq365 is deployed from Azure Marketplace. If it is not registered, the prerequisites script cannot find the *Appliance Resource Provider* and cannot grant it access to the Bootstrap Key Vault.

### Option 1 — Azure Portal

1. Sign in to the **Azure Portal** (https://portal.azure.com).
2. Search for and select **Subscriptions**, then select your target subscription.
3. In the left-hand menu, select **Resource providers**.
4. Search for each provider namespace listed above. If its status is **Not Registered**, select it and click **Register**.
5. Repeat for all providers in the list. Registration usually completes within 1–2 minutes.

### Option 2 — Azure Cloud Shell (faster for multiple providers)

Open [Azure Cloud Shell](./05-run-prerequisites-script.md#open-azure-cloud-shell-and-upload-the-scripts), make sure your target subscription is selected (`az account show`), and run:

```bash
az provider register --namespace Microsoft.Solutions
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

These commands work in both the PowerShell and Bash modes of Cloud Shell. To verify that all providers are registered, run:

```bash
az provider list --query "[?registrationState=='Registered'].namespace" --output table
```

### Optional feature providers

The prerequisites script also registers `Microsoft.CognitiveServices` when you pass `-DeployFoundry` or `-ConfigureAiAgent`. These providers are not registered automatically by that script; confirm with Proventeq whether they are needed for a separately scoped feature:

| Provider namespace | Required for |
| --- | --- |
| Microsoft.Compute | Migrator virtual machines |
| Microsoft.BotService | Only if required by the agreed AI feature deployment |

`Microsoft.CognitiveServices` is conditional as described above; the other two are not part of the prerequisites script's provider-registration list.

## Confirm Subscription Quota

**What this does:** The prerequisites script now performs an App Service plan quota preflight. It validates the configured Linux App Service SKU and capacity in `-Location` against the SKU limit and regional **Total Regional VMs** quota. Defaults are `-AppServicePlanSku B3` and `-AppServicePlanCapacity 1`; see [App Service quota check](./05-run-prerequisites-script.md#app-service-quota-check) for result states, failure behavior and remediation. A successful validation does not reserve quota, and deployment-time validation can still fail.

This check does **not** validate the other resources below. Confirm their quota and sizing separately with Proventeq and Azure before deployment:

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
