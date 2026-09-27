#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
./node_modules/.bin/electron-builder --win dir --config.win.signAndEditExecutable=false
nsis_binary="$(find /root/.cache/electron-builder/nsis-3.0.4.1 -type f -path '*/linux/makensis' -print -quit)"
if [[ -z "$nsis_binary" ]]; then
  echo 'NSIS compiler not found. Install NSIS or use a Windows build machine.' >&2
  exit 1
fi
"$nsis_binary" -V2 packaging/care-installer.nsi
