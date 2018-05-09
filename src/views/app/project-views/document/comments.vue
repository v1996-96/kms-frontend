<template>
  <v-container>
    <v-layout row wrap>
      <v-flex lg6 offset-lg3>
        <v-layout row wrap class="mb-3">
          <h3 class="subheading pt-1" v-if="!commentsLoading && !commentsNotFound">Comments ({{ commentsCount }})</h3>
          <h3 class="subheading pt-1" v-if="commentsLoaded && commentsNotFound">There are no comments yet</h3>
          <v-spacer></v-spacer>
          <v-btn flat class="ma-0" @click="commentCreating = !commentCreating">Leave comment</v-btn>
        </v-layout>

        <v-card class="mb-3" v-if="commentCreating">
          <v-card-text class="pb-0">
            <v-text-field v-model="commentContent" rows="3" multi-line label="Type comment here"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="commentCreating = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="createComment" :disabled="isCommentCreating || commentContent == ''" :loading="isCommentCreating">Apply</v-btn>
          </v-card-actions>
        </v-card>

        <div v-if="!commentsNotFound">
          <v-card class="mb-3" v-for="comment in commentsResults" :key="comment.comment_id">
            <v-card-title class="pt-0 pb-0 pl-0">
              <v-list two-line dense class="pa-0" v-if="comment.user">
                <v-list-tile>
                  <v-list-tile-avatar :color="comment.user.avatar ? '' : 'grey'">
                    <img v-if="comment.user.avatar" :src="comment.user.avatar" />
                    <span v-else class="white--text headline">{{ comment.user.name | firstLetterFilter }}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ comment.user.name }} {{ comment.user.surname }}</v-list-tile-title>
                    <v-list-tile-sub-title>Commented {{ comment.time_created | timeAgoFilter }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <span v-else>
                Commented {{ comment.time_created | timeAgoFilter }}
              </span>
              <v-spacer></v-spacer>
              <v-btn icon ripple flat>
                <v-icon>favorite_border</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              {{ comment.content }}
            </v-card-text>
          </v-card>
        </div>

        <div class="text-xs-center" v-if="commentsTotalPages > 1">
          <v-pagination :length="commentsTotalPages" :value="commentsPage" @input="commentsSearchHandler" total-visible="7" circle></v-pagination>
        </div>

      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import _ from 'lodash'
import Vue from 'vue'
import Api from '@/api'
import SearchPaginateMixin from '@/mixins/search-paginate'
import TextFiltersMixin from '@/mixins/filters/text'
import DateFiltersMixin from '@/mixins/filters/date'
import CommentListModel from '@/models/comment/list'

export default {
  name: 'kms-document-comments',
  props: {
    'documentId': [Number, String]
  },
  mixins: [
    SearchPaginateMixin({
      namespace: 'comments',
      endpoint: Api.documents.getComments,
      model: CommentListModel,
      onError: info => Vue.notify.error('Error occured while loading document comments: ' + info.toString())
    }),
    TextFiltersMixin,
    DateFiltersMixin
  ],
  data: () => ({
    isCommentCreating: false,
    commentCreating: false,
    commentContent: ''
  }),

  watch: {
    documentId () {
      this.commentsSearchHandler()
    }
  },

  methods: {
    commentsSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.commentsSearch({
        page,
        direction,
        filters: {
          id: this.documentId
        }
      })
    }, 300),

    createComment () {
      this.isCommentCreating = true
      Api.documents.addComment({
        id: this.documentId,
        model: {
          content: this.commentContent
        }
      }).then((response) => {
        this.isCommentCreating = false
        this.commentCreating = false
        this.commentContent = ''
        this.commentsSearchHandler(1)
      }).catch(info => {
        this.isCommentCreating = false
        this.$notify.error('Error creating comment')
      })
    }
  },

  created () {
    this.commentsLimit = 10
    this.commentsSearchHandler()
  }
}
</script>
