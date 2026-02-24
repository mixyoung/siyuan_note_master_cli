import { SiYuanClient } from './client';
import { Notebook } from '../types';

/**
 * 列出所有笔记本
 * @returns 笔记本数组
 */
export async function listNotebooks(client: SiYuanClient): Promise<Notebook[]> {
  const response = await client.post<{ notebooks: Notebook[] }>('/api/notebook/lsNotebooks');
  return response.notebooks;
}

/**
 * 创建新笔记本
 * @param name - 要创建的笔记本名称
 * @returns 创建的笔记本
 */
export async function createNotebook(client: SiYuanClient, name: string): Promise<Notebook> {
  const response = await client.post<{ notebook: Notebook }>('/api/notebook/createNotebook', {
    name,
  });
  return response.notebook;
}

/**
 * 重命名笔记本
 * @param id - 笔记本 ID
 * @param name - 笔记本的新名称
 */
export async function renameNotebook(client: SiYuanClient, id: string, name: string): Promise<void> {
  await client.post('/api/notebook/renameNotebook', {
    notebook: id,
    name,
  });
}

/**
 * 删除笔记本
 * @param id - 要删除的笔记本 ID
 */
export async function deleteNotebook(client: SiYuanClient, id: string): Promise<void> {
  await client.post('/api/notebook/removeNotebook', {
    notebook: id,
  });
}

/**
 * 打开笔记本
 * @param id - 要打开的笔记本 ID
 */
export async function openNotebook(client: SiYuanClient, id: string): Promise<void> {
  await client.post('/api/notebook/openNotebook', {
    notebook: id,
  });
}

/**
 * 关闭笔记本
 * @param id - 要关闭的笔记本 ID
 */
export async function closeNotebook(client: SiYuanClient, id: string): Promise<void> {
  await client.post('/api/notebook/closeNotebook', {
    notebook: id,
  });
}

/**
 * 获取笔记本配置
 * @param id - 笔记本 ID
 * @returns 笔记本配置
 */
export async function getNotebookConfig(client: SiYuanClient, id: string): Promise<unknown> {
  return await client.post('/api/notebook/getNotebookConf', {
    notebook: id,
  });
}
