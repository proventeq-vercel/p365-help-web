---
title: "Run the Prerequisites Script"
description: "Run Proventeq365Prerequisites.ps1 in Azure Cloud Shell to configure SaaS or Hosted app registrations, validate App Service quota, and create the Bootstrap Key Vault before deployment."
---

# Run the Prerequisites Script

**What this does:** `Proventeq365Prerequisites.ps1` prepares what the Marketplace deployment needs. It configures the app registration(s) for the required deployment and permission modes, optionally grants admin consent, validates the App Service plan quota, and creates or reuses the bootstrap resource group and **Bootstrap Key Vault** containing deployment secrets and tags. The Marketplace deployment reads values from that vault, so no secrets are shared with Proventeq.

Run this script **before** you deploy Proventeq365 from Azure Marketplace. Your Proventeq contact provides the container registry (ACR) username and password.

> **Before you start:** confirm the person running the script has the access listed in [Required Access](./03-azure-prerequisites.md#required-access), and that you have the values listed in [Information to Collect](./03-azure-prerequisites.md#information-to-collect).

The prerequisites script requires Azure CLI (`az`) 2.53 or later. PowerShell 7 or later is recommended; Azure Cloud Shell PowerShell is supported. If running locally, sign in with `az login` before starting.

## Download the Scripts

Download both deployment scripts to your machine:

- [Proventeq365Prerequisites.ps1](/prerequisites/Proventeq365Prerequisites.ps1) — run before the Marketplace deployment.
- [Proventeq365PostDeployment.ps1](/postdeploy/Proventeq365PostDeployment.ps1) — run after the Marketplace deployment.

You upload both files to Azure Cloud Shell in the next step.

## Open Azure Cloud Shell and Upload the Scripts

### Step 1 — Sign in to the Azure portal

1. Go to **https://portal.azure.com**.
2. Sign in with the account that has the access listed in [Required Access](./03-azure-prerequisites.md#required-access).

### Step 2 — Open Cloud Shell

1. Select the **Cloud Shell** icon (`>_`) in the top navigation bar of the portal, next to the search box.

   ![The Cloud Shell icon in the Azure portal toolbar](images/cloud-shell-icon.png)

2. If this is your first time, choose **PowerShell**. When asked about storage, choose **No storage account required**, select your subscription, then select **Apply**.
3. If the toolbar shows **Switch to PowerShell**, select it. When you are already in PowerShell, the toolbar shows **Switch to Bash** and the prompt starts with `PS /home/<your-name>>`.

### Step 3 — Upload both scripts

1. In the Cloud Shell toolbar, select **Manage files** → **Upload**.
2. Select the downloaded `Proventeq365Prerequisites.ps1` and upload it.
3. Repeat for `Proventeq365PostDeployment.ps1`.

![Manage files menu in the Cloud Shell toolbar, with Upload highlighted](images/cloud-shell-upload.png)

### Step 4 — Check the files are there

Files are uploaded to your home folder. Run:

```powershell
ls ./Proventeq365*.ps1
```

You should see both script names listed.

> **The Cloud Shell session is temporary.** Files and logs are lost when the session ends. If you close Cloud Shell or it times out, upload the scripts again. To keep the logs, download them from the `logs` folder with **Manage files** → **Download** before closing (for example, `logs/prereq-20261014-101500.log`).

## Signing In When Prompted (Device Code)

Cloud Shell is already signed in with your portal account, so **usually no extra sign-in is needed**. If the script needs to sign in again — for example because Cloud Shell is connected to a different directory — it pauses and shows a message like:

```text
To sign in, use a web browser to open the page https://login.microsoft.com/device and enter the code XXXXXXXXX to authenticate.
```

1. Copy the **URL** and the **code** from the message.
2. Open **https://login.microsoft.com/device** in a new browser tab, paste the code and select **Next**.
3. Choose your account. When asked *"Are you trying to sign in to Microsoft Azure CLI?"*, select **Continue**.
4. Return to Cloud Shell. If it asks you to **Select a subscription and tenant**, type the number for your tenant and press **Enter**.

## Run the Script

### How the commands work

- Each command is on **one line**. Copy the whole line, replace the sample values with your own and press **Enter**.
- `-AcrPassword (Read-Host -AsSecureString 'ACR password')` asks for the ACR password as hidden input. **Do not type the password into the command itself.**
- If you have more than one subscription and did not pass `-SubscriptionId`, the script lists them. Type the number of the correct subscription and press **Enter**.

### Parameters

| Parameter | Required | Default, allowed values and behavior |
| --- | --- | --- |
| `-CustomerTenantId` | Yes | Tenant containing the Azure subscription, resource group and Bootstrap Key Vault. |
| `-AppTenantId` | No | Defaults to `-CustomerTenantId`; use for the Microsoft 365 / app tenant in a cross-tenant deployment. |
| `-SubscriptionId` | No | If omitted, uses the only visible subscription or prompts when several are visible; with `-NonInteractive`, multiple subscriptions cause an error. |
| `-ApplicationName` | Yes | App name; 1–63 characters, starts with a letter or number, then letters, numbers, spaces, `.`, `_` or `-`. |
| `-ResourceGroupName` | No | Defaults to `rg-proventeq365-<normalized-application-name>`. Use a normal resource group, not a managed resource group. |
| `-Location` | Yes | Azure region for the bootstrap resource group, Key Vault and App Service quota probe. |
| `-PermissionMode` | Yes | `ReadOnly` or `ReadWrite`; selects the permission profile. |
| `-AcrUsername` | Yes | Pull username supplied by Proventeq. |
| `-AcrPassword` | Yes | `[securestring]`; use the hidden `Read-Host` prompt shown above. |
| `-PlatformAdminObjectId` | No | Defaults to the signed-in user in the app tenant. |
| `-DeploymentMode` | Yes | `SaaS` or `Hosted`; no default. See [Deployment Mode](./02-microsoft-365-prerequisites.md#deployment-mode). |
| `-SwitchMode` | No (default false) | Allows converting an existing Bootstrap Key Vault tagged with the other deployment mode. Without it, a mismatch stops the run; an existing vault with no mode tag is treated as `Hosted`. |
| `-ConfigureAiAgent` | No (default false) | Creates/configures the AI agent app and secret. Hosted-only; the script rejects this switch with `SaaS`. |
| `-GrantAdminConsent` | No (default false) | Grants consent to the required app(s). Requires Global Administrator or Privileged Role Administrator in the app tenant. |
| `-MultiTenant` / `-SingleTenant` | No (each defaults false) | Backward-compatible selectors for `SaaS` / `Hosted`. Supply at most one, and it must agree with `-DeploymentMode`; normally omit both. |
| `-KeyVaultName` | No | Defaults to a deterministic `kv-p365boot-...` name derived from application and subscription. Explicit names must meet Azure Key Vault naming rules: 3–24 letters, numbers or hyphens, starting with a letter and ending with a letter or number; names are globally unique. |
| `-ForceNewCert` | No (default false) | Rotates the client secret and SharePoint certificate; also rotates the AI agent secret when `-ConfigureAiAgent` is used. |
| `-RemoveBootstrapKeyVault` | No (default false) | Deletes and purges the Bootstrap Key Vault after setup; leaves the resource group. Do not use for a deployment that will consume this vault. |
| `-NonInteractive` | No (default false) | Prevents subscription selection prompts; provide `-SubscriptionId` if more than one subscription is visible. |
| `-DeployFoundry` | No (default false) | Sets the `deployFoundry` tag to true and registers `Microsoft.CognitiveServices` (also registered with `-ConfigureAiAgent`); it does not itself run the Marketplace deployment. |
| `-StaticWebAppRegion` | No | Defaults to `westeurope`; validates the Static Web App region and stores it in the `staticWebAppRegion` tag. |
| `-LogFolder` | No | Defaults to a `logs` folder next to the script. |
| `-AppServicePlanSku` | No | Defaults to `B3`. Allowed: `B1`, `B2`, `B3`, `S1`, `S2`, `S3`, `P0v3`, `P1v3`, `P2v3`, `P3v3`, `P0v4`, `P1v4`, `P2v4`, `P3v4`. |
| `-AppServicePlanCapacity` | No | Defaults to `1`; must be an integer of at least 1. |
| `-FailOnAppServicePlanQuota` | No | Defaults to true. Use `-FailOnAppServicePlanQuota:$false` only to continue after a failed/unknown quota probe; deployment can still fail. |
| `-CreateDeployUser` | No (default false) | Creates or reuses the optional deployment user; skipped for cross-tenant deployments. |
| `-DeployUserName` | No | Defaults to `proventeq365-deploy`; 1–64 letters, numbers, `_` or `-`, starting with a letter or number. |
| `-DeployUserDisplayName` | No | Defaults to `Proventeq365 Deployment User`; must not be empty. |

### Deployment mode examples

`-DeploymentMode` is mandatory on every prerequisites-script command. Use exactly one of these values:

**Hosted (single-tenant):**

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId <TENANT-ID> -ApplicationName "Proventeq365" -Location <REGION> -PermissionMode ReadWrite -DeploymentMode Hosted -AcrUsername <ACR-USERNAME> -AcrPassword (Read-Host -AsSecureString 'ACR password')
```

**SaaS (multi-tenant):**

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId <TENANT-ID> -ApplicationName "Proventeq365" -Location <REGION> -PermissionMode ReadWrite -DeploymentMode SaaS -AcrUsername <ACR-USERNAME> -AcrPassword (Read-Host -AsSecureString 'ACR password')
```

The SaaS mode creates a separate platform daemon app. `-ConfigureAiAgent` is currently Hosted-only.

### App Service quota check

Before creating the Bootstrap Key Vault, the script validates a Linux `Microsoft.Web/serverfarms` plan using `-AppServicePlanSku` and `-AppServicePlanCapacity` in `-Location`. It checks whether Azure Resource Manager accepts that SKU and capacity against the App Service SKU limit and the regional **Total Regional VMs** limit. The default probe is `B3`, capacity `1`. It validates; it does not create a plan or reserve quota. A success log says the SKU/capacity was validated, and the summary reports `Available`.

For `NoQuota` or `NotAvailable`, the script tests the other allowed SKUs; the table can contain `Available`, `NoQuota`, `NoRegionalQuota`, `NotAvailable`, `BlockedByPolicy` or `Error`. For `NoRegionalQuota`, it does not test alternatives because all SKUs use the same exhausted regional pool. It prints advice and does not change the SKU or region. For `NoQuota`, request an increase to that SKU in **Azure portal → Quotas → App Service**, or select a validated SKU and make the Marketplace plan selection match it. For `NoRegionalQuota`, do not request the regional total directly: request a small increase to the selected SKU limit and wait for the regional total to increase; if it does not, open a **Service and subscription limits (quotas) → Function or Web App (Windows and Linux)** support request. For `NotAvailable`, choose a supported SKU/region; for `BlockedByPolicy`, ask the subscription administrator to resolve the restriction. Resolve `Error` before relying on the check because quota is unknown.

With the default `-FailOnAppServicePlanQuota` behavior, a non-`Available` result ends with an error in this form:

```text
App Service Plan quota check failed for '<SKU>' in '<REGION>' (<RESULT>). Credentials and tags were saved in '<KEY-VAULT>'; cleanup was not run.
```

Credentials and tags are saved before this error, but the Appliance Resource Provider grants and optional deploy-user setup have not run. The check table and log contain the quota result and recommended action; the script's final summary is not reached when it stops here. Setting `-FailOnAppServicePlanQuota:$false` logs a warning and continues to the final summary; the Marketplace deployment may then fail when it creates the plan. Even a successful probe is not a quota reservation and deployment-time validation may still fail.

### Optional deployment user

Use `-CreateDeployUser` only when you want the prerequisites script to create/reuse a dedicated same-tenant deployment identity. The default UPN is `proventeq365-deploy@<initial-tenant>.onmicrosoft.com`; customize its local name with `-DeployUserName` and display name with `-DeployUserDisplayName`. The script generates a password, stores it as a secret in the Bootstrap Key Vault (it never prints the password), tags the vault with the UPN, and ensures the user has **Owner** on the bootstrap resource group. It does not change app or service-principal owner lists. In cross-tenant mode this option is skipped.

The person running the script needs **User Administrator** (or a suitable higher directory role) and Microsoft Graph user-write permissions to create the account. They also need Azure permissions that allow role assignments at the resource-group and Key Vault scopes (normally subscription **Owner**, or **Contributor** plus **User Access Administrator**). This is a privileged identity: an RG Owner can grant itself Key Vault data access and reach deployment credentials. Enforce MFA and Conditional Access, and treat the generated identity accordingly. If an existing user is reused but its vault password secret is missing, the script does not reset its password; it reports that a manual reset and vault update are needed.

Example using the default deploy-user name and display name:

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId <TENANT-ID> -ApplicationName "Proventeq365" -Location <REGION> -PermissionMode ReadWrite -DeploymentMode Hosted -AcrUsername <ACR-USERNAME> -AcrPassword (Read-Host -AsSecureString 'ACR password') -CreateDeployUser
```

### Run order and output

The script signs in to the app tenant and checks directory roles, then resolves the subscription and Bootstrap Key Vault and checks existing secrets before creating or rotating credentials. It configures the app registration(s), API permissions and optional consent in the app tenant. In the subscription tenant it registers required resource providers, creates/reuses the bootstrap resource group, validates the Static Web App region and App Service plan quota, creates/reuses the Bootstrap Key Vault, writes secrets and tags, grants Key Vault access to the Marketplace identities, and finally handles the optional deploy user. The SaaS flow includes the separate platform daemon app; Hosted uses one app.

When the run completes, the final summary prints a per-step status table plus tenant IDs, subscription, resource group, Bootstrap Key Vault resource ID, app and daemon IDs, deployment and permission modes, audience/scope, secret name, Foundry and Static Web App settings, App Service quota details and deploy-user status. Use the printed Bootstrap Key Vault resource ID in the Marketplace picker and later for `-BootstrapKeyVaultId`.

### Scenario A — Standard (Read-write, with admin consent)

Use this for most deployments.

**Command:**

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId <TENANT-ID> -ResourceGroupName <BOOTSTRAP-RG-NAME> -KeyVaultName <BOOTSTRAP-KV-NAME> -ApplicationName "Proventeq365" -Location <REGION> -PermissionMode ReadWrite -DeploymentMode Hosted -AcrUsername <ACR-USERNAME> -AcrPassword (Read-Host -AsSecureString 'ACR password') -GrantAdminConsent
```

**Sample:**

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName rg-contoso-p365 -KeyVaultName kv-p365boot-contoso01 -ApplicationName "Proventeq365" -Location uksouth -PermissionMode ReadWrite -DeploymentMode Hosted -AcrUsername p365-contoso-pull -AcrPassword (Read-Host -AsSecureString 'ACR password') -GrantAdminConsent
```

### Scenario B — Read-only permissions

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName rg-contoso-p365 -KeyVaultName kv-p365boot-contoso01 -ApplicationName "Proventeq365" -Location uksouth -PermissionMode ReadOnly -DeploymentMode Hosted -AcrUsername p365-contoso-pull -AcrPassword (Read-Host -AsSecureString 'ACR password') -GrantAdminConsent
```

### Scenario C — With the AI agent (Copilot)

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName rg-contoso-p365 -KeyVaultName kv-p365boot-contoso01 -ApplicationName "Proventeq365" -Location uksouth -PermissionMode ReadWrite -DeploymentMode Hosted -AcrUsername p365-contoso-pull -AcrPassword (Read-Host -AsSecureString 'ACR password') -GrantAdminConsent -ConfigureAiAgent
```

This also creates a second app registration named `Proventeq365 AI Agent`. If you use this scenario, also select **Deploy Copilot Agent** in the [Marketplace deployment](./06-deploy-from-azure-marketplace.md) and pass `-ConfigureAiAgent` to the [post-deployment script](./07-run-post-deployment-script.md).

### Scenario D — Use a specific subscription (no selection prompt)

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -SubscriptionId 9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d -ResourceGroupName rg-contoso-p365 -KeyVaultName kv-p365boot-contoso01 -ApplicationName "Proventeq365" -Location uksouth -PermissionMode ReadWrite -DeploymentMode Hosted -AcrUsername p365-contoso-pull -AcrPassword (Read-Host -AsSecureString 'ACR password') -GrantAdminConsent
```

### Scenario E — Without admin consent

Use this when the person running the script is not a Global Administrator or Privileged Role Administrator. Run the script without `-GrantAdminConsent`. To create the app, you need at least **Application Administrator** or **Cloud Application Administrator**.

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName rg-contoso-p365 -KeyVaultName kv-p365boot-contoso01 -ApplicationName "Proventeq365" -Location uksouth -PermissionMode ReadWrite -DeploymentMode Hosted -AcrUsername p365-contoso-pull -AcrPassword (Read-Host -AsSecureString 'ACR password')
```

Then a Global Administrator grants consent using the **App (client) ID** from the script summary — see [Grant Admin Consent](./04-entra-app-registration.md#grant-admin-consent).

> **Important:** Proventeq365 cannot access Microsoft 365 or SharePoint until admin consent is granted.

### Scenario F — Rotate the client secret and SharePoint certificate

```powershell
./Proventeq365Prerequisites.ps1 -CustomerTenantId 3f6c1a2b-8d4e-4c7a-9b21-5e0f7d9a1c34 -ResourceGroupName rg-contoso-p365 -KeyVaultName kv-p365boot-contoso01 -ApplicationName "Proventeq365" -Location uksouth -PermissionMode ReadWrite -DeploymentMode Hosted -AcrUsername p365-contoso-pull -AcrPassword (Read-Host -AsSecureString 'ACR password') -GrantAdminConsent -ForceNewCert
```

> **It is safe to run the script again.** It reuses the existing app, resource group and Key Vault. Missing secrets are created; pass `-ForceNewCert` to rotate existing client, certificate and (when enabled) AI-agent secrets. Use the **same** `-ApplicationName`, `-ResourceGroupName` and `-KeyVaultName` every time. After a certificate rotation, run the [post-deployment script](./07-run-post-deployment-script.md) again to import it.

## Script Output — Copy These Values

When the script finishes, it shows a **SUMMARY**. Copy these two values — you need them in the next stages:

| Summary line | Used for | Example |
| --- | --- | --- |
| **Bootstrap Key Vault** | The Marketplace deployment, and `-BootstrapKeyVaultId` in the post-deployment script | `/subscriptions/9a8b7c6d-1e2f-4a3b-8c9d-0e1f2a3b4c5d/resourceGroups/rg-contoso-p365/providers/Microsoft.KeyVault/vaults/kv-p365boot-contoso01` |
| **App (client) ID** | `-MainAppClientId` in the post-deployment script | `6b2e9f14-3c7d-4a58-b1e0-7f9c2d4a8e61` |

Next: [Deploy from Azure Marketplace](./06-deploy-from-azure-marketplace.md).
