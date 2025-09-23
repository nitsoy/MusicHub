import axios from 'axios'

export const http = axios.create({
  baseURL: 'http://localhost:3001',
})

http.interceptors.request.use(async (cfg) => {
  const { useAuthStore } = await import('@/modules/auth/stores/auth.store')
  const token = useAuthStore().accessToken
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`
  }

  return cfg
})
