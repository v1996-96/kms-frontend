import State from 'ampersand-state'
import UserShortDto from '../user/short'

export default State.extend({
  props: {
    'document_id': 'any',
    'parent_document_id': 'any',
    'project_id': 'any',
    'creator_id': 'any',
    'slug': 'string',
    'title': 'string',
    'subtitle': 'string',
    'content': 'string',
    'date_created': 'string',
    'is_draft': 'boolean',
    'likes_count': 'number',
    'project_name': 'string',
    'project_slug': 'string'
  },
  children: {
    'creator': UserShortDto
  }
})
