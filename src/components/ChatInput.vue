<template>
  <div class="px-4 py-3 border-t border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-700">
    <div class="flex gap-2 mb-3 overflow-x-auto pb-1">
      <button
        v-for="sugestao in sugestoes"
        :key="sugestao"
        @click="send(sugestao)"
        class="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors border border-gray-200 dark:border-zinc-700 whitespace-nowrap"
      >
        {{ sugestao }}
      </button>
    </div>

    <div
      class="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 rounded-full px-4 py-2 border border-gray-200 dark:border-zinc-700 focus-within:border-black dark:focus-within:border-white focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-all"
    >
      <input
        v-model="message"
        @keyup.enter="send()"
        type="text"
        placeholder="Pergunte sobre o edital..."
        :disabled="chat.isTyping || chat.isUploading"
        class="flex-1 bg-transparent text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none disabled:opacity-50"
      />
      <button
        @click="send()"
        :disabled="!message.trim() || chat.isTyping || chat.isUploading"
        class="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        <svg v-if="chat.isTyping" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
</template>

<script setup>
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()
const message = ref('')

const sugestoes = [
  'Qual o valor estimado?',
  'Quem é o órgão contratante?',
  'Quais os requisitos?',
  'Prazo de entrega?',
  'Forma de pagamento?',
]

async function send(text = null) {
  const msg = text || message.value
  if (!msg.trim()) return
  await chat.send(msg)
  message.value = ''
}
</script>
