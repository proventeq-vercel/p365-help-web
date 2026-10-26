---
title: "Readiness Checklist"
description: "Track every deployment step for your deployment model, from confirming licences and access to handing over to Proventeq, and confirm status with your Proventeq contact."
---

# Readiness Checklist

Work through this checklist in order and confirm status with your Proventeq contact. Items 1–11 must be complete **before** the prerequisites script is run. Then complete the section for your [deployment model](./README.md#deployment-models).

## Before you start

| # | Checklist item | Status (Yes / No / N/A) | Notes |
| --- | --- | --- | --- |
| 1 | Deployment model agreed with Proventeq — Direct or Azure Marketplace (see [Deployment Models](./README.md#deployment-models)) | | |
| 2 | Microsoft 365 licenses confirmed for all impacted users (see [Licensing](./02-microsoft-365-prerequisites.md#licensing)) | | |
| 3 | Deployment mode confirmed with Proventeq — Read-only or Read-write (see [Deployment Mode](./02-microsoft-365-prerequisites.md#deployment-mode)) | | |
| 4 | Archiving enabled in your Microsoft 365 tenant — only if the archiving feature is required (see [Archiving](./02-microsoft-365-prerequisites.md#archiving)) | | |
| 5 | Account that will run the prerequisites script has **Global Administrator** or **Privileged Role Administrator**, and **Owner** on the subscription (see [Required Access](./03-azure-prerequisites.md#required-access)) | | |
| 6 | Container registry (ACR) username and password received from Proventeq — Marketplace deployment only | | |
| 7 | Tenant ID, region, bootstrap resource group name, Bootstrap Key Vault name and SQL administrator collected (see [Information to Collect](./03-azure-prerequisites.md#information-to-collect)) | | |
| 8 | All required Azure resource providers registered (see [Register Azure Resource Providers](./03-azure-prerequisites.md#register-azure-resource-providers)) | | |
| 9 | Subscription quota confirmed in the target region (see [Confirm Subscription Quota](./03-azure-prerequisites.md#confirm-subscription-quota)) | | |
| 10 | Outbound connectivity allowed — only if egress is restricted (see [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity)) | | |
| 11 | Custom domain name and DNS ownership confirmed — only if a custom domain is required (see [Custom Domain and DNS](./10-custom-domain-and-dns.md)) | | |

## Direct deployment only

| # | Checklist item | Status (Yes / No / N/A) | Notes |
| --- | --- | --- | --- |
| 12 | Deployment account created, or Proventeq guest account invited (see [Provide a Deployment Account](./06-direct-deployment.md#provide-a-deployment-account)) | | |
| 13 | **Global Administrator** or **Privileged Role Administrator**, and **Owner** on the subscription, assigned to the deployment account (see [Assign the Required Access](./06-direct-deployment.md#assign-the-required-access)) | | |
| 14 | Details shared with Proventeq (see [Next Steps — Direct deployment](./13-next-steps.md#direct-deployment)) | | |
| 15 | Proventeq confirms the prerequisites script has run, admin consent is granted and Proventeq365 is deployed | | |

## Azure Marketplace deployment only

| # | Checklist item | Status (Yes / No / N/A) | Notes |
| --- | --- | --- | --- |
| 16 | Scripts downloaded (see [Download the Scripts](./05-run-prerequisites-script.md#download-the-scripts)) and uploaded to Azure Cloud Shell (**PowerShell**) (see [Open Azure Cloud Shell](./05-run-prerequisites-script.md#open-azure-cloud-shell-and-upload-the-scripts)) | | |
| 17 | Prerequisites script run, and the **Bootstrap Key Vault** resource ID and **App (client) ID** copied from its summary (see [Run the Prerequisites Script](./05-run-prerequisites-script.md)) | | |
| 18 | Admin consent granted to the app registration's API permissions (see [Grant Admin Consent](./04-entra-app-registration.md#grant-admin-consent)) | | |
| 19 | Proventeq365 deployed from Azure Marketplace with the Bootstrap Key Vault selected (see [Deploy from Azure Marketplace](./07-deploy-from-azure-marketplace.md)) | | |
| 20 | **Managed resource group** name (`mrg-...`) noted (see [Find the Managed Resource Group](./07-deploy-from-azure-marketplace.md#find-the-managed-resource-group)) | | |
| 21 | Post-deployment script run (see [Run the Post-Deployment Script](./08-run-post-deployment-script.md)) | | |
| 22 | Details shared with Proventeq (see [Next Steps — Azure Marketplace deployment](./13-next-steps.md#azure-marketplace-deployment)) | | |
| 23 | Script logs downloaded from Cloud Shell (optional) | | |

## After deployment (both models)

| # | Checklist item | Status (Yes / No / N/A) | Notes |
| --- | --- | --- | --- |
| 24 | Bootstrap resource group **kept** — do not delete it | | |
| 25 | Notification mailbox granted — only if Proventeq365 should send email notifications (see [Notification Mailbox](./09-notification-mailbox.md)) | | |
