<template>
  <form class="match-form flex flex-col gap-12" @submit.prevent="submit">
    <div class="flex flex-col gap-4">
      <h2 class="text-2xl sm:text-3xl">New Game</h2>
      <label class="form-label">
        Date
        <input
          v-model="form.matchDate"
          required
          class="text-input"
          type="date"
        />
      </label>

      <label class="form-label">
        Home team name
        <input
          v-model="form.homeTeam"
          required
          class="text-input"
          type="text"
        />
      </label>

      <label class="form-label">
        Away team name
        <input
          v-model="form.awayTeam"
          required
          class="text-input"
          type="text"
        />
      </label>

      <label class="form-label">
        Home score
        <input
          v-model.number="form.homeTeamScore"
          class="text-input"
          type="number"
          required
        />
      </label>

      <label class="form-label">
        Away score
        <input
          v-model.number="form.awayTeamScore"
          class="text-input"
          type="number"
          required
        />
      </label>
    </div>

    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-error">
        {{ error }}
      </p>
      <div class="flex justify-between flex-col sm:flex-row gap-4">
        <button class="button primary" type="submit" :disabled="submitting">
          {{ submitting ? 'Creating...' : 'Create Game' }}
        </button>
        <router-link to="/results" class="button secondary">
          Cancel
        </router-link>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { CreateMatch } from '@/data/matchModels';
import { createMatch } from '@/data/create';
import { API_ENDPOINT } from '@/data/consts';
import { getAuthToken } from '@/data/auth';

// Emits
const emit = defineEmits<{
  'match-created': [];
}>();

// Refs
const router = useRouter();
const form = ref<CreateMatch>({
  matchDate: '',
  homeTeam: '',
  awayTeam: '',
  homeTeamScore: 0,
  awayTeamScore: 0,
});
const submitting = ref(false);
const error = ref<string | null>(null);

// Methods
const submit = async () => {
  const token = getAuthToken();

  if (!token) {
    error.value = 'You must be logged in to create a match.';
    return;
  }

  try {
    submitting.value = true;
    error.value = null;
    const endpoint = API_ENDPOINT + '/match';
    await createMatch(endpoint, form.value, token);

    // Emit event to parent to refetch data
    emit('match-created');

    // Redirect to results on success
    router.push('/results');
  } catch (e: any) {
    error.value = e?.message ?? 'Unknown error';
    console.error('Error creating match:', e);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* make calendar picker not hidden by black background */
.match-form input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.9);
  cursor: pointer;
}
</style>
