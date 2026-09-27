# CARE

CARE is a local-first desktop organizer for family caregivers.

## Current first build

- Separate profiles for people you care for
- Dashboard overview
- Appointments
- Reminders
- Document records and physical storage locations
- Local JSON data storage on the user's own computer
- No cloud account required by the application

## Run locally

Requires Node.js.

```bash
npm install
npm start
```

CARE currently stores application data in Electron's local user-data directory as `care-data.json`.

## Next build targets

1. Important information: doctors, attorneys, insurance, accounts, property/deeds and emergency contacts
2. Actual local document attachment vault
3. Editing/deleting records
4. Calendar integration/export
5. Backup/restore and encryption
6. Windows installer/release packaging

> Early development build. Do not use as the sole storage location for critical records yet.
