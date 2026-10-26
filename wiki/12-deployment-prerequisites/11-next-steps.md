---
title: "Next Steps"
description: "Once the post-deployment script has completed, confirm the deployment with your Proventeq contact and share the non-secret deployment details."
---

# Next Steps

Once the [post-deployment script](./07-run-post-deployment-script.md) has completed and every item in the [Readiness Checklist](./01-readiness-checklist.md) is done:

1. Open the **Frontend URL** from the post-deployment script summary and sign in to Proventeq365.
2. Let your Proventeq contact know the deployment is complete and share the details below.
3. Proventeq will confirm the deployment and help you with the initial configuration.

## Share Details with Proventeq

Provide your Proventeq contact with:

- The **Directory (tenant) ID** — and, for a [cross-tenant deployment](./09-cross-tenant-deployment.md), both tenant IDs.
- The **App (client) ID** from the prerequisites script summary.
- The name of the **managed application** and its **managed resource group** (`mrg-...`).
- The **Frontend URL** from the post-deployment script summary.
- The **deployment mode** you used (Read-only or Read-write), and whether the **AI agent** was deployed.
- The **notification sender mailbox** address, if you granted one (see [Notification Mailbox](./07-run-post-deployment-script.md#notification-mailbox-optional)).

None of these values is secret. The client secret, the SharePoint certificate and the container registry password stay in your Key Vaults and are never shared.

> **Reminder:** Keep the **bootstrap resource group** — it is needed for re-running the scripts and for certificate rotation. Never send passwords, client secrets, or certificates by email.

If you have any questions or need assistance with any of the steps in this guide, contact your Proventeq project manager or email [support@proventeq.com](mailto:support@proventeq.com).
