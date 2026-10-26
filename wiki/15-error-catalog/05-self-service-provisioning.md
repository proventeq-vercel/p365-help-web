---
title: "Error Messages: Self-Service Provisioning"
description: "What Proventeq365 self-service provisioning errors mean and how to fix them — including “The SharePoint site could not be created because the URL already exists”, “Provisioning failed” and template validation messages."
type: reference
updated: 2026-10-26
---

# Error Messages: Self-Service Provisioning

Messages you may see when building a provisioning template, raising a request, or when Proventeq365 provisions the requested site, team or user.

## Provisioning errors

When a request ends with the status **Provisioning failed**, open it from **Request History**. The **Provisioning errors** panel lists each error with an **Action** line; select **show technical details** for the underlying message. If a site was partly created before the failure, Proventeq365 removes it. Fix the cause and submit a new request.

### The SharePoint site could not be created because the URL already exists.

**Fix:** Choose a different site name or URL, or ask your administrator to remove the existing site. This can also happen when a site with the same name or URL was created while the request was waiting for approval.

### Provisioning failed because a site with the same name or URL was created while the request was awaiting approval.

**Where:** technical details of a failed request.
**Fix:** Submit the request again with a different site name, or ask the template owner to change the URL configuration.

### A folder with that name already exists in the target location.

**Fix:** Rename the folder in the template, or ask your administrator to remove the existing folder.

### The site could not be created because no owner was supplied.

**Fix:** Submit the request again with at least one owner.

### Microsoft 365 refused the operation because the provisioning account lacks permission.

**Fix:** Ask your administrator to check the permissions granted to the Proventeq365 app registration. Provisioning needs the **read-write** permission set with admin consent — see [API Permissions](../12-deployment-prerequisites/04-entra-app-registration.md#api-permissions).

### The template this request is based on could not be found.

**Fix:** Ask your administrator to check that the template is still published, then submit the request again.

### The operation exceeded a Microsoft 365 quota or limit.

**Fix:** Ask your administrator to free up capacity or raise the tenant quota in Microsoft 365, then submit the request again.

### The user account could not be created because it already exists.

**Fix:** Use a different user principal name, or ask your administrator to remove the existing account.

### The user account this step needed could not be found.

**Fix:** Check that the user principal name is correct and that the account still exists in your tenant.

### This content type is not available as a published content type in the tenant's hub.

**Where:** technical details, prefixed with the library and content type names.
**Fix:** Publish the content type in the SharePoint content type gallery, or remove it from the library in the template.

### None of the requested default-value fields were found in library …

**Fix:** Correct the column names used for default values in the template so they match the library's columns.

### An unexpected error occurred during provisioning.

**Fix:** Select **show technical details** and give the message to your administrator. If the request failed before any detail was recorded, the panel says *No error details recorded*; contact your administrator.

### Site provisioning failed

**Where:** notification, and an email *Site provisioning failed: (site title)* when a notification mailbox is set up.
**Fix:** Open the request in **Request History** to see the provisioning errors.

## Raising a request

### Value required for this user input

**Fix:** Fill in every user input row before clicking **Create Request**.

### A SharePoint site with the name … already exists. Please choose a different site name.

**Fix:** Enter a different value for the input that sets the site name.

### The SharePoint site URL … is already in use. Please modify the site name or URL configuration.

**Fix:** Change the value that makes up the site address.

### SiteDefinition with ID … not found.

**Cause:** the template no longer exists, or you are not allowed to use it — templates can be limited to selected users.
**Fix:** Pick another template, or ask the template owner to give you access.

### SiteDefinition with ID … is … and cannot be provisioned.

**Cause:** the template is not **Published**.
**Fix:** Ask your administrator to publish the template.

### Failed to remove request. It may have been approved already.

**Cause:** requests can be removed only while they are **Awaiting approval** or **Approval rejected**.

### Failed to approve request / Failed to reject request

**Cause:** only the approvers named on the template can decide a request.
**Fix:** Check that you are an approver on the template, then try again.

## Building templates

### Title is required / Image must be imported

**Fix:** Enter a **Title** and import a template image (PNG, JPG or SVG).

### Input key can only contain letters and numbers — no spaces or special characters

**Fix:** Use only letters and digits in the **Input Key**, for example `SiteSuffix`.

### A user input with this name has been added already / User input keys must be unique

**Fix:** Give each user input a different key.

### Owner is required

**Fix:** Add at least one owner to the site, or bind the owners to a user input.

### Choose a hub site from the list, or insert a hub site user input

**Fix:** Pick a hub site from the list, or bind the field to a hub site user input with **Apply User Input**.

### URL cannot contain '/' character

**Fix:** Enter the site URL part without slashes. The managed path, such as `sites`, is added for you.

### Library names must be unique and non-empty / Channel names must be unique and non-empty

**Fix:** Give every library or channel in the container a different, non-empty name.

### Max minor version cannot be more than 511

**Fix:** Enter 511 or less for the number of minor versions.

### Password must be at least 8 characters long.

**Where:** **Create User** container.
**Fix:** Use a longer default password, or a **Generate Password** user input.

### Template contains validation errors

**Where:** when publishing.
**Fix:** Open each container listed in the dialog and correct the errors shown, then publish again.

### Only a draft version can be edited. Start a new draft version of the template instead.

**Cause:** published and earlier versions of a template are read-only.
**Fix:** Start a new draft version, edit it and publish it.

### A published site definition cannot be deleted.

**Fix:** Only **Draft** versions can be deleted. Unpublish a template to stop it being used.

### This template already has a draft (version N). Publish or delete it before starting another.

**Fix:** Open the existing draft, or delete it before starting a new one.

## Related

- [Troubleshooting — Self-service provisioning](../14-troubleshooting/README.md#self-service-provisioning)
- [How to Create a Provisioning Template](../13-how-to-guides/12-create-a-provisioning-template.md)
- [How to Request a New Site, Team or User](../13-how-to-guides/13-request-a-site-team-or-user.md)
