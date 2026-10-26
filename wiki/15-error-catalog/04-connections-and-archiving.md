---
title: "Error Messages: Connections, Archiving and Restore"
description: "What Proventeq365 archive connection, archiving and restore error messages mean and how to fix them — including “Connection validation failed”, “Failed to delete connection”, “Access denied - you do not have permission to download this item” and restore failures."
type: reference
updated: 2026-10-26
---

# Error Messages: Connections, Archiving and Restore

Messages you may see when adding an archive connection (Wasabi or Azure Blob Storage), setting the default archive destination, archiving content — including from Workspace Inventory and to Microsoft 365 Archive — or opening and restoring archived files.

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

### Display name is required / Display name cannot be only whitespace / Storage system is required / This field is required

**Fix:** Fill in every field marked as required.

### This doesn't look like an Azure Storage connection string (expected key=value pairs including AccountName and AccountKey).

**Where:** **Connection String** field of an Azure Blob Storage connection.
**Fix:** Copy the whole connection string from the storage account's **Access keys** page in the Azure portal and paste it again.

### Failed to create connection / Failed to update connection

**Where:** after **Save and Continue** or **Continue** on a connection.
**Cause:** the connection could not be saved. When Proventeq365 knows why, it shows that reason instead — usually *Connection validation failed*.
**Fix:** Check the details and try again.

### Connection was saved, but it could not be opened for container selection. Refresh the page and try again.

**Fix:** Refresh the page, open the connection with **Edit** and select its containers on the **Containers** step.

### Failed to load connection / This connection type isn't supported by this version of the app, so it can't be edited here.

**Where:** opening a connection with **Edit**.
**Fix:** Refresh the page and try again. If the connection type isn't supported, contact Proventeq support.

### Please enter the actual value — masked values cannot be saved

**Where:** editing a connection.
**Fix:** Secrets are shown masked. To change a secret, clear the field and type the new value; to keep it, leave the field blank.

### Could not validate against the stored connection. Please re-enter secret fields and try again.

**Fix:** Re-enter the secret fields (keys or connection string) and save again.

### This container is already selected / Failed to save container path

**Where:** **Select this container** on the containers step.
**Fix:** A container already under **Selected Containers** can't be added twice. For *Failed to save container path*, click **Refresh** and try again.

### Failed to discover containers

**Where:** containers step of a connection.
**Cause:** the buckets or containers could not be listed — usually wrong credentials or missing permissions on the storage.
**Fix:** Check the credentials and the key's permissions, then click **Refresh**.

### Failed to delete connection / Failed to remove container

**Cause:** archived files still use the connection or container — their stub links point to it — or the connection is enabled on **Archiving Connections**, or the container is selected there as the archive destination.
**Fix:** Keep the connection while archived content depends on it. To stop using it for new archives, choose a different target in your archive policies, and turn the connection off on **Archiving Connections** (**Manage default connections**).

## Archiving Connections

### Can't save — 1 connection has missing required settings.

**Where:** **Archiving Connections**, after **Save changes**. The connection's card shows **Action required** and *No containers available. Browse and save containers in the connection editor first.*
**Cause:** the storage connection you turned on has no containers.
**Fix:** Open the connection from **Connections** with **Edit**, select a container on the **Containers** step, then save **Archiving Connections** again. Or turn the connection off.

### Failed to save archiving connections. Please try again.

**Fix:** Try again. If it keeps failing, refresh the page and make your changes again.

### Failed to load archiving connections. Refresh the page to try again.

**Fix:** Refresh the page.

## Archiving

### Archiving is not configured. Please set up an archive connection in Archiving Connections.

**Where:** archiving from **Workspace Inventory**.
**Cause:** archiving without a policy has no destination — no connection is enabled on **Archiving Connections**.
**Fix:** Ask a Tenant Admin to add an archive connection with a container and enable it on **Archiving Connections**. See [How to Set the Default Archive Destination](../13-how-to-guides/26-set-the-default-archive-destination.md).

### No default archive target is configured. Please configure one in Archiving Connections. / No archive destination is configured. Please set up an archive connection in Archiving Connections.

**Where:** archiving a site or OneDrive from **Workspace Inventory**.
**Fix:** As above: enable a connection with a container on **Archiving Connections**, save, then try again.

### Failed to archive the selected documents. Please try again.

**Fix:** Try again. If it keeps failing, check that the archive connection still validates.

### … is a folder or library and cannot be archived from this report

**Cause:** folders and libraries are not archived themselves; their documents are.
**Fix:** Select the documents to archive.

### Item … reported no versions to archive.

**Where:** **Items** tab of an archive execution.
**Cause:** SharePoint returned no versions for the file, so nothing was archived and the file was left in place.
**Fix:** Check the file in SharePoint and run the archive again. Contact Proventeq support if it repeats.

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

## Workspace Inventory and Microsoft 365 Archive

### Failed to initiate archiving. Please try again. / Failed to initiate OneDrive archiving. Please try again.

**Where:** **Archive Site** or **Archive OneDrive** dialog on **Workspace Inventory**.
**Fix:** Try again. If it keeps failing, check that archiving is set up (see the messages above).

### Archiving could not be started for any of the … selected sites. / Archiving initiated, but … sites failed to start.

**Where:** **Archive sites** dialog after a bulk archive.
**Fix:** Select the sites whose **Archive status** is still **Not archived** and archive them again.

### None of the selected sites can be archived. / Select at least one site to archive.

**Where:** **Archive** in the **Bulk actions** dialog.
**Cause:** nothing is selected, or every selected site is already **Archived** or **Archiving**.
**Fix:** Select sites that are **Not archived** or **Failed**.

### Failed to archive the selected items. Please try again.

**Where:** **Archive selected** in a site's side panel.
**Fix:** Try again. If it keeps failing, check that archiving is set up (see the messages above).

### You are about to archive more than 50% of this site's content. Archiving the whole site would be faster. Continue with item archiving anyway?

**Where:** **Archive selected** in a site's side panel.
**Cause:** a warning, not an error: the folders you selected hold more than half the site's documents.
**Fix:** Continue, or cancel and use **Archive site**.

### HTTP 403 (Forbidden): … / HTTP …: …

**Where:** **Items** tab of a Microsoft 365 Archive execution.
**Cause:** Microsoft 365 refused to archive the item or site. The text after the colon is Microsoft's response.
**Fix:** Check that Microsoft 365 Archive is enabled and billing is set up in your tenant — see Microsoft's [Overview of Microsoft 365 Archive](https://learn.microsoft.com/en-us/microsoft-365/archive/archive-overview). For a 403, contact Proventeq support with the message.

### Rate-limited: still throttled when the batch's throttling budget ran out; the next wave retries it

**Where:** **Items** tab of a Microsoft 365 Archive execution.
**Cause:** Microsoft 365 was throttling requests.
**Fix:** No action needed; the item is retried. If it stays failed, run the archive again later.

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

### Download failed

**Where:** archived file page.
**Fix:** Try again. If it keeps failing, the archive storage may be unreachable — contact your Proventeq365 administrator.

### Preview isn't ready yet. Reload the page and try again.

**Fix:** Reload the page and open the preview again.

### Failed to queue the restore

**Where:** restoring from a policy report or from **Workspace Inventory**.
**Fix:** Try again. When Proventeq365 knows why the restore was refused, it shows that reason instead.

### Those restores are already running. Track them on the Actions page. / … of the selected archived records are already queued or being restored.

**Fix:** No action needed. Follow the restore on the **Actions** page.

### A restore is already running. / A restore of this workspace is already running.

**Where:** **Workspace Inventory**.
**Fix:** Wait for the current restore to finish; the restore buttons become available again when it does.

### Only 1000 archived records can be restored at a time, so … records of this selection will be left for the next run.

**Where:** **Restore from archive** card on a policy report.
**Fix:** Restore the selection, then restore the rest, or use **Restore all**, which has no limit.

### … selected records no longer exist and were skipped.

**Cause:** those items were restored or changed after the report was loaded.
**Fix:** No action needed.

### … restores are no longer running and did not finish. You can try again. / The restore of … is no longer running and did not finish.

**Where:** policy report.
**Fix:** Check the restore run on the **Actions** page for the cause, then restore those items again.

### None of the selected sites holds an archived item. / None of the selected items is archived or holds an archived item. / Nothing in this workspace is archived.

**Where:** **Restore** actions on **Workspace Inventory**.
**Cause:** there is nothing archived to a storage connection in the selection. Content in Microsoft 365 Archive isn't restored by Proventeq365.
**Fix:** Select sites or items that hold archived content.

### Select at most 1000 sites to restore at a time. / Select at most 1000 files and 1000 folders to restore at a time.

**Fix:** Restore in smaller selections, or use **Restore all** for the whole workspace.

### The selection could not be checked for archived items. Try again.

**Fix:** Change the selection or refresh the page, then try again.

### The restore lease … was lost while this item was being restored, so nothing was deleted

**Where:** **Items** tab of a restore execution.
**Cause:** the restore was interrupted. The archive and its record were left in place.
**Fix:** Check the item in SharePoint, then restore it again.

### The workspace holds no usable row for archived item … or the stub that replaced it

**Where:** **Items** tab of a restore execution.
**Cause:** the workspace's latest data doesn't include the file or its stub, so Proventeq365 can't tell which library to restore it to. Nothing was changed.
**Fix:** Run a data refresh of the workspace, then restore again.

### Restore completed with failures. Check the Actions page for the items that did not restore.

**Fix:** Open the restore execution, filter its **Items** tab by **Failed**, fix the causes and restore those items again.

### Preview isn't available in this browser. / The media could not be played.

**Where:** media preview on the archived file page.
**Fix:** Try another browser, or download the file instead.

## Related

- [Troubleshooting — Archiving and restore](../14-troubleshooting/README.md#archiving-and-restore)
- [Connections](../02-manage/connections/README.md)
- [Restore Archived Content](../10-archive/03-restore-archived-content.md)
- [Microsoft 365 Archive](../10-archive/02-microsoft-365-archive.md)
- [How to Archive Obsolete Content](../13-how-to-guides/07-archive-obsolete-content.md)
- [How to Restore an Archived File](../13-how-to-guides/08-restore-an-archived-file.md)
