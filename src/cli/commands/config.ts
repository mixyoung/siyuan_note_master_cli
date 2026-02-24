import yargs from 'yargs/yargs';
const { cosmiconfig } = require('cosmiconfig');
import { Config } from '../../types';
import { formatSuccess, formatError, formatOutput, formatInfo } from '../../utils/formatter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 配置命令模块
 */
export class ConfigCommand {
  /**
   * 构建 yargs 配置
   */
  static buildYargs() {
    return yargs(['config', 'c'])
      .usage('$0 <命令> [参数]')
      .demandCommand(1)
      .help('h')
      .alias('help', 'h')
      .alias('version', 'v')
      .version('1.0.0');
  }

  /**
   * 获取当前配置
   */
  static get = {
    describe: '获取当前配置',
    handler: async (argv: any) => {
      try {
        const home = process.env.HOME || process.env.USERPROFILE || '';
        const explorer = cosmiconfig('snmcli');
        const config = await explorer.search(home);
        const format = argv.f || 'table';
        // If plain is true and format is table, use json instead
        const outputFormat = argv.plain && format === 'table' ? 'json' : format;
        if (outputFormat === 'table') {
          formatOutput(config?.config || {}, 'table');
        } else {
          console.log(JSON.stringify(config?.config || {}, null, 2));
        }
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 设置配置值
   */
  static set = {
    describe: '设置配置值 <key> <value>',
    handler: async (argv: any) => {
      try {
        const home = process.env.HOME || process.env.USERPROFILE || '';
        const explorer = cosmiconfig('snmcli');
        const result = await explorer.search(home);
        let currentConfig = result?.config || {};
        const configPath = result?.filepath;

        if (!configPath) {
          formatError('未找到配置文件。运行 "snmcli config init" 来创建一个。');
          process.exit(1);
        }

        const { key, value } = argv;
        const newConfig = { ...currentConfig, [key]: value };

        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');
        formatSuccess(`已设置 ${key} = ${value}`);
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 初始化配置文件
   */
  static init = {
    describe: '初始化配置文件',
    handler: async () => {
      try {
        const configPath = '.snmclirc.json';
        const home = process.env.HOME || process.env.USERPROFILE || '';
        const fullPath = path.join(home, configPath);

        if (fs.existsSync(fullPath)) {
          formatInfo(`配置已存在于: ${fullPath}`);
          formatInfo('使用 "snmcli config get" 查看当前配置。');
          return;
        }

        const defaultConfig: Partial<Config> = {
          endpoint: 'http://127.0.0.1:6806',
          timeout: 10000,
          outputFormat: 'table',
        };

        fs.writeFileSync(fullPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
        formatSuccess(`已创建配置文件: ${fullPath}`);
        formatInfo('请设置你的 API Token：');
        formatInfo('  snmcli config set token YOUR_TOKEN_HERE');
        formatInfo('或使用 --token 标志：');
        formatInfo('  snmcli --token YOUR_TOKEN_HERE <command>');
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };

  /**
   * 显示配置文件路径
   */
  static path = {
    describe: '显示配置文件路径',
    handler: async () => {
      try {
        const configManager = await cosmiconfig('snmcli').search();
        const configPath = configManager?.filepath;
        if (configPath) {
          console.log(configPath);
        } else {
          formatInfo('未找到配置文件。运行 "snmcli config init" 来创建一个。');
        }
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };
}
