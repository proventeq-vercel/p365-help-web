---
title: "Troubleshooting"
description: "Messages you can safely ignore and fixes for common errors when running the Proventeq365 prerequisites script, the Marketplace deployment, and the post-deployment script."
---

# Troubleshooting

Both scripts write a log file to the `logs` folder next to the script (`logs/prereq-<timestamp>.log` and `logs/postdeploy-<timestamp>.log`). If you need help from Proventeq, download the log with **Manage files** → **Download** before closing Cloud Shell and share it with your Proventeq contact. The logs never contain secret values.

## Messages You Can Safely Ignore

| Message | Meaning |
| --- | --- |
| `WARNING: TenantId '...' contains more than one active subscription. First one will be selected...` | This is Cloud Shell's default selection. The script asks you to choose the correct subscription. |
| `WARNING: You're using Az version x.x.x. The latest version of Az is ...` | Information only. No action needed. |
| `Azure CLI cdn extension is not installed. Installing...` | The post-deployment script installs the extension it needs automatically. |

## Common Problems

| Problem | Fix |
| --- | --- |
| `The term './Proventeq365Prerequisites.ps1' is not recognized` | The file is not in the current folder. Run `cd ~` then `ls`, and upload the file again if it is missing. |
| The script prompts for `DeploymentMode`, or reports an invalid mode | Pass the mandatory `-DeploymentMode Hosted` or `-DeploymentMode SaaS` value. Also pass the separate mandatory `-PermissionMode ReadOnly` or `-PermissionMode ReadWrite`. |
| `-GrantAdminConsent requires Global Administrator or Privileged Role Administrator` | Use [Scenario E](./05-run-prerequisites-script.md#scenario-e--without-admin-consent), then ask a Global Administrator to [grant consent](./04-entra-app-registration.md#grant-admin-consent). |
| `-ConfigureAiAgent is Hosted-only until the agent authenticates as the platform daemon.` | Remove `-ConfigureAiAgent` when using `-DeploymentMode SaaS`, or use Hosted mode if that matches the deployment agreed with Proventeq. |
| `Vault '<name>' is Hosted; pass -SwitchMode to convert it to SaaS` (or the reverse) | Confirm the intended deployment mode first. Pass `-SwitchMode` only when intentionally converting the existing Bootstrap Key Vault and app configuration. A vault without a `deploymentMode` tag is treated as Hosted. |
| `More than one app named '<name>' in tenant <tenant>` | The script will not guess which app registration is yours. Use a more specific `-ApplicationName`, or rename or remove the duplicate app registration. |
| `Failed to write secret ... (Key Vault RBAC not ready?)` | You do not have **Owner** (or **User Access Administrator**) on the subscription, or the permission has not taken effect yet. Fix the access, wait a minute, then re-run the same command. |
| `App Service Plan quota check failed for '<sku>' in '<region>' (<result>)` | Read the preceding quota table and advice. Request the required App Service SKU increase, address regional quota or policy, or choose a validated SKU and make the Marketplace plan match. The script saved credentials and tags before stopping, but did not grant the Marketplace identities or create the optional deploy user. See [App Service quota check](./05-run-prerequisites-script.md#app-service-quota-check). |
| `Deploy-user creation was forbidden` or `Deploy-user creation failed; raw response suppressed...` | The signed-in identity needs **User Administrator** (or a suitable higher role) and Graph user-write permissions in the app tenant, plus Azure role-assignment rights. Check the directory password policy if permissions are correct. |
| Existing deployment user is reused, but the password secret is missing | The script deliberately does not reset an existing user's password. Reset it manually and update the corresponding Bootstrap Key Vault secret before using that identity. |
| Key Vault name already in use / `VaultAlreadyExists` | Key Vault names are globally unique. Choose a different `-KeyVaultName`. |
| `Appliance Resource Provider SP not found` | Run `az provider register -n Microsoft.Solutions --wait`, then re-run the prerequisites script. See [Register Azure Resource Providers](./03-azure-prerequisites.md#register-azure-resource-providers). |
| `Managed Applications On Behalf Application SP not found` | Try the Marketplace deployment once (this creates the identity), then re-run the prerequisites script. |
| Marketplace deployment fails with `AuthorizationFailed ... Microsoft.KeyVault/vaults/read` | Re-run the prerequisites script with the same values. It grants access to both Appliance identities on the Key Vault. |
| Post-deployment: `No Front Door (Microsoft.Cdn/profiles) resource found` | Check that `-ResourceGroupName` is the **managed** resource group (`mrg-...`), not the bootstrap one. |
| Post-deployment: `Front Door profile '<name>' has no endpoints` | Confirm Front Door deployment completed and the selected profile has an endpoint, then rerun the post-deployment script. |
| Post-deployment: `No Key Vault found in '<resource-group>'` | Confirm the managed resource group and product Key Vault deployment. If more than one exists, supply `-ProductKeyVaultName`; in `-NonInteractive` mode, explicit resource names are required when discovery is ambiguous. |
| Post-deployment: `Bootstrap Key Vault '<name>' has no '<secret>' secret` | Confirm `-BootstrapKeyVaultId` is the vault created by the current prerequisites run and that its certificate secret exists. Check the vault's `platformDaemonCertificateName` tag; rerun prerequisites with the same mode if the certificate is missing. |
| Post-deployment: `-GrantNotificationMailbox requires -NotificationSenderMailbox.` | Supply the sender mailbox's primary SMTP address with `-NotificationSenderMailbox`. |
| Post-deployment: `Grant-NotificationMailboxSend.ps1 not found at ...` | `-GrantNotificationMailbox` looks for the grant script in the folder layout of Proventeq's source repository, which Cloud Shell does not have. Run [Grant-NotificationMailboxSend.ps1](/postdeploy/Grant-NotificationMailboxSend.ps1) on its own, as described in [Notification Email](./08-notification-email.md#steps). |
| Post-deployment: `PATCH ... spa.redirectUris` fails (403) | Your account needs **Application Administrator**, **Cloud Application Administrator** or **Global Administrator**, or must be an owner of the app registration. In a [cross-tenant deployment](./10-cross-tenant-deployment.md), these rights are needed in the Microsoft 365 tenant. |
| Post-deployment: certificate import fails | You need Key Vault access on **both** the bootstrap and product Key Vaults (for example **Key Vault Certificates Officer**). |
| Notification mailbox: `Exchange Online PowerShell is not connected` | Run `Connect-ExchangeOnline` first. See [Notification Email](./08-notification-email.md#steps). |
| Notification mailbox: `No service principal for app ... in this tenant` | Admin consent has not been granted yet. [Grant consent](./04-entra-app-registration.md#grant-admin-consent), then run the grant again. |
| Notification mailbox: `Get-Mailbox` reports that the mailbox couldn't be found | The address is not a mailbox in the tenant you signed in to with `Connect-ExchangeOnline`. Create the shared mailbox first, or sign in to the Microsoft 365 tenant that holds it. |
| Notification mailbox: the check at the end shows **InScope** as **False**, or no email arrives | Exchange Online can take 30 minutes to 2 hours to apply the grant. Run the grant script again later to repeat the check. Email also needs Proventeq to have turned it on; see [Check That It Works](./08-notification-email.md#check-that-it-works). |
