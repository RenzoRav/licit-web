import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { useAuthStore } = await import('@/stores/auth')
      const authStore = useAuthStore()

      if (authStore.user && typeof authStore.user.getIdToken === 'function') {
        try {
          const newToken = await authStore.user.getIdToken(true)
          localStorage.setItem('token', newToken)
          authStore.token = newToken
          error.config.headers.Authorization = `Bearer ${newToken}`
          return api.request(error.config)
        } catch (refreshErr) {
          console.error('Refresh token falhou:', refreshErr)
        }
      }

      localStorage.removeItem('token')
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
