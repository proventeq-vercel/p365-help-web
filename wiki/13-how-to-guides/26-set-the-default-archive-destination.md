---
title: "How to Set the Default Archive Destination"
description: "How to choose the Wasabi or Azure Blob Storage connection and container that Proventeq365 archives to from Workspace Inventory and the Obsolete Documents report."
type: howto
updated: 2026-10-26
---

# How to Set the Default Archive Destination

Archiving that isn't driven by a policy — archiving sites from **Workspace Inventory**, or documents from the **Obsolete Documents** report — writes to a default destination. You choose it on the **Archiving Connections** screen: one Wasabi or Azure Blob Storage connection, and the container within it. Archive actions in policies keep using the connection and container set in each policy.

## Before you begin

- You need the **Tenant Admin** role.
- Your license must include the **Execute Policy** feature.
- The connection exists and has at least one container selected. See [How to Add an Archive Connection](./06-add-an-archive-connection.md).

## Steps

1. Open **Manage** → **Connections** and click **Manage default connections**.
2. Find the connection's card under **Wasabi connections** or **Azure Blob Storage connections**, and turn on **Available for archiving**. Any other storage connection that was enabled is turned off — only one can be the destination.
3. Expand the card if it isn't open. Under **Containers**, select the container archiving should write to. It is marked **Destination**. If you select none, the connection's first container is used.
4. Click **Save changes**.
5. If the page shows **Can't save — 1 connection has missing required settings.**, the connection has no containers. Add one in the connection editor, then save again.

## Result

The page shows **Archiving connections saved successfully.**, and the card shows **Available for archiving**. From now on, archiving from Workspace Inventory and the Obsolete Documents report writes to this connection and container, and their confirmation dialogs show **Archiving to** with the connection's name. Files archived earlier stay where they were written and are restored from there.

## Related

- [Connections — Archiving Connections](../02-manage/connections/README.md#archiving-connections)
- [How to Add an Archive Connection](./06-add-an-archive-connection.md)
- [Microsoft 365 Archive](../10-archive/02-microsoft-365-archive.md)
