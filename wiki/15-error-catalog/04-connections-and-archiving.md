---
title: "Error Messages: Connections, Archiving and Restore"
description: "What Proventeq365 archive connection, archiving and restore error messages mean and how to fix them — including “Connection validation failed”, “Failed to delete connection”, “Access denied - you do not have permission to download this item” and restore failures."
type: reference
updated: 2026-10-26
---

# Error Messages: Connections, Archiving and Restore

Messages you may see when adding an archive connection (Wasabi or Azure Blob Storage), archiving content, or opening and restoring an archived file.

## Connections

### Connection validation failed. Please verify the connection details and try again.

**Where:** after **Save and Continue** when adding or editing a connection.
**Cause:** Proventeq365 could not connect to the storage with the details you entered.
**Fix:**
- **Wasabi:** check the **Access Key**, **Secret Key** and **Region**, and that the key has access to the bucket. If outbound traffic is restricted, allow `*.wasabisys.com`.
- **Azure Blob Storage:** use the storage account's connection string from **Access keys**, including the account key. Check that shared-key access is allowed on the storage account and that its firewall allows the Proventeq365 deployment.

### This connection string carries a shared access signature (SAS); the server refuses it.

**Fix:** Use the account-key connection string from the storage account's **Access keys** page, not a SAS connection string.

### Key based authentication is not permitted on this storage account. / The storage account rejected the key.

**Where:** when adding an Azure Blob Storage connection.
**Fix:** Allow **storage account key access** on the storage account in the Azure portal, or copy the current key's connection string again.

### A connection with this name already exists

**Fix:** Connection names must be unique. Choose a different **Display Name**.

### Display name is required / Storage system is required / This field is required

**Fix:** Fill in every field marked as required.

### Please enter the actual value — masked values cannot be saved

**Where:** editing a connection.
**Fix:** Secrets are shown masked. To change a secret, clear the field and type the new value; to keep it, leave the field blank.

### Could not validate against the stored connection. Please re-enter secret fields and try again.

**Fix:** Re-enter the secret fields (keys or connection string) and save again.

### Failed to discover containers

**Where:** containers step of a connection.
**Cause:** the buckets or containers could not be listed — usually wrong credentials or missing permissions on the storage.
**Fix:** Check the credentials and the key's permissions, then click **Refresh**.

### Failed to delete connection / Failed to remove container

**Cause:** the most common reason is that archived files still use the connection or container — their stub links point to it — or that it is the default archive destination.
**Fix:** Keep the connection while archived content depends on it. To stop using it for new archives, choose a different target in your archive policies.

## Archiving

### Archiving is not configured. Please set up an archive connection in Archiving Connections.

**Fix:** Add an archive connection and select its container. See [How to Add an Archive Connection](../13-how-to-guides/06-add-an-archive-connection.md).

### No default archive target is configured. Please configure one in Archiving Connections.

**Fix:** Complete the archive connection setup, including the container, then try again.

### Failed to archive the selected documents. Please try again.

**Fix:** Try again. If it keeps failing, check that the archive connection still validates.

### … is a folder or library and cannot be archived from this report

**Cause:** folders and libraries are not archived themselves; their documents are.
**Fix:** Select the documents to archive.

### A restore or archive of item … is already in progress; nothing was changed.

**Where:** **Items** tab of an archive execution.
**Fix:** Wait for the other operation to finish, then run the action again for that item.

### Item … was not replaced: archive check … failed

**Where:** **Items** tab of an archive execution.
**Cause:** after writing the file to the archive, Proventeq365 read it back to verify it and the check failed, so the SharePoint file was **left untouched**.
**Fix:** Run the archive again for the item. If it repeats, check the archive storage and contact Proventeq support.

### … its archive has been kept and needs manual review.

**Where:** **Items** tab of an archive or restore execution.
**Cause:** the archive copy is safe, but Proventeq365 could not confirm the state of the SharePoint item.
**Fix:** Do not delete the archive. Contact Proventeq support with the item details shown in the message.

### … was refused by Azure Storage

**Where:** **Items** tab of an archive execution.
**Fix:** Check the storage account's keys, firewall settings and permissions, then run the archive again.

### Unexpected error: …

**Where:** **Items** tab of an execution.
**Cause:** an error returned by SharePoint, Microsoft Graph or the archive storage; the text after the colon is that service's message.
**Fix:** Act on the service message. Select **Full error** for the complete text, and contact Proventeq support if it isn't clear.

## Opening and restoring archived files

### Access denied - you do not have permission to download this item

**Where:** archived file page opened from a stub link.
**Cause:** you don't have permission to open the stub link in SharePoint, or — if the stub no longer exists — you have no role on the workspace the file belongs to.
**Fix:** Ask the owner of the SharePoint location for access, or a workspace administrator to restore the file.

### Failed to load archive details

**Where:** archived file page.
**Cause:** usually the file has **already been restored** — a completed restore deletes its archive record — or the archive connection was removed.
**Fix:** Check the file's original location in SharePoint. If the file is not there, contact your Proventeq365 administrator.

### That version is no longer in the archive.

**Fix:** Download another version from **Version history**.

### A restore of this item is already running.

**Fix:** Wait a few minutes for the restore to finish, then check the original location.

### Failed to restore the file / The restore did not complete. You can try again.

**Fix:** Try the restore again. If it fails again, contact your Proventeq365 administrator.

### An item is already at this archive's original location

**Cause:** a file with the same name now exists where the archived file was. The restore stopped so nothing is overwritten.
**Fix:** Move or rename the existing file — or delete it if it is left over from a failed restore — and run the restore again.

### The archive holds N versions but the destination library has versioning disabled

**Cause:** restoring would keep only the last version.
**Fix:** In SharePoint, turn on versioning for the library (**Library settings** → **Versioning settings**) and run the restore again.

### The archive record no longer exists, so there was nothing to restore

**Cause:** the file has most likely been restored already.
**Fix:** Check the original location in SharePoint.

### Nothing was restored. Restoring archived items needs workspace administrator rights.

**Where:** restoring in bulk, by scope or for a workspace.
**Fix:** Ask for the **Workspace Admin** role on the workspace, or ask a workspace administrator to run the restore.

### Restore at most 1000 archived items at a time.

**Fix:** Restore in batches of 1000 items or fewer.

### Restore completed with failures. Check the Actions page for the items that did not restore.

**Fix:** Open the restore execution, filter its **Items** tab by **Failed**, fix the causes and restore those items again.

### Preview isn't available in this browser. / The media could not be played.

**Where:** media preview on the archived file page.
**Fix:** Try another browser, or download the file instead.

## Related

- [Troubleshooting — Archiving and restore](../14-troubleshooting/README.md#archiving-and-restore)
- [How to Archive Obsolete Content](../13-how-to-guides/07-archive-obsolete-content.md)
- [How to Restore an Archived File](../13-how-to-guides/08-restore-an-archived-file.md)
