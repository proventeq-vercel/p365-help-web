---
title: "Troubleshooting"
description: "Fix common Proventeq365 problems by symptom: sign-in and access, license, empty dashboards and reports, failed data refreshes, policies and actions, archive connections, archiving and restore, self-service provisioning and email notifications."
type: troubleshooting
updated: 2026-10-26
---

# Troubleshooting

Find your symptom below for the likely causes and the fix. If you have an exact error message, look it up in the [Error Catalog](../15-error-catalog/README.md). For problems while installing Proventeq365, see [Deployment Troubleshooting](../12-deployment-prerequisites/10-troubleshooting.md).

When you contact Proventeq support, include the workspace name, the time of the problem, the exact message, and — for a failed run — the details from the run's **Issues** tab.

## Sign-in and access

### I can't sign in to Proventeq365

Proventeq365 uses Microsoft Entra ID sign-in with your Microsoft 365 work account.

- If the Microsoft sign-in page shows an `AADSTS` error, give the code to your Microsoft 365 administrator. The usual causes are missing admin consent for the Proventeq365 app registration, or a Conditional Access policy that blocks the sign-in.
- If you see *We couldn't load your session*, refresh the page. If it persists, contact your Proventeq365 administrator.

### I can sign in but can't see any workspace

You only see workspaces you have a role on. If the workspace selector says *The system has no data, please proceed with configuring a workspace*, either no workspace exists yet or you haven't been added to one. Ask a Tenant Admin to add you. See [How to Give Users Access to a Workspace](../13-how-to-guides/04-give-users-access-to-a-workspace.md).

### A menu item or page says "You don't have access to this page"

The page needs a role you don't have — for example **Tenant Admin** for creating workspaces, policies, connections and templates, or **Workspace Admin** for running data refreshes and actions. Ask an administrator for the role. See [Error Messages: Sign-in, Access and License](../15-error-catalog/01-sign-in-access-and-license.md#you-dont-have-access-to-this-page).

### A menu area shows "License required"

Your license doesn't include that feature. Check **Enabled features** on the License page and contact Proventeq to add it.

## License

### Every page redirects to the License page

The license has expired, or no license has been uploaded. A Tenant Admin must upload a new license token. Users without the Tenant Admin role see *A valid license is required. Please contact your tenant administrator.* See [How to Renew Your Proventeq365 License](../13-how-to-guides/16-renew-your-license.md).

### The license token is rejected

- *Invalid license format* — paste the token exactly, as a GUID, without spaces or quotes.
- *The license token is invalid or could not be processed* — check the token with Proventeq.
- *Something went wrong. Please try again.* — Proventeq's licensing service could not be reached. Try again later, and check that outbound traffic from the deployment isn't blocked.

## Workspaces and data refresh

### The dashboard or a report shows a progress message instead of data

Reports stay empty until the workspace's **first data refresh has completed**. The first refresh is a full scan and can take a long time for a large tenant; later refreshes are incremental and faster. Follow progress with **View runs** on the workspace. Reports also show the progress message briefly while a refresh is processing the data it collected.

### The data refresh didn't start when I expected

- Check the schedule on the workspace's **Schedule** step. A one-time refresh runs once; a recurring one runs daily, weekly or monthly at the times you set. A monthly refresh on the 29th–31st runs only in months that have that day.
- Only one refresh runs at a time for a workspace. If one is already running, wait for it to finish.
- You can start a refresh with **Refresh data**; you need the **Workspace Admin** role.

### The data refresh failed

Open **View runs**, select the failed run and check its **Issues** tab and the notification.

- If processing failed after the data was collected, click **Retry** on the run.
- If collecting the data failed, start a new refresh.
- Make sure admin consent is still granted to the Proventeq365 app registration, including `Sites.FullControl.All` for SharePoint and `Mail.Read` for Exchange Monitoring.
- If the notification says *The run stopped because of an internal error*, contact Proventeq support.

See [Error Messages: Workspaces and Data Refresh](../15-error-catalog/02-workspaces-and-data-refresh.md#data-refresh).

### The data refresh is slow

Large scopes take longer, especially the first full scan. Proventeq365 respects Microsoft 365 throttling: when Microsoft Graph or SharePoint asks it to slow down, it waits and retries automatically, which lengthens the run but doesn't fail it. Later refreshes are incremental and read only what changed.

### Some sites or OneDrives are missing from the reports

- Check the workspace scope: with **Select all sites**, check **Include Site Collections** and **Include One Drives**; with a manual list or CSV, check the site paths.
- Sites that can't be read are **skipped**, not reported as errors — for example OneDrives that have never been opened by their owner, or sites that were just created or deleted.
- The scope of an existing workspace can't be changed. Create a new workspace for a different scope.

### The reports show old data and a warning banner

*The latest data refresh failed, so the figures shown come from an earlier refresh* means the newest refresh failed. Fix the failure as described above; the banner disappears after the next successful refresh.

### A change I made in SharePoint doesn't show in the reports yet

Reports reflect the last completed data refresh. Wait for the next scheduled refresh, or start one with **Refresh data**.

## Policies and actions

### A policy report is empty or says the policy did not run

- *This policy did not run — a required parameter is empty* — edit the policy and fill in all its inputs.
- *This policy is disabled* — enable the policy.
- *The last run of this policy failed* — read the *Policy evaluation failed* notification, fix the cause and run the policy again.
- Otherwise, no items matched the rule. Check the rule's inputs, for example the threshold.

### A policy action didn't run

- **Automatic** actions run when the policy runs — at the end of each data refresh, or when you click **Run Policy**.
- **Manual** actions wait until someone with the **Workspace Admin** role clicks **Execute on All Items** or **Execute on Selection** in the policy report.
- If the policy was disabled before the action started, the execution shows **Stopped**.

### An action ended "Partially completed" or "Failed"

Open the execution with **View Executions**, filter the **Items** tab by **Failed** and read each error. Fix the cause and run the action again; items that were already done are skipped. See [Error Messages: Policies and Remediation Actions](../15-error-catalog/03-policies-and-remediation.md#running-actions).

### Some access can't be removed

Proventeq365 removes direct permissions and sharing links. Access that is inherited, or that comes through a group, is kept — change the group membership or the parent item's permissions in Microsoft 365 instead.

### Removing permissions or external users does nothing

You need the **Workspace Admin** role, and your license must include the **Remove Permissions** feature (and **Disable Guests** to disable or enable external users). Permission removal also needs the **read-write** permission set — see [Deployment Mode](../12-deployment-prerequisites/02-microsoft-365-prerequisites.md#deployment-mode). The reports change after the next data refresh.

## Connections

### The archive connection can't be saved

*Connection validation failed* means Proventeq365 couldn't connect to the storage. Check the Wasabi keys and region, or for Azure Blob Storage use an account-key connection string (not a SAS) and make sure key access is allowed on the storage account. See [Error Messages: Connections, Archiving and Restore](../15-error-catalog/04-connections-and-archiving.md#connections).

### A bucket or container is missing from the list

Click **Refresh** on the containers step. If it is still missing, check that the access key or connection string has access to it.

### A connection can't be deleted

Archived files that still use the connection keep it in use, because their stub links point to it. A connection that is turned on as an archive destination under **Manage default connections** can't be deleted either — turn it off there first. Keep the connection while archived content depends on it.

## Archiving and restore

### Files weren't archived

- Check the execution under **View Executions**. Items already archived are skipped.
- Check that the policy's archive action has a **Target Connection** and **Target Container**.
- For a **Manual** archive action, someone must click **Execute on All Items** or **Execute on Selection**.
- Files must match the workspace's obsolete rules — the age in months and the file extensions on the workspace's **Configuration** step.

### Users can't open an archived file from the stub link

Opening a stub needs permission to open that stub in SharePoint. Users without it see *Access denied - you do not have permission to download this item*. If the page says *Failed to load archive details*, the file has most likely already been restored — check its original location.

### A restore fails

- *An item is already at this archive's original location* — move or rename the file that is now in the way, then restore again.
- *The destination library has versioning disabled* — turn on versioning for the library, then restore again.
- *Restoring archived items needs workspace administrator rights* — bulk, scope and workspace restores need the **Workspace Admin** role.

See [Error Messages: Connections, Archiving and Restore](../15-error-catalog/04-connections-and-archiving.md#opening-and-restoring-archived-files).

## Self-service provisioning

### A template doesn't appear under New Request

Only **Published** templates appear. If the template has **Limit Template Access** turned on, only the selected users can see it. Ask the template owner to publish it or add you.

### A request is stuck in "Awaiting approval"

The request is waiting for one of the template's approvers. Approvers are notified when the request is raised and reminded once a day, up to three times. Contact an approver, or ask the template owner who the approvers are.

### A request shows "Provisioning failed"

Open the request in **Request History** and read the **Provisioning errors** panel — each error has an **Action** line. Common causes are a site URL or user name that already exists, a missing owner, or missing permissions for the Proventeq365 app registration. A partly created site is removed automatically. Fix the cause and submit a new request. See [Error Messages: Self-Service Provisioning](../15-error-catalog/05-self-service-provisioning.md).

### I can't delete a request

Requests can be removed only while they are **Awaiting approval** or **Approval rejected**.

### I can't edit or delete a template

Only a **Draft** version can be edited or deleted. To change a published template, start a new draft version, edit it and publish it. To stop a template being used, **Unpublish** it.

## Notifications

### Notifications don't arrive by email

- Proventeq365 sends email only for failures, approval requests, approval decisions and changes to your workspace access. Progress and success notifications appear in the app only (bell icon).
- Email needs a **notification mailbox** in your tenant with permission for Proventeq365 to send from it. Without one, no email is sent, but in-app notifications still work. See [Notification Mailbox](../12-deployment-prerequisites/07-run-post-deployment-script.md#notification-mailbox-optional).

### I don't get notifications for a workspace

Workspace notifications go to the workspace's users. Check that you have a role on the workspace.

## Related

- [Error Catalog](../15-error-catalog/README.md)
- [FAQ](../16-faq/README.md)
- [Deployment Troubleshooting](../12-deployment-prerequisites/10-troubleshooting.md)
