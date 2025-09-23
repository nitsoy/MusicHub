import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const Login = () => import('../modules/auth/views/LoginView.vue')
const Register = () => import('../modules/auth/views/RegisterView.vue')
const Home = () => import('../modules/playlists/views/PlaylistsView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login, meta: { guestOnly: true } },
    { path: '/register', component: Register, meta: { guestOnly: true } },
    { path: '/', component: Home, meta: { requiresAuth: true } },
    {
      path: '/playlists/new',
      component: () => import('../modules/playlists/views/CreatePlaylistView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/playlists/:id',
      name: 'playlist-detail',
      props: true,
      component: () => import('../modules/playlists/views/PlaylistDetailView.vue'),
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to, from) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { r: to.fullPath, message: 'auth-required' } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { path: '/' }
  }
})

export default router
