import State from 'ampersand-state'

export default State.extend({
  props: {
    'attachment_id': 'any',
    'name': 'string',
    'document_id': 'any',
    'user_id': 'any',
    'link': 'string',
    'type': 'string',
    'time_created': 'string'
  }
})
