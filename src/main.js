import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import './assets/style.css'

const app = createApp(App)
app.use(createPinia())

let mounted = false
onAuthStateChanged(auth, () => {
  if (!mounted) {
    const authStore = useAuthStore()
    authStore.init()

    app.use(router)
    app.mount('#app')
    mounted = true
  }
})
