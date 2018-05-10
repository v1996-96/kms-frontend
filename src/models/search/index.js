import State from 'ampersand-state'

export default State.extend({
  props: {
    'id': 'any',
    'name': 'string',
    'type': 'string',
    'avatar': 'string',
    'slug': 'string',
    'parent_slug': 'string'
  }
})
