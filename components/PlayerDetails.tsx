
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend, AreaChart, Area
} from 'recharts';
import { 
  ArrowLeft, Target, Zap, Timer, Dribbble, BicepsFlexed, MoveUp, Gamepad2, HeartPulse
} from 'lucide-react';
import { TEAM_BEST_VALUES, METRIC_CONFIG } from '../constants';

const METRIC_ICONS = {
  schnelligkeit: <Timer className="w-4 h-4" />,
  technik: <Dribbble className="w-4 h-4" />,
  kraft: <BicepsFlexed className="w-4 h-4" />,
  sprungkraft: <MoveUp className="w-4 h-4" />,
  koordination: <Gamepad2 className="w-4 h-4" />,
  ausdauer: <HeartPulse className="w-4 h-4" />,
};

const getPhysicalValue = (key, percentage) => {
  const config = METRIC_CONFIG[key];
  if (!config) return percentage;
  
  if (config.type === 'inverse') {
    const val = (config.baseline * 100) / percentage;
    return `${val.toFixed(2)} ${config.unit}`;
  } else {
    const val = (config.baseline * percentage) / 100;
    return `${val.toFixed(1)} ${config.unit}`;
  }
};

const CustomAreaTooltip = ({ active, payload, label, metricKey }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-base font-black text-indigo-600">{val}%</p>
        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
          {getPhysicalValue(metricKey, val)}
        </p>
      </div>
    );
  }
  return null;
};

const PlayerDetails = ({ player, teamAverages, onBack }) => {
  const radarData = Object.entries(METRIC_CONFIG).map(([key, config]) => ({
    subject: config.label.toUpperCase().substring(0, 10),
    Spieler: player.metrics[key][3].value,
    MannschaftsBestwert: TEAM_BEST_VALUES[key],
    fullMark: 130,
  }));

  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
          <ArrowLeft className="w-4 h-4" />
          ZURÜCK
        </button>
        <div className="px-3 py-1.5 rounded-full text-[8px] md:text-xs font-bold bg-slate-100 text-slate-500 uppercase tracking-widest">
          {player.isStaff ? 'STAB' : 'AKTIV'}
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="w-28 h-28 md:w-52 md:h-52 rounded-2xl md:rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-3xl md:text-5xl font-bold text-white shadow-xl overflow-hidden border-4 border-white ring-4 ring-slate-50">
            <img 
              src={player.image} 
              alt={player.firstName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-black text-white">${player.firstName[0]}</div>`;
                }
              }}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-2 leading-tight">
              {player.firstName} <span className="text-indigo-600 block md:inline">{player.lastName}</span>
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] md:text-sm font-black flex items-center gap-2 shadow-sm ${player.position === 'Torwart' ? 'bg-amber-50 text-amber-700' : player.position === 'Trainer' ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                <Target className="w-3 h-3 md:w-4 md:h-4" /> {player.position.toUpperCase()}
              </span>
              {!player.isStaff && (
                <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] md:text-sm font-black flex items-center gap-2 shadow-sm">
                  <Zap className="w-3 h-3 md:w-4 md:h-4" /> FORM: {player.performance[3].value}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {!player.isStaff && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-5 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-200 flex flex-col items-center">
              <h3 className="text-base md:text-xl font-black text-slate-900 mb-1 w-full text-left uppercase tracking-tight">Profil</h3>
              <p className="text-[9px] md:text-xs font-bold text-slate-400 mb-6 w-full text-left uppercase tracking-widest">Leistungsvergleich (%)</p>
              <div className="h-[280px] md:h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#1e293b', fontSize: 8, fontWeight: '900' }} />
                    <Radar name="Team-Best" dataKey="MannschaftsBestwert" stroke="#e2e8f0" fill="#f1f5f9" fillOpacity={0.6} />
                    <Radar name={player.firstName} dataKey="Spieler" stroke="#4f46e5" strokeWidth={3} fill="#6366f1" fillOpacity={0.5} />
                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-5 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex justify-between items-start mb-6 md:mb-10">
                <div>
                  <h3 className="text-base md:text-xl font-black text-slate-900 uppercase tracking-tight">Entwicklung (%)</h3>
                  <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Saison 2026</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-indigo-600" />
                     <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">Spieler</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-slate-200" />
                     <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase">Team</span>
                   </div>
                </div>
              </div>
              <div className="h-[250px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={player.performance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[80, 130]} />
                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" data={teamAverages} dataKey="value" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={5} dot={{ r: 5, fill: '#fff', stroke: '#6366f1', strokeWidth: 3 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Einzelwerte</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Object.entries(METRIC_CONFIG).map(([key, config]) => (
                <div key={key} className="bg-white p-5 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 md:p-3 rounded-xl md:rounded-2xl shadow-inner text-indigo-600 bg-indigo-50">{METRIC_ICONS[key]}</div>
                      <span className="font-black text-slate-800 uppercase text-xs md:text-sm tracking-tight">{config.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl md:text-2xl font-black block leading-none text-slate-900">{getPhysicalValue(key, player.metrics[key][3].value)}</span>
                      <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">{player.metrics[key][3].value}%</span>
                    </div>
                  </div>
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={player.metrics[key]} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomAreaTooltip active={undefined} payload={undefined} label={undefined} metricKey={key} />} />
                        <XAxis dataKey="quarter" hide />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill={`url(#color-${key})`} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerDetails;
