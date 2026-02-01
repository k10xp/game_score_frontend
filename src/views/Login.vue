<template>
  <div class="login-view main-border modal-static modal-small">
    <h1 class="text-3xl text-center">Login</h1>
    <form class="flex flex-col gap-6" @submit.prevent="submit">
      <label class="form-label">
        Username
        <input
          v-model="username"
          class="text-input"
          type="text"
          autocomplete="username"
        />
      </label>
      <label class="form-label">
        Password
        <input
          v-model="password"
          class="text-input"
          type="password"
          autocomplete="current-password"
        />
      </label>
      <p v-if="error" class="text-error">{{ error }}</p>
      <button class="button primary" type="submit" :disabled="submitting">
        {{ submitting ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/data/mock/auth';

// Refs
const username = ref('');
const password = ref('');
const error = ref<string | null>(null);
const submitting = ref(false);
const router = useRouter();

// Methods
const submit = async () => {
  error.value = null;
  submitting.value = true;
  // Mock login logic
  if (username.value === 'user' && password.value === 'pass') {
    login();
    router.push('/results');
  } else {
    error.value = 'Invalid username or password';
  }
  submitting.value = false;
};
</script>
