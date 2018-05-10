import Vue from 'vue'
import Router from 'vue-router'

import AccountLayout from '@/views/account.layout'
import SigninView from '@/views/account/signin'
import SignupView from '@/views/account/signup'

import AppLayout from '@/views/app.layout'
import DashboardView from '@/views/app/dashboard'
import MyWorkView from '@/views/app/my-work'
import SettingsView from '@/views/app/settings'
import UsersView from '@/views/app/users'
import ProfileView from '@/views/app/profile'

import ProjectsSearchView from '@/views/app/project-search'
import ProjectCreateView from '@/views/app/project-create'
import ProjectBaseView from '@/views/app/project-views'
import ProjectIntroView from '@/views/app/project-views/intro'
import ProjectSettingsView from '@/views/app/project-views/settings'

import DocumentEditor from '@/views/app/project-views/editor'
import DocumentView from '@/views/app/project-views/document'

import TemplateEditor from '@/views/app/template-editor'

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
        },
        {
          path: '/signup/:invitetoken',
          name: 'Signup',
          props: true,
          component: SignupView,
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
          path: 'users',
          name: 'Users',
          component: UsersView,
          meta: { navigation: 'common' }
        },
        {
          path: 'profile',
          name: 'My-profile',
          component: ProfileView,
          meta: { navigation: 'common' }
        },
        {
          path: 'profile/:userId',
          props: true,
          name: 'Profile',
          component: ProfileView,
          meta: { navigation: 'common' }
        },
        {
          path: 'template/new',
          name: 'Template-create',
          component: TemplateEditor,
          meta: { navigation: 'common', navigationHidden: true, editorMode: 'create' }
        },
        {
          path: 'template/:templateslug',
          props: true,
          name: 'Template-edit',
          component: TemplateEditor,
          meta: { navigation: 'common', navigationHidden: true, editorMode: 'edit' }
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
              path: 'new-document',
              name: 'Document-create',
              component: DocumentEditor,
              meta: { navigation: 'project', navigationHidden: true, editorMode: 'create' }
            },
            {
              path: ':documentslug',
              name: 'Document',
              props: true,
              component: DocumentView,
              meta: { navigation: 'project' }
            },
            {
              path: ':documentslug/edit',
              name: 'Document-edit',
              props: true,
              component: DocumentEditor,
              meta: { navigation: 'project', navigationHidden: true, editorMode: 'edit' }
            }
          ]
        }
      ]
    }
  ]
}

export default new Router(routes)
