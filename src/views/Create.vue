<!-- wrote my own form, replace with something like shadcn -->
<template>
  <form class="match-form flex flex-col gap-12" @submit.prevent="submit">
    <div class="flex flex-col gap-4">
      <h2 class="text-2xl sm:text-3xl">New Game</h2>
      <label class="form-label">
        Date
        <input v-model="form.matchDate" class="text-input" type="date" />
      </label>

      <label class="form-label">
        Home team name
        <input v-model="form.homeTeam" class="text-input" type="text" />
      </label>

      <label class="form-label">
        Away team name
        <input v-model="form.awayTeam" class="text-input" type="text" />
      </label>

      <label class="form-label">
        Home score
        <input
          v-model.number="form.homeTeamScore"
          class="text-input"
          type="number"
        />
      </label>

      <label class="form-label">
        Away score
        <input
          v-model.number="form.awayTeamScore"
          class="text-input"
          type="number"
        />
      </label>
    </div>

    <div class="flex flex-col gap-4">
      <p v-if="statusCode !== null">Status: {{ statusCode }}</p>
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
import type { CreateMatch } from '@/data/matchModels';
import { createMatch } from '@/data/create';
import { API_ENDPOINT } from '@/data/consts';

// Refs
const form = ref<CreateMatch>({
  matchDate: '',
  homeTeam: '',
  awayTeam: '',
  homeTeamScore: 0,
  awayTeamScore: 0,
});
const submitting = ref(false);
const error = ref<string | null>(null);
const statusCode = ref<number | null>(null);

// Methods
const submit = async () => {
  try {
    submitting.value = true;
    error.value = null;
    statusCode.value = null;

    const endpoint = API_ENDPOINT + '/match';
    const status = await createMatch(endpoint, form.value);
    statusCode.value = status;
  } catch (e: any) {
    error.value = e?.message ?? 'Unknown error';
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
