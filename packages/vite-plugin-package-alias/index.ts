/**
 * auto resolve package name alias for vite
 */

import { isMonorepo as isMonorepoFn, Logger } from "../../utils"
import * as path from 'path'
import * as glob from 'glob'
import * as fsExtra from 'fs-extra'
import { mergeConfig } from 'vite'

export interface IVitePackageNameAliasPluginParams {
  entryConfig?: string
}

const name = 'vitePackageNameAliasPlugin'

const logger = new Logger(name)

export default (options?: IVitePackageNameAliasPluginParams) => {

  let { entryConfig = 'src/index' } = options || {}

  return ({
    name,
    config: async (config) => {
      const isMonorepo = isMonorepoFn()
      entryConfig = entryConfig.replace(/\.(tsx|jsx|ts|js)?$/g, '')

      try {
        const findPath = path.join(process.cwd(), isMonorepo ? `**/${entryConfig}.{tsx,jsx,ts,js}` : `${entryConfig}.{tsx,jsx,ts,js}`)
        const entry = glob.sync(findPath, {
          cwd: process.cwd(),
          ignore: '**/node_modules/**'
        });

        if (!entry.length) throw new Error("no entry file");

        const packageAlias = isMonorepo ? entry.map(item => {

          const reg = new RegExp(`${entryConfig}.(tsx|jsx|ts|js)`, 'g')

          const pkgPath = path.join(item.replace(reg, ''), "package.json")

          return fsExtra.existsSync(pkgPath) ? {
            [fsExtra.readJSONSync(pkgPath).name]: item
          } : {}
        }).reduce((prev, next) => ({ ...prev, ...next }), {}) : {
          [fsExtra.readJSONSync(path.join(process.cwd(), "package.json")).name]:
            entry[0],
        }

        logger.info('Current Entry Config: ' + entryConfig)
        logger.success('Resolve Entry Config Success1:\n' + JSON.stringify(packageAlias, null, 2))

        console.log('mergeConfig', mergeConfig(config, {
          resolve: {
            alias: packageAlias
          }
        }).resolve.alias)

        return mergeConfig(config, {
          resolve: {
            alias: packageAlias
          }
        })
      } catch (e: any) {
        logger.error(`Resolve Entry Config Error: ${e.message} !!!`)
        return config;
      }
    },
  })
}