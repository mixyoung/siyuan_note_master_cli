import yargs from 'yargs/yargs';
import { loadConfig, Config } from '../../config';
import { formatBlocks, formatSuccess, formatError } from '../../utils/formatter';
import { SiYuanClient } from '../../api/client';

/**
 * 块命令模块
 */
export class BlockCommand {
  /**
   * 获取块内容
   */
  static get = {
    describe: '获取块内容 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        const result = await client.getBlockKramdown(argv.id);
        console.log(result.kramdown);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 更新块
   */
  static update = {
    describe: '更新块 <id> [content]',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        const dataType = (argv.dataType || 'markdown') as 'markdown' | 'dom';
        let content = argv.content;

        // 如果没有提供内容，从 stdin 读取
        if (!content) {
          const readline = require('readline');
          const lines: string[] = [];
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          for await (const line of rl) {
            lines.push(line);
          }

          content = lines.join('\n');
          rl.close();
        }

        await client.updateBlock({
          id: argv.id,
          dataType,
          data: content,
        });
        formatSuccess(`已更新块 ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 删除块
   */
  static delete = {
    describe: '删除块 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        await client.deleteBlock(argv.id);
        formatSuccess(`已删除块 ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 插入块
   */
  static insert = {
    describe: '插入块 <position> <targetId> <content>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        const dataType = (argv.dataType || 'markdown') as 'markdown' | 'dom';
        const position = argv.position || 'prev';
        let content = argv.content;

        // 如果没有提供内容，从 stdin 读取
        if (!content) {
          const readline = require('readline');
          const lines: string[] = [];
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          for await (const line of rl) {
            lines.push(line);
          }

          content = lines.join('\n');
          rl.close();
        }

        await client.insertBlock({
          dataType,
          data: content,
          previousID: position === 'prev' ? argv.dataTypeargetId : undefined,
          nextID: position === 'next' ? argv.dataTypeargetId : undefined,
        });
        formatSuccess(`已插入块`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 前置插入块（作为第一个子块）
   */
  static prepend = {
    describe: '前置插入块 <parentId> <content>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        const dataType = (argv.dataType || 'markdown') as 'markdown' | 'dom';
        let content = argv.content;

        // 如果没有提供内容，从 stdin 读取
        if (!content) {
          const readline = require('readline');
          const lines: string[] = [];
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          for await (const line of rl) {
            lines.push(line);
          }

          content = lines.join('\n');
          rl.close();
        }

        await client.prependBlock(argv.parentId, dataType, content);
        formatSuccess(`已前置插入块`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 追加子块（作为最后一个子块）
   */
  static append = {
    describe: '追加子块 <parentId> <content>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        const dataType = (argv.dataType || 'markdown') as 'markdown' | 'dom';
        let content = argv.content;

        // 如果没有提供内容，从 stdin 读取
        if (!content) {
          const readline = require('readline');
          const lines: string[] = [];
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          for await (const line of rl) {
            lines.push(line);
          }

          content = lines.join('\n');
          rl.close();
        }

        await client.appendBlock(argv.parentId, dataType, content);
        formatSuccess(`已追加块`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 移动块
   */
  static move = {
    describe: '移动块 <id> <position> <targetId>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        const position = argv.position || 'prev';
        const previousID = position === 'prev' ? argv.dataTypeargetId : undefined;
        const nextID = position === 'next' ? argv.dataTypeargetId : undefined;
        await client.moveBlock(argv.id, previousID, nextID);
        formatSuccess(`已移动块 ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 获取子块
   */
  static children = {
    describe: '获取子块 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        // 如果 CLI 参数中指定了 format，优先使用
        if (argv.format) {
          config.outputFormat = argv.format;
        }
        const client = new SiYuanClient(config);
        const result = await client.getChildBlocks(argv.id);
        formatBlocks(result, config.outputFormat || 'table');
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 折叠块
   */
  static fold = {
    describe: '折叠块 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        await client.foldBlock(argv.id);
        formatSuccess(`已折叠块 ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 展开块
   */
  static unfold = {
    describe: '展开块 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        await client.unfoldBlock(argv.id);
        formatSuccess(`已展开块 ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 获取块属性
   */
  static attrs = {
    describe: '获取/设置块属性 <id> [key] [value] (注意: 文档块id在type=d的块,标题块id在type=h的块)',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        // 如果 CLI 参数中指定了 format，优先使用
        if (argv.format) {
          config.outputFormat = argv.format;
        }
        const client = new SiYuanClient(config);

        if (argv.key && argv.value) {
          // 设置块属性
          const attrs: Record<string, string> = {};
          attrs[argv.key] = argv.value;
          await client.setBlockAttrs(argv.id, attrs);
          formatSuccess(`已设置块 ${argv.id} 的属性 ${argv.key}=${argv.value}`);
        } else if (argv.key) {
          // 获取指定属性
          const attrs = await client.getBlockAttrs(argv.id);
          console.log(attrs[argv.key] || '');
        } else {
          // 获取所有属性
          const attrs = await client.getBlockAttrs(argv.id);
          if (config.outputFormat === 'json' || argv.plain) {
            console.log(JSON.stringify(attrs, null, 2));
          } else {
            console.log(JSON.stringify(attrs, null, 2));
          }
        }
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 获取反向链接
   */
  static backlink = {
    describe: '获取反向链接 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        // 如果 CLI 参数中指定了 format，优先使用
        if (argv.format) {
          config.outputFormat = argv.format;
        }
        const client = new SiYuanClient(config);
        const result = await client.listBacklink(argv.id);

        if (config.outputFormat === 'json' || argv.plain) {
          console.log(JSON.stringify(result, null, 2));
        } else if (result.backlinks && result.backlinks.length > 0) {
          console.log(`找到 ${result.backlinks.length} 个反向链接:`);
          result.backlinks.forEach((link: { id: string; content: string; path: string }) => {
            console.log(`- ${link.id}: ${link.content.substring(0, 50)}... (${link.path})`);
          });
        } else {
          console.log('没有找到反向链接');
        }
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };
}
