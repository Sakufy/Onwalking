import { defineType, defineField } from 'sanity'

export const articleSchema = defineType({
  name: 'article',
  title: '文章',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '分类',
      type: 'string',
      options: {
        list: [
          { title: '自我探索', value: '自我探索' },
          { title: '自我提升', value: '自我提升' },
          { title: '自我实现', value: '自我实现' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: '摘要',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: '内容',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'isFeatured',
      title: '精选文章',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
    }),
    defineField({
      name: 'version',
      title: '当前版本',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
    },
    prepare(selection) {
      const { title, category } = selection
      return {
        title,
        subtitle: category,
      }
    },
  },
})
