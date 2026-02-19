<template>
  <div class="outer-scroll overflow-x-auto">
    <div class="games-list main-border modal-static modal-overflow w-max">
      <div
        class="actions-primary flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-6"
      >
        <h1 class="text-3xl">My Games</h1>
        <router-link to="/create" class="button primary">New Game</router-link>
      </div>

      <!-- figures start, sorted wins descending -->
      <div
        v-if="matches.length"
        class="mb-1 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <p class="text-lg font-semibold text-blue-800">
          Interactive: hover over figures to explore
        </p>
      </div>

      <!-- tab container -->
      <section v-if="matches.length" class="mb-1">
        <div class="tabs flex border-b border-gray-200 mb-4">
          <button
            @click="activeTab = 'wins'"
            :class="[
              'tab-btn px-6 py-2 text-lg font-medium border-b-2 transition-colors duration-200',
              activeTab === 'wins'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Wins & Losses
          </button>
          <button
            @click="activeTab = 'points'"
            :class="[
              'tab-btn px-6 py-2 text-lg font-medium border-b-2 transition-colors duration-200',
              activeTab === 'points'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Points per Team
          </button>
        </div>

        <!-- wins/losses -->
        <div v-show="activeTab === 'wins'" class="chart-container">
          <h2 class="text-2xl mb-4">Wins & Losses per Team</h2>
          <VuePlotly
            :data="winsLossesData"
            :layout="winsLossesLayout"
            class="w-full max-w-xl"
          />
        </div>

        <!-- total points -->
        <div v-show="activeTab === 'points'" class="chart-container">
          <h2 class="text-2xl mb-4">Points per Team</h2>
          <VuePlotly
            :data="pointsData"
            :layout="pointsLayout"
            class="w-full max-w-xl"
          />
        </div>
      </section>

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
import { ref, onMounted, computed, watch, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { fetchWithFallback } from '@/data/fetch';
import { formatDate } from '@/utils/general.ts';
import { API_ENDPOINT } from '@/data/consts';
import Modal from '@/components/Modal.vue';
import type { GetMatch, BackendMatch } from '@/data/matchModels';
import { transformMatch } from '@/data/matchModels';
import { getAuthToken } from '@/data/auth';

// Constants
const endpoint = API_ENDPOINT + '/match';

// Refs
const matches = ref<GetMatch[]>([]);
const error = ref<string | null>(null);
const activeTab = ref<'wins' | 'points'>('wins'); // NEW: Tab state

// Inject
const showToast = inject<(msg: string) => void>('showToast', () => {});

// Composables
const router = useRouter();
const route = useRoute();

// Computed
const isModalOpen = computed(() => route.name === 'Create');

// win/loss
const winsLossesData = computed<any[]>(() => {
  const winsByTeam: Record<string, number> = {};
  const lossesByTeam: Record<string, number> = {};

  for (const match of matches.value) {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const homeScore = match.homeTeamScore;
    const awayScore = match.awayTeamScore;

    if (homeScore > awayScore) {
      // Home win
      winsByTeam[homeTeam] = (winsByTeam[homeTeam] || 0) + 1;
      lossesByTeam[awayTeam] = (lossesByTeam[awayTeam] || 0) + 1;
    } else if (awayScore > homeScore) {
      // Away win
      winsByTeam[awayTeam] = (winsByTeam[awayTeam] || 0) + 1;
      lossesByTeam[homeTeam] = (lossesByTeam[homeTeam] || 0) + 1;
    }
    // Draws don't count as wins/losses
  }

  //win difference for sort
  const teamStats = Object.keys({ ...winsByTeam, ...lossesByTeam }).map(
    (team) => ({
      team,
      wins: winsByTeam[team] || 0,
      losses: lossesByTeam[team] || 0,
      diff: (winsByTeam[team] || 0) - (lossesByTeam[team] || 0),
    })
  );

  const sortedTeams = teamStats.sort((a, b) => b.diff - a.diff);
  const teams = sortedTeams.map((stat) => stat.team);

  return [
    {
      type: 'bar',
      name: 'Wins',
      x: teams,
      y: sortedTeams.map((stat) => stat.wins),
      marker: { color: '#10b981' }, // green
    },
    {
      type: 'bar',
      name: 'Losses',
      x: teams,
      y: sortedTeams.map((stat) => -stat.losses), // negative values
      marker: { color: '#ef4444' }, // red
    },
  ];
});

const winsLossesLayout: any = {
  title: 'Wins vs Losses per Team (sorted by win diff)',
  xaxis: { title: 'Team' },
  yaxis: {
    title: 'Wins (+)/Losses (-)',
    zeroline: true,
    zerolinecolor: '#000',
    zerolinewidth: 2,
    gridcolor: '#f0f0f0',
  },
  barmode: 'group',
  margin: { t: 40, r: 10, b: 60, l: 70 },
  height: 400,
};

// total points per team
const pointsData = computed<any[]>(() => {
  const pointsByTeam: Record<string, number> = {};

  for (const match of matches.value) {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const homeScore = match.homeTeamScore;
    const awayScore = match.awayTeamScore;

    //TODO: try different scoring system, draws count
    if (homeScore > awayScore) {
      pointsByTeam[homeTeam] = (pointsByTeam[homeTeam] || 0) + 1;
    } else if (awayScore > homeScore) {
      pointsByTeam[awayTeam] = (pointsByTeam[awayTeam] || 0) + 1;
    } else {
      pointsByTeam[homeTeam] = (pointsByTeam[homeTeam] || 0) + 0;
      pointsByTeam[awayTeam] = (pointsByTeam[awayTeam] || 0) + 0;
    }
  }

  //most to least points
  const teamStats = Object.entries(pointsByTeam)
    .map(([team, points]) => ({
      team,
      points,
    }))
    .sort((a, b) => b.points - a.points);

  const teams = teamStats.map((stat) => stat.team);
  const points = teamStats.map((stat) => stat.points);

  return [
    {
      type: 'bar',
      x: teams,
      y: points,
      marker: { color: '#3b82f6' }, // blue
    },
  ];
});

const pointsLayout: any = {
  title: 'Total Points per Team (Win=3, Draw=1) - sorted by points',
  xaxis: { title: 'Team' },
  yaxis: { title: 'Points' },
  margin: { t: 50, r: 10, b: 60, l: 50 },
  height: 400,
};

// Watchers
watch(isModalOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

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

<style scoped>
.chart-container {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
