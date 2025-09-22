// src/api/musicApi.ts
import axios from 'axios'

export const http = axios.create({
  baseURL: 'http://localhost:3001',
})

http.interceptors.request.use(async (cfg) => {
  try {
    const { useAuthStore } = await import('@/modules/auth/stores/auth.store')
    const token = useAuthStore().accessToken
    if (token) cfg.headers.Authorization = `Bearer ${token}`
  } catch {}
  return cfg
})

// Si en el futuro añadimos Pinia de auth, aquí pondremos el interceptor:
// http.interceptors.request.use(cfg => {
//   const token = useAuthStore().accessToken
//   if (token) cfg.headers.Authorization = `Bearer ${token}`
//   return cfg
// })
