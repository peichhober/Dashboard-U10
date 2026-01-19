
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Activity, Users, Award, TrendingUp, Trophy } from 'lucide-react';
import { METRIC_CONFIG } from '../constants';

const PlayerImage = ({ player, className }) => {
  const [error, setError] = useState(false);
  return (
    <div className={`${className} bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center`}>
      {!error ? (
        <img 
          src={player.image} 
          alt={player.firstName} 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="font-black text-white">{player.firstName[0]}{player.lastName[0]}</span>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-indigo-600">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const TeamOverview = ({ players, teamAverages, onSelectPlayer }) => {
  const topPerformersOverall = [...players].sort((a, b) => b.average - a.average).slice(0, 5);
  const teamAvgValue = Math.round(players.reduce((a, b) => a + b.average, 0) / players.length);

  const disciplineTops = Object.entries(METRIC_CONFIG).map(([key, config]) => {
    const bestPlayer = [...players].sort((a, b) => b.metrics[key][3].value - a.metrics[key][3].value)[0];
    return {
      key,
      label: config.label,
      player: bestPlayer,
      score: bestPlayer.metrics[key][3].value
    };
  });
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Team Durchschnitt" value={`${teamAvgValue}%`} subtitle="Gesamtperformance 2026" icon={<Activity className="w-6 h-6 text-indigo-600" />} color="bg-indigo-50" />
        <StatCard title="Aktive Spieler" value={players.length.toString()} subtitle="Kadergröße" icon={<Users className="w-6 h-6 text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="Top Performer" value={topPerformersOverall[0].firstName} subtitle={`Avg: ${topPerformersOverall[0].average}%`} icon={<Award className="w-6 h-6 text-amber-600" />} color="bg-amber-50" />
        <StatCard title="Q4 Trend" value="+8%" subtitle="Verbesserung zum Vorjahr" icon={<TrendingUp className="w-6 h-6 text-blue-600" />} color="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
          <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">Mannschafts-Entwicklung (Q1-Q4)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={teamAverages} margin={{ top: 10, right: 35, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[80, 125]} />
                <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorTeam)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Top Spieler (Ranking)</h3>
          <div className="space-y-4">
            {topPerformersOverall.map((player) => (
              <div key={player.id} className="group flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer" onClick={() => onSelectPlayer(player.id)}>
                <div className="flex items-center gap-3">
                  <PlayerImage player={player} className="w-10 h-10 rounded-xl overflow-hidden shadow-sm text-xs border border-slate-100" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{player.firstName}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{player.lastName}</p>
                  </div>
                </div>
                <div className="text-right"><p className="text-lg font-black text-indigo-600">{player.average}%</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 md:p-12 rounded-[48px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Trophy className="w-64 h-64 text-white" />
        </div>
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="bg-amber-400/20 p-3 rounded-2xl">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Top Performer pro Disziplin</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Saisonbestleistungen des Kaders</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 relative z-10">
          {disciplineTops.map((top) => (
            <div key={top.key} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all hover:scale-[1.05] cursor-pointer group" onClick={() => onSelectPlayer(top.player.id)}>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-4">{top.label}</p>
              <div className="flex items-center gap-3 mb-4">
                <PlayerImage player={top.player} className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 text-[10px]" />
                <div className="overflow-hidden">
                  <p className="text-white font-bold text-sm leading-tight truncate">{top.player.firstName}</p>
                  <p className="text-[9px] text-white/40 font-black truncate">{top.player.lastName}</p>
                </div>
              </div>
              <p className="text-3xl font-black text-white group-hover:text-amber-300 transition-colors">{top.score}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {players.map(player => (
          <div key={player.id} onClick={() => onSelectPlayer(player.id)} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-4">
              <PlayerImage player={player} className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 group-hover:border-indigo-300 transition-all shadow-inner text-2xl" />
              <div>
                <h4 className="font-black text-slate-900 leading-tight uppercase text-sm tracking-tight">{player.firstName}</h4>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{player.position}</p>
              </div>
              <div className="px-4 py-1 bg-slate-900 rounded-full text-xs font-black text-white">{player.performance[3].value}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex items-start gap-4 transition-transform hover:scale-[1.02]">
    <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 leading-none mb-1">{value}</h4>
      <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
    </div>
  </div>
);

export default TeamOverview;
