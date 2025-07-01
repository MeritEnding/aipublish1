import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../components/pages/Index.vue'),
    },
    {
      path: '/writes',
      component: () => import('../components/ui/WriteGrid.vue'),
    },
    {
      path: '/writes_register',
      component: () => import('../components/ui/WriteRegister.vue'),
    },
    {
      path: '/users',
      component: () => import('../components/ui/UserGrid.vue'),
    },
    {
      path: '/points',
      component: () => import('../components/ui/PointGrid.vue'),
    },
    {
      path: '/books',
      component: () => import('../components/ui/BookGrid.vue'),
    },
    {
      path: '/aiBookProcessors',
      component: () => import('../components/ui/AiBookProcessorGrid.vue'),
    },
    {
      path: '/viewMyPages',
      component: () => import("../components/ui/ViewMyPage.vue"),
    },
    {
      path: '/manuscript_create',
      component: () => import("../components/ui/Manuscript_create.vue"),
    },
    {
      path: '/login',
      component: () => import("../components/ui/Login.vue"),
    },
    {
      path: '/register',
      component: () => import("../components/ui/Register.vue"),
    },


  ],
})

export default router;
