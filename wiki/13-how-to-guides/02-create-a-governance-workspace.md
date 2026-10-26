---
title: "How to Create a Microsoft 365 Governance Workspace"
description: "How to create a Proventeq365 workspace that scans SharePoint sites, Teams sites and OneDrives — choose the scope, schedule the data refresh, set the ROT rules, add policies and assign users."
type: howto
updated: 2026-10-26
---

# How to Create a Microsoft 365 Governance Workspace

A **workspace** defines what Proventeq365 scans and who can see the results. To create one, open **Manage** → **Workspaces**, click **Create New Workspace**, and complete the five wizard steps: **Sources**, **Schedule**, **Configuration**, **Policies** and **Users**. Reports and the dashboard fill with data once the workspace's first data refresh has finished.

## Before you begin

- Decide the **scope**: the whole tenant, a list of sites you type in, or a list you import from a CSV file.
- Decide how often the data should be refreshed: once, or on a recurring schedule.
- Know who should have access to the workspace. Every workspace needs at least one user.

## Steps

1. Open **Manage** → **Workspaces** and click **Create New Workspace**.
2. On **Sources** (*Define Your Workspace*), enter a **Workspace name**, keep the **Microsoft 365 Governance** type selected, and choose a **Scope**:
   - **Select all sites** — include all site collections, all OneDrives, or both.
   - **Manually add sites** — enter one site per line, for example `/sites/Finance` or `/teams/ProjectTeam`.
   - **Import CSV file** — drop a CSV file with the sites to include. See the [sample CSV format](../02-manage/workspaces/README.md#import-csv-file).
3. Click **Next**. On **Schedule** (*Data Refresh Schedule*), choose:
   - **One time** — runs once. Turn on **Schedule run time** to pick a future date and time; otherwise it runs straight away.
   - **Recurring** — choose **Daily**, **Weekly**, **Monthly** or **Hourly** and set the time. Use **Add time slot** for more than one run.
4. Click **Next**. On **Configuration** (*Analysis Configuration*), review the rules that identify **obsolete** content (age in months and file extensions) and **trivial** content (file extensions, names and name prefixes, and optionally 0 KB files).
5. Click **Next**. On **Policies** (*Governance Policies*), optionally turn on **Enable policies**, enter a policy name, choose a **Policy rule** and click **Add Policy** for each policy you want. You can also add policies later. See [How to Add a Governance Policy](./05-add-a-governance-policy.md).
6. Click **Next**. On **Users** (*Workspace Users*), search by name or email address, add each person and choose their role: **Workspace User** or **Workspace Admin**.
7. Click **Create Workspace**.

## Result

The workspace appears in the **Workspaces** list. When its first data refresh has finished, the **Last Run** column shows **Completed** and the dashboard and reports show data for the workspace. Large scopes take longer to refresh than small ones.

## Related

- [Workspaces](../02-manage/workspaces/README.md) — every field in the wizard.
- [How to Run a Workspace Scan](./03-run-a-workspace-scan.md)
- [How to Monitor Exchange Links and Attachments](./15-monitor-exchange-links-and-attachments.md) — the Exchange Monitoring workspace type.
- [Troubleshooting — Workspaces and data refresh](../14-troubleshooting/README.md#workspaces-and-data-refresh)
