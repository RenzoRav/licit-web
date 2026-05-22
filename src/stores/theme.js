import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  function init() {
    const saved = localStorage.getItem('theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = mediaQuery.matches
    }
    applyTheme()
  }

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  return {
    isDark,
    init,
    toggle,
    applyTheme,
  }
})
