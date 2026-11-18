---
title: "Microsoft 365 Prerequisites"
description: "Confirm the SaaS or Hosted deployment mode, ReadOnly or ReadWrite permission profile, licensing, and archiving requirements before deploying Proventeq365."
---

# Microsoft 365 Prerequisites

## Licensing

Confirm that all users affected by the deployment have the appropriate Microsoft 365 licenses for the workloads in scope — for example: Teams, SharePoint, Microsoft 365 Groups, Planner, or Viva Engage. Check this against your agreed deployment design.

## Deployment Mode

Confirm both settings with Proventeq. They control different parts of the deployment, and both are required by the prerequisites script.

### Deployment mode

Pass exactly one `-DeploymentMode` value:

| Mode | What it does | Prerequisites script value |
| --- | --- | --- |
| SaaS | Creates a multi-tenant sign-in app and a separate multi-tenant platform daemon app. The selected permission profile is applied to the daemon. | `-DeploymentMode SaaS` |
| Hosted | Uses the legacy single-tenant app registration for sign-in and background access. | `-DeploymentMode Hosted` |

There is no default. The script rejects a missing value. `-ConfigureAiAgent` is currently Hosted-only; do not combine it with `-DeploymentMode SaaS`.

### Permission mode

| Mode | What it does | Prerequisites script value |
| --- | --- | --- |
| Read-only | Reports and insights only — no changes made to your environment. | `-PermissionMode ReadOnly` |
| Read-write | Reports, insights, and the ability to remediate issues. | `-PermissionMode ReadWrite` |

There is no default. Your permission mode determines the API permissions requested within the selected deployment mode. See [API Permissions](./04-entra-app-registration.md#api-permissions) for the full lists.

## Archiving

> **Note:** Only if using the archiving feature.

If your deployment includes archiving, ensure your archiving provider is configured **before** deployment. Supported providers:

- **Wasabi** — Third-party archiving. Ensure this is configured in your environment.
- **Microsoft 365 Archive** — Ensure Microsoft 365 archiving is enabled in your tenant.
