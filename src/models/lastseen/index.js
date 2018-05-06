import State from 'ampersand-state'

export default State.extend({
  props: {
    'last_seen_document_id': 'any',
    'user_id': 'any',
    'time_created': 'string',
    'document_id': 'any',
    'document_slug': 'string',
    'document_title': 'string'
  }
})
