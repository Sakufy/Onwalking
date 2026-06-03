import { Node, mergeAttributes } from '@tiptap/core'

const Summary = Node.create({
  name: 'summary',
  group: 'block',
  content: 'inline*',
  defining: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-summary]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-summary': '',
        class: 'summary-block my-6 py-4 px-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg',
      }),
      0,
    ]
  },
})

export default Summary