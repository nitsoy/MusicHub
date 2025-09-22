<script setup lang="ts">
import { usePlaylists, useDeletePlaylist } from '../actions/queries'
import { useRouter } from 'vue-router'

const router = useRouter()
const { data, isLoading, isError, error } = usePlaylists()
const del = useDeletePlaylist()

function goCreate() {
  router.push('/playlists/new')
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Mis Playlists</h1>
      <button class="px-3 py-2 rounded bg-emerald-600 text-white" @click="goCreate">
        Nueva Playlist
      </button>
    </div>

    <div v-if="isLoading">Cargando…</div>
    <div v-else-if="isError" class="text-red-600">
      Error: {{ error?.message || 'No se pudo cargar' }}
    </div>

    <div v-else class="grid gap-3">
      <div
        v-for="p in data"
        :key="p.id"
        class="p-4 bg-white rounded-xl shadow flex items-center justify-between"
      >
        <div>
          <h3 class="font-medium">{{ p.name }}</h3>
          <p class="text-sm text-slate-600">{{ p.description || 'Sin descripción' }}</p>
          <p class="text-xs text-slate-500 mt-1">{{ p.tracks?.length || 0 }} canciones</p>
        </div>
        <div class="flex gap-2">
          <RouterLink :to="`/playlists/${p.id}`" class="px-3 py-1 border rounded">Ver</RouterLink>
          <button class="px-3 py-1 rounded bg-red-600 text-white" @click="del.mutate(p.id)">
            Eliminar
          </button>
        </div>
      </div>
      <p v-if="!data?.length" class="text-slate-600">Aún no tienes playlists.</p>
    </div>
  </div>
</template>
