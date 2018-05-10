import State from 'ampersand-state'
import UserShortModel from '../user/short'

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
    'quill_delta': 'string',
    'date_created': 'string',
    'system': 'boolean'
  },
  children: {
    'creator': UserShortModel
  }
})
