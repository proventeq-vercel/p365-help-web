---
title: "Cross-Tenant Deployment"
description: "Only applicable if your Azure subscription is in a different Microsoft Entra tenant from your Microsoft 365 tenant — run the deployment scripts with -AppTenantId and sign in to each tenant."
---

# Cross-Tenant Deployment (if applicable)

This section applies only if the **Azure subscription** that will host Proventeq365 is in a **different Microsoft Entra tenant** from your **Microsoft 365** tenant (where SharePoint is).

In that case the two tenants are used for different things:

| Tenant | Parameter | Used for |
| --- | --- | --- |
| Microsoft 365 tenant | `-AppTenantId` | The app registration, its permissions, admin consent, client secret and SharePoint certificate. |
| Subscription tenant | `-CustomerTenantId` | The Azure subscription, the bootstrap resource group and Bootstrap Key Vault, and the Marketplace deployment. |

The prerequisites script records the Microsoft 365 tenant in the Bootstrap Key Vault, so the deployed Proventeq365 authenticates against your Microsoft 365 tenant rather than the subscription tenant.

## Required access

The person running the scripts needs both of the following. If no single account holds both, split the work as described in [Admin consent](#admin-consent).

- **Global Administrator** or **Privileged Role Administrator** in the **Microsoft 365 tenant**.
- **Owner** on the subscription in the **subscription tenant**, plus the other Azure access listed in [Required Access](./03-azure-prerequisites.md#required-access).

## Signing in

Because the scripts switch between tenants, you sign in to each tenant with a **device code**: the script prints a sign-in URL and a code, you open the URL in a new browser tab, enter the code and approve, then return to Cloud Shell, which continues automatically. See [Signing In When Prompted](./05-run-prerequisites-script.md#signing-in-when-prompted-device-code). You do this once per tenant. If you are already signed in to a tenant, that sign-in is skipped.

## Prerequisites script

Add `-AppTenantId` with your Microsoft 365 tenant ID, and set `-CustomerTenantId` and `-SubscriptionId` to the subscription tenant:

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId <SUBSCRIPTION-TENANT-ID> -AppTenantId <M365-TENANT-ID> -SubscriptionId <SUBSCRIPTION-ID> -ResourceGroupName <BOOTSTRAP-RG-NAME> -KeyVaultName <BOOTSTRAP-KV-NAME> -ApplicationName "Proventeq365" -Location <REGION> -PermissionMode ReadWrite -AcrUsername <ACR-USERNAME> -AcrPassword (Read-Host -AsSecureString 'ACR password') -GrantAdminConsent
```

All other options from [Run the Prerequisites Script](./05-run-prerequisites-script.md), such as `-ConfigureAiAgent` or `-PermissionMode ReadOnly`, work the same way.

## Admin consent

Pass `-GrantAdminConsent` only if you are a Global Administrator or Privileged Role Administrator in the **Microsoft 365 tenant**. Otherwise omit it, and have an administrator of that tenant grant consent afterwards. In Cloud Shell they sign in to the Microsoft 365 tenant first:

```powershell
az login --tenant <M365-TENANT-ID>
az ad app permission admin-consent --id <APP-CLIENT-ID>
```

Consent can also be granted in the portal — see [Grant Admin Consent](./04-entra-app-registration.md#grant-admin-consent).

## Marketplace deployment

Deploy from Azure Marketplace in the **subscription tenant**, exactly as described in [Deploy from Azure Marketplace](./06-deploy-from-azure-marketplace.md).

## Post-deployment script

Add `-AppTenantId` here too, because the redirect URI is updated on the app registration in the Microsoft 365 tenant:

```powershell
./Proventeq365PostDeployment.ps1 -CustomerTenantId <SUBSCRIPTION-TENANT-ID> -AppTenantId <M365-TENANT-ID> -ResourceGroupName <MANAGED-RG-NAME> -MainAppClientId <APP-CLIENT-ID> -BootstrapKeyVaultId "<BOOTSTRAP-KEY-VAULT-RESOURCE-ID>"
```

The [notification mailbox](./07-run-post-deployment-script.md#notification-mailbox-optional) grant, if required, is run in the **Microsoft 365 tenant**.
