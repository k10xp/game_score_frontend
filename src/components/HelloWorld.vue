<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
  <h1>{{ msg }}</h1>
</template>

<style scoped>
h1 {
  color: #42b983;
  font-size: 2.4rem;
  font-weight: 700;
  text-align: center;
  margin: 1.5rem 0;
}
</style>
