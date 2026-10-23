---
title: "Custom Domain and DNS"
description: "Only applicable if Proventeq365 will use a custom domain name — confirm the domain, DNS ownership, and CNAME approval process, and pass the domain to the deployment scripts."
---

# Custom Domain and DNS (if applicable)

This section applies only if Proventeq365 will use a custom domain name instead of the default Azure Front Door hostname.

1. Confirm the **custom domain name** to be used for Proventeq365 (e.g. `proventeq365.yourdomain.com`).
2. Identify who manages DNS for this domain within your organization.
3. Confirm the process and approval steps for adding CNAME records — Proventeq will provide the specific values required during deployment.

Share this information with your Proventeq contact before the deployment date.

## Using the custom domain in the scripts

The custom domain must be registered as the app registration's redirect URI, otherwise users cannot sign in on it. Either:

- pass it to the prerequisites script with `-FrontendUrl` if you know it before deployment (see [Scenario E](./05-run-prerequisites-script.md#scenario-e--custom-domain-already-known)), or
- once the domain is mapped, run the post-deployment script with `-CustomUrl` (see [Scenario 3](./07-run-post-deployment-script.md#scenario-3--custom-domain-already-mapped)).
