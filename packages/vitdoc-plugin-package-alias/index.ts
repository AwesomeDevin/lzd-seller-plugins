import { isMonorepo as isMonorepoFn, Logger } from "../../utils";
import path from "path";
import glob from "glob";
import fsExtra from "fs-extra";

export interface IVitdocPackageNameAliasPluginParams {
  entryConfig?: string;
}

const name = "vitdocPackageNameAliasPlugin";
const logger = new Logger(name);

export default (options: IVitdocPackageNameAliasPluginParams = {}) => {
  const entryConfig =
    options.entryConfig?.replace(/\.(tsx|jsx|ts|js)$/, "") || "src/index";

  return {
    name,
    config: async (config) => {
      try {
        const isMonorepo = isMonorepoFn();
        const entryResult = await resolveEntryConfig(entryConfig, isMonorepo);
        logger.info(
          "Resolved Entry Config Successfully:\n" +
            JSON.stringify(entryResult, null, 2)
        );
        return { ...config, ...entryResult };
      } catch (e: any) {
        logger.error(`Resolve Entry Config Error: ${e.message}`);
        return config;
      }
    },
  };
};

async function resolveEntryConfig(entryConfig: string, isMonorepo: boolean) {
  const pattern = `${isMonorepo ? "**/" : ""}${entryConfig}.{js,jsx,ts,tsx}`;
  const entryFiles = glob.sync(pattern, {
    cwd: process.cwd(),
    ignore: "**/node_modules/**",
  });

  if (!entryFiles.length) {
    throw new Error("No entry file found.");
  }

  return isMonorepo
    ? buildMonorepoEntryResult(entryFiles, entryConfig)
    : buildSingleRepoEntryResult(entryFiles);
}

async function buildMonorepoEntryResult(
  entryFiles: string[],
  entryConfig: string
) {
  const entryResult = {};
  const reg = new RegExp(`${entryConfig}.(tsx?|jsx?)$`);

  const promises = entryFiles.map(async (item) => {
    const pkgPath = path.join(path.dirname(item), "package.json");
    if (await fsExtra.pathExists(pkgPath)) {
      const pkg = await fsExtra.readJSON(pkgPath);
      if (reg.test(item)) {
        entryResult[pkg.name] = item;
      }
    }
  });

  await Promise.all(promises);
  return entryResult;
}

async function buildSingleRepoEntryResult(entryFiles: string[]) {
  const pkgPath = path.join(process.cwd(), "package.json");
  const pkg = await fsExtra.readJSON(pkgPath);
  return { [pkg.name]: entryFiles[0] };
}
