
import React, { useState } from 'react';
import { Users, User, LayoutDashboard, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

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
      className={`fixed md:relative z-20 h-screen transition-all duration-300 ease-in-out border-r border-slate-200 bg-white flex flex-col shadow-xl md:shadow-none
      ${isOpen ? 'w-72 translate-x-0' : 'w-0 md:w-20 -translate-x-full md:translate-x-0 overflow-hidden'}`}
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-100 h-18">
        {isOpen ? (
          <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Performance Hub
          </h2>
        ) : (
          <ShieldCheck className="w-6 h-6 text-indigo-600 mx-auto" />
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
            {isOpen && <span className="font-bold text-sm uppercase tracking-tight">Übersicht</span>}
          </button>
          
          <div className="pt-8 pb-2">
            {isOpen ? (
              <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kader (U10)</p>
            ) : (
              <div className="w-8 mx-auto border-t border-slate-100 my-2" />
            )}
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
                {isOpen && (
                  <div className="flex flex-col items-start overflow-hidden text-left">
                    <span className="font-bold text-sm whitespace-nowrap truncate w-full tracking-tight">{player.firstName}</span>
                    <span className={`text-[9px] uppercase font-black tracking-wider ${selectedId === player.id ? 'text-indigo-400' : 'text-slate-400'}`}>
                      {player.lastName}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="pt-8 pb-2">
            {isOpen ? (
              <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trainer & Stab</p>
            ) : (
              <div className="w-8 mx-auto border-t border-slate-100 my-2" />
            )}
          </div>

          <div className="space-y-1">
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
                {isOpen && (
                  <div className="flex flex-col items-start overflow-hidden text-left">
                    <span className="font-bold text-sm whitespace-nowrap truncate w-full tracking-tight">{member.firstName}</span>
                    <span className={`text-[9px] uppercase font-black tracking-wider ${selectedId === member.id ? 'text-slate-400' : 'text-slate-400'}`}>
                      {member.lastName}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className={`flex items-center gap-3 ${isOpen ? 'p-2' : 'justify-center'}`}>
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-slate-800 truncate uppercase tracking-tight">Admin System</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">v1.0.4-Excellence</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
