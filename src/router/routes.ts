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
    path: '/music',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'music',
        component: () => import('pages/Home/LoginHome.vue'),
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
        component: () => import('pages/SeaAndTree/SeaAndTree.vue'), // Adjust the path to the correct component
      },
    ],
  },
  {
    path: '/slice',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Slice',
        component: () => import('pages/Slice/Slice.vue'), // Adjust the path to the correct component
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
