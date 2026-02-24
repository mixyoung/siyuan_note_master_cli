import { SiYuanClient } from './client';
import { SQLQueryResult } from '../types';

/**
 * 执行 SQL 查询
 * @param stmt - SQL 语句
 * @returns 查询结果
 */
export async function executeQuery(client: SiYuanClient, stmt: string): Promise<SQLQueryResult[]> {
  return await client.post<SQLQueryResult[]>('/api/query/sql', { stmt });
}
