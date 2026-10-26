---
title: "How to Give Users Access to a Workspace"
description: "How to give colleagues access to a Proventeq365 workspace and choose between the Workspace User and Workspace Admin roles."
type: howto
updated: 2026-10-26
---

# How to Give Users Access to a Workspace

People see a workspace's dashboard and reports only if they have a role on that workspace. Add them on the workspace's **Users** step and give each one a role: **Workspace User** to view reports, or **Workspace Admin** to also run data refreshes and start remediation actions.

## Before you begin

- You need the **Tenant Admin** role. The workspace list, where **Edit** is, is shown to Tenant Admins.

## What each role can do

| Role | Can do |
| --- | --- |
| **Workspace User** | View the workspace's dashboard and reports, the policy list and policy reports, and action executions. |
| **Workspace Admin** | Everything a Workspace User can do, plus edit the workspace (except its scope), view run history, start or stop a data refresh, and start actions such as removing permissions or archiving. |
| **Tenant Admin** | Everything, across all workspaces, plus create workspaces, create, edit and run policies, manage connections, templates, the license, the audit log and settings. |

## Steps

1. As a Tenant Admin, open **Manage** → **Workspaces** and click **Edit** on the workspace. When creating a new workspace, go to the **Users** step of the wizard instead.
2. On the **Users** step, search by name or email address and select the user from the results. To add many people at once, click **Upload CSV** and upload a CSV file of their email addresses.
3. Choose the role — **Workspace User** or **Workspace Admin** — for each user.
4. To remove access, click the **Delete** icon next to the user.
5. Save the workspace.

## Result

The added users see the workspace in the workspace selector and can open its dashboard and reports. They receive in-app notifications for the workspace, and — if a notification mailbox is configured — an email when they are added to or removed from it.

## Related

- [Workspaces — Workspace Users](../02-manage/workspaces/README.md#workspace-users)
- [FAQ — Access and roles](../16-faq/README.md#access-and-roles)
