import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = 'http://localhost:3000/api'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const isTyping = ref(false)
  const error = ref(null)
  const documentoAtivo = ref(null)
  const isUploading = ref(false)
  const uploadProgress = ref(0)

  const hasError = computed(() => error.value !== null)
  const isEmpty = computed(() => messages.value.length === 0)

  function clearError() {
    error.value = null
  }

  function addMessage(text, from = 'user', citacao = null) {
    messages.value.push({
      id: Date.now() + Math.random(),
      text,
      from,
      citacao,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    })
  }

  async function send(text) {
    if (!text || !text.trim()) {
      error.value = 'Digite uma pergunta sobre o edital'
      return
    }

    clearError()
    addMessage(text.trim(), 'user')
    isTyping.value = true

    try {
      const contexto = documentoAtivo.value?.content || ''

      const response = await fetch(`${API_URL}/qa/simple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text.trim(),
          context: contexto,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || `Erro ${response.status}`)
      }

      const data = await response.json()
      addMessage(data.answer, 'bot')
    } catch (err) {
      error.value = err.message || 'Erro ao consultar o documento.'
      addMessage('Não foi possível consultar o edital. Verifique se a API está rodando.', 'system')
    } finally {
      isTyping.value = false
    }
  }

  async function uploadDocument(file) {
    isUploading.value = true
    uploadProgress.value = 0

    const interval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 100) clearInterval(interval)
    }, 200)

    return new Promise((resolve) => {
      setTimeout(() => {
        documentoAtivo.value = {
          name: file.name,
          size: file.size,
          content:
            'Edital 045/2024. Objeto: aquisição de equipamentos de informática para atender às necessidades da rede municipal de educação. Valor estimado: R$ 2.450.000,00. Prazo de entrega: 30 dias corridos. Órgão contratante: Prefeitura Municipal de Teresina. Forma de pagamento: 12 parcelas mensais. Requisitos: regularidade fiscal, trabalhista e qualificação técnica.',
        }
        isUploading.value = false
        uploadProgress.value = 0
        addMessage(
          `Documento "${file.name}" processado. Agora você pode consultar informações sobre este edital.`,
          'bot',
        )
        resolve()
      }, 2500)
    })
  }

  function clearChat() {
    messages.value = []
    error.value = null
    documentoAtivo.value = null
  }

  return {
    messages,
    isTyping,
    isUploading,
    uploadProgress,
    error,
    documentoAtivo,
    hasError,
    isEmpty,
    send,
    uploadDocument,
    clearError,
    clearChat,
  }
})
