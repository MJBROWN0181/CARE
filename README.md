# CARE desktop — version 0.8.1

**Download CARE for Windows and send bug reports or suggestions:** https://care-caregiver.mjbrown0181.chatgpt.site

CARE is a local caregiver organizer. This build is an early Windows desktop test version.

## Try the Windows app

Download `CARE Setup 0.8.1.exe` and open it on a Windows 10 or 11 PC. The installer creates a CARE desktop shortcut and a Start menu shortcut. Close CARE before installing; if CARE is in the system tray, right-click its tray icon and choose **Quit CARE**. Installing over 0.6.0 or 0.7.0 keeps your vault. Installing over 0.6.0 also removes its old Apps-list entry and Start menu folder so only one CARE entry remains.

On first launch, create a vault password with at least 12 characters and type it a second time to confirm it. There is no password reset; you can change the password in Help & Settings if you know the current one. CARE locks itself after 15 minutes without keyboard or mouse use. The setup guide then explains every main CARE section one step at a time. People upgrading from an earlier version see a "New in CARE" note on the dashboard with a link to the tour.

Set up **My caregiver profile** with your name, contact details, and photo. Add a separate care profile for each person you help, then use the selector at the top to switch between people, or choose **Everyone** to see all of them together. Each care profile has **Health facts** (allergies, conditions, blood type, where the advance directive is kept, insurance) and a printable **emergency sheet**.

For an email, first select the right care profile, then click **Save Email** on the dashboard or Saved Emails page and choose a downloaded .eml, .msg, or PDF file. For .eml files CARE also fills the subject, sender, and date. The Documents section also supports attachments. Files can be up to 25 MB each. PDFs, pictures, and text files open inside CARE with **View**; other files can be saved back out with **Save a copy**.

## Included features

- A separate caregiver profile and separate care profiles, with photos, date of birth, and health facts
- Printable emergency sheet (print or save as PDF): allergies, conditions, current medications, insurance, and emergency contacts
- Medications with dose, schedule, prescriber, pharmacy, and refill date; refills due within a week show on the dashboard and agenda
- Care journal: dated notes tagged as symptom, mood, sleep, fall, visit, and more
- Tasks that repeat daily, weekly, monthly, or yearly; checking one off adds the next
- Week agenda of appointments, due tasks, and refills; "Everyone" view across all care profiles
- Reminder pop-ups (Windows notifications) the day before and an hour before appointments, and when tasks and refills are due. CARE keeps running in the system tray, locked, when its window is closed, and can start with Windows
- Editable appointments, documents, medical notes, financial references, contacts, and physical item locations
- Search, document and email attachments with a built-in viewer, calendar event export (.ics)
- Password protected encrypted local vault, manual encrypted backups, and weekly automatic backups to a folder you choose (keeps the newest 5)

## Current limits

- Direct email forwarding to a CARE email address is not implemented: it would require an external receiving mailbox or service. Download/save the email from your mail app, then use Save Email in CARE. Text-message reminders and Google Calendar sync are not implemented. Export an appointment as a calendar file and import it into your calendar app.
- Reminder pop-ups appear only while CARE is running (open or in the tray). To keep reminders private they never include names or details.
- This is an early test build, not a security audit or a substitute for a medical records system.
- The Windows installer is unsigned, so Windows SmartScreen shows "Windows protected your PC". Click **More info**, then **Run anyway**. Removing the warning needs a paid code-signing certificate.

## Build from source

Requires Node.js 20 or newer. Run `npm ci` then `npm start` for local development. On Windows, run `npm run package:win` to build `dist/CARE Setup <version>.exe` with electron-builder. Change `version` in package.json before each release. `npm start` uses the same vault as the installed app. To test against a separate empty vault, run `npx electron . --user-data-dir=<some empty folder>`.

## Storage and encryption

Everything lives in CARE's user data folder (`%APPDATA%\care-caregiver-organizer`), separate from the installed program:

- `care-vault.json`: the records, as AES-256-GCM encrypted JSON. The key is derived from the password with scrypt (N=131072, r=8, p=1) and a random 32-byte salt, once per unlock; while unlocked CARE keeps only the derived key, not the password. Each save uses a fresh 12-byte nonce, and changing the password picks a new salt. Vaults from before 0.8.0 (scrypt N=16384) are re-encrypted with the stronger setting on first unlock, after which those older versions of CARE can no longer open them.
- `files/`: one AES-256-GCM encrypted file per attachment, using a random data key that is stored inside the encrypted vault. Changing the password re-encrypts only the vault. Vaults from 0.7.0 and earlier, which kept attachments inside the vault, are converted automatically on first unlock.
- `settings.json` and `reminders.json`: unencrypted. They hold only app preferences, the backup folder path, and reminder times with generic wording ("You have an appointment tomorrow at 2:00 PM"), never names or record details.

A backup (`.care`) holds the encrypted vault followed by the still-encrypted attachment files, so the same password unlocks it. Backups from 0.7.0 and earlier (a copy of the vault file) can still be restored. To restore on a new PC, use **Restore encrypted backup** before creating a vault there.

Attachments are opened from memory in a separate viewer window; CARE does not write unencrypted copies to a temp folder. This is not SQLCipher or SQLite.

## Updates

The Windows installer installs to the same CARE program folder on each run, so installing a newer version replaces the old program and retains the separate encrypted vault. It contains the update checker. Automatic update notifications are **not active yet** because CARE does not have a configured public release feed. Once a GitHub Releases repository is chosen, configure electron-builder's GitHub publish provider (owner/repo), build a new release, and publish the NSIS installer with its generated `latest.yml` and blockmap. The first feed-enabled release must be installed manually; later releases can use in-app downloads once the release feed and Windows updater have been verified together. Keep encrypted backups before upgrading.
