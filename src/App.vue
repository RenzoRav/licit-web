<template>
  <div
    class="h-screen w-screen bg-gray-100 dark:bg-zinc-900 overflow-hidden transition-colors duration-300"
  >
    <router-view />
  </div>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'
import { onMounted } from 'vue'

const theme = useThemeStore()

onMounted(() => {
  theme.init()
})
</script>
