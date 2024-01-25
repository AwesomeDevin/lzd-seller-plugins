import { isMonorepo as isMonorepoFn, Logger } from "../../utils"
import * as path from 'path'
import * as glob from 'glob'
import * as fsExtra from 'fs-extra'

interface IProps {
  entryConfig: string
}

const name = 'vitdocPackageNameAliasPlugin'

const logger = new Logger(name)

export default (options?: IProps) => {

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

        const entryResult = isMonorepo ? entry.map(item => {

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
        logger.success('Resolve Entry Config Success:\n' + JSON.stringify(entryResult, null, 2))
        return {
          ...config,
          ...entryResult
        }
      } catch (e: any) {
        logger.error(`Resolve Entry Config Error: ${e.message} !!!`)
        return config;
      }
    },
  })
}