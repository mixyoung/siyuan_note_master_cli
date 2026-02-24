/**
 * 类型定义单元测试
 */

import type {
  Config,
  OutputFormat,
  APIResponse,
  Notebook,
  Document,
  Block,
  BlockAttributes,
  CreateDocRequest,
  UpdateBlockRequest,
  InsertBlockRequest,
  MoveDocRequest,
  MoveDocByIDRequest,
  ExportResult,
  SQLQueryResult,
} from '../../../src/types';

describe('类型定义', () => {
  describe('Config', () => {
    it('应正确定义配置类型', () => {
      const config: Config = {
        endpoint: 'http://127.0.0.1:6806',
        token: 'test-token',
        timeout: 10000,
        outputFormat: 'table',
      };

      expect(config.endpoint).toBe('http://127.0.0.1:6806');
      expect(config.token).toBe('test-token');
      expect(config.timeout).toBe(10000);
      expect(config.outputFormat).toBe('table');
    });

    it('应支持所有输出格式', () => {
      const formats: OutputFormat[] = ['table', 'json', 'markdown'];

      formats.forEach((format) => {
        const config: Config = {
          endpoint: 'http://127.0.0.1:6806',
          token: 'test-token',
          timeout: 10000,
          outputFormat: format,
        };

        expect(config.outputFormat).toBe(format);
      });
    });
  });

  describe('APIResponse', () => {
    it('应正确定义 API 响应类型', () => {
      const response: APIResponse<string> = {
        code: 0,
        msg: 'success',
        data: 'test-data',
      };

      expect(response.code).toBe(0);
      expect(response.msg).toBe('success');
      expect(response.data).toBe('test-data');
    });
  });

  describe('Notebook', () => {
    it('应正确定义笔记本类型', () => {
      const notebook: Notebook = {
        id: 'notebook-id',
        name: '测试笔记本',
        icon: '📁',
        sort: 1,
        closed: false,
      };

      expect(notebook.id).toBe('notebook-id');
      expect(notebook.name).toBe('测试笔记本');
      expect(notebook.icon).toBe('📁');
      expect(notebook.sort).toBe(1);
      expect(notebook.closed).toBe(false);
    });
  });

  describe('Document', () => {
    it('应正确定义文档类型', () => {
      const document: Document = {
        id: 'doc-id',
        title: '测试文档',
        hpath: '笔记本/路径/文档',
        box: 'notebook-id',
        type: 'd',
        updated: '2024-01-01',
      };

      expect(document.id).toBe('doc-id');
      expect(document.title).toBe('测试文档');
      expect(document.hpath).toBe('笔记本/路径/文档');
      expect(document.box).toBe('notebook-id');
    });
  });

  describe('Block', () => {
    it('应正确定义块类型', () => {
      const block: Block = {
        id: 'block-id',
        type: 'p',
        subType: 'li',
        content: '块内容',
        parentID: 'parent-id',
        created: '2024-01-01',
        updated: '2024-01-01',
      };

      expect(block.id).toBe('block-id');
      expect(block.type).toBe('p');
      expect(block.subType).toBe('li');
      expect(block.content).toBe('块内容');
      expect(block.parentID).toBe('parent-id');
    });
  });

  describe('CreateDocRequest', () => {
    it('应正确定义创建文档请求类型', () => {
      const request: CreateDocRequest = {
        notebook: 'notebook-id',
        path: '/test/path',
        markdown: '# 测试',
      };

      expect(request.notebook).toBe('notebook-id');
      expect(request.path).toBe('/test/path');
      expect(request.markdown).toBe('# 测试');
    });
  });

  describe('UpdateBlockRequest', () => {
    it('应正确定义更新块请求类型', () => {
      const request: UpdateBlockRequest = {
        id: 'block-id',
        dataType: 'markdown',
        data: '新内容',
      };

      expect(request.id).toBe('block-id');
      expect(request.dataType).toBe('markdown');
      expect(request.data).toBe('新内容');
    });

    it('应支持 dom 数据类型', () => {
      const request: UpdateBlockRequest = {
        id: 'block-id',
        dataType: 'dom',
        data: '<div>内容</div>',
      };

      expect(request.dataType).toBe('dom');
    });
  });

  describe('InsertBlockRequest', () => {
    it('应正确定义插入块请求类型', () => {
      const request: InsertBlockRequest = {
        dataType: 'markdown',
        data: '插入内容',
        previousID: 'prev-id',
      };

      expect(request.dataType).toBe('markdown');
      expect(request.data).toBe('插入内容');
      expect(request.previousID).toBe('prev-id');
    });

    it('应支持 parentID 选项', () => {
      const request: InsertBlockRequest = {
        dataType: 'markdown',
        data: '插入内容',
        parentID: 'parent-id',
      };

      expect(request.parentID).toBe('parent-id');
    });
  });

  describe('SQLQueryResult', () => {
    it('应正确定义 SQL 查询结果类型', () => {
      const result: SQLQueryResult = {
        data: [
          ['id1', '标题1'],
          ['id2', '标题2'],
        ],
        columns: ['id', 'title'],
      };

      expect(result.data).toHaveLength(2);
      expect(result.columns).toHaveLength(2);
      expect(result.columns).toEqual(['id', 'title']);
    });
  });

  describe('ExportResult', () => {
    it('应正确定义导出结果类型', () => {
      const result: ExportResult = {
        content: '# 导出内容\n\n更多内容',
      };

      expect(result.content).toBe('# 导出内容\n\n更多内容');
    });
  });
});
