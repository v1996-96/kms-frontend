<template src="./template.html"></template>
<script>
import { mapState } from 'vuex'
import DocumentsTab from './my-documents'
import BookmarksTab from './bookmarks'
import FollowingTab from './following'
import LastSeenTab from './lastseen'

export default {
  name: 'kms-app-my-work-page',
  components: {
    'kms-documents-tab': DocumentsTab,
    'kms-bookmarks-tab': BookmarksTab,
    'kms-following-tab': FollowingTab,
    'kms-last-seen-tab': LastSeenTab
  },
  data: () => ({
    tabs: null
  }),
  computed: {
    ...mapState({
      'darkTheme': s => s.App.darkTheme
    })
  }
}
</script>
