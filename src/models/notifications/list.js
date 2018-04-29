import SearchResults from '../helpers/search-results'
import NotificationModel from './index'

export default SearchResults(NotificationModel).extend({
  props: {
    'count_unread': 'number'
  }
})
