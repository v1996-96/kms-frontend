import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export const DEFAULT_ACTIVITY_LIMIT = 10

export const STATE = mapState({
  'darkTheme': s => s.App.darkTheme,

  'activityLoading': s => s.Activity.List.loading,
  'activityLoaded': s => s.Activity.List.loaded,
  'activityCount': s => s.Activity.List.count,
  'activity': s => s.Activity.List.results
})

export const GETTERS = mapGetters({
  'activityDisplayingCount': 'Activity/List/displayingCount',
  'activityNotFound': 'Activity/List/notFound'
})

export const MUTATIONS = mapMutations({
  'activityReset': 'Activity/List/reset',
  'activitySetLimit': 'Activity/List/setLimit'
})

export const ACTIONS = mapActions({
  'activityLoad': 'Activity/List/search',
  'activityLoadMore': 'Activity/List/loadMore'
})
