---
title: "How to Restore an Archived File"
description: "How to download or restore a file that Proventeq365 archived from SharePoint, using the stub link left in the file's original location."
type: howto
updated: 2026-10-26
---

# How to Restore an Archived File

When Proventeq365 archives a file, it can leave a **stub link** in the file's original SharePoint location. Opening the stub link takes you to the archived file's page, where you can **download** the current or an earlier version (the file stays archived) or **restore** it to its original location (the file is removed from the archive and becomes active again).

## Before you begin

- The file must have been archived with **Replace with Stub** enabled. See [How to Archive Obsolete Content](./07-archive-obsolete-content.md).
- You need permission to open the stub link in SharePoint. Anyone who can open the stub can download or restore the file; other users see *Access denied - you do not have permission to download this item*.
- To restore many files at once — in bulk, by scope or for a whole workspace — you need the **Workspace Admin** role.

## Steps

1. In SharePoint, open the library and folder where the file was originally stored.
2. Open the **stub link** that replaced the file. You are redirected to the archived file's page, which shows the **file name** and its **archive status**.
3. Choose what to do with the file:
   - Select **Download current version**, or pick an earlier version under **Version history**, to save a copy to your computer. The file **remains archived** and is **not** restored to SharePoint. Media files can also be previewed in the browser.
   - Select **Restore to Original Place** to return the file to its original location. The file is **removed from the archive** and becomes **active** again. A restore can take a few minutes.

## Result

- After **Download**, you have a local copy and the archive is unchanged — use this when you need the file temporarily.
- After **Restore**, the file is back in its original SharePoint location and is no longer in the archive — use this when the file is needed for ongoing work.

## Related

- [Archive](../10-archive/README.md#archived-file-page) — archived file details and options.
- [How to Archive Obsolete Content](./07-archive-obsolete-content.md)
- [FAQ — Archiving](../16-faq/README.md#archiving)
