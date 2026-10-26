---
title: "Site Engagement"
description: "See how each SharePoint site is used month by month — views, viewers, editors, file activity and who has access — to spot active and dormant sites."
type: article
updated: 2026-10-26
---

# Site Engagement

The **Site Engagement** report shows how the SharePoint sites in a workspace are used over time. For each site it compares how many people can view or edit the site with how many actually view it and save files in it, month by month. Use it to spot dormant sites, sites that many people can reach but few use, and sites that are open to all staff.

Open it from **Reports** → **Site Engagement**. The report is available in **Microsoft 365 Governance** workspaces.

## Who Can Use It

- Any user with a role on the workspace (**Workspace User** or higher) can view the report.
- Your license must include site engagement reporting. Without it the menu item is hidden, and opening the page shows the **Site engagement** license page.

## Where the Data Comes From

Site engagement figures are collected during each data refresh of the workspace:

- **Views** and **Viewers** come from Microsoft 365 site activity. A month that Microsoft 365 has no activity data for shows a dash (—), which is different from a measured 0.
- **View access**, **Edit access**, **Shared links** and the **Open to all staff** badge come from the site permissions discovered in the workspace. If permissions have not been discovered, these columns show a dash. People in Entra ID groups are counted through the **Group memberships** stage of **Entra ID discovery**, which you choose when you create the workspace.
- **Files**, **Active files**, **Versions** and **Editors** come from the files discovered in the workspace.

Access counts are taken at each data refresh, so the access history builds up month by month as the workspace refreshes.

How many months of history the report keeps is set by **Engagement retention in months** under **Site engagement** on the workspace's **Analysis Configuration** step. The default is 24 months. See [Workspaces](../../02-manage/workspaces/README.md).

## Filters

The report covers the retention period, ending with the current month. You can narrow it, and the filters you set appear as chips next to **Active filters** at the top of the page:

- **Time range** — click a month in the **Sites Metrics Over Time** chart, then click a second month to set the end of the range ("Start: 01/2026 — now click a second point to set the end of the range"). Click **Cancel** to stop. The range then shows as a chip, for example "01/2026 – 06/2026". Remove the chip to return to the whole retention period.
- **Sites** — one chip for each site you select by clicking its bar in the access charts or a small group in the line chart.

Click **Clear all** to remove all filters.

## Access Charts

Two charts rank the sites by how many people can reach them:

- **View access per site** — "Current view access — log scale". The number of people who can access each site.
- **Edit access per site** — "Current edit access — log scale". The number of people who can edit each site.

Both use a logarithmic scale, so very large and very small sites fit on the same chart. Sites with a value of zero are left out, with a note such as "3 site(s) with zero value omitted." Use **Search sites** to find a site.

Click a bar to select that site. You can select several sites. The selection filters the line chart and the sites table.

## Sites Metrics Over Time

The line chart shows one metric over the selected months. Choose the metric with the buttons at the top right: **Views**, **Viewers**, **Editors**, **Versions**, **File Count**, **Active Files**, **View Access**, **Edit Access**, **View Engagement** or **Edit Engagement**.

When no sites are selected, the sites are ranked by the chosen metric and split into eight equal groups, for example **Top 12% (12 sites)** or **12-25% (12 sites)**. Each line is one group, so you can compare the most and least active sites at a glance. The subtitle shows how many groups and months are in view.

- Click a group in the legend to drill into it. A group of 10 sites or more is split again into eight smaller groups, and a breadcrumb such as **All sites** › **Top 12% (120 sites)** shows where you are; click a breadcrumb to go back. A group of fewer than 10 sites is shown as one line per site.
- When sites are selected, the chart shows one line per site. Click a site in the legend to remove it from the selection.
- Changing the metric re-ranks the sites, so an active drill-down is reset ("Buckets are recomputed per metric — drill-down was reset.").

## Sites Table

The table lists one row per site. Choose the period with the tabs above it:

- **Last full month** — the default. Shows the most recent completed month captured for the workspace, named in the note above the table, for example "Showing September 2026, the most recent completed month captured for this workspace." If the workspace stopped refreshing, this month can be older than last month.
- **Totals for period** — totals for the selected time range.

Hover over a column header to see how the figure is calculated.

- **Site name** — the site, with a link to open it in SharePoint.
- **View access** — people who can access the site: direct permissions, the members of every group with access, and people with named or company-wide sharing links. Disabled and service accounts are not counted. An **All** badge marks sites that are **Open to all staff** — sites shared with everyone in the organisation, for example through an "Everyone except external users" permission or an organisation-wide sharing link.
- **Edit access** — the people from **View access** who can add, edit or delete content.
- **Views** — views of the site, added up across the months.
- **Viewers** — distinct viewers in each month, added up across the months. A person active in several months is counted once per month.
- **Editors** — distinct people who saved document versions in each month, added up across the months.
- **Versions** — file versions created in the site, added up across the months.
- **Files** — files in the site, as of the latest month in the range.
- **Active files** — files that were created or edited in each month, added up across the months.
- **View engagement** — viewers as a percentage of **View access**. Over several months this is the average of the monthly percentages. It can be more than 100%, for example when people view the site through "Anyone" links without having access themselves.
- **Edit engagement** — editors as a percentage of **Edit access**, averaged in the same way. It can also be more than 100%.

Engagement shows a dash when the access figure is unknown or 0.

Above the table:

- **Search** — find a site by name.
- **Refresh** — reload the table.
- **Export** — opens **Export site engagement** and downloads the current view as a CSV file. On the **Totals for period** tab, turn on **Include monthly breakdown** to export one row per site and month instead of one row per site.

The table shows 50 rows per page (50, 100, 250 or 500) and can be sorted by any column.

## Monthly Breakdown

Click a row to open the site's month-by-month figures for the selected time range.

The panel shows the site name and address, the **Open to all staff** badge where it applies, and a table with one row per month: **Month**, **View access**, **Edit access**, **Shared links** (the number of "Anyone" sharing links), **Views**, **Viewers**, **Editors**, **Versions**, **Files**, **Active files**, **View engagement** and **Edit engagement**.

## Related

- [Workspace Inventory](../workspace-inventory/README.md)
- [Storage Optimisation](../storage-optimization/README.md) — includes inactive sites you could archive.
- [Security & Oversharing](../security-oversharing/README.md)
- [Troubleshooting — The reports show old data and a warning banner](../../14-troubleshooting/README.md#the-reports-show-old-data-and-a-warning-banner)
