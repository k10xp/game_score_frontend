<template>
  <section v-if="matches.length" class="mb-1">
    <!-- tab buttons -->
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
      <Bar :data="winsLossesChartData" :options="winsLossesOptions" />
    </div>

    <!-- points -->
    <div v-show="activeTab === 'points'" class="chart-container">
      <Bar :data="pointsChartData" :options="pointsOptions" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
} from 'chart.js';
import type { GetMatch } from '@/data/matchModels';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  matches: GetMatch[];
}>();

const activeTab = ref<'wins' | 'points'>('wins');

//calculate wins and losses for chart
const winsLossesChartData = computed(() => {
  const winsByTeam: Record<string, number> = {};
  const lossesByTeam: Record<string, number> = {};

  props.matches.forEach((match) => {
    const { homeTeam, awayTeam, homeTeamScore, awayTeamScore } = match;
    if (homeTeamScore > awayTeamScore) {
      winsByTeam[homeTeam] = (winsByTeam[homeTeam] || 0) + 1;
      lossesByTeam[awayTeam] = (lossesByTeam[awayTeam] || 0) + 1;
    } else if (awayTeamScore > homeTeamScore) {
      winsByTeam[awayTeam] = (winsByTeam[awayTeam] || 0) + 1;
      lossesByTeam[homeTeam] = (lossesByTeam[homeTeam] || 0) + 1;
    }
  });

  const teamStats = Object.keys({ ...winsByTeam, ...lossesByTeam }).map(
    (team) => ({
      team,
      wins: winsByTeam[team] || 0,
      losses: lossesByTeam[team] || 0,
      diff: (winsByTeam[team] || 0) - (lossesByTeam[team] || 0),
    })
  );

  const sortedTeams = teamStats.sort((a, b) => b.diff - a.diff);
  const teams = sortedTeams.map((t) => t.team);

  return {
    labels: teams,
    datasets: [
      {
        label: 'Wins',
        backgroundColor: '#10b981',
        data: sortedTeams.map((t) => t.wins),
      },
      {
        label: 'Losses',
        backgroundColor: '#ef4444',
        data: sortedTeams.map((t) => -t.losses),
      },
    ],
  };
});

//calculate total points
const pointsChartData = computed(() => {
  const pointsByTeam: Record<string, number> = {};

  props.matches.forEach((match) => {
    const { homeTeam, awayTeam, homeTeamScore, awayTeamScore } = match;
    if (homeTeamScore > awayTeamScore) {
      pointsByTeam[homeTeam] = (pointsByTeam[homeTeam] || 0) + 1;
    } else if (awayTeamScore > homeTeamScore) {
      pointsByTeam[awayTeam] = (pointsByTeam[awayTeam] || 0) + 1;
    } else {
      //draw, do nothing
    }
  });

  const stats = Object.entries(pointsByTeam)
    .map(([team, points]) => ({ team, points }))
    .sort((a, b) => b.points - a.points);

  return {
    labels: stats.map((s) => s.team),
    datasets: [
      {
        label: 'Points',
        backgroundColor: '#3b82f6',
        data: stats.map((s) => s.points),
      },
    ],
  };
});

//configure chart
const winsLossesOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Wins vs Losses per Team (sorted by win diff)',
    },
    legend: { position: 'top' },
  },
  scales: {
    y: {
      title: { display: true, text: 'Wins (+) / Losses (-)' },
      beginAtZero: true,
    },
  },
};

const pointsOptions = {
  responsive: true,
  plugins: {
    title: { display: true, text: 'Total Points per Team (Win=1, Draw=0)' },
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, title: { display: true, text: 'Points' } },
  },
};
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
