<template>
  <div
    class="px-4 py-3 border-b border-gray-200 dark:border-zinc-700 flex items-center gap-3 bg-white dark:bg-zinc-900 shrink-0 transition-colors duration-300"
  >
    <div class="flex-1 min-w-0">
      <h2
        class="font-semibold text-black dark:text-white text-base md:text-lg truncate transition-colors"
      >
        LicitAI
      </h2>
    </div>

    <div class="hidden md:flex items-center gap-1">
      <router-link
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        active-class="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white"
      >
        {{ link.label }}
      </router-link>
    </div>

    <button
      @click="$emit('open-settings')"
      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
      title="Configuracoes"
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
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineEmits(['open-settings'])

const links = [
  { to: '/chat', label: 'Chat' },
  { to: '/historico', label: 'Historico' },
]
</script>
