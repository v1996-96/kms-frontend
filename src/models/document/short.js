import State from 'ampersand-state'

export default State.extend({
  props: {
    'document_id': 'any',
    'parent_document_id': 'any',
    'parent_document_slug': 'string',
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
  }
})
