---
title: "Frequently Asked Questions"
description: "Answers to common questions about Proventeq365: what it does, where it runs and stores data, the Microsoft 365 permissions it needs, roles, scans, policies, archiving to Wasabi or Azure Blob, self-service provisioning, licensing and notifications."
type: faq
updated: 2026-10-26
---

# Frequently Asked Questions

Short answers to the questions customers ask most often about Proventeq365. Each answer links to the page with the full details.

## General

### What is Proventeq365?

Proventeq365 is a governance tool for Microsoft 365. It scans SharePoint Online sites, Microsoft Teams sites, OneDrive and Exchange Online, and shows where content is overshared, where permissions are too broad, and where storage is taken up by redundant, obsolete or trivial (ROT) content. It can then fix what it finds — removing permissions, cleaning up or archiving content — and lets business users request new sites, teams and user accounts through governed self-service templates. See the [User Guide](../README.md).

### Which Microsoft 365 services does Proventeq365 cover?

SharePoint Online (including the sites behind Microsoft Teams), OneDrive and Exchange Online. A **Microsoft 365 Governance** workspace covers SharePoint sites and OneDrives; an **Exchange Monitoring** workspace analyses the links and attachments sent by email. Self-service provisioning creates SharePoint sites, Microsoft Teams, libraries, folders, channels and user accounts.

### What is ROT content?

**ROT** stands for **redundant, obsolete and trivial** content: duplicate copies of the same file, old files that haven't been changed or opened for a long time, and low-value files such as temporary files or drafts. You decide what counts as obsolete or trivial — for example the age in months and the file extensions — on each workspace's **Configuration** step. See [How to Find and Clean Up ROT Content](../13-how-to-guides/11-find-and-clean-up-rot-content.md).

### What is a workspace?

A workspace defines **what Proventeq365 scans, how often, and who can see the results**. Each workspace has a scope (all sites, a list of sites, or a CSV import), a data refresh schedule, the rules for obsolete and trivial content, optional governance policies, and a list of users with roles. See [How to Create a Microsoft 365 Governance Workspace](../13-how-to-guides/02-create-a-governance-workspace.md).

## Deployment and data

### Where is Proventeq365 deployed?

Into **your own Azure subscription**, as an Azure managed application from Azure Marketplace, or by Proventeq on your behalf. You choose the Azure region. See [Deployment Prerequisites](../12-deployment-prerequisites/README.md).

### Where is my data stored?

In your Azure subscription, in the region you choose — the database, storage and processing all run there. The only exception is the web interface, which is hosted on Azure Static Web Apps; that service is available in fewer regions, so the interface may be hosted in a different region, but it holds only the application files and no customer content. See [Azure Prerequisites — Information to Collect](../12-deployment-prerequisites/03-azure-prerequisites.md#information-to-collect).

### Does Proventeq365 read the content of my files and emails?

Scans read **metadata** — names, locations, sizes, dates, owners, permissions, sharing links and labels. Duplicate files are found by comparing the file hashes Microsoft 365 provides, not by downloading the files. For email, Proventeq365 stores the message details, the links found in messages and the names and sizes of attachments, but **not** the email bodies or attachment contents. File content is copied only when an action needs it — for example when you archive a file, or restore it.

### Do I need to install anything?

No. The deployment scripts run in **Azure Cloud Shell** in your browser, and Proventeq365 itself runs in Azure and is used through a web browser. See [Run the Prerequisites Script](../12-deployment-prerequisites/05-run-prerequisites-script.md).

### Can Proventeq deploy Proventeq365 for us?

Yes. In a Proventeq-run deployment you still run the prerequisites script and grant admin consent, and Proventeq carries out the deployment and post-deployment configuration. See [Deployment Prerequisites](../12-deployment-prerequisites/README.md).

### Can the Azure subscription be in a different tenant from Microsoft 365?

Yes. See [Cross-Tenant Deployment](../12-deployment-prerequisites/09-cross-tenant-deployment.md).

### What network access does Proventeq365 need?

Outbound HTTPS to Microsoft 365, Microsoft Graph, Azure services, the Proventeq container registry and, if used, Wasabi. The full list is in [Outbound Connectivity](../12-deployment-prerequisites/03-azure-prerequisites.md#outbound-connectivity).

## Security and permissions

### What permissions does Proventeq365 need in Microsoft 365?

Application permissions for Microsoft Graph and SharePoint, granted to an app registration in your tenant with admin consent. The set depends on the deployment mode: **Read-only** for reports and insights only, or **Read-write** to also fix issues. See [API Permissions](../12-deployment-prerequisites/04-entra-app-registration.md#api-permissions).

### What is the difference between Read-only and Read-write mode?

**Read-only** gives you the reports and insights but makes no changes to your environment. **Read-write** adds the permissions Proventeq365 needs to remediate — for example removing permissions, archiving or deleting content, and self-service provisioning. See [Deployment Mode](../12-deployment-prerequisites/02-microsoft-365-prerequisites.md#deployment-mode).

### Can I switch from Read-only to Read-write later?

Yes. Re-run the prerequisites script with `-PermissionMode ReadWrite` and `-GrantAdminConsent`; the extra permissions are added and consented. Going back to Read-only means removing the extra permissions manually in the app registration. See [Changing mode later](../12-deployment-prerequisites/04-entra-app-registration.md#api-permissions).

### Who has to grant admin consent?

A **Global Administrator** or **Privileged Role Administrator**. The prerequisites script can grant it during the run, or a Global Administrator can grant it afterwards. See [Grant Admin Consent](../12-deployment-prerequisites/04-entra-app-registration.md#grant-admin-consent).

### Where are the app registration's secret and certificate stored?

In a **Key Vault in your own subscription**. The prerequisites script writes them there directly, so they never leave your tenant, and they should never be sent by email. See [Run the Prerequisites Script](../12-deployment-prerequisites/05-run-prerequisites-script.md).

### Can Proventeq365 show which apps can access our SharePoint and OneDrive content?

Yes. The **App Permissions** report lists every app and service principal with access to SharePoint or OneDrive content, who publishes it, whether it is third-party, how far its access reaches and its highest permission level. A third-party app is one not published by Microsoft and not registered in your own tenant. See [App Permissions](../04-reports/app-permissions/README.md).

### Can Proventeq365 revoke an app's tenant-wide permissions, such as Sites.FullControl.All?

No. Proventeq365 can revoke only the grants an app holds on specific sites. Application and delegated permissions are held in Microsoft Entra ID and must be removed there. See [How to Review Third-Party App Access](../13-how-to-guides/18-review-third-party-app-access.md).

### Why can't I remove access that someone has through a group?

Removing permissions from the Security & Oversharing report takes away only direct grants and sharing links. Access that comes through a group, or that an item inherits from its parent, is kept. Remove the person from the group in Microsoft 365, or remove the group's own grant, instead. See [Removing Permissions](../04-reports/security-oversharing/README.md#removing-permissions).

### Does the Security & Oversharing report show people in nested groups?

Yes, up to three levels below the group that holds the permission. The access panel shows the whole path for each person, for example *via Project Team / Visitors*, and lists each route separately when someone has access in more than one way. See [Access Panel](../04-reports/security-oversharing/README.md#access-panel).

## Access and roles

### How do users sign in?

With their Microsoft 365 work account, through Microsoft Entra ID. There are no separate Proventeq365 passwords.

### What roles are there?

- **Tenant Admin** — manages everything: creates workspaces and policies, and manages connections, templates, the license, the audit log and settings.
- **Workspace Admin** — on a workspace: runs and stops data refreshes, and starts actions such as removing permissions or archiving.
- **Workspace User** — on a workspace: views its dashboard, reports and policy results.

Any licensed user can raise self-service requests from the templates available to them, and template approvers decide requests. See [How to Give Users Access to a Workspace](../13-how-to-guides/04-give-users-access-to-a-workspace.md).

### Why can't a colleague see a workspace?

People see only the workspaces they have a role on. Add them on the workspace's **Users** step. See [How to Give Users Access to a Workspace](../13-how-to-guides/04-give-users-access-to-a-workspace.md).

### Why is a menu item missing, or why do I see "License required"?

Menu items appear only when your role allows the screen and your license includes the feature behind it. If you open a screen your license doesn't cover, for example from a bookmark, Proventeq365 shows the **License required** screen instead. A Tenant Admin can check the **Enabled features** on the License screen. See [License — License Features](../08-license/README.md#license-features).

## Workspaces and scans

### How often is the data refreshed?

On the workspace's schedule: once, or recurring daily, weekly or monthly at the times you choose. Workspace Admins can also start a refresh with **Refresh data**. See [How to Run a Workspace Scan](../13-how-to-guides/03-run-a-workspace-scan.md).

### How long does the first scan take?

It depends on the number of sites and files in scope. The first refresh is a full scan and takes longest; later refreshes are incremental and read only what has changed. Reports fill with data once the first refresh has completed.

### Why is my dashboard empty?

The workspace's first data refresh hasn't finished yet, or it failed. Check **View runs** on the workspace. See [Troubleshooting — Workspaces and data refresh](../14-troubleshooting/README.md#workspaces-and-data-refresh).

### Can I change which sites a workspace scans?

Not after it has been created — the scope, the include options and the Entra ID discovery options are fixed. Only **Include URL patterns** can be edited, and changing them makes the next refresh re-read every site. Create a new workspace for a different set of sites. Other settings, such as the schedule, the ROT rules, the policies and the users, can be changed.

### Can I stop a data refresh?

Yes. A Workspace Admin can click **Stop data refresh** on the run while it is queued or still collecting data. Data collected so far is kept, and the reports keep showing the last completed refresh. See [Workspace Runs](../02-manage/workspaces/workspace-runs.md).

### Can I add many sites at once?

Yes. Choose **Import CSV file** on the **Sources** step and upload a CSV file with the sites, or choose **Select all sites** and optionally limit it with URL patterns. See [Workspaces — Import CSV File](../02-manage/workspaces/README.md#import-csv-file).

### Does Proventeq365 scan OneDrive?

Yes. With **Select all sites**, turn on **Include One Drives**; with a manual list or CSV, add the OneDrive addresses under `/personal/`.

### Why do the Storage Optimisation savings say "No change today"?

Your tenant is inside its Microsoft 365 storage entitlement. Reclaiming space frees capacity but doesn't reduce your bill until usage goes over the entitlement. See [Storage Optimisation Overview](../04-reports/storage-optimization/README.md).

### Why do Version Clean-up or Archive candidates show Unavailable or Unknown?

They depend on deployment options: collecting version history, and capturing the Microsoft 365 site usage report (which needs the `Reports.Read.All` permission). Ask Proventeq to enable them. See [Error Messages: Reports](../15-error-catalog/07-reports.md).

## Policies

### What governance policies are available?

More than twenty predefined rules covering permissions and access, content lifecycle, and information protection — for example Excessive Sharing, Guest Access Governance, Large File, Obsolete Content, Inactive Sites and the sensitivity and retention label drift policies. See [Predefined Policies](../appendix/predefined-policies.md).

### When do policies run?

Every enabled policy is evaluated at the end of each workspace data refresh. A Tenant Admin can also run a single policy at any time with **Run Policy**. Policies have no schedule of their own.

### What is the difference between manual and automatic actions?

An **automatic** action runs on every item the policy matches as soon as the policy runs. A **manual** action waits until a Workspace Admin reviews the policy report and clicks **Execute on All Items** or **Execute on Selection**. Automatic actions can't be undone, so start with manual actions until you trust a policy's results. See [How to Add a Governance Policy](../13-how-to-guides/05-add-a-governance-policy.md).

### Can I undo a policy action?

It depends on the action. Archived files can be restored from the policy report, the stub link or the archived file page; content moved to Microsoft 365 Archive is reactivated in Microsoft 365. Deleted files go to the SharePoint recycle bin. Removed permissions and sharing links, trimmed versions and reinforced labels can't be undone from Proventeq365, so start with **Manual** actions until you trust a policy's results. See [Predefined Policies](../appendix/predefined-policies.md).

### Why does the Excessive Versions Policy find nothing?

It needs version history to be collected, which is off by default in a deployment. Ask Proventeq to turn it on, then run a data refresh.

### Can a second person check a policy's results before its actions run?

Yes. Turn on **Requires approval** on the policy and add approvers. Every report the policy produces is then held — automatic actions wait and manual actions can't be started — until an approver approves the whole report or selected items. See [Policy Approvals](../02-manage/policies/policy-approvals.md).

### Does a Tenant Admin automatically count as a policy approver?

No. Only the people and groups listed under **Approvers** on the policy can approve or reject its reports. Tenant Admins don't bypass this list.

### Why does an approval show "Superseded"?

Each run of the policy replaces its report, and the previous approval — decided or not — is superseded. The new report needs its own decision.

### Can we create our own policy rules?

Yes, with **Policy Rules**: describe the rule in plain language to the rule assistant, review the safety checks and the preview of matching items, and a Tenant Admin approves and deploys it for use in policies. Policy Rules needs the optional AI component in your deployment and works for Microsoft 365 Governance workspaces. See [Policy Rules](../02-manage/policy-rules/README.md).

### Where can I see what an action changed?

On the **Actions** page. It lists every action run in the workspace — permission removals, deletions, archiving and restores, whether started by a person or a policy — with each item's outcome and any error, and an **Export CSV** option. See [Actions](../02-manage/actions/README.md).

## Archiving

### Where are archived files stored?

In storage you own and connect to Proventeq365 — **Wasabi** object storage or **Azure Blob Storage** — or, for whole sites, OneDrives and libraries, in **Microsoft 365 Archive** inside your own tenant. See [How to Add an Archive Connection](../13-how-to-guides/06-add-an-archive-connection.md) and [Microsoft 365 Archive](../10-archive/02-microsoft-365-archive.md).

### What happens to a file in SharePoint when it is archived?

With **Replace with Stub**, the file is replaced in place by a stub link with the same address, so existing links keep working. The file's content and version history are removed from SharePoint — they are not kept in the recycle bin. Without a stub, the original file is deleted after it is archived. See [How to Archive Obsolete Content](../13-how-to-guides/07-archive-obsolete-content.md).

### Can users still get to archived files?

Yes. Anyone who can open the stub link in SharePoint can download the current or an earlier version, preview media files, or restore the file to its original place. See [How to Restore an Archived File](../13-how-to-guides/08-restore-an-archived-file.md).

### Are file versions archived?

Yes. By default every version is archived, including minor (draft) versions. You can limit it to the last N versions, or the versions from the last N months; the current version is always archived.

### Can archived files be restored?

Yes — one file at a time from its stub link, or in bulk by a Workspace Admin. A restore puts the file and its versions back in the original location and removes it from the archive.

### Can Proventeq365 archive whole sites to Microsoft 365 Archive?

Yes. Whole sites, OneDrives or selected libraries, folders and files can be moved to Microsoft 365 Archive from **Workspace Inventory**, or with the **M365 Archive** policy action. Microsoft 365 Archive must be enabled in your tenant with billing set up, and Proventeq sets up the archive mode. Content in Microsoft 365 Archive is reactivated in Microsoft 365, not in Proventeq365. See [Microsoft 365 Archive](../10-archive/02-microsoft-365-archive.md).

### How many items can I restore at once?

From a policy report, up to 1,000 archived records per selection; **Restore all** restores every archived item in the report. From **Workspace Inventory**, up to 1,000 sites, or 1,000 files and 1,000 folders. Bulk restores need the **Workspace Admin** role. See [Restore Archived Content](../10-archive/03-restore-archived-content.md).

### Does changing the default archive destination move existing archives?

No. Existing archives stay where they were written and are restored from there. Only new archives go to the new destination. See [How to Set the Default Archive Destination](../13-how-to-guides/26-set-the-default-archive-destination.md).

## Self-service provisioning

### Can business users create sites and teams themselves?

Yes, through templates. A Tenant Admin builds and publishes templates that define what gets created — SharePoint sites, Microsoft Teams, libraries, folders, channels or user accounts — and who may use them. Users raise requests from **New Request**. See [How to Request a New Site, Team or User](../13-how-to-guides/13-request-a-site-team-or-user.md).

### Can requests require approval?

Yes. Turn on **Require Approval Before Provisioning** on the template and add approvers. The first approver to decide completes the approval. See [How to Approve or Reject a Provisioning Request](../13-how-to-guides/14-approve-or-reject-a-request.md).

### What happens if provisioning fails?

The request shows **Provisioning failed**, and its **Provisioning errors** panel explains each error and what to do. A partly created site is removed automatically. Fix the cause and submit a new request. See [Error Messages: Self-Service Provisioning](../15-error-catalog/05-self-service-provisioning.md).

### How do I change a published template without disrupting users?

Start a new **Draft** version, edit it and test it with a test run; users keep requesting from the **Published** version until you publish the draft. Earlier versions stay in the template's **Version history** and can be restored as a new draft. See [Template Versions](../05-self-service/templates/template-versions.md).

### Does a test run of a draft template create real sites?

Yes. A test run provisions for real, waits for approval if the template requires it, and appears in your **Request History**. Use it to check a draft before you publish it. See [How to Test a Template Before Publishing](../13-how-to-guides/28-test-a-template-before-publishing.md).

### Can another system request sites and teams automatically?

Yes, through the **Public API**. A Tenant Admin creates an app connection under **Settings**; the other system then submits signed provisioning requests and receives the outcome through a signed callback. See [Public API](../06-settings/public-api.md).

### What happens to an account terminated through a template?

The **Terminate User** container disables the account so the user can no longer sign in, and revokes their active sign-in sessions. The account is not deleted. One request can terminate several users. See [Container — Terminate User](../05-self-service/templates/containers/terminate-user.md).

### Why can't I choose a content type for a library?

The **Select a Content Type** list offers only content types that can be used in a document library and are available in your tenant — the built-in ones and those published from your content type hub. Content types based on Document Set stay greyed out until you tick **Document Sets** under **Features & Metadata**. See [Content Types](../05-self-service/templates/containers/create-new-site.md#content-types).

## License and notifications

### How do I renew the license?

A Tenant Admin pastes the new license token from Proventeq on the **License** page and clicks **Upload license**. Proventeq365 warns from 30 days before expiry. See [How to Renew Your Proventeq365 License](../13-how-to-guides/16-renew-your-license.md).

### What happens when the license expires?

Proventeq365 can't be used until a new license is uploaded: every page redirects to the License page, and users without the Tenant Admin role are asked to contact their administrator.

### How does Proventeq365 notify people?

In the app, through the bell icon, for scans, policy runs, actions and provisioning. By email for failures, approval requests and decisions, and changes to a person's workspace access — if a notification mailbox has been set up in your tenant. See [Notification](../09-notification/README.md) and [Notification Mailbox](../12-deployment-prerequisites/07-run-post-deployment-script.md#notification-mailbox-optional).

### I lost an app connection's secret. Can I see it again?

No — the secret is shown only once. Use **Rotate secret** to get a new one; the old secret stops working straight away. See [Settings](../06-settings/README.md).

### Can I choose which notifications I get by email?

Yes. On the **Preferences** tab of your notifications, choose for each event whether you get it in the app, by email, or both. Email is offered only for failures, approvals and changes to your workspace access, and only when a notification mailbox is set up. See [How to Choose Which Notifications You Get by Email](../13-how-to-guides/29-choose-which-notifications-you-get-by-email.md).

## Related

- [How-to Guides](../13-how-to-guides/README.md)
- [Troubleshooting](../14-troubleshooting/README.md)
- [Error Catalog](../15-error-catalog/README.md)
