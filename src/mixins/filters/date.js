import moment from 'moment'

export default {
  filters: {
    timeAgoFilter (date, extended = true) {
      var diff = moment(date).diff(moment())
      return moment.duration(diff).humanize(extended)
    },
    dateTimeFilter (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    dateFilter (value) {
      return moment(value).format('YYYY-MM-DD')
    }
  }
}
