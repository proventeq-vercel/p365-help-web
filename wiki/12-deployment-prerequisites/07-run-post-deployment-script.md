---
title: "Run the Post-Deployment Script"
description: "Run Proventeq365PostDeployment.ps1 in Azure Cloud Shell after the Marketplace deployment to set the redirect URI, import the SharePoint certificate, configure the AI agent, and optionally grant the notification mailbox."
---

# Run the Post-Deployment Script

**What this does:** `Proventeq365PostDeployment.ps1` completes the values that only exist once the Marketplace deployment has finished. It:

1. Finds the live Proventeq365 URL (the Azure Front Door hostname), or uses your custom domain.
2. Sets that URL as the app registration's **SPA redirect URI**, so users can sign in.
3. Imports the SharePoint certificate from the Bootstrap Key Vault into the **product Key Vault** in the managed resource group.
4. If the AI agent was deployed, points the AI agent at the Proventeq365 URL.

Run it in the same Cloud Shell session as the prerequisites script, or upload it again if the session has ended (see [Open Azure Cloud Shell](./05-run-prerequisites-script.md#open-azure-cloud-shell-and-upload-the-scripts)).

> **Before you start:** you need the **App (client) ID** and **Bootstrap Key Vault** resource ID from the [prerequisites script summary](./05-run-prerequisites-script.md#script-output--copy-these-values), and the **managed resource group** name from the [Marketplace deployment](./06-deploy-from-azure-marketplace.md#find-the-managed-resource-group).

## Parameters

| Parameter | Required | Value |
| --- | --- | --- |
| `-CustomerTenantId` | Yes | Your tenant ID |
| `-ResourceGroupName` | Yes | The **managed** resource group (`mrg-...`), **not** the bootstrap resource group |
| `-MainAppClientId` | Yes | **App (client) ID** from the prerequisites script summary |
| `-BootstrapKeyVaultId` | Yes (recommended) | **Bootstrap Key Vault** resource ID from the prerequisites script summary. Put it in double quotes. Without it the certificate import is skipped. |
| `-SubscriptionId` | Optional | Skips the subscription selection prompt |
| `-ConfigureAiAgent` | Optional | Only if the AI agent was deployed |
| `-CustomUrl` | Optional | Custom domain to use instead of the Front Door hostname |
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

## Scenario 3 — Custom domain already mapped

```powershell
./Proventeq365PostDeployment.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName mrg-proventeq365-20261014101500 -MainAppClientId 6b2e9f14-3c7d-4a58-b1e0-7f9c2d4a8e61 -BootstrapKeyVaultId "/subscriptions/9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d/resourceGroups/rg-contoso-p365/providers/Microsoft.KeyVault/vaults/kv-p365boot-contoso01" -CustomUrl https://p365.contoso.com
```

## Scenario 4 — Update the redirect URI only

For example, after the Proventeq365 URL has changed:

```powershell
./Proventeq365PostDeployment.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName mrg-proventeq365-20261014101500 -MainAppClientId 6b2e9f14-3c7d-4a58-b1e0-7f9c2d4a8e61 -SkipSpoCertificate
```

## Scenario 5 — Specific subscription and resource names (no prompts)

```powershell
./Proventeq365PostDeployment.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -SubscriptionId 9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d -ResourceGroupName mrg-proventeq365-20261014101500 -MainAppClientId 6b2e9f14-3c7d-4a58-b1e0-7f9c2d4a8e61 -ProductKeyVaultName <PRODUCT-KV-NAME> -FrontDoorProfileName <FRONT-DOOR-PROFILE-NAME> -BootstrapKeyVaultId "/subscriptions/9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d/resourceGroups/rg-contoso-p365/providers/Microsoft.KeyVault/vaults/kv-p365boot-contoso01"
```

> **The post-deployment script is safe to run again.** Each run overwrites the same values.

## Notification Mailbox (optional)

> **Applies only if** Proventeq365 should send email notifications.

Proventeq365 sends notification emails from **one** mailbox in your tenant. Instead of an organisation-wide `Mail.Send` permission in Entra ID, access is granted with **Exchange Online RBAC for Applications**: a management scope containing only that mailbox, and the *Application Mail.Send* role assigned to the Proventeq365 app over that scope. The app can then send from that mailbox and no other.

> **Important:** Do **not** also add `Mail.Send` as an application permission on the app registration. Exchange Online combines the two grants, so an Entra ID grant would let the app send as every mailbox in your tenant.

### What you need

- The **Exchange Online Organization Management** role group.
- Admin consent already granted to the app registration (see [Grant Admin Consent](./04-entra-app-registration.md#grant-admin-consent)).
- The grant script `Grant-NotificationMailboxSend.ps1`, provided by Proventeq. Upload it to Cloud Shell in the same way as the other two scripts.

### Steps

Run these commands in Cloud Shell (**PowerShell**).

1. Sign in to Exchange Online:

   ```powershell
   Connect-ExchangeOnline
   ```

2. If the sender mailbox does not exist yet, create it as a **shared mailbox**. A shared mailbox needs no licence up to 50 GB.

   ```powershell
   New-Mailbox -Shared -Name "Proventeq365" -PrimarySmtpAddress proventeq365@contoso.com
   ```

3. Look up the object ID of the Proventeq365 app's service principal, using the **App (client) ID** from the prerequisites script summary:

   ```powershell
   $spId = az ad sp show --id <APP-CLIENT-ID> --query id -o tsv
   ```

4. Grant the app permission to send from that mailbox:

   ```powershell
   ./Grant-NotificationMailboxSend.ps1 -AppId <APP-CLIENT-ID> -SenderMailbox proventeq365@contoso.com -ServicePrincipalObjectId $spId
   ```

5. Tell your Proventeq contact the sender mailbox address, so it can be configured as the notification sender for your tenant.

The grant can take **30 minutes to 2 hours** to take effect, because Exchange Online caches application permissions. The script is safe to run again: an existing scope or assignment is reused.

> **Note:** `Proventeq365PostDeployment.ps1` also has a `-GrantNotificationMailbox` switch that runs the same grant. It expects the grant script in a fixed folder layout relative to itself, which an upload to the Cloud Shell home folder does not provide, so run the grant script directly as shown above.

Next: [Next Steps](./11-next-steps.md).
