import { useOrganiZen } from '../context/OrganiZenContext';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

interface TimerScreenProps {
  onComplete: () => void;
  onViewNext: () => void;
}

export function TimerScreen({ onComplete, onViewNext }: TimerScreenProps) {
  const { tasks, focusedTaskId, setFocusedTaskId, timerTimeLeft, setTimerTimeLeft, isTimerRunning, setIsTimerRunning, timerSession, completeTask, mochiFaces } = useOrganiZen();
  
  const [showConfetti, setShowConfetti] = useState(false);

  const task = tasks.find(t => t.id === focusedTaskId && !t.completed) || tasks.find(t => !t.completed);

  const formatMin = (seconds: number) => {
    return Math.floor(seconds / 60).toString().padStart(2, '0');
  };
  const formatSec = (seconds: number) => {
    return (seconds % 60).toString().padStart(2, '0');
  };

  const handleCompleteTask = () => {
    if (task && !task.completed) {
      completeTask(task.id);
    }
    const nextTask = tasks.find(t => !t.completed && t.id !== task?.id);
    if (nextTask) {
      setFocusedTaskId(nextTask.id);
    }
    setIsTimerRunning(false);
    setShowConfetti(true);
  };

  const finishCongrats = () => {
    setShowConfetti(false);
    onComplete();
  };

  const handleAdd5Min = () => {
    setTimerTimeLeft(timerTimeLeft + 5 * 60);
    setIsTimerRunning(true);
  };

  const handleViewNext = () => {
    const nextTask = tasks.find(t => !t.completed && t.id !== task?.id);
    if (nextTask) {
      setFocusedTaskId(nextTask.id);
    }
    onViewNext(); // Go back to Tasks or Focus depending on what App.tsx does
  };

  return (
    <>
      <div className={cn(
        "pt-24 pb-32 px-6 max-w-[600px] mx-auto min-h-screen flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500 bg-surface",
        showConfetti && "blur-md pointer-events-none transition-all"
      )}>
        <section className="w-full flex flex-col items-center justify-center py-8 relative">
          
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-container/20 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative w-64 h-64 flex items-center justify-center mb-8" onClick={() => { if (task) setIsTimerRunning(!isTimerRunning); }}>
            <div className={cn("absolute inset-0 growth-blob opacity-20", isTimerRunning ? "animate-pulse" : "")} style={{animationDuration: '4s'}}></div>
            <div className={cn("absolute inset-4 rounded-full neomorphic-recessed flex items-center justify-center bg-surface-bright border border-white/50 transition-all", task ? "cursor-pointer hover:shadow-inner" : "")}>
              <div className="text-center">
                <span className={cn(
                  "block font-display-lg text-primary text-[64px] font-bold tracking-tighter transition-colors",
                  !isTimerRunning && timerTimeLeft > 0 && "text-primary/50"
                 )}>
                  {formatMin(timerTimeLeft)}:{formatSec(timerTimeLeft)}
                </span>
                <span className="font-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">
                  {!task ? 'Sin tareas' : isTimerRunning ? 'En Enfoque' : (timerTimeLeft === 0 ? 'Completado' : 'Pausado')}
                </span>
              </div>
            </div>
          </div>

          {task ? (
            <div className="w-full neomorphic-lift bg-white/60 p-6 rounded-[32px] mb-8 text-center border border-white/40 backdrop-blur-sm">
              <p className="font-body-md text-on-surface-variant mb-1">Estás trabajando en:</p>
              <h2 className="font-title-sm text-on-surface font-semibold text-[20px]">{task.title}</h2>
            </div>
          ) : (
            <div className="w-full neomorphic-lift bg-white/60 p-6 rounded-[32px] mb-8 text-center border border-white/40 backdrop-blur-sm">
              <h2 className="font-title-sm text-on-surface-variant font-medium text-[16px]">No hay tareas pendientes</h2>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 w-full">
            <button 
              onClick={handleCompleteTask}
              disabled={!task}
              className="group w-full py-5 px-6 rounded-full bg-primary text-on-primary font-title-sm font-semibold flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(75,90,156,0.3)] hover:opacity-90 transition-all active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined filled">check_circle</span>
              Completar Tarea
            </button>
            
            <div className="flex gap-4">
              <button disabled={!task} onClick={handleAdd5Min} className="flex-1 py-4 px-6 rounded-full bg-surface-container-low text-primary font-body-md font-medium flex items-center justify-center gap-2 border border-indigo-50 hover:bg-surface-container transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined">add_circle</span>
                +5 min
              </button>
              <button disabled={!task} onClick={handleViewNext} className="flex-1 py-4 px-6 rounded-full bg-surface-container-low text-primary font-body-md font-medium flex items-center justify-center gap-2 border border-indigo-50 hover:bg-surface-container transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                Ver siguiente
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {task && (
          <section className="mt-12 w-full">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-title-sm text-on-surface font-semibold text-[16px]">Tu Progreso</h3>
              <span className="text-primary font-label-caps tracking-wide">Sesión {((timerSession - 1) % 4) + 1} de 4</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(s => {
                const currentS = ((timerSession - 1) % 4) + 1;
                return (
                  <div key={s} className={cn(
                    "h-2 rounded-full shadow-sm w-full transition-all duration-1000",
                    s < currentS ? "bg-primary" : s === currentS ? "bg-primary/60" : "bg-surface-container-highest"
                  )}></div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {showConfetti && (
        <div className="fixed inset-0 z-[60] bg-white/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[40px] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] text-center relative overflow-hidden border border-white">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-primary"></div>
              <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-secondary"></div>
              <div className="absolute bottom-20 left-20 w-5 h-5 rounded-full bg-tertiary"></div>
            </div>
            <div className="relative z-10">
              <div className="w-48 h-48 mx-auto mb-6">
                <img 
                  src={mochiFaces.happy2} 
                  alt="Mochi Celebration" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="font-display-lg text-primary mb-4 text-[32px]">¡Lo lograste!</h2>
              <p className="font-body-lg text-on-surface-variant mb-8">Tómate un respiro, te lo mereces.</p>
              <button 
                onClick={finishCongrats}
                className="w-full py-4 bg-primary text-on-primary rounded-full font-title-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                ¡Gracias, Mochi!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
