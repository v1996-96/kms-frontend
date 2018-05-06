import State from 'ampersand-state'

export default State.extend({
  props: {
    'user_id': 'any',
    'name': 'string',
    'surname': 'string',
    'email': 'string',
    'avatar': 'string',
    'date_registered': 'string',
    'roles': 'array',
    'permissions': 'array'
  }
})
