import State from 'ampersand-state'
import ProjectShortModel from '../project/short'
import DocumentShortModel from '../document/short'

export default State.extend({
  props: {
    'quick_link_id': 'any',
    'project_id': 'any',
    'document_id': 'any',
    'user_id': 'any',
    'external_link': 'string',
    'name': 'string'
  },
  children: {
    'project': ProjectShortModel,
    'document': DocumentShortModel
  }
})
