---
title: "Error Catalog"
description: "Look up a Proventeq365 error or status message to find out what it means and how to fix it — sign-in and license, workspaces and scans, policies and actions, archiving and restore, self-service provisioning and deployment."
type: reference
updated: 2026-10-26
---

# Error Catalog

Find the message you saw, then follow its fix. Messages are grouped by the part of Proventeq365 where they appear. Text in *italics* or after "…" varies, for example a site name or a number.

Tip: use the site search, or your browser's find (Ctrl+F / Cmd+F), with a few words from the message.

## By area

| Area | Examples of messages covered |
| --- | --- |
| [Sign-in, Access and License](./01-sign-in-access-and-license.md) | *You don't have access to this page*, *A valid license is required*, *Invalid license format. The token must be a valid GUID.* |
| [Workspaces and Data Refresh](./02-workspaces-and-data-refresh.md) | *Data scan failed*, *A discovery run is already in progress for this workspace.*, *Upload failed: …*, workspace wizard messages |
| [Policies and Remediation Actions](./03-policies-and-remediation.md) | *Failed to start policy run*, *The last run of this policy failed*, *Partially completed*, *Nothing here can be removed* |
| [Connections, Archiving and Restore](./04-connections-and-archiving.md) | *Connection validation failed*, *Failed to delete connection*, *Access denied - you do not have permission to download this item* |
| [Self-Service Provisioning](./05-self-service-provisioning.md) | *The SharePoint site could not be created because the URL already exists.*, *Provisioning failed*, template validation messages |
| [Settings, Notifications and Public API](./06-settings-and-notifications.md) | App connections, notification preferences and Public API responses |
| [Reports](./07-reports.md) | *Version history has not been discovered*, *Tenant entitlement unavailable*, *Couldn't load the storage overview.* |
| [Deployment scripts](../12-deployment-prerequisites/10-troubleshooting.md) | *Failed to write secret … (Key Vault RBAC not ready?)*, `VaultAlreadyExists`, `AuthorizationFailed`, *No Front Door … resource found* |

## Status values

| Status | Where | Meaning |
| --- | --- | --- |
| **Succeeded** / **Completed** | Data refresh, action execution | Finished without errors. Items that were already in the target state are counted as skipped, not as errors. |
| **Partially completed** | Action execution | Some items succeeded and at least one failed. Check the **Items** tab. |
| **Failed** | Data refresh, action execution | The run did not complete, or no item succeeded. Check the **Issues** tab and the notification. |
| **Stopped** | Data refresh, action execution | Stopped by a user, or the policy was disabled before its action ran. |
| **Provisioning failed** | Request History | The request could not be provisioned. Open it to see the provisioning errors. |
| **Approval rejected** | Request History | An approver rejected the request; nothing was created. |

## Related

- [Troubleshooting](../14-troubleshooting/README.md) — find a fix by symptom.
- [FAQ](../16-faq/README.md)
