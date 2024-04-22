import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/HomePage.vue'),
        meta: {
          displayName: '首页',
        },
      },
      {
        path: 'tag',
        component: () => import('pages/TagPage.vue'),
        meta: {
          displayName: '标签',
        },
      },
      {
        path: 'category',
        component: () => import('pages/CategoryPage.vue'),
        meta: {
          displayName: '分类',
        },
      },
      {
        path: 'link',
        component: () => import('pages/LinkPage.vue'),
        meta: {
          displayName: '友情链接',
        },
      },
      {
        path: 'post',
        component: () => import('pages/PostPage.vue')
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
