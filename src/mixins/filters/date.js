import moment from 'moment'

export default {
  filters: {
    timeAgoFilter (date) {
      var diff = moment(date).diff(moment())
      return moment.duration(diff).humanize(true)
    },
    dateTimeFilter (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    dateFilter (value) {
      return moment(value).format('YYYY-MM-DD')
    }
  }
}
