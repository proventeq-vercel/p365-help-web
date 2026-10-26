---
title: "Deployment Prerequisites"
description: "Everything you need to prepare and run to deploy Proventeq365 into your Microsoft 365 tenant and Azure subscription — the two deployment models, required access, the prerequisites script, and the steps for a direct or Azure Marketplace deployment."
---

# Deployment Prerequisites

This guide describes how to prepare for and deploy Proventeq365 into your Microsoft 365 tenant and Azure subscription. Whichever deployment model you use, the deployment always starts with the **prerequisites script**, run in **Azure Cloud Shell** — nothing needs to be installed on your machine.

## Deployment Models

Proventeq365 can be deployed in one of two ways. Agree the model with your Proventeq contact before you start.

| | Direct deployment | Azure Marketplace deployment |
| --- | --- | --- |
| **Who deploys** | A Proventeq DevOps specialist, using an account you provide with the [required access](./03-azure-prerequisites.md#required-access). | Your administrator, from the Proventeq365 offer in Azure Marketplace. |
| **How it is deployed** | Into a resource group in your subscription, with Proventeq's deployment templates. | As an Azure **managed application** in your subscription. |
| **Prerequisites script** | Run by the Proventeq DevOps specialist with the account you provide. | Run by your administrator. |
| **Post-deployment configuration** | Completed by Proventeq. | Completed by your administrator with the post-deployment script. |

### Steps for each model

| Step | Direct deployment | Azure Marketplace deployment |
| --- | --- | --- |
| 1. Prerequisites script — [Proventeq365Prerequisites.ps1](/prerequisites/Proventeq365Prerequisites.ps1) creates the Entra ID app registration, grants its API permissions and admin consent, creates the client secret and SharePoint certificate, and stores them in a **Bootstrap Key Vault** in a new resource group. See [Run the Prerequisites Script](./05-run-prerequisites-script.md). | **Required** — run by Proventeq | **Required** — run by your administrator |
| 2. Provide a deployment account — give the Proventeq DevOps specialist an account with the required access. Proventeq then runs the prerequisites script and deploys. See [Direct Deployment](./06-direct-deployment.md). | **Required** | — |
| 3. Deploy from Azure Marketplace — select the Bootstrap Key Vault; the deployment reads everything it needs from it. See [Deploy from Azure Marketplace](./07-deploy-from-azure-marketplace.md). | — | **Required** |
| 4. Run the post-deployment script — [Proventeq365PostDeployment.ps1](/postdeploy/Proventeq365PostDeployment.ps1) sets the redirect URI, imports the SharePoint certificate and, if needed, configures the AI agent. See [Run the Post-Deployment Script](./08-run-post-deployment-script.md). | — (done by Proventeq) | **Required** |
| 5. Grant the notification mailbox — only if Proventeq365 should send email notifications. See [Notification Mailbox](./09-notification-mailbox.md). | Optional | Optional |

## Who should read this

This guide is intended for:

- **Microsoft 365 / Azure administrators** — providing the deployment account for a direct deployment, or running the scripts and the Marketplace deployment.
- **Security administrators** — responsible for admin consent, Conditional Access, MFA, and identity governance.
- **Network administrators** — relevant only if outbound restrictions, proxies, or private networking are in scope. See [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity) for the endpoints that must be reachable.

## Scope and assumptions

- Proventeq365 is deployed into **your** Azure subscription and Microsoft 365 tenant.
- This guide assumes the app registration and the Azure resources are in the **same Microsoft Entra tenant**, so you sign in once with one account. If your Azure subscription is in a different tenant from your Microsoft 365 tenant, see [Cross-Tenant Deployment](./11-cross-tenant-deployment.md).
- Container images for the Proventeq365 services are pulled from a **Proventeq-managed Azure Container Registry**, using a pull-only username and password that Proventeq provides. This is an outbound dependency on a Proventeq-owned endpoint and is by design. See [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity).
- All resources are deployed into your chosen region, with one exception: the **Azure Static Web App** that hosts the user interface. Azure Static Web Apps is available in a limited set of Azure regions, so the interface may be hosted in a different region from the rest of the deployment. It holds static application files only and no customer content is stored there. The exact region is confirmed with Proventeq during deployment planning.
- **Important:** The client secret and certificate never leave your tenant — the prerequisites script writes them straight into your Bootstrap Key Vault. Never send passwords, client secrets, or certificates by email.

## Roles and responsibilities

| Area | Your responsibilities (Customer) | Proventeq's responsibilities |
| --- | --- | --- |
| Access | Make sure the account that runs the prerequisites script has the access listed in [Required Access](./03-azure-prerequisites.md#required-access). For a direct deployment, provide that account to Proventeq (see [Direct Deployment](./06-direct-deployment.md)). | Confirm the access required and support access verification. |
| Microsoft 365 tenant | Approve the app registration that the prerequisites script creates, and its admin consent. Admin consent requires **Global Administrator** or **Privileged Role Administrator**. | Confirm the deployment mode (Read-only or Read-write) and the resulting permission set. |
| Azure subscription | Register the required resource providers and keep the bootstrap resource group. For a Marketplace deployment, also run the prerequisites script, deploy from Azure Marketplace and run the post-deployment script. | Maintain the scripts and provide the container registry credentials. For a direct deployment, run the prerequisites script, deploy Proventeq365 and complete the post-deployment configuration; for a Marketplace deployment, support it. |
| Security & governance | Ensure your MFA and Conditional Access policies allow sign-in to the Azure portal and Azure Cloud Shell for the account running the scripts — including the account you provide for a direct deployment — and approve any exceptions needed. | Provide a least-privilege access recommendation. |
| Azure capacity | Confirm sufficient subscription quota in the target region (see [Confirm Subscription Quota](./03-azure-prerequisites.md#confirm-subscription-quota)). | Advise on sizing and confirm the required SKUs. |
| Network | If outbound traffic is restricted, allow the endpoints listed in [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity). | Provide and maintain the endpoint list. |

## In this section

1. [Readiness Checklist](./01-readiness-checklist.md) — Track every step for your deployment model.
2. [Microsoft 365 Prerequisites](./02-microsoft-365-prerequisites.md) — Licensing, deployment mode, and archiving.
3. [Azure Prerequisites](./03-azure-prerequisites.md) — Required access, information to collect, resource providers, quota, and outbound connectivity.
4. [Entra ID App Registration](./04-entra-app-registration.md) — What the script creates in Entra ID, admin consent, and the API permissions for each deployment mode.
5. [Run the Prerequisites Script](./05-run-prerequisites-script.md) — Both models.
6. [Direct Deployment](./06-direct-deployment.md) — Direct deployment only: the account Proventeq needs.
7. [Deploy from Azure Marketplace](./07-deploy-from-azure-marketplace.md) — Marketplace deployment only.
8. [Run the Post-Deployment Script](./08-run-post-deployment-script.md) — Marketplace deployment only.
9. [Notification Mailbox](./09-notification-mailbox.md) — Both models, only if email notifications are required.
10. [Custom Domain and DNS](./10-custom-domain-and-dns.md) — Only if a custom domain is required.
11. [Cross-Tenant Deployment](./11-cross-tenant-deployment.md) — Only if the Azure subscription is in a different tenant from Microsoft 365.
12. [Troubleshooting](./12-troubleshooting.md) — Messages you can ignore and fixes for common errors.
13. [Next Steps](./13-next-steps.md) — What to share with Proventeq for each deployment model.
