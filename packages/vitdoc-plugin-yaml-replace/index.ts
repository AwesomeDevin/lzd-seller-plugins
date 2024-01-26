const name = 'vitdocReplaceYamlPlugin'
export type TVitdocReplaceYamlPluginParams = Record<string, string>

const yamlRegex = /^\s*---([\s\S]*?)---/

export default (yamlKeyMap: TVitdocReplaceYamlPluginParams) => ({
  name,
  modifyMarkdown: async (content) => {
    let yamlSectionMatch = content.match(yamlRegex)
    if (yamlSectionMatch) {
      let newYamlSection = yamlSectionMatch[1]
      // 同时替换所有键值对
      newYamlSection = Object.entries(yamlKeyMap).reduce(
        (yamlContent, [key, newKey]) => {
          // 用字面量方式构建正则表达式以避免特殊字符的问题
          const keyRegex = new RegExp(`^${key}(?=\\s*:)`, 'm')
          const newKeyRegex = new RegExp(`^${newKey}(?=\\s*:)`, 'm')
          // 已存在 newKey 项时不对做替换
          return yamlContent.match(newKeyRegex)
            ? yamlContent
            : yamlContent.replace(keyRegex, newKey)
        },
        newYamlSection
      )

      // 仅替换匹配到的 YAML 部分
      content = content.replace(
        yamlSectionMatch[0],
        `---\n${newYamlSection}\n---`
      )
    }

    return content
  },
})
