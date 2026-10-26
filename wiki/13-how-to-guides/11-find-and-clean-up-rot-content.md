---
title: "How to Find and Clean Up ROT Content"
description: "How to use Proventeq365 to find redundant (duplicate), obsolete and trivial (ROT) files in SharePoint, OneDrive and Teams, export the list, and archive or remove them."
type: howto
updated: 2026-10-26
---

# How to Find and Clean Up ROT Content

**ROT** is content that is **redundant** (duplicate copies), **obsolete** (old and no longer used) or **trivial** (temporary or low-value files). Proventeq365 finds ROT content in every workspace scan and shows it on the dashboard and in the Storage Optimisation reports. To clean it up, review the reports, export the lists for the content owners, and then archive obsolete documents or remove trivial data — from the reports or with policies.

## Before you begin

- A workspace must have completed at least one scan. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
- Check the workspace's **obsolete** and **trivial detection** rules on the workspace **Configuration** step (for example, the obsolete age in months and the trivial file extensions and names). The reports use these rules. See [Workspaces — Analysis Configuration](../02-manage/workspaces/README.md#analysis-configuration).
- Viewing the reports needs a role on the workspace (**Workspace User** or higher) and the **ROT Report** license feature.
- Archiving from the Obsolete documents report needs the **Workspace Admin** role (or **Tenant Admin**), the **Archive M365** license feature and archiving set up for your organisation. Removing trivial data needs the **Workspace Admin** role (or **Tenant Admin**) and the **Execute Policy** license feature.

## Steps

1. Open **Main** → **Dashboard**, select the workspace and open the **Storage Optimization** tab. It shows how many files and how much storage fall into each ROT category. For capacity, forecasts and savings, open **Reports** → **Storage Optimisation**.
2. Open the detailed report for the category you want to clean up: **Reports** → **Storage Optimisation** → **Duplicate documents**, **Obsolete documents** or **Trivial documents**.
3. Narrow the results: click **High Risk** or **Low Risk**, or click any bar in the charts (for example a creation year, file extension or author), to filter the whole report. The filters appear as chips next to **Active filters**; you can combine several, and click **Clear all** to start again.
4. In the table, use **Search** to find a site or OneDrive by name, and expand a site to see the libraries that contain ROT items. Click a library's item count to open a side panel listing its documents.
5. Click **Export** in the table toolbar to download the filtered list as a CSV file for review with the content owners.
6. Clean up the confirmed content:
   - **Obsolete documents** — In a library's side panel, tick the documents, click **Archive selected** and **Confirm**. They are archived to your organisation's archive destination. To archive obsolete content in bulk or on a schedule, set up an **Obsolete Content Policy** with an archive action. See [How to Archive Obsolete Content](./07-archive-obsolete-content.md).
   - **Trivial documents** — Tick sites or libraries in the table if you want to limit the removal, click **Actions**, then **Remove selected trivial data** or **Remove all trivial data**, and **Confirm**. Removal deletes the documents and cannot be undone.
   - **Large files and empty folders** — Add a **Large File Policy** or an **Empty Folder Cleanup Policy**. See [How to Add a Governance Policy](./05-add-a-governance-policy.md).
7. Follow the archiving or removal on the [Actions](../02-manage/actions/README.md) page.

## Result

Archiving and removal run in the background. After they finish and the next scan completes, the dashboard and the ROT reports show the reduced item counts and storage.

## Related

- [Storage Optimization dashboard](../03-main/dashboard/storage-optimization.md)
- [Storage Optimisation Overview](../04-reports/storage-optimization/README.md)
- [Duplicate Documents Report](../04-reports/duplicate-documents-report/README.md), [Obsolete Documents Report](../04-reports/obsolete-documents-report/README.md), [Trivial Documents Report](../04-reports/trivial-documents-report/README.md)
- [Archiving](../10-archive/README.md)
- [Predefined Policies](../appendix/predefined-policies.md)
