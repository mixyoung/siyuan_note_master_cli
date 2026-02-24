/**
 * 搜索 API 单元测试
 */

import { SiYuanClient } from '../../../../src/api/client';
import { executeQuery } from '../../../../src/api/search';

describe('搜索 API', () => {
  let mockClient: jest.Mocked<SiYuanClient>;

  beforeEach(() => {
    mockClient = {
      post: jest.fn(),
    } as any;
  });

  describe('executeQuery', () => {
    it('应调用正确的 API 端点并传递查询语句', async () => {
      mockClient.post.mockResolvedValue({
        data: [
          ['id1', '文档1'],
          ['id2', '文档2'],
        ],
        columns: ['id', 'title'],
      });

      await executeQuery(mockClient, "SELECT * FROM blocks WHERE type = 'd'");

      expect(mockClient.post).toHaveBeenCalledWith('/api/query/sql', {
        stmt: "SELECT * FROM blocks WHERE type = 'd'",
      });
    });

    it('应返回查询结果', async () => {
      const mockResult = {
        data: [
          ['id1', '文档1'],
          ['id2', '文档2'],
          ['id3', '文档3'],
        ],
        columns: ['id', 'title'],
      };

      mockClient.post.mockResolvedValue(mockResult);

      const result = await executeQuery(mockClient, "SELECT * FROM blocks");

      expect(result).toEqual(mockResult);
    });

    it('应处理空查询结果', async () => {
      const mockResult = {
        data: [],
        columns: ['id', 'title'],
      };

      mockClient.post.mockResolvedValue(mockResult);

      const result = await executeQuery(mockClient, "SELECT * FROM blocks WHERE id = 'nonexistent'");

      expect(result).toEqual(mockResult);
      expect(result.data).toHaveLength(0);
    });

    it('应处理复杂的 SQL 查询', async () => {
      mockClient.post.mockResolvedValue({
        data: [['id1', '测试']],
        columns: ['id', 'content'],
      });

      const complexQuery = "SELECT id, content FROM blocks WHERE content LIKE '%测试%' AND type = 'p' LIMIT 10";

      await executeQuery(mockClient, complexQuery);

      expect(mockClient.post).toHaveBeenCalledWith('/api/query/sql', {
        stmt: complexQuery,
      });
    });
  });
});
