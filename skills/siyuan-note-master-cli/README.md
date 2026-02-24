# SiYuan Skill for OpenClaw

通过 `snmcli.exe` 操作思源笔记（SiYuan Note）知识库的 OpenClaw 技能。

## 版本信息

- **Skill 版本**: v1.0.2
- **适配思源笔记**: SiYuan v3.5.4+ (3.x 系列)
- **发布日期**: 2026-02-24

## 功能特性

- ✅ 笔记本管理：列表、创建、删除、重命名、打开、关闭
- ✅ 文档操作：创建、删除、重命名、移动、导出、**导出标准 Markdown（v1.0.2 新增）**、插入子文档
- ✅ 块级操作：获取、更新、删除、插入、移动、折叠/展开
- ✅ 块属性：获取/设置属性、反向链接
- ✅ SQL 查询：强大的内容搜索能力
- ✅ 资源管理：列出笔记本资源文件
- ✅ 系统信息：获取思源版本
- ✅ 多格式输出：table、json、markdown

## 安装

此技能包含独立的 `snmcli.exe` 便携版（Windows），无需安装 Node.js。

### 安装到 OpenClaw

将此技能目录复制到 OpenClaw 的技能目录：

```bash
# 方式 1：复制到工作区私有技能
cp -r skills/siyuan-note-master-cli ~/.openclaw/workspace/skills/

# 方式 2：复制到管理技能（全局共享）
cp -r skills/siyuan-note-master-cli ~/.openclaw/skills/
```

重启 OpenClaw Gateway 以加载新技能。

## 使用方式

### 方式1: 直接调用（推荐）

```bash
snmcli.exe -t YOUR_TOKEN notebook list
snmcli.exe -t YOUR_TOKEN doc create <notebook-id> "/path" "# 标题\n\n内容"
```

### 方式2: 通过 OpenClaw 配置自动注入 token

在 OpenClaw 设置中配置 token 后，可直接使用：
```bash
snmcli.exe notebook list
```

## 命令列表

### 笔记本命令 (7个)
- `notebook list` - 列出所有笔记本
- `notebook create <name>` - 创建笔记本
- `notebook delete <id>` - 删除笔记本
- `notebook rename <id> <name>` - 重命名笔记本
- `notebook open <id>` - 打开笔记本
- `notebook close <id>` - 关闭笔记本
- `notebook get <id>` - 获取笔记本配置

### 文档命令 (12个)
- `doc create <notebook> <path> [markdown]` - 创建文档
- `doc delete <notebook> <path>` - 删除文档
- `doc delete-id <id>` - 按ID删除文档
- `doc rename <notebook> <path> <title>` - 重命名文档
- `doc rename-id <id> <title>` - 按ID重命名文档
- `doc move <fromNotebook> <fromPath> <toNotebook> <toPath>` - 移动文档
- `doc move-id <fromId> <toNotebook> <toPath>` - 按ID移动文档
- `doc export <id>` - 导出文档
- `doc export-md <id>` - 导出为标准 Markdown（v1.0.2 新增）
- `doc path <id>` - 获取文档路径
- `doc get <id>` - 获取文档内容
- `doc insert <notebook> <parentPath> <path> [markdown]` - 插入子文档

### 块命令 (12个)
- `block get <id>` - 获取块内容
- `block update <id> <content>` - 更新块
- `block delete <id>` - 删除块
- `block insert <position> <targetId> <content>` - 插入块
- `block prepend <parentId> <content>` - 前置子块
- `block append <parentId> <content>` - 追加子块
- `block move <id> <position> <targetId>` - 移动块
- `block children <id>` - 获取子块列表
- `block fold <id>` - 折叠块
- `block unfold <id>` - 展开块
- `block attrs <id> [key] [value]` - 获取/设置块属性
- `block backlink <id>` - 获取反向链接

### 搜索命令 (1个)
- `query --query <SQL>` - 执行 SQL 查询

### 资源命令 (1个)
- `asset ls <notebook>` - 列出笔记本资源文件

### 系统命令 (1个)
- `system info` - 获取思源版本信息

### 配置命令 (4个)
- `config get` - 获取配置
- `config set <key> <value>` - 设置配置
- `config init` - 初始化配置
- `config path` - 查看配置路径

## 使用示例

### 创建笔记

```bash
# 创建新文档
snmcli.exe doc create <notebook-id> "/Inbox/今日想法" "# 今日想法\n\n内容..."

# 插入子文档（v1.0.1 修复 - 正确建立父子关系）
snmcli.exe doc insert <notebook-id> "/父文档" "/子文档" "# 标题\n\n内容"

# 导出文档为标准 Markdown（v1.0.2 新增）
snmcli.exe doc export-md <doc-id>
snmcli.exe doc export-md <doc-id> --file output.md
snmcli.exe doc export-md <doc-id> --tag-mode yaml
```

### 搜索内容

```bash
# SQL 查询搜索
snmcli.exe query "SELECT * FROM blocks WHERE content LIKE '%关键词%' LIMIT 20"

# 获取最近文档
snmcli.exe query "SELECT * FROM blocks WHERE type = 'd' ORDER BY updated DESC LIMIT 10"
```

### 块级操作

```bash
# 获取块内容
snmcli.exe block get <block-id>

# 更新块
snmcli.exe block update <block-id> "新的内容"

# 追加子块
snmcli.exe block append <parent-id> "子块内容"

# 获取/设置块属性
snmcli.exe block attrs <block-id>
snmcli.exe block attrs <block-id> tags "#标签1,#标签2"
```

### 获取系统信息

```bash
# 获取思源版本
snmcli.exe system info
```

## OpenClaw 使用建议

在 OpenClaw 中调用时，建议使用 `-f json` 或 `-p` 参数：

```bash
# JSON 格式 - AI 可解析
snmcli.exe -t TOKEN notebook list -f json

# 纯文本输出 - 避免表格乱码
snmcli.exe -t TOKEN doc get <id> -p
```

## 常见问题

### Q: 提示 API Token 错误

A: 在思源笔记设置 → 关于 中获取 API Token，然后配置：
```bash
snmcli.exe config set token YOUR_TOKEN_HERE
```

### Q: 提示连接失败

A: 确保思源笔记正在运行，默认端口是 6806。如果修改过，指定端点：
```bash
snmcli.exe -e http://127.0.0.1:你的端口 notebook list
```

## 相关链接

- [思源笔记官网](https://b3log.org/siyuan/)
- [思源笔记 API 文档](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
- [OpenClaw 官网](https://openclaw.ai)
- [SiYuan CLI 仓库](https://github.com/mixyoung/siyuan_note_master_cli)

## 许可证

MIT
