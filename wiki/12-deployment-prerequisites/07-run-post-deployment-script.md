---
title: "Run the Post-Deployment Script"
description: "Run Proventeq365PostDeployment.ps1 in Azure Cloud Shell after the Marketplace deployment to set the redirect URI, import the SharePoint certificate, configure the AI agent, and optionally grant the notification mailbox."
---

# Run the Post-Deployment Script

> **Not applicable to a Proventeq-run deployment.** If Proventeq deploys Proventeq365 into your subscription for you, Proventeq carries out the post-deployment configuration and no action is required from you for this step.

**What this does:** `Proventeq365PostDeployment.ps1` completes the values that only exist once the Marketplace deployment has finished. It:

1. Verifies the subscription and managed resource group, then discovers the Front Door endpoint when redirect or AI configuration needs its URL. It installs the Azure CLI `cdn` extension if needed and uses the first endpoint returned.
2. Unless skipped, adds the URL as the main app's SPA redirect URI. In SaaS mode it also adds `/api/onboarding/callback` to the daemon app's web redirect URI when the daemon client ID is available.
3. Unless skipped, imports the SharePoint certificate from the Bootstrap Key Vault into the product Key Vault. This step is skipped with a warning when no bootstrap ID is supplied.
4. If the AI agent was deployed, points the AI agent at the Proventeq365 URL.

Run it in the same Cloud Shell session as the prerequisites script, or upload it again if the session has ended (see [Open Azure Cloud Shell](./05-run-prerequisites-script.md#open-azure-cloud-shell-and-upload-the-scripts)). If you have not downloaded it yet: [Proventeq365PostDeployment.ps1](/postdeploy/Proventeq365PostDeployment.ps1).

> **Before you start:** you need the **App (client) ID** and **Bootstrap Key Vault** resource ID from the [prerequisites script summary](./05-run-prerequisites-script.md#script-output--copy-these-values), and the **managed resource group** name from the [Marketplace deployment](./06-deploy-from-azure-marketplace.md#find-the-managed-resource-group).

The script requires Azure CLI (`az`) 2.53 or later. PowerShell 7 or later is recommended; it also supports Windows PowerShell 5.1 and Azure Cloud Shell.

## Parameters

| Parameter | Required | Default, allowed values and behavior |
| --- | --- | --- |
| `-CustomerTenantId` | Yes | Tenant containing the Azure subscription and managed resource group. |
| `-AppTenantId` | No | Defaults to `-CustomerTenantId`; use for the app-registration tenant in a cross-tenant deployment. |
| `-SubscriptionId` | No | Uses the only visible subscription or prompts if several are visible. |
| `-ResourceGroupName` | Yes | The deployed **managed** resource group (`mrg-...`), not the bootstrap resource group. |
| `-MainAppClientId` | Yes | App (client) ID from the prerequisites-script summary. |
| `-PlatformDaemonClientId` | No | SaaS daemon app client ID. If omitted with `-BootstrapKeyVaultId`, reads the value from that vault's `platformDaemonClientId` tag. |
| `-DeploymentMode` | No | Defaults to `Hosted`; with a valid `deploymentMode` tag, `-BootstrapKeyVaultId` overrides this value. Allowed: `Hosted`, `SaaS`. |
| `-BootstrapKeyVaultId` | No | Resource ID from the prerequisites-script summary. Required for certificate import and for reading the SaaS mode/daemon ID tags. Put the ID in double quotes. |
| `-ProductKeyVaultName` | No | Auto-detects the single `Microsoft.KeyVault/vaults` resource in the managed RG; prompts if there are several, or errors in `-NonInteractive` mode. |
| `-FrontDoorProfileName` | No | Auto-detects the single `Microsoft.Cdn/profiles` resource in the managed RG; prompts if there are several, or errors in `-NonInteractive` mode. |
| `-SkipFrontendRedirect` | No (default false) | Switch; skips redirect URI updates. Front Door discovery still occurs if `-ConfigureAiAgent` is set. |
| `-SkipSpoCertificate` | No (default false) | Switch; skips certificate import. |
| `-ConfigureAiAgent` | No (default false) | Switch; updates the AI agent Web App settings using the discovered Front Door URL. |
| `-AiAgentWebAppName` | No | Used with `-ConfigureAiAgent`; otherwise auto-detects a `Microsoft.Web/sites` name containing `-aiagent-`. |
| `-GrantNotificationMailbox` | No (default false) | Switch; runs `Grant-NotificationMailboxSend.ps1` from its expected relative path. Requires `-NotificationSenderMailbox`. In Cloud Shell, use the steps in [Notification Email](./08-notification-email.md) instead. |
| `-NotificationSenderMailbox` | No | Primary SMTP address; required with `-GrantNotificationMailbox`. |
| `-NonInteractive` | No (default false) | Disables subscription/resource selection prompts; provide `-SubscriptionId` and explicit names where discovery could be ambiguous. |
| `-LogFolder` | No | Defaults to a `logs` folder next to the script. |

## Access and execution flow

The operator needs access to list/read the subscription and managed resource group resources. Redirect updates run against Microsoft Graph in the app tenant and require permission to update the specified app registration (for example, be its owner or hold an appropriate app-management role). Certificate import needs permission to read the bootstrap certificate secret and import a certificate into the product Key Vault, such as **Key Vault Secrets User** on the bootstrap vault and **Key Vault Certificates Officer** on the product vault. With `-ConfigureAiAgent`, the operator also needs permission to update the Web App's app settings. In cross-tenant mode these Entra permissions are needed in `-AppTenantId`, while Azure resource and Key Vault access is in `-CustomerTenantId`.

The script selects the subscription, verifies the managed resource group, reads deployment mode and daemon client ID tags from the bootstrap vault when available, and discovers the Front Door URL if redirects or AI configuration need it. It then performs the SPA/callback updates, optional certificate import, optional AI settings update and optional mailbox grant, followed by a summary. `-SkipFrontendRedirect` and `-SkipSpoCertificate` skip only their corresponding actions; each action can also be rerun safely.

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

## Notification Email (optional)

To let Proventeq365 send email notifications from a mailbox in your tenant, follow [Notification Email](./08-notification-email.md). It applies to a Proventeq-run deployment too, because only your Exchange administrator can grant access to your mailbox.

> **Note:** `-GrantNotificationMailbox` runs `Grant-NotificationMailboxSend.ps1` from `../../Utilities/Scripts/PowerShell/` relative to the post-deployment script, which is where it sits in Proventeq's source repository. In Cloud Shell, run the grant script on its own as described in [Notification Email](./08-notification-email.md#steps).

Next: [Notification Email](./08-notification-email.md), or [Next Steps](./12-next-steps.md).
