
import React, { useState } from 'react';
import { LayoutDashboard, ChevronLeft, ChevronRight, ShieldCheck, X } from 'lucide-react';

const PlayerAvatar = ({ player, size = "small" }) => {
  const [error, setError] = useState(false);
  const initials = `${player.firstName[0]}${player.lastName[0]}`;
  
  const sizeClasses = size === "small" ? "w-8 h-8 text-[10px]" : "w-10 h-10 text-xs";
  const bgGradient = player.isStaff 
    ? "from-slate-800 to-slate-900" 
    : "from-indigo-600 to-indigo-800";

  return (
    <div className={`${sizeClasses} rounded-full overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm flex items-center justify-center bg-gradient-to-br ${bgGradient}`}>
      {!error ? (
        <img 
          src={player.image} 
          alt={player.firstName} 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="font-bold text-white tracking-tighter">
          {initials}
        </span>
      )}
    </div>
  );
};

const Sidebar = ({ players, staff, selectedId, onSelect, isOpen, toggleOpen }) => {
  return (
    <aside 
      className={`fixed md:relative z-40 h-screen transition-all duration-300 ease-in-out border-r border-slate-200 bg-white flex flex-col shadow-2xl md:shadow-none
      ${isOpen 
        ? 'w-[85vw] sm:w-72 translate-x-0' 
        : '-translate-x-full md:translate-x-0 md:w-20 lg:w-72 overflow-hidden'}`}
    >
      <div className="p-5 flex items-center justify-between border-b border-slate-100 min-h-[64px] md:min-h-[72px]">
        <h2 className={`font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm ${!isOpen && 'md:hidden'}`}>
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Performance Hub
        </h2>
        <ShieldCheck className={`w-6 h-6 text-indigo-600 mx-auto ${isOpen ? 'hidden' : 'hidden md:block'}`} />
        
        <button 
          onClick={toggleOpen}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"
        >
          {isOpen ? <X className="w-5 h-5 md:hidden" /> : <ChevronRight className="w-5 h-5 hidden md:block lg:hidden" />}
          {isOpen && <ChevronLeft className="w-5 h-5 hidden lg:block" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <nav className="space-y-1">
          <button
            onClick={() => onSelect(null)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
              ${selectedId === null 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className={`w-5 h-5 ${selectedId === null ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
            <span className={`font-bold text-sm uppercase tracking-tight ${!isOpen && 'md:hidden'}`}>Übersicht</span>
          </button>
          
          <div className="pt-8 pb-2">
            <p className={`px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ${!isOpen && 'md:hidden'}`}>Kader (U10)</p>
            {!isOpen && <div className="w-8 mx-auto border-t border-slate-100 my-2 hidden md:block" />}
          </div>

          <div className="space-y-1">
            {players.map(player => (
              <button
                key={player.id}
                onClick={() => onSelect(player.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${selectedId === player.id 
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' 
                    : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <PlayerAvatar player={player} />
                <div className={`flex flex-col items-start overflow-hidden text-left ${!isOpen && 'md:hidden'}`}>
                  <span className="font-bold text-sm whitespace-nowrap truncate w-full tracking-tight">{player.firstName}</span>
                  <span className={`text-[9px] uppercase font-black tracking-wider ${selectedId === player.id ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {player.lastName}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-8 pb-2">
            <p className={`px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ${!isOpen && 'md:hidden'}`}>Trainer & Stab</p>
            {!isOpen && <div className="w-8 mx-auto border-t border-slate-100 my-2 hidden md:block" />}
          </div>

          <div className="space-y-1 pb-4">
            {staff.map(member => (
              <button
                key={member.id}
                onClick={() => onSelect(member.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${selectedId === member.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <PlayerAvatar player={member} />
                <div className={`flex flex-col items-start overflow-hidden text-left ${!isOpen && 'md:hidden'}`}>
                  <span className="font-bold text-sm whitespace-nowrap truncate w-full tracking-tight">{member.firstName}</span>
                  <span className={`text-[9px] uppercase font-black tracking-wider ${selectedId === member.id ? 'text-slate-400' : 'text-slate-400'}`}>
                    {member.lastName}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className={`p-4 border-t border-slate-100 bg-slate-50/50 ${!isOpen && 'md:hidden'}`}>
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-black text-slate-800 truncate uppercase tracking-tight">System Online</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase">v1.0.5-Mobile-Ready</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
