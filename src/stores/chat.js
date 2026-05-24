import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const isTyping = ref(false)
  const isEmpty = computed(() => messages.value.length === 0)
  const isUploading = ref(false)
  const uploadProgress = ref(0)

  // Persiste estado entre reloads
  const conversationId = ref(localStorage.getItem('conversationId') || null)
  const documentoAtivo = ref(JSON.parse(localStorage.getItem('documentoAtivo') || 'null'))

  async function uploadDocument(file) {
    isUploading.value = true
    uploadProgress.value = 0
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name.replace(/\.(pdf|txt|docx?)$/i, ''))

      const { data: context } = await api.post('/contexts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          )
        },
      })

      const { data: conversation } = await api.post('/conversations', {
        title: file.name,
        context_id: context.id,
      })

      documentoAtivo.value = {
        id: context.id,
        name: context.name,
        size: file.size,
        content: context.content,
        context_id: context.id,
      }
      conversationId.value = conversation.id

      // Persiste no localStorage
      localStorage.setItem('conversationId', conversation.id)
      localStorage.setItem('documentoAtivo', JSON.stringify(documentoAtivo.value))

      uploadProgress.value = 100

      messages.value.push({
        id: Date.now(),
        from: 'bot',
        text: `Documento "${context.name}" processado. Agora voce pode consultar informacoes sobre este edital.`,
      })

      return { context, conversation }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      messages.value.push({
        id: Date.now(),
        from: 'bot',
        text: 'Erro ao processar o documento. Tente novamente.',
        is_error: true,
      })
      throw error
    } finally {
      isUploading.value = false
    }
  }

  async function send(text) {
    if (!text.trim() || text.length > 500) return

    messages.value.push({ id: Date.now(), from: 'user', text })
    isTyping.value = true

    try {
      if (!conversationId.value) {
        const { data: conversation } = await api.post('/conversations', {
          title: text.substring(0, 50),
          context_id: documentoAtivo.value?.context_id || null,
        })
        conversationId.value = conversation.id
        localStorage.setItem('conversationId', conversation.id)
      }

      const { data: result } = await api.post(`/conversations/${conversationId.value}/messages`, {
        question: text,
        context_id: documentoAtivo.value?.context_id || null,
      })

      messages.value.push({
        id: Date.now() + 1,
        from: 'bot',
        text: result.assistant_message?.content || result.answer || 'Sem resposta',
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      messages.value.push({
        id: Date.now() + 1,
        from: 'bot',
        text: 'Nao foi possivel consultar o edital. Verifique se a API esta rodando.',
        is_error: true,
      })
    } finally {
      isTyping.value = false
    }
  }

  function clear() {
    messages.value = []
    documentoAtivo.value = null
    conversationId.value = null
    localStorage.removeItem('conversationId')
    localStorage.removeItem('documentoAtivo')
  }

  return {
    messages,
    isTyping,
    isEmpty,
    documentoAtivo,
    isUploading,
    uploadProgress,
    conversationId,
    uploadDocument,
    send,
    clear,
  }
})
