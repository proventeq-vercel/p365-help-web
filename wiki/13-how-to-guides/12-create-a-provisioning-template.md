---
title: "How to Create a Provisioning Template"
description: "How to build and publish a Proventeq365 self-service template that lets users request SharePoint sites, Microsoft Teams, libraries, channels or user accounts within your governance rules."
type: howto
updated: 2026-10-26
---

# How to Create a Provisioning Template

A **provisioning template** defines what gets created when someone raises a self-service request — for example a SharePoint site with set libraries and labels, a Microsoft Team with channels, or a new user account. You build the template once, decide who can use it and whether requests need approval, and then **publish** it so it appears under **New Request**.

## Before you begin

- You need the **Tenant Admin** role to manage templates, and your license must include the **Provision** feature.
- Prepare a template image (PNG, JPEG, WebP, BMP, AVIF or SVG, up to 5 MB) — it is required.
- Decide which values requesters should provide, for example a site name suffix or the owners. These become the template's **user inputs**.
- Decide who should be able to use the template and who should approve requests.

## Steps

1. Open **Self Service** → **Templates** and click **Create New Template**.
2. Enter a **Title**, optionally a **Description**, and import the **template image**.
3. Under **Template Access & Approvals**:
   - Turn on **Limit Template Access** and add users if only some people should see the template.
   - Turn on **Require Approval Before Provisioning** and add the approvers if requests must be approved first.
4. Under **User Inputs**, add each value the requester must provide: enter an **Input Key** (letters and numbers only), a **Field Label** and an **Input Type** (**Text Field**, **Teams Site Selection**, **SharePoint Site Selection**, **Hub Site Selection**, **User Selection** or **Generate Password**), then add it. You can also create inputs later, while configuring a container, with **Add & insert**.
5. Click **Continue**, then **Save as Draft**. The template opens with the status **Draft**.
6. On the **Containers** tab, click **+ Add** and choose what the template creates:
   - **Start with a SharePoint Site** — create a new site, replicate an existing site, create a site from a template file, add folders to an existing library, or add a library to an existing site.
   - **Start with a Microsoft Team** — create a new Team, or add channels to an existing Team.
   - **User Management** — create a user, or terminate a user.
7. Configure the container. Wherever a value should come from the requester, click **Apply User Input** and select the matching input. Click **Save** — the message *Plugin successfully updated!* confirms it.
8. Repeat for any other containers, then open the menu next to the **Draft** status and click **Publish**. Proventeq365 validates the template first and lists any container that still needs attention.

## Result

The template status changes to **Published** and the template appears under **New Request** for the users allowed to see it. Templates are versioned: to change a published template, start a new draft version, edit it and publish it. To take a template out of use, **Unpublish** it. Only **Draft** templates can be deleted.

## Related

- [Templates](../05-self-service/templates/README.md) — every template and container setting.
- [How to Request a New Site, Team or User](./13-request-a-site-team-or-user.md)
- [Hub Site](../appendix/README.md#hub-site)
