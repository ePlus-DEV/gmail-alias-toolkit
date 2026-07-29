from pathlib import Path

settings_path = Path("entrypoints/popup/components/Settings.tsx")
settings = settings_path.read_text(encoding="utf-8")

if 'version: "1.3.3"' in settings:
    raise RuntimeError("Settings changelog already contains version 1.3.3")

marker = '''const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.3.2",
'''
replacement = '''const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.3.3",
    date: "2026-07-29",
    changes: [
      {
        type: "Fixed",
        items: [
          "Preserved the selected Google Workspace domain when generating website-aware aliases instead of forcing @gmail.com",
          "Filtered previous aliases, recent history, and favorites by the active account to prevent Gmail data from appearing under a Workspace account",
          "Rejected malformed base email addresses before generating inline alias suggestions",
        ],
      },
    ],
  },
  {
    version: "1.3.2",
'''

if settings.count(marker) != 1:
    raise RuntimeError("Expected Settings changelog marker was not found exactly once")

settings_path.write_text(settings.replace(marker, replacement, 1), encoding="utf-8")
