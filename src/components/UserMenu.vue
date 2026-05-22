<template>
  <div class="relative">
    <button
      @click="aberto = !aberto"
      class="w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm flex items-center justify-center hover:opacity-80 transition-opacity"
    >
      {{ iniciais }}
    </button>

    <div
      v-if="aberto"
      class="absolute right-0 top-12 w-72 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-xl z-50 overflow-hidden"
    >
      <div class="p-4 border-b border-gray-100 dark:border-zinc-800">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-lg flex items-center justify-center"
          >
            {{ iniciais }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-black dark:text-white text-sm truncate">
              {{ authStore.user?.displayName || 'Usuario' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ authStore.user?.email }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-zinc-800">
        <div class="text-center">
          <div class="text-lg font-bold text-black dark:text-white">{{ stats.conversas }}</div>
          <div class="text-[10px] text-gray-500">Conversas</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-bold text-black dark:text-white">{{ stats.mensagens }}</div>
          <div class="text-[10px] text-gray-500">Mensagens</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-bold text-black dark:text-white">{{ stats.contextos }}</div>
          <div class="text-[10px] text-gray-500">Contextos</div>
        </div>
      </div>

      <div class="p-2">
        <router-link
          to="/historico"
          @click="aberto = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm text-black dark:text-white">Historico</span>
        </router-link>

        <button
          @click="toggleTema"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg
            v-if="isDark"
            class="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <span class="text-sm text-black dark:text-white">{{
            isDark ? 'Modo claro' : 'Modo escuro'
          }}</span>
        </button>

        <div class="border-t border-gray-100 dark:border-zinc-800 my-1"></div>

        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
        >
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span class="text-sm text-red-600 dark:text-red-400">Sair da conta</span>
        </button>
      </div>
    </div>

    <div v-if="aberto" class="fixed inset-0 z-40" @click="aberto = false"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const router = useRouter()
const authStore = useAuthStore()
const aberto = ref(false)
const isDark = ref(document.documentElement.classList.contains('dark'))

const stats = ref({
  conversas: 0,
  mensagens: 0,
  contextos: 0,
})

const iniciais = computed(() => {
  const nome = authStore.user?.displayName || authStore.user?.email || 'U'
  return nome.charAt(0).toUpperCase()
})

function toggleTema() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

async function carregarStats() {
  try {
    const [convRes, ctxRes] = await Promise.all([api.get('/conversations'), api.get('/contexts')])
    const conversas = convRes.data || []
    stats.value.conversas = conversas.length
    stats.value.mensagens = conversas.reduce((acc, c) => acc + (c.messages?.length || 0), 0)
    stats.value.contextos = (ctxRes.data || []).length
  } catch (err) {
    console.error('Erro ao carregar stats:', err)
  }
}

function logout() {
  aberto.value = false
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  carregarStats()
})
</script>
