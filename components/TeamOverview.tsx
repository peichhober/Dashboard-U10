
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Award, Activity, Users } from 'lucide-react';
import { Player, PerformanceData } from '../types';

interface TeamOverviewProps {
  players: Player[];
  teamAverages: PerformanceData[];
  onSelectPlayer: (id: string) => void;
}

const TeamOverview: React.FC<TeamOverviewProps> = ({ players, teamAverages, onSelectPlayer }) => {
  const topPerformers = [...players].sort((a, b) => b.average - a.average).slice(0, 5);
  const teamAvgValue = Math.round(players.reduce((a, b) => a + b.average, 0) / players.length);
  
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Team Durchschnitt" 
          value={`${teamAvgValue}%`} 
          subtitle="Gesamtperformance 2026"
          icon={<Activity className="w-6 h-6 text-indigo-600" />}
          color="bg-indigo-50"
        />
        <StatCard 
          title="Aktive Spieler" 
          value={players.length.toString()} 
          subtitle="Kadergröße"
          icon={<Users className="w-6 h-6 text-emerald-600" />}
          color="bg-emerald-50"
        />
        <StatCard 
          title="Top Performer" 
          value={topPerformers[0].firstName} 
          subtitle={`Avg: ${topPerformers[0].average}%`}
          icon={<Award className="w-6 h-6 text-amber-600" />}
          color="bg-amber-50"
        />
        <StatCard 
          title="Q4 Trend" 
          value="+8%" 
          subtitle="Verbesserung zum Vorjahr"
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Team Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Mannschafts-Entwicklung (Q1-Q4)</h3>
              <p className="text-sm text-slate-500">Durchschnittswerte über das Jahr 2026</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={teamAverages} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="quarter" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  domain={[80, 125]}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={5}
                  fillOpacity={1} 
                  fill="url(#colorTeam)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Comparison */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Spieler (Ranking)</h3>
          <div className="space-y-4">
            {topPerformers.map((player, idx) => (
              <div 
                key={player.id} 
                className="group flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100"
                onClick={() => onSelectPlayer(player.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-110`} style={{ backgroundColor: COLORS[idx] }}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{player.firstName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{player.lastName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600">{player.average}%</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest">
            Alle Daten anzeigen
          </button>
        </div>
      </div>

      {/* Grid of All Players */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 px-1">Der Kader</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {players.map(player => (
            <div 
              key={player.id}
              onClick={() => onSelectPlayer(player.id)}
              className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-2xl font-bold text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    {player.firstName[0]}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px]
                    ${player.trend === 'up' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {player.trend === 'up' ? '↑' : '↓'}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 truncate w-full">{player.firstName}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{player.position}</p>
                </div>
                <div className="pt-3 border-t border-slate-50 w-full">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Q4 Ergebnis</div>
                  <div className="text-xl font-black text-slate-900">{player.performance[3].value}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string }> = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex items-start gap-4 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 leading-none mb-2">{value}</h4>
      <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
    </div>
  </div>
);

export default TeamOverview;
