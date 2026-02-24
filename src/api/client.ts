import axios, { AxiosInstance } from 'axios';
import { APIResponse, Config, OutputFormat } from '../types';
import { validateConfig } from '../config';

// Import API functions
import {
  listNotebooks,
  createNotebook,
  deleteNotebook,
  renameNotebook,
  openNotebook,
  closeNotebook,
  getNotebookConfig,
} from './notebook';
import {
  createDoc,
  deleteDoc,
  deleteDocByID,
  renameDoc,
  renameDocByID,
  moveDocs,
  moveDocsByID,
  exportDoc,
  getHPathByPath,
  getHPathByID,
  getIDsByHPath,
} from './document';
import {
  getBlockKramdown,
  updateBlock,
  deleteBlock as deleteBlockApi,
  insertBlock,
  prependBlock,
  appendBlock,
  moveBlock,
  getChildBlocks,
  foldBlock,
  unfoldBlock,
} from './block';
import { executeQuery } from './search';

/**
 * 思源笔记 API 客户端
 * 处理所有到思源笔记 API 端点的 HTTP 请求
 */
export class SiYuanClient {
  private readonly client: AxiosInstance;
  private readonly token: string;

  constructor(config: Config) {
    // 验证配置
    const validation = validateConfig(config);
    if (!validation.valid) {
      throw new Error(`无效的配置: ${validation.errors.join(', ')}`);
    }

    if (!config.token) {
      throw new Error('API Token 是必需的。请通过 --token、环境变量或配置文件提供。');
    }

    this.token = config.token;

    // 创建带有默认配置的 axios 实例
    this.client = axios.create({
      baseURL: config.endpoint || 'http://127.0.0.1:6806',
      timeout: config.timeout || 10000,
      headers: {
        'Authorization': `Token ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 通用 POST 请求到思源笔记 API
   * 所有思源笔记 API 端点都使用 POST 方法
   */
  async post<T>(path: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.post<any>(path, data || {});
      const responseData = response.data;

      // 检查响应是否有 code 字段
      if (responseData && responseData.code !== undefined) {
        this.checkResponseCode(responseData.code);
        // 如果 data 是 null，返回空对象而不是 null
        return (responseData.data ?? {}) as T;
      }
      // 如果没有 code 字段，直接返回响应数据
      return responseData as T;
    } catch (error) {
      this.handleError(error, path);
      throw error;
    }
  }

  /**
   * 检查 API 响应代码是否表示成功
   */
  private checkResponseCode(code: number): void {
    if (code !== 0) {
      throw new Error(`API 请求失败，代码: ${code}`);
    }
  }

  /**
   * 处理和格式化错误
   */
  private handleError(error: unknown, path: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as any;
      const message = axiosError.response?.data?.msg || axiosError.message;
      throw new Error(`API 错误 (${path}): ${message}`);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`未知错误 (${path}): ${error}`);
  }

  // ============ 笔记本 API ============

  /**
   * 列出所有笔记本
   */
  listNotebooks() {
    return listNotebooks(this);
  }

  /**
   * 创建笔记本
   */
  createNotebook(name: string) {
    return createNotebook(this, name);
  }

  /**
   * 重命名笔记本
   */
  renameNotebook(id: string, name: string) {
    return renameNotebook(this, id, name);
  }

  /**
   * 删除笔记本
   */
  removeNotebook(id: string) {
    return deleteNotebook(this, id);
  }

  /**
   * 打开笔记本
   */
  openNotebook(id: string) {
    return openNotebook(this, id);
  }

  /**
   * 关闭笔记本
   */
  closeNotebook(id: string) {
    return closeNotebook(this, id);
  }

  /**
   * 获取笔记本配置
   */
  getNotebookConf(id: string) {
    return getNotebookConfig(this, id);
  }

  // ============ 文档 API ============

  /**
   * 创建文档
   */
  createDoc(request: any) {
    return createDoc(this, request);
  }

  /**
   * 删除文档
   */
  deleteDoc(request: any) {
    return deleteDoc(this, request.notebook, request.path);
  }

  /**
   * 按 ID 删除文档
   */
  deleteDocByID(id: string) {
    return deleteDocByID(this, id);
  }

  /**
   * 重命名文档
   */
  renameDoc(request: any) {
    if (request.doc) {
      return renameDocByID(this, request.doc, request.title);
    }
    return renameDoc(this, request.notebook, request.path, request.title);
  }

  /**
   * 移动文档
   */
  moveDoc(request: any) {
    if (request.fromDoc) {
      return moveDocsByID(this, request);
    }
    return moveDocs(this, request);
  }

  /**
   * 导出文档
   */
  exportMdContent(request: any) {
    return exportDoc(this, request.id);
  }

  /**
   * 获取文档路径
   */
  getHPathByPath(notebook: string, request: any) {
    if (request.doc) {
      return getHPathByID(this, request.doc);
    }
    return getHPathByPath(this, notebook, request.path);
  }

  /**
   * 按 ID 获取文档路径
   */
  getHPathByID(id: string) {
    return getHPathByID(this, id);
  }

  // ============ 块 API ============

  /**
   * 获取块 kramdown
   */
  getBlockKramdown(id: string) {
    return getBlockKramdown(this, id);
  }

  /**
   * 更新块
   */
  updateBlock(request: any) {
    return updateBlock(this, request);
  }

  /**
   * 删除块
   */
  deleteBlock(id: string) {
    return deleteBlockApi(this, id);
  }

  /**
   * 插入块
   */
  insertBlock(request: any) {
    return insertBlock(this, request);
  }

  /**
   * 前置块
   */
  prependBlock(parentID: string, dataType: 'markdown' | 'dom', data: string) {
    return prependBlock(this, parentID, dataType, data);
  }

  /**
   * 追加块
   */
  appendBlock(parentID: string, dataType: 'markdown' | 'dom', data: string) {
    return appendBlock(this, parentID, dataType, data);
  }

  /**
   * 移动块
   */
  moveBlock(id: string, previousID?: string, parentID?: string) {
    return moveBlock(this, id, previousID, parentID);
  }

  /**
   * 获取子块
   */
  getChildBlocks(id: string) {
    return getChildBlocks(this, id);
  }

  /**
   * 折叠块
   */
  foldBlock(id: string) {
    return foldBlock(this, id);
  }

  /**
   * 展开块
   */
  unfoldBlock(id: string) {
    return unfoldBlock(this, id);
  }

  // ============ 搜索 API ============

  /**
   * 执行 SQL 查询
   */
  sqlQuery(stmt: string) {
    return executeQuery(this, stmt);
  }

  // ============ 文档 API ============

  /**
   * 获取文档内容
   * @param id - 文档 ID
   */
  async getDoc(id: string): Promise<{ content: string; path: string }> {
    return await this.post('/api/filetree/getDoc', { id });
  }

  /**
   * 插入文档
   * @param notebook - 笔记本 ID
   * @param path - 文档路径
   * @param markdown - Markdown 内容
   */
  async insertDoc(notebook: string, path: string, markdown: string): Promise<string> {
    return await this.post('/api/filetree/insertDoc', {
      notebook,
      path,
      markdown,
    });
  }

  // ============ 块属性 API ============

  /**
   * 获取块属性
   * @param id - 块 ID
   */
  async getBlockAttrs(id: string): Promise<Record<string, string>> {
    const response = await this.post<any>('/api/attr/getBlockAttrs', { id });
    // 有些 API 返回 { data: {...} } 格式
    return response.data || response;
  }

  /**
   * 设置块属性
   * @param id - 块 ID
   * @param attrs - 属性对象
   */
  async setBlockAttrs(id: string, attrs: Record<string, string>): Promise<void> {
    await this.post('/api/attr/setBlockAttrs', { id, attrs });
  }

  // ============ 反向链接 API ============

  /**
   * 获取反向链接
   * @param id - 块 ID 或文档 ID
   */
  async listBacklink(id: string): Promise<{
    backlinks: Array<{ id: string; content: string; path: string }>;
  }> {
    return await this.post('/api/ref/listBacklink', { id });
  }

  // ============ 资源文件 API ============

  /**
   * 上传资源文件
   * @param filePath - 文件路径
   * @param notebook - 目标笔记本 ID
   * @param path - 目标路径
   */
  async uploadAsset(filePath: string, notebook: string, path: string): Promise<{ fileURL: string }> {
    const FormData = require('form-data');
    const fs = require('fs');

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('notebook', notebook);
    form.append('path', path);

    const response = await this.client.post('/api/asset/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Token ${this.token}`,
      },
    });

    return response.data;
  }

  /**
   * 列出笔记本中的资源文件
   */
  async listAssets(notebook: string): Promise<string[]> {
    return await this.post<string[]>('/api/asset/lsAssets', { notebook });
  }

  /**
   * 获取系统信息
   */
  async getSystemInfo(): Promise<any> {
    return await this.post<any>('/api/system/version', {});
  }

  /**
   * 获取正在使用的基础 URL
   */
  getBaseURL(): string {
    return this.client.defaults.baseURL || '';
  }

  /**
   * 获取正在使用的 Token（已做安全处理）
   */
  getTokenMasked(): string {
    if (this.token.length <= 8) return '****';
    return `${this.token.substring(0, 4)}****${this.token.substring(this.token.length - 4)}`;
  }
}
