
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  User, 
  BarChart3, 
  LayoutDashboard, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Info,
  BrainCircuit
} from 'lucide-react';
import { PLAYERS, TEAM_AVERAGES } from './constants';
import { Player } from './types';
import TeamOverview from './components/TeamOverview';
import PlayerDetails from './components/PlayerDetails';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const selectedPlayer = useMemo(() => 
    PLAYERS.find(p => p.id === selectedPlayerId) || null,
    [selectedPlayerId]
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar 
        players={PLAYERS} 
        selectedId={selectedPlayerId} 
        onSelect={setSelectedPlayerId}
        isOpen={isSidebarOpen}
        toggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Leistungsdiagnostik 2026</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Performance Tracking Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">FC Academy</p>
              <p className="text-xs text-slate-400">Team-Übersicht</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200 shadow-sm">
              FC
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-16">
          {!selectedPlayer ? (
            <TeamOverview players={PLAYERS} teamAverages={TEAM_AVERAGES} onSelectPlayer={setSelectedPlayerId} />
          ) : (
            <PlayerDetails 
              player={selectedPlayer} 
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
