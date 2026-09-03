import {PlayIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A lesson does not store its parent course (AGENTS.md §8) — derive the course
 * with a reverse reference (`references(^._id)`) when needed.
 */
export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'video', title: 'Video'},
    {name: 'resources', title: 'Resources'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'video',
      description: 'YouTube, Vimeo, or Bunny URL. Played as an embed on the lesson page.',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'poster',
      title: 'Poster / thumbnail',
      type: 'image',
      group: 'video',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'video',
      description: 'Display label, e.g. "14:32" or "1:02:10".',
      validation: (rule) =>
        rule
          .regex(/^\d{1,2}:\d{2}(:\d{2})?$/)
          .warning('Use mm:ss or h:mm:ss'),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free preview',
      type: 'boolean',
      group: 'content',
      description: 'A label only — not access control (AGENTS.md §7).',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student count',
      type: 'number',
      group: 'content',
      description: 'Display only.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key points',
      type: 'array',
      group: 'content',
      description: 'The "In this lesson you will…" list.',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'proTip',
      title: 'Pro tip',
      type: 'text',
      group: 'content',
      rows: 2,
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      group: 'resources',
      of: [defineArrayMember({type: 'lessonResource'})],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'poster', duration: 'duration', free: 'freePreview'},
    prepare({title, media, duration, free}) {
      const bits = [duration, free ? 'Free preview' : null].filter(Boolean)
      return {title, subtitle: bits.join(' · ') || 'Lesson', media}
    },
  },
})
