import State from 'ampersand-state'
import UserShortModel from '../user/short'

export default State.extend({
  props: {
    'template_id': 'any',
    'template_type': 'string',
    'project_id': 'any',
    'creator_id': 'any',
    'slug': 'string',
    'title': 'string',
    'description': 'string',
    'content': 'string',
    'date_created': 'string'
  },
  children: {
    'creator': UserShortModel
  }
})
