import { Node, mergeAttributes } from '@tiptap/core'

const Dialogue = Node.create({
  name: 'dialogue',
  group: 'block',
  content: 'block*',
  defining: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-dialogue]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-dialogue': '',
        class: 'dialogue-block my-6 p-4 bg-gray-50 rounded-lg',
      }),
      0,
    ]
  },
})

export default Dialogue