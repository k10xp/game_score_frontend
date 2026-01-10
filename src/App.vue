<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-14 p-10">
    <div class="flex flex-col gap-6 w-max mx-auto items-center">
      <router-link to="/results">
        <img
          src="/sportz-scores-logo.svg"
          class="w-[9rem]"
          alt="Sportz Scores Logo"
        />
      </router-link>
      <nav class="nav flex gap-4">
        <router-link to="/results">Games</router-link>
        <router-link to="/results/create">New Game</router-link>
      </nav>
    </div>

    <router-view />

    <footer class="text-center text-sm text-light/50">
      Sportz Scores {{ new Date().getFullYear() }} &nbsp;|&nbsp;
      <a href="#" class="underline">Contact our team</a>
    </footer>
  </div>
</template>

<style scoped>
nav .router-link-exact-active {
  @apply no-underline;
}

nav a {
  @apply underline;
}
</style>
