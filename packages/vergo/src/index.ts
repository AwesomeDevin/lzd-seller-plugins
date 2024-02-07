import { writeJSON, readFile } from "fs-extra";
import * as path from "path";
import updateVersion, { VersionType } from "./update-version";
import resolveConfig, { Config } from "../config";
import { asvCliLogger } from "./log";
import { defRegistry, defVersion, isDaily } from "../config/def";
import { DEFAULT_IS_BETA, DEFAULT_REGISTRY } from "../config/constant";

export * from '../config/constant'
export * from '../config/def'

const defDefaultConfig = {
  registry: defRegistry || DEFAULT_REGISTRY,
  beta: DEFAULT_IS_BETA || isDaily,
  set: defVersion,
}

const commonDefaultConfig = {
  registry: DEFAULT_REGISTRY,
  beta: DEFAULT_IS_BETA,
}



export default async function run(commandConfig: Config) {
  const resolvedConfig = resolveConfig(commandConfig)
  const {
    def: resolvedDef,
  } = resolvedConfig;

  const finalConfig = {
    ...resolvedDef ? defDefaultConfig : commonDefaultConfig,
    ...resolvedConfig,
  }

  const {
    registry,
    beta,
    set,
  } = finalConfig;


  try {
    let type: VersionType = beta ? 'beta' : 'patch';
    const packagePath = path.join(process.cwd(), "./package.json");
    const pkgJSON = JSON.parse(await readFile(packagePath, 'utf8'))
    const newVersion = await updateVersion({
      name: pkgJSON.name,
      version: set || pkgJSON.version
    }, type, registry);
    pkgJSON.version = newVersion;
    await writeJSON(packagePath, pkgJSON, { spaces: 2 });
  } catch (e: any) {
    console.log('error', e)
    asvCliLogger.error('[auto-semver-version] error:' + e.message);
  }
}


