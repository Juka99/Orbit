import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesView.vue'),
    },
    {
      path: '/water',
      name: 'water',
      component: () => import('../views/WaterView.vue'),
    },
    {
      path: '/calories',
      name: 'calories',
      component: () => import('../views/CaloriesView.vue'),
    },
  ],
})

export default router
