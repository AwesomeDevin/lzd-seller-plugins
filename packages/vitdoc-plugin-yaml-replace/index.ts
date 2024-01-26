


const name = 'vitdocReplaceYamlPlugin'

export type TVitdocReplaceYamlPluginParams = Record<string, string>

export default (yamlKeyMap: TVitdocReplaceYamlPluginParams) => ({
  name,
  modifyMarkdown: async (content, id) => {
    // replace 左侧菜单 yaml key 
    const yamlMatches = content?.match(/---([\s\S]*?)---/)
    if (yamlMatches) {
      const yamlStr = yamlMatches?.[1]
      const yamlObj = yamlStr.split('\n').reduce((acc, cur) => {
        const [key, value] = cur.split(':')
        if (key && value) {
          acc[key.trim()] = value.trim()
        }
        return acc
      }, {})
      const newKeyObj = Object.keys(yamlObj).reduce((acc, cur) => {
        const newKey = yamlKeyMap[cur] || cur
        acc[newKey] = yamlObj[cur]
        return acc
      }, {})

      const newStr = Object.keys(newKeyObj).reduce((acc, cur) => {
        return acc + `\n${cur}: ${newKeyObj[cur]}\n`
      }, '')

      content = content.replace(yamlStr, newStr)
    }
    return content
  },
})