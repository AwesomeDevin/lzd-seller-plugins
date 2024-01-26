const importRegex = /import\s+([\w-]+)\s+from\s+['"]([^'"]+\.mdx?)['"]\s*;?/g
const reactDocgenPropsRegex =
  /<ReactDocgenProps\s+path="([^"]+)\.(tsx|jsx)"\s*(\/>|>[^<]*<\/ReactDocgenProps>)/g
const yamlRegex = /^\s*---([\s\S]*?)---/

const tagRegex = (tagName) => new RegExp(`<${tagName}[^>]*>`, 'g')

/**
 * replace import statement to <embed />
 */
export const importMarkdownReplace = (content: string) => {
  let modifiedContent = content
  let mdImportMatch
  while ((mdImportMatch = importRegex.exec(content)) !== null) {
    const [importer, tagName, tagValue] = mdImportMatch
    const hasTag = modifiedContent.match(tagRegex(tagName))
    if (hasTag) {
      // delete import line
      modifiedContent = modifiedContent.replace(importer, '')
      // replace tagName with embed and set tagValue to src
      modifiedContent = modifiedContent.replace(
        tagRegex(tagName),
        `<embed src="${tagValue}"></embed>`
      )
    }
  }
  return content
}

/**
 * replace ReactDocgenProps to API
 */
export const replaceReactDocgenPropsToAPI = (content: string) =>
  content.replace(reactDocgenPropsRegex, '<API src="$1.type" />')

export type TVitdocReplaceYamlPluginParams = Record<string, string>

/**
 * replace yaml keys to new keys
 */
export const yamlReplace = async (
  content: string,
  yamlKeyMap: TVitdocReplaceYamlPluginParams
) => {
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
}
