<template>
  <v-btn icon ripple :flat="isBoomark" :loading="isBoomarkLoading" :disabled="isBoomarkLoading" @click="toggleBoomark">
    <v-icon>{{ isBoomark ? 'bookmark' : 'bookmark_border' }}</v-icon>
  </v-btn>
</template>
<script>
import Api from '@/api'
import BoomarkModel from '@/models/bookmark'

export default {
  name: 'kms-document-follow-btn',
  props: {
    'documentId': [Number, String]
  },

  data: () => ({
    isBoomarkLoading: false,
    bookmarkLoaded: false,
    bookmark: null
  }),

  computed: {
    isBoomark () {
      return this.bookmark !== null
    }
  },

  watch: {
    documentId () {
      this.getBoomark()
    }
  },

  methods: {
    getBoomark () {
      this.isBoomarkLoading = true
      Api.bookmarks.getByDocument({ id: this.documentId }).then((response) => {
        this.isBoomarkLoading = false
        this.bookmarkLoaded = true
        this.bookmark = (new BoomarkModel(response.data)).toJSON()
      }).catch(info => {
        this.isBoomarkLoading = false
        this.bookmarkLoaded = true
        this.bookmark = null
      })
    },
    deleteBoomark () {
      this.isBoomarkLoading = true
      Api.bookmarks.remove({ id: this.bookmark.bookmark_id }).then(() => {
        this.isBoomarkLoading = false
        this.bookmark = null
      }).catch(info => {
        this.isBoomarkLoading = false
        this.$notify.error('Error removing bookmark mark')
      })
    },
    createBoomark () {
      this.isBoomarkLoading = true
      Api.bookmarks.create({ document_id: this.documentId }).then((response) => {
        this.isBoomarkLoading = false
        this.bookmark = (new BoomarkModel(response.data)).toJSON()
      }).catch(info => {
        this.isBoomarkLoading = false
        this.$notify.error('Error removing bookmark mark')
      })
    },
    toggleBoomark () {
      if (this.bookmark === null) {
        this.createBoomark()
      } else {
        this.deleteBoomark()
      }
    }
  },

  created () {
    this.getBoomark()
  }
}
</script>
