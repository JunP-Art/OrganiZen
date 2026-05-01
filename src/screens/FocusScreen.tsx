import { useState, useEffect } from 'react';
import { useOrganiZen } from '../context/OrganiZenContext';
import { divideTaskAI } from '../services/geminiService';
import { cn } from '@/src/lib/utils';

interface FocusScreenProps {
  onStart: () => void;
}

export function FocusScreen({ onStart }: FocusScreenProps) {
  const { tasks, focusedTaskId, replaceSubtasks, timerTotalTime, setTimerTotalTime, setTimerTimeLeft, setIsTimerRunning, setIsChatOpen, bubbleColor, toggleSubtask, mochiFaceUrl } = useOrganiZen();

  const [isDividing, setIsDividing] = useState(false);

  const task = tasks.find(t => t.id === focusedTaskId && !t.completed) || tasks.find(t => !t.completed);
  
  const [localMinutes, setLocalMinutes] = useState(task?.timeEstimate || 25);

  useEffect(() => {
    if (task) setLocalMinutes(task.timeEstimate || 25);
  }, [task?.id]);

  const phrases = [
    "Hola! ¿Qué vamos a lograr hoy?",
    "Recuerda: un paso a la vez es suficiente.",
    "Está bien si necesitas un descanso.",
    "Respira profundo, tú puedes con esto.",
    "El progreso pequeño sigue siendo progreso."
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIdx(prev => (prev + 1) % phrases.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleEmpezar = () => {
    if (!task) return;
    setTimerTotalTime(localMinutes * 60);
    setTimerTimeLeft(localMinutes * 60);
    setIsTimerRunning(true);
    onStart();
  };

  const handleDivideTask = async () => {
    if (task && !isDividing) {
      if (task.subtasks && task.subtasks.length > 0) return; // Prevent overwriting if already divided
      setIsDividing(true);
      try {
        const subtasks = await divideTaskAI(task.title);
        replaceSubtasks(task.id, subtasks);
      } catch(e) {
        console.error(e);
      } finally {
        setIsDividing(false);
      }
    }
  };

  const currentPhrase = !task 
    ? "¡No tienes tareas pendientes! Tómate un respiro." 
    : phrases[phraseIdx];

  return (
    <div className="pt-8 pb-32 px-6 max-w-[600px] mx-auto space-y-md animate-in fade-in zoom-in-95 duration-500 relative">
      {/* Background Elements for Mood */}
      <div className="fixed top-1/4 -left-20 w-80 h-80 bg-indigo-200/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Mascot Section */}
      <section className="flex flex-col items-center space-y-sm">
        <div className="relative w-48 h-48 flex items-center justify-center animate-pulse" style={{animationDuration: '4s'}}>
          <div className="absolute inset-0 bg-indigo-100/30 rounded-full blur-2xl"></div>
          <img 
            src="https://lh3.googleusercontent.com/aida/ADBb0ujv1R7NmtIqJ5Ryq_mzVh7nIitKlU7dxD_zAtAESA6bI0T9FunnHkofL6RbdKC8F--uFp6INPrUfPw5cBZfFMMrx2tUBheM1_Qp8xzQq_QiLxa7zQiQN7wDC7OIaahLGMbNyL8Xh_s9-OsMIQD8ufA5Lxb5BA1IrLfMqzbicD4DIOg_eaBFc2xptYBPje8XsDoyTH1FTEBnGlZ2pEYLr5EHzhaw2H16J6EPXuQ_9MhfYQdV0UpXdM1uplFiZl7bRQdWbLRp82mo" 
            alt="Mochi Normal State" 
            className="w-40 h-40 object-contain drop-shadow-lg relative z-10"
          />
        </div>
        <div className="bg-surface-container-lowest neomorphic-lift p-md rounded-[32px] border border-white/60 relative w-full mt-4">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-surface-container-lowest rotate-45 border-t border-l border-white/60"></div>
          <p className="text-center font-body-lg text-on-surface font-medium italic transition-all duration-500">
            "{currentPhrase}"
          </p>
        </div>
      </section>

      {/* Focus Task Card */}
      {task ? (
      <section className="mt-8 relative z-10">
        <div className="bg-surface-container-lowest neomorphic-lift rounded-[40px] p-6 border border-white/80 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4">
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-caps rounded-full font-bold uppercase">{task.category}</span>
          </div>
          
          <div className="flex flex-col items-center space-y-6 text-center mt-4">
            <h2 className="text-[32px] leading-tight font-display-lg text-primary font-semibold">{task.title}</h2>
            {task.subtitle && <p className="text-body-md text-on-surface-variant mt-1">{task.subtitle}</p>}
            
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-4 text-left w-full space-y-2 bg-surface-container-low p-4 rounded-2xl">
                {task.subtasks.map(s => (
                  <div key={s.id} onClick={() => toggleSubtask(task.id, s.id)} className="flex gap-2 items-start text-[14px] text-on-surface-variant cursor-pointer group">
                     <div className={cn(
                        "w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                        s.completed ? "border-primary bg-primary" : "border-primary-container bg-white group-hover:border-primary/50"
                     )}>
                        {s.completed && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
                     </div>
                     <span className={cn("transition-opacity", s.completed ? "line-through opacity-50" : "group-hover:text-on-surface")}>{s.title}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Timer Component */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-slate-100" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary rounded-full transition-all duration-1000 ease-in-out" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="110" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-headline-md font-headline-md text-on-surface font-semibold">
                  {localMinutes.toString().padStart(2, '0')}:00
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400">MINUTOS</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 my-2">
              <button disabled={localMinutes <= 5} onClick={() => setLocalMinutes(m => Math.max(5, m - 5))} className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors disabled:opacity-50">
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="text-body-md font-medium text-on-surface-variant w-32">Ajustar tiempo</span>
              <button disabled={localMinutes >= 120} onClick={() => setLocalMinutes(m => Math.min(120, m + 5))} className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors disabled:opacity-50">
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={handleEmpezar}
                className="flex-1 bg-primary text-on-primary py-4 px-6 rounded-full font-title-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all font-medium"
              >
                <span className="material-symbols-outlined filled">play_arrow</span>
                Empezar
              </button>
              <button className="bg-surface-container text-on-surface-variant py-4 px-4 rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            
            {/* Breakdown Button */}
            <button 
              onClick={handleDivideTask} 
              disabled={isDividing || (task.subtasks && task.subtasks.length > 0)}
              className="w-full mt-2 flex items-center justify-between px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-primary hover:bg-indigo-100/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                {isDividing ? (
                  <div className="w-[20px] h-[20px] border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                )}
                <span className="font-medium font-body-md text-[14px]">
                  {isDividing ? 'Pensando...' : (task.subtasks && task.subtasks.length > 0 ? 'Tarea dividida' : 'Dividir tarea en IA')}
                </span>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
      ) : (
        <section className="mt-8 text-center py-12">
           <h3 className="text-xl font-medium text-slate-400">No hay tareas pendientes</h3>
        </section>
      )}

      {/* Secondary Guidance Card */}
      <section className="mt-6 opacity-80 cursor-pointer hover:opacity-100 transition-opacity">
        <div className="bg-surface-container-low rounded-[32px] p-5 border border-slate-200/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-slate-400">
            <span className="material-symbols-outlined">upcoming</span>
          </div>
          <div className="flex-1">
            <h3 className="text-title-sm text-slate-500 text-[16px]">Próximo: Revisar agenda</h3>
            <p className="text-label-caps text-slate-400">DENTRO DE 15 MIN</p>
          </div>
        </div>
      </section>

      {/* Mochi floating bubble */}
      <div onClick={() => setIsChatOpen(true)} className="fixed bottom-28 right-6 z-40 max-w-[200px] animate-bounce cursor-pointer group" style={{animationDuration: '3s'}}>
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] rounded-br-[4px] p-4 soft-elevation border border-indigo-50 mb-3 relative group-hover:shadow-md transition-shadow">
          <p className="text-[14px] leading-relaxed font-medium text-indigo-900">¡Me puedes preguntar lo que sea!</p>
          <div className="absolute bottom-[-10px] right-0 w-4 h-4 bg-white/90 transform rotate-45 border-r border-b border-indigo-50"></div>
        </div>
        <div className="flex justify-end pr-2">
          <div className={cn("w-16 h-16 rounded-full soft-elevation p-0.5 overflow-hidden border border-white transition-all duration-500", bubbleColor)}>
            <img 
              src={mochiFaceUrl} 
              alt="Mochi Happy" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
