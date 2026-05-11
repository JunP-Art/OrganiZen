import { useOrganiZen } from '../context/OrganiZenContext';
import { cn } from '@/src/lib/utils';
import { useEffect } from 'react';

export function ZenScreen() {
  const { 
    soundsEnabled, setSoundsEnabled, 
    hapticEnabled, setHapticEnabled, 
    notificationsEnabled, setNotificationsEnabled,
    theme, setTheme,
    bubbleColor, setBubbleColor,
    setIsChatOpen,
    mochiFaces
  } = useOrganiZen();

  // Request haptic feedback whenever toggled on
  const handleToggleHaptic = () => {
    const newState = !hapticEnabled;
    setHapticEnabled(newState);
    if (newState && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="pt-8 px-6 max-w-[600px] mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-32">
      {/* Mascot Focus Section */}
      <section className="flex flex-col items-center text-center space-y-4 py-6">
        <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-500 active:scale-95">
          <div className="absolute inset-0 bg-primary-container/20 blur-3xl rounded-full scale-125"></div>
          <div className="relative w-48 h-48 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(165,180,252,0.2)] overflow-hidden">
            <img 
              src={mochiFaces.happy1} 
              alt="Mochi happy" 
              className="w-40 h-40 object-contain"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Mochi está feliz</h2>
          <p className="text-body-md text-on-surface-variant max-w-[300px] mt-1">Acaricia a Mochi para liberar un poco de estrés</p>
        </div>
        <button onClick={() => setIsChatOpen(true)} className="mt-6 flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full font-title-sm hover:shadow-lg transition-all duration-300 active:scale-90 font-medium">
          <span className="material-symbols-outlined">forum</span>
          Hablar con Mochi
        </button>
      </section>

      {/* Theme Selection */}
      <section className="space-y-4">
        <h3 className="font-title-sm text-title-sm px-1 font-semibold">Personaliza tu espacio</h3>
        <div className="flex gap-6 overflow-x-auto pb-4 px-1 snap-x no-scrollbar">
          
          {/* Theme Card 0 */}
          <div 
            onClick={() => setTheme('Predeterminado')}
            className="flex-shrink-0 w-44 snap-start group cursor-pointer"
          >
            <div className={cn(
              "h-32 w-full rounded-3xl p-2 mb-2 transition-all duration-300 group-hover:shadow-md border-2",
              theme === 'Predeterminado' ? "bg-primary-container/30 border-primary" : "bg-transparent border-transparent"
            )}>
              <div className="h-full w-full rounded-2xl bg-surface flex flex-col p-2 space-y-1 shadow-sm border border-slate-200">
                <div className="h-2 w-2/3 bg-primary-container rounded"></div>
                <div className="h-12 w-full bg-white rounded-xl border border-slate-100"></div>
                <div className="flex gap-1">
                  <div className="h-4 w-4 bg-primary-fixed rounded-full"></div>
                </div>
              </div>
            </div>
            <span className={cn(
              "font-label-caps text-label-caps text-center block transition-colors",
              theme === 'Predeterminado' ? "text-primary" : "text-on-surface-variant"
            )}>Predeterminado</span>
          </div>
          
          {/* Theme Card 1 */}
          <div 
            onClick={() => setTheme('Calma Pastel')}
            className="flex-shrink-0 w-44 snap-start group cursor-pointer"
          >
            <div className={cn(
              "h-32 w-full rounded-3xl p-2 mb-2 transition-all duration-300 group-hover:shadow-md border-2",
              theme === 'Calma Pastel' ? "bg-primary-container/30 border-primary" : "bg-transparent border-transparent"
            )}>
              <div className="h-full w-full rounded-2xl bg-white flex flex-col p-2 space-y-1 shadow-sm border border-slate-100">
                <div className="h-2 w-2/3 bg-primary-container rounded"></div>
                <div className="h-12 w-full bg-primary-fixed rounded-xl border border-primary/5"></div>
                <div className="flex gap-1">
                  <div className="h-4 w-4 bg-primary-fixed-dim rounded-full"></div>
                  <div className="h-4 w-4 bg-secondary-fixed-dim rounded-full"></div>
                </div>
              </div>
            </div>
            <span className={cn(
              "font-label-caps text-label-caps text-center block transition-colors",
              theme === 'Calma Pastel' ? "text-primary" : "text-on-surface-variant"
            )}>Calma Pastel</span>
          </div>

          {/* Theme Card 2 */}
          <div 
            onClick={() => setTheme('Noche Estrellada')}
            className="flex-shrink-0 w-44 snap-start group cursor-pointer"
          >
            <div className={cn(
              "h-32 w-full rounded-3xl p-2 mb-2 transition-all duration-300 group-hover:shadow-md border-2",
              theme === 'Noche Estrellada' ? "bg-slate-800 border-indigo-400" : "bg-slate-900 border-transparent"
            )}>
              <div className="h-full w-full rounded-2xl bg-slate-800 border border-slate-700 flex flex-col p-2 space-y-1 shadow-sm">
                <div className="h-2 w-2/3 bg-indigo-500/30 rounded"></div>
                <div className="h-12 w-full bg-indigo-900/40 rounded-xl border border-indigo-500/20"></div>
                <div className="flex gap-1">
                  <div className="h-4 w-4 bg-indigo-500/40 rounded-full"></div>
                  <div className="h-4 w-4 bg-purple-500/40 rounded-full"></div>
                </div>
              </div>
            </div>
            <span className={cn(
              "font-label-caps text-label-caps text-center block transition-colors",
              theme === 'Noche Estrellada' ? "text-indigo-600" : "text-on-surface-variant"
            )}>Noche Estrellada</span>
          </div>

          {/* Theme Card 3 */}
          <div 
            onClick={() => setTheme('Alto Contraste')}
            className="flex-shrink-0 w-44 snap-start group cursor-pointer"
          >
            <div className={cn(
              "h-32 w-full rounded-3xl p-2 mb-2 transition-all duration-300 group-hover:shadow-md border-2",
              theme === 'Alto Contraste' ? "bg-black border-yellow-400" : "bg-black border-transparent"
            )}>
              <div className="h-full w-full rounded-2xl bg-black border border-white flex flex-col p-2 space-y-1 shadow-sm">
                <div className="h-2 w-2/3 bg-white/40 rounded"></div>
                <div className="h-12 w-full bg-white/10 rounded-xl border border-white/50"></div>
                <div className="flex gap-1">
                  <div className="h-4 w-4 bg-white/60 rounded-full"></div>
                </div>
              </div>
            </div>
            <span className={cn(
              "font-label-caps text-label-caps text-center block transition-colors",
              theme === 'Alto Contraste' ? "text-yellow-600" : "text-on-surface-variant"
            )}>Alto Contraste</span>
          </div>

        </div>
      </section>

      {/* Sensory Settings */}
      <section className="space-y-4 bg-surface-container-low p-6 rounded-[32px]">
        <h3 className="font-title-sm text-title-sm font-semibold">Ajustes Sensoriales</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <span className="material-symbols-outlined text-primary">volume_up</span>
              <span className="font-body-md text-on-surface">Sonidos suaves</span>
            </div>
            <div 
              onClick={() => setSoundsEnabled(!soundsEnabled)}
              className={cn("w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300", soundsEnabled ? "bg-primary-container" : "bg-surface-container-highest")}
            >
              <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300", soundsEnabled ? "translate-x-7" : "translate-x-1")}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <span className="material-symbols-outlined text-primary">vibration</span>
              <span className="font-body-md text-on-surface">Vibración háptica</span>
            </div>
            <div 
              onClick={handleToggleHaptic}
              className={cn("w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300", hapticEnabled ? "bg-primary-container" : "bg-surface-container-highest")}
            >
              <div className={cn("absolute top-1 w-4 h-4 rounded-full transition-transform duration-300", hapticEnabled ? "translate-x-7 bg-white" : "translate-x-1 bg-outline-variant")}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <span className="material-symbols-outlined text-primary">notifications_paused</span>
              <span className="font-body-md text-on-surface">Notificaciones gentiles</span>
            </div>
            <div 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={cn("w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300", notificationsEnabled ? "bg-primary-container" : "bg-surface-container-highest")}
            >
               <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300", notificationsEnabled ? "translate-x-7" : "translate-x-1")}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mascot Customization Colors */}
      <section className="space-y-4">
        <h3 className="font-title-sm text-title-sm font-semibold">Burbuja de Mochi</h3>
        <div className="flex justify-between items-center bg-surface-container-low p-6 rounded-[32px] neomorphic-recessed">
          <div className="flex gap-4">
            <button onClick={() => setBubbleColor('bg-indigo-100')} className={cn("w-8 h-8 rounded-full bg-indigo-200 border-2 transition-all", bubbleColor === 'bg-indigo-100' ? "border-indigo-400 ring-offset-2 ring-2 ring-transparent" : "border-transparent hover:ring-2 ring-indigo-200 ring-offset-2")}>
               {bubbleColor === 'bg-indigo-100' && <div className="absolute inset-1 rounded-full border border-white/40"></div>}
            </button>
            <button onClick={() => setBubbleColor('bg-rose-100')} className={cn("w-8 h-8 rounded-full bg-rose-100 border-2 transition-all", bubbleColor === 'bg-rose-100' ? "border-rose-400 ring-offset-2 ring-2 ring-transparent" : "border-transparent hover:ring-2 ring-rose-200 ring-offset-2")}></button>
            <button onClick={() => setBubbleColor('bg-emerald-100')} className={cn("w-8 h-8 rounded-full bg-emerald-100 border-2 transition-all", bubbleColor === 'bg-emerald-100' ? "border-emerald-400 ring-offset-2 ring-2 ring-transparent" : "border-transparent hover:ring-2 ring-emerald-200 ring-offset-2")}></button>
            <button onClick={() => setBubbleColor('bg-amber-100')} className={cn("w-8 h-8 rounded-full bg-amber-100 border-2 transition-all", bubbleColor === 'bg-amber-100' ? "border-amber-400 ring-offset-2 ring-2 ring-transparent" : "border-transparent hover:ring-2 ring-amber-200 ring-offset-2")}></button>
            <button onClick={() => setBubbleColor('bg-purple-100')} className={cn("w-8 h-8 rounded-full bg-purple-200 border-2 transition-all", bubbleColor === 'bg-purple-100' ? "border-purple-400 ring-offset-2 ring-2 ring-transparent" : "border-transparent hover:ring-2 ring-purple-200 ring-offset-2")}></button>
          </div>
          <span className="font-label-caps text-on-surface-variant tracking-wider">5 colores</span>
        </div>
      </section>

      {/* Logout */}
      <section className="pt-4">
        <button 
          onClick={async () => {
             const { logout } = await import('../services/firebase');
             logout();
          }}
          className="w-full bg-surface-container-low text-error px-6 py-4 rounded-[32px] font-label-large hover:bg-error/10 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">logout</span>
          Cerrar Sesión
        </button>
      </section>

      {/* Decorative Focus Image */}
      <section className="pt-4">
        <div className="w-full h-48 rounded-[32px] overflow-hidden relative group shadow-lg">
          <img 
            src={mochiFaces.happy2} 
            alt="Zen Background" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <span className="text-white font-title-sm text-[18px] tracking-wide relative z-10">Espacio de Calma</span>
            <div className="absolute -left-2 -bottom-1 w-[120px] h-6 bg-white/10 blur-md rounded-full"></div>
            <span className="absolute bottom-5 left-1 text-[24px] opacity-20 font-bold tracking-widest text-white z-0">ORGANIZEN</span>
          </div>
        </div>
      </section>
    </div>
  );
}
