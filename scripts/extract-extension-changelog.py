from pathlib import Path


SETTINGS_PATH = Path("entrypoints/popup/components/Settings.tsx")


def replace_once(content: str, old: str, new: str) -> str:
    """Replace one expected source fragment and fail when the branch has drifted."""
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one source match, found {count}")
    return content.replace(old, new, 1)


content = SETTINGS_PATH.read_text(encoding="utf-8")
content = replace_once(
    content,
    'import { openUserGuide } from "src/utils/externalLinks";\n',
    'import { openUserGuide } from "src/utils/externalLinks";\n'
    'import {\n'
    '  CHANGELOG,\n'
    '  type ChangelogChange,\n'
    '  type ChangelogEntry,\n'
    '} from "../data/changelog";\n',
)

interfaces_start = content.index("interface ChangelogChange {")
interfaces_end = content.index("const DEFAULT_SETTINGS", interfaces_start)
content = content[:interfaces_start] + content[interfaces_end:]

changelog_start = content.index("const CHANGELOG:")
changelog_end = content.index("interface SettingsPanelProps", changelog_start)
content = content[:changelog_start] + content[changelog_end:]

if "interface ChangelogEntry" in content or "const CHANGELOG:" in content:
    raise RuntimeError("Inline changelog declarations were not fully removed")
if 'type ChangelogEntry,' not in content or 'type ChangelogChange,' not in content:
    raise RuntimeError("Changelog data types were not imported")

SETTINGS_PATH.write_text(content, encoding="utf-8")
