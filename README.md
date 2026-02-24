# SiYuan Note Master CLI (snmcli)

SiYuan Note command line tool - provides a complete CLI interface for managing SiYuan notes.

## Version Info

- **Current Version**: v1.0.2
- **Release Date**: 2026-02-24
- **Main Feature**: New `doc export-md` command - convert SiYuan Kramdown format to standard Markdown

## Features

- **Notebook Management**: Create, list, rename, delete, open/close notebooks
- **Document Management**: Create, delete, rename, move, export, **export to standard Markdown**
- **Block Operations**: Get, update, delete, insert, move blocks
- **Search**: Execute SQL queries to search content
- **Multiple Output Formats**: table, json, markdown

## Installation

```bash
git clone https://github.com/mixyoung/siyuan_note_master_cli.git
cd siyuan_note_master_cli
npm install
npm run build
```

## Quick Start

### 1. Initialize Config

```bash
snmcli config init
```

### 2. Set API Token

```bash
snmcli config set token YOUR_API_TOKEN
```

### 3. Create Sub-document (v1.0.1 Fix)

```bash
snmcli doc insert <notebook-id> "/parent-doc" "/child-doc" "# Title

Content"
```

### 3. Export Document to Standard Markdown (v1.0.2)

```bash
# Export document to standard Markdown (stdout)
snmcli doc export-md <doc-id>

# Export to file
snmcli doc export-md <doc-id> --file output.md

# Tag mode options: escape (default), yaml, remove
snmcli doc export-md <doc-id> --tag-mode yaml

# Ref mode options: keep (default), link
snmcli doc export-md <doc-id> --ref-mode link

# Remove frontmatter
snmcli doc export-md <doc-id> --keep-frontmatter false
```

## Changelog

### v1.0.2 (2026-02-24)
- Feature: New `doc export-md` command - convert SiYuan Kramdown format to standard Markdown
- Supports configurable tag handling (escape/yaml/remove)
- Supports configurable ref handling (keep/link)
- Supports YAML frontmatter control

- Fix: doc insert command now correctly creates sub-documents
- Uses createDocWithMd + moveDocsByID to establish parent-child relationship

### v1.0.0 (2026-02-22)
- Initial release
- Support notebook management, document operations, block operations, SQL queries

## License

AGPL-3.0

## Related Links

- [SiYuan Note Official](https://github.com/siyuan-note/siyuan)
- [SiYuan API Documentation](https://github.com/siyuan-note/siyuan/blob/master/API.md)
