---
title: "How to Approve or Reject a Provisioning Request"
description: "How approvers review, approve or reject Proventeq365 self-service provisioning requests before sites, teams or users are created."
type: howto
updated: 2026-10-26
---

# How to Approve or Reject a Provisioning Request

When a template has **Require Approval Before Provisioning** turned on, every request made from it waits for an approver. Approvers find these requests under **Self Service** → **Approvals**, review the requested values, and **approve** (provisioning starts) or **reject** (nothing is created).

## Before you begin

- You must be one of the approvers named on the template.

## Steps

1. Open **Self Service** → **Approvals**. The list shows the requests waiting for your decision, with the status **Awaiting approval**.
2. Click **Review** on the request.
3. Check the template, the requester's name and email, and every user input value.
4. Click **Approve** and confirm to start provisioning, or click **Reject** and confirm to stop the request.

## Result

After approval, the message *Request approved.* appears and provisioning starts; the requester can follow it in **Request History**. After rejection, the message *Request rejected.* appears and nothing is provisioned.

## Related

- [Approvals](../05-self-service/approvals/README.md)
- [How to Create a Provisioning Template](./12-create-a-provisioning-template.md)
