/**
 * 日志工具单元测试
 */

import { logger, LogLevel } from '../../../src/utils/logger';

describe('logger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('应记录 INFO 级别日志', () => {
    logger.info('测试信息', { key: 'value' });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('应记录 WARN 级别日志', () => {
    logger.warn('测试警告');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('应记录 ERROR 级别日志', () => {
    logger.error('测试错误', new Error('测试'));
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('应记录 DEBUG 级别日志', () => {
    logger.debug('测试调试');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('应支持设置日志级别', () => {
    logger.setLevel(LogLevel.WARN);
    logger.debug('这不应该显示');
    logger.warn('这应该显示');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
