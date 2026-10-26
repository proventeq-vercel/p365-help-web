---
title: "How to Manage External User Access"
description: "How to review the external users who can reach your SharePoint sites in Proventeq365, check which sites each one can access, and remove, disable or re-enable them."
type: howto
updated: 2026-10-26
---

# How to Manage External User Access

The **External Users** report lists the users from outside your organisation who can access content in the workspace, which domains they come from, and which sites each one can reach. From the report you can **remove** an external user, **disable** the user temporarily, or **enable** a disabled user again.

## Before you begin

- A workspace must have completed at least one scan. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
- You need the **Workspace Admin** role on the workspace (or **Tenant Admin**) to remove, disable or enable users. Your license must include the **Permissions Report** and **Users Report** features to open the report.
- **Remove User** deletes the guest account from your Microsoft Entra ID, which takes away all of that user's access in your tenant, not only in this workspace. Agree with the site owners which external collaborators still need access.

## Steps

1. Open **Reports** → **Security & Oversharing** → **External Users**, and select the workspace.
2. Review the **External Users** and **External Domains** panels to see which users and domains have the widest access. Click a domain to filter the table to it.
3. In the table, click **View** in the **Sites** column to see the sites a user can access and how access was granted. The **Status** column shows whether the account is **Active**, **Disabled** or **Deleted**.
4. To review a user's permissions in detail, click the **>** icon at the end of the row. The Security & Oversharing report opens on its **External** tab, filtered to that user.
5. Back in the External Users report, select one or more users with the checkboxes. Users with the status **Deleted** cannot be selected.
6. Click **Actions** and choose an action:
   - **Remove User** — deletes the guest account from your tenant.
   - **Disable User** — blocks the user from signing in, without deleting the account.
   - **Enable User** — lets a disabled user sign in again.
7. Click **Confirm** in the dialog. You can act on up to 100 users at a time.

## Result

The user's **Status** changes to **Deleted**, **Disabled** or **Active**. A removed user leaves the report after the next data refresh.

## Related

- [External Users report](../04-reports/external-users/README.md)
- [How to Remove Overshared Permissions](./09-remove-overshared-permissions.md)
- [Guest Access Governance Policy](../appendix/predefined-policies.md) — remove guest permissions automatically with a policy.
- [Error Messages: Policies and Remediation](../15-error-catalog/03-policies-and-remediation.md#permissions-and-external-users)
