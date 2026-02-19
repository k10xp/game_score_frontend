<template>
  <div class="outer-scroll overflow-x-auto">
    <div
      class="public-league main-border modal-static modal-overflow w-max min-h-100"
    >
      <h1 class="text-3xl">Public League</h1>

      <section v-if="info" class="info">
        <h2>Info</h2>
        <pre>{{ info }}</pre>
      </section>

      <section
        class="filter flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between"
      >
        <h2 class="font-bold">Filter by teams</h2>

        <form
          @submit.prevent="applyFilter"
          class="flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <!-- Team A–D multiselect -->
          <Select type="select">
            <template #header="{ isOpen }">
              <span :class="{ underline: !isOpen }">
                {{
                  selectedTeams.length
                    ? `${selectedTeams.length} team(s) selected`
                    : 'Select teams'
                }}
              </span>
            </template>
            <template #body="">
              <div class="flex flex-col gap-2">
                <label
                  v-for="team in availableTeams"
                  :key="team"
                  class="flex items-center gap-2 whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    :value="team"
                    v-model="selectedTeams"
                  />
                  {{ team }}
                </label>
              </div>
            </template>
          </Select>

          <button type="submit" class="button primary">Apply</button>

          <button
            type="button"
            class="button secondary"
            :disabled="isFilterCleared"
            @click="clearFilter"
          >
            Clear
          </button>
        </form>
      </section>

      <hr />

      <!-- show selected teams in order of clicked -->
      <p v-if="!isFilterCleared" class="text-sm">
        Showing matches for {{ selectedTeams.join(', ') }}.
      </p>

      <p
        v-if="!isFilterCleared && !visibleMatches.length && !filterError"
        class="text-error"
      >
        No matches found for the selected teams.
      </p>

      <p v-if="filterError" class="text-error">
        {{ filterError }}
      </p>

      <div class="the-table" v-if="visibleMatches.length">
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
            <tr
              v-for="match in visibleMatches"
              :key="match.createdAt + match.homeTeam + match.awayTeam"
            >
              <td>{{ formatDate(match.matchDate) }}</td>

              <td
                :class="{
                  'text-success font-bold': match.homeScore > match.awayScore,
                  'text-primary font-bold': match.homeScore < match.awayScore,
                  'text-secondary': match.homeScore === match.awayScore,
                }"
              >
                {{ match.homeTeam }}
              </td>

              <td
                :class="{
                  'text-success font-bold': match.awayScore > match.homeScore,
                  'text-primary font-bold': match.awayScore < match.homeScore,
                  'text-secondary': match.awayScore === match.homeScore,
                }"
              >
                {{ match.awayTeam }}
              </td>

              <td>{{ match.homeScore }} - {{ match.awayScore }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- bar chart, points per team -->
      <section v-if="visibleMatches.length" class="mt-1">
        <h2 class="text-2xl mb-2">Total points per team</h2>

        <VuePlotly
          :data="pointsBarData"
          :layout="pointsBarLayout"
          class="w-full max-w-xl"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { API_ENDPOINT } from '@/data/consts';
import { formatDate } from '@/utils/general';
import { matches as mockMatches } from '@/data/mock/matches';
import Select from '@/components/Select.vue';

const availableTeams = ['Team A', 'Team B', 'Team C', 'Team D'];

const info = ref<unknown | null>(null);
const matches = ref<any[]>(mockMatches);
const filteredMatches = ref<any[]>([]);
const selectedTeams = ref<string[]>([]);
const filterError = ref<string | null>(null);

const isFilterCleared = computed(() => selectedTeams.value.length === 0);

const visibleMatches = computed(() => {
  if (!isFilterCleared.value) {
    return filteredMatches.value;
  }
  return matches.value;
});

//bar chart logic
const pointsBarData = computed<any[]>(() => {
  const pointsByTeam: Record<string, number> = {};

  for (const m of visibleMatches.value) {
    const homeTeam = m.homeTeam;
    const awayTeam = m.awayTeam;
    const homeScore = Number(m.homeScore || 0);
    const awayScore = Number(m.awayScore || 0);

    pointsByTeam[homeTeam] = (pointsByTeam[homeTeam] || 0) + homeScore;
    pointsByTeam[awayTeam] = (pointsByTeam[awayTeam] || 0) + awayScore;
  }

  const teams = Object.keys(pointsByTeam);
  const points = teams.map((t) => pointsByTeam[t]);

  return [
    {
      type: 'bar',
      x: teams,
      y: points,
      marker: { color: '#3b82f6' },
    },
  ];
});

//TODO: don't use any type
const pointsBarLayout: any = {
  title: 'Total points per team',
  xaxis: { title: 'Team' },
  yaxis: { title: 'Points' },
  margin: { t: 40, r: 10, b: 60, l: 50 },
  height: 360,
};

async function loadMatches() {
  const res = await fetch(`${API_ENDPOINT}/public-league/matches`);
  if (!res.ok) return;
  matches.value = await res.json();
}

function clearFilter() {
  selectedTeams.value = [];
  filteredMatches.value = [];
  filterError.value = null;
}

async function applyFilter() {
  filterError.value = null;
  filteredMatches.value = [];

  if (isFilterCleared.value) {
    await loadMatches();
    return;
  }

  const body = { teams: selectedTeams.value };

  const res = await fetch(`${API_ENDPOINT}/public-league/matches/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    filterError.value = 'Invalid team filter or server error.';
    return;
  }

  filteredMatches.value = await res.json();
}

onMounted(async () => {
  await Promise.all([loadMatches()]);
});
</script>
