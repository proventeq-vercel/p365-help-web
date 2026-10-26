---
title: "How to Archive Sites to Microsoft 365 Archive"
description: "How to move inactive SharePoint sites and OneDrives, or selected libraries and folders, into Microsoft 365 Archive from the Workspace Inventory site table in Proventeq365."
type: howto
updated: 2026-10-26
---

# How to Archive Sites to Microsoft 365 Archive

Proventeq365 can move whole SharePoint sites and OneDrives, or selected libraries, folders and files, into **Microsoft 365 Archive**, Microsoft's low-cost storage tier. You do it from the site table on **Workspace Inventory**: select the sites and archive them in one go, or open a site to archive part of it.

## Before you begin

- Microsoft 365 Archive is enabled in your Microsoft 365 tenant, with billing set up. See Microsoft's [Overview of Microsoft 365 Archive](https://learn.microsoft.com/en-us/microsoft-365/archive/archive-overview).
- Archiving to Microsoft 365 Archive is set up for your Proventeq365 tenant — ask Proventeq. If your organisation archives to a Wasabi or Azure Blob Storage connection instead, the archive dialog shows **Archiving to** and the connection's name, and content is copied there and replaced by stub links. See [Where Archived Content Goes](../10-archive/02-microsoft-365-archive.md#where-archived-content-goes).
- The workspace is a Microsoft 365 Governance (SharePoint) workspace and has had at least one data refresh.
- You need the **Workspace Admin** role on the workspace (or **Tenant Admin**).
- Your license must include the **Archive M365** feature.

## Steps

1. Select the workspace and open **Workspace Inventory**.
2. In the site table, check the **Last Active**, **Size** and **Archive status** columns to find the sites and OneDrives to archive. Click the **SharePoint Sites**, **OneDrives** or **Teams** card to narrow the table to that kind of site.
3. Tick the sites and OneDrives to archive, then click **Actions** above the table.
4. In **Bulk actions**, click **Archive**. Sites already **Archived** or **Archiving** are left out.
5. Read the **Archive sites** dialog — archiving is irreversible and long-running, and each site becomes read-only once archived — then click **Confirm**.
6. Wait while the dialog starts each site. Click **Stop** if you need to stop starting more; sites already started continue.
7. To archive only part of a site instead, click the site's name to open its side panel, tick the libraries, folders or files, and click **Archive selected**. Use **Archive site** in the panel to archive just that site.
8. Follow the archive on the **Actions** page, and check the site's **Archive status** in the site table.

## Result

The sites' **Archive status** changes to **Archiving**, then **Archived** — or **Failed** if a site could not be archived; open its run on the **Actions** page to see why. Archived content stays in your tenant in Microsoft 365 Archive, and no stub link is left in SharePoint. Content already in Microsoft 365 Archive is skipped. To bring a site back, reactivate it in Microsoft 365; Proventeq365 doesn't reactivate content from Microsoft 365 Archive.

To archive sites automatically instead, add the **M365 Archive** action to an **Inactive Sites Policy** or **Inactive OneDrives** policy.

## Related

- [Microsoft 365 Archive](../10-archive/02-microsoft-365-archive.md)
- [Workspace Inventory](../04-reports/workspace-inventory/README.md)
- [How to Add a Governance Policy](./05-add-a-governance-policy.md)
- [Error Messages: Connections, Archiving and Restore](../15-error-catalog/04-connections-and-archiving.md#workspace-inventory-and-microsoft-365-archive)
