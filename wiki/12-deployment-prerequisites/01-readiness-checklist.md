---
title: "Readiness Checklist"
description: "Track every deployment step, from confirming licences and access to running the post-deployment script, and confirm status with your Proventeq contact."
---

# Readiness Checklist

Work through this checklist in order and confirm status with your Proventeq contact. Items 1–10 must be complete **before** you run the prerequisites script.

## Before you start

| # | Checklist item | Status (Yes / No / N/A) | Notes |
| --- | --- | --- | --- |
| 1 | Microsoft 365 licenses confirmed for all impacted users (see [Licensing](./02-microsoft-365-prerequisites.md#licensing)) | | |
| 2 | Deployment mode confirmed with Proventeq — Read-only or Read-write (see [Deployment Mode](./02-microsoft-365-prerequisites.md#deployment-mode)) | | |
| 3 | Archiving enabled in your Microsoft 365 tenant — only if the archiving feature is required (see [Archiving](./02-microsoft-365-prerequisites.md#archiving)) | | |
| 4 | Person running the deployment has **Global Administrator** or **Privileged Role Administrator**, and **Owner** on the subscription (see [Required Access](./03-azure-prerequisites.md#required-access)) | | |
| 5 | Container registry (ACR) username and password received from Proventeq | | |
| 6 | Tenant ID, region, bootstrap resource group name and Bootstrap Key Vault name collected (see [Information to Collect](./03-azure-prerequisites.md#information-to-collect)) | | |
| 7 | SQL administrator chosen — the Entra user or group, with its object ID and display name (see [Information to Collect](./03-azure-prerequisites.md#information-to-collect)) | | |
| 8 | All required Azure resource providers registered (see [Register Azure Resource Providers](./03-azure-prerequisites.md#register-azure-resource-providers)) | | |
| 9 | Subscription quota confirmed in the target region (see [Confirm Subscription Quota](./03-azure-prerequisites.md#confirm-subscription-quota)) | | |
| 10 | Outbound connectivity allowed — only if egress is restricted (see [Outbound Connectivity](./03-azure-prerequisites.md#outbound-connectivity)) | | |
| 11 | Custom domain name and DNS ownership confirmed — only if a custom domain is required (see [Custom Domain and DNS](./08-custom-domain-and-dns.md)) | | |

## Deployment

| # | Checklist item | Status (Yes / No / N/A) | Notes |
| --- | --- | --- | --- |
| 12 | Both scripts uploaded to Azure Cloud Shell (**PowerShell**) (see [Open Azure Cloud Shell](./05-run-prerequisites-script.md#open-azure-cloud-shell-and-upload-the-scripts)) | | |
| 13 | Prerequisites script run, and the **Bootstrap Key Vault** resource ID and **App (client) ID** copied from its summary (see [Run the Prerequisites Script](./05-run-prerequisites-script.md)) | | |
| 14 | Admin consent granted to the app registration's API permissions (see [Grant Admin Consent](./04-entra-app-registration.md#grant-admin-consent)) | | |
| 15 | Proventeq365 deployed from Azure Marketplace with the Bootstrap Key Vault selected (see [Deploy from Azure Marketplace](./06-deploy-from-azure-marketplace.md)) | | |
| 16 | **Managed resource group** name (`mrg-...`) noted (see [Find the Managed Resource Group](./06-deploy-from-azure-marketplace.md#find-the-managed-resource-group)) | | |
| 17 | Post-deployment script run (see [Run the Post-Deployment Script](./07-run-post-deployment-script.md)) | | |
| 18 | Notification mailbox granted — only if Proventeq365 should send email notifications (see [Notification Mailbox](./07-run-post-deployment-script.md#notification-mailbox-optional)) | | |
| 19 | Script logs downloaded from Cloud Shell (optional) | | |
| 20 | Bootstrap resource group **kept** — do not delete it | | |
