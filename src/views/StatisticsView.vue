<template>
  <div class="outer-scroll overflow-x-auto">
    <div class="public-league main-border modal-static modal-overflow w-max min-h-100">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl">Match Statistics</h1>
          <p class="text-light/50">Aggregated scores for home and away teams</p>
        </div>
      </div>

      <hr />

      <!-- Loading -->
      <div v-if="loading" class="opacity-70 mb-4">Loading statistics...</div>

      <!-- Error -->
      <p v-if="error" class="text-error">{{ error }}</p>

      <!-- Statistics cards -->
      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        <!-- Home Team -->
        <div class="main-border p-6 rounded-xl flex flex-col gap-4">
          <h2 class="text-xl font-semibold">Home Team</h2>

          <div class="flex justify-between">
            <span>Average</span>
            <strong :class="avgClass(stats.home.avg, stats.away.avg)">{{ stats.home.avg }}</strong>
          </div>
          <div class="flex justify-between">
            <span>Minimum</span>
            <strong :class="minClass(stats.home.min, stats.away.min)">{{ stats.home.min }}</strong>
          </div>
          <div class="flex justify-between">
            <span>Maximum</span>
            <strong :class="maxClass(stats.home.max, stats.away.max)">{{ stats.home.max }}</strong>
          </div>
        </div>

        <!-- Away Team -->
        <div class="main-border p-6 rounded-xl flex flex-col gap-4">
          <h2 class="text-xl font-semibold">Away Team</h2>

          <div class="flex justify-between">
            <span>Average</span>
            <strong :class="avgClass(stats.away.avg, stats.home.avg)">{{ stats.away.avg }}</strong>
          </div>
          <div class="flex justify-between">
            <span>Minimum</span>
            <strong :class="minClass(stats.away.min, stats.home.min)">{{ stats.away.min }}</strong>
          </div>
          <div class="flex justify-between">
            <span>Maximum</span>
            <strong :class="maxClass(stats.away.max, stats.home.max)">{{ stats.away.max }}</strong>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAuthToken } from '@/data/auth';
import { API_ENDPOINT } from '@/data/consts';

import { transformStatistics, type BackendStatistics, type MatchStatistics } from '@/data/statisticsModels';

const stats = ref<MatchStatistics | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchStatistics = async () => {
  loading.value = true;
  error.value = null;

  try {
    const token = getAuthToken();
    const headers: HeadersInit = {};

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_ENDPOINT}/match/statistics`, { headers });

    if (!response.ok) throw new Error('Failed to load statistics');

    const backendStats: BackendStatistics = await response.json();
    stats.value = transformStatistics(backendStats);

  } catch (err: any) {
    console.error('Error fetching statistics:', err);
    error.value = err.message || 'Failed to load statistics';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => fetchStatistics());

// Helper functions for coloring
const avgClass = (value: number, compare: number) =>
  value > compare ? 'text-success font-bold' : value < compare ? 'text-primary font-bold' : 'text-secondary font-bold';

const minClass = (value: number, compare: number) =>
  value < compare ? 'text-success font-bold' : value > compare ? 'text-primary font-bold' : 'text-secondary font-bold';

const maxClass = (value: number, compare: number) =>
  value > compare ? 'text-success font-bold' : value < compare ? 'text-primary font-bold' : 'text-secondary font-bold';
</script>