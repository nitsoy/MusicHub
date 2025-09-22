<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useCreatePlaylist } from '../actions/queries'
import { useRouter } from 'vue-router'

const router = useRouter()
const create = useCreatePlaylist()

const schema = yup.object({
  name: yup.string().required('Campo obligatorio'),
  description: yup.string().optional(),
})

const { defineField, errors, handleSubmit, isSubmitting } = useForm({ validationSchema: schema })
const [name] = defineField('name')
const [description] = defineField('description')

const onSubmit = handleSubmit(async (v) => {
  await create.mutateAsync(v)
  router.push('/playlists')
})
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
    <h1 class="text-xl font-semibold mb-4">Nueva Playlist</h1>

    <form @submit.prevent="onSubmit" class="space-y-3">
      <div>
        <label class="block text-sm">Título *</label>
        <input
          v-model="name"
          class="w-full border rounded px-3 py-2"
          :class="errors.name ? 'border-red-500' : 'border-slate-300'"
        />
        <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block text-sm">Descripción</label>
        <textarea v-model="description" class="w-full border rounded px-3 py-2"></textarea>
      </div>

      <div class="flex gap-2">
        <button type="button" class="px-3 py-2 rounded border" @click="$router.back()">
          Cancelar
        </button>
        <button
          class="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          :disabled="isSubmitting || !!errors.name"
        >
          Guardar
        </button>
      </div>
    </form>
  </div>
</template>
