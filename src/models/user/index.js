import Collection from 'ampersand-collection'
import State from 'ampersand-state'

import RoleShortModel from '../role/short'
import CompetenceModel from '../competence'

export default State.extend({
  props: {
    'user_id': 'any',
    'name': 'string',
    'surname': 'string',
    'email': 'string',
    'avatar': 'string',
    'date_registered': 'string'
  },
  collections: {
    'roles': Collection.extend({ model: RoleShortModel }),
    'competences': Collection.extend({ model: CompetenceModel })
  }
})
