
export interface PerformanceData {
  quarter: string;
  value: number;
}

export type MetricKey = 'schnelligkeit' | 'technik' | 'kraft' | 'sprungkraft' | 'koordination' | 'ausdauer';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: 'Mittelfeld' | 'Torwart';
  performance: PerformanceData[]; // Global average trend
  metrics: Record<MetricKey, PerformanceData[]>; // Individual metric trends
  average: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TeamStats {
  averageQ1: number;
  averageQ2: number;
  averageQ3: number;
  averageQ4: number;
  topPlayer: string;
  mostImproved: string;
}
