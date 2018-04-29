import State from 'ampersand-state'

export default State.extend({
  props: {
    'notification_id': 'any',
    'content': 'string',
    'time_fired': 'string',
    'meta': 'string',
    'read': 'boolean'
  }
})
