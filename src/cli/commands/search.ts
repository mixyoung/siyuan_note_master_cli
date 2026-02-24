import yargs from 'yargs/yargs';
import { loadConfig, Config } from '../../config';
import { SiYuanClient } from '../../api/client';
import { formatOutput, formatSuccess, formatError } from '../../utils/formatter';

/**
 * 搜索命令模块
 */
export class SearchCommand {
  /**
   * 执行 SQL 查询
   */
  static query = {
    describe: '执行 SQL 查询搜索内容',
    handler: async (argv: any) => {
      try {
        const config = await loadConfig(argv);
        const client = new SiYuanClient(config);
        const query = argv._[0] || ''; // SQL 查询语句
        const result = await client.sqlQuery(query);
        formatOutput(result, config.outputFormat || 'table');
      } catch (error) {
        formatError(error as Error);
        process.exit(1);
      }
    },
  };
}
