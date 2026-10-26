---
title: "How to Manage External User Access"
description: "How to review the external (guest) users who can access your SharePoint sites in Proventeq365, and remove, disable or re-enable them."
type: howto
updated: 2026-10-26
---

# How to Manage External User Access

The **External Users** report lists every user from outside your organisation who can access content in the workspace, which domains they come from, and how many sites each one can reach. From the report you can **remove** an external user's access to all sites, **disable** the user temporarily, or **enable** a disabled user again.

## Before you begin

- A workspace must have completed at least one scan. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
- Agree with the site owners which external collaborators still need access.

## Steps

1. Open **Reports** → **Security & Oversharing** → **External Users**, and select the workspace.
2. Review the **External Users** and **External Domains** charts to see which users and domains have the widest access.
3. In the **External Users** table, expand a row to see the sites and permissions assigned to that user. The **Status** column shows whether the account is enabled or disabled.
4. Select one or more users with the checkboxes, then choose an action:
   - **Remove User** — completely removes the user's access from all sites.
   - **Disable User** — temporarily blocks access without deleting the user.
   - **Enable User** — restores access for a user you disabled earlier.
5. To review an individual user's permissions in detail, click the **>** icon at the end of the row to open the Security & Oversharing report for that user.

## Result

The external user's access is removed, blocked or restored. The change appears in the report after the next workspace scan and is recorded in the [Audit Log](../07-audit-log/README.md).

## Related

- [External Users report](../04-reports/external-users/README.md)
- [How to Remove Overshared Permissions](./09-remove-overshared-permissions.md)
- [Guest Access Governance Policy](../appendix/predefined-policies.md) — remove guest permissions automatically with a policy.
