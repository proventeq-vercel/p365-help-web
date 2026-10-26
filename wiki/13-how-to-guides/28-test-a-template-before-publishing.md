---
title: "How to Test a Template Before Publishing"
description: "How to run a real test request against a draft Proventeq365 provisioning template, check the result in Request History, and clean up before you publish."
type: howto
updated: 2026-10-26
---

# How to Test a Template Before Publishing

A **test run** provisions a request from a template's draft version, before the draft is published, so you can check that the template creates what you expect. Test runs provision for real in Microsoft 365, and only Tenant Admins can start them.

## Before you begin

- You need the **Tenant Admin** role, and your license must include the **Provision** feature.
- The template must have a **Draft** version. To start one for a published template, see [How to Update a Published Template](./27-update-a-published-template.md).
- Choose names and values you can recognise and remove afterwards — the test creates real sites, teams or users.
- If the template requires approval, an approver must approve the test run before it is provisioned.

## Steps

1. Open **Self Service** → **Templates**.
2. In the template's row, click **Test run the draft before publishing**. The request form opens with the notice *This is a test run of an unpublished draft. It provisions for real, so use it to check the template before you publish it.*
3. Enter the **Request name** and fill in the template's **User Inputs**.
4. Click **Start Test Run**. If the form lists problems under *Request validation issues*, correct them and try again.
5. You are taken to **Request History**. Open the test run to follow its stages.
6. When it shows **Provisioning successful**, open the created site, team or user in Microsoft 365 and check it. If it shows **Provisioning failed**, click **View full request** and check the **Provisioning errors** panel.
7. Fix any problems in the draft and run another test if needed.
8. Remove what the test created in Microsoft 365 if you don't want to keep it.

## Result

The test run is listed in your **Request History** like any other request. The draft stays a draft until you publish it. While a test run is awaiting approval or being provisioned, the draft cannot be deleted.

## Related

- [Template Versions](../05-self-service/templates/template-versions.md#test-a-draft-before-publishing)
- [Request History](../05-self-service/request-history/README.md)
- [Error Messages: Self-Service Provisioning](../15-error-catalog/05-self-service-provisioning.md)
