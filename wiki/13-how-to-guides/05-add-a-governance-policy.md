---
title: "How to Add a Governance Policy"
description: "How to add a governance policy to a Proventeq365 workspace — choose a predefined rule, set its inputs and actions, run it, and review the results."
type: howto
updated: 2026-10-26
---

# How to Add a Governance Policy

A **governance policy** applies a rule — for example *Excessive Sharing*, *Large File* or *Obsolete Content* — to a workspace's data and lists the items that match. Some policies can also act on those items, such as removing permissions or archiving files, either **manually** (you start the action) or **automatically** (it runs with the policy). Add policies under **Manage** → **Policies**, or on the **Policies** step when you create a workspace.

## Before you begin

- You need the **Tenant Admin** role to create, edit and run policies. Workspace Admins can start a policy's manual actions from its report.
- The workspace must exist and should have completed at least one data refresh, so the policy has data to evaluate. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
- Choose the rule from the [Predefined Policies](../appendix/predefined-policies.md) list and check which inputs and actions it supports.
- For an **Archive** action, add a storage connection first. See [How to Add an Archive Connection](./06-add-an-archive-connection.md).

## Steps

1. Select the workspace, then open **Manage** → **Policies**.
2. Click **Create New Policy**.
3. Enter a **Name** for the policy.
4. Choose a **Policy rule**, then fill in the rule's inputs — for example a **Threshold** with a compare mode for the volume policies, or a **Sensitivity Label** for the label drift policies.
5. If the rule supports actions, select the action and choose its execution mode: **Manual** or **Automatic**.
6. Click **Add Policy**. The policy appears in the policies list.
7. To evaluate it now, click **Run Policy** in the policy's row and confirm. The message *Policy run started successfully* appears.
8. When the run has finished, click **View** in the row to open the policy report and see the matching items.

## Result

The policy report lists every item that matches the rule, with the reason it matched — for example *Site has a document count* above the threshold, or a document whose sensitivity label differs from the library's label. Automatic actions run on the matched items; manual actions wait until you start them from the report. Policies have no schedule of their own: every enabled policy is evaluated again at the end of each workspace data refresh.

> **Automatic actions cannot be undone.** When you run a policy that has automatic actions, those actions run in the background on every item the policy matches.

## Related

- [Policies](../02-manage/policies/README.md)
- [Predefined Policies](../appendix/predefined-policies.md)
- [How to Archive Obsolete Content](./07-archive-obsolete-content.md)
