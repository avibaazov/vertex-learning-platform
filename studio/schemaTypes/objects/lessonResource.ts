import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * One downloadable/linked resource attached to a lesson (AGENTS.md §8).
 * Embedded in `lesson.resources`.
 */
export const lessonResource = defineType({
  name: 'lessonResource',
  title: 'Resource',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'resourceType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'PDF', value: 'pdf'},
          {title: 'Link', value: 'link'},
          {title: 'Code', value: 'code'},
          {title: 'Download', value: 'download'},
          {title: 'Article', value: 'article'},
        ],
        layout: 'radio',
      },
      initialValue: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'resourceType'},
  },
})
