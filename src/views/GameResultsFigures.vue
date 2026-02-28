<template>
  <section v-if="matches.length" class="mb-1">
    <div class="mb-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-lg font-semibold text-blue-800">
        Interactive: hover over figures to explore
      </p>
    </div>

    <!-- tab container -->
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { GetMatch } from '@/data/matchModels';

const props = defineProps<{
  matches: GetMatch[];
}>();

const activeTab = ref<'wins' | 'points'>('wins');

const winsLossesData = computed<any[]>(() => {
  const winsByTeam: Record<string, number> = {};
  const lossesByTeam: Record<string, number> = {};

  for (const match of props.matches) {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const homeScore = match.homeTeamScore;
    const awayScore = match.awayTeamScore;

    if (homeScore > awayScore) {
      winsByTeam[homeTeam] = (winsByTeam[homeTeam] || 0) + 1;
      lossesByTeam[awayTeam] = (lossesByTeam[awayTeam] || 0) + 1;
    } else if (awayScore > homeScore) {
      winsByTeam[awayTeam] = (winsByTeam[awayTeam] || 0) + 1;
      lossesByTeam[homeTeam] = (lossesByTeam[homeTeam] || 0) + 1;
    }
    // draws ignored
  }

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
      marker: { color: '#10b981' },
    },
    {
      type: 'bar',
      name: 'Losses',
      x: teams,
      y: sortedTeams.map((stat) => -stat.losses),
      marker: { color: '#ef4444' },
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

const pointsData = computed<any[]>(() => {
  const pointsByTeam: Record<string, number> = {};

  for (const match of props.matches) {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const homeScore = match.homeTeamScore;
    const awayScore = match.awayTeamScore;

    if (homeScore > awayScore) {
      pointsByTeam[homeTeam] = (pointsByTeam[homeTeam] || 0) + 1;
    } else if (awayScore > homeScore) {
      pointsByTeam[awayTeam] = (pointsByTeam[awayTeam] || 0) + 1;
    } else {
      pointsByTeam[homeTeam] = pointsByTeam[homeTeam] || 0;
      pointsByTeam[awayTeam] = pointsByTeam[awayTeam] || 0;
    }
  }

  const teamStats = Object.entries(pointsByTeam)
    .map(([team, points]) => ({ team, points }))
    .sort((a, b) => b.points - a.points);

  const teams = teamStats.map((stat) => stat.team);
  const points = teamStats.map((stat) => stat.points);

  return [
    {
      type: 'bar',
      x: teams,
      y: points,
      marker: { color: '#3b82f6' },
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
