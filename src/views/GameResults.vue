<template>
  <div class="outer-scroll overflow-x-auto">
    <div class="games-list main-border modal-static modal-overflow w-max">
      <div
        class="actions-primary flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-6"
      >
        <h1 class="text-3xl">My Games</h1>
        <router-link to="/create" class="button primary">New Game</router-link>
      </div>

      <!-- figures component, sorted wins descending -->
      <GameResultsFigures :matches="matches" />

      <div class="the-table">
        <table class="w-full md:min-w-[600px]">
          <thead>
            <tr>
              <th>Date</th>
              <th>Home</th>
              <th>Away</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="match in matches" :key="match.matchId">
              <td>{{ formatDate(match.matchDate) }}</td>
              <td
                :class="{
                  'text-success font-bold':
                    match.homeTeamScore > match.awayTeamScore,
                  'text-primary font-bold':
                    match.homeTeamScore < match.awayTeamScore,
                  'text-secondary': match.homeTeamScore === match.awayTeamScore,
                }"
              >
                {{ match.homeTeam }}
              </td>
              <td
                :class="{
                  'text-success font-bold':
                    match.awayTeamScore > match.homeTeamScore,
                  'text-primary font-bold':
                    match.awayTeamScore < match.homeTeamScore,
                  'text-secondary': match.awayTeamScore === match.homeTeamScore,
                }"
              >
                {{ match.awayTeam }}
              </td>
              <td>{{ match.homeTeamScore }} - {{ match.awayTeamScore }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="error" class="text-error">{{ error }}</p>
      <div class="actions flex sm:justify-between gap-4 items-center">
        <button
          class="button secondary cursor-pointer"
          type="button"
          @click="showToast('New Game Added!')"
        >
          Mock Toast
        </button>
        <Modal :open="isModalOpen" @close="router.push('/results')">
          <router-view v-if="isModalOpen" @match-created="handleMatchCreated" />
        </Modal>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { fetchWithFallback } from '@/data/fetch';
import { API_ENDPOINT } from '@/data/consts';
import Modal from '@/components/ui/Modal.vue';
import type { GetMatch, BackendMatch } from '@/data/matchModels';
import { transformMatch } from '@/data/matchModels';
import { getAuthToken } from '@/data/auth';
import GameResultsFigures from '../components/figures/GameResultsFigures.vue';
import { formatDate } from '@/utils/general';

// Constants
const endpoint = API_ENDPOINT + '/match';

// Refs
const matches = ref<GetMatch[]>([]);
const error = ref<string | null>(null);

// Inject
const showToast = inject<(msg: string) => void>('showToast', () => {});

// Composables
const router = useRouter();
const route = useRoute();

// Computed
const isModalOpen = computed(() => route.name === 'Create');

// Methods
const fetchMatches = async () => {
  try {
    error.value = null;

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetchWithFallback<BackendMatch[]>(endpoint, [], {
      headers,
    });
    if (response.length > 0) {
      matches.value = response.map(transformMatch);
    } else {
      error.value = 'No matches found';
    }
  } catch (e) {
    console.error('Error fetching matches:', e);
    error.value = 'Failed to load matches';
  }
};

const handleMatchCreated = () => {
  fetchMatches();
};

// Lifecycle
onMounted(async () => {
  await fetchMatches();
});
</script>
