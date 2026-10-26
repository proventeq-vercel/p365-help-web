---
title: "Next Steps"
description: "What to share with your Proventeq contact for a direct deployment or after an Azure Marketplace deployment."
---

# Next Steps

What happens next depends on your [deployment model](./README.md#deployment-models).

## Direct Deployment

Once the deployment account described in [Direct Deployment](./06-direct-deployment.md) is ready, provide your Proventeq contact with:

- The **Directory (tenant) ID** — and, for a [cross-tenant deployment](./11-cross-tenant-deployment.md), both tenant IDs.
- The **Subscription ID** and the **Azure region** to deploy into, and any naming you require for the resource groups and the Bootstrap Key Vault (see [Information to Collect](./03-azure-prerequisites.md#information-to-collect)).
- The **UPN** of the deployment account. If you created a dedicated user account (Option A), share its password through your approved secure channel.
- The **SQL administrator principal** — the object ID and display name of the Entra user or group that should become SQL Server administrator. This may be one of your own security groups.
- The **deployment mode** (Read-only or Read-write), and whether the **AI agent** is in scope.
- The **notification sender mailbox** address, if you granted one (see [Notification Mailbox](./09-notification-mailbox.md)).

Proventeq will then:

1. Review the information and confirm readiness for deployment.
2. On the agreed date, run the prerequisites script and deploy Proventeq365.
3. Complete the post-deployment configuration — the redirect URI, the SharePoint certificate and, if in scope, the AI agent.
4. Send you the Proventeq365 URL and help you with the initial configuration.

## Azure Marketplace Deployment

Once the [post-deployment script](./08-run-post-deployment-script.md) has completed:

1. Open the **Frontend URL** from the post-deployment script summary and sign in to Proventeq365.
2. Let your Proventeq contact know the deployment is complete and share the details below.
3. Proventeq will confirm the deployment and help you with the initial configuration.

Provide your Proventeq contact with:

- The **Directory (tenant) ID** — and, for a [cross-tenant deployment](./11-cross-tenant-deployment.md), both tenant IDs.
- The **App (client) ID** from the prerequisites script summary.
- The name of the **managed application** and its **managed resource group** (`mrg-...`).
- The **Frontend URL** from the post-deployment script summary.
- The **deployment mode** you used (Read-only or Read-write), and whether the **AI agent** was deployed.
- The **notification sender mailbox** address, if you granted one (see [Notification Mailbox](./09-notification-mailbox.md)).

None of these values is secret. The client secret, the SharePoint certificate and the container registry password stay in your Key Vaults and are never shared.

> **Reminder:** Keep the **bootstrap resource group** — it is needed for re-running the scripts and for certificate rotation. Never send passwords, client secrets, or certificates by email.

If you have any questions or need assistance with any of the steps in this guide, contact your Proventeq project manager or email [support@proventeq.com](mailto:support@proventeq.com).
