<template>
  <header
    class="px-4 py-3 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between bg-white dark:bg-zinc-900 shrink-0 transition-colors duration-300"
  >
    <div class="flex items-center gap-3 min-w-0">
      <slot name="left">
        <div class="min-w-0">
          <h1
            class="font-semibold text-black dark:text-white text-base md:text-lg truncate transition-colors"
          >
            {{ titulo }}
          </h1>
          <p
            v-if="subtitulo"
            class="text-xs text-gray-400 dark:text-gray-500 truncate transition-colors"
          >
            {{ subtitulo }}
          </p>
        </div>
      </slot>
    </div>

    <UserMenu />
  </header>
</template>

<script setup>
import UserMenu from './UserMenu.vue'

defineProps({
  titulo: { type: String, default: 'Licit' },
  subtitulo: { type: String, default: '' },
})
</script>
