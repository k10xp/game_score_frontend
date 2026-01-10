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
