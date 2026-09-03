import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'marketing', title: 'Marketing'},
    {name: 'curriculum', title: 'Curriculum'},
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
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{type: 'instructor'}],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      group: 'marketing',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'marketing',
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
      name: 'level',
      title: 'Level',
      type: 'string',
      group: 'marketing',
      options: {
        list: [
          {title: 'Beginner', value: 'Beginner'},
          {title: 'Intermediate', value: 'Intermediate'},
          {title: 'Advanced', value: 'Advanced'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      group: 'marketing',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'popular',
      title: 'Popular',
      type: 'boolean',
      group: 'marketing',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student count',
      type: 'number',
      group: 'marketing',
      description: 'Display only.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'learningOutcomes',
      title: "What you'll learn",
      type: 'array',
      group: 'marketing',
      of: [defineArrayMember({type: 'learningOutcome'})],
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      group: 'curriculum',
      of: [defineArrayMember({type: 'module'})],
      validation: (rule) => rule.min(1).error('A course needs at least one module'),
    }),
  ],
  preview: {
    select: {title: 'title', instructor: 'instructor.name', media: 'coverImage'},
    prepare({title, instructor, media}) {
      return {title, subtitle: instructor ? `by ${instructor}` : 'Course', media}
    },
  },
})
