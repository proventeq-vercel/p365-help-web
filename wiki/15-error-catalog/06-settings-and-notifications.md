---
title: "Error Messages: Settings, Notifications and Public API"
description: "What Proventeq365 app connection, notification and Public API errors mean and how to fix them — including “Failed to create app connection”, 401 responses and “Unknown provisioning parameter keyName”."
type: reference
updated: 2026-10-26
---

# Error Messages: Settings, Notifications and Public API

Messages you may see when managing app connections under **Settings**, on the **Notifications** screen, or in the responses your system receives from the Proventeq365 Public API.

## App connections

### Must be a valid https:// URL

**Where:** **Callback URL** field of the **Create App Connection** dialog.
**Fix:** Enter a full address that starts with `https://`, for example `https://your-app.example.com/callback`.

### Failed to create app connection

**Cause:** the connection could not be created. Common reasons: the callback URL points to a host that is not allowed — `localhost`, a private or loopback network address, or a `.local` or `.internal` name — or the **Workspace ID** does not belong to your organisation.
**Fix:** Use a public `https://` callback address and check the workspace ID, then try again.

### Failed to rotate secret

**Fix:** Reload the page and try again. Update the other system only with a secret shown in the **App Connection Secret** dialog.

### Failed to disable app connection

**Fix:** Reload the page and try again. A connection is disabled when its **Status** shows **Disabled**.

### Failed to copy to clipboard

**Where:** **App Connection Secret** dialog.
**Cause:** your browser blocked clipboard access.
**Fix:** Select the secret and copy it manually before you click **Done** — it is not shown again.

### Unable to load app connections

**Fix:** Click **Try again**. If it keeps failing, reload the page.

## Notifications

### Notifications could not be loaded.

**Where:** **Notifications** screen.
**Fix:** Reload the page. If it keeps happening, sign out and sign in again.

### Notifications arrive in the app but not by email

**Cause:** email is sent only for events whose **Email** box is ticked on the **Preferences** tab, and only when a notification mailbox has been set up for your organisation.
**Fix:** Check your preferences, then ask your administrator whether a notification mailbox is set up. See [Notification Mailbox](../12-deployment-prerequisites/07-run-post-deployment-script.md#notification-mailbox-optional).

### Failure notifications

These titles mean that something failed. The notification's detail line gives the reason, and clicking the notification opens the run or request concerned.

| Notification | Where to look |
| --- | --- |
| *Scan of the source system failed* | The workspace's run history. See [Error Messages: Workspaces and Data Refresh](./02-workspaces-and-data-refresh.md). |
| *Azure data refresh failed* / *Exchange data refresh failed* | The workspace's run history. |
| *Policy evaluation failed* | The policy on the **Policies** screen. See [Error Messages: Policies and Remediation Actions](./03-policies-and-remediation.md). |
| *Requested action on the source system failed* | The run on the **Actions** screen. |
| *Site provisioning failed* | The request in **Request History**. See [Error Messages: Self-Service Provisioning](./05-self-service-provisioning.md). |

## Public API

Responses your system can receive from `POST /api/public/v1/hook`. Refusals with a body have the form `{"status":"rejected","error":"…"}`; the headings below are the `error` texts. See [Public API](../06-settings/public-api.md).

### 401 Unauthorized (empty body)

**Cause:** one of: a missing `X-Client-Id`, `X-Timestamp` or `X-Signature` header; an unknown or disabled client ID; a timestamp more than 300 seconds from the server's time; a wrong signature; or a signature that was already used.
**Fix:** Check that the connection is **Enabled**, that your clock is correct, and that you sign exactly the body you send with the current secret. Sign every attempt again with a new timestamp — a request is accepted only once.

### 403 Forbidden (empty body)

**Cause:** your organisation's license is not active, or does not include the **Provision** feature.
**Fix:** Check the [License](../08-license/README.md) screen.

### 413 Payload Too Large

**Cause:** the request body is larger than 1 MB.

### 429 Too Many Requests

**Cause:** the connection sent more than its rate limit — 60 requests per minute by default.
**Fix:** Wait, then sign the request again with a new timestamp and resend it.

### Request body is required and must be valid JSON.

**Fix:** Send a JSON body with `action`, `uniqueId` and `payload`.

### Unknown action.

**Fix:** Set `action` to `provision`.

### uniqueId is required.

**Fix:** Send your own identifier for the request in `uniqueId`.

### Invalid provision payload.

**Cause:** `payload` is missing, is not a JSON object, or has no valid `siteDefinitionId`.
**Fix:** Send the template's ID in `payload.siteDefinitionId`.

### Workspace not permitted for this connection.

**Cause:** the connection is restricted to a workspace, and `payload.workspaceId` is missing or names a different workspace.
**Fix:** Send the connection's workspace ID in `payload.workspaceId`, or use a tenant-wide connection.

### uniqueId already used with a different payload.

**Cause:** you reused a `uniqueId` for a different request.
**Fix:** Use a new `uniqueId` for each new request. Resending the same `uniqueId` with the same payload is safe and returns `202 Accepted` without creating a second request.

### Site definition not found.

**Cause:** no template with that ID exists in your organisation.
**Fix:** Copy the template's ID again from the browser's address bar while the template is open.

### Template group has no Published version (requested version is …).

**Cause:** the template has no published version.
**Fix:** Ask a Tenant Admin to publish the template.

### Template definition changed during resolution, please retry.

**Where:** `409 Conflict` response.
**Fix:** Sign the request again and resend it.

### Unknown provisioning parameter keyName '…'.

**Cause:** a `keyName` in `payload.params` does not match any user input of the template.
**Fix:** Use the input keys exactly as defined in the template, including the `#` characters, for example `#ProjectName#`.

### Each provisioning param must contain KeyName.

**Fix:** Give every entry in `payload.params` a `keyName`.

### A SharePoint site with the name '…' already exists. Please choose a different site name.

**Fix:** Send a different value for the input that sets the site name.

### The SharePoint site URL '…' is already in use. Please modify the site name or URL configuration.

**Fix:** Send a different value for the input that makes up the site address.

### Content type publication could not be checked. Grant the tenant Graph identity Sites.FullControl.All and retry.

**Cause:** Proventeq365 could not check the content types used by the template.
**Fix:** Ask your administrator to grant the Proventeq365 app registration `Sites.FullControl.All` with admin consent, then resend the request.

### The plugin JSON is malformed.

**Cause:** a container of the template has an invalid configuration.
**Fix:** Ask a Tenant Admin to open the template's containers, save them again and republish the template.

## Related

- [Settings](../06-settings/README.md)
- [Public API](../06-settings/public-api.md)
- [Notifications](../09-notification/README.md)
