---
title: "How to Restore Archived Content in Bulk"
description: "How to restore many archived files at once in Proventeq365 — selected items or a whole policy report, or by site or workspace from Workspace Inventory — and follow the restore."
type: howto
updated: 2026-10-26
---

# How to Restore Archived Content in Bulk

When many archived files are needed again, a Workspace Admin can restore them together instead of one stub link at a time. The quickest way is the **Restore from archive** card on the report of the policy that archived them: restore the items you select, or every archived item in the report. Each file goes back to its original location with its archived versions and is removed from the archive.

## Before you begin

- The files were archived to a **Wasabi** or **Azure Blob Storage** connection by a policy's **Archive** action. Content in Microsoft 365 Archive can't be restored here.
- You need the **Workspace Admin** role on the workspace (or **Tenant Admin**).
- Your license must include the **Archive Items** and **Execute Policy** features.
- The libraries the files return to have versioning turned on, and no other file now has the same name at the original location.

## Steps

1. Select the workspace, open **Manage** → **Policies** and click **View** in the row of the policy that archived the files.
2. Under **Available Actions**, find the **Restore from archive** card. It is shown when the report holds archived items.
3. To restore some items, tick their rows and click **Execute on Selection**. The button counts archive records; the card says how many selected rows have no archive record and will be skipped, and how many are over the limit of 1,000 records per restore.
4. To restore every archived item in the report, click **Restore all** and confirm. This includes rows you haven't scrolled to.
5. Watch the progress shown on each row being restored, or click **View Executions** to follow the restore runs.
6. If a message says some restores are no longer running and did not finish, fix the cause shown on the run's **Items** tab and restore those items again.

## Result

The restored files are back in their original SharePoint locations with their archived versions, in place of their stub links, and are no longer in the archive. When the restores finish, the report refreshes and a message says how many completed.

To restore by site, by folder or for a whole workspace instead, use the **Restore** actions on **Workspace Inventory**. See [Restore from Workspace Inventory](../10-archive/03-restore-archived-content.md#restore-from-workspace-inventory).

## Related

- [Restore Archived Content](../10-archive/03-restore-archived-content.md)
- [How to Restore an Archived File](./08-restore-an-archived-file.md)
- [How to Archive Obsolete Content](./07-archive-obsolete-content.md)
- [Error Messages: Connections, Archiving and Restore](../15-error-catalog/04-connections-and-archiving.md#opening-and-restoring-archived-files)
