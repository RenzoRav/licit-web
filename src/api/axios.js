import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      if (authStore.user) {
        authStore.token = await authStore.user.getIdToken(true)
        error.config.headers.Authorization = `Bearer ${authStore.token}`
        return api.request(error.config)
      }
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
