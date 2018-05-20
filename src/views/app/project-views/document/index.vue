<template src="./template.html"></template>
<script>
import TextFiltersMixin from '@/mixins/filters/text'
import { STATE, GETTERS, MUTATIONS, ACTIONS } from './config'
import CommentsSection from './comments'
import Bookmark from './bookmark'

export default {
  name: 'kms-app-project-document-page',
  props: {
    'documentslug': String
  },
  mixins: [TextFiltersMixin],
  components: {
    'kms-coomments': CommentsSection,
    'kms-bookmark': Bookmark
  },
  data: () => ({}),
  computed: {
    ...STATE,
    ...GETTERS
  },

  watch: {
    documentslug () {
      this.fetch()
    }
  },

  methods: {
    ...MUTATIONS,
    ...ACTIONS,

    async fetch () {
      await this.fetchAction(this.documentslug)
      await this.markSeenAction()
    }
  },

  created () {
    this.fetch()
  }
}
</script>
