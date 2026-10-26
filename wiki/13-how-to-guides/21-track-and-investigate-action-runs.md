---
title: "How to Track and Investigate Action Runs"
description: "How to follow a Proventeq365 action run — permission removal, deletion, archive or restore — on the Actions page, find the items that failed and export them to CSV."
type: howto
updated: 2026-10-26
---

# How to Track and Investigate Action Runs

Every action that runs in a workspace — started by a person, by a policy or after an approval — appears on the **Actions** page with its status and progress. Open a run to see what it changed, which items failed and why, and export the items to a CSV file.

## Before you begin

- You need at least the **Workspace User** role on the workspace.
- Your license must include the **Execution Report** and **Execute Policy** features.
- The workspace is a Microsoft 365 Governance workspace.

## Steps

1. Select the workspace and click **Actions** in the lower part of the menu.
2. Leave **Show policy runs** on to see every run, or turn it off to see only actions a person queued.
3. Check the counts bar: **In flight** shows runs still queued or running, and **Needs attention** shows runs that failed or partially completed.
4. Click a run card to open its details. To see one policy action's runs instead, open the policy report and click **View Executions** on the action's card.
5. On **Overview**, check the status, the progress bar (succeeded, failed, remaining), **Triggered by** and the **Timeline**. A stopped run shows the **Reason**.
6. Open the **Issues** tab. If it reports failures, click **Show failed items**.
7. On the **Items** tab, filtered to **Failed**, read each item's error and number of attempts. Use **Search items** to find a particular file or site.
8. Click **Export CSV** to download the items for the selected outcome. Keep the view open to download it automatically, or come back and click **Download** when it is ready.
9. Fix the cause in SharePoint or in the policy — for example check in a checked-out file — then run the action again from the policy report with **Execute on All Items** or **Execute on Selection**. This needs the **Workspace Admin** role. Items that already succeeded are not acted on again.

## Result

You know which items the action changed, which it skipped and which failed, with the error for each failure. A run that ends **Partially completed** changed some items and failed on others. When a later run succeeds on a failed item, the failure disappears from the earlier run's **Failed** list, because the list shows only errors that are still outstanding. Quote the run's **Execution ID** if you contact Proventeq support.

## Related

- [Actions](../02-manage/actions/README.md)
- [Policies](../02-manage/policies/README.md)
- [Troubleshooting — Policies and actions](../14-troubleshooting/README.md#policies-and-actions)
- [Error Messages: Policies and Remediation Actions](../15-error-catalog/03-policies-and-remediation.md#running-actions)
