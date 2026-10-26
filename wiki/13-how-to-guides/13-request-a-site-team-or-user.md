---
title: "How to Request a New Site, Team or User"
description: "How to raise a Proventeq365 self-service request from a published template to provision a SharePoint site, Microsoft Team, library, channel or user account, and track it to completion."
type: howto
updated: 2026-10-26
---

# How to Request a New Site, Team or User

To get a new SharePoint site, Microsoft Team, library, channel or user account through self-service, open **Self Service** → **New Request**, pick a published template, fill in the values it asks for and click **Create Request**. Proventeq365 provisions the resources in Microsoft 365 — after approval, if the template requires it — and you can follow progress in **Request History**.

## Before you begin

- Your license must include the **Provision** and **Approvals** features. **Approvals** is needed to submit and list requests, even for templates that do not require approval.
- A **Published** template must be available to you. If you can't see the template you need, ask your Proventeq365 administrator; templates can be limited to selected users.

## Steps

1. Open **Self Service** → **New Request**.
2. On **Select Template**, choose the template card and click **Next**.
3. On **Configure Request**, enter a **Request Name** that will help you find the request later.
4. Fill in the value for each user input row — type text, search for and pick a site, team or person, or click **Generate** for a password.
5. Click **Create Request**. The button is enabled once all required values are valid.
6. Open **Self Service** → **Request History** to follow the request. Its status moves through **Awaiting approval** (only if the template requires approval), **Awaiting provisioning**, **Provisioning in progress** and finally **Provisioning successful**.
7. Click **View** on the request to see its details and the values you entered.

## Result

When the status is **Provisioning successful**, the site, team, library, channel or user exists in Microsoft 365 as defined by the template. If the status is **Approval rejected**, an approver declined the request and nothing was created. If the status is **Provisioning failed**, open the request to see the **Provisioning errors** panel — each error says what went wrong and what to do; a partly created site is removed automatically. Fix the cause and submit a new request. See [Troubleshooting — Self-service provisioning](../14-troubleshooting/README.md#self-service-provisioning).

## Related

- [New Request](../05-self-service/new-request/README.md)
- [Request History](../05-self-service/request-history/README.md)
- [How to Approve or Reject a Provisioning Request](./14-approve-or-reject-a-request.md)
