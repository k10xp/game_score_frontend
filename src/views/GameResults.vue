<template>
  <div class="outer-scroll overflow-x-auto">
    <div class="games-list main-border modal-static modal-overflow w-max">
      <div
        class="actions-primary flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-6"
      >
        <h1 class="text-3xl">My Games</h1>
        <router-link to="/create" class="button primary">New Game</router-link>
      </div>

      <!-- tab container -->
      <section v-if="matches.length">
        <div class="tabs flex border-b border-gray-200 mb-6">
          <button
            @click="activeTab = 'wins'"
            :class="[
              'tab-btn px-6 py-2 text-lg font-medium transition-colors duration-200',
              activeTab === 'wins' ? ' text-light' : ' text-light/50 ',
            ]"
          >
            Wins & Losses
          </button>
          <button
            @click="activeTab = 'points'"
            :class="[
              'tab-btn px-6 py-2 text-lg font-medium transition-colors duration-200',
              activeTab === 'points' ? ' text-light' : ' text-light/50 ',
            ]"
          >
            Points per Team
          </button>
        </div>

        <!-- wins/losses -->
        <div v-show="activeTab === 'wins'" class="chart-bg chart-container">
          <Bar
            :data="winsLossesChartData"
            :options="winsLossesOptions"
            class="w-full max-w-xl"
          />
        </div>

        <!-- total points -->
        <div v-show="activeTab === 'points'" class="chart-bg chart-container">
          <Bar
            :data="pointsChartData"
            :options="pointsOptions"
            class="w-full max-w-xl"
          />
        </div>
      </section>
      <hr />

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
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

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
const winsLossesChartData = computed(() => {
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

  // win difference for sort
  const teamStats = Object.keys({ ...winsByTeam, ...lossesByTeam }).map(
    (team) => ({
      team,
      wins: winsByTeam[team] || 0,
      losses: lossesByTeam[team] || 0,
      diff: (winsByTeam[team] || 0) - (lossesByTeam[team] || 0),
    })
  );

  const sortedTeams = teamStats.sort((a, b) => b.diff - a.diff);
  const labels = sortedTeams.map((stat) => stat.team);

  return {
    labels,
    datasets: [
      {
        label: 'Wins',
        data: sortedTeams.map((stat) => stat.wins),
        backgroundColor: '#10b981',
      },
      {
        label: 'Losses',
        data: sortedTeams.map((stat) => -stat.losses), // negative values
        backgroundColor: '#ef4444',
      },
    ],
  };
});

const winsLossesOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: {
      display: true,
      text: 'Wins vs Losses per Team (sorted by win diff)',
    },
  },
  scales: {
    x: { title: { display: true, text: 'Team' } },
    y: {
      title: { display: true, text: 'Wins (+) / Losses (-)' },
      grid: { color: '#f0f0f0' },
    },
  },
};

// total points per team
const pointsChartData = computed(() => {
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

  // most to least points
  const teamStats = Object.entries(pointsByTeam)
    .map(([team, points]) => ({ team, points }))
    .sort((a, b) => b.points - a.points);

  return {
    labels: teamStats.map((stat) => stat.team),
    datasets: [
      {
        label: 'Points',
        data: teamStats.map((stat) => stat.points),
        backgroundColor: '#ffffff',
      },
    ],
  };
});

const pointsOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: {
      display: true,
      text: 'Total Points per Team - sorted by points',
    },
  },
  scales: {
    x: { title: { display: true, text: 'Team' } },
    y: {
      beginAtZero: true,
      title: { display: true, text: 'Points' },
    },
  },
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
