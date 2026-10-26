---
title: "Error Messages: Reports"
description: "What Proventeq365 report messages mean and how to fix them — Storage Optimisation, the ROT reports, Site Engagement and App Permissions, including load errors and missing data."
type: reference
updated: 2026-10-26
---

# Error Messages: Reports

Messages you may see on the Storage Optimisation overview, the Duplicate, Obsolete and Trivial documents reports, Site Engagement and App Permissions. Messages that say a section *couldn't load* come with a **Try again** button. For the stale-data banner and *Data scan failed*, see [Workspaces and Data Refresh](./02-workspaces-and-data-refresh.md#data-refresh).

## Storage Optimisation overview

### Couldn't load the storage overview.

**Where:** Storage Optimisation page, in place of the content.
**Fix:** Click **Try again**. If it persists, check that the workspace's last data refresh completed.

### Couldn't load the archive candidates.

**Where:** **Archive candidates** group.
**Fix:** Click **Try again**.

### No site usage report has been captured for this workspace yet

**Where:** **Archive candidates** cards, whose value shows **Unknown**.
**Cause:** the Microsoft 365 site usage report is not captured in your deployment, or no data refresh has captured it yet.
**Fix:** Ask Proventeq to enable it. The app registration needs `Reports.Read.All` with admin consent.

### Version history has not been discovered for this workspace

**Where:** **Version Clean-up** card, whose value shows **Unavailable**.
**Cause:** version history is not collected in your deployment.
**Fix:** Ask Proventeq to enable version-history collection, then run a data refresh.

### Tenant entitlement unavailable, so quota usage cannot be shown

**Where:** **Quota usage** chart; cards show *Tenant entitlement unavailable*.
**Cause:** the tenant's storage entitlement could not be read.
**Fix:** Check that the app registration has `Organization.Read.All` with admin consent, then run a data refresh.

### Capacity forecast unavailable without tenant entitlement

**Where:** **Growth impact** panel.
**Cause and fix:** as for *Tenant entitlement unavailable* above.

### Not enough history to forecast capacity

**Where:** **Growth impact** panel; the **Forecast exhaustion** card shows *Not enough history*.
**Cause:** too few months of measured growth. This is informational.
**Fix:** None needed — the forecast appears after more data refreshes.

### Entitlement already exceeded

**Where:** **Forecast exhaustion** card and **Growth impact** panel.
**Cause:** the tenant already uses more storage than its entitlement. This is informational.
**Fix:** Buy more storage, or reclaim space by cleaning up or archiving.

## Site Engagement

### Couldn't load top graphs. / Couldn't load the monthly trend. / Couldn't load the sites table. / Couldn't load the monthly breakdown.

**Where:** the access charts, the **Sites Metrics Over Time** chart, the sites table or the monthly drawer.
**Fix:** Click **Try again**.

### No completed month has been captured yet.

**Where:** sites table, **Last full month** tab.
**Cause:** every data refresh so far ran in the current month. The view fills in after the first refresh that finishes in a later month.
**Fix:** Wait for a data refresh in a later month, or switch to the **Totals for period** tab.

### Exporting failed

**Where:** after **Export**.
**Fix:** Try again.

## App Permissions

### We couldn't load this section. Please try again.

**Where:** in place of the summary card and breakdowns.
**Fix:** Click **Try again**.

### Error queueing permissions removal.

**Where:** after revoking an app's site grants.
**Cause:** the removal could not be queued. Revoking needs the **Workspace Admin** role and the **Remove Apps** and **Execute Policy** license features.
**Fix:** Check your role and license, then try again.

## Duplicate, Obsolete and Trivial Documents

### We couldn't load this report. Please try again.

**Where:** Duplicate, Obsolete or Trivial documents report, in place of the content.
**Fix:** Click **Try again**. If it persists, check that the workspace's last data refresh completed.

### Error queueing trivial data removal

**Where:** after **Remove all trivial data** or **Remove selected trivial data** on the Trivial documents report.
**Cause:** the removal could not be started. Removing trivial data needs the **Workspace Admin** role (or **Tenant Admin**) and the **Execute Policy** license feature.
**Fix:** Check your role and license, then try again.

## Related

- [Storage Optimisation Overview](../04-reports/storage-optimization/README.md)
- [Duplicate Documents Report](../04-reports/duplicate-documents-report/README.md)
- [Obsolete Documents Report](../04-reports/obsolete-documents-report/README.md)
- [Trivial Documents Report](../04-reports/trivial-documents-report/README.md)
- [Site Engagement](../04-reports/site-engagement/README.md)
- [App Permissions](../04-reports/app-permissions/README.md)
