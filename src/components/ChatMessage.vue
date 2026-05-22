<template>
  <div :class="['flex gap-2 md:gap-3 animate-fade-in', isUser ? 'flex-row-reverse' : 'flex-row']">
    <div
      :class="[
        'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] md:text-xs font-bold border-2',
        isUser ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300',
      ]"
    >
      {{ isUser ? 'V' : 'A' }}
    </div>

    <div
      :class="[
        'max-w-[85%] sm:max-w-[75%] px-3 md:px-4 py-2 md:py-2.5 rounded-2xl text-sm leading-relaxed',
        isUser
          ? 'bg-black text-white rounded-br-md'
          : 'bg-white text-black rounded-bl-md border border-gray-200',
      ]"
    >
      {{ text }}

      <div v-if="!isUser && citacao" class="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Referência</p>
        <div class="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <p class="text-xs text-gray-600 italic">"{{ citacao }}"</p>
          <p class="text-[10px] text-gray-400 mt-1">Edital 045/2024, página 12</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: String,
  isUser: Boolean,
  citacao: { type: String, default: null },
})
</script>
