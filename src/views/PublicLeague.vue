<template>
  <div class="public-league">
    <h1>Public League</h1>

    <section class="info" v-if="info">
      <h2>Info</h2>
      <pre>{{ info }}</pre>
    </section>

    <section class="teams" v-if="matches.length">
      <h2>Matches</h2>
      <ul>
        <li v-for="match in matches" :key="match.id">
          {{ match.homeTeam }} vs {{ match.awayTeam }} - {{ match.score }}
        </li>
      </ul>
    </section>

    <section class="filter">
      <h2>Filter by teams</h2>

      <form @submit.prevent="applyFilter">
        <!-- query all public-league teams A-D, check All unselects any Team A-D -->
        <label class="all-toggle">
          <input type="checkbox" v-model="allSelected" @change="onAllToggle" />
          All
        </label>

        <!-- Team A–D multiselect, shift click to select more than 1 -->
        <select
          v-model="selectedTeams"
          class="team-select"
          multiple
          size="4"
          @change="onTeamsChange"
        >
          <option value="Team A">Team A</option>
          <option value="Team B">Team B</option>
          <option value="Team C">Team C</option>
          <option value="Team D">Team D</option>
        </select>

        <button type="submit">Apply filter</button>
      </form>

      <div v-if="filteredMatches.length && !allSelected">
        <h3>Filtered matches ({{ selectedTeams.join(', ') }})</h3>
        <ul>
          <li v-for="match in filteredMatches" :key="`f-${match.id}`">
            {{ match.homeTeam }} vs {{ match.awayTeam }} – {{ match.score }}
          </li>
        </ul>
      </div>

      <p v-if="filterError" class="error">
        {{ filterError }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { API_ENDPOINT } from '@/data/consts';

const info = ref<unknown | null>(null);
const matches = ref<any[]>([]);
const filteredMatches = ref<any[]>([]);
const selectedTeams = ref<string[]>([]);
const allSelected = ref(true);
const filterError = ref<string | null>(null);

async function loadInfo() {
  const res = await fetch(API_ENDPOINT);
  if (!res.ok) return;
  info.value = await res.json();
}

async function loadMatches() {
  const res = await fetch(`${API_ENDPOINT}/public-league/matches`);
  if (!res.ok) return;
  matches.value = await res.json();
}

//if All is true, clears Team A-D multiselect
function onAllToggle() {
  if (allSelected.value) {
    selectedTeams.value = [];
  }
}

//opposite of onAllToggle
function onTeamsChange() {
  if (selectedTeams.value.length > 0) {
    allSelected.value = false;
  }
}

async function applyFilter() {
  filterError.value = null;
  filteredMatches.value = [];

  //query all
  if (allSelected.value || selectedTeams.value.length === 0) {
    await loadMatches();
    return;
  }

  //query Teams A-D
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
  await Promise.all([loadInfo(), loadMatches()]);
});
</script>

<style scoped>
.public-league {
  padding: 1.5rem;
}
.info,
.teams,
.filter {
  margin-top: 1.5rem;
}

.filter form {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.all-toggle {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* dropdown styling */
.team-select {
  background-color: #000;
  color: #fff;
  border: 1px solid #fff;
  padding: 0.25rem 0.5rem;
  min-width: 8rem;
}

.team-select option {
  background-color: #000;
  color: #fff;
}

.error {
  color: #c00;
  margin-top: 0.5rem;
}
</style>
