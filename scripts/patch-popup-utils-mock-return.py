from pathlib import Path

path = Path("tests/services/websiteAliasService.test.ts")
content = path.read_text(encoding="utf-8")
old = """async function createPopupUtilsMock(importOriginal: ImportOriginal) {
"""
new = """async function createPopupUtilsMock(
  importOriginal: ImportOriginal,
): Promise<typeof import(\"../../entrypoints/popup/utils\")> {
"""
if content.count(old) != 1:
    raise RuntimeError("Expected popup utility mock signature was not found exactly once")
path.write_text(content.replace(old, new, 1), encoding="utf-8")
