# SNMCLI 文档导出功能开发说明

## 1. 需求背景

### 1.1 问题描述
思源笔记内部使用专有格式存储文档（基于 Kramdown 的扩展），直接通过 API 获取的内容是思源内部 JSON 格式，包含大量 HTML 标签和思源特有的属性（如 `data-node-id`、`data-type` 等），无法直接作为 Markdown 使用。

### 1.2 目标
在 snmcli 中集成文档导出功能，支持：
- 将思源文档导出为标准 Markdown
- 保留文档结构和格式
- 支持批量导出
- **不自动打标签**（保持工具纯粹性，标签由用户自行管理）

### 1.3 使用场景
- 文档备份
- 文档迁移
- AI 重建文档前的格式转换
- 与其他 Markdown 工具集成

---

## 2. 技术方案

### 2.1 方案选择：集成到 snmcli 中

**原因：**
1. **用户体验**：一个工具完成所有操作，无需切换
2. **配置复用**：复用 snmcli 已有的 token 和 endpoint 配置
3. **命令一致性**：与其他 snmcli 命令保持相同的使用风格
4. **分发便利**：单个可执行文件，便于部署

### 2.2 核心流程

```
用户输入: snmcli doc export-md <doc-id>

1. 调用思源 API 获取文档原始内容 (getDoc)
2. 解析思源内部格式 (JSON + HTML)
3. 转换为标准 Markdown
4. 输出到文件或 stdout
```

---

## 3. 思源文档格式详解

### 3.1 思源内部格式特点

思源笔记文档存储格式特点：
- **文件格式**：`.sy` 文件（实际为 JSON）
- **内容格式**：Kramdown + 自定义扩展
- **API 返回**：包含 HTML 标签和思源特有属性

### 3.2 典型文档结构（API 返回）

```json
{
  "id": "20260219215816-tya2x2w",
  "content": "文档标题",
  "type": "NodeDocument",
  "blockCount": 45,
  // 实际内容在 blocks 数组中
}
```

### 3.3 块类型（Block Types）

思源笔记支持的主要块类型：

| 块类型 | type 值 | Markdown 对应 |
|--------|---------|--------------|
| 文档 | NodeDocument | 顶层容器 |
| 标题 | NodeHeading | # ## ###... |
| 段落 | NodeParagraph | 普通文本 |
| 列表 | NodeList | - 1. |
| 列表项 | NodeListItem | 列表条目 |
| 代码块 | NodeCodeBlock | ``` |
| 引用块 | NodeBlockquote | > |
| 表格 | NodeTable | \| 表格 \| |
| 分隔线 | NodeThematicBreak | --- |
| 数学公式 | NodeMathBlock | $$ |
| 嵌入块 | NodeBlockEmbed | ![[id]] |

### 3.4 思源特有的 Kramdown 语法

思源在标准 Kramdown 基础上扩展了以下语法：

#### 3.4.1 虚拟引用（Virtual Block Ref）
```
((20260219215816-tya2x2w))
```
表示引用另一个块的内容。

#### 3.4.2 块引用（Block Embed）
```
!((20260219215816-tya2x2w))
```
嵌入另一个块的内容。

#### 3.4.3 标签（Tag）
```
#标签名
```
思源使用 `#` 作为标签语法，与 Markdown 标题冲突，需要转义处理。

#### 3.4.4 提及（Mention）
```
@用户名
```
引用用户。

### 3.5 思源官方导出 API

思源官方提供导出 Markdown 的 API：

**接口**：`POST /api/export/exportMdContent`

**参数**：
```json
{
  "id": "文档ID"
}
```

**返回**：
```json
{
  "code": 0,
  "msg": "",
  "data": {
    "content": "导出的 Markdown 内容"
  }
}
```

**注意**：
- 此 API 导出的是思源内部 Kramdown 格式，不是标准 Markdown
- 包含思源特有的语法（如 `((id))`、`#标签` 等）

---

## 4. 转换策略

### 4.1 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| 直接调用官方 exportMdContent API | 简单，思源官方支持 | 导出的是 Kramdown，需二次转换 |
| 解析 getDoc 返回的 JSON | 结构完整，信息丰富 | 需要处理大量 HTML 标签 |
| 使用 Pandoc 转换 | 转换质量高 | 需要额外安装 Pandoc |

### 4.2 推荐方案：官方 API + 格式转换

**步骤**：
1. 调用 `/api/export/exportMdContent` 获取 Kramdown
2. 将 Kramdown 转换为标准 Markdown
3. 处理思源特有的语法

### 4.3 需要处理的转换

#### 4.3.1 标题转换
思源 Kramdown：
```
# 标题 {# custom-id}
```

标准 Markdown：
```markdown
# 标题
```

#### 4.3.2 标签转换
思源 Kramdown（行内标签）：
```
这是一段文字 #标签
```

标准 Markdown（需要转义）：
```markdown
这是一段文字 \#标签
```

或转换为 YAML frontmatter：
```markdown
---
tags: [标签]
---
```

#### 4.3.3 虚拟引用转换
思源 Kramdown：
```
((20260219215816-tya2x2w))
```

标准 Markdown（可选方案）：
- 方案1：保留原样（在思源外无法解析）
- 方案2：转换为链接 `[引用](siyuan://20260219215816-tya2x2w)`
- 方案3：展开为引用内容（需要递归获取）

#### 4.3.4 块嵌入转换
思源 Kramdown：
```
!((20260219215816-tya2x2w))
```

标准 Markdown：
- 方案1：保留原样
- 方案2：展开为嵌入内容

### 4.4 特殊字符处理

#### 4.4.1 路径中的特殊字符
思源路径（hpath）中可能包含：
- 圆形符号：`•`（如 `软件工程与架构•software_engineering_and_architecture`）
- Emoji 图标：📁、💻 等
- 特殊空格：全角空格、不间断空格

**处理方式**：
- 圆形符号保留原文
- Emoji 根据配置选择保留或移除
- 特殊空格统一为普通空格

#### 4.4.2 Markdown 转义字符
以下字符在 Markdown 中有特殊含义，需要转义：
```
\ ` * _ { } [ ] ( ) # + - . ! | ~ < >
```

但在代码块中不需要转义。

---

## 5. API 接口设计

### 5.1 新增命令

```bash
# 导出单个文档为 Markdown
snmcli doc export-md <doc-id> [--file <path>] [--format <format>]

# 批量导出笔记本中的所有文档
snmcli notebook export-md <notebook-id> [--dir <directory>]
```

### 5.2 参数说明

#### doc export-md

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `doc-id` | 文档 ID（必填） | - |
| `--file` | 输出文件路径 | stdout |
| `--format` | 导出格式：`standard`（标准 Markdown）、`kramdown`（保留思源语法） | `standard` |
| `--with-meta` | 是否包含 YAML frontmatter（标题、标签等） | `false` |

#### notebook export-md

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `notebook-id` | 笔记本 ID（必填） | - |
| `--dir` | 输出目录 | 当前目录 |
| `--structure` | 是否保持目录结构 | `true` |

### 5.3 返回值格式

成功时返回：
```json
{
  "code": 0,
  "msg": "导出成功",
  "data": {
    "docId": "20260219215816-tya2x2w",
    "title": "文档标题",
    "outputPath": "/path/to/output.md",
    "format": "standard",
    "charCount": 12580
  }
}
```

---

## 6. 实现细节

### 6.1 核心类设计

```typescript
// src/utils/markdown-converter.ts

export class MarkdownConverter {
  /**
   * 将思源 Kramdown 转换为标准 Markdown
   */
  static convertFromKramdown(kramdown: string, options?: ConvertOptions): string {
    // 1. 处理标题
    let markdown = this.convertHeadings(kramdown);
    
    // 2. 处理标签
    markdown = this.convertTags(markdown, options?.tagMode);
    
    // 3. 处理虚拟引用
    markdown = this.convertBlockRefs(markdown, options?.refMode);
    
    // 4. 处理块嵌入
    markdown = this.convertBlockEmbeds(markdown, options?.embedMode);
    
    // 5. 清理其他语法
    markdown = this.cleanupSyntax(markdown);
    
    return markdown;
  }
  
  /**
   * 添加 YAML frontmatter
   */
  static addFrontmatter(markdown: string, meta: DocMeta): string {
    const frontmatter = [
      '---',
      `title: ${meta.title}`,
      meta.tags ? `tags: [${meta.tags.join(', ')}]` : '',
      `created: ${meta.created}`,
      `updated: ${meta.updated}`,
      '---',
      '',
      markdown
    ].filter(Boolean).join('\n');
    
    return frontmatter;
  }
}
```

### 6.2 转换选项

```typescript
interface ConvertOptions {
  // 标签处理方式
  // - 'escape': 转义为 \#标签
  // - 'yaml': 提取到 YAML frontmatter
  // - 'remove': 移除
  tagMode?: 'escape' | 'yaml' | 'remove';
  
  // 虚拟引用处理方式
  // - 'keep': 保留原样
  // - 'link': 转换为链接
  // - 'expand': 展开内容
  refMode?: 'keep' | 'link' | 'expand';
  
  // 块嵌入处理方式
  embedMode?: 'keep' | 'expand';
  
  // 是否包含元数据
  includeMeta?: boolean;
  
  // 是否移除 Emoji 图标
  removeEmoji?: boolean;
}
```

### 6.3 路径处理

```typescript
// 处理思源路径中的特殊字符
export function sanitizePath(hpath: string): string {
  return hpath
    // 保留圆形符号
    .replace(/•/g, '•')
    // 将特殊空格转为普通空格
    .replace(/\u00A0/g, ' ')
    .replace(/\u3000/g, ' ')
    // 移除或替换文件系统不支持的字符
    .replace(/[\\/:*?"<>|]/g, '_');
}
```

---

## 7. 注意事项

### 7.1 思源特有功能无法完全转换

以下思源特有功能在标准 Markdown 中无对应实现：
- 块引用（虚拟引用和嵌入）
- 数据库视图
- 关系图
- 嵌入的 PDF/视频等

**处理建议**：
- 保留原始语法（用户可在思源中重新打开）
- 或转换为链接形式
- 在导出文档中添加说明

### 7.2 标签冲突

思源使用 `#标签` 语法，与 Markdown 标题 `# 标题` 冲突。

**解决方案**：
- 标签在行首时必须转义
- 标签在行内时根据上下文判断
- 建议将标签提取到 YAML frontmatter

### 7.3 图片和资源文件

思源文档中的图片以相对路径引用：
```markdown
![图片](assets/xxx.png)
```

**导出时需要**：
- 复制资源文件到输出目录
- 或使用绝对路径

### 7.4 性能考虑

- 大文档（>1000 块）可能需要分批处理
- 批量导出时建议限制并发数
- 缓存已转换的文档避免重复处理

---

## 8. 测试建议

### 8.1 测试用例

| 测试项 | 测试内容 |
|--------|----------|
| 基础转换 | 标题、段落、列表、代码块 |
| 特殊语法 | 标签、虚拟引用、块嵌入 |
| 复杂文档 | 包含多种块类型的大文档 |
| 边界情况 | 空文档、只有标题、只有代码块 |
| 路径处理 | 包含特殊字符的路径 |
| 错误处理 | 无效 doc-id、网络错误 |

### 8.2 兼容性测试

测试导出的 Markdown 在以下工具中的显示效果：
- VS Code + Markdown 插件
- Typora
- Obsidian
- GitHub/GitLab

---

## 9. 实现步骤

### Phase 1: MVP（最小可用产品）
1. 实现 `doc export-md` 命令基础框架
2. 调用思源官方 `/api/export/exportMdContent` API
3. 简单转换（处理标题、标签转义）
4. 输出到文件或 stdout

### Phase 2: 完善转换逻辑
1. 完整实现 Kramdown → Markdown 转换器
2. 支持所有块类型
3. 实现转换选项（--format、--with-meta）
4. 处理虚拟引用和块嵌入

### Phase 3: 批量导出
1. 实现 `notebook export-md` 命令
2. 保持目录结构
3. 复制资源文件
4. 进度显示

### Phase 4: 优化
1. 性能优化（缓存、并发控制）
2. 错误处理和重试机制
3. 日志和调试功能
4. 文档和示例

---

## 10. 参考资源

### 思源官方资源
- [思源笔记 API 文档](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
- [Kramdown 官方文档](https://kramdown.gettalong.org/)
- [思源笔记 GitHub 仓库](https://github.com/siyuan-note/siyuan)

### Markdown 规范
- [CommonMark 规范](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

### 相关库
- [marked](https://github.com/markedjs/marked) - Markdown 解析器
- [turndown](https://github.com/domchristie/turndown) - HTML to Markdown 转换器

---

## 11. 附录：思源 API 关键接口

### 获取文档内容
```
POST /api/filetree/getDoc
参数: { "id": "文档ID" }
```

### 导出 Markdown
```
POST /api/export/exportMdContent
参数: { "id": "文档ID" }
```

### 获取块 Kramdown
```
POST /api/block/getBlockKramdown
参数: { "id": "块ID" }
```

---

**文档版本**: v1.0  
**创建日期**: 2026-02-24  
**作者**: snmcli 开发团队
