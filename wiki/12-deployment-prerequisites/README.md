---
title: "Deployment Prerequisites"
description: "Everything you need to prepare in your Microsoft 365 tenant and Azure subscription before Proventeq deploys Proventeq365 — licensing, deployment identity, RBAC, resource providers, Entra app registration, and DNS."
---

# Deployment Prerequisites

This guide describes everything you need to prepare **before** Proventeq deploys Proventeq365 into your Microsoft 365 tenant and Azure environment. Complete all the steps across these pages and share the requested details with your Proventeq contact **before** the agreed deployment date.

## Who should read this

This guide is intended for:

- **Microsoft 365 / Azure administrators** — managing the tenant, subscription, and identity settings.
- **Security administrators** — responsible for Conditional Access, MFA, and identity governance.
- **Network administrators** — relevant only if outbound restrictions, proxies, or private networking are in scope. See [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity) for the endpoints that must be reachable.

## Scope and assumptions

- Proventeq365 is deployed into **your** Azure subscription and Microsoft 365 tenant.
- Proventeq deploys a dedicated Azure resource group that you create and control.
- You are responsible for providing the required access and approvals in line with your organisation's security policies.
- Container images for the Proventeq365 services are pulled from a **Proventeq-managed Azure Container Registry**. This is an outbound dependency on a Proventeq-owned endpoint and is by design. See [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity).
- All resources are deployed into your chosen region, with one exception: the **Azure Static Web App** that hosts the user interface. Azure Static Web Apps is available in a limited set of Azure regions, so the interface may be hosted in a different region from the rest of the deployment. It holds static application files only and no customer content is stored there. The exact region is confirmed with Proventeq during deployment planning.
- **Important:** Never send passwords, client secrets, or certificates by email. Share sensitive values only through your approved secure channel.

## Roles and responsibilities

| Area | Your responsibilities (Customer) | Proventeq's responsibilities |
| --- | --- | --- |
| Azure subscription | Create the resource group, grant RBAC access to the deployment identity, approve any domain/DNS changes, and register the required Azure resource providers. Provider registration is mandatory and cannot be delegated to Proventeq: it operates at subscription scope, whereas the deployment identity has access only to the resource group. | Deploy Azure resources and validate provisioning once access is in place. |
| Microsoft 365 tenant | Provide tenant admin contacts, create or invite the deployment account, and approve app registration permissions including admin consent. Granting admin consent requires Privileged Role Administrator or Global Administrator and cannot be performed by Proventeq: the Cloud Application Administrator role is not sufficient to consent to Microsoft Graph application permissions. | Configure Proventeq365 integration and complete post-deployment app registration tasks (e.g. redirect URIs and certificates). |
| Security & governance | Ensure your MFA and Conditional Access policies allow the agreed deployment approach, and approve any exceptions needed. | Provide a least-privilege access recommendation and support access verification. |
| Azure capacity | Confirm sufficient subscription quota in the target region (see [Confirm Subscription Quota](./03-azure-prerequisites.md#confirm-subscription-quota)). | Advise on sizing and confirm the required SKUs. |
| Network | If outbound traffic is restricted, allow the endpoints listed in [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity). | Provide and maintain the endpoint list. |

## In this section

1. [Readiness Checklist](./01-readiness-checklist.md) — Confirm every prerequisite is complete before the deployment date.
2. [Microsoft 365 Prerequisites](./02-microsoft-365-prerequisites.md) — Licensing, deployment mode, and archiving.
3. [Azure Prerequisites](./03-azure-prerequisites.md) — Resource group, deployment identity, RBAC, and resource providers.
4. [Entra ID App Registration](./04-entra-app-registration.md) — Register the application and grant API permissions.
5. [Custom Domain and DNS](./05-custom-domain-and-dns.md) — Only if a custom domain is required.
6. [Next Steps](./06-next-steps.md) — What to share with Proventeq once you are ready.

> **Tip:** The Entra app registration can be automated with the [Entra App Creation Script](../appendix/entra-app-script.md) in the Appendix.
