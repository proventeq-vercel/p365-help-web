---
title: "Direct Deployment"
description: "Direct deployment model only — provide the Proventeq DevOps specialist with an account that has the required access, so Proventeq can run the prerequisites script and deploy Proventeq365 into your Azure subscription."
---

# Direct Deployment

> **Direct deployment only.** If you are deploying from Azure Marketplace, skip this page and continue with [Deploy from Azure Marketplace](./07-deploy-from-azure-marketplace.md).

**What this does:** In a direct deployment, a Proventeq DevOps specialist deploys Proventeq365 into your Azure subscription for you. You provide them with an account that has the access listed in [Required Access](./03-azure-prerequisites.md#required-access). With that account they run the [prerequisites script](./05-run-prerequisites-script.md), deploy Proventeq365 with Proventeq's deployment templates, and complete the post-deployment configuration — the redirect URI, the SharePoint certificate and, if in scope, the AI agent. You do not run the post-deployment script.

## Provide a Deployment Account

Choose one of the two options below — agree the approach with your Proventeq contact first.

### Option A — Create a dedicated user account in your tenant

Use this option if your policy requires Proventeq to use an internal account.

**Steps — Azure Portal**

1. Sign in to the **Azure Portal** (https://portal.azure.com) and go to **Microsoft Entra ID**.
2. Select **Users** > **+ New user** > **Create new user**.
3. Enter a display name and a user principal name (UPN) — for example, `proventeq-deploy@yourdomain.com`.
4. Set a strong temporary password, note it down, and share it with Proventeq via your approved secure channel.
5. Select **Create**.

**Steps — Azure CLI (alternative)**

```bash
az ad user create \
  --display-name "<DISPLAY_NAME>" \
  --user-principal-name "<USERNAME>@<TENANT_DOMAIN>" \
  --password "<TEMPORARY_PASSWORD>"
```

### Option B — Invite Proventeq as a guest user

Use this option if your policy permits external guest access.

**Steps — Azure Portal**

1. Sign in to the **Azure Portal** (https://portal.azure.com) and go to **Microsoft Entra ID**.
2. Select **Users** > **+ New user** > **Invite external user**.
3. Enter the Proventeq email address provided by your Proventeq contact.
4. Add a meaningful display name and click **Invite**.

**Steps — Azure CLI (alternative)**

```bash
az rest --method POST \
  --url "https://graph.microsoft.com/v1.0/invitations" \
  --headers "Content-Type=application/json" \
  --body '{"invitedUserEmailAddress":"<PROVENTEQ_EMAIL>","invitedUserDisplayName":"<DISPLAY_NAME>","inviteRedirectUrl":"https://portal.azure.com","sendInvitationMessage":true}'
```

## Assign the Required Access

Assign the account the access listed in [Required Access](./03-azure-prerequisites.md#required-access):

- **Global Administrator** or **Privileged Role Administrator** in Microsoft Entra ID — in **Microsoft Entra ID** → **Roles and administrators**, select the role, then **+ Add assignment** and add the account with an **Active** assignment.
- **Owner** on the subscription — in **Subscriptions** → your subscription → **Access control (IAM)** → **Add role assignment**, select **Owner**, and add the account. On the **Conditions** tab, select **Allow user to assign all roles**.

The Owner assignment can also be made with the Azure CLI:

```bash
az role assignment create \
  --assignee "<DEPLOYMENT_ACCOUNT_UPN_OR_OBJECT_ID>" \
  --role "Owner" \
  --scope "/subscriptions/<SUBSCRIPTION_ID>"
```

> **If your policy does not allow Proventeq to hold Global Administrator or Privileged Role Administrator**, your administrator runs the [prerequisites script](./05-run-prerequisites-script.md) instead, or grants [admin consent](./04-entra-app-registration.md#grant-admin-consent) after Proventeq has run it. Agree the approach with your Proventeq contact.

### Security recommendations for the deployment account

- **Enable MFA** — Strongly recommended. Even if credentials are compromised, MFA prevents unauthorized sign-in.
- **Limit session lifetime** — Configure short session timeouts and disable persistent sessions to reduce the risk of session hijacking.
- **Conditional Access** — Make sure your Conditional Access policies allow the account to sign in to the Azure portal and the Azure CLI.
- **Time-bound access** — Consider removing the role assignments, or disabling the account, once the deployment is complete.

## Share Details with Proventeq

When the account is ready, send your Proventeq contact the details listed in [Next Steps — Direct deployment](./13-next-steps.md#direct-deployment). Proventeq then deploys Proventeq365 on the agreed date, completes the post-deployment configuration, and sends you the Proventeq365 URL.

If Proventeq365 should send email notifications, also complete [Notification Mailbox](./09-notification-mailbox.md) — this step needs an Exchange Online administrator in your tenant.
