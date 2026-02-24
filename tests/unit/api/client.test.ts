/**
 * API 客户端单元测试
 */

import axios from 'axios';
import { SiYuanClient } from '../../../src/api/client';
import type { Config } from '../../../src/types';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(),
  isAxiosError: jest.fn((error: any): boolean => {
    return error && error.isAxiosError === true;
  }),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock validateConfig
jest.mock('../../../src/config', () => ({
  validateConfig: jest.fn(() => ({ valid: true, errors: [] })),
}));

describe('SiYuanClient', () => {
  let mockConfig: Config;
  let client: SiYuanClient;

  beforeEach(() => {
    mockConfig = {
      endpoint: 'http://127.0.0.1:6806',
      token: 'test-token-12345678',
      timeout: 10000,
      outputFormat: 'table',
      plain: false,
    };

    mockedAxios.create.mockReturnValue({
      post: jest.fn(),
      defaults: {
        baseURL: 'http://127.0.0.1:6806',
      },
    } as any);

    client = new SiYuanClient(mockConfig);
  });

  describe('构造函数', () => {
    it('应使用提供的配置创建 axios 实例', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://127.0.0.1:6806',
        timeout: 10000,
        headers: {
          'Authorization': 'Token test-token-12345678',
          'Content-Type': 'application/json',
        },
      });
    });

    it('应使用默认 endpoint', () => {
      const configWithoutEndpoint: Config = {
        ...mockConfig,
        endpoint: '' as any,
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn(),
      } as any);

      new SiYuanClient(configWithoutEndpoint);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://127.0.0.1:6806',
        timeout: 10000,
        headers: expect.objectContaining({
          'Authorization': 'Token test-token-12345678',
          'Content-Type': 'application/json',
        }),
      });
    });

    it('应使用默认 timeout', () => {
      const configWithoutTimeout: Config = {
        ...mockConfig,
        timeout: undefined as any,
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn(),
      } as any);

      new SiYuanClient(configWithoutTimeout);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://127.0.0.1:6806',
        timeout: 10000,
        headers: expect.any(Object),
      });
    });

    it('当 token 为空时应抛出错误', () => {
      const configWithoutToken: Config = {
        ...mockConfig,
        token: '',
      };

      expect(() => new SiYuanClient(configWithoutToken)).toThrow(
        'API Token 是必需的'
      );
    });
  });

  describe('post 方法', () => {
    it('应发送 POST 请求并返回数据', async () => {
      const mockPost = jest.fn();
      const mockResponse = {
        data: {
          code: 0,
          msg: 'success',
          data: { id: '123' },
        },
      };

      mockedAxios.create.mockReturnValue({
        post: mockPost as any,
      } as any);

      mockPost.mockResolvedValue(mockResponse);

      const client = new SiYuanClient(mockConfig);
      const result = await client.post('/api/test', { test: 'data' });

      expect(mockPost).toHaveBeenCalledWith('/api/test', { test: 'data' });
      expect(result).toEqual({ id: '123' });
    });

    it('应处理空数据', async () => {
      const mockPost = jest.fn();
      const mockResponse = {
        data: {
          code: 0,
          msg: 'success',
          data: { result: 'ok' },
        },
      };

      mockedAxios.create.mockReturnValue({
        post: mockPost as any,
      } as any);

      mockPost.mockResolvedValue(mockResponse);

      const client = new SiYuanClient(mockConfig);
      const result = await client.post('/api/test');

      expect(mockPost).toHaveBeenCalledWith('/api/test', {});
      expect(result).toEqual({ result: 'ok' });
    });

    it('当 API 返回错误代码时应抛出错误', async () => {
      const mockPost = jest.fn();
      const mockResponse = {
        data: {
          code: 1,
          msg: 'Error occurred',
          data: null,
        },
      };

      mockedAxios.create.mockReturnValue({
        post: mockPost as any,
      } as any);

      mockPost.mockResolvedValue(mockResponse);

      const client = new SiYuanClient(mockConfig);

      await expect(client.post('/api/test')).rejects.toThrow(
        'API 请求失败，代码: 1'
      );
    });

    it('应处理网络错误', async () => {
      const mockPost = jest.fn();
      // 网络错误不是 axios 错误，会直接抛出原始错误
      const mockError = new Error('Network error');

      mockedAxios.create.mockReturnValue({
        post: mockPost as any,
      } as any);

      mockPost.mockRejectedValue(mockError);

      const client = new SiYuanClient(mockConfig);

      // 非 axios 错误会直接抛出原始错误
      await expect(client.post('/api/test')).rejects.toThrow('Network error');
    });

    it('应处理 axios 错误响应', async () => {
      const mockPost = jest.fn();
      // 使用 Error 对象模拟 axios 错误
      const mockError = new Error('Request failed');
      (mockError as any).isAxiosError = true;
      (mockError as any).response = {
        data: {
          msg: 'Invalid token',
        },
      };

      mockedAxios.create.mockReturnValue({
        post: mockPost as any,
      } as any);

      mockPost.mockRejectedValue(mockError);

      const client = new SiYuanClient(mockConfig);

      await expect(client.post('/api/test')).rejects.toThrow(
        'API 错误 (/api/test): Invalid token'
      );
    });
  });

  describe('getBaseURL 方法', () => {
    it('应返回配置的 baseURL', () => {
      const baseURL = client.getBaseURL();
      expect(baseURL).toBe('http://127.0.0.1:6806');
    });
  });

  describe('getTokenMasked 方法', () => {
    it('应正确 masking token', () => {
      const maskedToken = client.getTokenMasked();
      expect(maskedToken).toBe('test****5678');
    });

    it('应处理短 token', () => {
      const shortTokenConfig: Config = {
        ...mockConfig,
        token: 'abc',
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn(),
      } as any);

      const client = new SiYuanClient(shortTokenConfig);
      const maskedToken = client.getTokenMasked();

      expect(maskedToken).toBe('****');
    });

    it('应处理 8 字符的 token', () => {
      const eightCharTokenConfig: Config = {
        ...mockConfig,
        token: '12345678',
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn(),
      } as any);

      const client = new SiYuanClient(eightCharTokenConfig);
      const maskedToken = client.getTokenMasked();

      expect(maskedToken).toBe('****');
    });
  });
});
