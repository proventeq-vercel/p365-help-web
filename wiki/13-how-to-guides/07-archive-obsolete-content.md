---
title: "How to Archive Obsolete Content"
description: "How to archive obsolete SharePoint files to Wasabi or Azure Blob Storage with Proventeq365: set up an Obsolete Content Policy with an Archive action, run it, and follow the archive execution."
type: howto
updated: 2026-10-26
---

# How to Archive Obsolete Content

Proventeq365 archives obsolete SharePoint content to low-cost **Wasabi** or **Azure Blob Storage**. Content is archived by the **Archive** action of an **Obsolete Content Policy**: the policy finds files that match the workspace's obsolete rules, and the action copies them — with the versions you choose — to your archive container and removes them from SharePoint. The original file can be replaced with a **stub link** at the same address, so users can still find, download and restore it.

## Before you begin

- Add an archive connection and select its container. See [How to Add an Archive Connection](./06-add-an-archive-connection.md).
- You need the **Tenant Admin** role to create the policy, and **Workspace Admin** (or Tenant Admin) to run it and start the archive.
- Check the workspace's **obsolete detection** rules (age in months and file extensions) on the workspace's **Configuration** step.
- Your license must include the **Execute Policy** feature to run the archive action, and **Archive Items** for opening and restoring archived files. Check **Enabled features** on the [License](../08-license/README.md) screen.

## Steps

1. Select the workspace, open **Manage** → **Policies** and click **Create New Policy**.
2. Enter a **Name** and choose **Obsolete Content Policy** as the **Policy rule**.
3. Select the **Archive** action and choose the execution mode:
   - **Manual** — you review the report and start archiving yourself.
   - **Automatic** — files are archived whenever the policy runs.
4. Under **Action Configuration**, choose the **Target Connection** and **Target Container**, and set the archive options:
   - **Replace with Stub** — replace the original file with a stub link. Without a stub, the original file is deleted after it is archived.
   - **Use Structured Hierarchy** — keep the site, library and folder structure in the container instead of a flat structure.
   - **Include minor versions** and **Versions to archive** — choose **All versions** (the default), **Last N versions** or **Versions from the last N months**. The current version is always archived.
5. Click **Add Policy**, then click **Run Policy** in the policy's row and confirm.
6. When the run has finished, click **View** to open the policy report.
7. For a **Manual** action, click **Execute on All Items**, or select items and click **Execute on Selection**, then confirm.
8. Click **View Executions** to follow the archive run. Each execution shows its status, progress, duration and the number of errors.

## Result

The archived files are stored in your archive container. With **Replace with Stub**, each original file is replaced in place by a stub link — the address and existing sharing links keep working — and anyone who can open the stub can download or restore the file. The original's content and version history are removed from SharePoint and are not kept in the recycle bin, so make sure the right items are selected before you archive. Items that are already archived are **skipped**, not archived twice. An execution that ends **Partially Completed** archived some items but not all — open it to see the errors for the failed items.

## Related

- [Archive](../10-archive/README.md)
- [How to Restore an Archived File](./08-restore-an-archived-file.md)
- [Troubleshooting — Archiving](../14-troubleshooting/README.md#archiving-and-restore)
