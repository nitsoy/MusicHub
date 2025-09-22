import { defineStore } from 'pinia'
import { http } from '@/api/musicApi'

type User = { id: string; name: string; email: string; avatarUrl?: string }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('mh_token') || '',
    user: (localStorage.getItem('mh_user') &&
      JSON.parse(localStorage.getItem('mh_user')!)) as User | null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
  },
  actions: {
    async login(email: string, password: string) {
      const { data } = await http.post('/auth/login', { email, password })
      this.accessToken = data.accessToken
      this.user = data.user
      localStorage.setItem('mh_token', this.accessToken)
      localStorage.setItem('mh_user', JSON.stringify(this.user))
    },
    async register(payload: { name: string; email: string; password: string }) {
      const { data } = await http.post('/auth/register', payload)
      this.accessToken = data.accessToken
      this.user = data.user
      localStorage.setItem('mh_token', this.accessToken)
      localStorage.setItem('mh_user', JSON.stringify(this.user))
    },
    logout() {
      this.accessToken = ''
      this.user = null
      localStorage.removeItem('mh_token')
      localStorage.removeItem('mh_user')
    },
  },
})
