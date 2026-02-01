<template>
  <div
    class="toast bg-tertiary top-10 md:fixed right-10 py-4 px-8 md:py-8 md:px-16 rounded-lg flex gap-2"
  >
    <Icon src="/icons/check.svg" class="w-6 h-6" />
    <span>{{ msg }}</span>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon.vue';

// Props
const props = defineProps<{ msg: string }>();
</script>

<style scoped></style>
