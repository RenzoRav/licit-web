<template>
  <div
    class="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center bg-white dark:bg-zinc-900 overflow-y-auto transition-colors duration-300"
  >
    <img
      src="@/assets/img/logo.png"
      alt="Licit"
      class="w-24 h-24 md:w-32 md:h-32 object-contain mb-4 md:mb-6 dark:invert"
    />

    <p class="text-gray-500 dark:text-gray-400 mb-2 text-sm md:text-base transition-colors">
      Assistente inteligente para licitacoes publicas
    </p>
    <p
      class="text-gray-400 dark:text-gray-500 text-xs md:text-sm mb-6 md:mb-8 max-w-md px-4 transition-colors"
    >
      Consulte editais, pregoes, contratos e atas. Pergunte sobre valores, prazos, requisitos e
      mais.
    </p>

    <router-link
      v-if="authStore.isLoggedIn"
      to="/chat"
      class="px-6 md:px-8 py-2.5 md:py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm md:text-base"
    >
      Consultar documentos
    </router-link>

    <router-link
      v-else
      to="/login"
      class="px-6 md:px-8 py-2.5 md:py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm md:text-base"
    >
      Fazer login
    </router-link>

    <p v-if="authStore.isLoggedIn" class="mt-3 text-xs text-gray-400 dark:text-gray-500">
      Logado como {{ authStore.userEmail }}
      <button @click="authStore.logout" class="ml-2 underline hover:text-red-500 transition-colors">
        Sair
      </button>
    </p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
