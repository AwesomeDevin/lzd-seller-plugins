import {
  yamlReplace,
  TVitdocReplaceYamlPluginParams,
} from '../../utils/markdown'

export default (yamlKeyMap: TVitdocReplaceYamlPluginParams) => ({
  name: 'vitdocReplaceYamlPlugin',
  modifyMarkdown: (content: string) => yamlReplace(content, yamlKeyMap),
})
