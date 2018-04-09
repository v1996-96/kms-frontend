import Vue from 'vue'
import Router from 'vue-router'

import AuthLayout from '@/views/auth.layout'
import AppLayout from '@/views/app.layout'

import SigninView from '@/views/auth/signin'

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
      name: 'App',
      component: AppLayout
    }
  ]
}

export default new Router(routes)
