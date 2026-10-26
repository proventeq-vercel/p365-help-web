---
title: "Error Messages: Sign-in, Access and License"
description: "What Proventeq365 sign-in, access-denied and license error messages mean and how to fix them — including “You don't have access to this page”, “A valid license is required” and “Invalid license format”."
type: reference
updated: 2026-10-26
---

# Error Messages: Sign-in, Access and License

Messages you may see when signing in to Proventeq365, opening a page your role doesn't allow, or uploading a license. Each entry shows where the message appears, why, and what to do.

## Sign-in and session

### Something went wrong — We couldn't load your session

**Where:** full-page error straight after sign-in.
**Cause:** Proventeq365 could not load your session after you signed in, usually because of a temporary connection or service problem.
**Fix:** Refresh the page or select **Try again**. If it keeps happening, contact your Proventeq365 administrator.

### AADSTS… (Microsoft sign-in error)

**Where:** red text above the application, or on the Microsoft sign-in page.
**Cause:** Microsoft Entra ID refused the sign-in. The `AADSTS` code identifies why — commonly missing admin consent for the Proventeq365 app registration, the user not being allowed to use the app, or a Conditional Access policy.
**Fix:** Give the full message, including the `AADSTS` code, to your Microsoft 365 administrator. If consent is missing, see [Grant Admin Consent](../12-deployment-prerequisites/04-entra-app-registration.md#grant-admin-consent).

### An unexpected error has occurred. Please try again later.

**Where:** full-page error.
**Cause:** an unexpected error in the web application.
**Fix:** Reload the page. If the error persists, contact Proventeq support and say what you were doing when it appeared.

## Access and roles

### You don't have access to this page

**Where:** access-denied page. A second line says which role the page needs:

| Second line | Meaning |
| --- | --- |
| This page is available to tenant administrators only. | The page needs the **Tenant Admin** role — for example creating workspaces or policies, Connections, Templates, License, Audit log or Settings. |
| This page is available to workspace administrators only. | The page needs the **Workspace Admin** role on this workspace — for example editing the workspace or viewing its runs. |
| You don't have a role in this workspace. | You have not been added to this workspace. |
| You don't have permission to view this page. | Any other reason. |

**Fix:** Ask a Tenant Admin or the workspace's administrator to give you the role you need. See [How to Give Users Access to a Workspace](../13-how-to-guides/04-give-users-access-to-a-workspace.md).

### That workspace isn't available. Please pick one from your list.

**Where:** message shown before Proventeq365 returns you to the workspace selector.
**Cause:** the link points to a workspace that doesn't exist, has been deleted, or that you have no role on.
**Fix:** Pick a workspace from your list. If the workspace you need is missing, ask to be added to it.

### The system has no data, please proceed with configuring a workspace

**Where:** workspace selector.
**Cause:** you have no workspaces — either none exist yet, or you haven't been added to any.
**Fix:** A Tenant Admin can create a workspace with **Create New Workspace**. Other users should ask to be added to an existing workspace.

### Failed to fetch workspaces — We couldn't load your workspaces

**Where:** workspace selector.
**Cause:** the list of workspaces could not be loaded. This is usually temporary.
**Fix:** Check your connection and reload. If it persists, contact your administrator.

## License

### A valid license is required. Please contact your tenant administrator.

**Where:** *License required* page, shown in place of every page.
**Cause:** Proventeq365 has no active license — it has expired or was never uploaded.
**Fix:** A Tenant Admin must upload a valid license token. See [How to Renew Your Proventeq365 License](../13-how-to-guides/16-renew-your-license.md).

### License required (on a single menu area)

**Where:** a panel shown instead of one area of the product, for example Archive or Self Service.
**Cause:** your license doesn't include that feature.
**Fix:** Contact Proventeq to add the feature to your license. You can see the features you have under **Enabled features** on the License page.

### Your license expires in N days. Upload a new license to avoid disruption.

**Where:** banner on the License page, from 30 days before expiry.
**Fix:** Get a new license token from Proventeq and upload it before the expiry date.

### Your license has expired. Upload a new license to restore access.

**Where:** banner on the License page.
**Cause:** the license's **Valid to** date has passed. Until a new license is uploaded, Proventeq365 redirects every page to the License page.
**Fix:** Upload a new license token.

### Invalid license format. The token must be a valid GUID.

**Where:** **License token (GUID)** field on the License page.
**Cause:** the value you pasted isn't a GUID.
**Fix:** Paste the token exactly as Proventeq sent it, in the form `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, without spaces or quotes.

### The license token is invalid or could not be processed.

**Where:** License page.
**Cause:** Proventeq's licensing service rejected the token — for example it is mistyped, revoked or not valid for your organisation.
**Fix:** Check the token and contact Proventeq if it still fails.

### Something went wrong. Please try again. (when uploading a license)

**Where:** License page.
**Cause:** the licensing service could not be reached to validate the token.
**Fix:** Try again later. The deployment must be able to reach Proventeq's licensing service; if outbound traffic is restricted, check with your network administrator.

## Related

- [Troubleshooting — Sign-in and access](../14-troubleshooting/README.md#sign-in-and-access)
- [License](../08-license/README.md)
