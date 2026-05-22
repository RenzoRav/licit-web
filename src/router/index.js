import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Landing.vue'),
      meta: { public: true },
    },
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true, guestOnly: true },
    },
    {
      path: '/chat',
      component: () => import('@/views/Chat.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/historico',
      component: () => import('@/views/History.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    next('/chat')
    return
  }

  next()
})

export default router
