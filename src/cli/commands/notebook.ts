import yargs from 'yargs/yargs';
import { loadConfig, Config } from '../../config';
import { formatNotebooks, formatSuccess, formatError } from '../../utils/formatter';
import { SiYuanClient } from '../../api/client';

/**
 * 笔记本命令模块
 */
export class NotebookCommand {
  /**
   * 列出所有笔记本
   */
  static list = {
    describe: '列出所有笔记本',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        // 如果 CLI 参数中指定了 format，优先使用
        if (argv.format) {
          config.outputFormat = argv.format;
        }
        const client = new SiYuanClient(config);
        const result = await client.listNotebooks();
        formatNotebooks(result, config.outputFormat || 'table');
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 创建笔记本
   */
  static create = {
    describe: '创建笔记本 <name>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        const result = await client.createNotebook(argv.name);
        formatSuccess(`已创建笔记本: ${argv.name}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 删除笔记本
   */
  static delete = {
    describe: '删除笔记本 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        await client.removeNotebook(argv.id);
        formatSuccess(`已删除笔记本: ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 重命名笔记本
   */
  static rename = {
    describe: '重命名笔记本 <id> <name>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        await client.renameNotebook(argv.id, argv.name);
        formatSuccess(`已重命名笔记本: ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 打开笔记本
   */
  static open = {
    describe: '打开笔记本 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        await client.openNotebook(argv.id);
        formatSuccess(`已打开笔记本: ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 关闭笔记本
   */
  static close = {
    describe: '关闭笔记本 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        await client.closeNotebook(argv.id);
        formatSuccess(`已关闭笔记本: ${argv.id}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 获取笔记本配置
   */
  static get = {
    describe: '获取笔记本配置 <id>',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        // 如果 CLI 参数中指定了 format，优先使用
        if (argv.format) {
          config.outputFormat = argv.format;
        }
        const client = new SiYuanClient(config);
        const result = await client.getNotebookConf(argv.id);
        formatNotebooks([result as any], config.outputFormat || 'table');
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };
}
