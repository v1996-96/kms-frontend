import Collection from 'ampersand-collection'
import State from 'ampersand-state'

import PermissionModel from '../project-permission'

export default State.extend({
  props: {
    'project_role_id': 'any',
    'name': 'string',
    'system': 'boolean'
  },
  collections: {
    'permissions': Collection.extend({ model: PermissionModel })
  }
})
