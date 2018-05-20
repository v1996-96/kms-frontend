<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import 'uppy/dist/uppy.min.css'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Notifier from '@/utils/notifier'
import Access from '@/utils/access'
import Navigation from '@/components/template/navigation'
import Toolbar from '@/components/template/toolbar'
import Notifications from '@/components/template/notifications'
import NotifierComponent from '@/components/template/notifier'
import HeadingComponent from '@/components/ui/heading'

Vue.use(Access)
Vue.use(Notifier)
Vue.use(Vuelidate)

Vue.component(Navigation.name, Navigation)
Vue.component(Toolbar.name, Toolbar)
Vue.component(Notifications.name, Notifications)
Vue.component(NotifierComponent.name, NotifierComponent)
Vue.component(HeadingComponent.name, HeadingComponent)

export default {
  name: 'kms-app'
}
</script>
<style src="quill/dist/quill.core.css"></style>
<style src="quill/dist/quill.snow.css"></style>
