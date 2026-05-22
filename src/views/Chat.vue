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
        <p class="text-sm text-gray-500 dark:text-zinc-400 mt-1">PDF, DOCX ate 10MB</p>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-w-0 h-full">
      <ChatHeader @open-settings="showSettings = true" />

      <div
        class="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50 dark:bg-zinc-950 transition-colors duration-300"
      >
        <div
          v-if="chat.isEmpty && !chat.documentoAtivo"
          class="flex flex-col items-center justify-center h-full text-center p-8"
        >
          <img
            src="@/assets/img/logo.png"
            alt="LicitAI"
            class="w-16 h-16 object-contain mb-4 opacity-30 grayscale dark:invert"
          />
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
            class="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold"
          >
            V
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
            :class="[
              'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] md:text-xs font-bold border-2',
              msg.from === 'user'
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-600',
            ]"
          >
            {{ msg.from === 'user' ? 'V' : 'A' }}
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
            accept=".pdf,.doc,.docx"
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

    <SettingsModal v-model="showSettings" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import ChatHeader from '@/components/ChatHeader.vue'
import SettingsModal from '@/components/SettingsModal.vue'

const chat = useChatStore()
const message = ref('')
const showSettings = ref(false)
const dragOver = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

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
    (file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx'))
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
    return
  }

  if (!msg.trim()) return

  await chat.send(msg)
  message.value = ''
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
