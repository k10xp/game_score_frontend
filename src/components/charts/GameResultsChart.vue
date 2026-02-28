<template>
  <section>
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

// win/loss
const winsLossesChartData = computed(() => {
  const winsByTeam: Record<string, number> = {};
  const lossesByTeam: Record<string, number> = {};

  for (const match of props.matches) {
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

  for (const match of props.matches) {
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
</script>
