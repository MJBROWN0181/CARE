# Connecting automatic updates

This build installs CARE and preserves the vault across in-place upgrades. Automatic update checks are wired into the app but remain disabled until a public release repository is configured. No update service or GitHub release has been published.

To activate updates:

1. Choose a public GitHub repository for CARE releases. Do not place caregiver data or vault files in the repository.
2. Add `build.publish` to `package.json` with `[{"provider":"github","owner":"YOUR_GITHUB_ACCOUNT","repo":"YOUR_CARE_REPO"}]`.
3. Build a newer version as a standard electron-builder NSIS installer on Windows (or on Linux with Wine), and inspect the generated `app-update.yml` inside the app resources and `latest.yml` next to the installer.
4. Test an upgrade on a separate Windows test account with a sample encrypted vault: install the previous feed-enabled version, add records, release a newer version, allow it to download, restart, and verify the records and photos remain.
5. Publish the Windows installer, `latest.yml`, and any blockmap on a public GitHub Release. Tag each release with its version (for example `v0.7.0`). Release versions must increase.
6. Distribute the first feed-enabled version manually. Future installed versions can then find releases and offer restart to update.

Do not publish a release feed until the Windows upgrade test passes. The local vault is stored under Electron's userData folder, not the installation folder.
