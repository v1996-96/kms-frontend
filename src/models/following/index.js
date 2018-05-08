import State from 'ampersand-state'

export default State.extend({
  props: {
    'following_id': 'any',
    'user_id': 'any',
    'time_created': 'string',
    'avatar': 'string',
    'project_id': 'any',
    'project_slug': 'string',
    'project_name': 'string'
  }
})
