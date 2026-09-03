import {type SchemaTypeDefinition} from 'sanity'

import {category} from './documents/category'
import {course} from './documents/course'
import {instructor} from './documents/instructor'
import {lesson} from './documents/lesson'
import {learningOutcome} from './objects/learningOutcome'
import {lessonResource} from './objects/lessonResource'
import {module} from './objects/module'
import {portableText} from './objects/portableText'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects (register before the documents that use them)
  portableText,
  learningOutcome,
  lessonResource,
  module,

  // Documents
  category,
  instructor,
  lesson,
  course,
]
