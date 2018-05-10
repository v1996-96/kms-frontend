<template src="./template.html"></template>
<script>
import TextFiltersMixin from '@/mixins/filters/text'
import DateFiltersMixin from '@/mixins/filters/date'
import { mapState as mapGlobalState, createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapActions, mapMutations } = createNamespacedHelpers('Profile')

export default {
  name: 'kms-profile-page',
  props: {
    'userId': [Number, String]
  },
  mixins: [TextFiltersMixin, DateFiltersMixin],
  computed: {
    ...mapState({
      'user': s => s.user,
      'userCache': s => s.userCache,
      'isUserLoading': s => s.isUserLoading
    }),
    ...mapGlobalState({
      'profile': s => s.Account.profile
    }),
    ...mapGetters({
      'userEdited': 'userEdited'
    })
  },

  watch: {
    userId (value) {
      this.loadUser(this.userId || (this.profile && this.profile.user_id))
    }
  },

  methods: {
    ...mapActions({
      'loadUser': 'fetch'
    }),
    ...mapMutations({
      'updateUserCache': 'updateUserCache',
      'discardChanges': 'discardChanges'
    })
  },

  created () {
    this.loadUser(this.userId || (this.profile && this.profile.user_id))
  }
}
</script>
