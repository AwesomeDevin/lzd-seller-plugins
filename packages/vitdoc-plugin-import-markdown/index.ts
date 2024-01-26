import { importMarkdownReplace } from '../../utils/markdown-replace'

export default () => ({
  name: 'vitdocImportMarkdownPlugin',
  modifyMarkdown: importMarkdownReplace,
})
