import State from 'ampersand-state'
import Collection from 'ampersand-collection'
import QuickLinkShortModel from '../quick-link/short'

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
    'members_count': 'number',
    'is_open': 'boolean',
    'is_active': 'boolean',
    'permissions': 'array'
  },
  collections: {
    'quick_links': Collection.extend({
      model: QuickLinkShortModel
    })
  }
})
