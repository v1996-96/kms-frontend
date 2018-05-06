import State from 'ampersand-state'

export default State.extend({
  props: {
    'quick_link_id': 'any',
    'project_id': 'any',
    'document_id': 'any',
    'user_id': 'any',
    'external_link': 'string',
    'name': 'string',
    'project_slug': 'string',
    'document_slug': 'string'
  }
})
