import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserStore } from '@/store/user'; // ✅ 라우터 가드에서 사용할 userStore import
import { useWriterStore } from '@/store/writerStore';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../components/pages/Index.vue'),
    },
    {
      path: '/login',
      component: () => import("../components/ui/LoginGrid.vue"),
    },
    {
      path: '/register',
      component: () => import("../components/ui/RegisterGrid.vue"),
    },
    {
      path: '/viewMyPages',
      component: () => import("../components/ui/ViewMyPagesGrid.vue"),
      meta: { requiresAuth: true } // ✅ 이 페이지는 로그인이 필요하다고 명시
    },
    {
      path: '/writers/apply',
      component: () => import("@/components/ui/AuthorApplicationPage.vue"),
      meta: { requiresAuth: true } // ✅ 이 페이지는 로그인이 필요하다고 명시
    },
    {
      path: '/book_mangement',
      component: () => import("../components/ui/BookManagement.vue"),
      meta: { requiresAuth: true } // ✅ 이 페이지는 로그인이 필요하다고 명시
    },
    {
      path: '/admin/writer_management',
      component: () => import("../components/ui/admin/writer-management.vue"),
      // ✅ [관리자 전용 가드] 이 페이지는 관리자만 접근 가능
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        if (userStore.isLoggedIn && userStore.currentUser?.isAdmin) {
          next(); // 관리자면 통과
        } else {
          alert("접근 권한이 없습니다.");
          next('/'); // 관리자가 아니면 메인 페이지로 리디렉션
        }
      }
    },
    {
      path: '/create-super-user-account',
      component: () => import("../components/ui/AdminSignUpPageGrid.vue"),
    },
    {
      path: '/billing',
      component: () => import("../components/ui/BillingPage.vue")
    }
  ],
});


/**
 * ✅ [전역 가드] 모든 페이지 이동이 일어나기 전에 실행됩니다.
 */
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  // 이동하려는 페이지가 로그인을 필요로 하고(meta.requiresAuth), 현재 로그인 상태가 아니라면
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    alert("로그인이 필요한 서비스입니다.");
    next('/login'); // 로그인 페이지로 강제 이동
  } else {
    next(); // 그 외의 경우는 모두 통과
  }
});


export default router;