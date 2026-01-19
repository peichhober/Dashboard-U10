
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
    // Weniger Zeit = Bessere Performance: Zeit = Baseline / (Prozent/100)
    const val = (config.baseline * 100) / percentage;
    return `${val.toFixed(2)} ${config.unit}`;
  } else {
    // Direkt: Wert = Baseline * (Prozent/100)
    const val = (config.baseline * percentage) / 100;
    return `${val.toFixed(1)} ${config.unit}`;
  }
};

const CustomAreaTooltip = ({ active, payload, label, metricKey }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-indigo-600">{val}% Performance</p>
        <p className="text-xs font-bold text-slate-500 uppercase mt-1">
          Realwert: <span className="text-slate-900 font-black">{getPhysicalValue(metricKey, val)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const PlayerDetails = ({ player, teamAverages, onBack }) => {
  const radarData = Object.entries(METRIC_CONFIG).map(([key, config]) => ({
    subject: config.label.toUpperCase(),
    Spieler: player.metrics[key][3].value,
    MannschaftsBestwert: TEAM_BEST_VALUES[key],
    fullMark: 130,
  }));

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ZURÜCK ZUR ÜBERSICHT
        </button>
        <div className="flex items-center gap-2 text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full uppercase tracking-widest">
          Status: {player.isStaff ? 'TRAINERSTAB' : 'AKTIV'}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-5xl font-bold text-white shadow-2xl overflow-hidden border-4 border-white ring-8 ring-slate-50">
            <img 
              src={player.image} 
              alt={player.firstName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-6xl font-black text-white">${player.firstName[0]}</div>`;
                }
              }}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-2 leading-tight">
              {player.firstName} <span className="text-indigo-600">{player.lastName}</span>
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className={`px-6 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-sm ${player.position === 'Torwart' ? 'bg-amber-50 text-amber-700' : player.position === 'Trainer' ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                <Target className="w-4 h-4" /> POSITION: {player.position.toUpperCase()}
              </span>
              {!player.isStaff && (
                <span className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-sm border border-emerald-100">
                  <Zap className="w-4 h-4" /> AKTUELLE FORM: {player.performance[3].value}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {!player.isStaff && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 flex flex-col items-center">
              <h3 className="text-xl font-black text-slate-900 mb-2 w-full text-left uppercase tracking-tight">Fähigkeiten-Profil</h3>
              <p className="text-xs font-bold text-slate-400 mb-8 w-full text-left uppercase tracking-widest">Vergleich (%) zum Mannschafts-Bestwert</p>
              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#1e293b', fontSize: 10, fontWeight: '900' }} />
                    <Radar name="Team-Best" dataKey="MannschaftsBestwert" stroke="#e2e8f0" fill="#f1f5f9" fillOpacity={0.6} />
                    <Radar name={player.firstName} dataKey="Spieler" stroke="#4f46e5" strokeWidth={4} fill="#6366f1" fillOpacity={0.5} />
                    <Legend iconType="circle" />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Gesamtentwicklung (%)</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saisonverlauf 2026</p>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm shadow-indigo-200"></div>
                     <span className="text-[10px] font-black text-slate-500 uppercase">Spieler</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase">Team-Schnitt</span>
                   </div>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={player.performance} margin={{ top: 10, right: 35, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[80, 130]} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" data={teamAverages} dataKey="value" stroke="#e2e8f0" strokeWidth={3} strokeDasharray="8 8" dot={false} />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={6} dot={{ r: 8, fill: '#fff', stroke: '#6366f1', strokeWidth: 4 }} activeDot={{ r: 10, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Individuelle Leistungswerte</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(METRIC_CONFIG).map(([key, config]) => (
                <div key={key} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-3 rounded-2xl shadow-inner text-indigo-600 bg-indigo-50 group-hover:scale-110 transition-transform">{METRIC_ICONS[key]}</div>
                      <span className="font-black text-slate-800 uppercase text-sm tracking-tight">{config.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black block leading-none text-slate-900">{getPhysicalValue(key, player.metrics[key][3].value)}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{player.metrics[key][3].value}% Score</span>
                    </div>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={player.metrics[key]} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomAreaTooltip active={undefined} payload={undefined} label={undefined} metricKey={key} />} />
                        <XAxis dataKey="quarter" hide />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fill={`url(#color-${key})`} />
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
