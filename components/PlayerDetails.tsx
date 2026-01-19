
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend, AreaChart, Area
} from 'recharts';
import { 
  ArrowLeft, BrainCircuit, Target, Zap, Timer, Dribbble, BicepsFlexed, MoveUp, Gamepad2, HeartPulse
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { TEAM_AVERAGES, TEAM_BEST_VALUES } from '../constants';

const METRIC_LABELS = {
  schnelligkeit: { label: 'Schnelligkeit', icon: <Timer className="w-4 h-4" />, color: '#6366f1' },
  technik: { label: 'Technik', icon: <Dribbble className="w-4 h-4" />, color: '#8b5cf6' },
  kraft: { label: 'Kraft', icon: <BicepsFlexed className="w-4 h-4" />, color: '#ec4899' },
  sprungkraft: { label: 'Sprungkraft', icon: <MoveUp className="w-4 h-4" />, color: '#f43f5e' },
  koordination: { label: 'Koordination', icon: <Gamepad2 className="w-4 h-4" />, color: '#f59e0b' },
  ausdauer: { label: 'Ausdauer', icon: <HeartPulse className="w-4 h-4" />, color: '#10b981' },
};

const PlayerDetails = ({ player, teamAverages, onBack }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Daten für das Radar-Chart inkl. Benchmark (Mannschafts-Bestwerte)
  const radarData = Object.entries(METRIC_LABELS).map(([key, info]) => ({
    subject: info.label.toUpperCase(),
    Spieler: player.metrics[key][3].value,
    MannschaftsBestwert: TEAM_BEST_VALUES[key],
    fullMark: 130,
  }));

  const handleGetAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analysiere die Leistungswerte von ${player.firstName} ${player.lastName} (Position: ${player.position}). Gesamt-Avg: ${player.average}%. Vergleiche ihn mit den Team-Bestwerten.`,
      });
      // Correctly access the .text property of GenerateContentResponse
      setAnalysis(response.text || "Analyse nicht verfügbar.");
    } catch (err) {
      console.error(err);
      setAnalysis("Fehler bei der KI-Analyse.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ZURÜCK ZUR ÜBERSICHT
        </button>
        <div className="flex items-center gap-2 text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">STATUS: AKTIV</div>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-5xl font-bold text-white shadow-2xl overflow-hidden border-4 border-white ring-8 ring-slate-50">
            <img 
              src={player.image} 
              alt={player.firstName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-6xl font-black text-white">${player.firstName[0]}</div>`;
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
              <span className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-sm border border-emerald-100">
                <Zap className="w-4 h-4" /> AKTUELLE FORM: {player.performance[3].value}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 flex flex-col items-center">
          <h3 className="text-xl font-black text-slate-900 mb-2 w-full text-left uppercase tracking-tight">Fähigkeiten-Profil</h3>
          <p className="text-xs font-bold text-slate-400 mb-8 w-full text-left uppercase tracking-widest">Vergleich zu den Bestwerten im Team</p>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#1e293b', fontSize: 10, fontWeight: '900' }} />
                <Radar name="Mannschafts-Bestwert" dataKey="MannschaftsBestwert" stroke="#e2e8f0" fill="#f1f5f9" fillOpacity={0.6} />
                <Radar name={player.firstName} dataKey="Spieler" stroke="#4f46e5" strokeWidth={4} fill="#6366f1" fillOpacity={0.5} />
                <Legend iconType="circle" />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Gesamtentwicklung</h3>
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
              <LineChart data={player.performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[80, 130]} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" data={teamAverages} dataKey="value" stroke="#e2e8f0" strokeWidth={3} strokeDasharray="8 8" dot={false} />
                {/* Fixed: Removed unsupported shadow prop from Line component */}
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={6} dot={{ r: 8, fill: '#fff', stroke: '#6366f1', strokeWidth: 4 }} activeDot={{ r: 10, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Individuelle Leistungswerte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(METRIC_LABELS).map(([key, info]) => (
            <div key={key} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-2xl shadow-inner" style={{ backgroundColor: `${info.color}15`, color: info.color }}>{info.icon}</div>
                  <span className="font-black text-slate-800 uppercase text-sm tracking-tight">{info.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black block leading-none" style={{ color: info.color }}>{player.metrics[key][3].value}%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                </div>
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  {/* Fixed: AreaChart and Area are now imported from recharts */}
                  <AreaChart data={player.metrics[key]}>
                    <defs>
                      <linearGradient id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={info.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={info.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={info.color} strokeWidth={4} fill={`url(#color-${key})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-12 rounded-[50px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 transform group-hover:scale-110 transition-transform"><BrainCircuit className="w-10 h-10" /></div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">AI Performance Check</h3>
            <p className="text-indigo-200/70 font-medium text-lg italic">"Erhalten Sie eine präzise, KI-gestützte Analyse der Stärken und Potenziale."</p>
          </div>
          <button 
            onClick={handleGetAnalysis} 
            disabled={loadingAnalysis} 
            className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
          >
            {loadingAnalysis ? 'Analyse läuft...' : 'ANALYSE STARTEN'}
          </button>
        </div>
        {analysis && (
          <div className="mt-12 p-8 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 text-indigo-50 leading-relaxed shadow-inner animate-in fade-in slide-in-from-bottom duration-700">
            <div className="flex gap-4 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-500/20"></div>
            </div>
            <p className="text-lg whitespace-pre-wrap italic">"{analysis}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDetails;
