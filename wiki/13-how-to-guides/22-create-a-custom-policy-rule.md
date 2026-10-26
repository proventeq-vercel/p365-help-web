---
title: "How to Create a Custom Policy Rule with the Rule Assistant"
description: "How to describe a custom governance rule in plain language to the Proventeq365 rule assistant, check its preview, approve and deploy it, and use it in a policy."
type: howto
updated: 2026-10-26
---

# How to Create a Custom Policy Rule with the Rule Assistant

When no predefined rule fits, you can describe the rule you need in plain language — for example *Files larger than 100 MB unaccessed in 12 months* — and the **Rule assistant** drafts it from the workspace's discovered data. It checks the rule, previews what it finds, and once you approve and deploy it, the rule can be used in any policy of that workspace.

## Before you begin

- The optional AI component must be included in your Proventeq365 deployment — ask Proventeq.
- The workspace is a Microsoft 365 Governance workspace and has completed at least one data refresh, so the preview has data.
- You need the **Tenant Admin** role.
- Your license must include the **Execution Report** feature.

## Steps

1. Select the workspace and open **Manage** → **Policies** → **Policy Rules**.
2. Click **New rule**.
3. In the **Rule assistant**, describe the rule and click **Send**, or pick an example under **Start from a prompt**.
4. Wait for the checks — **Generate**, **Static checks**, **Sandbox compile & contract** and **Preview** — to finish.
5. If the assistant says the draft didn't pass validation, read the reasons and send a refined description. Repeat until it says *Passed all checks*.
6. Review **Results**, the preview of matching items, and **Parameters & SQL**, which lists the inputs the rule will take on the policy form. To adjust a default or the query by hand, click **Edit**, make the change and click **Validate**.
7. Click **Save as Draft**. Enter a **Display name**, choose a **Category**, tick the **Available actions** that policies may use with this rule, and click **Save**.
8. Click **Approve & deploy**. The message *Rule deployed* appears.
9. Open **Manage** → **Policies**, click **Create New Policy**, choose your rule in **Policy rule**, fill in its inputs and actions, and click **Add Policy**.

## Result

The rule is listed on **Policy Rules** with the status **Approved**, and a policy using it lists the matching items in its report every time it runs. To change the rule later, click **Edit**, refine it and save a new draft; approving that version supersedes the old one. If the workspace's data structure changes, the rule is marked **Stale** and offers **Upgrade**, which opens it in the editor so you can refine and approve a new version.

## Related

- [Policy Rules](../02-manage/policy-rules/README.md)
- [How to Add a Governance Policy](./05-add-a-governance-policy.md)
- [Predefined Policies](../appendix/predefined-policies.md)
- [Error Messages: Policies and Remediation Actions](../15-error-catalog/03-policies-and-remediation.md#policy-rules)
