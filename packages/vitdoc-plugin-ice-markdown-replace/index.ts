import {
  yamlReplace,
  importMarkdownReplace,
  reactDocgenPropsRename,
  TVitdocReplaceYamlParams,
} from '../../utils/markdown'

const name = 'vitdocIceMarkdownReplacePlugin'

export type IceMarkdownReplacePluginOptions = {
  yamlKeyMap?: TVitdocReplaceYamlParams
}

export default (options?: IceMarkdownReplacePluginOptions) => ({
  name,
  modifyMarkdown: (content: string) => {
    let modifiedContent = content

    // replace yaml keys to new keys
    modifiedContent = yamlReplace(modifiedContent, options?.yamlKeyMap)
    // replace import statement to <embed />
    modifiedContent = importMarkdownReplace(modifiedContent)
    // replace ReactDocgenProps to API
    modifiedContent = reactDocgenPropsRename(modifiedContent)

    return modifiedContent
  },
})
