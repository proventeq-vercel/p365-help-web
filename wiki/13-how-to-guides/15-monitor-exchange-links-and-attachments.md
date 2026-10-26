---
title: "How to Monitor Exchange Links and Attachments"
description: "How to set up an Exchange Monitoring workspace in Proventeq365 to analyse the attachments and SharePoint or OneDrive links your organisation sends by email, including to external recipients."
type: howto
updated: 2026-10-26
---

# How to Monitor Exchange Links and Attachments

To see how files are shared by email, create a workspace of the **Exchange Monitoring** type. Proventeq365 analyses the email folder you choose (for example *Sent Items*), tells internal and external recipients apart using your internal domains, and reports the attachments and links it finds by country, office and department.

## Before you begin

- You need the **Tenant Admin** role to create workspaces, and your license must include the **Exchange** feature.
- The Proventeq365 app registration needs the `Mail.Read` application permission, which the prerequisites script requests. Proventeq365 reads email metadata, links and attachment names and sizes through Microsoft Graph; it does not store email bodies or attachment content.
- Know your organisation's **internal email domains** (for example *contoso.com*), so that external recipients can be identified.

## Steps

1. Open **Manage** → **Workspaces** and click **+ Create New Workspace**.
2. Enter a **Workspace name**, select the **Exchange Monitoring** card and click **Next**.
3. On the **Schedule** step, choose **One time** or **Recurring** and set the time, then click **Next**. Scheduling works the same as for a Microsoft 365 Governance workspace.
4. On the **Configuration** step, set:
   - **Email Folder** — the folder to analyse, for example *Sent Items*.
   - **Internal Domains** — your internal email domains.
   - **Email retention in months** — enter `0` for no limit, or for example `12` to analyse the last 12 months.
   - Optionally, the **Exclude addresses starting with**, **containing** and **ending with** rules, for example `noreply` or `system`.
5. Click **Next**, add the users who should have access to the workspace, and click **Create Workspace**.
6. When the scan has completed, open the [Email Report](../11-exchange-monitoring/email-report.md) and the [Link Report](../11-exchange-monitoring/link-report.md).

## Result

The Email and Link reports show how many attachments and links were sent, where they went, and which countries, offices and departments send them. Click any bar to filter the report.

## Related

- [Exchange Monitoring](../11-exchange-monitoring/README.md)
- [Create Exchange Monitoring Workspace](../11-exchange-monitoring/create-workspace.md)
