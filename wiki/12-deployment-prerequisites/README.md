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
- **Network administrators** — relevant only if outbound restrictions, proxies, or private networking are in scope.

## Scope and assumptions

- Proventeq365 is deployed into **your** Azure subscription and Microsoft 365 tenant.
- Proventeq deploys a dedicated Azure resource group that you create and control.
- You are responsible for providing the required access and approvals in line with your organisation's security policies.
- **Important:** Never send passwords, client secrets, or certificates by email. Share sensitive values only through your approved secure channel.

## Roles and responsibilities

| Area | Your responsibilities (Customer) | Proventeq's responsibilities |
| --- | --- | --- |
| Azure subscription | Create the resource group, grant RBAC access to the deployment identity, approve any domain/DNS changes, and optionally register Azure resource providers. | Deploy Azure resources and validate provisioning once access is in place. |
| Microsoft 365 tenant | Provide tenant admin contacts, create or invite the deployment account, and approve app registration permissions including admin consent. | Configure Proventeq365 integration and complete post-deployment app registration tasks (e.g. redirect URIs and certificates). |
| Security & governance | Ensure your MFA and Conditional Access policies allow the agreed deployment approach, and approve any exceptions needed. | Provide a least-privilege access recommendation and support access verification. |

## In this section

1. [Readiness Checklist](./01-readiness-checklist.md) — Confirm every prerequisite is complete before the deployment date.
2. [Microsoft 365 Prerequisites](./02-microsoft-365-prerequisites.md) — Licensing, deployment mode, and archiving.
3. [Azure Prerequisites](./03-azure-prerequisites.md) — Resource group, deployment identity, RBAC, and resource providers.
4. [Entra ID App Registration](./04-entra-app-registration.md) — Register the application and grant API permissions.
5. [Custom Domain and DNS](./05-custom-domain-and-dns.md) — Only if a custom domain is required.
6. [Next Steps](./06-next-steps.md) — What to share with Proventeq once you are ready.

> **Tip:** The Entra app registration can be automated with the [Entra App Creation Script](../appendix/entra-app-script.md) in the Appendix.
