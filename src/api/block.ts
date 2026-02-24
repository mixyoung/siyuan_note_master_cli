import { SiYuanClient } from './client';
import { Block, BlockAttributes, UpdateBlockRequest, InsertBlockRequest } from '../types';

/**
 * 获取块的 kramdown 源
 * @param id - 块 ID
 * @returns 块 kramdown 源
 */
export async function getBlockKramdown(client: SiYuanClient, id: string): Promise<{ id: string; kramdown: string }> {
  return await client.post<{ id: string; kramdown: string }>('/api/block/getBlockKramdown', { id });
}

/**
 * 更新块
 * @param request - 更新块请求
 */
export async function updateBlock(client: SiYuanClient, request: UpdateBlockRequest): Promise<void> {
  await client.post('/api/block/updateBlock', {
    id: request.id,
    dataType: request.dataType,
    data: request.data,
  });
}

/**
 * 删除块
 * @param id - 要删除的块 ID
 */
export async function deleteBlock(client: SiYuanClient, id: string): Promise<void> {
  await client.post('/api/block/deleteBlock', { id });
}

/**
 * 插入块
 * @param request - 插入块请求
 */
export async function insertBlock(client: SiYuanClient, request: InsertBlockRequest): Promise<void> {
  await client.post('/api/block/insertBlock', request);
}

/**
 * 前置块（作为第一个子块插入）
 * @param parentID - 父块 ID
 * @param dataType - 数据类型
 * @param data - 块内容
 */
export async function prependBlock(client: SiYuanClient, parentID: string, dataType: 'markdown' | 'dom', data: string): Promise<void> {
  await client.post('/api/block/prependBlock', {
    parentID,
    dataType,
    data,
  });
}

/**
 * 追加块（作为最后一个子块插入）
 * @param parentID - 父块 ID
 * @param dataType - 数据类型
 * @param data - 块内容
 */
export async function appendBlock(client: SiYuanClient, parentID: string, dataType: 'markdown' | 'dom', data: string): Promise<void> {
  await client.post('/api/block/appendBlock', {
    parentID,
    dataType,
    data,
  });
}

/**
 * 移动块
 * @param id - 要移动的块 ID
 * @param previousID - 前一个块 ID（可选）
 * @param parentID - 父块 ID（可选）
 */
export async function moveBlock(client: SiYuanClient, id: string, previousID?: string, parentID?: string): Promise<void> {
  await client.post('/api/block/moveBlock', {
    id,
    previousID,
    parentID,
  });
}

/**
 * 获取子块
 * @param id - 父块 ID
 * @returns 子块数组
 */
export async function getChildBlocks(client: SiYuanClient, id: string): Promise<Block[]> {
  return await client.post<Block[]>('/api/block/getChildBlocks', { id });
}

/**
 * 折叠块
 * @param id - 要折叠的块 ID
 */
export async function foldBlock(client: SiYuanClient, id: string): Promise<void> {
  await client.post('/api/block/foldBlock', { id });
}

/**
 * 展开块
 * @param id - 要展开的块 ID
 */
export async function unfoldBlock(client: SiYuanClient, id: string): Promise<void> {
  await client.post('/api/block/unfoldBlock', { id });
}

/**
 * 转移块引用
 * @param fromID - 定义块 ID
 * @param toID - 目标块 ID
 * @param refIDs - 引用块 ID 数组（可选）
 */
export async function transferBlockRef(client: SiYuanClient, fromID: string, toID: string, refIDs?: string[]): Promise<void> {
  await client.post('/api/block/transferBlockRef', {
    fromID,
    toID,
    refIDs,
  });
}
