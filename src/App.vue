<script setup lang="ts"></script>

<template>
  <div>
    <nav class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/results">Results</router-link>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
}

a {
  text-decoration: none;
  color: #42b983;
  font-weight: 600;
}
</style>
