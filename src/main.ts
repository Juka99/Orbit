import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'

import App from './App.vue'
import { initializeAuth } from './lib/auth'
import router from './router'
import './styles/main.scss'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 30,
    },
  },
})

const app = createApp(App)

initializeAuth()

app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
