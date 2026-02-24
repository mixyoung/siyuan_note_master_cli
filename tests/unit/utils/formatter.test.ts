/**
 * 格式化工具单元测试
 */

import {
  formatOutput,
  formatSuccess,
  formatError,
  formatInfo,
  formatWarning,
  formatNotebooks,
  formatBlocks,
} from '../../../src/utils/formatter';

describe('formatOutput', () => {
  it('应格式化对象为表格', () => {
    const data = [
      { id: '1', name: '笔记本1', icon: '📁' },
      { id: '2', name: '笔记本2', icon: '📚' },
    ];

    // 这个测试确保函数不会抛出错误
    expect(() => formatOutput(data, 'table')).not.toThrow();
  });

  it('应格式化对象为 JSON', () => {
    const data = { id: '1', name: '测试' };

    expect(() => formatOutput(data, 'json')).not.toThrow();
  });

  it('应格式化对象为 Markdown', () => {
    const data = [
      { id: '1', name: '笔记本1' },
    ];

    expect(() => formatOutput(data, 'markdown')).not.toThrow();
  });
});

describe('formatSuccess', () => {
  it('应输出成功消息', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    formatSuccess('操作成功');

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('formatError', () => {
  it('应输出错误消息', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    formatError(new Error('发生错误'));

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('formatInfo', () => {
  it('应输出信息消息', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    formatInfo('这是信息');

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('formatWarning', () => {
  it('应输出警告消息', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    formatWarning('这是警告');

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('formatNotebooks', () => {
  it('应格式化笔记本列表', () => {
    const notebooks = [
      { id: '1', name: '笔记本1', icon: '📁', sort: 1, closed: false },
      { id: '2', name: '笔记本2', icon: '📚', sort: 2, closed: true },
    ];

    expect(() => formatNotebooks(notebooks, 'table')).not.toThrow();
  });

  it('应格式化笔记本列表为 JSON', () => {
    const notebooks = [
      { id: '1', name: '笔记本1', icon: '📁', sort: 1, closed: false },
    ];

    expect(() => formatNotebooks(notebooks, 'json')).not.toThrow();
  });

  it('应格式化笔记本列表为 Markdown', () => {
    const notebooks = [
      { id: '1', name: '笔记本1', icon: '📁', sort: 1, closed: false },
    ];

    expect(() => formatNotebooks(notebooks, 'markdown')).not.toThrow();
  });
});

describe('formatBlocks', () => {
  it('应格式化块列表', () => {
    const blocks = [
      {
        id: '1',
        type: 'd',
        content: '文档标题',
        created: '2024-01-01',
        updated: '2024-01-01',
      },
      {
        id: '2',
        type: 'p',
        content: '段落内容',
        created: '2024-01-01',
        updated: '2024-01-01',
      },
    ];

    expect(() => formatBlocks(blocks, 'table')).not.toThrow();
  });

  it('应格式化块列表为 JSON', () => {
    const blocks = [
      {
        id: '1',
        type: 'd',
        content: '文档标题',
      },
    ];

    expect(() => formatBlocks(blocks, 'json')).not.toThrow();
  });

  it('应格式化块列表为 Markdown', () => {
    const blocks = [
      {
        id: '1',
        type: 'd',
        content: '文档标题',
      },
    ];

    expect(() => formatBlocks(blocks, 'markdown')).not.toThrow();
  });
});
