---
title: "Notification Email"
description: "Let a Hosted Proventeq365 deployment send notification emails from one mailbox in your tenant: create the mailbox, allow the app to send from it, and ask Proventeq to turn email on."
---

# Notification Email

> **Applies to a Hosted deployment**, whether you deployed Proventeq365 yourself or Proventeq deployed it for you. Email is optional: without it, every notification still appears in Proventeq365 under the **Bell** icon.
>
> **Using the Proventeq365 SaaS service?** There is nothing to set up. Emails come from Proventeq's own mailbox, `notifications.proventeq365@proventeq.com`.

## How It Works

- Proventeq365 sends every email from **one mailbox in your tenant**. A shared mailbox is recommended: it needs no licence up to 50 GB.
- The Proventeq365 app sends as that mailbox with Microsoft Graph. It may send from that mailbox and no other: access is granted with **Exchange Online RBAC for Applications**, as a management scope that contains only that mailbox and the *Application Mail.Send* role assigned to the app over that scope.
- Each email goes to the recipient's email address in your directory, or to their user principal name when the user has no email address.
- Sent emails are not saved in the mailbox's **Sent Items** folder. To see what was sent, use message trace in the Exchange admin center.

> **Important:** Do **not** also add `Mail.Send` as an application permission on the app registration. Exchange Online combines the two grants, so an Entra ID grant would let the app send as every mailbox in your tenant.

## Which Emails Are Sent

Email is used only for events that need someone's attention. Progress and success notifications appear in Proventeq365 only.

| Event | Emailed when |
| --- | --- |
| Failures | A discovery run (SharePoint, Exchange, Teams or Azure), an action, a site provisioning request, a policy report or a Migrator machine allocation fails. |
| Approvals | A provisioning request or a policy report is waiting for your approval, or an approver responded to your provisioning request. |
| Workspace access | You were given access to a workspace, or your access was removed. |
| Processing speed | A client notice lowered the processing speed. Sent to global administrators. |
| New account details | A self-service **Create User** request created an account. The sign-in name and temporary password go to the requester, or to the recipient set on the request. |

Each user chooses which notification types also arrive by email: open the **Notifications** screen, select the **Preferences** tab, and tick or clear **Email** for each type.

## Who Does What

| Step | Who |
| --- | --- |
| 1. Create the sender mailbox | Your Exchange administrator |
| 2. Allow the Proventeq365 app to send from it | Your Exchange administrator |
| 3. Send the mailbox address to Proventeq | You |
| 4. Turn email on for your deployment | Proventeq |

## What You Need

- Membership of the **Organization Management** role group in Exchange Online, in your Microsoft 365 tenant. In a [cross-tenant deployment](./10-cross-tenant-deployment.md), the mailbox and the grant are in the Microsoft 365 tenant.
- The **App (client) ID** from the [prerequisites script summary](./05-run-prerequisites-script.md#script-output--copy-these-values). For a Proventeq-run deployment, ask your Proventeq contact for it.
- Admin consent already granted to the app registration (see [Grant Admin Consent](./04-entra-app-registration.md#grant-admin-consent)), so that the app has a service principal in your tenant.
- The grant script [Grant-NotificationMailboxSend.ps1](/postdeploy/Grant-NotificationMailboxSend.ps1). Upload it to Cloud Shell in the same way as the other two scripts (see [Open Azure Cloud Shell](./05-run-prerequisites-script.md#open-azure-cloud-shell-and-upload-the-scripts)).

## Steps

Run these commands in Cloud Shell (**PowerShell**). Replace `proventeq365@contoso.com` with your mailbox address and `<APP-CLIENT-ID>` with the App (client) ID.

1. Sign in to Exchange Online:

   ```powershell
   Connect-ExchangeOnline
   ```

2. If the sender mailbox does not exist yet, create it as a **shared mailbox**:

   ```powershell
   New-Mailbox -Shared -Name "Proventeq365" -PrimarySmtpAddress proventeq365@contoso.com
   ```

3. Look up the object ID of the app's service principal:

   ```powershell
   $spId = az ad sp show --id <APP-CLIENT-ID> --query id -o tsv
   ```

   In a cross-tenant deployment, first sign in to the Microsoft 365 tenant with `az login --tenant <M365-TENANT-ID>`.

4. Allow the app to send from the mailbox:

   ```powershell
   ./Grant-NotificationMailboxSend.ps1 -AppId <APP-CLIENT-ID> -SenderMailbox proventeq365@contoso.com -ServicePrincipalObjectId $spId
   ```

   The script ends with a check. **InScope** must be **True** for the mailbox.

5. Send the mailbox address to your Proventeq contact. Proventeq turns email on for your deployment and confirms when it is done. The address is not a secret.

The script is safe to run again: an existing scope or role assignment is reused, and each run repeats the check at the end.

## Check That It Works

1. Wait until the grant has taken effect. This can take **30 minutes to 2 hours**, because Exchange Online caches application permissions.
2. After Proventeq confirms that email is on, add a test user to a workspace. That user receives an email from the sender mailbox within a few minutes.
3. If no email arrives, check the user's junk email folder, then use message trace in the Exchange admin center to search for messages sent from the sender mailbox.

## Change or Stop Email

- **Use a different mailbox:** repeat steps 2 to 5 with the new address. Then, in Exchange Online, remove the role assignment and the management scope named `Proventeq365 sender - <old address>`.
- **Stop email:** ask your Proventeq contact to turn email off, then remove the role assignment and the management scope as above.

Next: [Custom Domain and DNS](./09-custom-domain-and-dns.md), only if a custom domain is required, or [Next Steps](./12-next-steps.md).
