<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
  <h1>{{ msg }}</h1>
</template>

<style scoped>
h1 {
  color: #c5c5c5;
  font-size: 2.4rem;
  font-weight: 700;
  text-align: center;
  margin: 1.5rem 0;
}
</style>
