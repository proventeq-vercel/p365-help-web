---
title: "Troubleshooting"
description: "Messages you can safely ignore and fixes for common errors when running the Proventeq365 prerequisites script and, for an Azure Marketplace deployment, the Marketplace deployment and the post-deployment script."
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
| `-GrantAdminConsent requires Global Administrator or Privileged Role Administrator` | Use [Scenario E](./05-run-prerequisites-script.md#scenario-e--without-admin-consent), then ask a Global Administrator to [grant consent](./04-entra-app-registration.md#grant-admin-consent). |
| `More than one app named '<name>' in tenant <tenant>` | The script will not guess which app registration is yours. Use a more specific `-ApplicationName`, or rename or remove the duplicate app registration. |
| `Failed to write secret ... (Key Vault RBAC not ready?)` | You do not have **Owner** (or **User Access Administrator**) on the subscription, or the permission has not taken effect yet. Fix the access, wait a minute, then re-run the same command. |
| Key Vault name already in use / `VaultAlreadyExists` | Key Vault names are globally unique. Choose a different `-KeyVaultName`. |
| `Appliance Resource Provider SP not found` | **Direct deployment:** safe to ignore. **Marketplace deployment:** run `az provider register -n Microsoft.Solutions --wait`, then re-run the prerequisites script. See [Register Azure Resource Providers](./03-azure-prerequisites.md#register-azure-resource-providers). |
| `Managed Applications On Behalf Application SP not found` | **Direct deployment:** safe to ignore. **Marketplace deployment:** try the Marketplace deployment once (this creates the identity), then re-run the prerequisites script. |
| Marketplace deployment fails with `AuthorizationFailed ... Microsoft.KeyVault/vaults/read` | Re-run the prerequisites script with the same values. It grants access to both Appliance identities on the Key Vault. |
| Post-deployment: `No Front Door (Microsoft.Cdn/profiles) resource found` | Check that `-ResourceGroupName` is the **managed** resource group (`mrg-...`), not the bootstrap one. |
| Post-deployment: `PATCH ... spa.redirectUris` fails (403) | Your account needs **Application Administrator**, **Cloud Application Administrator** or **Global Administrator**, or must be an owner of the app registration. In a [cross-tenant deployment](./11-cross-tenant-deployment.md), these rights are needed in the Microsoft 365 tenant. |
| Post-deployment: certificate import fails | You need Key Vault access on **both** the bootstrap and product Key Vaults (for example **Key Vault Certificates Officer**). |
| Notification mailbox: `Exchange Online PowerShell is not connected` | Run `Connect-ExchangeOnline` first. See [Notification Mailbox](./09-notification-mailbox.md). |
| Notification mailbox: `No service principal for app ... in this tenant` | Admin consent has not been granted yet. [Grant consent](./04-entra-app-registration.md#grant-admin-consent), then run the grant again. |
