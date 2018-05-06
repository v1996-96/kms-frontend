import State from 'ampersand-state'

export default State.extend({
  props: {
    'project_id': 'any',
    'slug': 'string',
    'name': 'string',
    'description': 'string',
    'goal': 'string',
    'date_start': 'string',
    'date_end': 'string',
    'avatar': 'string',
    'is_open': 'boolean',
    'is_active': 'boolean'
  }
})
