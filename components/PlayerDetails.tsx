
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import { 
  ArrowLeft, BrainCircuit, Target, Zap, History, TrendingUp, Info, Timer, Dribbble, BicepsFlexed, MoveUp, Gamepad2, HeartPulse
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { TEAM_AVERAGES } from '../constants';

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

  const radarData = Object.entries(METRIC_LABELS).map(([key, info]) => ({
    subject: info.label.toUpperCase(),
    A: player.metrics[key][3].value,
    fullMark: 130,
  }));

  const handleGetAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analysiere die Leistungswerte von ${player.firstName} ${player.lastName} (Position: ${player.position}). Gesamt-Avg: ${player.average}%.`,
      });
      setAnalysis(response.text || "Analyse nicht verfügbar.");
    } catch (err) {
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
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-2xl">
            {player.firstName[0]}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{player.firstName} <span className="text-indigo-600">{player.lastName}</span></h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${player.position === 'Torwart' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'}`}>
                <Target className="w-4 h-4" /> Position: {player.position}
              </span>
              <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4" /> Score: {player.performance[3].value}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 w-full text-left">Fähigkeiten-Profil</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#1e293b', fontSize: 10, fontWeight: '800' }} />
                <Radar name={player.firstName} dataKey="A" stroke="#4f46e5" strokeWidth={3} fill="#6366f1" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Gesamtentwicklung</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={player.performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[80, 130]} />
                <Tooltip />
                <Line type="monotone" data={teamAverages} dataKey="value" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={5} dot={{ r: 6, fill: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900">Individuelle Leistungswerte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(METRIC_LABELS).map(([key, info]) => (
            <div key={key} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: `${info.color}15`, color: info.color }}>{info.icon}</div>
                  <span className="font-bold text-slate-800">{info.label}</span>
                </div>
                <span className="text-xl font-black" style={{ color: info.color }}>{player.metrics[key][3].value}%</span>
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={player.metrics[key]}>
                    <defs>
                      <linearGradient id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={info.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={info.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={info.color} strokeWidth={3} fill={`url(#color-${key})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white"><BrainCircuit className="w-8 h-8" /></div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-white mb-1">AI Performance Check</h3>
            <p className="text-indigo-200">KI-Analyse der individuellen Parameter.</p>
          </div>
          <button onClick={handleGetAnalysis} disabled={loadingAnalysis} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50">
            {loadingAnalysis ? 'Analyse...' : 'STARTEN'}
          </button>
        </div>
        {analysis && <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 text-indigo-50 italic">"{analysis}"</div>}
      </div>
    </div>
  );
};

export default PlayerDetails;
