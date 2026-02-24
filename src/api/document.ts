import { SiYuanClient } from './client';
import { CreateDocRequest, Document, MoveDocRequest, MoveDocByIDRequest, ExportResult } from '../types';

/**
 * 从 Markdown 内容创建文档
 * @param request - 文档创建请求
 * @returns 创建的文档 ID
 */
export async function createDoc(client: SiYuanClient, request: CreateDocRequest): Promise<string> {
  const params: any = {
    notebook: request.notebook,
    path: request.path,
    markdown: request.markdown,
  };
  // 如果提供了 parentId，添加它
  if (request.parentId) {
    params.parentId = request.parentId;
  }
  return await client.post<string>('/api/filetree/createDocWithMd', params);
}

/**
 * 按路径重命名文档
 * @param notebook - 笔记本 ID
 * @param path - 文档人类可读路径
 * @param title - 新标题
 */
export async function renameDoc(client: SiYuanClient, notebook: string, path: string, title: string): Promise<void> {
  // 1. 通过人类可读路径获取文档 ID
  const ids = await getIDsByHPath(client, path, notebook);
  if (!ids || ids.length === 0) {
    throw new Error(`文档不存在: ${path}`);
  }
  
  // 2. 使用 ID 方式重命名
  await renameDocByID(client, ids[0], title);
}

/**
 * 按 ID 重命名文档
 * @param id - 文档 ID
 * @param title - 新标题
 */
export async function renameDocByID(client: SiYuanClient, id: string, title: string): Promise<void> {
  await client.post('/api/filetree/renameDocByID', {
    id,
    title,
  });
}

/**
 * 按路径删除文档
 * @param notebook - 笔记本 ID
 * @param path - 文档路径
 */
export async function deleteDoc(client: SiYuanClient, notebook: string, path: string): Promise<void> {
  await client.post('/api/filetree/removeDoc', {
    notebook,
    path,
  });
}

/**
 * 按 ID 删除文档
 * @param id - 文档 ID
 */
export async function deleteDocByID(client: SiYuanClient, id: string): Promise<void> {
  await client.post('/api/filetree/removeDocByID', {
    id,
  });
}

/**
 * 移动文档
 * @param request - 移动文档请求
 */
export async function moveDocs(client: SiYuanClient, request: MoveDocRequest): Promise<void> {
  await client.post('/api/filetree/moveDocs', request);
}

/**
 * 按 ID 移动文档
 * @param request - 按 ID 移动文档请求
 */
export async function moveDocsByID(client: SiYuanClient, request: MoveDocByIDRequest): Promise<void> {
  await client.post('/api/filetree/moveDocsByID', request);
}

/**
 * 将文档导出为 Markdown
 * @param id - 文档 ID
 * @returns 包含 hPath 和内容的导出结果
 */
export async function exportDoc(client: SiYuanClient, id: string): Promise<ExportResult> {
  return await client.post<ExportResult>('/api/export/exportMdContent', { id });
}

/**
 * 按路径获取可读路径
 * @param notebook - 笔记本 ID
 * @param path - 文档路径
 * @returns 可读路径
 */
export async function getHPathByPath(client: SiYuanClient, notebook: string, path: string): Promise<string> {
  const response = await client.post<string>('/api/filetree/getHPathByPath', {
    notebook,
    path,
  });
  return response;
}

/**
 * 按 ID 获取可读路径
 * @param id - 块/文档 ID
 * @returns 可读路径
 */
export async function getHPathByID(client: SiYuanClient, id: string): Promise<string> {
  const response = await client.post<string>('/api/filetree/getHPathByID', { id });
  return response;
}

/**
 * 按可读路径获取 ID 列表
 * @param path - 可读路径
 * @param notebook - 笔记本 ID
 * @returns 文档 ID 数组
 */
export async function getIDsByHPath(client: SiYuanClient, path: string, notebook: string): Promise<string[]> {
  return await client.post<string[]>('/api/filetree/getIDsByHPath', {
    path,
    notebook,
  });
}
