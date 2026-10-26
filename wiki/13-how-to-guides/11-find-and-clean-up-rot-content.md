---
title: "How to Find and Clean Up ROT Content"
description: "How to use Proventeq365 to find redundant (duplicate), obsolete and trivial (ROT) files in SharePoint, OneDrive and Teams, export the list, and archive or remove them."
type: howto
updated: 2026-10-26
---

# How to Find and Clean Up ROT Content

**ROT** is content that is **redundant** (duplicate copies), **obsolete** (old and no longer used) or **trivial** (temporary or low-value files). Proventeq365 finds ROT content in every workspace scan and shows it in the Storage Optimisation dashboard and reports. To clean it up, review the reports, export the lists for the content owners, and then archive or remove the files — manually or automatically with policies.

## Before you begin

- A workspace must have completed at least one scan. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
- Check the workspace's **obsolete** and **trivial detection** rules on the workspace **Configuration** step (for example, the obsolete age in months and the trivial file extensions and names). The reports use these rules. See [Workspaces — Analysis Configuration](../02-manage/workspaces/README.md#analysis-configuration).

## Steps

1. Open **Main** → **Dashboard**, select the workspace and open the **Storage Optimization** tab. It shows how many files and how much storage fall into each ROT category, and the storage you could reclaim.
2. Open the detailed report for the category you want to clean up: **Reports** → **Storage Optimisation** → **Duplicate Documents**, **Obsolete Documents** or **Trivial Documents**.
3. Narrow the results: click any bar in the charts (for example a creation year, file extension or author) to filter the whole report. The active filters appear next to **Filter by**, and you can combine several.
4. In the table, expand a site to see the libraries or OneDrive locations that contain ROT items, and click an item count to list the documents.
5. Click **Export Data** to download the list for review with the content owners.
6. Clean up the confirmed content:
   - To move obsolete content to low-cost storage, set up an **Obsolete Content Policy** with the **Archive** action. See [How to Archive Obsolete Content](./07-archive-obsolete-content.md).
   - To remove large files or empty folders, add a **Large File Policy** or an **Empty Folder Cleanup Policy**. See [How to Add a Governance Policy](./05-add-a-governance-policy.md).

## Result

After the clean-up actions run and the next scan completes, the Storage Optimization dashboard and the ROT reports show the reduced item counts and storage.

## Related

- [Storage Optimization dashboard](../03-main/dashboard/storage-optimization.md)
- [Duplicate Documents Report](../04-reports/duplicate-documents-report/README.md), [Obsolete Documents Report](../04-reports/obsolete-documents-report/README.md), [Trivial Documents Report](../04-reports/trivial-documents-report/README.md)
- [Predefined Policies](../appendix/predefined-policies.md)
