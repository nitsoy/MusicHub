<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
  usePlaylist,
  useAddTrack,
  useRemoveTrack,
  useUpdatePlaylist,
  useDeletePlaylist,
} from '../actions/queries'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { watchEffect } from 'vue'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)

const { data, isLoading, isError, error } = usePlaylist(id)
const addTrack = useAddTrack(id)
const delTrack = useRemoveTrack(id)
const updateP = useUpdatePlaylist(id)
const deleteP = useDeletePlaylist()

const editSchema = yup.object({
  name: yup.string().required('Campo obligatorio'),
  description: yup.string().optional(),
  isPublic: yup.boolean().optional(),
})

const {
  defineField: defineEdit,
  errors: editErrors,
  handleSubmit: handleEditSubmit,
  setValues,
} = useForm({
  validationSchema: editSchema,
})

const [name] = defineEdit('name')
const [description] = defineEdit('description')
const [isPublic] = defineEdit('isPublic' as any)

// Cuando llega la playlist, rellenamos el formulario
watchEffect(() => {
  if (data?.value) {
    setValues({
      name: data.value.name,
      description: data.value.description ?? '',
      isPublic: !!data.value.isPublic,
    })
  }
})

const onEditSubmit = handleEditSubmit(async (v) => {
  await updateP.mutateAsync({
    name: v.name,
    description: v.description,
    isPublic: v.isPublic,
  })
  router.push('/playlists')
})

async function onDelete() {
  await deleteP.mutateAsync(id)
  router.push('/playlists')
}

/** ---------- Form añadir canción (igual que lo tenías) ---------- */
const trackSchema = yup.object({
  title: yup.string().required('Título obligatorio'),
  artist: yup.string().required('Artista obligatorio'),
  duration: yup
    .number()
    .transform((v) => (isNaN(v) ? undefined : v))
    .min(0, 'Debe ser >= 0')
    .optional(),
})
const {
  defineField: defineTrack,
  errors,
  handleSubmit,
  isSubmitting,
  resetForm,
} = useForm({ validationSchema: trackSchema })
const [title] = defineTrack('title')
const [artist] = defineTrack('artist')
const [duration] = defineTrack('duration')

const onAdd = handleSubmit(async (v) => {
  await addTrack.mutateAsync({ title: v.title, artist: v.artist, duration: v.duration })
  resetForm()
})
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Detalle Playlist</h1>
      <div class="flex gap-2">
        <button class="px-3 py-2 rounded border" @click="$router.back()">Volver</button>
        <button
          class="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-50"
          @click="onDelete"
        >
          Eliminar playlist
        </button>
      </div>
    </div>

    <div v-if="isLoading">Cargando…</div>
    <div v-else-if="isError" class="text-red-600">
      Error: {{ (error as any)?.message || 'No se pudo cargar' }}
    </div>

    <div v-else-if="data" class="grid gap-6">
      <!-- Form editar playlist -->
      <section class="p-4 bg-white rounded-xl shadow">
        <h2 class="text-lg font-medium mb-3">Editar playlist</h2>
        <form @submit.prevent="onEditSubmit" class="grid gap-3 md:grid-cols-3">
          <div class="md:col-span-1">
            <label class="block text-sm">Título *</label>
            <input
              v-model="name"
              class="w-full border rounded px-3 py-2"
              :class="editErrors.name ? 'border-red-500' : 'border-slate-300'"
            />
            <p v-if="editErrors.name" class="text-red-600 text-sm mt-1">{{ editErrors.name }}</p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm">Descripción</label>
            <input v-model="description" class="w-full border rounded px-3 py-2" />
          </div>
          <div class="md:col-span-3 flex items-center gap-2">
            <input
              id="isPublic"
              type="checkbox"
              v-model="isPublic"
              class="h-4 w-4 border rounded"
            />
            <label for="isPublic" class="text-sm">Hacer pública</label>
          </div>
          <div class="md:col-span-3">
            <button class="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">
              Guardar cambios
            </button>
          </div>
        </form>
      </section>

      <!-- (lo de añadir/eliminar canciones se mantiene como ya lo tenías) -->
      <section class="p-4 bg-white rounded-xl shadow">
        <h3 class="font-medium mb-3">Añadir canción</h3>
        <form @submit.prevent="onAdd" class="grid gap-3 md:grid-cols-3">
          <div>
            <label class="block text-sm">Título *</label>
            <input
              v-model="title"
              class="w-full border rounded px-3 py-2"
              :class="errors.title ? 'border-red-500' : 'border-slate-300'"
            />
            <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
          </div>
          <div>
            <label class="block text-sm">Artista *</label>
            <input
              v-model="artist"
              class="w-full border rounded px-3 py-2"
              :class="errors.artist ? 'border-red-500' : 'border-slate-300'"
            />
            <p v-if="errors.artist" class="text-red-600 text-sm mt-1">{{ errors.artist }}</p>
          </div>
          <div>
            <label class="block text-sm">Duración (s)</label>
            <input
              v-model.number="duration"
              type="number"
              min="0"
              class="w-full border rounded px-3 py-2"
            />
            <p v-if="errors.duration" class="text-red-600 text-sm mt-1">{{ errors.duration }}</p>
          </div>
          <div class="md:col-span-3 flex gap-2">
            <button
              type="submit"
              class="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              Añadir
            </button>
            <button type="button" class="px-3 py-2 rounded border" @click="resetForm()">
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <!-- Lista canciones -->
      <section class="p-4 bg-white rounded-xl shadow">
        <h3 class="font-medium mb-3">Canciones</h3>
        <div v-if="!data.tracks?.length" class="text-slate-600">Aún no hay canciones.</div>
        <ul v-else class="divide-y">
          <li v-for="t in data.tracks" :key="t.id" class="py-3 flex items-center justify-between">
            <div class="min-w-0">
              <p class="font-medium truncate">{{ t.title }}</p>
              <p class="text-sm text-slate-600 truncate">{{ t.artist }}</p>
              <p v-if="t.duration" class="text-xs text-slate-500">
                {{ Math.floor(t.duration / 60) }}:{{ String(t.duration % 60).padStart(2, '0') }}
              </p>
            </div>
            <button
              class="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50"
              @click="delTrack.mutate(t.id)"
            >
              Eliminar
            </button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
