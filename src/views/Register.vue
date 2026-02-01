<template>
  <div class="register-view main-border modal-static modal-small">
    <h1 class="text-3xl text-center">Register</h1>
    <form class="flex flex-col gap-6" @submit.prevent="submit">
      <label class="form-label">
        First Name
        <input
          v-model="firstName"
          class="text-input"
          type="text"
          autocomplete="given-name"
        />
      </label>
      <label class="form-label">
        Last Name
        <input
          v-model="lastName"
          class="text-input"
          type="text"
          autocomplete="family-name"
        />
      </label>
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
          autocomplete="new-password"
        />
      </label>
      <label class="form-label">
        Confirm Password
        <input
          v-model="confirmPassword"
          class="text-input"
          type="password"
          autocomplete="new-password"
        />
      </label>
      <p v-if="error" class="text-error">{{ error }}</p>
      <button class="button primary" type="submit" :disabled="submitting">
        {{ submitting ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authenticated } from '@/data/mock/auth';

// Refs
const firstName = ref('');
const lastName = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref<string | null>(null);
const submitting = ref(false);
const router = useRouter();

// Methods
const submit = async () => {
  error.value = null;
  submitting.value = true;

  if (
    !firstName.value ||
    !lastName.value ||
    !username.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    error.value = 'All fields are required';
  } else if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
  } else {
    // Mock registration logic
    if (username.value === 'user') {
      error.value = 'Username already taken';
    } else {
      if (authenticated.value) router.push('/results');
    }
  }

  submitting.value = false;
};
</script>
