import { createRouter, createWebHistory } from 'vue-router'

import { useAuth, waitForAuthInitialization } from '../lib/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
      meta: {
        public: true,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
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
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        public: true,
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

  if (to.name === 'landing' && isAuthenticated.value) {
    return { name: 'dashboard' }
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'auth',
      query: {
        mode: 'sign-in',
        redirect: to.fullPath,
      },
    }
  }

  return true
})

export default router
