---
title: "How to Trim Old File Versions"
description: "How to free SharePoint storage by permanently deleting old document versions with Proventeq365: find files with too many versions and keep only the latest or recent ones."
type: howto
updated: 2026-10-26
---

# How to Trim Old File Versions

Documents with long version histories use a lot of SharePoint storage. Proventeq365 finds them with the **Excessive Versions Policy** and deletes their older versions with the **Trim versions** action, keeping either the last N versions or the versions from the last N months. The current version is always kept.

> **Important:** Trimmed versions are deleted permanently. They do not go to the recycle bin and cannot be restored.

## Before you begin

- Version discovery must be turned on for your deployment. Without it the **Excessive Versions Policy** finds no documents. It is off by default — ask Proventeq to turn it on.
- The workspace has completed a data refresh with version discovery on.
- You need the **Tenant Admin** role to create the policy and run it, and **Workspace Admin** (or Tenant Admin) to start a manual action.
- Your license must include the **Execution Report** and **Execute Policy** features.

## Steps

1. Select the workspace, open **Manage** → **Policies** and click **Create New Policy**.
2. Enter a **Name** and choose **Excessive Versions Policy** as the **Policy rule**.
3. Set **Maximum Versions**. Documents with more versions than this, counting the current one, are flagged.
4. Under **Actions**, select **Trim versions** and leave it **Manual** for the first run.
5. Under **Versions to keep**, choose **Keep the last N versions** or **Keep versions from the last X months**, and enter the number. The number of versions to keep cannot be higher than **Maximum Versions**.
6. Optionally, turn on **Requires approval** and add approvers, so a second person checks the report first. See [How to Require Approval Before Policy Actions Run](./20-require-approval-before-policy-actions-run.md).
7. Click **Add Policy**, read the warning *Permanently delete older versions?* and click **Save and continue**.
8. Click **Run Policy** in the policy's row and confirm. When the run has finished, click **View** to open the report and check the flagged documents.
9. On the **Trim versions** card, click **Execute on All Items**, or tick documents and click **Execute on Selection**, then confirm.
10. Click **View Executions** to follow the run. Its details show **Versions removed** and **Space reclaimed (approx.)**.

## Result

The older versions of each flagged document are deleted, and the run's **Items** tab shows, for each file, how many versions were removed and how many were kept. Files that are checked out are not changed and are listed as failed — check them in and run the action again. Files already within the window are skipped. Once you trust the results, edit the policy and switch **Trim versions** to **Automatic** so it runs after every data refresh.

## Related

- [Predefined Policies](../appendix/predefined-policies.md)
- [Policies](../02-manage/policies/README.md)
- [Actions](../02-manage/actions/README.md)
- [How to Estimate Storage Savings](./19-estimate-storage-savings.md)
