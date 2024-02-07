import parseArgs from 'yargs-parser';

/**
 * 是否是日常环境
 */
const buildArgv = parseArgs(process.env.BUILD_ARGV_STR || '');


const defVersionMatches = process.env.BUILD_GIT_BRANCH?.match(/\w+\/(\d+\.\d+\.\d+)/)


export const isDaily = buildArgv.def_publish_env === 'daily';

export const defVersion = defVersionMatches && defVersionMatches?.length > 1 && defVersionMatches[1];

export const defRegistry = 'https://registry.anpm.alibaba-inc.com/'