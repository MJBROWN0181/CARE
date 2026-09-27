Unicode true
!define APP_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\com.care.organizer"
Name "CARE"
OutFile "../dist/CARE Setup 0.6.0.exe"
InstallDir "$LOCALAPPDATA\Programs\CARE"
RequestExecutionLevel user
SetCompressor /SOLID lzma
Icon "../assets/care-icon.ico"
UninstallIcon "../assets/care-icon.ico"
ShowInstDetails show
ShowUninstDetails show
Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles
Section "Install CARE"
  SetShellVarContext current
  SetOutPath "$INSTDIR"
  File /r "../dist/win-unpacked/*.*"
  File /oname=care-icon.ico "../assets/care-icon.ico"
  WriteUninstaller "$INSTDIR\Uninstall CARE.exe"
  CreateShortCut "$DESKTOP\CARE.lnk" "$INSTDIR\CARE.exe" "" "$INSTDIR\care-icon.ico" 0
  CreateDirectory "$SMPROGRAMS\CARE"
  CreateShortCut "$SMPROGRAMS\CARE\CARE.lnk" "$INSTDIR\CARE.exe" "" "$INSTDIR\care-icon.ico" 0
  WriteRegStr HKCU "${APP_KEY}" "DisplayName" "CARE"
  WriteRegStr HKCU "${APP_KEY}" "DisplayVersion" "0.6.0"
  WriteRegStr HKCU "${APP_KEY}" "DisplayIcon" "$INSTDIR\care-icon.ico"
  WriteRegStr HKCU "${APP_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${APP_KEY}" "Publisher" "CARE"
  WriteRegStr HKCU "${APP_KEY}" "UninstallString" "$\"$INSTDIR\Uninstall CARE.exe$\""
  WriteRegDWORD HKCU "${APP_KEY}" "NoModify" 1
  WriteRegDWORD HKCU "${APP_KEY}" "NoRepair" 1
SectionEnd
Section "Uninstall"
  SetShellVarContext current
  Delete "$DESKTOP\CARE.lnk"
  Delete "$SMPROGRAMS\CARE\CARE.lnk"
  RMDir "$SMPROGRAMS\CARE"
  DeleteRegKey HKCU "${APP_KEY}"
  RMDir /r "$INSTDIR"
  ; The encrypted vault stays in CARE's user data folder under AppData.
SectionEnd
