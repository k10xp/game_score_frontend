<template>
  <nav class="nav flex flex-col items-center gap-6 w-full">
    <router-link to="/results">
      <img
        src="/sportz-scores-logo.svg"
        class="w-36"
        alt="Sportz Scores Logo"
      />
    </router-link>
    <div class="links flex gap-4 w-full flex-wrap justify-center">
      <router-link to="/public-league">Public League</router-link>
      <template v-if="authenticated">
        <router-link to="/results">Games</router-link>
        <router-link to="/results/create">New Game</router-link>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>
    </div>
    <div v-if="authenticated" class="flex gap-2">
      <span>
        Hi,
        <router-link v-if="currentUser?.role === 'admin'" to="/admin">{{
          currentUser?.username
        }}</router-link>
        <span v-else>{{ currentUser?.username }}</span
        >!
      </span>
      <router-link to="/logout">Logout</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { authenticated, currentUser } from '@/data/auth';
</script>

<style scoped>
nav {
  .router-link-exact-active {
    @apply no-underline;
  }

  a {
    @apply underline;
  }
}
</style>
