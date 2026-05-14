---
title: "Predefined Policies"
description: "List of predefined governance policies available in Proventeq365, their rule inputs, and the actions they can take."
---

# Predefined Policies

Below is the list of predefined policies. Each entry shows the policy name, the inputs available for rule configuration, and the action that the policy can take when it matches.

| Policy | Input for Rule configuration | Expected Action |
| --- | --- | --- |
| Guest Access Governance Policy | Text box — list of labels | Remove Permissions (Manual or Automated) |
| Site Sensitivity Label Drift Policy | Text box — site collection name match condition. Dropdown — list of site-level sensitivity labels | NO ACTIONS |
| Missing Retention Labels Policy | — | NO ACTIONS |
| Empty Folder Cleanup Policy | — | Remove Empty Folders (Manual or Automated) |
| Obsolete Content Policy | Uses the Obsolete detection rule defined on the Configuration screen | Archive (Manual or Automated) |
| Maximum Owners Policy | Text box — default value `6` | NO ACTIONS |
| Privileged Access Review Policy | — | Remove Permissions (Manual or Automated) |
| Minimum Owners Policy | Text box — minimum number of owners added to site | NO ACTIONS |
| Library Volume Policy | Text box — threshold volume. Dropdown — Compare mode (`<`, `>`) | NO ACTIONS |
| Excessive Sharing Policy | Multi-select with sharing types: Everyone, Anonymous, External | Remove Permissions (Manual or Automated) |
| Large File Policy | Text box — threshold (MB). Dropdown — Compare mode (`<`, `>`) | Remove File (Manual or Automated) |
| Library Retention Label Drift Policy | — | Reinforce label (Manual or Automated) |
| Library Sensitivity Label Drift Policy | — | Reinforce label (Manual or Automated) |
| Site Volume Policy | Text box — threshold (MB). Dropdown — Compare mode (`<`, `>`) | NO ACTIONS |
| Inactive Sites Policy | Text box — stale days | NO ACTIONS |
| External Sharing Policy | Dropdown — list of file/folder-level sensitivity labels | Remove Permissions (Manual or Automated) |
| Too Many Members Policy | Text box — threshold limit of members | NO ACTIONS |
| Duplicate Content Across Containers Policy | — | NO ACTIONS |
| High Storage Usage Policy | Text box — threshold (GB). Dropdown — Compare mode (`<`, `>`) | NO ACTIONS |
| Orphaned Sites Policy | — | NO ACTIONS |
| Missing Sensitivity Labels Policy | — | NO ACTIONS |

Return to the [Add Policy section](../02-manage/workspaces/README.md#add-policy) of the Workspaces wizard.
