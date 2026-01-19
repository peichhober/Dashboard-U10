
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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard title="Team Ø" value={`${teamAvgValue}%`} icon={<Activity className="w-5 h-5 text-indigo-600" />} color="bg-indigo-50" />
        <StatCard title="Kader" value={players.length.toString()} icon={<Users className="w-5 h-5 text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="Bester" value={topPerformersOverall[0].firstName} icon={<Award className="w-5 h-5 text-amber-600" />} color="bg-amber-50" />
        <StatCard title="Trend" value="+8%" icon={<TrendingUp className="w-5 h-5 text-blue-600" />} color="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-5 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
          <h3 className="text-base md:text-xl font-black text-slate-800 mb-6 md:mb-8 uppercase tracking-tight">Team-Entwicklung</h3>
          <div className="h-[250px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={teamAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[80, 125]} />
                <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTeam)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-200">
          <h3 className="text-base md:text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Ranking (Top 5)</h3>
          <div className="space-y-3 md:space-y-4">
            {topPerformersOverall.map((player) => (
              <div key={player.id} className="group flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer" onClick={() => onSelectPlayer(player.id)}>
                <div className="flex items-center gap-3">
                  <PlayerImage player={player} className="w-9 h-9 rounded-xl overflow-hidden shadow-sm text-[10px] border border-slate-100" />
                  <div>
                    <p className="font-bold text-slate-800 text-xs md:text-sm leading-none mb-1">{player.firstName}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{player.lastName}</p>
                  </div>
                </div>
                <p className="text-base font-black text-indigo-600">{player.average}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-6 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Trophy className="w-32 h-32 md:w-64 md:h-64 text-white" />
        </div>
        <div className="flex items-center gap-3 md:gap-4 mb-8 relative z-10">
          <div className="bg-amber-400/20 p-2 md:p-3 rounded-xl md:rounded-2xl">
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">Top Performer</h3>
            <p className="text-slate-400 text-[9px] md:text-xs font-bold uppercase tracking-widest">Disziplin-Bestleistungen</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-6 relative z-10">
          {disciplineTops.map((top) => (
            <div key={top.key} className="bg-white/5 border border-white/10 p-4 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all cursor-pointer group" onClick={() => onSelectPlayer(top.player.id)}>
              <p className="text-[8px] md:text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2 truncate">{top.label}</p>
              <div className="flex items-center gap-2 mb-3">
                <PlayerImage player={top.player} className="w-7 h-7 md:w-9 md:h-9 rounded-lg overflow-hidden border border-white/20 text-[8px]" />
                <p className="text-white font-bold text-xs leading-tight truncate">{top.player.firstName}</p>
              </div>
              <p className="text-xl md:text-3xl font-black text-white group-hover:text-amber-300 transition-colors">{top.score}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {players.map(player => (
          <div key={player.id} onClick={() => onSelectPlayer(player.id)} className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-3">
              <PlayerImage player={player} className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden border border-slate-100 group-hover:border-indigo-300 transition-all shadow-inner text-xl" />
              <div>
                <h4 className="font-black text-slate-900 leading-tight uppercase text-xs md:text-sm tracking-tight truncate w-full px-2">{player.firstName}</h4>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{player.position}</p>
              </div>
              <div className="px-3 py-1 bg-slate-900 rounded-full text-[10px] font-black text-white">{player.performance[3].value}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[32px] shadow-sm border border-slate-200 flex items-center gap-3 md:gap-4 transition-transform hover:scale-[1.02]">
    <div className={`p-2 md:p-4 rounded-xl md:rounded-2xl ${color}`}>{icon}</div>
    <div className="min-w-0">
      <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">{title}</p>
      <h4 className="text-sm md:text-2xl font-black text-slate-900 leading-none truncate">{value}</h4>
    </div>
  </div>
);

export default TeamOverview;
