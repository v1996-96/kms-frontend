import Vue from 'vue'
import Router from 'vue-router'

import AccountLayout from '@/views/account.layout'
import SigninView from '@/views/account/signin'

import AppLayout from '@/views/app.layout'
import DashboardView from '@/views/app/dashboard'
import MyWorkView from '@/views/app/my-work'
import SettingsView from '@/views/app/settings'
import ProjectsView from '@/views/app/projects'

import ProjectEditorView from '@/views/app/project-views/editor'
import ProjectCreateView from '@/views/app/project-views/create'
import ProjectIntroView from '@/views/app/project-views/intro'
import ProjectDocumentView from '@/views/app/project-views/document'

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
        },
        {
          path: 'project/:projectslug',
          name: 'Project-intro',
          component: ProjectIntroView
        },
        {
          path: 'project/:projectslug/:documentslug',
          name: 'Project-document',
          component: ProjectDocumentView
        }
      ]
    }
  ]
}

export default new Router(routes)
