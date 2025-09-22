<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().min(2, 'Mínimo 2 caracteres').required('Campo obligatorio'),
  email: yup.string().email('Email no válido').required('Campo obligatorio'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Campo obligatorio'),
  confirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Campo obligatorio'),
})

const { defineField, errors, handleSubmit, isSubmitting } = useForm({ validationSchema: schema })
const [name] = defineField('name')
const [email] = defineField('email')
const [password] = defineField('password')
const [confirm] = defineField('confirm')

const router = useRouter()
const auth = useAuthStore()

const onSubmit = handleSubmit(async (v) => {
  await auth.register({ name: v.name, email: v.email, password: v.password })
  router.push('/')
})
</script>

<template>
  <div class="max-w-sm mx-auto p-6 bg-white rounded-xl shadow space-y-4">
    <h1 class="text-xl font-semibold">Crear cuenta</h1>

    <form @submit.prevent="onSubmit" class="space-y-3">
      <div>
        <label class="block text-sm">Nombre</label>
        <input
          v-model="name"
          class="w-full border rounded px-3 py-2"
          :class="errors.name ? 'border-red-500' : 'border-slate-300'"
        />
        <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
      </div>

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

      <div>
        <label class="block text-sm">Confirmar Password</label>
        <input
          v-model="confirm"
          type="password"
          class="w-full border rounded px-3 py-2"
          :class="errors.confirm ? 'border-red-500' : 'border-slate-300'"
        />
        <p v-if="errors.confirm" class="text-red-600 text-sm mt-1">{{ errors.confirm }}</p>
      </div>

      <button
        class="w-full bg-emerald-600 text-white rounded py-2 disabled:opacity-50"
        :disabled="
          isSubmitting || !!errors.name || !!errors.email || !!errors.password || !!errors.confirm
        "
      >
        Crear cuenta
      </button>

      <p class="text-sm text-slate-600 text-center">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="text-blue-600 hover:underline">Inicia sesión</RouterLink>
      </p>
    </form>
  </div>
</template>
