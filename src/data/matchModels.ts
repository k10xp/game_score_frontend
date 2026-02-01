export interface CreateMatch {
  matchDate: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamScore: number;
  awayTeamScore: number;
}

//GetMatch has additional matchId field
export interface GetMatch extends CreateMatch {
  matchId: number;
}

// Backend response interface (snake_case)
export interface BackendMatch {
  matchid: string;
  match_date: string;
  home_team: string;
  away_team: string;
  home_team_score: number;
  away_team_score: number;
  entry_created?: string;
  winning_team?: string;
}

// Transform backend response to frontend model
export function transformMatch(backendMatch: BackendMatch): GetMatch {
  return {
    matchId: parseInt(backendMatch.matchid),
    matchDate: backendMatch.match_date,
    homeTeam: backendMatch.home_team,
    awayTeam: backendMatch.away_team,
    homeTeamScore: backendMatch.home_team_score,
    awayTeamScore: backendMatch.away_team_score,
  };
}
