# SiYuan Skill

通过 `snmcli.exe` 操作思源笔记（SiYuan Note）知识库。

## 版本兼容性

- **CLI 版本**: v1.0.2
- **适配思源笔记版本**: SiYuan v3.5.4+ (3.x 系列)
- **发布日期**: 2026-02-24

> ⚠️ **注意**: 此 CLI 针对思源笔记 v3.5.4 开发，理论上兼容 3.x 系列版本。如遇到兼容性问题，请提交 Issue。

## 依赖

此技能依赖 **snmcli.exe 便携版**（Windows 可执行文件，无需安装 Node.js）。

### 使用方式

#### 方式1: 直接调用（推荐用于 OpenClaw）

```bash
# 完整路径
# 或将 snmcli.exe 复制到系统 PATH 中
snmcli.exe -t YOUR_TOKEN notebook list
```

#### 方式2: 命令行直接使用

```bash
# 设置 Token（首次配置）
snmcli.exe config set token YOUR_TOKEN_HERE

# 之后就可以直接用
snmcli.exe notebook list
```

## 基本用法（notebook = 笔记本）

### 设置配置

Token 配置后会持久化保存，只需配置一次。

初始化配置文件：
```bash
snmcli.exe config init
```

设置 API Token（必需，配置一次即可持久化）：
```bash
snmcli.exe config set token YOUR_TOKEN_HERE
```

查看配置文件路径：
```bash
snmcli.exe config path
```

或在命令行直接使用 token：
```bash
snmcli.exe -t YOUR_TOKEN_HERE <command>
```

### 笔记本操作

列出所有笔记本：
```bash
snmcli.exe notebook list [-f table|json|markdown]
```

创建笔记本：
```bash
snmcli.exe notebook create "我的笔记"
```

删除笔记本：
```bash
snmcli.exe notebook delete <id>
```

重命名笔记本：
```bash
snmcli.exe notebook rename <id> "新名称"
```

打开笔记本：
```bash
snmcli.exe notebook open <id>
```

关闭笔记本：
```bash
snmcli.exe notebook close <id>
```

### 文档操作

创建文档：
```bash
snmcli.exe doc create <notebook> <path> [markdown]

# 示例
snmcli.exe doc create "我的笔记本" "/Inbox/今日记录" "# 今日记录\n\n内容..."
```

删除文档：
```bash
snmcli.exe doc delete <notebook> <path>
snmcli.exe doc delete-id <doc-id>
```

重命名文档：
```bash
# ✅ 推荐使用 rename-id（更可靠）
snmcli.exe doc rename-id <文档ID> "新标题"

# ⚠️ 路径重命名暂不推荐（可能有兼容性问题）
# snmcli.exe doc rename <notebook> <path> <title>
```

移动文档：
```bash
snmcli.exe doc move <fromNotebook> <fromPath> <toNotebook> <toPath>
snmcli.exe doc move-id <fromId> <toNotebook> <toPath>
```

导出文档为 Markdown：
```bash
snmcli.exe doc export <id> [--file output.md]
```

导出为标准 Markdown（v1.0.2 新增）：
```bash
snmcli.exe doc export-md <id> [--file output.md] [--tag-mode escape|yaml|remove] [--ref-mode keep|link]
```

获取文档路径：
```bash
snmcli.exe doc path <id>
```

### 块操作（思源笔记的核心：块级内容）

获取块内容（Kramdown 格式）：
```bash
snmcli.exe block get <id>
```

更新块：
```bash
snmcli.exe block update <id> "新内容"
```

删除块：
```bash
snmcli.exe block delete <id>
```

插入块（支持相对位置）：
```bash
snmcli.exe block insert <prev|next|parent> <目标ID> "内容"
```

追加子块（作为最后一个子块）：
```bash
snmcli.exe block append <父块ID> "内容"
```

前置子块（作为第一个子块）：
```bash
snmcli.exe block prepend <父块ID> "内容"
```

移动块：
```bash
snmcli.exe block move <块ID> <prev|parent> <目标ID>
```

获取子块列表：
```bash
snmcli.exe block children <块ID>
```

获取/设置块属性（标签、别名等）：
```bash
# 获取块的所有属性
snmcli.exe block attrs <块ID>

# 获取特定属性
snmcli.exe block attrs <块ID> tags

# 设置属性
snmcli.exe block attrs <块ID> tags "标签1,标签2"
```

> ⚠️ **重要提示：块层级与属性位置**
>
> 思源笔记的块有层级关系，设置属性时要注意：
>
> | 块类型 | type 值 | 说明 | 属性位置 |
> |-------|--------|
> | 文档块 | `-|------|---------d` | 整个文档的最高层级 | 相当于文档属性 |
> | 标题块 | `h1/h2...` | 标题 | 块的属性面板 |
> | 段落块 | `p` | 正文内容 | 块的属性面板 |
>
> **示例**：
> - 给**整个文档**打标签 → 用文档块 ID（type=`d`）: `snmcli.exe block attrs <文档ID> tags "#标签"`
> - 给**标题**打标签 → 用标题块 ID（type=`h1`）: `snmcli.exe block attrs <标题块ID> tags "#标签"`
>
> **如何区分**：使用 SQL 查询确认块类型：
> ```bash
> snmcli.exe query "SELECT id, type, content FROM blocks WHERE root_id = '<文档ID>'"
> ```
> 返回的 `type` 字段：`d`=文档, `h`=标题, `p`=段落

### 搜索（SQL 查询）

执行 SQL 查询搜索内容：
```bash
snmcli.exe query --query "SELECT * FROM blocks WHERE type = 'd' LIMIT 10"

# 简写形式
snmcli.exe query "SELECT * FROM blocks WHERE content LIKE '%关键词%'"
```

### 资源管理

列出笔记本中的资源文件：
```bash
snmcli.exe asset ls <notebook-id>
```

### 系统信息

获取思源笔记版本信息：
```bash
snmcli.exe system info
snmcli.exe system info -f json
```

### 全局选项

所有命令都支持全局选项：

```bash
-V, --version          显示版本号
-e, --endpoint <url>   思源 API 端点（默认: http://127.0.0.1:6806）
-t, --token <token>   API 认证 Token
-f, --format <format>   输出格式: table|json|markdown（默认: table）
-p, --plain           使用纯文本输出（避免终端乱码）
-v, --verbose         显示详细信息
```

## 支持的命令列表

### 配置命令 (4个)
- `snmcli.exe config get` - 获取配置
- `snmcli.exe config set <key> <value>` - 设置配置
- `snmcli.exe config init` - 初始化配置
- `snmcli.exe config path` - 查看配置路径

### 笔记本命令 (7个)
- `snmcli.exe notebook list` - 列出所有笔记本
- `snmcli.exe notebook create <name>` - 创建笔记本
- `snmcli.exe notebook delete <id>` - 删除笔记本
- `snmcli.exe notebook rename <id> <name>` - 重命名笔记本
- `snmcli.exe notebook open <id>` - 打开笔记本
- `snmcli.exe notebook close <id>` - 关闭笔记本
- `snmcli.exe notebook get <id>` - 获取笔记本配置

### 文档命令 (12个)
- `snmcli.exe doc create <notebook> <path> [markdown]` - 创建文档
- `snmcli.exe doc delete <notebook> <path>` - 删除文档
- `snmcli.exe doc delete-id <id>` - 按ID删除文档
- `snmcli.exe doc rename <notebook> <path> <title>` - 重命名文档
- `snmcli.exe doc rename-id <id> <title>` - 按ID重命名文档
- `snmcli.exe doc move <fromNotebook> <fromPath> <toNotebook> <toPath>` - 移动文档
- `snmcli.exe doc move-id <fromId> <toNotebook> <toPath>` - 按ID移动文档
- `snmcli.exe doc export <id>` - 导出文档（Kramdown格式）
- `snmcli.exe doc export-md <id>` - 导出为标准 Markdown（v1.0.2 新增）
- `snmcli.exe doc path <id>` - 获取文档路径
- `snmcli.exe doc get <id>` - 获取文档内容
- `snmcli.exe doc insert <notebook> <parentPath> <path> [markdown]` - 插入子文档

### 块命令 (12个)
- `snmcli.exe block get <id>` - 获取块内容
- `snmcli.exe block update <id> <content>` - 更新块
- `snmcli.exe block delete <id>` - 删除块
- `snmcli.exe block insert <position> <targetId> <content>` - 插入块
- `snmcli.exe block prepend <parentId> <content>` - 前置子块
- `snmcli.exe block append <parentId> <content>` - 追加子块
- `snmcli.exe block move <id> <position> <targetId>` - 移动块
- `snmcli.exe block children <id>` - 获取子块列表
- `snmcli.exe block fold <id>` - 折叠块
- `snmcli.exe block unfold <id>` - 展开块
- `snmcli.exe block attrs <id> [key] [value]` - 获取/设置块属性
- `snmcli.exe block backlink <id>` - 获取反向链接

### 搜索命令 (1个)
- `snmcli.exe query --query <SQL>` - 执行 SQL 查询

### 资源命令 (1个)
- `snmcli.exe asset ls <notebook>` - 列出笔记本资源文件

### 系统命令 (1个)
- `snmcli.exe system info` - 获取思源版本信息

## 常见 SQL 查询示例

思源笔记使用 SQL 进行查询，以下是常用查询：

### 获取最近修改的文档
```sql
SELECT * FROM blocks WHERE type = 'd' ORDER BY updated DESC LIMIT 10
```

### 获取某个笔记本的所有文档
```sql
SELECT * FROM blocks WHERE box = '笔记本ID' AND type = 'd'
```

### 搜索包含特定内容的块
```sql
SELECT * FROM blocks WHERE content LIKE '%搜索词%'
```

### 获取待办事项（通过内容匹配）
```sql
SELECT * FROM blocks WHERE content LIKE '%[ ]%' OR content LIKE '%- [ ]%'
```

### 获取标签列表
```sql
SELECT content FROM blocks WHERE type = 's' AND content LIKE '#%'
```

## 适合的自动化场景

### 1. 归档 IM 对话
将对话中的待办/灵感沉淀到思源笔记：

```bash
# 创建快速记录
snmcli.exe doc create <笔记本ID> "/OpenClaw/$(date +%Y%m%d)" "# 待办\n\n- [ ] 来自对话的任务\n\n# 灵感\n\n- 来自对话的灵感"
```

### 2. 每日总结
把当天消息总结到 Daily Note：

```bash
snmcli.exe doc create <笔记本ID> "/Daily/$(date +%Y-%m-%d)" "# $(date +%Y-%m-%d) 日总结\n\n\${总结内容}"
```

### 3. 项目日志
归档 OpenClaw 的执行记录到固定目录：

```bash
snmcli.exe doc create <笔记本ID> "/OpenClaw/$(date +%Y%m%d)" "# 执行记录\n\n\${执行内容}"
```

### 4. 快速追加内容
向现有文档追加内容：

```bash
# 先获取文档 ID，然后追加子块
snmcli.exe query --query "SELECT id FROM blocks WHERE hpath LIKE '%目标文档%' LIMIT 1"
snmcli.exe block append "<文档ID>" "\n\n新的追加内容"
```

### 5. 获取文档内容
获取指定文档的完整内容：

```bash
# 获取文档内容（返回思源内部 JSON 格式）
snmcli.exe doc get <文档ID>

# 使用纯文本输出
snmcli.exe doc get <文档ID> -p

# 使用 JSON 格式
snmcli.exe doc get <文档ID> -f json
```

### 6. 获取/设置块属性
查看或修改块的属性（如别名、备注等）：

```bash
# 获取块的所有属性
snmcli.exe block attrs <块ID>

# 获取特定属性
snmcli.exe block attrs <块ID> alias

# 设置块属性
snmcli.exe block attrs <块ID> alias "新别名"
snmcli.exe block attrs <块ID> memo "这是备注"
```

### 7. 获取反向链接
查看哪些块引用了当前块：

```bash
# 获取块的反向链接
snmcli.exe block backlink <块ID>
```

### 8. 插入子文档
在已有文档下创建子文档：

```bash
# 在父文档下创建子文档
snmcli.exe doc insert <笔记本ID> "/父文档路径" "/子文档" "# 子文档标题\n\n内容"
```

### 9. 导出标准 Markdown（v1.0.2 新增）
将思源 Kramdown 格式转换为标准 Markdown：

```bash
# 导出到 stdout
snmcli.exe doc export-md <文档ID>

# 导出到文件
snmcli.exe doc export-md <文档ID> --file output.md

# 标签转为 YAML frontmatter
snmcli.exe doc export-md <文档ID> --tag-mode yaml

# 引用转为链接
snmcli.exe doc export-md <文档ID> --ref-mode link
```

## 注意事项

1. **API Token**: 思源笔记需要 API Token 才能通过 API 操作。在思源笔记设置 → 关于 → 复制 API Token。
2. **端口**: 默认 API 端口是 6806，如果修改过需要通过 `--endpoint` 指定。
3. **块 ID**: 思源笔记使用块 ID 作为唯一标识，可以通过 SQL 查询或 `snmcli.exe doc path <id>` 获取。
4. **SQL 查询**: 思源的 SQL 查询功能强大但有一定学习成本，参考思源官方文档了解更多。
5. **终端乱码**: 如果终端显示表格时出现乱码，使用 `-p` 或 `--plain` 选项切换到纯文本输出。

## OpenClaw 使用指南

### 为什么使用 JSON 格式？

在 OpenClaw（AI Agent）中调用 snmcli 时，**强烈建议使用 `-f json` 或 `-p` 参数**：

```bash
snmcli.exe -t YOUR_TOKEN notebook list -f json
snmcli.exe -t YOUR_TOKEN doc get <id> -p
snmcli.exe -t YOUR_TOKEN block attrs <id> -f json
```

原因：
1. **AI 可解析**：JSON 是结构化数据，AI 可以直接提取字段值
2. **避免终端乱码**：`-p` 参数使用纯文本输出，避免表格边框字符导致解析错误
3. **标准化输出**：不同命令返回统一的数据结构

### 各命令的 JSON 输出格式

#### 1. 笔记本列表
```bash
snmcli.exe -t TOKEN notebook list -f json
```
返回：
```json
[
  { "id": "20210817205410-2kvfpfn", "name": "测试笔记本", "icon": "📁", "closed": false },
  { "id": "20210808180117-czj9bvb", "name": "用户指南", "icon": "📚", "closed": false }
]
```
**AI 提取**：`response[0].id` 获取第一个笔记本 ID

#### 2. 文档内容
```bash
snmcli.exe -t TOKEN doc get <文档ID> -p
```
返回思源内部 JSON 格式的文档内容（包含标题和正文块）

#### 3. 块属性
```bash
snmcli.exe -t TOKEN block attrs <块ID> -f json
```
返回：
```json
{
  "alias": "别名",
  "memo": "备注",
  "id": "块ID",
  "updated": "更新时间"
}
```
**AI 提取**：`response.alias` 获取别名

#### 4. 反向链接
```bash
snmcli.exe -t TOKEN block backlink <块ID> -f json
```
返回：
```json
{
  "backlinks": [
    { "id": "引用块ID", "content": "引用内容", "path": "/文档路径" }
  ]
}
```
**AI 提取**：`response.backlinks[0].content` 获取第一个引用内容

#### 5. SQL 查询结果
```bash
snmcli.exe -t TOKEN query "SELECT id, content FROM blocks LIMIT 5" -f json
```
返回：
```json
[
  { "id": "块ID1", "content": "内容1", ... },
  { "id": "块ID2", "content": "内容2", ... }
]
```

### OpenClaw 调用示例

在 OpenClaw 中，AI 可以这样使用：

```bash
# 1. 获取笔记本列表 → 提取笔记本 ID
NOTEBOOKS=$(snmcli.exe -t TOKEN notebook list -f json)
# AI 解析：找到名为"工作"的笔记本 ID

# 2. 创建文档
snmcli.exe -t TOKEN doc create <笔记本ID> "/笔记" "# 标题\n\n内容"

# 3. 获取文档内容
CONTENT=$(snmcli.exe -t TOKEN doc get <文档ID> -p)
# AI 解析：提取文档的实际文本内容

# 4. 追加内容到文档
snmcli.exe -t TOKEN block append <文档ID> "\n\n新段落"
```

### 常用自动化流程

```bash
# 流程1：查找特定文档并读取内容
DOC_ID=$(snmcli.exe -t TOKEN query "SELECT id FROM blocks WHERE hpath LIKE '%关键词%' LIMIT 1" -f json | jq -r '.[0].id')
snmcli.exe -t TOKEN doc get $DOC_ID -p

# 流程2：获取文档的所有子块
DOC_BLOCK_ID=$(snmcli.exe -t TOKEN query "SELECT id FROM blocks WHERE hpath = '/目标文档' AND type = 'd' LIMIT 1" -f json | jq -r '.[0].id')
snmcli.exe -t TOKEN block children $DOC_BLOCK_ID -f json

# 流程3：搜索并列出结果
snmcli.exe -t TOKEN query "SELECT id, content FROM blocks WHERE content LIKE '%搜索词%' LIMIT 10" -f json
```

## 参考链接

- [思源笔记官方仓库](https://github.com/siyuan-note/siyuan)
- [思源笔记 API 文档](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
- [SiYuan CLI 仓库](https://github.com/your-username/snmcli)
