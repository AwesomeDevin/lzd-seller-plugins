import parseArgs from 'yargs-parser';

/**
 * 是否是日常环境
 */
const buildArgv = parseArgs(process.env.BUILD_ARGV_STR || '');
export const isDaily = buildArgv.def_publish_env === 'daily';