import State from 'ampersand-state'
import RoleShortModel from '../project-role/short'

export default State.extend({
  props: {
    'user_id': 'any',
    'name': 'string',
    'surname': 'string',
    'email': 'string',
    'avatar': 'string',
    'date_joined': 'string',
    'position': 'string'
  },
  children: {
    'project_role': RoleShortModel
  }
})
