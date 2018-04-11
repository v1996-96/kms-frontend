import Vue from 'vue'
import Router from 'vue-router'

import AuthLayout from '@/views/auth.layout'
import SigninView from '@/views/auth/signin'

import AppLayout from '@/views/app.layout'
import DashboardView from '@/views/app/dashboard'
import MyWorkView from '@/views/app/my-work'
import QuickLinksView from '@/views/app/quick-links'
import SettingsView from '@/views/app/settings'

Vue.use(Router)

const routes = {
  mode: 'history',
  routes: [
    {
      path: '/signin',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'Signin',
          component: SigninView
        }
      ]
    },
    {
      path: '',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: DashboardView
        },
        {
          path: 'my-work',
          name: 'My-work',
          component: MyWorkView
        },
        {
          path: 'quick-links',
          name: 'Quick-links',
          component: QuickLinksView
        },
        {
          path: 'settings',
          name: 'Settings',
          component: SettingsView
        }
      ]
    }
  ]
}

export default new Router(routes)
