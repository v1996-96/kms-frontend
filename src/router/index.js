import Vue from 'vue'
import Router from 'vue-router'

import AuthLayout from '@/views/auth.layout'
import SigninView from '@/views/auth/signin'

import AppLayout from '@/views/app.layout'
import DashboardView from '@/views/app/dashboard'
import MyWorkView from '@/views/app/my-work'
import SettingsView from '@/views/app/settings'
import ProjectsView from '@/views/app/projects'

import ProjectEditorView from '@/views/app/project-views/editor'
import ProjectCreateView from '@/views/app/project-views/create'

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
          path: 'settings',
          name: 'Settings',
          component: SettingsView
        },
        {
          path: 'projects',
          name: 'Projects',
          component: ProjectsView
        },
        {
          path: 'editor',
          name: 'Editor',
          component: ProjectEditorView
        },
        {
          path: 'project/create',
          name: 'Project-create',
          component: ProjectCreateView
        }
      ]
    }
  ]
}

export default new Router(routes)
