---
title: "How to Connect Another System with the Public API"
description: "How to let a service desk or workflow tool submit Proventeq365 provisioning requests: create an app connection, sign requests to the Public API, and receive callbacks."
type: howto
updated: 2026-10-26
---

# How to Connect Another System with the Public API

The Proventeq365 Public API lets another system create provisioning requests from your published templates and get the result back automatically. You create an **app connection** in Proventeq365, give its client ID and secret to the other system, and that system signs each request with the secret.

## Before you begin

- You need the **Tenant Admin** role, and your license must include the **Provision** feature.
- Publish the template the other system will request from. See [How to Create a Provisioning Template](./12-create-a-provisioning-template.md).
- The other system needs an `https://` endpoint reachable from the internet to receive callbacks.
- Ask your administrator or Proventeq for the base address of your Public API.

## Steps

1. Open **Systems** → **Settings** and, under **App Connections**, click **Create connection**.
2. Enter the other system's **Callback URL**. To restrict the connection to one workspace, enter its **Workspace ID**; otherwise leave it blank.
3. Click **Create**. Copy the **Client ID** and the **Secret** from the **App Connection Secret** dialog and store them in the other system's secure configuration, then click **Done**. The secret is not shown again.
4. Note the template's ID: open the template in Proventeq365 and copy the identifier from the browser's address bar. Note the template's user input keys, for example `#ProjectName#`.
5. In the other system, send `POST /api/public/v1/hook` with the action `provision`, a `uniqueId` of your own, the template ID, a request title and the user input values. Sign every call with the headers `X-Client-Id`, `X-Timestamp` and `X-Signature` as described in [Public API](../06-settings/public-api.md#signing-a-request).
6. Check that the call returns `202 Accepted`. A `400` response includes an `error` that says what to fix.
7. Have the other system verify each callback's signature and reply with a `2xx` status.

## Result

Each accepted call creates a provisioning request on behalf of the Tenant Admin who created the connection. It appears in that admin's **Request History** and follows the template's approval rules. When the request is provisioned, fails or is rejected, the other system receives a signed callback with the status `Provisioned`, `Failed` or `Rejected` and, when available, the address of what was created. If the secret is exposed, click **Rotate secret** and update the other system; to stop the integration, click **Disable**.

## Related

- [Public API](../06-settings/public-api.md)
- [Settings](../06-settings/README.md#app-connections)
- [Error Messages: Settings, Notifications and Public API](../15-error-catalog/06-settings-and-notifications.md#public-api)
