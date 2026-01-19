
import React, { useState, useMemo } from 'react';
import { 
  BarChart3
} from 'lucide-react';
import { PLAYERS, STAFF, TEAM_AVERAGES } from './constants';
import TeamOverview from './components/TeamOverview';
import PlayerDetails from './components/PlayerDetails';
import Sidebar from './components/Sidebar';

const App = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const selectedMember = useMemo(() => {
    const all = [...PLAYERS, ...STAFF];
    return all.find(p => p.id === selectedPlayerId) || null;
  }, [selectedPlayerId]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar 
        players={PLAYERS}
        staff={STAFF}
        selectedId={selectedPlayerId} 
        onSelect={setSelectedPlayerId}
        isOpen={isSidebarOpen}
        toggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">Leistungsdiagnostik 2026</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">SCU Unterpremstätten U10</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Team Overview</p>
              <p className="text-[10px] text-slate-400 font-bold">ZENTRALE STEUERUNG</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs border border-slate-800 shadow-lg">
              SCU
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-16">
          {!selectedMember ? (
            <TeamOverview players={PLAYERS} teamAverages={TEAM_AVERAGES} onSelectPlayer={setSelectedPlayerId} />
          ) : (
            <PlayerDetails 
              player={selectedMember} 
              teamAverages={TEAM_AVERAGES} 
              onBack={() => setSelectedPlayerId(null)} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
