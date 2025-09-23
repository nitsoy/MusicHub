<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
const router = useRouter()

function logout() {
  auth.logout()
  router.push({ path: '/login', query: { message: 'logged-out' } })
}
</script>

<template>
  <main class="min-h-dvh bg-slate-50">
    <header class="border-b bg-white">
      <nav class="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        <RouterLink to="/" class="font-semibold">MusicHub</RouterLink>
        <span class="text-slate-400">|</span>
        <template v-if="!isAuthenticated">
          <RouterLink to="/login" class="text-sm text-slate-600">Login</RouterLink>
          <RouterLink to="/register" class="text-sm text-slate-600">Register</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/playlists/new" class="text-sm text-slate-600">Nueva Playlist</RouterLink>
          <button class="text-sm text-slate-600" @click="logout">Logout</button>
        </template>
      </nav>
    </header>

    <section class="max-w-5xl mx-auto p-4">
      <RouterView />
    </section>
  </main>
</template>
