---
title: "Error Messages: Policies and Remediation Actions"
description: "What Proventeq365 policy, action and remediation error messages mean and how to fix them — including “Failed to start policy run”, “The last run of this policy failed” and “Partially completed” action executions."
type: reference
updated: 2026-10-26
---

# Error Messages: Policies and Remediation Actions

Messages you may see when creating or running a governance policy, or when an action — such as removing permissions, deleting files or archiving — runs on the items a policy or report found.

## Creating and editing policies

### Policy name is required / Policy rule is required

**Fix:** Enter a **Name** and choose a **Policy rule**.

### Threshold is required

**Fix:** Enter the threshold value for the rule, for example the number of documents or the size in MB.

### Add at least one entry — press Enter after each value

**Fix:** For inputs that take several values, type each value and press **Enter** so it becomes a tag.

### Please select a connection / Please select a container

**Where:** **Archive** action configuration.
**Fix:** Choose the **Target Connection** and **Target Container**. If none are listed, add a connection first — see [How to Add an Archive Connection](../13-how-to-guides/06-add-an-archive-connection.md).

### Set either a version count or a number of months, not both.

**Where:** **Archive** action configuration.
**Fix:** Fill in either **Keep last N versions** or **Keep versions from the last N months**, and leave the other blank.

### Invalid policy parameters

**Where:** after **Add Policy** or saving a policy.
**Cause:** a required rule input is missing or has an invalid value — for example a threshold that must be a whole number of at least 1.
**Fix:** Check every input of the rule and save again.

### Failed to add policy / Failed to update policy

**Cause:** the policy could not be saved.
**Fix:** Check the inputs and try again. You need the **Tenant Admin** role to create or edit policies.

## Running policies

### Failed to start policy run

**Cause:** the run could not be started. A common reason is that the policy is disabled.
**Fix:** Enable the policy and run it again. You need the **Workspace Admin** role on the workspace.

### This policy is disabled. It is skipped during discovery and its actions cannot be run until it is re-enabled.

**Where:** banner on the policy report.
**Fix:** Enable the policy if you want it evaluated and its actions available again.

### The last run of this policy failed, so no results are shown.

**Where:** policy report.
**Fix:** Open the *Policy evaluation failed* notification for the reason, fix the cause and run the policy again.

### This policy did not run — a required parameter is empty.

**Where:** policy report.
**Cause:** the policy was skipped because one of its inputs is empty. The report is not a clean result.
**Fix:** Edit the policy, fill in the missing input and run it again.

### Policy evaluation failed

**Where:** notification.
**Fix:** Read the detail line of the notification, fix the cause and run the policy again. If the detail says *The run stopped because of an internal error*, contact Proventeq support.

## Running actions

### Failed to start action execution

**Where:** after **Execute on All Items** or **Execute on Selection** in a policy report.
**Fix:** Try again. You need the **Workspace Admin** role on the workspace.

### Requested action on the source system failed

**Where:** notification.
**Cause:** an action execution — for example an archive or a permission removal — ended with status **Failed** (no item succeeded) or **Stopped**.
**Fix:** Open the execution under **View Executions** and check its **Issues** and **Items** tabs. The detail line may say:

| Detail | Fix |
| --- | --- |
| Policy was disabled before the action was dispatched | Enable the policy and run the action again. |
| Execution showed no batch progress for N hours | The execution stalled and was stopped. Run it again; contact support if it repeats. |
| No default archive target, connection or container configured … | Complete the archive connection and choose its container. See [Error Messages: Connections and Archiving](./04-connections-and-archiving.md). |

### Partially completed

**Where:** status of an action execution.
**Cause:** some items succeeded and at least one failed.
**Fix:** Open the execution, filter the **Items** tab by **Failed**, and read each item's error (select **Full error** for the complete text). Fix the cause and run the action again on the failed items. Items that were already done are **skipped** on the next run.

## Permissions and external users

### Error queueing permissions removal.

**Where:** Security & Oversharing report.
**Fix:** Try again. You need the **Workspace Admin** role and the **Remove Permissions** license feature.

### A removal is already in progress.

**Fix:** Wait for the current removal to finish, then refresh the report.

### Nothing here can be removed. Only direct grants and sharing links are removed; inherited access and access through a group are kept.

**Cause:** the selected access is inherited or comes through a group, which Proventeq365 does not change from this view.
**Fix:** Remove the user from the group, or break inheritance on the item in SharePoint, or remove the parent sharing link.

### Indirect access can't be removed here — remove it from the parent group or sharing link.

**Fix:** As above — change the group membership or the sharing link that grants the access.

### Error queueing external user removal / block / enable.

**Where:** External Users report.
**Fix:** Try again with fewer users selected (at most 100 at a time). You need the **Workspace Admin** role.

## Related

- [Troubleshooting — Policies and actions](../14-troubleshooting/README.md#policies-and-actions)
- [How to Add a Governance Policy](../13-how-to-guides/05-add-a-governance-policy.md)
