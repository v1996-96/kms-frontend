import State from 'ampersand-state'

export default State.extend({
  props: {
    'template_id': 'any',
    'template_type': 'string',
    'project_id': 'any',
    'project_name': 'string',
    'project_slug': 'string',
    'creator_id': 'any',
    'slug': 'string',
    'title': 'string',
    'description': 'string',
    'content': 'string',
    'date_created': 'string',
    'system': 'boolean'
  }
})
