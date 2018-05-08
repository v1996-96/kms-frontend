import State from 'ampersand-state'

export default State.extend({
  props: {
    'bookmark_id': 'any',
    'user_id': 'any',
    'time_created': 'string',
    'document_id': 'any',
    'document_title': 'string',
    'document_slug': 'string'
  }
})
