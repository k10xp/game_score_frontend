<template>
  <div ref="selectRef" class="relative" :class="{ open: isOpen }">
    <button :class="`${type} w-full`" @click="toggleDropdown">
      <div class="flex justify-center items-center gap-2">
        <slot name="header" :isOpen="isOpen">
          <span>Select an Option</span>
        </slot>
        <Icon src="/icons/caret.svg" class="pos w-6 h-6" />
      </div>
    </button>
    <div
      v-if="isOpen"
      class="select-drop absolute z-10 bg-darker p-6 w-full border-light border rounded-b-lg mt-3"
    >
      <slot name="body" :toggleDropdown="toggleDropdown"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import Icon from '@/components/layout/Icon.vue';

const selectRef = ref<HTMLElement | null>(null);

const props = defineProps({
  type: {
    type: String,
    default: 'select',
    validator: (value: string) => ['link', 'select', 'button'].includes(value),
  },
  flush: {
    type: Boolean,
    default: true,
  },
});

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// callback if you click outside this component
onClickOutside(selectRef, (_event) => {
  isOpen.value = false;
});
</script>

<style scoped>
.pos {
  transition: transform 0.3s ease-in-out;
}
.open .pos {
  transform: rotate(180deg);
}
</style>
