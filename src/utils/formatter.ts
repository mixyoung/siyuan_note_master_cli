import chalk from 'chalk';
import Table, { Cell } from 'cli-table3';
import { Notebook, Block, BlockAttributes } from '../types';
import type { OutputFormat } from '../config';

/**
 * 根据指定的格式格式化输出
 */
export function formatOutput<T>(data: T, format: OutputFormat): void {
  switch (format) {
    case 'json':
      console.log(JSON.stringify(data, null, 2));
      break;
    case 'markdown':
      formatAsMarkdown(data);
      break;
    case 'table':
    default:
      formatAsTable(data);
      break;
  }
}

/**
 * 格式化为表格
 */
function formatAsTable(data: unknown): void {
  if (Array.isArray(data) && data.length > 0) {
    const table = new Table({
      head: Object.keys(data[0]),
      style: { head: ['cyan', 'bold'] },
    });
    data.forEach((row) => {
      table.push(Object.values(row) as Cell[]);
    });
    console.log(table.toString());
  } else if (typeof data === 'object' && data !== null) {
    const table = new Table({
      head: Object.keys(data),
      style: { head: ['cyan', 'bold'] },
    });
    table.push(Object.values(data) as Cell[]);
    console.log(table.toString());
  } else {
    console.log(chalk.gray('没有数据可显示'));
  }
}

/**
 * 格式化为 Markdown
 */
function formatAsMarkdown(data: unknown): void {
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]);
    console.log(`| ${headers.join(' | ')} |`);
    console.log(`| ${headers.map(() => '---').join(' | ')} |`);
    data.forEach((row) => {
      console.log(`| ${Object.values(row).join(' | ')} |`);
    });
  } else if (typeof data === 'object' && data !== null) {
    const headers = Object.keys(data);
    console.log(`| ${headers.join(' | ')} |`);
    console.log(`| ${headers.map(() => '---').join(' | ')} |`);
    console.log(`| ${Object.values(data).join(' | ')} |`);
  } else {
    console.log(chalk.gray('没有数据可显示'));
  }
}

/**
 * 格式化笔记本列表
 */
export function formatNotebooks(notebooks: Notebook[], format: OutputFormat): void {
  formatOutput(notebooks, format);
}

/**
 * 格式化块列表
 */
export function formatBlocks(blocks: Block[], format: OutputFormat): void {
  formatOutput(blocks, format);
}

/**
 * 格式化块属性
 */
export function formatBlockAttributes(attrs: BlockAttributes, format: OutputFormat): void {
  formatOutput(attrs, format);
}

/**
 * 格式化错误消息
 */
export function formatError(error: Error | string): void {
  const message = typeof error === 'string' ? error : error.message;
  console.error(chalk.red(`错误: ${message}`));
}

/**
 * 格式化成功消息
 */
export function formatSuccess(message: string): void {
  console.log(chalk.green(`成功: ${message}`));
}

/**
 * 格式化信息消息
 */
export function formatInfo(message: string): void {
  console.log(chalk.cyan(message));
}

/**
 * 格式化警告消息
 */
export function formatWarning(message: string): void {
  console.warn(chalk.yellow(`警告: ${message}`));
}
