import { yamlReplace, TVitdocReplaceYamlParams } from '../../utils/markdown'

export type TVitdocReplaceYamlPluginParams = TVitdocReplaceYamlParams

export default (yamlKeyMap: TVitdocReplaceYamlPluginParams) => ({
  name: 'vitdocReplaceYamlPlugin',
  modifyMarkdown: (content: string) => yamlReplace(content, yamlKeyMap),
})
