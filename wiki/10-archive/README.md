---
title: "Archiving"
description: "The two ways to archive inactive SharePoint and OneDrive content with Proventeq365: Proventeq365 Archiving to Wasabi or Azure Blob Storage, and Microsoft 365 Archive, Microsoft's built-in SharePoint archive tier."
type: article
updated: 2026-10-26
---

# Archiving

Archiving takes content that is no longer used out of active SharePoint and OneDrive storage while keeping it available if it is needed again. Proventeq365 finds the content to archive — obsolete files, inactive sites, inactive OneDrives, old file versions — and offers two ways to archive it:

- **[Proventeq365 Archiving](./01-proventeq365-archiving.md)** — Proventeq365's own archiving capability. It copies files, with the versions you choose, to storage you own — **Wasabi** or **Azure Blob Storage** — removes them from SharePoint and leaves a stub link in their place. Users download, preview or restore archived files through Proventeq365.
- **[Microsoft 365 Archive](./02-microsoft-365-archive.md)** — Microsoft's out-of-the-box archive tier in SharePoint. Proventeq365 triggers it, but the archiving itself is done by Microsoft 365: sites, OneDrives and files are moved to the low-cost tier inside your own tenant and are reactivated in Microsoft 365.

## How They Compare

| | Proventeq365 Archiving | Microsoft 365 Archive |
| --- | --- | --- |
| **What it is** | A Proventeq365 capability | A Microsoft 365 capability in SharePoint, triggered by Proventeq365 |
| **Where archived content goes** | Your Wasabi or Azure Blob Storage container | Microsoft 365 Archive, inside your own tenant |
| **What stays in SharePoint** | A stub link at the file's original address, or nothing if **Replace with Stub** is off | The content stays where it is, in the archive tier; no stub |
| **What can be archived** | Files, with the versions you choose | Whole sites and OneDrives, or selected libraries, folders and files |
| **Where you start it** | The **Archive** action of a policy, **Archive selected** on the Obsolete Documents report, or Workspace Inventory | The **M365 Archive** action of a policy, or Workspace Inventory |
| **Getting content back** | Download or restore in Proventeq365 — one file from its stub link, or in bulk | Reactivate it in Microsoft 365 |
| **Storage costs** | Billed by your storage provider | Billed by Microsoft for Microsoft 365 Archive |
| **Prerequisites** | An archive connection with a container, set up by a Tenant Admin (license feature **Execute Policy**) | Microsoft 365 Archive enabled in your tenant with billing set up |
| **License features to archive** | **Execute Policy** for the **Archive** policy action; **Archive M365** for Workspace Inventory and **Archive selected** on the Obsolete Documents report | **Execute Policy** for the **M365 Archive** policy action; **Archive M365** for Workspace Inventory |
| **License features to get content back** | **Archive Items** to open, download and restore archived files | None in Proventeq365 — reactivate in Microsoft 365 |

> **Note:** Despite its name, the **Archive M365** license feature is what enables archiving from Workspace Inventory and the Obsolete Documents report, whichever destination your tenant uses — a Wasabi or Azure Blob Storage connection or Microsoft 365 Archive. Archiving from those screens also needs the **Workspace Admin** role (or **Tenant Admin**).

Both need Proventeq365 deployed in **Read-write** mode. See [Microsoft 365 Prerequisites — Archiving](../12-deployment-prerequisites/02-microsoft-365-prerequisites.md#archiving).

## Which One Workspace Inventory Uses

The policy actions name their target: **Archive** always uses Proventeq365 Archiving, and **M365 Archive** always uses Microsoft 365 Archive. The **Archive** actions on **Workspace Inventory** and **Archive selected** on the Obsolete Documents report follow your tenant's archiving setup instead:

- With a default destination chosen on [Archiving Connections](../02-manage/connections/README.md#archiving-connections), they use Proventeq365 Archiving to that connection and container.
- When Proventeq has set up your tenant for Microsoft 365 Archive, they use Microsoft 365 Archive.
- If neither is set up, the **Archive** actions are not offered.

## In This Section

1. [Proventeq365 Archiving](./01-proventeq365-archiving.md) — Archive to Wasabi or Azure Blob Storage: the archive action, stub links, executions and the archived file page.
2. [Microsoft 365 Archive](./02-microsoft-365-archive.md) — Move sites, OneDrives, libraries, folders and files to Microsoft's archive tier from Workspace Inventory or a policy.
3. [Restore Archived Content](./03-restore-archived-content.md) — Bring content archived with Proventeq365 Archiving back to SharePoint, one file at a time or in bulk.

## Related

- [How to Add an Archive Connection](../13-how-to-guides/06-add-an-archive-connection.md)
- [How to Archive Obsolete Content](../13-how-to-guides/07-archive-obsolete-content.md)
- [How to Archive Sites to Microsoft 365 Archive](../13-how-to-guides/24-archive-sites-to-microsoft-365-archive.md)
- [How to Restore an Archived File](../13-how-to-guides/08-restore-an-archived-file.md)
- [FAQ — Archiving](../16-faq/README.md#archiving)
