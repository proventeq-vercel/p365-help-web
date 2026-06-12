---
title: "Microsoft 365 Prerequisites"
description: "Confirm licensing, choose the deployment mode (Read-only or Read-write), and enable archiving if required, before Proventeq365 is deployed."
---

# Microsoft 365 Prerequisites

## Licensing

Confirm that all users affected by the deployment have the appropriate Microsoft 365 licenses for the workloads in scope — for example: Teams, SharePoint, Microsoft 365 Groups, Planner, or Viva Engage. Check this against your agreed deployment design.

## Deployment Mode

Confirm which mode Proventeq365 will operate in:

| Mode | What it does |
| --- | --- |
| Read-only | Reports and insights only — no changes made to your environment. |
| Read-write | Reports, insights, and the ability to remediate issues. |

Your chosen mode affects the permissions required in [Grant API Permissions](./04-entra-app-registration.md#grant-api-permissions).

## Archiving

> **Note:** Only if using the archiving feature.

If your deployment includes archiving, ensure your archiving provider is configured **before** deployment. Supported providers:

- **Wasabi** — Third-party archiving. Ensure this is configured in your environment.
- **Microsoft 365 Archive** — Ensure Microsoft 365 archiving is enabled in your tenant.
