---
title: "How to Estimate Storage Savings"
description: "How to use the Proventeq365 Storage Optimisation overview to estimate the storage and money you could save by cleaning up ROT, trimming versions and archiving inactive sites."
type: howto
updated: 2026-10-26
---

# How to Estimate Storage Savings

The **Storage Optimisation** overview values the storage you could reclaim — redundant, obsolete and trivial (ROT) content, old file versions and inactive sites — and compares it with your tenant's storage entitlement. Use it to build the case for a clean-up: how much space each option frees, what it is worth, and whether it lowers your Microsoft 365 bill or only frees capacity.

## Before you begin

- A Microsoft 365 Governance workspace must have completed at least one data refresh. See [How to Run a Workspace Scan](./03-run-a-workspace-scan.md).
- You need a role on the workspace (**Workspace User** or higher), and your license must include the **ROT Report** feature.
- Bill impacts, headroom and the forecast need your tenant's storage entitlement, which needs the `Organization.Read.All` permission on the Proventeq365 app registration. See [Entra ID App Registration](../12-deployment-prerequisites/04-entra-app-registration.md#api-permissions).
- The **Version Clean-up** figures need version history to be collected, and the **Archive candidates** figures need the Microsoft 365 site usage report. Both are options of your Proventeq365 deployment — ask Proventeq if those cards show **Unavailable** or **Unknown**.
- Money figures use the storage price set for your deployment (by default £0.16 per GB per month). Ask Proventeq to change it if your organisation pays a different rate.

## Steps

1. Select the workspace and open **Reports** → **Storage Optimisation**.
2. Under **Tenant capacity**, check **Storage used**, **Remaining** and **Forecast exhaustion**. They tell you whether the tenant is inside its entitlement and when it is expected to run out.
3. Under **Workspace content**, read **ROT reclaimable**: the storage held by ROT content, its yearly value at list price, and how much it would cut your bill.
4. Read **Version Clean-up** for the space taken by older file versions. Do not add it to the ROT figure — the two can overlap.
5. Under **Archive candidates**, choose an **Inactivity window** (for example **3 years inactive**) and read **Inactive sites to archive** and **Potential savings**.
6. In **Current storage distribution**, read **Free after ROT cleanup** and **Free after Version Clean-up** with their **Estimated headroom** to see the space you would have after each clean-up.
7. Read **Cost of doing nothing** — what a year of growth would add to your bill — and the **Projected cost if nothing changes** chart, which shows the extra monthly spend as storage grows.
8. Use **Biggest sites & OneDrives by storage**, **Top creators by storage** and the version clean-up top lists to decide where to start.

## Result

You have an estimate of the storage each clean-up option frees and its yearly value. While the tenant is over its entitlement, the cards show the amount you would stop paying; while it is inside its entitlement, they show **No change today**, because reclaiming space frees capacity rather than reducing the bill. To act on the estimate, clean up ROT content, archive obsolete content or add a policy with the **Trim versions** action.

## Related

- [Storage Optimisation Overview](../04-reports/storage-optimization/README.md)
- [How to Find and Clean Up ROT Content](./11-find-and-clean-up-rot-content.md)
- [How to Archive Obsolete Content](./07-archive-obsolete-content.md)
- [Site Engagement](../04-reports/site-engagement/README.md)
