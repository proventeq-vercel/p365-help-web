---
title: "How to Get Started with Proventeq365"
description: "The steps from a new Proventeq365 deployment to your first governance insights: apply the license, create a workspace, run the first data refresh, review the dashboard and act on what you find."
type: howto
updated: 2026-10-26
---

# How to Get Started with Proventeq365

Proventeq365 runs in your own Azure subscription and monitors your Microsoft 365 tenant. Once it is deployed, getting your first results takes five steps: check the license, create a workspace, let its first data refresh finish, review the dashboard, and then act on the findings with reports and policies.

## Before you begin

- Proventeq365 must be deployed and admin consent granted. See [Deployment Prerequisites](../12-deployment-prerequisites/README.md).
- You need the **Tenant Admin** role in Proventeq365. Sign in with your Microsoft 365 work account; Proventeq365 uses Microsoft Entra ID sign-in.

## Steps

1. Open **License** and check that the license is **Active** and lists the features you expect under **Enabled features**. If not, upload the license token from Proventeq. See [How to Renew Your Proventeq365 License](./16-renew-your-license.md).
2. Create a workspace that covers the sites you want to govern — the whole tenant, a list of sites, or a CSV import — and add the colleagues who should see the results. See [How to Create a Microsoft 365 Governance Workspace](./02-create-a-governance-workspace.md).
3. Wait for the first data refresh to finish. Follow it with **View runs** on the workspace. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
4. Open **Dashboard** and select the workspace. Review the **Sharing and Safety**, **Content Health** and **Compliance** scores, then the **Security & Oversharing**, **Storage Optimization** and **Compliance & Governance** tabs. See [Dashboard — Overview](../03-main/dashboard/README.md).
5. Act on the findings:
   - Remove risky sharing — see [How to Remove Overshared Permissions](./09-remove-overshared-permissions.md) and [How to Manage External User Access](./10-manage-external-user-access.md).
   - Clean up redundant, obsolete and trivial content — see [How to Find and Clean Up ROT Content](./11-find-and-clean-up-rot-content.md) and [How to Archive Obsolete Content](./07-archive-obsolete-content.md).
   - Automate checks with policies — see [How to Add a Governance Policy](./05-add-a-governance-policy.md).

## Result

You have a workspace that refreshes on schedule, a dashboard with governance scores, and reports and policies to fix what it finds. To let business users request sites and teams within your rules, set up [self-service provisioning](./12-create-a-provisioning-template.md).

## Related

- [Navigation Menu](../01-navigation-menu/README.md)
- [How to Give Users Access to a Workspace](./04-give-users-access-to-a-workspace.md)
- [FAQ](../16-faq/README.md)
