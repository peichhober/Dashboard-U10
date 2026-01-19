
// Shared type definitions for the performance tracking dashboard

export interface PerformanceData {
  quarter: string;
  value: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  performance: PerformanceData[];
  metrics: {
    [key: string]: PerformanceData[];
  };
  average: number;
  trend: 'up' | 'down' | 'stable';
}
