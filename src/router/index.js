import Vue from 'vue'
import Router from 'vue-router'

import AccountLayout from '@/views/account.layout'
import SigninView from '@/views/account/signin'

import AppLayout from '@/views/app.layout'
import DashboardView from '@/views/app/dashboard'
import MyWorkView from '@/views/app/my-work'
import SettingsView from '@/views/app/settings'

import ProjectsSearchView from '@/views/app/project-search'
import ProjectCreateView from '@/views/app/project-create'
import ProjectBaseView from '@/views/app/project-views'
import ProjectEditorView from '@/views/app/project-views/editor'
import ProjectIntroView from '@/views/app/project-views/intro'
import ProjectDocumentView from '@/views/app/project-views/document'
import ProjectSettingsView from '@/views/app/project-views/settings'

Vue.use(Router)

const routes = {
  mode: 'history',
  routes: [
    {
      path: '/account',
      component: AccountLayout,
      children: [
        {
          path: '/signin',
          name: 'Signin',
          component: SigninView,
          meta: { whitelisted: true }
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
          component: DashboardView,
          meta: { navigation: 'common' }
        },
        {
          path: 'my-work',
          name: 'My-work',
          component: MyWorkView,
          meta: { navigation: 'common' }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: SettingsView,
          meta: { navigation: 'common' }
        },
        {
          path: 'projects',
          name: 'Projects',
          component: ProjectsSearchView,
          meta: { navigation: 'common' }
        },
        {
          path: 'project/create',
          name: 'Project-create',
          component: ProjectCreateView,
          meta: { navigation: 'common' }
        },

        {
          path: 'project/:projectslug',
          props: true,
          component: ProjectBaseView,
          meta: { navigation: 'project' },
          children: [
            {
              path: '',
              name: 'Project-intro',
              component: ProjectIntroView,
              meta: { navigation: 'project' }
            },
            {
              path: 'settings',
              name: 'Project-settings',
              component: ProjectSettingsView,
              meta: { navigation: 'project' }
            },
            {
              path: ':documentslug',
              name: 'Project-document',
              props: true,
              component: ProjectDocumentView,
              meta: { navigation: 'project' }
            },
            {
              path: 'editor',
              name: 'Editor',
              component: ProjectEditorView,
              meta: { navigation: 'common' }
            }
          ]
        }
      ]
    }
  ]
}

export default new Router(routes)
