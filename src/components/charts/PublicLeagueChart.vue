<template>
  <section class="chart-bg points-per-team">
    <Bar
      :data="pointsBarData"
      :options="pointsBarOptions"
      class="w-full max-w-xl"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

const props = defineProps<{
  matches: any[];
}>();

const teamColor = '#5c8199';

const pointsBarData = computed(() => {
  const pointsByTeam: Record<string, number> = {};

  for (const m of props.matches) {
    const homeTeam = m.homeTeam;
    const awayTeam = m.awayTeam;
    const homeScore = Number(m.homeScore || 0);
    const awayScore = Number(m.awayScore || 0);

    pointsByTeam[homeTeam] = (pointsByTeam[homeTeam] || 0) + homeScore;
    pointsByTeam[awayTeam] = (pointsByTeam[awayTeam] || 0) + awayScore;
  }

  const teams = Object.keys(pointsByTeam);

  return {
    labels: teams,
    datasets: [
      {
        label: 'Points',
        data: teams.map((t) => pointsByTeam[t] ?? 0),
        backgroundColor: teamColor,
      },
    ],
  };
});

const pointsBarOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: true, text: 'Total points per team' },
  },
  scales: {
    x: { title: { display: true, text: 'Team' } },
    y: { beginAtZero: true, title: { display: true, text: 'Points' } },
  },
};
</script>
