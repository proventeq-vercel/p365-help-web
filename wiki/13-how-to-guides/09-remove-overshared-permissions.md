---
title: "How to Remove Overshared Permissions"
description: "How to find overshared files in the Security & Oversharing report and remove risky permissions — for a selection, for a whole filtered scope, or for everyone with access to one file."
type: howto
updated: 2026-10-26
---

# How to Remove Overshared Permissions

Use the **Security & Oversharing** report to find content that is shared too widely — anonymous links, external sharing and broad groups such as "Everyone" — and remove those permissions directly from Proventeq365. You can remove the permissions you select, every permission that matches the current filters, or all access to a single file.

## Before you begin

- A workspace must have completed at least one scan so that the report contains data. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
- You need the **Workspace Admin** role on the workspace (or **Tenant Admin**) to remove permissions. Workspace Users can view the report only.
- Your license must include the **Remove Permissions** feature. You can check this on the [License](../08-license/README.md) screen under **Enabled Features**.
- Removing a permission changes access in Microsoft 365. Check with the content owner before removing access that people may still need.

## Steps

1. Open **Reports** → **Security & Oversharing**, and select the workspace.
2. Choose a user scope tab — **External Users** or **Internal Users** — and use the report's charts and filters to narrow down the risk you want to fix, for example high-risk sharing links.
3. Switch to **Table view**. The table lists the permission assignments that match the filters, with the **Permission**, **Granted via**, **Risk** and **Affected Files** for each one.
4. Choose how much to remove:
   - To remove specific permissions, select the rows (or expand a row and select individual permissions) and click **Remove selected permissions**.
   - To remove every permission that matches the current filters, click **Remove scoped permissions**.
   - To remove all access to one file, select the file to open the **File Access & Risk Details** panel, then click **Remove Access for all members**.
5. Re-run the workspace scan to refresh the report and confirm the permissions are gone.

## Result

The selected permissions are removed in SharePoint and OneDrive. After the next scan, the report and the [Security & Oversharing dashboard](../03-main/dashboard/security-oversharing.md) reflect the reduced exposure.

## Related

- [Security & Oversharing report](../04-reports/security-oversharing/README.md)
- [Severity Allocations](../appendix/severity-allocations.md) — how High, Medium and Low risk are assigned.
- [How to Manage External User Access](./10-manage-external-user-access.md)
