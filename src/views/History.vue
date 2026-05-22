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
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm font-medium text-black dark:text-white transition-colors"
            >Historico</span
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
            Historico de Conversas
          </h2>
          <p class="text-xs text-gray-400 dark:text-gray-500 transition-colors">
            {{ conversas.length }} conversas registradas
          </p>
        </div>

        <div class="hidden sm:flex items-center gap-2">
          <button
            v-for="f in filtros"
            :key="f.valor"
            @click="filtro = f.valor"
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
              filtro === f.valor
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800',
            ]"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <div
        class="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50 dark:bg-zinc-950 transition-colors duration-300"
      >
        <div v-if="carregando" class="flex items-center justify-center h-64">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"
          ></div>
        </div>

        <div v-else-if="erro" class="flex flex-col items-center justify-center h-64 text-center">
          <div
            class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4"
          >
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h3 class="text-gray-700 dark:text-gray-300 font-medium mb-1">
            Erro ao carregar conversas
          </h3>
          <p class="text-gray-400 dark:text-gray-500 text-sm">{{ erro }}</p>
          <button
            @click="carregarConversas"
            class="mt-3 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Tentar novamente
          </button>
        </div>

        <div v-else class="mb-4">
          <div
            class="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-full px-4 py-2 border border-gray-200 dark:border-zinc-700 focus-within:border-black dark:focus-within:border-white focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-all"
          >
            <svg
              class="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              v-model="busca"
              type="text"
              placeholder="Buscar conversa..."
              class="flex-1 bg-transparent text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div
          v-if="conversasFiltradas.length"
          class="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
        >
          <div
            v-for="conversa in conversasFiltradas"
            :key="conversa.id"
            class="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 p-4 hover:shadow-md dark:hover:shadow-zinc-800/50 transition-all cursor-pointer group"
            @click="abrirConversa(conversa.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold transition-colors"
                >
                  {{ conversa.messages?.length || 0 }}
                </div>
                <div>
                  <p
                    class="text-sm font-medium text-black dark:text-white truncate transition-colors"
                  >
                    {{ conversa.title }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 transition-colors">
                    {{ conversa.contexts?.name || 'Sem contexto' }}
                  </p>
                </div>
              </div>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 transition-colors">
              {{ conversa.ultimaMensagem || 'Nenhuma mensagem' }}
            </p>

            <div
              class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800 transition-colors"
            >
              <div
                class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ formatarData(conversa.updated_at) }}
              </div>
              <div class="flex items-center gap-1">
                <button
                  @click.stop="excluirConversa(conversa.id)"
                  class="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
                <button
                  @click.stop="continuarConversa(conversa.id)"
                  class="p-1.5 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="!carregando && !erro"
          class="flex flex-col items-center justify-center h-64 text-center"
        >
          <div
            class="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4 transition-colors"
          >
            <svg
              class="w-8 h-8 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <h3 class="text-gray-700 dark:text-gray-300 font-medium mb-1 transition-colors">
            Nenhuma conversa encontrada
          </h3>
          <p class="text-gray-400 dark:text-gray-500 text-sm transition-colors">
            {{ busca ? 'Tente ajustar a busca' : 'Inicie uma nova conversa no chat' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const sidebarOpen = ref(false)
const busca = ref('')
const filtro = ref('todos')
const conversas = ref([])
const carregando = ref(false)
const erro = ref(null)

const filtros = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'hoje', label: 'Hoje' },
  { valor: 'semana', label: 'Semana' },
]

async function carregarConversas() {
  carregando.value = true
  erro.value = null
  try {
    const { data } = await api.get('/conversations')
    conversas.value = data.map((c) => ({
      ...c,
      ultimaMensagem: c.messages?.[c.messages.length - 1]?.content || 'Nenhuma mensagem',
    }))
  } catch (err) {
    erro.value = err.response?.data?.error || 'Erro ao carregar conversas'
    console.error('Erro ao carregar conversas:', err)
  } finally {
    carregando.value = false
  }
}

function formatarData(dataString) {
  if (!dataString) return 'Data desconhecida'
  const data = new Date(dataString)
  const hoje = new Date()
  const ontem = new Date(hoje)
  ontem.setDate(ontem.getDate() - 1)

  if (data.toDateString() === hoje.toDateString()) {
    return `Hoje, ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }
  if (data.toDateString() === ontem.toDateString()) {
    return `Ontem, ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const conversasFiltradas = computed(() => {
  let resultado = conversas.value

  if (filtro.value === 'hoje') {
    resultado = resultado.filter((c) => {
      const data = new Date(c.updated_at)
      const hoje = new Date()
      return data.toDateString() === hoje.toDateString()
    })
  } else if (filtro.value === 'semana') {
    resultado = resultado.filter((c) => {
      const data = new Date(c.updated_at)
      const hoje = new Date()
      const diff = (hoje - data) / (1000 * 60 * 60 * 24)
      return diff <= 7
    })
  }

  if (busca.value.trim()) {
    const termo = busca.value.toLowerCase()
    resultado = resultado.filter(
      (c) =>
        c.title?.toLowerCase().includes(termo) ||
        c.contexts?.name?.toLowerCase().includes(termo) ||
        c.ultimaMensagem?.toLowerCase().includes(termo),
    )
  }

  return resultado
})

function abrirConversa(id) {
  router.push(`/chat?conversa=${id}`)
}

function continuarConversa(id) {
  router.push(`/chat?conversa=${id}&continuar=true`)
}

async function excluirConversa(id) {
  if (!confirm('Deseja excluir esta conversa?')) return
  try {
    await api.delete(`/conversations/${id}`)
    conversas.value = conversas.value.filter((c) => c.id !== id)
  } catch (err) {
    alert(err.response?.data?.error || 'Erro ao excluir conversa')
  }
}

onMounted(() => {
  carregarConversas()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
