
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Menu, X
} from 'lucide-react';
import { PLAYERS, STAFF, TEAM_AVERAGES } from './constants';
import TeamOverview from './components/TeamOverview';
import PlayerDetails from './components/PlayerDetails';
import Sidebar from './components/Sidebar';

const App = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedMember = useMemo(() => {
    const all = [...PLAYERS, ...STAFF];
    return all.find(p => p.id === selectedPlayerId) || null;
  }, [selectedPlayerId]);

  const handleSelectPlayer = (id) => {
    setSelectedPlayerId(id);
    setIsSidebarOpen(false); // Sidebar auf Mobile nach Auswahl schließen
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        players={PLAYERS}
        staff={STAFF}
        selectedId={selectedPlayerId} 
        onSelect={handleSelectPlayer}
        isOpen={isSidebarOpen}
        toggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 overflow-y-auto h-screen relative">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-xl md:hidden"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
            <div className="overflow-hidden">
              <h1 className="text-sm md:text-xl font-black tracking-tight uppercase truncate">Leistungsdiagnostik</h1>
              <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] truncate">SCU U10 • 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight">Übersicht</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Zentrale</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-[10px] md:text-xs border border-slate-800 shadow-lg">
              SCU
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
          {!selectedMember ? (
            <TeamOverview players={PLAYERS} teamAverages={TEAM_AVERAGES} onSelectPlayer={handleSelectPlayer} />
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
