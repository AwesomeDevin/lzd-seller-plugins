import { writeJSON } from "fs-extra";
import * as path from "path";
import updateVersion, { VersionType } from "./update-version";

export interface PluginOptions {
  registry?: string;
  isBeta?: boolean;
}

const defaultRegistry = 'https://registry.npmjs.org/'

export default async (api, options: PluginOptions) => {
  const { context, onHook } = api;
  const { registry = defaultRegistry, isBeta } = options || {};

  let type: VersionType = isBeta ? 'beta' : 'patch';

  onHook("before.build.run", async () => {
    const pkgJSON = context.pkg
    const newVersion = await updateVersion(pkgJSON, type, registry);
    const pkgPath = path.join(context.rootDir, "./package.json");
    pkgJSON.version = newVersion;
    await writeJSON(pkgPath, pkgJSON, { spaces: 2 });
  })
};
