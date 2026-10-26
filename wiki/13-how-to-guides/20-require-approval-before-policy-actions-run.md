---
title: "How to Require Approval Before Policy Actions Run"
description: "How to make a Proventeq365 policy hold its report until a designated approver approves it, so actions such as deleting, archiving or removing access never run unchecked."
type: howto
updated: 2026-10-26
---

# How to Require Approval Before Policy Actions Run

Turn on **Requires approval** for a policy so that every report it produces is held until a designated approver releases it. Until then nothing runs: automatic actions wait and manual actions cannot be started. An approver can approve the whole report, approve only selected items, or reject it.

## Before you begin

- You need the **Tenant Admin** role to turn on approval and choose approvers.
- Approvers need at least the **Workspace User** role on the workspace to open the policy report and the **Approvals** page. Running manual actions after approval needs the **Workspace Admin** role.
- Your license must include the **Execution Report** feature, and **Execute Policy** for approving and running actions.
- The policy exists, or you know which rule to use. See [How to Add a Governance Policy](./05-add-a-governance-policy.md).

## Steps

1. Select the workspace and open **Manage** → **Policies**.
2. Click **Edit** in the policy's row, or **Create New Policy** for a new one.
3. In **Approval and approvers**, turn on **Requires approval**.
4. Under **Approvers**, search for each person or group who may decide, and select them. On an existing policy each approver is saved as soon as you add them.
5. Choose the policy's actions and whether each is **Automatic** or **Manual**, then save the policy.
6. Click **Run Policy** in the policy's row and confirm, or wait for the next data refresh.
7. When the report has items, the approvers receive an **Approval requested** notification: *Policy name: N items are waiting for your decision*.
8. As an approver, open the notification or the policy report. Review the items — on the policy report, or on the **Approvals** page from the action card's **Approvals** link, which shows what each item's action would do.
9. Approve or reject:
   - To release everything, click **Approve report** (or **Approve** on the approval page with nothing ticked).
   - To release only some items, tick them and click **Approve N selected items** (or **Approve** on the approval page).
   - To stop the actions, click **Reject**.
10. Add an optional comment in the dialog and confirm.
11. For a **Manual** action, a Workspace Admin opens the policy report and clicks **Execute on All Items**, or **Execute on Approved Items (N)** after a partial approval.

## Result

The approval's status changes to **Approved** or **Rejected**, with the approver's name and comment. When approved, automatic actions start at once and manual actions can be run; follow them on the [Actions](../02-manage/actions/README.md) page. When rejected, nothing runs. A decision can be changed with **Approve instead** or **Reject instead** for as long as the report lives. The next run of the policy replaces the report and supersedes the decision, so each run needs its own approval.

## Related

- [Policy Approvals](../02-manage/policies/policy-approvals.md)
- [Policies](../02-manage/policies/README.md)
- [Notifications](../09-notification/README.md)
- [Error Messages: Policies and Remediation Actions](../15-error-catalog/03-policies-and-remediation.md#policy-approvals)
