/**
 * 块 API 单元测试
 */

import { SiYuanClient } from '../../../../src/api/client';
import {
  getBlockKramdown,
  updateBlock,
  deleteBlock,
  insertBlock,
  prependBlock,
  appendBlock,
  moveBlock,
  getChildBlocks,
  foldBlock,
  unfoldBlock,
} from '../../../../src/api/block';
import type { UpdateBlockRequest, InsertBlockRequest } from '../../../../src/types';

describe('块 API', () => {
  let mockClient: jest.Mocked<SiYuanClient>;

  beforeEach(() => {
    mockClient = {
      post: jest.fn(),
    } as any;
  });

  describe('getBlockKramdown', () => {
    it('应调用正确的 API 端点并传递块 ID', async () => {
      mockClient.post.mockResolvedValue({ kramdown: '# 测试内容' });

      await getBlockKramdown(mockClient, 'block-id-123');

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/getBlockKramdown', {
        id: 'block-id-123',
      });
    });

    it('应返回块的 Kramdown 内容', async () => {
      const mockResult = { kramdown: '# 测试内容\n\n更多内容' };

      mockClient.post.mockResolvedValue(mockResult);

      const result = await getBlockKramdown(mockClient, 'block-id-123');

      expect(result).toEqual(mockResult);
    });
  });

  describe('updateBlock', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({});

      const request: UpdateBlockRequest = {
        id: 'block-id-123',
        dataType: 'markdown',
        data: '新的内容',
      };

      await updateBlock(mockClient, request);

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/updateBlock', request);
    });
  });

  describe('deleteBlock', () => {
    it('应调用正确的 API 端点并传递块 ID', async () => {
      mockClient.post.mockResolvedValue({});

      await deleteBlock(mockClient, 'block-id-123');

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/deleteBlock', {
        id: 'block-id-123',
      });
    });
  });

  describe('insertBlock', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({ id: 'new-block-id' });

      const request: InsertBlockRequest = {
        dataType: 'markdown',
        data: '插入的内容',
        previousID: 'prev-block-id',
      };

      await insertBlock(mockClient, request);

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/insertBlock', request);
    });
  });

  describe('prependBlock', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({ id: 'new-block-id' });

      await prependBlock(mockClient, 'parent-id', 'markdown', '插入的内容');

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/prependBlock', {
        dataType: 'markdown',
        data: '插入的内容',
        parentID: 'parent-id',
      });
    });
  });

  describe('appendBlock', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({ id: 'new-block-id' });

      await appendBlock(mockClient, 'parent-id', 'markdown', '追加的内容');

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/appendBlock', {
        dataType: 'markdown',
        data: '追加的内容',
        parentID: 'parent-id',
      });
    });
  });

  describe('moveBlock', () => {
    it('应调用正确的 API 端点并传递参数（previousID）', async () => {
      mockClient.post.mockResolvedValue({});

      await moveBlock(mockClient, 'block-id-123', 'prev-block-id', undefined);

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/moveBlock', {
        id: 'block-id-123',
        previousID: 'prev-block-id',
      });
    });

    it('应调用正确的 API 端点并传递参数（parentID）', async () => {
      mockClient.post.mockResolvedValue({});

      await moveBlock(mockClient, 'block-id-123', undefined, 'parent-id');

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/moveBlock', {
        id: 'block-id-123',
        parentID: 'parent-id',
      });
    });
  });

  describe('getChildBlocks', () => {
    it('应调用正确的 API 端点并传递块 ID', async () => {
      mockClient.post.mockResolvedValue([
        { id: 'child-1', content: '子块1' },
        { id: 'child-2', content: '子块2' },
      ]);

      await getChildBlocks(mockClient, 'parent-block-id');

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/getChildBlocks', {
        id: 'parent-block-id',
      });
    });

    it('应返回子块列表', async () => {
      const mockChildren = [
        { id: 'child-1', content: '子块1' },
        { id: 'child-2', content: '子块2' },
      ];

      mockClient.post.mockResolvedValue(mockChildren);

      const result = await getChildBlocks(mockClient, 'parent-block-id');

      expect(result).toEqual(mockChildren);
    });
  });

  describe('foldBlock', () => {
    it('应调用正确的 API 端点并传递块 ID', async () => {
      mockClient.post.mockResolvedValue({});

      await foldBlock(mockClient, 'block-id-123');

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/foldBlock', {
        id: 'block-id-123',
      });
    });
  });

  describe('unfoldBlock', () => {
    it('应调用正确的 API 端点并传递块 ID', async () => {
      mockClient.post.mockResolvedValue({});

      await unfoldBlock(mockClient, 'block-id-123');

      expect(mockClient.post).toHaveBeenCalledWith('/api/block/unfoldBlock', {
        id: 'block-id-123',
      });
    });
  });
});
