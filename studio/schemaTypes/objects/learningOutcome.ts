import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * One item in a course's "What you'll learn" section (AGENTS.md §8).
 * Embedded in `course.learningOutcomes`.
 */
export const learningOutcome = defineType({
  name: 'learningOutcome',
  title: 'Learning outcome',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name/token the site maps to a glyph (e.g. "rocket", "shield").',
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
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
