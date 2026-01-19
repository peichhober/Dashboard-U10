
import React from 'react';
import { Users, User, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ players, selectedId, onSelect, isOpen, toggleOpen }) => {
  return (
    <aside 
      className={`fixed md:relative z-20 h-screen transition-all duration-300 ease-in-out border-r border-slate-200 bg-white flex flex-col shadow-xl md:shadow-none
      ${isOpen ? 'w-72 translate-x-0' : 'w-0 md:w-20 -translate-x-full md:translate-x-0 overflow-hidden'}`}
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-100 h-18">
        {isOpen ? (
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Mannschaft
          </h2>
        ) : (
          <Users className="w-6 h-6 text-indigo-600 mx-auto" />
        )}
        <button 
          onClick={toggleOpen}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hidden md:block"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-1">
          <button
            onClick={() => onSelect(null)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
              ${selectedId === null 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className={`w-5 h-5 ${selectedId === null ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
            {isOpen && <span className="font-medium">Dashboard Overview</span>}
          </button>
          
          <div className="pt-6 pb-2">
            {isOpen ? (
              <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Spieler</p>
            ) : (
              <hr className="border-slate-100" />
            )}
          </div>

          <div className="space-y-1">
            {players.map(player => (
              <button
                key={player.id}
                onClick={() => onSelect(player.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${selectedId === player.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
                  ${selectedId === player.id ? 'bg-indigo-400' : 'bg-slate-200 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                  {player.firstName[0]}{player.lastName[0]}
                </div>
                {isOpen && (
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-medium whitespace-nowrap truncate w-full">{player.firstName}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-tighter ${selectedId === player.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {player.lastName}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className={`flex items-center gap-3 ${isOpen ? 'p-2' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-500" />
          </div>
          {isOpen && (
            <div>
              <p className="text-sm font-bold text-slate-800">Coach Admin</p>
              <p className="text-xs text-slate-500">Premium Plan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
