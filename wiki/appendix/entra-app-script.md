---
title: "Entra App Creation Script"
description: "An optional Bash script that creates the Proventeq365 Entra ID app registration, sets the Application ID URI and access_as_user scope, applies the Read-write API permission set, and grants admin consent."
---

# Entra App Creation Script

This is an optional, complete script that creates the Entra app registration and configures it. It prompts for a display name, creates the application and service principal, sets the Application ID URI and the `access_as_user` scope, applies the API permissions, and grants admin consent.

> **This script has been rewritten.** The previously published version hardcoded Microsoft Graph and SharePoint permission GUIDs and had already drifted from the permission tables — it omitted `AuditLog.Read.All`, which those tables list as required. This version resolves every permission ID by name from the service principals at run time, which removes the risk of a stale GUID.

> **Important:**
> - The script applies the **Read-write** set only. If you are deploying in **Read-only** mode, do not run it — follow the portal steps and apply the [Read-only permission tables](../12-deployment-prerequisites/04-entra-app-registration.md#read-only-mode-permissions) instead.
> - Run it in **bash** (Azure Cloud Shell, WSL or Git Bash); the commands do not work in `cmd.exe` or PowerShell.
> - The permission **names** are still a list held in the script, so the script and the [permission tables](../12-deployment-prerequisites/04-entra-app-registration.md#grant-api-permissions) must be kept in step by hand.
> - It also creates the Application ID URI and the `access_as_user` scope described in [Set the Application ID URI](../12-deployment-prerequisites/04-entra-app-registration.md#set-the-application-id-uri) and [Add the access_as_user Scope](../12-deployment-prerequisites/04-entra-app-registration.md#add-the-access_as_user-scope).
> - The script does **not** create the client secret. Create it separately and share it through your approved secure channel.

```bash
#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Script:  create-proventeq365-app.sh
# Purpose: Create the Proventeq365 Entra ID app registration, set the
#          Application ID URI and the access_as_user scope, apply the
#          READ-WRITE API permission set, and grant admin consent.
#
# READ-WRITE ONLY. For a Read-only deployment, follow the portal steps
# instead and apply the Read-only permission tables.
#
# Run in bash: Azure Cloud Shell (Bash), WSL, or Git Bash.
# Does NOT work in cmd.exe or PowerShell.
#
# Requirements:
#   - Azure CLI, signed in (az login)
#   - Adding permissions: Application Administrator or higher
#   - Granting consent:   Privileged Role Administrator or Global Administrator
#
# NOT created by this script: the client secret. Create it separately and
# share it through your approved secure channel.
# ---------------------------------------------------------------------------

set -euo pipefail

GRAPH=00000003-0000-0000-c000-000000000000
SPO=00000003-0000-0ff1-ce00-000000000000

# Permission NAMES are resolved to IDs at run time. Keep this list in step with
# the permission tables by hand - name resolution prevents a stale GUID, not a
# stale list.
GRAPH_APP_PERMS="AuditLog.Read.All Directory.Read.All Group.Read.All \
Group.ReadWrite.All InformationProtectionPolicy.Read.All Mail.Read \
Mail.ReadBasic.All Organization.Read.All RecordsManagement.Read.All \
RecordsManagement.ReadWrite.All Reports.Read.All SensitivityLabels.Read.All \
Sites.Archive.All Sites.FullControl.All Sites.Manage.All Sites.Read.All \
Sites.ReadWrite.All Team.ReadBasic.All User.Read.All User.ReadBasic.All \
User.ReadWrite.All"

GRAPH_DELEGATED="openid profile offline_access User.Read"

SPO_APP_PERMS="Sites.FullControl.All User.ReadWrite.All"

# Confirm the target tenant before anything is created.
az account show --query "{tenant:tenantId, signedInAs:user.name}" -o table
read -rp "Create the app registration in this tenant? [y/N] " CONFIRM
case "$CONFIRM" in y|Y) ;; *) echo "Aborted."; exit 1 ;; esac

read -rp "App registration display name: " APP_NAME
[ -n "$APP_NAME" ] || { echo "A display name is required." >&2; exit 1; }

# Entra allows several apps with the same name; refuse to create a duplicate.
EXISTING=$(az ad app list --display-name "$APP_NAME" --query "[0].appId" -o tsv | tr -d '\r')
[ -z "$EXISTING" ] || { echo "An app named '$APP_NAME' already exists (appId $EXISTING). Aborting." >&2; exit 1; }

# Generate the scope id up front so a failure here cannot orphan a created app.
SCOPE_ID=$(uuidgen 2>/dev/null \
  || cat /proc/sys/kernel/random/uuid 2>/dev/null \
  || powershell -NoProfile -Command '[guid]::NewGuid().ToString()' 2>/dev/null | tr -d '\r')
[ -n "$SCOPE_ID" ] || { echo "Cannot generate a GUID for the scope id." >&2; exit 1; }

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

echo "Resolving permission IDs from the service principals..."
# tr -d '\r': the Azure CLI emits CRLF on Windows, which corrupts every value.
az ad sp show --id "$GRAPH" --query "appRoles[].[value,id]"               -o tsv | tr -d '\r' > "$WORK/graph_roles.tsv"
az ad sp show --id "$GRAPH" --query "oauth2PermissionScopes[].[value,id]" -o tsv | tr -d '\r' > "$WORK/graph_scopes.tsv"
az ad sp show --id "$SPO"   --query "appRoles[].[value,id]"               -o tsv | tr -d '\r' > "$WORK/spo_roles.tsv"

lookup() {
  local id
  id=$(awk -F'\t' -v v="$1" '$1==v{print $2; exit}' "$2")
  [ -n "$id" ] || { echo "ERROR: permission '$1' not found in $2" >&2; return 1; }
  printf '%s' "$id"
}

build() {   # build <names> <file> <Role|Scope>
  local out="" name id
  for name in $1; do
    id=$(lookup "$name" "$2") || return 1
    out="$out{\"id\":\"$id\",\"type\":\"$3\"},"
  done
  printf '%s' "${out%,}"
}

# Assign separately. In a combined assignment bash reports only the status of
# the LAST substitution, so a failure in the first would go unnoticed and would
# produce invalid JSON.
GRAPH_ROLES=$(build "$GRAPH_APP_PERMS" "$WORK/graph_roles.tsv" Role)
GRAPH_SCOPES=$(build "$GRAPH_DELEGATED" "$WORK/graph_scopes.tsv" Scope)
SPO_ACCESS=$(build "$SPO_APP_PERMS" "$WORK/spo_roles.tsv" Role)
GRAPH_ACCESS="$GRAPH_ROLES,$GRAPH_SCOPES"

echo "Creating the app registration..."
read -r APP_OBJECT_ID APP_ID <<<"$(az ad app create --display-name "$APP_NAME" \
  --sign-in-audience AzureADMyOrg --query "[id,appId]" -o tsv | tr -d '\r')"

echo "Setting the Application ID URI, the access_as_user scope and the permissions..."
cat > "$WORK/app.json" <<EOF
{
  "identifierUris": ["api://$APP_ID"],
  "api": {
    "requestedAccessTokenVersion": 2,
    "oauth2PermissionScopes": [{
      "id": "$SCOPE_ID",
      "value": "access_as_user",
      "type": "User",
      "isEnabled": true,
      "adminConsentDisplayName": "Access Proventeq365 as the signed-in user",
      "adminConsentDescription": "Allows the Proventeq365 application to call the Proventeq365 API on behalf of the signed-in user.",
      "userConsentDisplayName": "Access Proventeq365 on your behalf",
      "userConsentDescription": "Allows the Proventeq365 application to call the Proventeq365 API as you."
    }]
  },
  "spa": { "redirectUris": [] },
  "requiredResourceAccess": [
    { "resourceAppId": "$GRAPH", "resourceAccess": [$GRAPH_ACCESS] },
    { "resourceAppId": "$SPO",   "resourceAccess": [$SPO_ACCESS] }
  ]
}
EOF

az rest --method PATCH \
  --url "https://graph.microsoft.com/v1.0/applications/$APP_OBJECT_ID" \
  --headers "Content-Type=application/json" \
  --body @"$WORK/app.json"

echo "Creating the service principal..."
if ! SP_ERR=$(az ad sp create --id "$APP_ID" 2>&1 >/dev/null); then
  case "$SP_ERR" in
    *already*exist*|*same*value*) echo "  (service principal already exists)" ;;
    *) echo "ERROR creating the service principal: $SP_ERR" >&2; exit 1 ;;
  esac
fi

# Print the handover values BEFORE consent. Consent needs elevated rights and
# often fails; these are the values you are asked to send to Proventeq.
TENANT_ID=$(az account show --query tenantId -o tsv | tr -d '\r')
echo ""
echo "----------------------------------------------------------"
echo "App registration created"
echo "Display name            : $APP_NAME"
echo "Application (client) ID : $APP_ID"
echo "Directory (tenant) ID   : $TENANT_ID"
echo "Object ID               : $APP_OBJECT_ID"
echo "Application ID URI      : api://$APP_ID"
echo "Scope                   : api://$APP_ID/access_as_user"
echo "----------------------------------------------------------"
echo "STILL REQUIRED: create a client secret and share it securely."
echo ""

echo "Granting admin consent..."
echo "  Requires Privileged Role Administrator or Global Administrator."
az ad app permission admin-consent --id "$APP_ID" \
  || echo "WARNING: admin consent failed. Grant it in the portal: App registrations > API permissions > Grant admin consent."
```
