---
title: "How to Add an Archive Connection (Wasabi or Azure Blob)"
description: "How to connect Proventeq365 to Wasabi or Azure Blob Storage and choose the bucket or container where archived SharePoint content is stored."
type: howto
updated: 2026-10-26
---

# How to Add an Archive Connection (Wasabi or Azure Blob)

Before Proventeq365 can archive content, it needs a **connection** to the storage where archived files are kept. Proventeq365 archives to **Wasabi** object storage or **Azure Blob Storage**. Add the connection under **Manage** → **Connections**, then select the bucket or container to archive into.

## Before you begin

- You need the **Tenant Admin** role to manage connections.
- For **Wasabi**: a bucket for archived content, an **access key** and **secret key** with access to it, and the bucket's **region** (for example `eu-west-1`). If outbound traffic from your deployment is restricted, allow `*.wasabisys.com`. See [Outbound Connectivity](../12-deployment-prerequisites/03-azure-prerequisites.md#outbound-connectivity).
- For **Azure Blob Storage**: a storage account and its **connection string** (in the Azure portal: **Access keys** → **Connection string**). The connection string must include the account key and must not be a shared access signature (SAS).

## Steps

1. Open **Manage** → **Connections** and click **Add Connection**.
2. Enter a **Display Name**, for example *Wasabi Archive*. Each connection name must be unique.
3. In **Storage System**, choose **Wasabi** or **Azure Blob Storage**.
4. Under **Connection Configuration**, enter the credentials:
   - Wasabi: the **Access Key**, **Secret Key** and **Region**.
   - Azure Blob Storage: paste the storage account's **connection string**.
5. Click **Save and Continue**. Proventeq365 validates the details and saves the connection.
6. On the containers step, expand a bucket or container to see its folders, then click **Select this container** for the one that should hold archived content. Use **Refresh** if one you created recently is not listed.
7. Check that the container appears under **Selected Containers**, then click **Close**.

## Result

The connection appears in the **Connections** list, and its container can be chosen as the **Target Connection** and **Target Container** of an archive action. If validation fails, see [Error Catalog — Connections](../15-error-catalog/04-connections-and-archiving.md#connections).

## Related

- [Connections](../02-manage/connections/README.md)
- [How to Archive Obsolete Content](./07-archive-obsolete-content.md)
