import { createRouter, createWebHistory } from 'vue-router'

import { useAuth, waitForAuthInitialization } from '../lib/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/AuthCallbackView.vue'),
      meta: {
        public: true,
      },
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/water',
      name: 'water',
      component: () => import('../views/WaterView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/calories',
      name: 'calories',
      component: () => import('../views/CaloriesView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/habits',
      name: 'habits',
      component: () => import('../views/HabitsView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(async (to) => {
  await waitForAuthInitialization()

  const { hasSupabaseCredentials, isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized.value) {
    return true
  }

  if (!hasSupabaseCredentials && to.name !== 'auth') {
    return true
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'auth',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  return true
})

export default router
