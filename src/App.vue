<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import Vue from 'vue'

import Navigation from '@/components/template/navigation'
import Toolbar from '@/components/template/toolbar'
import Notifications from '@/components/template/notifications'

Vue.component(Navigation.name, Navigation)
Vue.component(Toolbar.name, Toolbar)
Vue.component(Notifications.name, Notifications)

export default {
  name: 'kms-app'
}
</script>
