<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/70" @click="close"></div>

        <div
          class="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-700 overflow-hidden transition-colors duration-300"
        >
          <div
            class="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between"
          >
            <h2 class="text-lg font-semibold text-black dark:text-white transition-colors">
              Configuracoes
            </h2>
            <button
              @click="close"
              class="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-6">
            <div>
              <h3
                class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors"
              >
                Aparência
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="setTheme('light')"
                  :class="[
                    'p-3 rounded-xl border-2 transition-all',
                    themeMode === 'light'
                      ? 'border-black dark:border-white bg-gray-50 dark:bg-zinc-800'
                      : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600',
                  ]"
                >
                  <svg
                    class="w-6 h-6 mx-auto mb-2 text-yellow-500"
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
                  <span class="text-xs text-gray-700 dark:text-gray-300">Claro</span>
                </button>
                <button
                  @click="setTheme('dark')"
                  :class="[
                    'p-3 rounded-xl border-2 transition-all',
                    themeMode === 'dark'
                      ? 'border-black dark:border-white bg-gray-50 dark:bg-zinc-800'
                      : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600',
                  ]"
                >
                  <svg
                    class="w-6 h-6 mx-auto mb-2 text-indigo-400"
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
                  <span class="text-xs text-gray-700 dark:text-gray-300">Escuro</span>
                </button>
              </div>
            </div>

            <div>
              <h3
                class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors"
              >
                Dados
              </h3>
              <div class="space-y-2">
                <button
                  @click="exportData"
                  class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div class="text-left">
                    <p class="text-sm text-gray-900 dark:text-gray-100">Exportar dados</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Baixar historico em JSON</p>
                  </div>
                </button>

                <button
                  @click="clearCache"
                  class="w-full flex items-center gap-3 p-3 rounded-xl border border-red-300 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-red-500 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <div class="text-left">
                    <p class="text-sm text-red-500 dark:text-red-400">Limpar cache</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div
            class="px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 transition-colors"
          >
            <p class="text-xs text-center text-gray-500 dark:text-gray-400 transition-colors">
              LicitAI v1.0.0 ·
              <a href="#" class="underline hover:text-black dark:hover:text-white">Termos de uso</a>
              · <a href="#" class="underline hover:text-black dark:hover:text-white">Privacidade</a>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const theme = useThemeStore()

const themeMode = ref(localStorage.getItem('theme') || 'light')

function close() {
  emit('update:modelValue', false)
}

function setTheme(mode) {
  themeMode.value = mode
  theme.isDark = mode === 'dark'
  theme.applyTheme()
  localStorage.setItem('theme', mode)
}

function exportData() {
  const data = {
    conversas: [],
    configuracoes: {
      tema: themeMode.value,
    },
    exportado: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `licitai-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function clearCache() {
  if (confirm('Tem certeza? Isso removera todos os dados locais.')) {
    localStorage.clear()
    window.location.reload()
  }
}
</script>
