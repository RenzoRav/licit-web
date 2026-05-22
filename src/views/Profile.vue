<template>
  <div
    class="h-full w-full bg-white dark:bg-zinc-900 relative overflow-hidden transition-colors duration-300"
  >
    <div
      :class="[
        'w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-700 flex flex-col absolute md:relative z-20 h-full transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div
        class="p-4 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between"
      >
        <div>
          <h2 class="font-semibold text-black dark:text-white text-sm transition-colors">Menu</h2>
        </div>
        <button
          @click="sidebarOpen = false"
          class="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <router-link
          to="/chat"
          class="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg
            class="w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span class="text-sm text-black dark:text-white transition-colors">Chat</span>
        </router-link>

        <router-link
          to="/historico"
          class="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg
            class="w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm text-black dark:text-white transition-colors">Historico</span>
        </router-link>

        <router-link
          to="/profile"
          class="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800 border-l-4 border-l-black dark:border-l-white transition-colors"
        >
          <svg
            class="w-5 h-5 text-black dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span class="text-sm font-medium text-black dark:text-white transition-colors"
            >Perfil</span
          >
        </router-link>
      </div>
    </div>

    <div
      v-if="sidebarOpen"
      class="absolute inset-0 bg-black/50 z-10 md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <div class="flex-1 flex flex-col min-w-0 h-full">
      <div
        class="px-4 py-3 border-b border-gray-200 dark:border-zinc-700 flex items-center gap-3 bg-white dark:bg-zinc-900 shrink-0 transition-colors duration-300"
      >
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="md:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <img
          src="@/assets/img/logo.png"
          alt="LicitAI"
          class="w-10 h-10 object-contain dark:invert"
        />

        <div class="flex-1 min-w-0">
          <h2
            class="font-semibold text-black dark:text-white text-base md:text-lg truncate transition-colors"
          >
            Meu Perfil
          </h2>
        </div>
      </div>

      <div
        class="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-zinc-950 transition-colors duration-300"
      >
        <div class="max-w-2xl mx-auto">
          <div v-if="carregando" class="flex items-center justify-center h-64">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"
            ></div>
          </div>

          <div
            v-else
            class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6 md:p-8 transition-colors"
          >
            <div class="flex flex-col items-center mb-8">
              <div
                class="w-24 h-24 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-3xl font-bold mb-4 transition-colors"
              >
                {{ iniciais }}
              </div>
              <h3 class="text-xl font-semibold text-black dark:text-white transition-colors">
                {{ authStore.user?.displayName || 'Usuario' }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                {{ authStore.user?.email }}
              </p>
            </div>

            <div class="grid grid-cols-3 gap-4 mb-8">
              <div class="text-center p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl transition-colors">
                <div class="text-2xl font-bold text-black dark:text-white">
                  {{ estatisticas.totalConversas }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Conversas</div>
              </div>
              <div class="text-center p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl transition-colors">
                <div class="text-2xl font-bold text-black dark:text-white">
                  {{ estatisticas.totalMensagens }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Mensagens</div>
              </div>
              <div class="text-center p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl transition-colors">
                <div class="text-2xl font-bold text-black dark:text-white">
                  {{ estatisticas.totalContextos }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Contextos</div>
              </div>
            </div>

            <div class="space-y-4 mb-8">
              <div
                class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800"
              >
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-sm text-gray-600 dark:text-gray-300">Email</span>
                </div>
                <span class="text-sm text-black dark:text-white">{{ authStore.user?.email }}</span>
              </div>

              <div
                class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800"
              >
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                  <span class="text-sm text-gray-600 dark:text-gray-300">ID do Usuario</span>
                </div>
                <span class="text-sm text-gray-400 dark:text-gray-500 font-mono"
                  >{{ authStore.user?.uid?.slice(0, 12) }}...</span
                >
              </div>

              <div
                class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800"
              >
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-sm text-gray-600 dark:text-gray-300">Membro desde</span>
                </div>
                <span class="text-sm text-black dark:text-white">{{ dataCriacao }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <button
                @click="logout"
                class="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)
const carregando = ref(false)
const estatisticas = ref({
  totalConversas: 0,
  totalMensagens: 0,
  totalContextos: 0,
})

const iniciais = computed(() => {
  const nome = authStore.user?.displayName || authStore.user?.email || 'U'
  return nome.charAt(0).toUpperCase()
})

const dataCriacao = computed(() => {
  const metadata = authStore.user?.metadata
  if (metadata?.creationTime) {
    return new Date(metadata.creationTime).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }
  return 'Data desconhecida'
})

async function carregarEstatisticas() {
  carregando.value = true
  try {
    const [convRes, ctxRes] = await Promise.all([api.get('/conversations'), api.get('/contexts')])

    const conversas = convRes.data || []
    estatisticas.value.totalConversas = conversas.length
    estatisticas.value.totalMensagens = conversas.reduce(
      (acc, c) => acc + (c.messages?.length || 0),
      0,
    )
    estatisticas.value.totalContextos = (ctxRes.data || []).length
  } catch (err) {
    console.error('Erro ao carregar estatisticas:', err)
  } finally {
    carregando.value = false
  }
}

function logout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  carregarEstatisticas()
})
</script>
