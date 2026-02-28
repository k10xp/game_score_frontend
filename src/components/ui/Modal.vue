<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex justify-center items-center bg-darker/80 backdrop-blur-xs"
    >
      <div
        class="bg-darker main-border p-12 relative w-[80%] md:w-[25rem] h-max max-h-screen overflow-auto"
      >
        <button
          class="absolute top-4 right-6 text-2xl cursor-pointer"
          @click="$emit('close')"
        >
          &times;
        </button>
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>();
defineEmits(['close']);
</script>
