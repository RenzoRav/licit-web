<template>
  <div
    class="flex h-full w-full bg-white dark:bg-zinc-900 relative overflow-hidden transition-colors duration-300"
    @dragover.prevent="dragOver = true"
    @dragleave.prevent="dragOver = false"
    @drop.prevent="handleDrop"
  >
    <div
      v-if="dragOver"
      class="absolute inset-0 z-30 bg-black/60 dark:bg-black/80 flex items-center justify-center backdrop-blur-sm"
    >
      <div
        class="bg-white dark:bg-zinc-800 rounded-2xl p-8 border-2 border-dashed border-gray-400 dark:border-zinc-500 text-center"
      >
        <svg
          class="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
        <p class="text-lg font-medium text-black dark:text-white">Solte o arquivo aqui</p>
        <p class="text-sm text-gray-500 dark:text-zinc-400 mt-1">PDF, DOCX, TXT ate 10MB</p>
      </div>
    </div>

    <div
      v-if="historicoOpen"
      class="absolute inset-0 bg-black/30 z-20 sm:hidden"
      @click="historicoOpen = false"
    ></div>

    <div class="flex-1 flex flex-col min-w-0 h-full">
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shrink-0 transition-colors duration-300"
      >
        <div class="flex-1 min-w-0">
          <ChatHeader @open-settings="showSettings = true" />
        </div>

        <button
          @click="historicoOpen = !historicoOpen"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ml-3 shrink-0',
            historicoOpen
              ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
              : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800',
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="hidden sm:inline">Histórico</span>
          <span
            v-if="conversas.length"
            class="bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full"
          >
            {{ conversas.length }}
          </span>
        </button>
      </div>

      <div
        class="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50 dark:bg-zinc-950 transition-colors duration-300"
      >
        <div
          v-if="chat.isEmpty && !chat.documentoAtivo"
          class="flex flex-col items-center justify-center h-full text-center p-8"
        >
          <h3 class="text-gray-700 dark:text-gray-300 font-medium text-lg mb-1">
            Nenhuma mensagem ainda
          </h3>
          <p class="text-gray-400 dark:text-gray-500 text-sm mb-4">
            Envie uma mensagem ou carregue um edital
          </p>
        </div>

        <div
          v-if="chat.documentoAtivo && chat.isUploading"
          class="flex items-start gap-3 animate-fade-in"
        >
          <div
            class="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold overflow-hidden"
          >
            <img
              v-if="userAvatar"
              :src="userAvatar"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <span v-else>{{ userInitials }}</span>
          </div>
          <div
            class="max-w-[75%] bg-white dark:bg-zinc-800 rounded-2xl rounded-bl-md border border-gray-200 dark:border-zinc-700 p-4"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-10 h-12 bg-gray-100 dark:bg-zinc-700 rounded flex items-center justify-center shrink-0"
              >
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300">PDF</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-black dark:text-white truncate">
                  {{ chat.documentoAtivo.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(chat.documentoAtivo.size) }}
                </p>
              </div>
            </div>
            <div class="w-full bg-gray-100 dark:bg-zinc-700 rounded-full h-1.5 mb-2">
              <div
                class="bg-black dark:bg-white h-1.5 rounded-full transition-all duration-300"
                :style="{ width: chat.uploadProgress + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ chat.uploadProgress === 100 ? 'Processando documento...' : 'Carregando...' }}
            </p>
          </div>
        </div>

        <div
          v-for="msg in chat.messages"
          :key="msg.id"
          :class="[
            'flex gap-2 md:gap-3 animate-fade-in',
            msg.from === 'user' ? 'flex-row-reverse' : 'flex-row',
          ]"
        >
          <div
            v-if="msg.from === 'user'"
            class="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 text-sm md:text-base font-bold border-2 bg-black dark:bg-white text-white dark:text-black border-black dark:border-white overflow-hidden"
          >
            <img
              v-if="userAvatar"
              :src="userAvatar"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <span v-else>{{ userInitials }}</span>
          </div>
          <div
            v-else
            class="w-9 h-9 md:w-10 md:h-10 rounded-full shrink-0 bg-white dark:bg-zinc-600 flex items-center justify-center border-2 border-gray-300 dark:border-zinc-500 shadow-sm"
          >
            <span class="text-sm md:text-base font-bold text-gray-700 dark:text-gray-200">L</span>
          </div>

          <div
            :class="[
              'max-w-[85%] sm:max-w-[75%] px-3 md:px-4 py-2 md:py-2.5 rounded-2xl text-sm leading-relaxed',
              msg.from === 'user'
                ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-md'
                : 'bg-white dark:bg-zinc-800 text-black dark:text-white rounded-bl-md border border-gray-200 dark:border-zinc-700',
            ]"
          >
            {{ msg.text }}
            <div
              v-if="msg.from === 'bot' && msg.citacao"
              class="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200 dark:border-zinc-700"
            >
              <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                Referencia no documento
              </p>
              <div
                class="bg-gray-50 dark:bg-zinc-900 rounded-lg p-2 border border-gray-100 dark:border-zinc-700"
              >
                <p class="text-xs text-gray-600 dark:text-gray-300 italic">"{{ msg.citacao }}"</p>
                <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  Edital 045/2024, pagina 12
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="chat.isTyping"
          class="flex gap-1 px-4 py-3 bg-white dark:bg-zinc-800 rounded-2xl rounded-bl-md border border-gray-200 dark:border-zinc-700 w-fit"
        >
          <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
          <div
            class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
            style="animation-delay: 150ms"
          ></div>
          <div
            class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
            style="animation-delay: 300ms"
          ></div>
        </div>
      </div>

      <div
        class="px-3 md:px-4 py-2 md:py-3 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shrink-0 transition-colors duration-300"
      >
        <div class="flex gap-2 mb-2 md:mb-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            v-for="sugestao in sugestoes"
            :key="sugestao"
            @click="send(sugestao)"
            class="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors border border-gray-200 dark:border-zinc-700 whitespace-nowrap shrink-0"
          >
            {{ sugestao }}
          </button>
        </div>

        <div
          v-if="selectedFile"
          class="flex items-center gap-2 mb-2 p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700"
        >
          <div
            class="w-8 h-10 bg-gray-200 dark:bg-zinc-700 rounded flex items-center justify-center shrink-0"
          >
            <span class="text-[10px] font-bold text-gray-600 dark:text-gray-300">PDF</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-black dark:text-white truncate">
              {{ selectedFile.name }}
            </p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
          <button
            @click="selectedFile = null"
            class="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          class="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 rounded-full px-3 md:px-4 py-2 border border-gray-200 dark:border-zinc-700 focus-within:border-black dark:focus-within:border-white focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-all"
        >
          <button
            @click="triggerFileInput"
            class="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
            title="Carregar edital"
          >
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>

          <input
            v-model="message"
            @keyup.enter="send()"
            type="text"
            placeholder="Pergunte sobre o edital..."
            :disabled="chat.isTyping || chat.isUploading"
            class="flex-1 bg-transparent text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none disabled:opacity-50 min-w-0"
          />

          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            class="hidden"
            @change="handleFileSelect"
          />

          <button
            @click="send()"
            :disabled="(!message.trim() && !selectedFile) || chat.isTyping || chat.isUploading"
            class="p-1.5 md:p-2 rounded-full bg-black dark:bg-white text-white dark:text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shrink-0"
          >
            <svg
              v-if="chat.isUploading"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      :class="[
        'absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-700 z-30 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl',
        historicoOpen ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <div
        class="px-4 py-3 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between bg-white dark:bg-zinc-900 shrink-0"
      >
        <div class="flex items-center gap-2">
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
          <h3 class="font-semibold text-black dark:text-white text-sm">Histórico de Conversas</h3>
        </div>
        <button
          @click="historicoOpen = false"
          class="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors"
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

      <div
        class="px-4 py-2 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2 shrink-0"
      >
        <button
          v-for="f in filtros"
          :key="f.valor"
          @click="filtro = f.valor"
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
            filtro === f.valor
              ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
              : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800',
          ]"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="px-4 py-2 shrink-0">
        <div
          class="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 rounded-full px-3 py-2 border border-gray-200 dark:border-zinc-700 focus-within:border-black dark:focus-within:border-white focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-all"
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

      <div class="flex-1 overflow-y-auto px-4 pb-4">
        <div v-if="carregando" class="flex items-center justify-center h-32">
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-black dark:border-white"
          ></div>
        </div>

        <div v-else-if="erro" class="flex flex-col items-center justify-center h-32 text-center">
          <svg
            class="w-8 h-8 text-red-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p class="text-gray-500 dark:text-gray-400 text-xs">{{ erro }}</p>
          <button
            @click="carregarConversas"
            class="mt-2 text-xs text-black dark:text-white underline"
          >
            Tentar novamente
          </button>
        </div>

        <div v-else-if="conversasFiltradas.length" class="space-y-2 mt-2">
          <div
            v-for="conversa in conversasFiltradas"
            :key="conversa.id"
            class="bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-3 hover:shadow-md dark:hover:shadow-zinc-800/50 transition-all cursor-pointer group relative"
            @click="abrirConversa(conversa.id)"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2 min-w-0">
                <div
                  class="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold shrink-0"
                >
                  {{ conversa.messages?.length || 0 }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-black dark:text-white truncate">
                    {{ conversa.title }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    {{ conversa.contexts?.name || 'Sem contexto' }}
                  </p>
                </div>
              </div>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
              {{ conversa.ultimaMensagem || 'Nenhuma mensagem' }}
            </p>

            <div
              class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-zinc-700"
            >
              <div class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  class="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Excluir"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244-2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
                <button
                  @click.stop="continuarConversa(conversa.id)"
                  class="p-1 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 rounded transition-colors"
                  title="Continuar"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div v-else class="flex flex-col items-center justify-center h-32 text-center mt-4">
          <svg
            class="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2"
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
          <p class="text-gray-500 dark:text-gray-400 text-xs">
            {{ busca ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda' }}
          </p>
        </div>
      </div>
    </div>

    <SettingsModal v-model="showSettings" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import ChatHeader from '@/components/ChatHeader.vue'
import SettingsModal from '@/components/SettingsModal.vue'

const router = useRouter()
const chat = useChatStore()
const authStore = useAuthStore()

const userAvatar = computed(() => authStore.user?.photoURL || null)
const userInitials = computed(() => {
  const name = authStore.user?.displayName || authStore.user?.email || 'EU'
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const message = ref('')
const showSettings = ref(false)
const dragOver = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

const historicoOpen = ref(false)
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

const sugestoes = [
  'Qual o valor estimado?',
  'Quem e o orgao contratante?',
  'Quais os requisitos?',
  'Prazo de entrega?',
  'Forma de pagamento?',
]

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const file = event.target.files?.[0]
  if (file) selectedFile.value = file
  event.target.value = ''
}

function handleDrop(event) {
  dragOver.value = false
  const file = event.dataTransfer.files?.[0]
  if (
    file &&
    (file.type === 'application/pdf' ||
      file.type === 'text/plain' ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.txt'))
  ) {
    selectedFile.value = file
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function send(text = null) {
  const msg = text || message.value

  if (selectedFile.value) {
    await chat.uploadDocument(selectedFile.value)
    selectedFile.value = null
    if (!msg.trim()) return
  }

  if (!msg.trim()) return

  if (!chat.conversationId) {
    chat.messages.push({
      id: Date.now(),
      from: 'bot',
      text: 'Carregue um edital antes de fazer perguntas.',
      is_error: true,
    })
    return
  }

  if (msg.length > 500) return

  await chat.send(msg)
  message.value = ''
}

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
  historicoOpen.value = false
  router.push(`/chat?conversa=${id}`)
}

function continuarConversa(id) {
  historicoOpen.value = false
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
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
