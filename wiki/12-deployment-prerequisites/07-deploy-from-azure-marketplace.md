---
title: "Deploy from Azure Marketplace"
description: "Azure Marketplace deployment only — deploy Proventeq365 from Azure Marketplace using the Bootstrap Key Vault created by the prerequisites script, and find the managed resource group for the post-deployment script."
---

# Deploy from Azure Marketplace

> **Azure Marketplace deployment only.** For a direct deployment, see [Direct Deployment](./06-direct-deployment.md) instead.

**What this does:** Deploys Proventeq365 into your subscription as an Azure **managed application**. The deployment reads the app registration, client secret, certificate and container registry credentials from the Bootstrap Key Vault, so the wizard does not ask for them.

> **Before you start:** run the [prerequisites script](./05-run-prerequisites-script.md) and make sure admin consent has been granted.

## Steps

1. Open the **Proventeq365** offer in Azure Marketplace and select **Create**.
2. **Basics:** choose the subscription, a resource group and the region. A **new** resource group is fine; do **not** use the bootstrap resource group. The Bootstrap Key Vault must be in the subscription you select here.
3. **Prerequisites:**
   - In **Proventeq365 setup Key Vault**, select the **Bootstrap Key Vault** created by the prerequisites script (named `kv-p365boot-...` unless you chose your own name).
   - Select **Deploy Copilot Agent** **only** if you ran the prerequisites script with `-ConfigureAiAgent`.
4. **Configuration:**
   - **SQL Administrator** — choose whether the administrator is a user or an Entra group, and enter its **object ID** and **display name**.
   - **OCR Enrichment** — select to extract text from scanned documents and PDFs so they appear in search results.
   - **Public API** — select to allow integrations and automation through the Proventeq365 API.
5. Select **Review + create** → **Create**.

## Find the Managed Resource Group

The resource group you choose on the **Basics** tab holds the managed application itself. Azure creates a separate **managed resource group** for the Proventeq365 resources, typically named `mrg-<app-name>-<timestamp>`. The post-deployment script needs this managed resource group.

When the deployment finishes, open the **Managed Application** resource → **Overview** and note the **Managed resource group** name (for example `mrg-proventeq365-20261014101500`).

You can also list it in Cloud Shell:

```powershell
az managedapp list --query "[].{name:name, managedResourceGroupId:managedResourceGroupId}" -o table
```

> **Important:** Keep the **bootstrap resource group** after deployment. **Do not delete it.** It is needed for re-running the scripts and for certificate rotation.

Next: [Run the Post-Deployment Script](./08-run-post-deployment-script.md).
