import {
  yamlReplace,
  importMarkdownReplace,
  reactDocgenPropsRename,
  TVitdocReplaceYamlPluginParams,
} from '../../utils/markdown'

const name = 'vitdocIceMarkdownReplacePlugin'

export type IceMarkdownReplacePluginOptions = {
  yamlKeyMap?: TVitdocReplaceYamlPluginParams
}

export default (options: IceMarkdownReplacePluginOptions) => ({
  name,
  modifyMarkdown: (content: string) => {
    let modifiedContent = content

    // replace import statement to <embed />
    modifiedContent = importMarkdownReplace(modifiedContent)
    // replace ReactDocgenProps to API
    modifiedContent = reactDocgenPropsRename(modifiedContent)
    // replace yaml keys to new keys
    options?.yamlKeyMap && yamlReplace(content, options?.yamlKeyMap)

    return modifiedContent
  },
})
