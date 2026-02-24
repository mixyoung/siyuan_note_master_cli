#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { loadConfig, Config } from '../config';
import { formatError, formatInfo } from '../utils/formatter';
import { NotebookCommand } from './commands/notebook';
import { DocCommand } from './commands/doc';
import { BlockCommand } from './commands/block';
import { SearchCommand } from './commands/search';
import { ConfigCommand } from './commands/config';

// 构建 yargs 实例
const y = yargs(process.argv.slice(2))
  .scriptName('snmcli')
  .usage('$0 <命令> [参数]')
  .demandCommand(1)
  .help('h')
  .alias('help', 'h')
  .version('1.0.2')
  .alias('version', 'V')
  .option('endpoint', {
    alias: 'e',
    describe: '思源 API 端点',
    type: 'string',
    default: 'http://127.0.0.1:6806',
  })
  .option('token', {
    alias: 't',
    describe: 'API 认证令牌',
    type: 'string',
  })
  .option('format', {
    alias: 'f',
    describe: '输出格式',
    choices: ['table', 'json', 'markdown'] as const,
    default: 'table',
  })
  .option('plain', {
    alias: 'p',
    describe: '使用纯文本输出（避免终端乱码）',
    type: 'boolean',
    default: false,
  })
  .option('config', {
    alias: 'c',
    describe: '配置文件路径',
    type: 'string',
  })
  .option('verbose', {
    alias: 'v',
    describe: '显示详细信息',
    type: 'boolean',
    default: false,
  });

// Notebook 命令组
y.command({
  command: 'notebook',
  describe: '笔记本操作',
  builder: (yargs) => {
    return yargs
      .option('plain', {
        alias: 'p',
        describe: '使用纯文本输出（避免终端乱码）',
        type: 'boolean',
        default: false,
      })
      .option('format', {
        alias: 'f',
        describe: '输出格式',
        choices: ['table', 'json', 'markdown'] as const,
        default: 'table',
      })
      .command('list', '列出所有笔记本', {}, NotebookCommand.list.handler)
      .command('create <name>', '创建笔记本', {
        name: {
          type: 'string',
          demandOption: true,
          describe: '笔记本名称',
        },
      }, NotebookCommand.create.handler)
      .command('delete <id>', '删除笔记本', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
      }, NotebookCommand.delete.handler)
      .command('rename <id> <name>', '重命名笔记本', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
        name: {
          type: 'string',
          demandOption: true,
          describe: '新名称',
        },
      }, NotebookCommand.rename.handler)
      .command('open <id>', '打开笔记本', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
      }, NotebookCommand.open.handler)
      .command('close <id>', '关闭笔记本', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
      }, NotebookCommand.close.handler)
      .command('get <id>', '获取笔记本配置', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
      }, NotebookCommand.get.handler)
      .demandCommand(1);
  },
  handler: () => {
    y.showHelp();
  },
});

// Document 命令组
y.command({
  command: 'doc',
  describe: '文档操作',
  builder: (yargs) => {
    return yargs
      .option('plain', {
        alias: 'p',
        describe: '使用纯文本输出（避免终端乱码）',
        type: 'boolean',
        default: false,
      })
      .option('format', {
        alias: 'f',
        describe: '输出格式',
        choices: ['table', 'json', 'markdown'] as const,
        default: 'table',
      })
      .command('create <notebook> <path> [markdown]', '创建文档', {
        notebook: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
        path: {
          type: 'string',
          demandOption: true,
          describe: '文档路径',
        },
        markdown: {
          type: 'string',
          describe: 'Markdown 内容（可选）',
        },
      }, DocCommand.create.handler)
      .command('delete <notebook> <path>', '删除文档', {
        notebook: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
        path: {
          type: 'string',
          demandOption: true,
          describe: '文档路径',
        },
      }, DocCommand.delete.handler)
      .command('delete-id <id>', '按 ID 删除文档', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '文档 ID',
        },
      }, DocCommand.deleteById.handler)
      .command('rename <notebook> <path> <title>', '重命名文档', {
        notebook: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
        path: {
          type: 'string',
          demandOption: true,
          describe: '文档路径',
        },
        title: {
          type: 'string',
          demandOption: true,
          describe: '新标题',
        },
      }, DocCommand.rename.handler)
      .command('rename-id <id> <title>', '按 ID 重命名文档', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '文档 ID',
        },
        title: {
          type: 'string',
          demandOption: true,
          describe: '新标题',
        },
      }, DocCommand.renameById.handler)
      .command('move <fromNotebook> <fromPath> <toNotebook> <toPath>', '移动文档', {
        fromNotebook: {
          type: 'string',
          demandOption: true,
          describe: '源笔记本 ID',
        },
        fromPath: {
          type: 'string',
          demandOption: true,
          describe: '源文档路径',
        },
        toNotebook: {
          type: 'string',
          demandOption: true,
          describe: '目标笔记本 ID',
        },
        toPath: {
          type: 'string',
          demandOption: true,
          describe: '目标文档路径',
        },
      }, DocCommand.move.handler)
      .command('move-id <fromId> <toNotebook> <toPath>', '按 ID 移动文档', {
        fromId: {
          type: 'string',
          demandOption: true,
          describe: '源文档 ID',
        },
        toNotebook: {
          type: 'string',
          demandOption: true,
          describe: '目标笔记本 ID',
        },
        toPath: {
          type: 'string',
          demandOption: true,
          describe: '目标文档路径',
        },
      }, DocCommand.moveById.handler)
      .command('export <id>', '导出文档', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '文档 ID',
        },
        path: {
          type: 'string',
          describe: '输出文件路径（可选，- 表示输出到 stdout）',
        },
      }, DocCommand.export.handler)
      .command('export-md <id>', '导出为标准 Markdown（转换器）', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '文档 ID',
        },
        file: {
          type: 'string',
          describe: '输出文件路径（可选，- 表示输出到 stdout）',
        },
        'tag-mode': {
          type: 'string',
          describe: '标签处理方式: escape|yaml|remove',
          default: 'escape',
        },
        'ref-mode': {
          type: 'string',
          describe: '引用处理方式: keep|link',
          default: 'keep',
        },
        'keep-frontmatter': {
          type: 'boolean',
          describe: '保留 YAML frontmatter',
          default: true,
        },
      }, DocCommand.exportMd.handler)
      .command('path <id>', '获取文档路径', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '文档 ID',
        },
      }, DocCommand.path.handler)
      .command('get <id>', '获取文档内容', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '文档 ID',
        },
      }, DocCommand.get.handler)
      .command('insert <notebook> <parentPath> <path> [markdown]', '插入子文档', {
        notebook: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
        parentPath: {
          type: 'string',
          demandOption: true,
          describe: '父文档路径',
        },
        path: {
          type: 'string',
          demandOption: true,
          describe: '新文档路径',
        },
        markdown: {
          type: 'string',
          describe: 'Markdown 内容（可选）',
        },
      }, DocCommand.insert.handler)
      .demandCommand(1);
  },
  handler: () => {
    y.showHelp();
  },
});

// Block 命令组
y.command({
  command: 'block',
  describe: '块操作',
  builder: (yargs) => {
    return yargs
      .option('plain', {
        alias: 'p',
        describe: '使用纯文本输出（避免终端乱码）',
        type: 'boolean',
        default: false,
      })
      .option('format', {
        alias: 'f',
        describe: '输出格式',
        choices: ['table', 'json', 'markdown'] as const,
        default: 'table',
      })
      .command('get <id>', '获取块内容', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '块 ID',
        },
      }, BlockCommand.get.handler)
      .command('update <id>', '更新块', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '块 ID',
        },
        content: {
          type: 'string',
          describe: '块内容',
        },
        dataType: {
          type: 'string',
          describe: '数据类型 (markdown/dom)',
          default: 'markdown',
        },
      }, BlockCommand.update.handler)
      .command('delete <id>', '删除块', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '块 ID',
        },
      }, BlockCommand.delete.handler)
      .command('insert <position> <targetId>', '插入块', {
        position: {
          type: 'string',
          describe: '位置 (prev/next)',
        },
        targetId: {
          type: 'string',
          describe: '目标块 ID',
        },
        content: {
          type: 'string',
          describe: '块内容',
        },
        dataType: {
          type: 'string',
          describe: '数据类型 (markdown/dom)',
          default: 'markdown',
        },
      }, BlockCommand.insert.handler)
      .command('prepend <parentId>', '前置插入块', {
        parentId: {
          type: 'string',
          demandOption: true,
          describe: '父块 ID',
        },
        content: {
          type: 'string',
          describe: '块内容',
        },
        dataType: {
          type: 'string',
          describe: '数据类型 (markdown/dom)',
          default: 'markdown',
        },
      }, BlockCommand.prepend.handler)
      .command('append <parentId>', '追加子块', {
        parentId: {
          type: 'string',
          demandOption: true,
          describe: '父块 ID',
        },
        content: {
          type: 'string',
          describe: '块内容',
        },
        dataType: {
          type: 'string',
          describe: '数据类型 (markdown/dom)',
          default: 'markdown',
        },
      }, BlockCommand.append.handler)
      .command('move <id> <position> <targetId>', '移动块', {
        id: {
          type: 'string',
          describe: '块 ID',
        },
        position: {
          type: 'string',
          describe: '位置 (prev/next)',
        },
        targetId: {
          type: 'string',
          describe: '目标块 ID',
        },
      }, BlockCommand.move.handler)
      .command('children <id>', '获取子块', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '块 ID',
        },
      }, BlockCommand.children.handler)
      .command('fold <id>', '折叠块', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '块 ID',
        },
      }, BlockCommand.fold.handler)
      .command('unfold <id>', '展开块', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '块 ID',
        },
      }, BlockCommand.unfold.handler)
      .command('attrs <id> [key] [value]', '获取/设置块属性', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '块 ID',
        },
        key: {
          type: 'string',
          describe: '属性名（可选，不提供则获取所有属性）',
        },
        value: {
          type: 'string',
          describe: '属性值（可选，提供则设置属性）',
        },
      }, BlockCommand.attrs.handler)
      .command('backlink <id>', '获取反向链接', {
        id: {
          type: 'string',
          demandOption: true,
          describe: '块或文档 ID',
        },
      }, BlockCommand.backlink.handler)
      .demandCommand(1);
  },
  handler: () => {
    y.showHelp();
  },
});

// Search 命令
y.command({
  command: 'query [sql]',
  describe: '执行 SQL 查询',
  builder: (yargs) => {
    return yargs
      .positional('sql', {
        describe: 'SQL 查询语句',
        type: 'string',
      })
      .option('plain', {
        alias: 'p',
        describe: '使用纯文本输出（避免终端乱码）',
        type: 'boolean',
        default: false,
      })
      .option('format', {
        alias: 'f',
        describe: '输出格式',
        choices: ['table', 'json', 'markdown'] as const,
        default: 'table',
      })
      .option('query', {
        type: 'string',
        describe: 'SQL 查询语句',
      });
  },
  handler: async (argv: any) => {
    const query = argv.query || argv.sql || argv._[0];
    if (query) {
      const config = await loadConfig(argv);
      // 如果 CLI 参数中指定了 format，优先使用
      if (argv.format) {
        config.outputFormat = argv.format;
      }
      const client = new (await import('../api/client')).SiYuanClient(config);
      const result = await client.sqlQuery(query);
      const { formatOutput } = await import('../utils/formatter');
      formatOutput(result, config.outputFormat || 'table');
    } else {
      y.showHelp();
    }
  },
});

// Asset 命令
y.command({
  command: 'asset',
  describe: '资源管理',
  builder: (yargs) => {
    return yargs
      .option('plain', {
        alias: 'p',
        describe: '使用纯文本输出（避免终端乱码）',
        type: 'boolean',
        default: false,
      })
      .option('format', {
        alias: 'f',
        describe: '输出格式',
        choices: ['table', 'json', 'markdown'] as const,
        default: 'table',
      })
      .command('ls <notebook>', '列出笔记本中的资源文件', {
        notebook: {
          type: 'string',
          demandOption: true,
          describe: '笔记本 ID',
        },
      }, async (argv: any) => {
        const config = await loadConfig(argv);
        if (argv.format) {
          config.outputFormat = argv.format;
        }
        const client = new (await import('../api/client')).SiYuanClient(config);
        const assets = await client.listAssets(argv.notebook);
        const { formatOutput } = await import('../utils/formatter');
        // Handle different return types
        const assetList = Array.isArray(assets) ? assets : [];
        formatOutput(assetList.map((a: string) => ({ path: a })), config.outputFormat || 'table');
      })
      .demandCommand(1);
  },
  handler: () => {
    y.showHelp();
  },
});

// System 命令
y.command({
  command: 'system',
  describe: '系统信息',
  builder: (yargs) => {
    return yargs
      .option('plain', {
        alias: 'p',
        describe: '使用纯文本输出（避免终端乱码）',
        type: 'boolean',
        default: false,
      })
      .option('format', {
        alias: 'f',
        describe: '输出格式',
        choices: ['table', 'json', 'markdown'] as const,
        default: 'table',
      })
      .command('info', '获取系统信息', {}, async (argv: any) => {
        const config = await loadConfig(argv);
        if (argv.format) {
          config.outputFormat = argv.format;
        }
        const client = new (await import('../api/client')).SiYuanClient(config);
        const info = await client.getSystemInfo();
        const { formatOutput } = await import('../utils/formatter');
        // API returns string directly, wrap it for display
        formatOutput([{ version: info }], config.outputFormat || 'table');
      })
      .demandCommand(1);
  },
  handler: () => {
    y.showHelp();
  },
});

// Config 命令组
y.command({
  command: 'config',
  describe: '配置管理',
  builder: (yargs) => {
    return yargs
      .option('plain', {
        alias: 'p',
        describe: '使用纯文本输出（避免终端乱码）',
        type: 'boolean',
        default: false,
      })
      .command('get', '获取当前配置', {
        f: {
          type: 'string',
          describe: '输出格式 (table/json)',
          default: 'table',
        },
      }, ConfigCommand.get.handler)
      .command('set <key> <value>', '设置配置值', {
        key: {
          type: 'string',
          demandOption: true,
          describe: '配置项名称',
        },
        value: {
          type: 'string',
          demandOption: true,
          describe: '配置值',
        },
      }, ConfigCommand.set.handler)
      .command('init', '初始化配置文件', {}, ConfigCommand.init.handler)
      .command('path', '显示配置文件路径', {}, ConfigCommand.path.handler)
      .demandCommand(1);
  },
  handler: () => {
    y.showHelp();
  },
});

// 解析参数
const parsed = y.parse();

// 处理未捕获的异常
process.on('unhandledRejection', async (reason) => {
  formatError(reason as Error);
  process.exit(1);
});

process.on('SIGINT', () => {
  formatInfo('\n操作已取消');
  process.exit(0);
});
