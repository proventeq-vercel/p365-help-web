---
title: "How to Review Third-Party App Access"
description: "How to find third-party and full control apps that can reach your SharePoint and OneDrive content with the App Permissions report, and revoke their site grants."
type: howto
updated: 2026-10-26
---

# How to Review Third-Party App Access

Apps from other organisations can be granted access to your SharePoint and OneDrive content through Microsoft Entra ID, sometimes to every site in the tenant. Use the **App Permissions** report to list those apps, see exactly what each one can do, and revoke the grants an app holds on specific sites.

## Before you begin

- A Microsoft 365 Governance workspace must have completed at least one data refresh with the **Application permissions (tenant-wide)** and **Application site grants** stages of **Entra ID discovery** switched on. They are on by default. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
- You need a role on the workspace (**Workspace User** or higher) to view the report. To revoke grants you need the **Workspace Admin** role (or **Tenant Admin**).
- Your license must include **Permissions Report** and **Apps Report** to view the report, and **Remove Apps** and **Execute Policy** to revoke grants. Check **Enabled features** on the [License](../08-license/README.md) screen.

## Steps

1. Select the workspace and open **Reports** → **Security & Oversharing** → **App Permissions**.
2. Click the **External apps** tab to list only third-party apps — apps not published by Microsoft and not registered in your tenant.
3. Find the apps with the widest reach:
   - In **Breadth of access**, click **Tenant-wide access** to show apps whose permissions reach every site.
   - In **Permission level**, click **Full control** or **Write** to show apps that can change content.
   - Click the **Tenant-wide full control** tab to see every app, internal or third-party, that can fully control all sites.
4. Check the publisher of each app in the **Publisher** column. A tick marks a verified publisher. **Unverified publisher** means the third-party app gives no publisher name and has no verified publisher.
5. Click a chip in the **Permissions** column to open the permission breakdown. Grants listed under **Can change data across the tenant** let the app change content without anyone signing in.
6. For apps with **Specific sites access**, click **View** in the **Sites** column to see which sites the app can reach and at which level.
7. Click **Export** to download the current list as a CSV file and confirm with the app owners which access is still needed.
8. Revoke the site grants that are no longer needed:
   - For one site, click **Revoke** next to the site in the site access panel.
   - For all sites of one app, click **Revoke all access** in the site access panel.
   - For several apps, select their rows in the table, click **Actions**, choose **Remove selected permissions** and confirm.
9. For tenant-wide (**Application**) and **Delegated** permissions, remove or reduce the permissions in Microsoft Entra ID. They cannot be revoked from Proventeq365.

## Result

Proventeq365 shows **Permissions removal queued.** and removes the selected site grants in the background. Revoking cannot be undone, and **Revoke** and **Revoke all access** in the side panel start without a confirmation step. Check the App Permissions report after the next data refresh to confirm the grants are gone.

## Related

- [App Permissions](../04-reports/app-permissions/README.md)
- [How to Remove Overshared Permissions](./09-remove-overshared-permissions.md)
- [Security & Oversharing](../04-reports/security-oversharing/README.md)
