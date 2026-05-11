import { useOrganiZen } from "../context/OrganiZenContext";
import { cn } from "../lib/utils";
import { useState } from "react";

export function Header() {
  const { bubbleColor, mochiFaces } = useOrganiZen();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-xl border-b border-indigo-100/20 shadow-[0_10px_40px_-15px_rgba(165,180,252,0.15)] rounded-b-[32px] w-full">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[600px] mx-auto">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-full border border-white/60 flex items-center justify-center overflow-hidden shadow-sm p-0.5 transition-all duration-500", bubbleColor)}>
            <img 
              src={mochiFaces.happy2} 
              alt="Mochi" 
              className="w-full h-full object-cover rounded-full transition-opacity duration-300"
            />
          </div>
          <h1 className="text-xl font-semibold text-primary font-['Lexend'] tracking-tight">OrganiZen</h1>
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-primary/60 hover:opacity-80 transition-opacity active:scale-95 transition-transform duration-200"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-surface-variant overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="py-2">
                  <button className="w-full text-left px-4 py-3 text-body-md text-on-surface hover:bg-surface-container transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Perfil
                  </button>
                  <button className="w-full text-left px-4 py-3 text-body-md text-on-surface hover:bg-surface-container transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">sync</span>
                    Sincronizar Datos
                  </button>
                  <div className="h-px bg-surface-variant my-1"></div>
                  <button className="w-full text-left px-4 py-3 text-body-md text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
