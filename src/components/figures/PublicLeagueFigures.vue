<template>
  <section v-if="matches.length" class="mt-1">
    <div class="tabs flex border-b border-gray-200 mb-4">
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

    <div class="chart-container" v-show="activeTab === 'points'">
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
  type ChartData,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  matches: Array<{
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
  }>;
}>();

const activeTab = ref<'points'>('points');

const pointsChartData = computed<ChartData<'bar'>>(() => {
  const pointsByTeam: Record<string, number> = {};

  for (const m of props.matches) {
    const homeTeam = m.homeTeam;
    const awayTeam = m.awayTeam;
    const homeScore = Number(m.homeScore || 0);
    const awayScore = Number(m.awayScore || 0);

    pointsByTeam[homeTeam] = (pointsByTeam[homeTeam] ?? 0) + homeScore;
    pointsByTeam[awayTeam] = (pointsByTeam[awayTeam] ?? 0) + awayScore;
  }

  const teams = Object.keys(pointsByTeam);
  const points: number[] = teams.map((t) => pointsByTeam[t] ?? 0);

  return {
    labels: teams,
    datasets: [
      {
        label: 'Total Points',
        backgroundColor: '#3b82f6',
        data: points,
      },
    ],
  };
});

const pointsOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    title: { display: true, text: 'Total Points per Team' },
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
