---
title: "How to Remove Overshared Permissions"
description: "How to find overshared content in the Security & Oversharing report and remove direct grants and sharing links — for selected items, a whole filtered scope, or one item's access list."
type: howto
updated: 2026-10-26
---

# How to Remove Overshared Permissions

Use the **Security & Oversharing** report to find content that is shared too widely, such as anonymous links, external sharing and broad groups, and remove that access directly from Proventeq365. You can remove the permissions on items you tick, every permission that matches the current filters, or chosen people, groups and links from one item's access list.

## Before you begin

- A workspace must have completed at least one scan so that the report contains data. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
- You need the **Workspace Admin** role on the workspace (or **Tenant Admin**) to remove permissions. Workspace Users can view the report only.
- Your license must include the **Execute Policy** feature. Without it the report has no **Actions** button. You can check this on the [License](../08-license/README.md) screen under **Enabled Features**.
- Only direct grants and sharing links are removed. Access that comes through a group, or that an item inherits from its parent, is kept; change the group membership or the parent's permissions in Microsoft 365 instead.
- Removing a permission changes access in Microsoft 365 and cannot be undone. Check with the content owner before removing access that people may still need.

## Steps

1. Open **Reports** → **Security & Oversharing**, and select the workspace.
2. Choose a tab — **All**, **External** or **Internal** — and narrow down the risk you want to fix: click a **High**, **Medium** or **Low** card, an entry in one of the breakdown panels, or type in the table's search box.
3. In the table, expand a site to see the folders and files inside it that have their own permissions. Click an item, or its **Affected Files** pill, to open the access panel and see who can reach it and how.
4. Choose how much to remove:
   - **Selected items** — tick the folders and files in the table, click **Actions** and choose **Remove selected permissions**. Check the summary in the **Remove Access to Files** dialog and click **Remove Access (N)**.
   - **Everything in the current filters** — clear any ticks, click **Actions** and choose **Remove scoped permissions**, then click **Confirm**.
   - **Chosen access on one item** — in the access panel, tick the people, groups, sharing links or routes to remove, click **Remove selected (N)**, and confirm in the **Remove Access to Files** dialog. Inside a **Specific people** sharing link you can tick the people who redeemed the link.
5. Wait for the message **Permissions removal queued.** The removal runs in the background.
6. After the next data refresh, open the report again to confirm the permissions are gone.

## Result

The direct grants and sharing links you chose are removed in SharePoint and OneDrive. After the next data refresh, the report and the [Security & Oversharing dashboard](../03-main/dashboard/security-oversharing.md) reflect the reduced exposure.

## Related

- [Security & Oversharing report](../04-reports/security-oversharing/README.md)
- [Severity Allocations](../appendix/severity-allocations.md) — how High, Medium and Low risk are assigned.
- [How to Manage External User Access](./10-manage-external-user-access.md)
- [Error Messages: Policies and Remediation](../15-error-catalog/03-policies-and-remediation.md#permissions-and-external-users)
