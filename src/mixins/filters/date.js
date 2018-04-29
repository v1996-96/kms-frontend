import moment from 'moment'

export default {
  filters: {
    timeAgoFilter (date) {
      var diff = moment(date).diff(moment())
      return moment.duration(diff).humanize(true)
    }
  }
}
