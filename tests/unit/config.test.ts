/**
 * 配置模块单元测试
 */

import { loadConfig, validateConfig } from '../../src/config';
import type { Config } from '../../src/types';

// Mock cosmiconfig
jest.mock('cosmiconfig', () => ({
  cosmiconfig: jest.fn(() => ({
    search: jest.fn(() => Promise.resolve(null)),
  })),
}));

const { cosmiconfig } = require('cosmiconfig');

describe('loadConfig', () => {
  beforeEach(() => {
    // 清除环境变量
    delete process.env.SIYUAN_ENDPOINT;
    delete process.env.SIYUAN_TOKEN;
    delete process.env.SIYUAN_TIMEOUT;
    delete process.env.SIYUAN_OUTPUT_FORMAT;
    jest.clearAllMocks();
  });

  it('应返回默认配置', async () => {
    cosmiconfig.mockReturnValue({
      search: jest.fn(() => Promise.resolve(null)),
    });

    const config = await loadConfig();

    expect(config.endpoint).toBe('http://127.0.0.1:6806');
    expect(config.token).toBe('');
    expect(config.timeout).toBe(10000);
    expect(config.outputFormat).toBe('table');
  });

  it('应优先使用命令行参数', async () => {
    cosmiconfig.mockReturnValue({
      search: jest.fn(() => Promise.resolve({
        filepath: 'test.json',
        config: {
          endpoint: 'http://file:6806',
          token: 'file-token',
          timeout: 5000,
          outputFormat: 'json',
        },
      })),
    });

    const cliArgs: Partial<Config> = {
      endpoint: 'http://cli:6806',
      token: 'cli-token',
      timeout: 20000,
      outputFormat: 'markdown',
    };

    const config = await loadConfig(cliArgs);

    expect(config.endpoint).toBe('http://cli:6806');
    expect(config.token).toBe('cli-token');
    expect(config.timeout).toBe(20000);
    expect(config.outputFormat).toBe('markdown');
  });

  it('应优先使用环境变量而非配置文件', async () => {
    process.env.SIYUAN_ENDPOINT = 'http://env:6806';
    process.env.SIYUAN_TOKEN = 'env-token';
    process.env.SIYUAN_TIMEOUT = '15000';
    process.env.SIYUAN_OUTPUT_FORMAT = 'json';

    cosmiconfig.mockReturnValue({
      search: jest.fn(() => Promise.resolve({
        filepath: 'test.json',
        config: {
          endpoint: 'http://file:6806',
          token: 'file-token',
          timeout: 5000,
          outputFormat: 'markdown',
        },
      })),
    });

    const config = await loadConfig();

    expect(config.endpoint).toBe('http://env:6806');
    expect(config.token).toBe('env-token');
    expect(config.timeout).toBe(15000);
    expect(config.outputFormat).toBe('json');
  });

  it('应优先使用配置文件而非默认值', async () => {
    cosmiconfig.mockReturnValue({
      search: jest.fn(() => Promise.resolve({
        filepath: 'test.json',
        config: {
          endpoint: 'http://file:6806',
          token: 'file-token',
          timeout: 5000,
          outputFormat: 'json',
        },
      })),
    });

    const config = await loadConfig();

    expect(config.endpoint).toBe('http://file:6806');
    expect(config.token).toBe('file-token');
    expect(config.timeout).toBe(5000);
    expect(config.outputFormat).toBe('json');
  });
});

describe('validateConfig', () => {
  it('应验证有效的配置', () => {
    const config: Config = {
      endpoint: 'http://127.0.0.1:6806',
      token: 'test-token',
      timeout: 10000,
      outputFormat: 'table',
      plain: false,
    };

    const result = validateConfig(config);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('应拒绝空的 endpoint', () => {
    const config = {
      endpoint: '',
      token: 'test-token',
      timeout: 10000,
      outputFormat: 'table' as const,
      plain: false,
    };

    const result = validateConfig(config);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Endpoint is required');
  });

  it('应拒绝空的 token', () => {
    const config = {
      endpoint: 'http://127.0.0.1:6806',
      token: '',
      timeout: 10000,
      outputFormat: 'table' as const,
    };

    const result = validateConfig(config);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('API token is required');
  });

  it('应拒绝小于 1000 的超时值', () => {
    const config = {
      endpoint: 'http://127.0.0.1:6806',
      token: 'test-token',
      timeout: 500,
      outputFormat: 'table' as const,
    };

    const result = validateConfig(config);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Timeout must be at least 1000ms');
  });

  it('应拒绝无效的输出格式', () => {
    const config = {
      endpoint: 'http://127.0.0.1:6806',
      token: 'test-token',
      timeout: 10000,
      outputFormat: 'invalid' as 'table',
    };

    const result = validateConfig(config);

    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Output format must be one of'))).toBe(true);
  });
});
