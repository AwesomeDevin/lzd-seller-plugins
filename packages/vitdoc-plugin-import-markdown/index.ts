const name = 'vitdocImportMarkdownPlugin'

export default () => ({
  name,
  modifyMarkdown: async (content, id) => {
    // replace import statement to <embed /> 
    const mdImportMatches = content?.match(/import +([\w-]+) +from +['|"]([.\/-\w]+\.md)['|"];?/g)
    if (mdImportMatches) {
      mdImportMatches.forEach(importer => {
        const mdMatches = importer?.match(/^import +([\w-]+) +from +['|"]([.\/-\w]+\.md)['|"];?$/)
        const tagName = mdMatches?.[1]
        const tagValue = mdMatches?.[2]
        const hasTag = content?.match(new RegExp(`<${tagName}[^>]*>`, 'g'))
        if (hasTag) {
          // delete import line
          content = content.replace(importer, '')

          // replace tagName with embed and set tagValue to src
          content = content.replace(new RegExp(`<${tagName}[^>]*>`, 'g'), `<embed src="${tagValue}"></embed>`)
        }
      })
    }
    return content
  },
})