---
title: "How to Add a Wasabi Archive Connection"
description: "How to connect Proventeq365 to Wasabi object storage and choose the bucket (container) where archived SharePoint content is stored."
type: howto
updated: 2026-10-26
---

# How to Add a Wasabi Archive Connection

Before Proventeq365 can archive content, it needs a **connection** to the storage where archived files are kept. Proventeq365 archives to **Wasabi** object storage. Add the connection under **Manage** → **Connections** with your Wasabi access key, secret key and region, then select the bucket (container) to archive into.

## Before you begin

- A Wasabi account with a bucket for archived content.
- A Wasabi **access key** and **secret key** with access to that bucket, and the bucket's **region** (for example `eu-west-1`).
- If outbound traffic from your Proventeq365 deployment is restricted, allow `*.wasabisys.com`. See [Outbound Connectivity](../12-deployment-prerequisites/03-azure-prerequisites.md#outbound-connectivity).

## Steps

1. Open **Manage** → **Connections** and click **Add Connection**.
2. Enter a **Display Name**, for example *Wasabi Archive*. Each connection name must be unique.
3. In **Storage System**, choose **Wasabi**.
4. Under **Connection Configuration**, enter the **Access Key**, **Secret Key** and **Region**.
5. Click **Save and Continue**. Proventeq365 validates the details and saves the connection.
6. On the containers step, expand a bucket to see its folders, then click **Select this container** for the bucket or folder that should hold archived content. Use **Refresh** if a bucket you created recently is not listed.
7. Check that the container appears under **Selected Containers**, then click **Close**.

## Result

The connection appears in the **Connections** list, and its container can be chosen as the **Target Connection** and **Target Container** of an archive action. If validation fails, see [Error Catalog — Connections](../15-error-catalog/README.md#connections).

## Related

- [Connections](../02-manage/connections/README.md)
- [How to Archive Obsolete Content](./07-archive-obsolete-content.md)
