
import { Player, PerformanceData } from './types';

export const RAW_DATA = [
  { first: 'Ajdin', last: 'CVIKO', q1: 100, q2: 115, q3: 86, q4: 119 },
  { first: 'Armin', last: 'PATE', q1: 100, q2: 108, q3: 101, q4: 110 },
  { first: 'Ben', last: 'HASANI', q1: 100, q2: 121, q3: 85, q4: 116 },
  { first: 'Boris', last: 'EICHHOBER', q1: 100, q2: 109, q3: 94, q4: 113 },
  { first: 'Denial', last: 'JUSIC', q1: 100, q2: 109, q3: 94, q4: 113 },
  { first: 'Hannah', last: 'ZACHENEGGER', q1: 100, q2: 117, q3: 85, q4: 121 },
  { first: 'Jonas', last: 'BECKEL', q1: 100, q2: 117, q3: 86, q4: 114 },
  { first: 'Lionel', last: 'TEHOVNIK', q1: 100, q2: 111, q3: 100, q4: 107 },
  { first: 'Maximilian', last: 'ZACHENEGGER', q1: 100, q2: 107, q3: 102, q4: 108 },
  { first: 'Mihajlo', last: 'KARUPOVIC', q1: 100, q2: 95, q3: 98, q4: 115 },
  { first: 'Pavel', last: 'EICHHOBER', q1: 100, q2: 109, q3: 94, q4: 113 },
  { first: 'Robin', last: 'MAIER', q1: 100, q2: 109, q3: 97, q4: 108 },
];

const METRIC_NAMES = ['schnelligkeit', 'technik', 'kraft', 'sprungkraft', 'koordination', 'ausdauer'];

// Fix: Explicitly type PLAYERS as Player[] to resolve type mismatch errors in App.tsx
export const PLAYERS: Player[] = RAW_DATA.map((p, idx) => {
  const globalPerf: PerformanceData[] = [
    { quarter: 'Q1', value: p.q1 },
    { quarter: 'Q2', value: p.q2 },
    { quarter: 'Q3', value: p.q3 },
    { quarter: 'Q4', value: p.q4 },
  ];

  const metrics: { [key: string]: PerformanceData[] } = {};
  METRIC_NAMES.forEach((m, mIdx) => {
    metrics[m] = globalPerf.map(gp => ({
      quarter: gp.quarter,
      value: Math.round(gp.value + (Math.sin(idx + mIdx) * 5))
    }));
  });

  const avg = globalPerf.reduce((acc, curr) => acc + curr.value, 0) / 4;
  const trend: 'up' | 'down' | 'stable' = p.q4 > p.q3 ? 'up' : p.q4 < p.q3 ? 'down' : 'stable';

  return {
    id: `player-${idx}`,
    firstName: p.first,
    lastName: p.last,
    position: (p.first === 'Robin' && p.last === 'MAIER') ? 'Torwart' : 'Mittelfeld',
    performance: globalPerf,
    metrics,
    average: Math.round(avg * 10) / 10,
    trend
  };
});

// Fix: Explicitly type TEAM_AVERAGES as PerformanceData[] to match component requirements
export const TEAM_AVERAGES: PerformanceData[] = [
  { quarter: 'Q1', value: Math.round(PLAYERS.reduce((a, b) => a + b.performance[0].value, 0) / PLAYERS.length) },
  { quarter: 'Q2', value: Math.round(PLAYERS.reduce((a, b) => a + b.performance[1].value, 0) / PLAYERS.length) },
  { quarter: 'Q3', value: Math.round(PLAYERS.reduce((a, b) => a + b.performance[2].value, 0) / PLAYERS.length) },
  { quarter: 'Q4', value: Math.round(PLAYERS.reduce((a, b) => a + b.performance[3].value, 0) / PLAYERS.length) },
];
