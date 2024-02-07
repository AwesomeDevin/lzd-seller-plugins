import { writeJSON, readFile } from "fs-extra";
import * as path from "path";
import updateVersion, { VersionType } from "./update-version";
import resolveConfig, { Config } from "../config";
import { asvCliLogger } from "./log";

export * from '../config/constant'


export default async function run(commandConfig: Config) {
  const {
    registry,
    beta
  } = resolveConfig(commandConfig)

  try {
    let type: VersionType = beta ? 'beta' : 'patch';
    const packagePath = path.join(process.cwd(), "./package.json");
    const pkgJSON = JSON.parse(await readFile(packagePath, 'utf8'))
    const newVersion = await updateVersion(pkgJSON, type, registry);

    pkgJSON.version = newVersion;
    await writeJSON(packagePath, pkgJSON, { spaces: 2 });
  } catch (e: any) {
    console.log('error', e)
    asvCliLogger.error('[auto-semver-version] error:' + e.message);
  }
}


