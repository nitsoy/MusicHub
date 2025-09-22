import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'

import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(VueQueryPlugin, { queryClient: new QueryClient() })

app.mount('#app')
