from pathlib import Path

CHANGELOG_PATH = Path("CHANGELOG.md")
VERSION_HEADING = "## [1.3.3] - 2026-07-29"
INSERT_AFTER = (
    "and this project adheres to "
    "[Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n"
)
RELEASE_SECTION = """

## [1.3.3] - 2026-07-29

### :bug: Bug Fixes

- [`63c969f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/63c969f3cacc3c79e91ac7a76b4b8a46885601d5) - preserve Google Workspace domains when generating website aliases and prevent Gmail alias history or favorites from leaking into another active account *(commit by [@hoangsvit](https://github.com/hoangsvit))*
"""


def prepend_release_section() -> None:
    """Insert the v1.3.3 release notes after the changelog introduction."""
    content = CHANGELOG_PATH.read_text(encoding="utf-8")
    if VERSION_HEADING in content:
        raise RuntimeError("CHANGELOG.md already contains version 1.3.3")
    if content.count(INSERT_AFTER) != 1:
        raise RuntimeError("Unable to locate the changelog introduction marker")

    updated = content.replace(INSERT_AFTER, INSERT_AFTER + RELEASE_SECTION, 1)
    CHANGELOG_PATH.write_text(updated, encoding="utf-8")


prepend_release_section()
