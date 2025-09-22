<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().email('Email no válido').required('Campo obligatorio'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Campo obligatorio'),
})

const { defineField, errors, handleSubmit, isSubmitting } = useForm({ validationSchema: schema })
const [email] = defineField('email')
const [password] = defineField('password')

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const onSubmit = handleSubmit(async (v) => {
  await auth.login(v.email, v.password)
  const redirect = typeof route.query.r === 'string' ? route.query.r : '/'
  router.push(redirect)
})

const messages: Record<string, string> = {
  'auth-required': 'Inicia sesión para continuar.',
  'logged-out': 'Has salido de la cuenta.',
  'session-expired': 'Tu sesión expiró. Vuelve a iniciar sesión.',
}
</script>

<template>
  <div class="max-w-sm mx-auto p-6 bg-white rounded-xl shadow space-y-4">
    <h1 class="text-xl font-semibold">Iniciar sesión</h1>

    <p :if="route.query.message && messages[route.query.message as string]">
      {{ messages[route.query.message as string] }}
    </p>

    <form @submit.prevent="onSubmit" class="space-y-3">
      <div>
        <label class="block text-sm">Email</label>
        <input
          v-model="email"
          type="email"
          class="w-full border rounded px-3 py-2"
          :class="errors.email ? 'border-red-500' : 'border-slate-300'"
        />
        <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <div>
        <label class="block text-sm">Password</label>
        <input
          v-model="password"
          type="password"
          class="w-full border rounded px-3 py-2"
          :class="errors.password ? 'border-red-500' : 'border-slate-300'"
        />
        <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <button
        class="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50"
        :disabled="isSubmitting || !!errors.email || !!errors.password"
      >
        Entrar
      </button>
    </form>
  </div>
</template>
