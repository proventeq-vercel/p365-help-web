---
title: "How to Review the Audit Log"
description: "How to find who did what in Proventeq365 — filter the audit log by user, date, action type and entity type, and inspect an entry's raw payload."
type: howto
updated: 2026-10-26
---

# How to Review the Audit Log

The **Audit Log** records user and system activity in Proventeq365 — for example workspace creation, policy execution and archiving — newest first. Filter it by user, date, action type or entity type, then open an entry's details to see the full message and the raw payload.

## Before you begin

- You need the **Tenant Admin** role.

## Steps

1. Open **Audit log** in the menu.
2. Filter the log on the **User**, **Date**, **Action Type** (for example *Create*, *Complete*, *Archive*) or **Entity Type** (for example *Workspace*, *Policy*, *Archive*) column.
3. Click **Details** on an entry to open the **Audit Details** panel.
4. Review the **Message**, and note the **Audit ID** and **Payload ID** if you need to reference the event, for example in a support request.
5. Check **Payload Details** for the raw JSON data captured when the action took place.

## Result

You can see who performed an action, when, on which object, and with which data.

## Related

- [Audit Log](../07-audit-log/README.md)
