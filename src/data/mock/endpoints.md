# Endpoints

- create match: POST http://localhost:8080/api/v1/match
- get all match: GET http://localhost:8080/api/v1/match
- search by team: GET http://localhost:8080/api/v1/match/search?team=TEAM_NAME

mock data generated with https://json-generator.com/

## Create match

```json
{
  "matchDate": "2026-01-01",
  "homeTeam": "Team A",
  "awayTeam": "Team C",
  "homeTeamScore": 3,
  "awayTeamScore": 1
}
```
