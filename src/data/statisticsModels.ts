// Backend response format (snake_case)
export interface BackendStatistics {
  avg_home_score: string | number;   
  avg_away_score: string | number;
  min_home_score: number;
  max_home_score: number;
  min_away_score: number;
  max_away_score: number;
}

// Frontend interface
export interface MatchStatistics {
  home: { avg: number; min: number; max: number };
  away: { avg: number; min: number; max: number };
}

// Round to 2 decimals helper
const round2 = (value: number) => Math.round(value * 100) / 100;

// Transform backend → frontend
export const transformStatistics = (backend: BackendStatistics): MatchStatistics => ({
  home: {
    avg: round2(typeof backend.avg_home_score === 'string' ? parseFloat(backend.avg_home_score) : backend.avg_home_score),
    min: backend.min_home_score,
    max: backend.max_home_score
  },
  away: {
    avg: round2(typeof backend.avg_away_score === 'string' ? parseFloat(backend.avg_away_score) : backend.avg_away_score),
    min: backend.min_away_score,
    max: backend.max_away_score
  }
});