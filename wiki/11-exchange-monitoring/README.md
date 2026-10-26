---
title: "Exchange Monitoring"
description: "See how attachments and SharePoint or OneDrive links are shared by email across your organisation, by country, office and department, and how much storage attachments take."
type: article
updated: 2026-10-26
---

# Exchange Monitoring

An **Exchange Monitoring** workspace scans the mailboxes in your Exchange Online tenant and reports how files are shared by email: as **attachments**, which add to mailbox storage, or as **links** to SharePoint and OneDrive. Use it to see which countries, offices and departments send the most attachments, how much storage those attachments take, and how many links point outside your organisation.

## Key Capabilities

- **Attachment analysis** — The number of attachments sent and the storage they take, so you can see where large files are being sent instead of shared as links.
- **Link sharing visibility** — Links to SharePoint, OneDrive for Business, personal OneDrive and WeShare found in email, split by the system they point to.
- **Internal and external** — Emails sent to recipients outside your internal domains, and links that point to locations outside your organisation.
- **Trends over time** — Monthly figures, and a history of every data refresh, so you can follow the effect of a "send links, not attachments" campaign.

## Who Can Use It

- Your license must include the **Exchange** feature. Without it, the Exchange Monitoring reports are not available.
- A **Tenant Admin** creates the workspace. See [Workspaces](../02-manage/workspaces/README.md).
- Any user with a role on the workspace (**Workspace User** or higher) can view the reports.

## How Exchange Monitoring Works

1. Create a workspace of the **Exchange Monitoring** type and choose the mailbox folder, your internal domains and any mailboxes to leave out. See [Create Exchange Monitoring Workspace](./create-workspace.md).
2. Proventeq365 runs an email scan on the schedule you set. Each scan reads the chosen folder in every mailbox in scope and records the attachments and links it finds. It does not store email bodies or attachment content.
3. Open the workspace to use the reports. An Exchange Monitoring workspace has no dashboard: the side menu shows **Reports** → **Emails** and **Links**, and the workspace opens on the **Emails** report.

Until the first email scan has finished, the reports show its progress instead of data — for example *Email scan is scheduled to run* or *Email scan is in progress*. If a scan fails or is stopped before any data is available, click **Refresh data** to start a new one. When a later scan is collecting data, the reports keep showing the results of the latest completed scan. If the newest scan failed, a banner says the figures come from an earlier refresh.

## Sections

- [Create Exchange Monitoring Workspace](./create-workspace.md) — Configure how Exchange email data is analysed.
- [Email Report](./email-report.md) — Attachments, attachment storage and links in email.
- [Link Report](./link-report.md) — The SharePoint and OneDrive links shared by email, internal and external.

## Related

- [How to Monitor Exchange Links and Attachments](../13-how-to-guides/15-monitor-exchange-links-and-attachments.md)
- [Workspaces](../02-manage/workspaces/README.md)
- [Workspace Runs](../02-manage/workspaces/workspace-runs.md)
- [Workspaces and Data Refresh Errors](../15-error-catalog/02-workspaces-and-data-refresh.md)
