---
title: "Public API"
description: "Integrate another system with the Proventeq365 Public API: submit provisioning requests with HMAC-signed calls, verify signed callbacks, and handle rate limits and error responses."
type: article
updated: 2026-10-26
---

# Public API

The Proventeq365 Public API lets another system submit self-service provisioning requests — for example to create a SharePoint site or a Team from a published template when a ticket is approved in a service desk. Every call is signed with an app connection's secret, and Proventeq365 reports the outcome of each request back to your system with a signed callback.

This page is for the developer who builds the integration. You need an app connection, created by a **Tenant Admin** under [Settings → App Connections](./README.md#app-connections), and your license must include the **Provision** feature. The base address of the Public API is specific to your deployment — ask your administrator or Proventeq for it.

## Endpoints

| Method and path | Purpose | Signed |
| --- | --- | --- |
| `GET /api/public/v1/health` | Checks that the Public API is running. Returns `200` with `{"status":"healthy"}`. | No |
| `POST /api/public/v1/hook` | Submits an action. The only action is `provision`. | Yes |

## Request Headers

Every call to `/api/public/v1/hook` must carry:

| Header | Value |
| --- | --- |
| `X-Client-Id` | The connection's **Client ID**. |
| `X-Timestamp` | The current time as a Unix timestamp in seconds, for example `1767225600`. |
| `X-Signature` | The request signature (see below). |
| `Content-Type` | `application/json` |

## Signing a Request

1. Build the string to sign by joining these values with a full stop (`.`), in this order:

   ```text
   webhook.{X-Client-Id}.{X-Timestamp}.{METHOD}.{PATH_AND_QUERY}.{BODY}
   ```

   - `webhook` — the literal word.
   - `{METHOD}` — the HTTP method in capitals: `POST`.
   - `{PATH_AND_QUERY}` — the request path and any query string, for example `/api/public/v1/hook`.
   - `{BODY}` — the request body exactly as you send it.
2. Compute an HMAC-SHA256 of the UTF-8 bytes of that string, using the UTF-8 bytes of the connection's secret as the key.
3. Base64-encode the result and prefix it with `v1,`. That is the value of `X-Signature`, for example `v1,3q2+7w==…`.

Proventeq365 accepts a request only if:

- the client ID belongs to an **Enabled** connection;
- the timestamp is within **300 seconds** of the server's time;
- the signature matches; and
- the same signature has not been used before. Each signed request is accepted once, so sign every attempt — including a retry — again with a new timestamp.

Request bodies are limited to 1 MB.

## Submit a Provisioning Request

```json
{
  "action": "provision",
  "uniqueId": "TICKET-10452",
  "payload": {
    "siteDefinitionId": "<template ID>",
    "title": "Project Falcon site",
    "workspaceId": null,
    "params": [
      { "keyName": "#ProjectName#", "value": "Falcon" }
    ]
  }
}
```

- `action` — `provision`.
- `uniqueId` — Your own identifier for this request, unique per connection, for example your ticket number. It is returned in the response and in the callback, and it makes retries safe: sending the same `uniqueId` with the same payload again does not create a second request.
- `payload.siteDefinitionId` — The ID of the template. Open the template in Proventeq365; its ID is the identifier in the browser's address bar. Proventeq365 always uses the template's current **Published** version, whichever version's ID you send. A template with no published version is refused.
- `payload.title` — The request name, as a user would enter it under **New Request**.
- `payload.workspaceId` — Required, and must match, when the connection is restricted to a workspace. Leave it out or set it to `null` for a tenant-wide connection.
- `payload.params` — One entry per template user input: `keyName` is the input key exactly as defined in the template, including the `#` characters (for example `#ProjectName#`), and `value` is its value as text.

The request is created on behalf of the Tenant Admin who created the connection and follows the template's rules. If the template requires approval, the request waits for an approver before anything is provisioned. For a template that creates a site, Proventeq365 checks before accepting the request that the site name and address are not already in use.

### Responses

| Status | Body | Meaning |
| --- | --- | --- |
| `202 Accepted` | `{"action":"provision","uniqueId":"…","status":"accepted"}` | The request was created, or it is a repeat of a request already accepted with the same `uniqueId` and payload. |
| `400 Bad Request` | `{"action":"…","uniqueId":"…","status":"rejected","error":"…"}` | The request was refused. `error` says why — see [Error Messages: Settings, Notifications and Public API](../15-error-catalog/06-settings-and-notifications.md#public-api). |
| `409 Conflict` | `{"action":"provision","uniqueId":"…","status":"conflict","error":"…"}` | The template changed while the request was being processed. Sign the request again and resend it. |
| `401 Unauthorized` | Empty | Missing headers, unknown or disabled client ID, timestamp outside the window, wrong signature, or a signature that was already used. |
| `403 Forbidden` | Empty | Your organisation's license is not active or does not include the **Provision** feature. |
| `413 Payload Too Large` | Empty | The body is larger than 1 MB. |
| `429 Too Many Requests` | Empty | The rate limit was exceeded. Wait, then sign the request again and resend it. |

## Rate Limits

Each connection can send up to **60 requests per 60 seconds** by default. Calls from a single network address are also limited, to ten times that rate. Limits use fixed one-minute windows; a call over the limit is answered with `429`.

## Callbacks

When a request ends, Proventeq365 sends a `POST` to the connection's **Callback URL**:

```json
{
  "action": "provision",
  "uniqueId": "TICKET-10452",
  "status": "Provisioned",
  "payload": { "url": "https://contoso.sharepoint.com/sites/ProjectFalcon" }
}
```

`status` is one of:

- `Provisioned` — The request was provisioned. `payload.url` is the address of what was created.
- `Failed` — Provisioning failed. The Tenant Admin who created the connection can see the errors in their **Request History**.
- `Rejected` — An approver rejected the request.

### Verifying a Callback

A callback carries the same three headers — `X-Client-Id`, `X-Timestamp` and `X-Signature` — signed with the same secret and algorithm, but the string to sign starts with `callback` instead of `webhook`:

```text
callback.{X-Client-Id}.{X-Timestamp}.POST.{PATH_AND_QUERY}.{BODY}
```

`{PATH_AND_QUERY}` is the path and query string of your Callback URL, and `{BODY}` the raw callback body. Recompute the signature and compare it with `X-Signature`, check that the timestamp is recent, and reply with any `2xx` status.

### Delivery and Retries

If your endpoint answers with a `5xx`, `408` or `429` status, or cannot be reached, Proventeq365 tries again after a short delay — two attempts in total by default. Other error responses are not retried. Use `uniqueId` to ignore a callback you have already processed. No callbacks are sent for a connection that has been disabled.

## Related

- [Settings](./README.md)
- [How to Connect Another System with the Public API](../13-how-to-guides/30-connect-another-system-with-the-public-api.md)
- [Templates](../05-self-service/templates/README.md)
- [Error Messages: Settings, Notifications and Public API](../15-error-catalog/06-settings-and-notifications.md#public-api)
