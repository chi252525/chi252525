import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '登入頁',
        name: 'login',
        component: () => import('pages/Login/Login.vue'),
      },
    ],
  },
  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'about',
        component: () => import('pages/Login/Login.vue'),
      },
    ],
  },
  {
    path: '/music',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'music',
        component: () => import('pages/Login/Login.vue'),
      },
    ],
  },
  {
    path: '/sea-and-tree',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'seaAndTree',
        component: () => import('pages/SeaAndTree/SeaAndTree.vue'),
      },
    ],
  },
  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'About',
        component: () => import('pages/About/About.vue'), // Adjust the path to the correct component
      },
    ],
  },
  {
    path: '/contact',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'contact',
        component: () => import('pages/Example/Contact.vue'), // Adjust the path to the correct component
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error/ErrorNotFound.vue'),
  },
];

export default routes;
