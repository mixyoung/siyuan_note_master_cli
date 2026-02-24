import { cosmiconfig } from 'cosmiconfig';
import * as fs from 'fs';
import * as path from 'path';

export interface Config {
  endpoint: string;
  token: string;
  timeout: number;
  outputFormat: 'table' | 'json' | 'markdown';
  plain?: boolean;
  configFile?: string;
}

export type OutputFormat = 'table' | 'json' | 'markdown';

const DEFAULT_CONFIG: Partial<Config> = {
  endpoint: 'http://127.0.0.1:6806',
  token: '',
  timeout: 10000,
  outputFormat: 'table',
  plain: false,
};

/**
 * Load configuration from file, environment variables, and default values
 * Priority: command line args > env vars > config file > defaults
 */
export async function loadConfig(cliArgs: Partial<Config> = {}): Promise<Config> {
  let configFromFile: Partial<Config> = {};

  // 1. If -c (configFile) is specified, load from that file
  if (cliArgs.configFile) {
    try {
      const configPath = path.resolve(cliArgs.configFile);
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8');
        configFromFile = JSON.parse(content);
        console.log(`已加载配置文件: ${configPath}`);
      }
    } catch (e) {
      console.error(`加载配置文件失败: ${e}`);
    }
  } else {
    // 2. Otherwise, search for config file using cosmiconfig
    try {
      const explorer = cosmiconfig('snmcli', {
        cache: true,
        searchPlaces: [
          '.snmclirc.json',
          '.snmclirc',
          'snmcli.config.json',
        ],
      });
      const result = await explorer.search();
      if (result && result.config) {
        configFromFile = result.config;
      }
    } catch (e) {
      // cosmiconfig search failed, continue with defaults
    }

    // 3. Also check common config locations
    if (Object.keys(configFromFile).length === 0) {
      const homeDir = process.env.USERPROFILE || process.env.HOME || '';
      const possiblePaths = [
        path.join(homeDir, '.snmclirc.json'),
        path.join(homeDir, '.snmclirc'),
        path.join(homeDir, '.config', 'snmcli.json'),
      ];

      for (const configPath of possiblePaths) {
        if (fs.existsSync(configPath)) {
          try {
            const content = fs.readFileSync(configPath, 'utf-8');
            configFromFile = JSON.parse(content);
            break;
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }

  // Merge configurations with priority
  const mergedConfig: Config = {
    endpoint: cliArgs.endpoint || loadFromEnv().endpoint || configFromFile.endpoint || DEFAULT_CONFIG.endpoint || 'http://127.0.0.1:6806',
    token: cliArgs.token || loadFromEnv().token || configFromFile.token || DEFAULT_CONFIG.token || '',
    timeout: cliArgs.timeout || loadFromEnv().timeout || configFromFile.timeout || DEFAULT_CONFIG.timeout || 10000,
    outputFormat: cliArgs.outputFormat || loadFromEnv().outputFormat || configFromFile.outputFormat || DEFAULT_CONFIG.outputFormat || 'table',
    plain: cliArgs.plain ?? configFromFile.plain ?? DEFAULT_CONFIG.plain ?? false,
  };

  // If plain is true and outputFormat is table, switch to json
  if (mergedConfig.plain && mergedConfig.outputFormat === 'table') {
    mergedConfig.outputFormat = 'json';
  }

  return mergedConfig;
}

/**
 * Load configuration from environment variables
 */
function loadFromEnv(): Partial<Config> {
  const config: Partial<Config> = {};

  if (process.env.SIYUAN_ENDPOINT) {
    config.endpoint = process.env.SIYUAN_ENDPOINT;
  }

  if (process.env.SIYUAN_TOKEN) {
    config.token = process.env.SIYUAN_TOKEN;
  }

  if (process.env.SIYUAN_TIMEOUT) {
    config.timeout = parseInt(process.env.SIYUAN_TIMEOUT, 10);
  }

  if (process.env.SIYUAN_OUTPUT_FORMAT) {
    config.outputFormat = process.env.SIYUAN_OUTPUT_FORMAT as OutputFormat;
  }

  return config;
}

/**
 * Validate configuration
 */
export function validateConfig(config: Partial<Config>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.endpoint) {
    errors.push('Endpoint is required');
  }

  if (!config.token) {
    errors.push('API token is required. 请通过以下方式配置：');
    errors.push('  1. 命令行: snmcli.exe -t YOUR_TOKEN <command>');
    errors.push('  2. 环境变量: set SIYUAN_TOKEN=YOUR_TOKEN');
    errors.push('  3. 配置文件: 创建 .snmclirc.json 文件');
    errors.push('  4. 运行: snmcli.exe config init 初始化配置');
  }

  if (config.timeout && config.timeout < 1000) {
    errors.push('Timeout must be at least 1000ms');
  }

  const validFormats: OutputFormat[] = ['table', 'json', 'markdown'];
  if (config.outputFormat && !validFormats.includes(config.outputFormat)) {
    errors.push(`Output format must be one of: ${validFormats.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
