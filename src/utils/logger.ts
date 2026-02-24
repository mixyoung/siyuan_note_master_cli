import chalk from 'chalk';

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

let currentLevel: LogLevel = LogLevel.INFO;

/**
 * 设置当前日志级别
 */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

/**
 * 记录调试消息
 */
export function debug(message: string): void {
  if (currentLevel <= LogLevel.DEBUG) {
    console.log(chalk.gray(`[DEBUG] ${message}`));
  }
}

/**
 * 记录信息消息
 */
export function info(message: string): void {
  if (currentLevel <= LogLevel.INFO) {
    console.log(chalk.blue(`[INFO] ${message}`));
  }
}

/**
 * 记录成功消息
 */
export function success(message: string): void {
  console.log(chalk.green(`[成功] ${message}`));
}

/**
 * 记录警告消息
 */
export function warn(message: string): void {
  if (currentLevel <= LogLevel.WARN) {
    console.warn(chalk.yellow(`[警告] ${message}`));
  }
}

/**
 * 记录错误消息
 */
export function error(message: string): void {
  if (currentLevel <= LogLevel.ERROR) {
    console.error(chalk.red(`[错误] ${message}`));
  }
}
