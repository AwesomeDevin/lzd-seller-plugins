import {
  yamlReplace,
  TVitdocReplaceYamlPluginParams,
} from '../../utils/markdown-replace'

export default (yamlKeyMap: TVitdocReplaceYamlPluginParams) => ({
  name: 'vitdocReplaceYamlPlugin',
  modifyMarkdown: (content: string) => yamlReplace(content, yamlKeyMap),
})
