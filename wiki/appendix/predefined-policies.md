---
title: "Predefined Policies"
description: "Every predefined Proventeq365 policy rule by category, with its inputs and the actions it can run, such as removing permissions, archiving or trimming versions."
type: article
updated: 2026-10-26
---

# Predefined Policies

Proventeq365 comes with a set of predefined policy rules. When you create a policy you pick one of these rules, fill in its inputs, and choose which of its actions to use. A rule with no actions is **report-only**: it lists the matching items in the policy report but does not change anything.

Each action you add to a policy runs either **Manual** (you start it from the policy report) or **Automatic** (it runs on every matching item each time the policy runs). See [Policies](../02-manage/policies/README.md).

## Permissions and access control

| Policy rule | What it finds | Inputs | Available actions |
| --- | --- | --- | --- |
| **Excessive Sharing Policy** | Folders and documents shared with Everyone, through anonymous links, or broadly with external users. | **Sharing Type** — one or more of `Everyone`, `Anonymous` and `External`, separated by commas. | Remove Permissions |
| **Privileged Access Review Policy** | Sites and libraries where users who are not owners have elevated permissions, such as Full Control. | — | Remove Permissions |
| **Guest Access Governance Policy** | External users who have access to content carrying one of the sensitivity labels you list. | **Labels** — the sensitivity label names to check, separated by commas. | Remove Permissions |
| **Too Many Members Policy** | Sites whose member count is above a threshold. | **Threshold** — the maximum number of members. | — |
| **Items With Sharing Links Policy** | SharePoint items that have one or more sharing links. The report lists each item with its links and the users of each link. | — | Remove Sharing Links |

## ROT and lifecycle

| Policy rule | What it finds | Inputs | Available actions |
| --- | --- | --- | --- |
| **Duplicate Content Across Containers Policy** | Duplicate files across libraries and sites, based on identical content. | — | Remove Duplicate Content |
| **Empty Folder Cleanup Policy** | Folders with no documents, or with only empty folders. | — | Remove Empty Folders |
| **Large File Policy** | Files larger than a size threshold. | **Threshold (MB)** — the size limit in megabytes. | Remove File |
| **Excessive Versions Policy** | Documents with more versions than a limit, counting the current version. Finds nothing unless version discovery is turned on for your deployment. | **Maximum Versions** — documents with more versions than this are flagged. | Archive, Trim versions |
| **Orphaned Sites Policy** | Sites with no active owners. | — | — |
| **Minimum Owners Policy** | Sites with fewer owners than required. | **Minimum Owners** | — |
| **Maximum Owners Policy** | Sites with more owners than allowed. | **Maximum Owners** — default `6`. | — |
| **Library Volume Policy** | Libraries with more or fewer documents than a threshold. | **Threshold** — a compare mode (**Equal to**, **Greater than**, **Less than** or **Not equal to**) and a document count. | — |
| **Site Volume Policy** | Sites with more or fewer documents than a threshold. | **Threshold** — a compare mode and a document count. | — |
| **High Storage Usage Policy** | Sites whose storage has reached a threshold. | **Threshold (GB)** — the size limit in gigabytes. | — |
| **Inactive Sites Policy** | Sites with no document activity for a number of days, or sites older than that with empty document libraries. | **Stale Days** — the number of days. | M365 Archive |
| **Obsolete Content Policy** | Documents that count as obsolete under the workspace's **Obsolete detection** settings (age in months and file extensions). | — (set on the workspace's [Analysis Configuration](../02-manage/workspaces/README.md#analysis-configuration) step) | Archive, M365 Archive |
| **Inactive OneDrives** | OneDrives whose owner cannot be found in Entra ID or is disabled. | — | Archive, M365 Archive |
| **Searchable Documents Policy** | Scanned documents and images that may have no searchable text: `.pdf`, `.tif`, `.tiff`, `.jpg`, `.jpeg`, `.png` and `.bmp` files. | **Excluded Creators** — optional. Display names of accounts whose documents are left out of the report. Press Enter after each name. | OCR Enrichment |

## Information protection

| Policy rule | What it finds | Inputs | Available actions |
| --- | --- | --- | --- |
| **Site Sensitivity Label Drift Policy** | Documents whose sensitivity label differs from the label of their site. | **Sensitivity Label** — the site label to check. **Site Match Condition** — the names of the sites to check, separated by commas. | — |
| **Library Sensitivity Label Drift Policy** | Documents whose sensitivity label differs from the library's default sensitivity label. | — | — |
| **External Sharing Policy** | Documents with a given sensitivity label that are shared externally. | **Sensitivity Label** — the label to check, for example *Highly Confidential*. | Remove Permissions |
| **Library Retention Label Drift Policy** | Documents whose retention label is missing or differs from the library's default retention label. | — | Reinforce Label |
| **Missing Sensitivity Labels Policy** | Sites or libraries without a sensitivity label. | — | — |
| **Missing Retention Labels Policy** | Documents without a retention label. | — | — |

Each item in a policy report shows why it matched, for example *File is larger than 812 MB which exceeds the threshold of 500 MB*.

## Actions

| Action | What it changes | Can it be undone? | Prerequisites and notes |
| --- | --- | --- | --- |
| **Remove Permissions** | Removes the access that the report row names: a direct permission granted to a user or group (only the permission level named, such as *Edit*), or a sharing link. For a link shared with specific people, only the named recipient is removed from the link. Inherited access and access through group membership are not changed — those rows are **skipped**. | No. Proventeq365 does not re-grant removed access; it would have to be granted again in SharePoint. | — |
| **Remove Sharing Links** | Deletes the sharing links listed in the report. A link inherited from a parent item is not removed. | No. A deleted link cannot be restored from Proventeq365. | — |
| **Remove Duplicate Content** | Deletes the duplicate copies. The original — the earliest-created copy of identical content — is never in the report and is kept. | Yes, from the SharePoint recycle bin, while the item is still there. | — |
| **Remove File** | Deletes the files in the report. | Yes, from the SharePoint recycle bin. | — |
| **Remove Empty Folders** | Deletes the empty folders in the report. | Yes, from the SharePoint recycle bin. | — |
| **Archive** | Copies each file, with the versions you choose, to your Wasabi or Azure Blob Storage container and removes it from SharePoint. With **Replace with Stub**, a stub link replaces the file at the same address. Files already archived are skipped. | Yes. Restore archived items from the policy report, from the stub, or from the archived-item page. | An archive connection and container. See [How to Add an Archive Connection](../13-how-to-guides/06-add-an-archive-connection.md) and [Proventeq365 Archiving](../10-archive/01-proventeq365-archiving.md). |
| **M365 Archive** | Moves content into Microsoft 365 Archive, Microsoft's low-cost storage tier, in your own tenant. Files are archived one by one; for the **Inactive Sites Policy** and **Inactive OneDrives**, the whole site or OneDrive is archived. Content already archived is skipped. | Only in Microsoft 365, by reactivating the content. Proventeq365 does not reactivate it. | Microsoft 365 Archive set up in your Microsoft 365 tenant. See [Microsoft 365 Archive](../10-archive/02-microsoft-365-archive.md). |
| **Trim versions** | Permanently deletes a document's older versions, keeping either the last N versions or the versions from the last N months. The current version is always kept. Checked-out files are not changed and are reported as errors. | No. Deleted versions do not go to the recycle bin and cannot be restored. | Only on the **Excessive Versions Policy**, which needs version discovery. Set exactly one of **Keep last N versions** or **Keep versions from the last N months**. |
| **Reinforce Label** | Sets each reported document's retention label to the library's default retention label. Documents that already have that label are skipped. | No. The previous label is shown in the policy report but is not put back automatically. | — |
| **OCR Enrichment** | Extracts text from scanned documents and images. Text from images is written to the **OCR Text Column** you name; scanned PDFs are replaced with a searchable PDF. The document's created and modified dates and authors are kept. Digitally signed PDFs are skipped and left unchanged. | No. | Available only when Azure AI Document Intelligence is included in your deployment — ask Proventeq. **OCR Text Column** is the internal name of a multi-line text column with unlimited length, in each library that holds images. |

> **Important:** Automatic actions run on every matching item each time the policy runs, in the background. Use **Manual** first, review the policy report, and switch to **Automatic** only when you trust the results — or turn on **Requires approval**. See [Policy Approvals](../02-manage/policies/policy-approvals.md).

## Custom rules

If none of the predefined rules fits, a Tenant Admin can create a workspace-specific rule with the AI rule assistant. See [Policy Rules](../02-manage/policy-rules/README.md).

Return to the [Governance Policies section](../02-manage/workspaces/README.md#governance-policies) of the Workspaces wizard.
