---
title: "Next Steps"
description: "Once every readiness checklist item is complete, share the requested details with your Proventeq contact so deployment can proceed."
---

# Next Steps

Once all checklist items in the [Readiness Checklist](./01-readiness-checklist.md) are complete:

1. Share the completed checklist and all requested details (see below) with your Proventeq contact.
2. Proventeq will review the information and confirm readiness for deployment.
3. Deployment will proceed on the agreed date.

## Share Details with Proventeq

Once complete, provide your Proventeq contact with:

- The **Application (client) ID** of the Entra Application Registration to access M365.
- The **Directory (tenant) ID**.
- The **UPN** and **password** of the deployment identity.
- The **Application ID URI**, exactly as configured in [Set the Application ID URI](./04-entra-app-registration.md#set-the-application-id-uri).
- The **`access_as_user` scope string**, exactly as configured in [Add the access_as_user Scope](./04-entra-app-registration.md#add-the-access_as_user-scope) — verbatim.
- The **client secret value**, shared through your approved secure channel.
- The **SQL administrator principal** — the object ID and display name of the Entra user or group that should become SQL Server administrator. This may be one of your own security groups; please tell us your preference.
- Your **tenant short name** — the portion before `.onmicrosoft.com`.
- The **object ID of the deployment operator**, if different from the deployment identity.

Proventeq will complete the remaining post-deployment configuration (such as adding certificates and redirect URIs) as part of the deployment engagement.

> **Reminder:** Never send passwords, client secrets, or certificates by email. Share sensitive values only through your approved secure channel.

If you have any questions or need assistance with any of the steps in this guide, contact your Proventeq project manager or email [support@proventeq.com](mailto:support@proventeq.com).
