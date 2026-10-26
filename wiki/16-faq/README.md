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

## Access and roles

### How do users sign in?

With their Microsoft 365 work account, through Microsoft Entra ID. There are no separate Proventeq365 passwords.

### What roles are there?

- **Tenant Admin** — manages everything: creates workspaces and policies, and manages connections, templates, the license, the audit log and settings.
- **Workspace Admin** — on a workspace: edits it (except its scope), runs data refreshes and policies, and starts actions such as removing permissions or archiving.
- **Workspace User** — on a workspace: views its dashboard, reports and policy results.

Any licensed user can raise self-service requests from the templates available to them, and template approvers decide requests. See [How to Give Users Access to a Workspace](../13-how-to-guides/04-give-users-access-to-a-workspace.md).

### Why can't a colleague see a workspace?

People see only the workspaces they have a role on. Add them on the workspace's **Users** step. See [How to Give Users Access to a Workspace](../13-how-to-guides/04-give-users-access-to-a-workspace.md).

## Workspaces and scans

### How often is the data refreshed?

On the workspace's schedule: once, or recurring daily, weekly or monthly at the times you choose. Workspace Admins can also start a refresh with **Refresh data**. See [How to Run a Workspace Scan](../13-how-to-guides/03-run-a-workspace-scan.md).

### How long does the first scan take?

It depends on the number of sites and files in scope. The first refresh is a full scan and takes longest; later refreshes are incremental and read only what has changed. Reports fill with data once the first refresh has completed.

### Why is my dashboard empty?

The workspace's first data refresh hasn't finished yet, or it failed. Check **View runs** on the workspace. See [Troubleshooting — Workspaces and data refresh](../14-troubleshooting/README.md#workspaces-and-data-refresh).

### Can I change which sites a workspace scans?

Not after it has been created — the scope is fixed for security reasons. Create a new workspace for a different set of sites. Other settings, such as the schedule, the ROT rules, the policies and the users, can be changed.

### Can I add many sites at once?

Yes. Choose **Import CSV file** on the **Sources** step and upload a CSV file with the sites, or choose **Select all sites** and optionally limit it with URL patterns. See [Workspaces — Import CSV File](../02-manage/workspaces/README.md#import-csv-file).

### Does Proventeq365 scan OneDrive?

Yes. With **Select all sites**, turn on **Include One Drives**; with a manual list or CSV, add the OneDrive addresses under `/personal/`.

## Policies

### What governance policies are available?

More than twenty predefined rules covering permissions and access, content lifecycle, and information protection — for example Excessive Sharing, Guest Access Governance, Large File, Obsolete Content, Inactive Sites and the sensitivity and retention label drift policies. See [Predefined Policies](../appendix/predefined-policies.md).

### When do policies run?

Every enabled policy is evaluated at the end of each workspace data refresh. A Workspace Admin can also run a single policy at any time with **Run Policy**. Policies have no schedule of their own.

### What is the difference between manual and automatic actions?

An **automatic** action runs on every item the policy matches as soon as the policy runs. A **manual** action waits until a Workspace Admin reviews the policy report and clicks **Execute on All Items** or **Execute on Selection**. Automatic actions can't be undone, so start with manual actions until you trust a policy's results. See [How to Add a Governance Policy](../13-how-to-guides/05-add-a-governance-policy.md).

## Archiving

### Where are archived files stored?

In storage you own and connect to Proventeq365: **Wasabi** object storage or **Azure Blob Storage**. See [How to Add an Archive Connection](../13-how-to-guides/06-add-an-archive-connection.md).

### What happens to a file in SharePoint when it is archived?

With **Replace with Stub**, the file is replaced in place by a stub link with the same address, so existing links keep working. The file's content and version history are removed from SharePoint — they are not kept in the recycle bin. Without a stub, the original file is deleted after it is archived. See [How to Archive Obsolete Content](../13-how-to-guides/07-archive-obsolete-content.md).

### Can users still get to archived files?

Yes. Anyone who can open the stub link in SharePoint can download the current or an earlier version, preview media files, or restore the file to its original place. See [How to Restore an Archived File](../13-how-to-guides/08-restore-an-archived-file.md).

### Are file versions archived?

Yes. By default every version is archived, including minor (draft) versions. You can limit it to the last N versions, or the versions from the last N months; the current version is always archived.

### Can archived files be restored?

Yes — one file at a time from its stub link, or in bulk by a Workspace Admin. A restore puts the file and its versions back in the original location and removes it from the archive.

## Self-service provisioning

### Can business users create sites and teams themselves?

Yes, through templates. A Tenant Admin builds and publishes templates that define what gets created — SharePoint sites, Microsoft Teams, libraries, folders, channels or user accounts — and who may use them. Users raise requests from **New Request**. See [How to Request a New Site, Team or User](../13-how-to-guides/13-request-a-site-team-or-user.md).

### Can requests require approval?

Yes. Turn on **Require Approval Before Provisioning** on the template and add approvers. The first approver to decide completes the approval. See [How to Approve or Reject a Provisioning Request](../13-how-to-guides/14-approve-or-reject-a-request.md).

### What happens if provisioning fails?

The request shows **Provisioning failed**, and its **Provisioning errors** panel explains each error and what to do. A partly created site is removed automatically. Fix the cause and submit a new request. See [Error Messages: Self-Service Provisioning](../15-error-catalog/05-self-service-provisioning.md).

## License and notifications

### How do I renew the license?

A Tenant Admin pastes the new license token from Proventeq on the **License** page and clicks **Upload license**. Proventeq365 warns from 30 days before expiry. See [How to Renew Your Proventeq365 License](../13-how-to-guides/16-renew-your-license.md).

### What happens when the license expires?

Proventeq365 can't be used until a new license is uploaded: every page redirects to the License page, and users without the Tenant Admin role are asked to contact their administrator.

### How does Proventeq365 notify people?

In the app, through the bell icon, for scans, policy runs, actions and provisioning. By email for failures, approval requests and decisions, and changes to a person's workspace access — if a notification mailbox has been set up in your tenant. See [Notification](../09-notification/README.md) and [Notification Mailbox](../12-deployment-prerequisites/07-run-post-deployment-script.md#notification-mailbox-optional).

## Related

- [How-to Guides](../13-how-to-guides/README.md)
- [Troubleshooting](../14-troubleshooting/README.md)
- [Error Catalog](../15-error-catalog/README.md)
