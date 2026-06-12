---
title: "Entra App Creation Script"
description: "An optional, end-to-end Bash script that creates the Entra ID app registration, configures the API permissions for your chosen mode, creates the service principal, and grants admin consent."
---

# Entra App Creation Script

This is an optional, complete script that creates the Entra app registration and configures it. It prompts for a display name and permission mode (Read-only or Read-write), creates the application and service principal, applies the matching API permissions, and grants admin consent.

> **Note:** This script recreates the application configuration only. It requires the Azure CLI, and you must be signed in with sufficient privileges (`Application.ReadWrite.All`, `Directory.ReadWrite.All`, and Global Administrator for admin consent). By design in Microsoft Graph, existing client secret values and certificate private keys cannot be recreated.

```bash
#!/bin/bash
# -------------------------------------------------------------------------
# Script: create-proventeq-governance-app.sh
# Purpose: Create the Entra ID (Azure AD) App Registration
#          "Proventeq Governance - Combined"
#
# Author: Proventeq
# Audience: Entra ID / Azure AD Global Admin
#
# IMPORTANT LIMITATIONS (BY DESIGN IN MICROSOFT GRAPH):
# - Existing client secret VALUES cannot be recreated
# - Certificate private keys cannot be recreated (public cert only)
# - Original key IDs are always regenerated
#
# This script recreates the APPLICATION CONFIGURATION ONLY.
# -------------------------------------------------------------------------

set -e

# -------------------------------------------------------------------------
# 1. PREREQUISITES
# -------------------------------------------------------------------------
# You must be logged in with sufficient privileges:
# - Application.ReadWrite.All
# - Directory.ReadWrite.All
# - Global Administrator (for admin-consent)
#
# Login:
#   az login
#
# Optional: Lock to correct tenant/subscription
#   az account show
# -------------------------------------------------------------------------


# -------------------------------------------------------------------------
# 2. VARIABLES (SAFE TO EDIT)
# -------------------------------------------------------------------------

read -rp "Enter App Registration display name: " APP_NAME

echo ""
echo "Select permission mode:"
echo "  1) Read-only"
echo "  2) Read-write"
read -rp "Enter choice (1 or 2): " PERM_MODE_CHOICE

case "$PERM_MODE_CHOICE" in
  1) PERM_MODE="readonly"  ;;
  2) PERM_MODE="readwrite" ;;
  *) echo "Invalid choice. Defaulting to read-only."; PERM_MODE="readonly" ;;
esac

echo "  Permission mode: $PERM_MODE"

SIGN_IN_AUDIENCE="AzureADMyOrg"

# OAuth2 scope ID (must be stable if relied upon by clients)
OAUTH_SCOPE_ID="b9e69f89-9f2f-4f3a-bcb5-e5f9b03e052e"


# -------------------------------------------------------------------------
# 3. CHECK LOGIN
# -------------------------------------------------------------------------

echo ""
echo "Checking Azure login status..."

if ! az account show > /dev/null 2>&1; then
    echo "Not logged in. Running az login..."
    az login
fi

TENANT_ID=$(az account show --query tenantId -o tsv)
USER_NAME=$(az account show --query user.name -o tsv)
SUB_NAME=$(az account show --query name -o tsv)

echo "  Logged in as : $USER_NAME"
echo "  Tenant       : $TENANT_ID"
echo "  Subscription : $SUB_NAME"


# -------------------------------------------------------------------------
# 4. CREATE APP REGISTRATION
# -------------------------------------------------------------------------
# Creates the app WITHOUT identifierUris first, then sets api://<appId>
# (custom domains like gov360.proventeq.com are not verified in external tenants)
# -------------------------------------------------------------------------

echo ""
echo "Step 1: Creating App Registration..."

BODY_FILE=$(mktemp)
cat > "$BODY_FILE" <<EOF
{
  "displayName": "$APP_NAME",
  "signInAudience": "$SIGN_IN_AUDIENCE",
  "spa": {
    "redirectUris": []
  },
  "api": {
    "oauth2PermissionScopes": [
      {
        "id": "$OAUTH_SCOPE_ID",
        "type": "Admin",
        "value": "access_as_user",
        "adminConsentDisplayName": "access_as_user",
        "adminConsentDescription": "Access the application",
        "isEnabled": true
      }
    ]
  }
}
EOF

APP_OBJECT_ID=$(az rest \
  --method POST \
  --url https://graph.microsoft.com/v1.0/applications \
  --headers Content-Type=application/json \
  --body @"$BODY_FILE" \
  --query id -o tsv)

rm -f "$BODY_FILE"

if [ -z "$APP_OBJECT_ID" ]; then
    echo "ERROR: Failed to create app registration."
    exit 1
fi

APP_ID=$(az rest \
  --method GET \
  --url "https://graph.microsoft.com/v1.0/applications/$APP_OBJECT_ID" \
  --query appId -o tsv)

echo "  App created successfully."
echo "  App Object ID : $APP_OBJECT_ID"
echo "  App Client ID : $APP_ID"

# Step 1b: Set identifierUris using api://<appId> (works in any tenant)
echo "  Setting Identifier URI..."
IDENTIFIER_URI_FINAL="api://$APP_ID"

URI_FILE=$(mktemp)
cat > "$URI_FILE" <<EOF
{
  "identifierUris": ["$IDENTIFIER_URI_FINAL"]
}
EOF

az rest \
  --method PATCH \
  --url "https://graph.microsoft.com/v1.0/applications/$APP_OBJECT_ID" \
  --headers Content-Type=application/json \
  --body @"$URI_FILE"

rm -f "$URI_FILE"

echo "  Identifier URI: $IDENTIFIER_URI_FINAL"


# -------------------------------------------------------------------------
# 5. ADD REQUIRED API PERMISSIONS
# -------------------------------------------------------------------------
# Permissions applied depend on the selected mode:
#
# READ-ONLY
#   SharePoint : Sites.Read.All, User.Read.All
#   Graph      : Chat.Read.All, Group.Read.All, Mail.Read, Mail.ReadBasic.All,
#                Sites.Read.All, Team.ReadBasic.All (delegated), User.Read.All
#
# READ-WRITE
#   SharePoint : Sites.FullControl.All, User.ReadWrite.All
#   Graph      : Chat.Create, Chat.Read.All, Directory.ReadWrite.All,
#                Group.Read.All, Group.ReadWrite.All,
#                InformationProtectionPolicy.Read.All, Mail.Read,
#                Mail.ReadBasic.All, offline_access, openid, profile,
#                RecordsManagement.Read.All, RecordsManagement.ReadWrite.All,
#                SensitivityLabels.Read.All, Sites.Archive.All,
#                Sites.Manage.All, Sites.Read.All, Sites.ReadWrite.All,
#                Team.ReadBasic.All (application), User.Read,
#                User.Read.All, User.ReadBasic.All, User.ReadWrite.All
#
# NOTE: This does NOT automatically grant admin consent.
# -------------------------------------------------------------------------

echo ""
echo "Step 2: Configuring required API permissions ($PERM_MODE)..."

PERM_FILE=$(mktemp)

if [ "$PERM_MODE" = "readonly" ]; then
cat > "$PERM_FILE" <<'EOF'
{
  "requiredResourceAccess": [
    {
      "resourceAppId": "00000003-0000-0ff1-ce00-000000000000",
      "resourceAccess": [
        { "id": "4e0d77b0-96ba-4398-af14-3baa780278f4", "type": "Role" },
        { "id": "56680e0d-d2a3-4ae1-80d8-3c4a5f90e2bf", "type": "Role" }
      ]
    },
    {
      "resourceAppId": "00000003-0000-0000-c000-000000000000",
      "resourceAccess": [
        { "id": "6b7d71aa-70aa-4810-a8d9-5d9fb2830017", "type": "Role" },
        { "id": "5b567255-7703-4780-807c-7be8301ae99b", "type": "Role" },
        { "id": "810c84a8-4a9e-49e6-bf7d-12d183f40d01", "type": "Role" },
        { "id": "693c5e45-0940-467d-9b8a-1022fb9d42ef", "type": "Role" },
        { "id": "332a536c-c7ef-4017-ab91-336970924f0d", "type": "Role" },
        { "id": "485be79e-c497-4b35-9400-0e3fa7f2a5d4", "type": "Scope" },
        { "id": "df021288-bdef-4463-88db-98f22de89214", "type": "Role" }
      ]
    }
  ]
}
EOF
else
cat > "$PERM_FILE" <<'EOF'
{
  "requiredResourceAccess": [
    {
      "resourceAppId": "00000003-0000-0ff1-ce00-000000000000",
      "resourceAccess": [
        { "id": "678536fe-1083-478a-9c59-b99265e6b0d3", "type": "Role" },
        { "id": "741f803b-c850-494e-b5df-cde7c675a1ca", "type": "Role" }
      ]
    },
    {
      "resourceAppId": "00000003-0000-0000-c000-000000000000",
      "resourceAccess": [
        { "id": "d9c48af6-9ad9-47ad-82c3-63757137b9af", "type": "Role" },
        { "id": "6b7d71aa-70aa-4810-a8d9-5d9fb2830017", "type": "Role" },
        { "id": "19dbc75e-c2e2-444c-a770-ec69d8559fc7", "type": "Role" },
        { "id": "5b567255-7703-4780-807c-7be8301ae99b", "type": "Role" },
        { "id": "62a82d76-70ea-41e2-9197-370581804d09", "type": "Role" },
        { "id": "19da66cb-0fb0-4390-b071-ebc76a349482", "type": "Role" },
        { "id": "810c84a8-4a9e-49e6-bf7d-12d183f40d01", "type": "Role" },
        { "id": "693c5e45-0940-467d-9b8a-1022fb9d42ef", "type": "Role" },
        { "id": "7427e0e9-2fba-42fe-b0c0-848c9e6a8182", "type": "Scope" },
        { "id": "37f7f235-527c-4136-accd-4a02d197296e", "type": "Scope" },
        { "id": "14dad69e-099b-42c9-810b-d002981feec1", "type": "Scope" },
        { "id": "ac3a2b8e-03a3-4da9-9ce0-cbe28bf1accd", "type": "Role" },
        { "id": "eb158f57-df43-4751-8b21-b8932adb3d34", "type": "Role" },
        { "id": "e46a01e9-b2cf-4d89-8424-bcdc6dd445ab", "type": "Role" },
        { "id": "e3530185-4080-478c-a4ab-39322704df58", "type": "Role" },
        { "id": "0c0bf378-bf22-4481-8f81-9e89a9b4960a", "type": "Role" },
        { "id": "332a536c-c7ef-4017-ab91-336970924f0d", "type": "Role" },
        { "id": "9492366f-7969-46a4-8d15-ed1a20078fff", "type": "Role" },
        { "id": "2280dda6-0bfd-44ee-a2f4-cb867cfc4c1e", "type": "Role" },
        { "id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d", "type": "Scope" },
        { "id": "df021288-bdef-4463-88db-98f22de89214", "type": "Role" },
        { "id": "97235f07-e226-4f63-ace3-39588e11d3a1", "type": "Role" },
        { "id": "741f803b-c850-494e-b5df-cde7c675a1ca", "type": "Role" }
      ]
    }
  ]
}
EOF
fi

az rest \
  --method PATCH \
  --url "https://graph.microsoft.com/v1.0/applications/$APP_OBJECT_ID" \
  --headers Content-Type=application/json \
  --body @"$PERM_FILE"

rm -f "$PERM_FILE"

echo "  API permissions configured."

# -------------------------------------------------------------------------
# 6. CREATE SERVICE PRINCIPAL
# -------------------------------------------------------------------------
# Required for:
# - API permission grants
# - Enterprise Applications view
# -------------------------------------------------------------------------

echo ""
echo "Step 3: Creating Service Principal..."

SP_FILE=$(mktemp)
cat > "$SP_FILE" <<EOF
{
  "appId": "$APP_ID"
}
EOF

az rest \
  --method POST \
  --url https://graph.microsoft.com/v1.0/servicePrincipals \
  --headers Content-Type=application/json \
  --body @"$SP_FILE"

rm -f "$SP_FILE"

echo "  Service Principal created."


# -------------------------------------------------------------------------
# 7. ADMIN CONSENT (OPTIONAL BUT RECOMMENDED)
# -------------------------------------------------------------------------
# Grants consent for all delegated/application permissions
# Requires Global Admin
# -------------------------------------------------------------------------

echo ""
echo "Step 4: Granting admin consent..."
az ad app permission admin-consent --id "$APP_ID"
echo "  Admin consent granted."


# -------------------------------------------------------------------------
# 8. CREDENTIALS (MANUAL / OPTIONAL)
# -------------------------------------------------------------------------
# Client secrets and certificates must be created separately.
#
# Example - CREATE A NEW CLIENT SECRET:
#
# az ad app credential reset \
#   --id $APP_OBJECT_ID \
#   --display-name "Prod Env" \
#   --years 1
#
# Example - ADD CERTIFICATE (PUBLIC KEY ONLY):
#
# az ad app credential reset \
#   --id $APP_OBJECT_ID \
#   --cert @proventeq365.cer \
#   --append
#
# -------------------------------------------------------------------------


# -------------------------------------------------------------------------
# 9. FINAL OUTPUT
# -------------------------------------------------------------------------

echo ""
echo "---------------------------------------------------"
echo "App Registration Complete"
echo "Display Name   : $APP_NAME"
echo "App (client) ID: $APP_ID"
echo "Object ID      : $APP_OBJECT_ID"
echo "Identifier URI : $IDENTIFIER_URI_FINAL"
echo "---------------------------------------------------"
```
