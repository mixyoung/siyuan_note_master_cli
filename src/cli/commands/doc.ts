import yargs from 'yargs/yargs';
import { loadConfig, Config } from '../../config';
import { SiYuanClient } from '../../api/client';
import { getIDsByHPath, moveDocsByID } from '../../api/document';
import { formatSuccess, formatError } from '../../utils/formatter';
import { convertFromKramdown, parseFrontmatter } from '../../utils/markdown-converter';
import path from 'path';

/**
 * 规范化文档路径
 * 处理 Windows 上的路径解析问题（如 /xxx.sy 被解释为 D:/program_files/Git/xxx.sy）
 */
function normalizeDocPath(inputPath: string): string {
  // 如果路径被错误解析为 Windows 磁盘路径，尝试修复
  // 例如: D:/program_files/Git/20260212105849-ec1xe8g.sy -> /20260212105849-ec1xe8g.sy
  // 或 D:/program_files/Git/parent/child.sy -> /parent/child.sy
  if (/^[A-Z]:\/[^/]/i.test(inputPath)) {
    // 提取路径部分（去掉驱动器前缀）
    // 例如: D:/program_files/Git/parent/child.sy -> /program_files/Git/parent/child.sy
    // 但思源路径是 /parent/child.sy，所以需要进一步处理
    let relativePath = inputPath.replace(/^[A-Z]:\//i, '');
    // 检查是否包含 Git 相关路径，如果是则提取思源相对路径
    if (relativePath.includes('Git/')) {
      const idx = relativePath.indexOf('Git/');
      relativePath = relativePath.substring(idx + 4);
    }
    // 如果结果仍然以目录名开头，尝试直接使用原始输入的尾部
    // 输入: /parent/child.sy 应该返回 /parent/child.sy
    // 但由于 yargs 解析问题，输入可能被解析为 D:/xxx/parent/child.sy
    if (relativePath.startsWith('/')) {
      return relativePath;
    }
    // 如果不包含 Git，直接返回以 / 开头的路径
    if (!inputPath.includes('Git/')) {
      // 提取最后一个路径部分（对于简单路径）
      const match = inputPath.match(/([^\/\\]+)$/);
      if (match) {
        return '/' + match[1];
      }
    }
    // 尝试提取思源路径部分
    const siyuanMatch = inputPath.match(/([^/]+)$/);
    if (siyuanMatch) {
      return '/' + siyuanMatch[1];
    }
  }
  // 确保路径以 / 开头
  if (!inputPath.startsWith('/')) {
    return '/' + inputPath;
  }
  return inputPath;
}

/**
 * 文档命令模块
 */
export class DocCommand {
  /**
   * 创建文档
   */
  static create = {
    describe: '创建文档 <notebook> <path> [markdown]',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        // 获取 markdown 内容：从 markdown 参数或位置参数获取
        let markdown = argv.markdown as string;
        if (!markdown && argv._ && argv._.length > 3) {
          // 从位置参数获取 markdown（跳过命令名、doc、create、notebook、path）
          markdown = argv._.slice(4).join(' ');
        }

        // 如果没有提供 markdown 内容，从 stdin 读取
        if (!markdown) {
          const readline = require('readline');
          const lines: string[] = [];
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          for await (const line of rl) {
            lines.push(line);
          }

          markdown = lines.join('\n');
          rl.close();
        }

        // 规范化路径
        const docPath = normalizeDocPath(argv.path);

        await client.createDoc({
          notebook: argv.notebook,
          path: docPath,
          markdown,
        });

        formatSuccess(`已创建文档: ${argv.path}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 删除文档
   */
  static delete = {
    describe: '删除文档 <notebook> <path>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        await client.deleteDoc({
          notebook: argv.notebook,
          path: normalizeDocPath(argv.path),
        });

        formatSuccess(`已删除文档: ${argv.path}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 按 ID 删除文档
   */
  static deleteById = {
    describe: '按 ID 删除文档 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        await client.deleteDocByID(argv.id);

        formatSuccess(`已删除文档: ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 重命名文档
   */
  static rename = {
    describe: '重命名文档 <notebook> <path> <title>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        await client.renameDoc({
          notebook: argv.notebook,
          path: normalizeDocPath(argv.path),
          title: argv.title,
        });

        formatSuccess(`已重命名文档: ${argv.path}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 重命名文档（通过 ID）
   */
  static renameById = {
    describe: '重命名文档 <id> <title>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        await client.renameDoc({
          doc: argv.id,
          title: argv.title,
        });

        formatSuccess(`已重命名文档: ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 移动文档
   */
  static move = {
    describe: '移动文档 <fromNotebook> <fromPath> <toNotebook> <toPath>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        await client.moveDoc({
          fromNotebook: argv.fromNotebook,
          fromPath: normalizeDocPath(argv.fromPath),
          toNotebook: argv.toNotebook,
          toPath: normalizeDocPath(argv.toPath),
        });

        formatSuccess(`已移动文档: ${argv.fromPath} -> ${argv.toPath}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 移动文档（通过 ID）
   */
  static moveById = {
    describe: '移动文档 <fromId> <toNotebook> <toPath>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        await client.moveDoc({
          fromDoc: argv.fromId,
          toNotebook: argv.toNotebook,
          toPath: normalizeDocPath(argv.toPath),
        });

        formatSuccess(`已移动文档 ID: ${argv.fromId}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 导出文档
   */
  static export = {
    describe: '导出文档 <id> [options]',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        const data = await client.exportMdContent({
          id: argv.id,
        });

        if (argv.path && argv.path !== '-') {
          const fs = require('fs');
          const outputPath = path.resolve(argv.path);
          fs.writeFileSync(outputPath, data.content || '', 'utf-8');
          formatSuccess(`已导出文档到: ${outputPath}`);
        } else {
          console.log(data.content || '');
        }
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 导出文档为标准 Markdown（使用转换器）
   */
  static exportMd = {
    describe: '导出为标准 Markdown <id> [options]',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        // 1. 获取原始内容
        const data = await client.exportMdContent({
          id: argv.id,
        });

        // 2. 解析 frontmatter 和 body
        const { meta, body } = parseFrontmatter(data.content || '');

        // 3. 转换为标准 Markdown
        const markdown = convertFromKramdown(body, {
          tagMode: argv['tag-mode'] || 'escape',
          refMode: argv['ref-mode'] || 'keep',
          keepFrontmatter: argv['keep-frontmatter'] ?? true,
        });

        // 4. 输出
        if (argv.file && argv.file !== '-') {
          const fs = require('fs');
          const outputPath = path.resolve(argv.file);
          fs.writeFileSync(outputPath, markdown, 'utf-8');
          formatSuccess(`已导出文档到: ${outputPath}`);
        } else {
          console.log(markdown);
        }
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 获取文档路径
   */
  static path = {
    describe: '获取文档路径 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        const result = await client.getHPathByID(argv.id);

        console.log(result || '');
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 获取文档内容
   */
  static get = {
    describe: '获取文档内容 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        // 如果 CLI 参数中指定了 format，优先使用
        if (argv.format) {
          config.outputFormat = argv.format;
        }
        const client = new SiYuanClient(config);
        const result = await client.getDoc(argv.id);

        // 如果指定了输出格式
        if (config.outputFormat === 'json' || argv.plain) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(result.content || '');
        }
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 插入文档（在指定文档下创建子文档）
   */
  static insert = {
    describe: '插入子文档 <notebook> <parentPath> <path> [markdown]',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);

        // 获取 markdown 内容
        let markdown = argv.markdown as string;
        if (!markdown && argv._ && argv._.length > 4) {
          markdown = argv._.slice(4).join(' ');
        }

        // 规范化路径
        const parentPath = normalizeDocPath(argv.parentPath);
        const childPath = normalizeDocPath(argv.path);

        // 提取子文档名称（去掉前缀 / 和 .sy 后缀）
        const childName = childPath.replace(/^\//, '').replace(/\.sy$/, '');

        let parentId: string | null = null;

        // 如果有父路径且不是根路径，获取父文档 ID
        if (parentPath && parentPath !== '/') {
          const parentIds = await getIDsByHPath(client, parentPath, argv.notebook);
          if (parentIds && parentIds.length > 0) {
            parentId = parentIds[0];
          }
        }

        // 构造完整的人类可读路径
        const fullPath = parentPath && parentPath !== '/'
          ? `${parentPath}/${childName}`
          : `/${childName}`;

        // 第一步：使用 createDocWithMd API 创建文档
        const newDocId = await client.createDoc({
          notebook: argv.notebook,
          path: fullPath,
          markdown: markdown || '',
        });

        // 第二步：如果有父文档，使用 moveDocsByID 建立父子关系
        if (parentId) {
          await moveDocsByID(client, {
            fromIDs: [newDocId],
            toID: parentId,
          });
        }

        formatSuccess(`已插入文档: ${fullPath} (ID: ${newDocId})`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };
}
