/**
 * 笔记本 API 单元测试
 */

import { SiYuanClient } from '../../../../src/api/client';
import {
  listNotebooks,
  createNotebook,
  deleteNotebook,
  renameNotebook,
  openNotebook,
  closeNotebook,
  getNotebookConfig,
} from '../../../../src/api/notebook';

describe('笔记本 API', () => {
  let mockClient: jest.Mocked<SiYuanClient>;

  beforeEach(() => {
    mockClient = {
      post: jest.fn(),
    } as any;
  });

  describe('listNotebooks', () => {
    it('应调用正确的 API 端点', async () => {
      mockClient.post.mockResolvedValue([
        { id: '1', name: '笔记本1' },
      ]);

      await listNotebooks(mockClient);

      expect(mockClient.post).toHaveBeenCalledWith('/api/notebook/lsNotebooks');
    });

    it('应返回笔记本列表', async () => {
      const mockNotebooks = [
        { id: '1', name: '笔记本1', icon: '📁' },
        { id: '2', name: '笔记本2', icon: '📚' },
      ];

      mockClient.post.mockResolvedValue(mockNotebooks);

      const result = await listNotebooks(mockClient);

      expect(result).toEqual(mockNotebooks);
    });
  });

  describe('createNotebook', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({ id: 'new-id' });

      await createNotebook(mockClient, '新笔记本');

      expect(mockClient.post).toHaveBeenCalledWith('/api/notebook/createNotebook', {
        name: '新笔记本',
      });
    });

    it('应返回新创建的笔记本', async () => {
      const mockNotebook = { id: 'new-id', name: '新笔记本' };

      mockClient.post.mockResolvedValue(mockNotebook);

      const result = await createNotebook(mockClient, '新笔记本');

      expect(result).toEqual(mockNotebook);
    });
  });

  describe('deleteNotebook', () => {
    it('应调用正确的 API 端点并传递笔记本 ID', async () => {
      mockClient.post.mockResolvedValue({});

      await deleteNotebook(mockClient, 'notebook-id');

      expect(mockClient.post).toHaveBeenCalledWith('/api/notebook/removeNotebook', {
        notebook: 'notebook-id',
      });
    });
  });

  describe('renameNotebook', () => {
    it('应调用正确的 API 端点并传递参数', async () => {
      mockClient.post.mockResolvedValue({});

      await renameNotebook(mockClient, 'notebook-id', '新名称');

      expect(mockClient.post).toHaveBeenCalledWith('/api/notebook/renameNotebook', {
        notebook: 'notebook-id',
        name: '新名称',
      });
    });
  });

  describe('openNotebook', () => {
    it('应调用正确的 API 端点并传递笔记本 ID', async () => {
      mockClient.post.mockResolvedValue({});

      await openNotebook(mockClient, 'notebook-id');

      expect(mockClient.post).toHaveBeenCalledWith('/api/notebook/openNotebook', {
        notebook: 'notebook-id',
      });
    });
  });

  describe('closeNotebook', () => {
    it('应调用正确的 API 端点并传递笔记本 ID', async () => {
      mockClient.post.mockResolvedValue({});

      await closeNotebook(mockClient, 'notebook-id');

      expect(mockClient.post).toHaveBeenCalledWith('/api/notebook/closeNotebook', {
        notebook: 'notebook-id',
      });
    });
  });

  describe('getNotebookConfig', () => {
    it('应调用正确的 API 端点并传递笔记本 ID', async () => {
      mockClient.post.mockResolvedValue({
        name: '配置名称',
        closed: false,
      });

      await getNotebookConfig(mockClient, 'notebook-id');

      expect(mockClient.post).toHaveBeenCalledWith('/api/notebook/getNotebookConf', {
        notebook: 'notebook-id',
      });
    });

    it('应返回笔记本配置', async () => {
      const mockConfig = {
        name: '配置名称',
        closed: false,
        icon: '📁',
      };

      mockClient.post.mockResolvedValue(mockConfig);

      const result = await getNotebookConfig(mockClient, 'notebook-id');

      expect(result).toEqual(mockConfig);
    });
  });
});
