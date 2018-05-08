<template>
  <v-btn color="info" :flat="isFollowing" :loading="isFollowingLoading" :disabled="isFollowingLoading" @click="toggleFollowing">{{ isFollowing ? 'Unfollow' : 'Follow' }}</v-btn>
</template>
<script>
import Api from '@/api'
import FollowingModel from '@/models/following'

export default {
  name: 'kms-project-follow-btn',
  props: {
    'projectId': [Number, String]
  },

  data: () => ({
    isFollowingLoading: false,
    followingLoaded: false,
    following: null
  }),

  computed: {
    isFollowing () {
      return this.following !== null
    }
  },

  watch: {
    projectId () {
      this.getFollowing()
    }
  },

  methods: {
    getFollowing () {
      this.isFollowingLoading = true
      Api.following.getByProject({ id: this.projectId }).then((response) => {
        this.isFollowingLoading = false
        this.followingLoaded = true
        this.following = (new FollowingModel(response.data)).toJSON()
      }).catch(info => {
        this.isFollowingLoading = false
        this.followingLoaded = true
        this.following = null
      })
    },
    deleteFollowing () {
      this.isFollowingLoading = true
      Api.following.remove({ id: this.following.following_id }).then(() => {
        this.isFollowingLoading = false
        this.following = null
      }).catch(info => {
        this.isFollowingLoading = false
        this.$notify.error('Error removing following mark')
      })
    },
    createFollowing () {
      this.isFollowingLoading = true
      Api.following.create({ project_id: this.projectId }).then((response) => {
        this.isFollowingLoading = false
        this.following = (new FollowingModel(response.data)).toJSON()
      }).catch(info => {
        this.isFollowingLoading = false
        this.$notify.error('Error removing following mark')
      })
    },
    toggleFollowing () {
      if (this.following === null) {
        this.createFollowing()
      } else {
        this.deleteFollowing()
      }
    }
  },

  created () {
    this.getFollowing()
  }
}
</script>
