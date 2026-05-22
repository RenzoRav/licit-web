<template>
  <div
    class="w-72 md:w-64 lg:w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-xl md:shadow-none"
  >
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h2 class="font-semibold text-black text-sm">Documentos</h2>
        <p class="text-xs text-gray-400 mt-0.5">3 editais carregados</p>
      </div>
      <button
        @click="$emit('close')"
        class="md:hidden p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div
        v-for="doc in documents"
        :key="doc.id"
        @click="$emit('select', doc.id)"
        :class="[
          'p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
          activeId === doc.id
            ? 'bg-gray-100 border-l-4 border-l-black'
            : 'border-l-4 border-l-transparent',
        ]"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-10 bg-gray-200 rounded flex items-center justify-center shrink-0">
            <span class="text-[10px] font-bold text-gray-600">PDF</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-black truncate">{{ doc.title }}</p>
            <p class="text-xs text-gray-400 mt-0.5 truncate">{{ doc.orgao }}</p>
            <div class="flex items-center gap-2 mt-1.5">
              <span
                class="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 border border-gray-200"
              >
                {{ doc.tipo }}
              </span>
              <span class="text-[10px] text-gray-400">{{ doc.valor }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-gray-200">
      <button
        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Carregar edital
      </button>
      <p class="text-[10px] text-gray-400 text-center mt-2">PDF, DOCX até 10MB</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  documents: {
    type: Array,
    default: () => [
      {
        id: 1,
        title: 'Edital 045/2024',
        orgao: 'Prefeitura Municipal de São Paulo',
        tipo: 'Pregão',
        valor: 'R$ 2.450.000,00',
      },
      {
        id: 2,
        title: 'Edital 012/2024',
        orgao: 'Secretaria de Educação',
        tipo: 'Concorrência',
        valor: 'R$ 890.000,00',
      },
      {
        id: 3,
        title: 'Termo de Referência 89/2023',
        orgao: 'Câmara Municipal',
        tipo: 'TR',
        valor: 'R$ 120.000,00',
      },
    ],
  },
  activeId: { type: Number, default: 1 },
})

defineEmits(['select', 'close'])
</script>
