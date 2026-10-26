---
title: "Notification Mailbox"
description: "Optional, for both deployment models — let Proventeq365 send email notifications from one mailbox in your tenant using Exchange Online RBAC for Applications."
---

# Notification Mailbox (optional)

> **Applies only if** Proventeq365 should send email notifications. It applies to both [deployment models](./README.md#deployment-models), and you run it yourself in your tenant because it needs an Exchange Online administrator.

Proventeq365 sends notification emails from **one** mailbox in your tenant. Instead of an organisation-wide `Mail.Send` permission in Entra ID, access is granted with **Exchange Online RBAC for Applications**: a management scope containing only that mailbox, and the *Application Mail.Send* role assigned to the Proventeq365 app over that scope. The app can then send from that mailbox and no other.

> **Important:** Do **not** also add `Mail.Send` as an application permission on the app registration. Exchange Online combines the two grants, so an Entra ID grant would let the app send as every mailbox in your tenant.

## What You Need

- The **Exchange Online Organization Management** role group.
- Admin consent already granted to the app registration (see [Grant Admin Consent](./04-entra-app-registration.md#grant-admin-consent)).
- The grant script `Grant-NotificationMailboxSend.ps1`, provided by Proventeq. Upload it to Azure Cloud Shell in the same way as the deployment scripts (see [Open Azure Cloud Shell](./05-run-prerequisites-script.md#open-azure-cloud-shell-and-upload-the-scripts)).

## Steps

Run these commands in Cloud Shell (**PowerShell**).

1. Sign in to Exchange Online:

   ```powershell
   Connect-ExchangeOnline
   ```

2. If the sender mailbox does not exist yet, create it as a **shared mailbox**. A shared mailbox needs no licence up to 50 GB.

   ```powershell
   New-Mailbox -Shared -Name "Proventeq365" -PrimarySmtpAddress proventeq365@contoso.com
   ```

3. Look up the object ID of the Proventeq365 app's service principal, using the **App (client) ID** from the prerequisites script summary:

   ```powershell
   $spId = az ad sp show --id <APP-CLIENT-ID> --query id -o tsv
   ```

4. Grant the app permission to send from that mailbox:

   ```powershell
   ./Grant-NotificationMailboxSend.ps1 -AppId <APP-CLIENT-ID> -SenderMailbox proventeq365@contoso.com -ServicePrincipalObjectId $spId
   ```

5. Tell your Proventeq contact the sender mailbox address, so it can be configured as the notification sender for your tenant.

The grant can take **30 minutes to 2 hours** to take effect, because Exchange Online caches application permissions. The script is safe to run again: an existing scope or assignment is reused.

> **Note:** `Proventeq365PostDeployment.ps1` also has a `-GrantNotificationMailbox` switch that runs the same grant. It expects the grant script in a fixed folder layout relative to itself, which an upload to the Cloud Shell home folder does not provide, so run the grant script directly as shown above.

Next: [Next Steps](./13-next-steps.md).
