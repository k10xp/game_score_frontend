<template>
  <div v-html="svgContent" class="icon"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Props
const props = defineProps<{ src: string }>();

// Refs
const svgContent = ref('');

// Lifecycle
onMounted(async () => {
  try {
    const response = await fetch(props.src);
    const svg = await response.text();
    svgContent.value = svg;
  } catch (error) {
    console.error('Error loading the SVG:', error);
  }
});
</script>

<style scoped>
.icon {
  fill: currentColor;
}

.icon :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
