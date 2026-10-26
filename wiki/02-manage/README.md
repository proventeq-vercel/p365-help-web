---
title: "Manage"
description: "Manage workspaces and their data refresh runs, archive connections, governance policies and approvals, custom policy rules, and the actions that remediate what policies find."
---

# Manage

The **Manage** module is where you set up the foundations of your Proventeq365 environment. From here you can create and schedule workspaces, define which sites are in scope, attach governance policies, and configure connections to external storage systems used for archiving.

## Sections

- [Workspaces](./workspaces/README.md) — Create and manage workspaces via a multi-step wizard. Add sites manually, import them from CSV, or include the entire tenant; schedule one-off or recurring scans; attach policies; and assign user roles.
  - [Workspace Runs](./workspaces/workspace-runs.md) — The history, progress and issues of each data refresh.
- [Connections](./connections/README.md) — Connect Wasabi or Azure Blob Storage for archiving, and choose the default archive destination.
- [Policies](./policies/README.md) — View, run and manage the governance policies of a workspace, their reports and their actions.
  - [Policy Approvals](./policies/policy-approvals.md) — Hold a policy's actions until an approver releases its report.
- [Policy Rules](./policy-rules/README.md) — Create custom policy rules with the rule assistant.
- [Actions](./actions/README.md) — Follow every action run in a workspace: permission removals, deletions, archiving and restores.
