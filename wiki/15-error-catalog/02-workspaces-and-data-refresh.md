---
title: "Error Messages: Workspaces and Data Refresh"
description: "What Proventeq365 workspace and data refresh (scan) error messages mean and how to fix them — including “Data scan failed”, “A discovery run is already in progress” and workspace wizard validation messages."
type: reference
updated: 2026-10-26
---

# Error Messages: Workspaces and Data Refresh

Messages you may see when creating or editing a workspace, or when a data refresh (scan) runs or fails.

## Data refresh

### Data scan failed — Something went wrong during the last scan

**Where:** in place of the dashboard or a report.
**Cause:** the latest data refresh of the workspace failed, and there is no earlier completed refresh to show.
**Fix:** Open **Manage** → **Workspaces** → **View runs**, open the failed run and check its **Issues** tab. If the failure happened while the data was being processed, click **Retry**. Otherwise start a new refresh with **Refresh data**. If it fails again, contact Proventeq support.

### The latest data refresh failed, so the figures shown come from an earlier refresh and may not be accurate.

**Where:** banner at the top of reports.
**Cause:** the newest refresh failed, so the report shows data from the last refresh that completed.
**Fix:** As for *Data scan failed* above. The banner disappears after the next successful refresh.

### Email scan failed — Something went wrong during the last email scan

**Where:** in place of the Exchange Monitoring Email and Link reports.
**Cause:** the latest data refresh of an Exchange Monitoring workspace failed.
**Fix:** Check the run's **Issues** tab and start a new refresh. The Proventeq365 app registration needs the `Mail.Read` application permission with admin consent.

### A discovery run is already in progress for this workspace.

**Also shown as:** *A data refresh is already running*.
**Cause:** only one data refresh can run at a time for a workspace.
**Fix:** Wait for the current run to finish. Follow it with **View runs**.

### Could not start the data refresh

**Cause:** the refresh request failed. A common reason is that you are not a **Workspace Admin** on the workspace.
**Fix:** Check your role, then try again.

### Scan of the source system failed

**Where:** notification (bell icon), and by email when a notification mailbox is set up.
**Cause:** a SharePoint data refresh failed. The notification's detail line gives the reason, for example:

| Detail | Meaning and fix |
| --- | --- |
| Processing the discovered data failed. | Collecting data succeeded but processing it failed. Open the run and click **Retry**. |
| Discovery failed | Collecting data failed. Start a new refresh; contact support if it repeats. |
| The run stopped after repeated errors. | The run gave up after several retries. Start a new refresh; contact support if it repeats. |
| The run stopped responding and was stopped. / The run's container failed and the run was stopped. / The run was interrupted by a service restart and was stopped. | The run ended unexpectedly. Start a new refresh. |
| The run stopped because of an internal error. Proventeq support can find the details in the service logs. | Contact Proventeq support with the workspace name and the time of the run. |

Similar notifications exist for other sources: *Exchange data refresh failed* and *Azure data refresh failed*.

### This run ended with a problem, but it reported no reason or failure count.

**Where:** **Issues** tab of a run.
**Fix:** Check the run's **Items** tab for any items it recorded, then start a new refresh. Contact support if it repeats.

### The data refresh had already finished, so there was nothing to stop

**Where:** after clicking **Stop data refresh**.
**Cause:** the run finished before the stop request arrived. No action is needed.

## Workspace wizard

### A workspace with this name already exists

**Fix:** Workspace names must be unique. Choose a different name.

### At least one site must be specified

**Fix:** With **Manually add sites**, enter at least one site, one per line.

### A site path cannot contain *. Turn on wildcard patterns to match sites by pattern, or remove the *.

**Fix:** Remove the `*`, or turn on wildcard patterns to match sites by pattern.

### A pattern of only * matches every site in the tenant.

**Fix:** Narrow the pattern, or choose the **Select all sites** scope instead. A wildcard workspace's scope can't be changed later.

### Upload failed: …

**Where:** after importing a CSV file on the **Sources** step.
**Cause and fix:** the CSV file was refused. Check that:
- the file is not empty and has a `.csv` extension;
- it is smaller than 150 MB;
- it uses the [sample CSV format](../02-manage/workspaces/README.md#import-csv-file) (*Upload failed: File format invalid.*);
- it contains no wildcard (`*`) rows — enter patterns in the manual site list instead;
- the workspace's scope is not already defined by wildcard patterns — such a scope can't be replaced by a CSV; create a new workspace instead.

### The selected date must be from the future

**Fix:** For a one-time run with **Schedule run time** on, pick a date and time after now.

### Selected times cannot be repeated / You can only pick one time per day

**Fix:** Remove the duplicate time slots on the **Schedule** step.

### Obsolete age must be at least 1 month

**Fix:** Enter a whole number of months, 1 or more. Related messages: *Obsolete age cannot be empty*, *Obsolete age must be a whole number*.

### Extensions must be 1–10 alphanumeric characters with no dots or spaces (e.g. doc, xls)

**Fix:** Enter extensions without the leading dot, for example `doc` rather than `.doc`.

### File names cannot contain %, [ or ] characters

**Fix:** Remove those characters from trivial file names and prefixes.

### At least one user must be specified

**Fix:** Add at least one user on the **Users** step.

### Some required fields are missing. Please review the highlighted steps.

**Fix:** Open each highlighted step in the wizard and correct the fields marked in red.

### Failed to create workspace

**Cause:** the workspace could not be saved. Possible reasons include a policy that requires approval but has no approver, or settings the service refused.
**Fix:** Review every step and try again. If it keeps failing, contact Proventeq support with the workspace settings you used.

### This cannot be changed once the workspace has been discovered

**Where:** **Sources** step when editing a workspace.
**Cause:** the scope and capture settings are fixed after the first data refresh, because later incremental refreshes can't apply them retroactively.
**Fix:** Create a new workspace to scan with different settings.

### Sites.FullControl.All must be granted at the tenant level before discovery can run.

**Where:** information notice on the **Sources** step. It is a reminder, not an error.
**Fix:** Make sure admin consent has been granted to the Proventeq365 app registration. See [Grant Admin Consent](../12-deployment-prerequisites/04-entra-app-registration.md#grant-admin-consent).

## Related

- [Troubleshooting — Workspaces and data refresh](../14-troubleshooting/README.md#workspaces-and-data-refresh)
- [How to Run a Workspace Scan](../13-how-to-guides/03-run-a-workspace-scan.md)
