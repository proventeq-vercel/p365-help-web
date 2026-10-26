---
title: "How to Run a Workspace Scan"
description: "How to start a Proventeq365 data refresh (workspace scan) on demand, follow its progress in the run history, and check for issues."
type: howto
updated: 2026-10-26
---

# How to Run a Workspace Scan

A workspace scan — called a **data refresh** in Proventeq365 — collects the latest content, sharing and permission data for the workspace. Scans run on the workspace's schedule, and you can start one at any time with **Refresh data**. Each run is listed in the workspace's run history with its status, duration and any issues.

## Before you begin

- The workspace must already exist. See [How to Create a Microsoft 365 Governance Workspace](./02-create-a-governance-workspace.md).
- You need the **Workspace Admin** role on the workspace (or **Tenant Admin**) to start, stop or retry a data refresh.
- Only one data refresh runs at a time for a workspace.

## Steps

1. Open **Manage** → **Workspaces**.
2. In the workspace's row, click **Refresh data** to start a scan now.
3. To follow progress, click **View runs** in the same row. The run history shows each run's start time, status, type (**Full** or **Delta**) and duration, with counters for runs **In flight**, runs that **Need attention** and **Issues**.
4. Open a run to see its stages — **Requested**, **Discovering**, **Transforming** and **Reports ready** — and the **Issues** and **Items** tabs.
5. When the run shows **Succeeded**, open the [Dashboard](../03-main/dashboard/README.md) or the reports for the workspace.
6. If a run fails at the transform stage, open it and click **Retry** to retry the step that failed.

## Result

The dashboard and reports show the data from the latest completed run. The first run of a workspace is a **Full** scan; later runs are **Delta** (incremental) runs. Enabled policies are evaluated at the end of every successful run. Sites that can't be read — for example OneDrives that were never provisioned — are counted as **skipped**, not as errors. If a run ends as **Failed** or **Partially completed**, open it and check the **Issues** tab. See [Troubleshooting — Workspaces and data refresh](../14-troubleshooting/README.md#workspaces-and-data-refresh).

## Related

- [Workspaces](../02-manage/workspaces/README.md)
- [How to Create a Microsoft 365 Governance Workspace](./02-create-a-governance-workspace.md)
