---
title: "How to Update a Published Template"
description: "How to change a published Proventeq365 provisioning template safely: start a draft version, edit it, test it and publish it, or restore an earlier version."
type: howto
updated: 2026-10-26
---

# How to Update a Published Template

A published provisioning template cannot be edited directly. To change it, you start a **draft version**, make your changes there and publish the draft. Users keep requesting from the current published version until you publish the draft, so they never see a half-finished template.

## Before you begin

- You need the **Tenant Admin** role, and your license must include the **Provision** feature.
- A template can have only one draft at a time. If someone else already opened a draft, you continue that draft.

## Steps

1. Open **Self Service** → **Templates**.
2. In the template's row, click **Edit — creates a new draft version**. If the template already has a draft, the icon reads **Continue editing the draft**. The draft opens with the next version number and the status **Draft**.
3. Make your changes: the template details, **Template Access & Approvals**, **User Inputs** and the containers. Save each container you change.
4. Optionally, test the draft before publishing. See [How to Test a Template Before Publishing](./28-test-a-template-before-publishing.md).
5. In the draft, open the menu next to the **Draft** status and click **Publish**. If Proventeq365 reports *Template contains validation errors*, fix the containers it lists and publish again.

## Result

The draft becomes the **Published** version and the version users requested from before becomes **Unpublished**. New requests use the new version straight away; the **Status** column on the **Templates** screen shows the new version number. All versions stay in the template's **Version history**.

To go back to an earlier version, open **Version history** from the **Versions** column, click **Restore this version — creates a new draft from it** on that version, and publish the new draft. To discard a draft instead of publishing it, delete it with the delete icon in the template's row.

## Related

- [Template Versions](../05-self-service/templates/template-versions.md)
- [Templates](../05-self-service/templates/README.md)
- [How to Create a Provisioning Template](./12-create-a-provisioning-template.md)
