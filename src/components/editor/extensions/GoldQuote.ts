import { Node, mergeAttributes } from '@tiptap/core'

const GoldQuote = Node.create({
  name: 'goldQuote',
  group: 'block',
  content: 'inline*',
  defining: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-gold-quote]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-gold-quote': '',
        class: 'gold-quote-block my-6 py-4 px-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-r-lg',
      }),
      0,
    ]
  },
})

export default GoldQuote