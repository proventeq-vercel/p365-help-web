---
title: "How to Archive Obsolete Content"
description: "How to archive obsolete SharePoint files to Wasabi with Proventeq365: set up an Obsolete Content Policy with an Archive action, run it, and follow the archive execution."
type: howto
updated: 2026-10-26
---

# How to Archive Obsolete Content

Proventeq365 archives obsolete SharePoint content to low-cost **Wasabi** storage. Content is archived by the **Archive** action of an **Obsolete Content Policy**: the policy finds files that match the workspace's obsolete rules, and the action moves them to your Wasabi container. The original file can be replaced with a **stub link**, so users can still find and restore it.

## Before you begin

- Add a Wasabi connection and select its container. See [How to Add a Wasabi Archive Connection](./06-add-a-wasabi-connection.md).
- Check the workspace's **obsolete detection** rules (age in months and file extensions) on the workspace's **Configuration** step.
- Your license must include archiving. Check **Enabled Features** on the [License](../08-license/README.md) screen.

## Steps

1. Select the workspace, open **Manage** → **Policies** and click **Create New Policy**.
2. Enter a **Name** and choose **Obsolete Content Policy** as the **Policy rule**.
3. Select the **Archive** action and choose the execution mode:
   - **Manual** — you review the report and start archiving yourself.
   - **Automatic** — files are archived whenever the policy runs.
4. Under **Action Configuration**, choose the **Target Connection** and **Target Container**, and set the archive options:
   - **Replace with Stub** — leave a link in place of the original file.
   - **Copy Permissions** — copy the original file permissions to the archived content.
   - **Use Structured Hierarchy** — keep the site, library and folder structure in the container instead of a flat structure.
5. Click **Add Policy**, then click **Run Policy** in the policy's row and confirm.
6. When the run has finished, click **View** to open the policy report.
7. For a **Manual** action, click **Execute on All Items**, or select items and click **Execute on Selection**, then confirm.
8. Click **View Executions** to follow the archive run. Each execution shows its status, progress, duration and the number of errors.

## Result

The archived files are stored in your Wasabi container. With **Replace with Stub**, each original file is replaced by a stub link that anyone with access to the original file can use to download or restore it. An execution that ends **Partially Completed** archived some items but not all — open it to see the errors for the failed items.

## Related

- [Archive](../10-archive/README.md)
- [How to Restore an Archived File](./08-restore-an-archived-file.md)
- [Troubleshooting — Archiving](../14-troubleshooting/README.md#archiving-and-restore)
