/**
 * Markdown 转换器 - 将思源 Kramdown 格式转换为标准 Markdown
 */

export interface ConvertOptions {
  // 标签处理方式
  // - 'escape': 转义为 \#标签
  // - 'yaml': 提取到 YAML frontmatter
  // - 'remove': 移除
  tagMode?: 'escape' | 'yaml' | 'remove';

  // 虚拟引用处理方式
  // - 'keep': 保留原样
  // - 'link': 转换为链接
  refMode?: 'keep' | 'link';

  // 块嵌入处理方式
  embedMode?: 'keep' | 'remove';

  // 是否保留 YAML frontmatter
  keepFrontmatter?: boolean;

  // 是否移除 Emoji
  removeEmoji?: boolean;
}

export interface DocMeta {
  title?: string;
  date?: string;
  lastmod?: string;
  tags?: string[];
  id?: string;
}

/**
 * 将思源 Kramdown 转换为标准 Markdown
 */
export function convertFromKramdown(kramdown: string, options: ConvertOptions = {}): string {
  const {
    tagMode = 'escape',
    refMode = 'keep',
    embedMode = 'keep',
    removeEmoji = false,
  } = options;

  let markdown = kramdown;

  // 1. 处理 YAML frontmatter（如果保留）
  // 思源导出的 frontmatter 格式:
  // ---
  // title: xxx
  // date: xxx
  // lastmod: xxx
  // ---
  if (!options.keepFrontmatter) {
    markdown = removeFrontmatter(markdown);
  }

  // 2. 处理 Emoji（可选）
  if (removeEmoji) {
    markdown = removeEmojis(markdown);
  }

  // 3. 处理标题（移除 Kramdown ID）
  markdown = convertHeadings(markdown);

  // 4. 处理标签
  markdown = convertTags(markdown, tagMode);

  // 5. 处理虚拟引用 ((id))
  markdown = convertBlockRefs(markdown, refMode);

  // 6. 处理块嵌入 !((id))
  markdown = convertBlockEmbeds(markdown, embedMode);

  // 7. 清理其他 Kramdown 语法
  markdown = cleanupSyntax(markdown);

  return markdown;
}

/**
 * 移除 YAML frontmatter
 */
function removeFrontmatter(content: string): string {
  // 匹配 --- 包围的 frontmatter
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
  return content.replace(frontmatterRegex, '');
}

/**
 * 移除 Emoji
 */
function removeEmojis(content: string): string {
  // 匹配常见 Emoji 范围
  return content.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
}

/**
 * 转换标题（移除 Kramdown ID）
 * Kramdown: ## 标题 {#custom-id}
 * Markdown: ## 标题
 */
function convertHeadings(content: string): string {
  // 匹配标题后的 {#id} 语法
  return content.replace(/^(#{1,6})\s+(.+?)\s*\{#[^}]+\}\s*$/gm, '$1 $2');
}

/**
 * 转换标签
 * Kramdown: #标签名
 * Markdown (escape): \#标签名
 * Markdown (yaml): 提取到 frontmatter
 */
function convertTags(content: string, mode: 'escape' | 'yaml' | 'remove'): string {
  if (mode === 'remove') {
    // 移除行内标签（#标签）
    return content.replace(/(?<!\w)#[\w\u4e00-\u9fff-]+/g, '');
  }

  if (mode === 'escape') {
    // 转义行首标签（#标签 -> \#标签）
    // 但不转义标题（# 标题）
    return content.replace(/^(#{1,6}\s)(#[\w\u4e00-\u9fff-]+)/gm, '$1\\$2');
  }

  // mode === 'keep' 时保持原样
  return content;
}

/**
 * 转换块引用
 * Kramdown: ((block-id))
 * Markdown: [链接](siyuan://block-id)
 */
function convertBlockRefs(content: string, mode: 'keep' | 'link'): string {
  if (mode === 'keep') {
    return content;
  }

  // 匹配 ((id))
  return content.replace(/\(\(([0-9a-zA-Z-]+)\)\)/g, '[块引用](siyuan://$1)');
}

/**
 * 转换块嵌入
 * Kramdown: !((block-id))
 * Markdown: [嵌入](siyuan://block-id) 或移除
 */
function convertBlockEmbeds(content: string, mode: 'keep' | 'remove'): string {
  if (mode === 'keep') {
    return content;
  }

  // 匹配 !((id))
  return content.replace(/!\(\(([0-9a-zA-Z-]+)\)\)/g, '');
}

/**
 * 清理其他 Kramdown 语法
 */
function cleanupSyntax(content: string): string {
  let result = content;

  // 移除空的 HTML 注释 <!-- -->
  result = result.replace(/<!--\s*-->/g, '');

  // 清理多余的空白行
  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
}

/**
 * 提取 YAML frontmatter 中的标签
 */
export function extractTagsFromFrontmatter(frontmatter: string): string[] {
  const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);
  if (tagsMatch) {
    return tagsMatch[1].split(',').map(t => t.trim());
  }
  return [];
}

/**
 * 解析 YAML frontmatter
 */
export function parseFrontmatter(content: string): { meta: DocMeta; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { meta: {}, body: content };
  }

  const frontmatter = match[1];
  const body = content.slice(match[0].length);

  const meta: DocMeta = {};

  // 解析 title
  const titleMatch = frontmatter.match(/title:\s*(.+)/);
  if (titleMatch) meta.title = titleMatch[1].trim();

  // 解析 date
  const dateMatch = frontmatter.match(/date:\s*(.+)/);
  if (dateMatch) meta.date = dateMatch[1].trim();

  // 解析 lastmod
  const lastmodMatch = frontmatter.match(/lastmod:\s*(.+)/);
  if (lastmodMatch) meta.lastmod = lastmodMatch[1].trim();

  // 解析 tags
  const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);
  if (tagsMatch) {
    meta.tags = tagsMatch[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
  }

  return { meta, body };
}

/**
 * 生成 YAML frontmatter
 */
export function generateFrontmatter(meta: DocMeta): string {
  const lines: string[] = ['---'];

  if (meta.title) {
    lines.push(`title: ${meta.title}`);
  }
  if (meta.date) {
    lines.push(`date: ${meta.date}`);
  }
  if (meta.lastmod) {
    lines.push(`lastmod: ${meta.lastmod}`);
  }
  if (meta.tags && meta.tags.length > 0) {
    lines.push(`tags: [${meta.tags.join(', ')}]`);
  }

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

/**
 * 处理思源路径中的特殊字符
 */
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
