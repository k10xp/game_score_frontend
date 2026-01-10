<script setup lang="ts">
import { matches } from "../data/mock/matches";
</script>

<!-- TODO: highlight win team -->
<template>
  <div class="results">
    <h1>Match Results</h1>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Home</th>
          <th>Away</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="match in matches" :key="match.matchId">
          <td>{{ match.matchId }}</td>
          <td>{{ match.matchDate }}</td>
          <td>{{ match.homeTeam }}</td>
          <td>{{ match.awayTeam }}</td>
          <td>{{ match.homeTeamScore }} - {{ match.awayTeamScore }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.results {
  max-width: 800px;
  margin: 2rem auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  color: gray;
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  text-align: center;
}

th {
  background: #ffcfcf;
}
</style>
