<template>
  <div
    class="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center bg-white dark:bg-zinc-900 overflow-y-auto transition-colors duration-300"
  >
    <img
      src="@/assets/img/logo.png"
      alt="LicitAI"
      class="w-24 h-24 md:w-32 md:h-32 object-contain mb-4 md:mb-6 dark:invert"
    />
    <p class="text-gray-500 dark:text-gray-400 mb-2 text-sm md:text-base transition-colors">
      Assistente inteligente para licitacoes publicas
    </p>
    <button
      @click="handleGoogleLogin"
      :disabled="authStore.loading"
      class="w-full max-w-xs px-6 py-2.5 md:py-3 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-full font-medium border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-sm md:text-base flex items-center justify-center gap-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.85 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {{ authStore.loading && authStore.error === null ? 'Entrando...' : 'Entrar com Google' }}
    </button>

    <div class="flex items-center w-full max-w-xs my-4">
      <div class="flex-1 border-t border-gray-300 dark:border-zinc-600"></div>
      <span class="px-3 text-xs text-gray-400 dark:text-gray-500">ou</span>
      <div class="flex-1 border-t border-gray-300 dark:border-zinc-600"></div>
    </div>

    <form @submit.prevent="handleEmailLogin" class="w-full max-w-xs space-y-3">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Senha"
        required
        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
      />
      <button
        type="submit"
        :disabled="authStore.loading"
        class="w-full px-6 py-2.5 md:py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p class="mt-4 text-xs text-gray-400 dark:text-gray-500">
      Nao tem conta?
      <button
        @click="showRegister = !showRegister"
        class="underline hover:text-black dark:hover:text-white transition-colors"
      >
        {{ showRegister ? 'Fazer login' : 'Cadastrar-se' }}
      </button>
    </p>

    <form
      v-if="showRegister"
      @submit.prevent="handleRegister"
      class="w-full max-w-xs space-y-3 mt-3 animate-fade-in"
    >
      <input
        v-model="registerEmail"
        type="email"
        placeholder="Email"
        required
        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
      />
      <input
        v-model="registerPassword"
        type="password"
        placeholder="Senha (min. 6 caracteres)"
        required
        minlength="6"
        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
      />
      <button
        type="submit"
        :disabled="authStore.loading"
        class="w-full px-6 py-2.5 md:py-3 bg-gray-700 dark:bg-gray-300 text-white dark:text-black rounded-full font-medium hover:bg-gray-600 dark:hover:bg-gray-400 transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ authStore.loading ? 'Criando conta...' : 'Criar conta' }}
      </button>
    </form>

    <p v-if="authStore.error" class="mt-4 text-sm text-red-500 dark:text-red-400 max-w-xs">
      {{ authStore.error }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showRegister = ref(false)
const registerEmail = ref('')
const registerPassword = ref('')

async function handleGoogleLogin() {
  const success = await authStore.loginWithGoogle()
  if (success) router.push('/chat')
}

async function handleEmailLogin() {
  const success = await authStore.loginWithEmail(email.value, password.value)
  if (success) router.push('/chat')
}

async function handleRegister() {
  const success = await authStore.registerWithEmail(registerEmail.value, registerPassword.value)
  if (success) router.push('/chat')
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
