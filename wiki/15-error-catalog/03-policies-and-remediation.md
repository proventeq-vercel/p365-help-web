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
**Fix:** Enable the policy and run it again. You need the **Tenant Admin** role to run policies.

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
**Fix:** Open the execution, filter the **Items** tab by **Failed**, and read each item's error. Fix the cause and run the action again on the failed items. Items that were already done are **skipped** on the next run.

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

## Policy approvals

### A policy that requires approval needs at least one approver.

**Where:** policy form, **Approval and approvers** section, or a message after saving the policy. A related warning reads *This policy requires approval but has no approver. Saving it is refused until at least one is added.*
**Cause:** **Requires approval** is on and the **Approvers** list is empty.
**Fix:** Add at least one person or group under **Approvers**, or turn **Requires approval** off. See [Policy Approvals](../02-manage/policies/policy-approvals.md#turn-on-approval-for-a-policy).

### Only a tenant administrator can change the approval setting, trusted accounts and approvers of this policy.

**Where:** policy form, **Approval and approvers** section.
**Cause:** you don't have the **Tenant Admin** role, so the approval settings are read-only for you.
**Fix:** Ask a Tenant Admin to change the approval setting or the approvers. A message saying *Only a tenant admin can turn off approval for policy …* has the same cause.

### This policy requires approval, so its last approver cannot be removed.

**Where:** after removing an approver.
**Fix:** Add another approver first, or turn **Requires approval** off and save the policy.

### A designated approver with ObjectId … already exists on this workspace.

**Where:** after adding an approver.
**Cause:** the person or group is already an approver of this policy.
**Fix:** No action needed.

### The approver could not be added / The approver could not be removed

**Fix:** Try again. Only a Tenant Admin can change the approvers. If the message names a policy that was not found, reload the page — the policy may have been deleted.

### Approvals are for this policy's approvers

**Where:** the policy's **Approvals** page or an approval's details. The page says *Only a designated approver for this workspace can decide this. Ask a tenant administrator to add you under Retention configuration, Policy approvers.*
**Cause:** you are not listed, directly or through a group, under **Approvers** on this policy. Tenant Admins are not approvers unless they are listed.
**Fix:** Ask a Tenant Admin to add you under **Approvers** in the policy's **Approval and approvers** section.

### Approval not found

**Where:** approval details, with *This approval was not found for this policy. It may have been removed, or the link belongs to another policy.*
**Fix:** Open the policy report and click **Approvals** on an action card to find the current approval.

### A later policy run replaced this approval, so it can no longer be decided. Review the new one instead.

**Where:** after **Approve** or **Reject**. On the policy report the message may read *The report this decision covered has been superseded by a newer run; nothing was released.* or *The report covered by this approval no longer exists; the approval has been superseded.*
**Cause:** the policy ran again. Every run replaces the report and supersedes its approval, whether it was decided or not.
**Fix:** Reload the page and decide on the new report.

### Item count … exceeds the wave cap …

**Where:** after approving a report. The message continues *Approve a smaller selection of report items, narrow the policy criteria and re-run it, or raise the configured cap after reviewing the report.*
**Cause:** one approval can cover at most 100,000 items by default.
**Fix:** Tick a smaller set of items and approve those, or narrow the policy's inputs and run it again. To change the limit, contact Proventeq.

### None of the selected items are outstanding rows of the report this approval covers; no execution was created.

**Where:** after approving selected items on the policy report.
**Cause:** the items you ticked have already been acted on, or no longer belong to the current report.
**Fix:** Reload the report, tick items that are still waiting, and approve again.

### The report could not be approved / The report could not be rejected / The decision could not be recorded

**Fix:** Try again. If it keeps failing, reload the page — the report may have been replaced by a newer run.

## Actions page

### No actions queued by people yet

**Where:** **Actions** page, with **Show policy runs** turned off.
**Cause:** not an error. With the switch off, only actions a person queued are listed.
**Fix:** Turn on **Show policy runs** to include the runs your policies started.

### The runs could not be loaded.

**Fix:** Click **Retry**. If it keeps failing, reload the page later — a very large list can take longer than the server allows.

### The run in this link isn't in the list below — it may have been removed, or it may be older than the runs shown here.

**Where:** **Actions** page, opened from a link or notification.
**Fix:** The run's details still open if the run exists. To find it in the list, move to older pages.

### The items for this run could not be loaded. / The issues for this run could not be loaded.

**Fix:** Close and reopen the run, or reload the page. If only more rows failed to load — *Those items couldn't be loaded. The ones already listed are unaffected.* — click **Try loading more again**.

### This run ended with a problem, but it reported no reason or failure count.

**Where:** **Issues** tab of a run that ended **Failed** or **Partially completed**.
**Fix:** Open the **Items** tab to see any failed items the run recorded. If there are none, run the action again; quote the run's **Execution ID** to Proventeq support if it repeats.

### Stopped — Policy was disabled before the action was dispatched

**Where:** status and **Reason** of a run.
**Cause:** the policy was disabled after the action was queued but before it started, so the action was called off.
**Fix:** Enable the policy and run the action again.

### Your last CSV export did not finish.

**Where:** **Items** tab, after **Export CSV**.
**Fix:** Click **Try again**. Exports are kept for seven days; after that, start a new one.

## Policy rules

### Failed to generate rule / Couldn't generate the rule

**Where:** **Policy Rules** editor.
**Cause:** the rule assistant could not produce a draft. Policy Rules needs the optional AI component in your deployment.
**Fix:** Click **Retry**, or **Edit & resend** to rephrase the description. If it never works, ask Proventeq whether the AI component is included in your deployment.

### The draft didn't pass validation yet. Refine the description to resolve:

**Where:** **Rule assistant**, followed by the reasons. The validation panel shows *Validation didn't pass* and **Why it didn't pass**.
**Fix:** Send a more precise description that addresses the reasons, or click **Edit**, correct the rule and click **Validate**. A reason starting *Post-check blocked (security)* means the draft tried to read data outside what rules may use; describe the rule differently.

### Review advisories

**Where:** validation panel, for example *Review: …* or *Flagged for review (sensitive data): …*
**Cause:** not an error. The rule passed, but the checks suggest you confirm it matches what you asked for, or note that it touches sensitive data.
**Fix:** Check the **Results** preview before you save and approve the rule.

### Failed to save draft

**Fix:** Try again. You need the **Tenant Admin** role. If the message names an unknown action, reopen **Save as Draft** and choose the actions again.

### Could not approve the rule due to a conflict. Refine and try again.

**Where:** after **Approve & deploy**. The message may instead read *A concurrent approval already superseded the predecessor. Re-base this rule and try again.* or *Only Draft rules can be approved*.
**Cause:** another version of the rule was approved meanwhile, or this draft is no longer a draft.
**Fix:** Go back to **Policy Rules**, open the newest version of the rule, refine it, save it as a draft and approve it.

### Deployment failed: …

**Where:** after **Approve & deploy**.
**Cause:** the rule could not be deployed to the workspace. It stays a **Draft**.
**Fix:** Try again, or refine the rule and save a new draft. Contact Proventeq support if it repeats.

### Failed to delete rule / Rule is referenced by one or more policies and cannot be deleted.

**Fix:** Remove the rule from every policy that uses it — edit those policies to use another rule — then delete it.

### Failed to upgrade rule

**Where:** after **Upgrade** on a **Stale** rule.
**Fix:** Try again, or click **Edit** and refine the rule with the assistant.

### Dynamic AI policy rules are supported only for Discovery workspaces

**Cause:** custom policy rules work only in Microsoft 365 Governance workspaces.
**Fix:** Select a Microsoft 365 Governance workspace.

### No preview rows. Empty or sparse results are informational, not a failure.

**Where:** **Results** preview of a rule.
**Cause:** nothing in the workspace matches the rule today.
**Fix:** No action needed. If you expected results, check the description and the parameter defaults, and make sure the workspace has completed a data refresh.

## Related

- [Troubleshooting — Policies and actions](../14-troubleshooting/README.md#policies-and-actions)
- [How to Add a Governance Policy](../13-how-to-guides/05-add-a-governance-policy.md)
- [Policy Approvals](../02-manage/policies/policy-approvals.md)
- [Actions](../02-manage/actions/README.md)
- [Policy Rules](../02-manage/policy-rules/README.md)
