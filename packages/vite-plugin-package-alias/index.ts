/**
 * auto resolve package name alias for vite
 */
import { isMonorepo as isMonorepoFn, Logger } from '../../utils'
import path from 'path'
import glob from 'glob'
import fsExtra from 'fs-extra'
import { mergeConfig } from 'vite'

export interface IVitePackageNameAliasPluginParams {
  entryPointPath?: string
}

const name = 'vitePackageNameAliasPlugin'
const logger = new Logger(name)

export default (options?: IVitePackageNameAliasPluginParams) => {
  let { entryPointPath = 'src/index' } = options || {}
  return {
    name,
    config: async (config) => {
      const isMonorepo = isMonorepoFn()
      entryPointPath = entryPointPath.replace(/\.(tsx?|jsx?)?$/, '')
      try {
        const pattern = isMonorepo
          ? `**/${entryPointPath}.{tsx,jsx,ts,js}`
          : `${entryPointPath}.{tsx,jsx,ts,js}`

        const entryFiles = glob.sync(path.join(process.cwd(), pattern), {
          cwd: process.cwd(),
          ignore: '**/node_modules/**',
        })

        if (entryFiles.length === 0) {
          throw new Error('no entry file found')
        }

        const packageAlias = await createPackageAlias(
          entryFiles,
          entryPointPath
        )
        logger.info('Current Entry Config: ' + entryPointPath)
        logger.success(
          'Resolved Entry Config:\n' + JSON.stringify(packageAlias, null, 2)
        )

        return mergeConfig(config, {
          resolve: { alias: packageAlias },
        })
      } catch (e: any) {
        logger.error(`Resolve Entry Config Error: ${e.message} !!!`)
        return config
      }
    },
  }
}

async function createPackageAlias(entryFiles, entryPointPath) {
  const packageAlias = {}
  const packagePromises = entryFiles.map(async (filePath) => {
    const pkgPath = path.join(
      filePath.replace(entryPointPath, ''),
      '../package.json'
    )
    if (await fsExtra.pathExists(pkgPath)) {
      try {
        const pkg = await fsExtra.readJSON(pkgPath)
        pkg?.name &&
          Object.assign(packageAlias, {
            [pkg.name]: filePath.replace(
              `${entryPointPath}.(tsx?|jsx?)`,
              ''
            ),
          })
      } catch (error) {
        // Log the error if needed
        return null // Or throw the error, depending on the desired behavior
      }
    }
  })

  await Promise.allSettled(packagePromises)

  return packageAlias
}
