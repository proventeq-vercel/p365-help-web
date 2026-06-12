---
title: "Readiness Checklist"
description: "Complete every item in this checklist before the deployment date and confirm status with your Proventeq contact."
---

# Readiness Checklist

Complete every item in this checklist before the deployment date and confirm status with your Proventeq contact.

| # | Checklist item | Status (Yes / No / N/A) | Notes |
| --- | --- | --- | --- |
| 1 | Microsoft 365 licenses confirmed for all impacted users (see [Licensing](./02-microsoft-365-prerequisites.md#licensing)) | | |
| 2 | Deployment mode confirmed — Read-only or Read-write (see [Deployment Mode](./02-microsoft-365-prerequisites.md#deployment-mode)) | | |
| 3 | Archiving enabled in your Microsoft 365 tenant — only if the archiving feature is required (see [Archiving](./02-microsoft-365-prerequisites.md#archiving)) | | |
| 4 | Azure subscription identified for deployment | | |
| 5 | Dedicated resource group created in the target region (see [Create a Resource Group](./03-azure-prerequisites.md#create-a-resource-group)) | | |
| 6 | Deployment identity created or Proventeq guest account invited (see [Create a Deployment Identity](./03-azure-prerequisites.md#create-a-deployment-identity)) | | |
| 7 | Owner role assigned to the deployment identity on the resource group (see [Grant Access to the Resource Group](./03-azure-prerequisites.md#grant-access-to-the-resource-group-rbac)) | | |
| 8 | All required Azure resource providers registered (see [Register Azure Resource Providers](./03-azure-prerequisites.md#register-azure-resource-providers)) | | |
| 9 | App registration created and API permissions granted with admin consent (see [Entra ID App Registration](./04-entra-app-registration.md)) | | |
| 10 | Custom domain name and DNS ownership confirmed — only if a custom domain is required (see [Custom Domain and DNS](./05-custom-domain-and-dns.md)) | | |
