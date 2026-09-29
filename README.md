# CARE desktop — version 0.6.0

**Download CARE for Windows and send bug reports or suggestions:** https://care-caregiver.mjbrown0181.chatgpt.site

CARE is a local caregiver organizer. This build is an early Windows desktop test version.

## Try the Windows app

Download `CARE Setup 0.6.0.exe` and open it on a Windows 10 or 11 PC. The installer creates a CARE desktop shortcut and a Start menu shortcut. Close an earlier portable CARE window before installing. Windows may show a publisher warning because this early build is unsigned.

On first launch, create a vault password with at least 12 characters. The setup guide then explains every main CARE section one step at a time. It also opens once for existing vaults upgrading from an earlier build. You can skip it or reopen it in Help & Settings. There is no password reset. Set up **My caregiver profile** with your name, contact details, and photo. Add a separate care profile for each person you help, then use the selector at the top to switch between people. Each care profile can have a photo too. Photos are stored inside the encrypted vault (PNG, JPEG, or WebP, up to 3 MB each). For an email, first select the right care profile, then click **Save Email** on the dashboard or Saved Emails page and choose a downloaded .eml, .msg, or PDF file. CARE saves the original file inside that person’s encrypted vault records. For .eml files it also fills the subject, sender, and date when those headers are available. You can edit the saved record to add notes. Files are limited to 5 MB. The Documents section also supports attachments. The Help & Settings section saves an encrypted backup. To restore on a new PC, use **Restore encrypted backup** before creating a vault there; the same password unlocks it.

The vault file is stored under the operating system's app data directory for CARE, separate from the installed program. Installing a newer CARE version replaces its program files without deleting the vault. The same password unlocks the existing vault. Lock the app, lock Windows, suspend the PC, or close CARE to clear the vault state and hide records. Operating system memory or swap may still hold copies until reclaimed. If you lose both the password and a usable unlocked session, the vault cannot be recovered. Keep backups on a separate drive and protect access to your Windows account.

## Included features

- A separate caregiver profile and separate care profiles, with photos
- Redesigned navigation, custom local SVG icons, and clearer dashboard cards
- Editable appointments, tasks, documents, medical notes, financial references, contacts, and physical item locations
- Search, completion checkboxes, document and email file attachments, calendar event export (.ics)
- Password protected encrypted local vault and encrypted backup

## Current limits

- Direct email forwarding to a CARE email address is not implemented: it would require an external receiving mailbox or service. Download/save the email from your mail app, then use Save Email in CARE. Automatic text reminders, Google Calendar sync, and background notifications are not implemented. Export an appointment as a calendar file and import it into your calendar app.
- This is an early test build, not a security audit or a substitute for a medical records system.
- The earlier browser prototype used browser storage. This desktop app begins with an empty vault and does not automatically import prototype data.
- The Windows executable is unsigned. The app has not been run on a physical Windows computer in this environment.

## Build from source

Requires Node.js 20 or newer. Run `npm ci` then `npm start` for local development. On Windows (or Linux with Wine), run `npm run package:win` for the standard electron-builder NSIS installer. This Linux workspace used `npm run package:win:linux`, which packages the app and compiles the included NSIS script to create the desktop and Start menu shortcuts without Wine. All app code is in this folder; the lockfile pins dependencies.

The vault is an AES-256-GCM encrypted JSON file. A key is derived from the password with scrypt (N=16384, r=8, p=1) and a random 32-byte salt. Each save uses a fresh salt and 12-byte nonce; documents are stored within the encrypted vault. This is not SQLCipher or SQLite.

## Updates

The Windows installer installs to the same CARE program folder on each run, so installing a newer version replaces the old program and retains the separate encrypted vault. It contains the update checker. Update checks are user initiated. When a release feed is configured, CARE checks only when the user clicks **Check for updates**, then asks separately before downloading. No care records are part of the update request. The installer remains unsigned in this version. Once a GitHub Releases repository is chosen, configure electron-builder's GitHub publish provider (owner/repo), build a new release, and publish the NSIS installer with its generated `latest.yml` and blockmap. The first feed-enabled release must be installed manually; later releases can offer user initiated in-app downloads once the release feed and Windows updater have been verified together. The vault remains in the same user data location throughout. Keep encrypted backups before upgrading.

## Privacy and safety boundaries

CARE does not ask for an email address in the desktop app. Update email signup belongs on the website and must be a separate, optional action with a clear subscription and unsubscribe process. The desktop app has no telemetry, cloud sync, or automatic bug report upload. A user must deliberately export a document, calendar file, or encrypted backup to a location they choose. A file saved to a cloud-synced folder may then be uploaded by that folder's own software.

An encrypted vault protects files at rest when CARE is locked. It does not protect an unlocked session, a compromised Windows account, malicious software on the PC, screen captures, or the original unencrypted files that the user imported. Keep Windows updated, use a password or PIN for the Windows account, enable full-disk encryption where available, and store an encrypted backup separately. This early build has not had an independent security audit or physical Windows validation; do not promise complete safety for sensitive medical or financial records yet.
