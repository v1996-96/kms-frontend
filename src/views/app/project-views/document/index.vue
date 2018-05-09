<template src="./template.html"></template>
<script>
import TextFiltersMixin from '@/mixins/filters/text'
import { STATE, GETTERS, MUTATIONS, ACTIONS } from './config'
import CommentsSection from './comments'

export default {
  name: 'kms-app-project-document-page',
  props: {
    'documentslug': String
  },
  mixins: [TextFiltersMixin],
  components: {
    'kms-coomments': CommentsSection
  },
  data: () => ({}),
  computed: {
    ...STATE,
    ...GETTERS
  },

  watch: {
    documentslug () {
      this.fetchAction(this.documentslug)
    }
  },

  methods: {
    ...MUTATIONS,
    ...ACTIONS
  },

  created () {
    this.fetchAction(this.documentslug)
  }
}
</script>
