import { Node, mergeAttributes } from '@tiptap/core'

const Monologue = Node.create({
  name: 'monologue',
  group: 'block',
  content: 'inline*',
  defining: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-monologue]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-monologue': '',
        class: 'monologue-block my-6 py-4 px-6 bg-slate-50 border-l-4 border-slate-500 rounded-r-lg italic',
      }),
      0,
    ]
  },
})

export default Monologue