---
title: "Deployment Prerequisites"
description: "Everything you need to prepare and run to deploy Proventeq365 into your Microsoft 365 tenant and Azure subscription — required access, the prerequisites script, the Azure Marketplace deployment, and the post-deployment script."
---

# Deployment Prerequisites

This guide describes how to prepare for and deploy Proventeq365 into your Microsoft 365 tenant and Azure subscription. The deployment is carried out by **your administrator** in three stages, using two PowerShell scripts and the Proventeq365 offer in Azure Marketplace. Nothing needs to be installed on your machine: both scripts run in **Azure Cloud Shell**.

| Stage | What happens | Guide |
| --- | --- | --- |
| 1. Prerequisites script | [Proventeq365Prerequisites.ps1](/prerequisites/Proventeq365Prerequisites.ps1) creates the Entra ID app registration, grants its API permissions and admin consent, creates the client secret and SharePoint certificate, and stores them in a **Bootstrap Key Vault** in a new resource group. | [Run the Prerequisites Script](./05-run-prerequisites-script.md) |
| 2. Azure Marketplace | You deploy Proventeq365 from Azure Marketplace and select the Bootstrap Key Vault. The deployment reads everything it needs from that vault. | [Deploy from Azure Marketplace](./06-deploy-from-azure-marketplace.md) |
| 3. Post-deployment script | [Proventeq365PostDeployment.ps1](/postdeploy/Proventeq365PostDeployment.ps1) sets the app registration's redirect URI to the live Proventeq365 URL, imports the SharePoint certificate into the product Key Vault and, if needed, configures the AI agent. | [Run the Post-Deployment Script](./07-run-post-deployment-script.md) |

## Who should read this

This guide is intended for:

- **Microsoft 365 / Azure administrators** — running the scripts and the Marketplace deployment.
- **Security administrators** — responsible for admin consent, Conditional Access, MFA, and identity governance.
- **Network administrators** — relevant only if outbound restrictions, proxies, or private networking are in scope. See [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity) for the endpoints that must be reachable.

## Scope and assumptions

- Proventeq365 is deployed into **your** Azure subscription and Microsoft 365 tenant, as an Azure **managed application**.
- This guide assumes the app registration and the Azure resources are in the **same Microsoft Entra tenant**, so you sign in once with one account. If your Azure subscription is in a different tenant from your Microsoft 365 tenant, see [Cross-Tenant Deployment](./09-cross-tenant-deployment.md).
- Container images for the Proventeq365 services are pulled from a **Proventeq-managed Azure Container Registry**, using a pull-only username and password that Proventeq provides. This is an outbound dependency on a Proventeq-owned endpoint and is by design. See [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity).
- All resources are deployed into your chosen region, with one exception: the **Azure Static Web App** that hosts the user interface. Azure Static Web Apps is available in a limited set of Azure regions, so the interface may be hosted in a different region from the rest of the deployment. It holds static application files only and no customer content is stored there. The exact region is confirmed with Proventeq during deployment planning.
- **Important:** The client secret and certificate never leave your tenant — the prerequisites script writes them straight into your Bootstrap Key Vault. Never send passwords, client secrets, or certificates by email.

## Roles and responsibilities

| Area | Your responsibilities (Customer) | Proventeq's responsibilities |
| --- | --- | --- |
| Access | Make sure the person running the scripts has the access listed in [Required Access](./03-azure-prerequisites.md#required-access). | Confirm the access required and support access verification. |
| Microsoft 365 tenant | Run the prerequisites script, which creates the app registration, and grant admin consent to its API permissions. Admin consent requires **Global Administrator** or **Privileged Role Administrator**. | Confirm the deployment mode (Read-only or Read-write) and the resulting permission set. |
| Azure subscription | Register the required resource providers, download and run both scripts, deploy Proventeq365 from Azure Marketplace, and keep the bootstrap resource group. | Maintain the scripts, provide the container registry credentials, and support the deployment. |
| Security & governance | Ensure your MFA and Conditional Access policies allow sign-in to the Azure portal and Azure Cloud Shell for the person running the deployment, and approve any exceptions needed. | Provide a least-privilege access recommendation. |
| Azure capacity | Confirm sufficient subscription quota in the target region (see [Confirm Subscription Quota](./03-azure-prerequisites.md#confirm-subscription-quota)). | Advise on sizing and confirm the required SKUs. |
| Network | If outbound traffic is restricted, allow the endpoints listed in [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity). | Provide and maintain the endpoint list. |

## In this section

1. [Readiness Checklist](./01-readiness-checklist.md) — Track every step from preparation to post-deployment.
2. [Microsoft 365 Prerequisites](./02-microsoft-365-prerequisites.md) — Licensing, deployment mode, and archiving.
3. [Azure Prerequisites](./03-azure-prerequisites.md) — Required access, information to collect, resource providers, quota, and outbound connectivity.
4. [Entra ID App Registration](./04-entra-app-registration.md) — What the script creates in Entra ID, admin consent, and the API permissions for each deployment mode.
5. [Run the Prerequisites Script](./05-run-prerequisites-script.md) — Stage 1, before the Marketplace deployment.
6. [Deploy from Azure Marketplace](./06-deploy-from-azure-marketplace.md) — Stage 2.
7. [Run the Post-Deployment Script](./07-run-post-deployment-script.md) — Stage 3, after the Marketplace deployment, including the optional notification mailbox.
8. [Custom Domain and DNS](./08-custom-domain-and-dns.md) — Only if a custom domain is required.
9. [Cross-Tenant Deployment](./09-cross-tenant-deployment.md) — Only if the Azure subscription is in a different tenant from Microsoft 365.
10. [Troubleshooting](./10-troubleshooting.md) — Messages you can ignore and fixes for common errors.
11. [Next Steps](./11-next-steps.md) — What to share with Proventeq once the deployment is complete.
