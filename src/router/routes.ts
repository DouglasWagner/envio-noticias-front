import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/landing/MainLayout.vue'),
    name: 'default',
    children: [
      {
        path: '',
        name: 'landing',
        component: () => import('pages/landing/IndexView.vue')
      },
      {
        path: '/login',
        component: () => import('pages/landing/login/LoginView.vue'),
        name: 'login'
      }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/admin/MainLayout.vue'),
    name: 'admin',
    meta: { admin: true },
    children: [
      {
        path: '',
        name: 'landing-admin',
        meta: { title: 'dashboard' },
        component: () => import('pages/admin/dashboard/IndexView.vue')
      },
      {
        path: 'releases',
        name: 'releases-admin',
        meta: { title: 'releases' },
        component: () => import('pages/admin/releases/IndexView.vue')
      },
      {
        path: 'send-release',
        name: 'send-release-admin',
        meta: { title: 'Disparo de Release' },
        component: () => import('pages/admin/send-release/SendRelease.vue')
      },
      {
        path: 'email',
        name: 'emailList',
        meta: { title: 'Lista de E-mails' },
        component: () => import('pages/admin/email/EmailView.vue')
      },
      {
        path: 'perfil',
        name: 'perfil-usuario',
        meta: { title: 'profile' },
        component: () => import('pages/admin/profile/ProfileView.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
