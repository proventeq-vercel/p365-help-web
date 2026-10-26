---
title: "Run the Post-Deployment Script"
description: "Marketplace deployment only — run Proventeq365PostDeployment.ps1 in Azure Cloud Shell after the Marketplace deployment to set the redirect URI, import the SharePoint certificate, and configure the AI agent."
---

# Run the Post-Deployment Script

> **Azure Marketplace deployment only.** In a [direct deployment](./06-direct-deployment.md), Proventeq completes these steps as part of the deployment and you do not run this script.

**What this does:** `Proventeq365PostDeployment.ps1` completes the values that only exist once the Marketplace deployment has finished. It:

1. Finds the live Proventeq365 URL (the Azure Front Door hostname).
2. Sets that URL as the app registration's **SPA redirect URI**, so users can sign in.
3. Imports the SharePoint certificate from the Bootstrap Key Vault into the **product Key Vault** in the managed resource group.
4. If the AI agent was deployed, points the AI agent at the Proventeq365 URL.

Run it in the same Cloud Shell session as the prerequisites script, or upload it again if the session has ended (see [Open Azure Cloud Shell](./05-run-prerequisites-script.md#open-azure-cloud-shell-and-upload-the-scripts)). If you have not downloaded it yet: [Proventeq365PostDeployment.ps1](/postdeploy/Proventeq365PostDeployment.ps1).

> **Before you start:** you need the **App (client) ID** and **Bootstrap Key Vault** resource ID from the [prerequisites script summary](./05-run-prerequisites-script.md#script-output--copy-these-values), and the **managed resource group** name from the [Marketplace deployment](./07-deploy-from-azure-marketplace.md#find-the-managed-resource-group).

## Parameters

| Parameter | Required | Value |
| --- | --- | --- |
| `-CustomerTenantId` | Yes | Your tenant ID |
| `-ResourceGroupName` | Yes | The **managed** resource group (`mrg-...`), **not** the bootstrap resource group |
| `-MainAppClientId` | Yes | **App (client) ID** from the prerequisites script summary |
| `-BootstrapKeyVaultId` | Yes (recommended) | **Bootstrap Key Vault** resource ID from the prerequisites script summary. Put it in double quotes. Without it the certificate import is skipped. |
| `-SubscriptionId` | Optional | Skips the subscription selection prompt |
| `-ConfigureAiAgent` | Optional | Only if the AI agent was deployed |
| `-SkipSpoCertificate` | Optional | Skips the certificate import, for example when only the redirect URI needs updating |
| `-ProductKeyVaultName` / `-FrontDoorProfileName` / `-AiAgentWebAppName` | Optional | Set the resource names explicitly when auto-detection finds more than one |

## Scenario 1 — Standard

Use this for most deployments.

**Command:**

```powershell
./Proventeq365PostDeployment.ps1 -CustomerTenantId <TENANT-ID> -ResourceGroupName <MANAGED-RG-NAME> -MainAppClientId <APP-CLIENT-ID> -BootstrapKeyVaultId "<BOOTSTRAP-KEY-VAULT-RESOURCE-ID>"
```

**Sample:**

```powershell
./Proventeq365PostDeployment.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName mrg-proventeq365-20261014101500 -MainAppClientId 6b2e9f14-3c7d-4a58-b1e0-7f9c2d4a8e61 -BootstrapKeyVaultId "/subscriptions/9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d/resourceGroups/rg-contoso-p365/providers/Microsoft.KeyVault/vaults/kv-p365boot-contoso01"
```

A successful run ends with a **SUMMARY** like this:

```text
================ SUMMARY ================
Resource group       : mrg-proventeq365-20261014101500
Frontend URL         : https://<frontdoor-endpoint>.azurefd.net
SPA redirect updated : True
SPO cert imported    : True
AI agent configured  : False
Mailbox grant run    : False
Log file: /home/<your-name>/logs/postdeploy-20261014-104500.log
```

The **Frontend URL** is the address of your Proventeq365 deployment.

## Scenario 2 — With the AI agent

```powershell
./Proventeq365PostDeployment.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName mrg-proventeq365-20261014101500 -MainAppClientId 6b2e9f14-3c7d-4a58-b1e0-7f9c2d4a8e61 -BootstrapKeyVaultId "/subscriptions/9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d/resourceGroups/rg-contoso-p365/providers/Microsoft.KeyVault/vaults/kv-p365boot-contoso01" -ConfigureAiAgent
```

## Scenario 3 — Update the redirect URI only

Use this to set the redirect URI again without re-importing the certificate:

```powershell
./Proventeq365PostDeployment.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName mrg-proventeq365-20261014101500 -MainAppClientId 6b2e9f14-3c7d-4a58-b1e0-7f9c2d4a8e61 -SkipSpoCertificate
```

## Scenario 4 — Specific subscription and resource names (no prompts)

```powershell
./Proventeq365PostDeployment.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -SubscriptionId 9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d -ResourceGroupName mrg-proventeq365-20261014101500 -MainAppClientId 6b2e9f14-3c7d-4a58-b1e0-7f9c2d4a8e61 -ProductKeyVaultName <PRODUCT-KV-NAME> -FrontDoorProfileName <FRONT-DOOR-PROFILE-NAME> -BootstrapKeyVaultId "/subscriptions/9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d/resourceGroups/rg-contoso-p365/providers/Microsoft.KeyVault/vaults/kv-p365boot-contoso01"
```

> **The post-deployment script is safe to run again.** Each run overwrites the same values.

Next: [Notification Mailbox](./09-notification-mailbox.md) if Proventeq365 should send email notifications, otherwise [Next Steps](./13-next-steps.md).
