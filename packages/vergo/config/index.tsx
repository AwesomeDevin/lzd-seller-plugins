import { resolveConfig as esBuildResolveConfig } from "esbuild-resolve-config";


export interface Config {
  registry: string;
  isBeta: boolean;
}


export default function resolveConfig(commandConfig): Config {

  const userConfig: Partial<Config> = esBuildResolveConfig<Config>(".versionrc", {}) || {}

  const config = {
    ...commandConfig,
    ...userConfig,
  }

  return config;
}
