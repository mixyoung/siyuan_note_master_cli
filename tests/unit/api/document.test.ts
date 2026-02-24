/**
 * 文档 API 单元测试
 */

import { SiYuanClient } from '../../../../src/api/client';
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
} from '../../../../src/api/document';
import type { CreateDocRequest, MoveDocRequest, MoveDocByIDRequest } from '../../../../src/types';

describe('文档 API', () => {
  let mockClient: jest.Mocked<SiYuanClient>;

  beforeEach(() => {
    mockClient = {
      post: jest.fn(),
    } as any;
  });

  describe('createDoc', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({ docId: 'new-doc-id' });

      const request: CreateDocRequest = {
        notebook: 'notebook-id',
        path: '/test/doc',
        markdown: '# 测试文档',
      };

      await createDoc(mockClient, request);

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/createDocWithMd', request);
    });

    it('应返回新创建的文档 ID', async () => {
      mockClient.post.mockResolvedValue('doc-id-123');

      const result = await createDoc(mockClient, {
        notebook: 'notebook-id',
        path: '/test',
      });

      expect(result).toBe('doc-id-123');
    });
  });

  describe('deleteDoc', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({});

      await deleteDoc(mockClient, 'notebook-id', '/test/doc');

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/removeDoc', {
        notebook: 'notebook-id',
        path: '/test/doc',
      });
    });
  });

  describe('deleteDocByID', () => {
    it('应调用正确的 API 端点并传递文档 ID', async () => {
      mockClient.post.mockResolvedValue({});

      await deleteDocByID(mockClient, 'doc-id-123');

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/removeDoc', {
        id: 'doc-id-123',
      });
    });
  });

  describe('renameDoc', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({});

      await renameDoc(mockClient, 'notebook-id', '/old/path', '新标题');

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/renameDoc', {
        notebook: 'notebook-id',
        path: '/old/path',
        title: '新标题',
      });
    });
  });

  describe('renameDocByID', () => {
    it('应调用正确的 API 端点并传递文档 ID', async () => {
      mockClient.post.mockResolvedValue({});

      await renameDocByID(mockClient, 'doc-id-123', '新标题');

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/renameDoc', {
        id: 'doc-id-123',
        title: '新标题',
      });
    });
  });

  describe('moveDocs', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({});

      const request: MoveDocRequest = {
        fromPaths: ['/old/path'],
        toNotebook: 'new-notebook',
        toPath: '/new/path',
      };

      await moveDocs(mockClient, request);

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/moveDocs', request);
    });
  });

  describe('moveDocsByID', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({});

      const request: MoveDocByIDRequest = {
        fromIDs: ['doc-id-123'],
        toID: 'doc-id-456',
      };

      await moveDocsByID(mockClient, request);

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/moveDocs', request);
    });
  });

  describe('exportDoc', () => {
    it('应调用正确的 API 端点并传递文档 ID', async () => {
      mockClient.post.mockResolvedValue({ content: '# 导出的内容' });

      await exportDoc(mockClient, 'doc-id-123');

      expect(mockClient.post).toHaveBeenCalledWith('/api/export/exportMdContent', {
        id: 'doc-id-123',
      });
    });

    it('应返回导出的内容', async () => {
      const mockResult = { content: '# 导出的内容\n\n更多内容' };

      mockClient.post.mockResolvedValue(mockResult);

      const result = await exportDoc(mockClient, 'doc-id-123');

      expect(result).toEqual(mockResult);
    });
  });

  describe('getHPathByPath', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({ hpath: '笔记本/路径/文档' });

      await getHPathByPath(mockClient, 'notebook-id', '/path/doc');

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/getHPathByPath', {
        notebook: 'notebook-id',
        path: '/path/doc',
      });
    });
  });

  describe('getHPathByID', () => {
    it('应调用正确的 API 端点并传递文档 ID', async () => {
      mockClient.post.mockResolvedValue('笔记本/路径/文档');

      await getHPathByID(mockClient, 'doc-id-123');

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/getHPathByID', {
        id: 'doc-id-123',
      });
    });

    it('应返回可读路径', async () => {
      mockClient.post.mockResolvedValue('笔记本/路径/文档');

      const result = await getHPathByID(mockClient, 'doc-id-123');

      expect(result).toBe('笔记本/路径/文档');
    });
  });

  describe('getIDsByHPath', () => {
    it('应调用正确的 API 端点并传递路径', async () => {
      mockClient.post.mockResolvedValue(['id-1', 'id-2', 'id-3']);

      await getIDsByHPath(mockClient, '笔记本/路径/文档');

      expect(mockClient.post).toHaveBeenCalledWith('/api/filetree/getIDsByHPath', {
        path: '笔记本/路径/文档',
      });
    });

    it('应返回 ID 列表', async () => {
      const mockIDs = ['id-1', 'id-2', 'id-3'];

      mockClient.post.mockResolvedValue(mockIDs);

      const result = await getIDsByHPath(mockClient, '笔记本/路径/文档');

      expect(result).toEqual(mockIDs);
    });
  });
});
