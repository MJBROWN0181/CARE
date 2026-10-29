; Included by electron-builder's NSIS installer (build.nsis.include).
; CARE 0.6.0 was installed by a hand-written NSIS script that registered its own
; uninstall entry and a Start menu folder. Remove those leftovers so Windows shows
; a single CARE entry. The vault lives in %APPDATA% and is never touched here.
!macro customInstall
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\com.care.organizer"
  Delete "$SMPROGRAMS\CARE\CARE.lnk"
  RMDir "$SMPROGRAMS\CARE"
  Delete "$INSTDIR\care-icon.ico"
!macroend
