import { importMarkdownReplace } from '../../utils/markdown'

export default () => ({
  name: 'vitdocImportMarkdownPlugin',
  modifyMarkdown: importMarkdownReplace,
})
