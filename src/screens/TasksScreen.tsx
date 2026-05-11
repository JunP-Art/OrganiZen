import { useState } from 'react';
import { useOrganiZen, Task } from '../context/OrganiZenContext';
import { cn } from '@/src/lib/utils';

export function TasksScreen({ onNavigate }: { onNavigate: (tab: 'tasks'|'focus'|'timer'|'zen') => void }) {
  const { tasks, searchQuery, setSearchQuery, completeTask, toggleSubtask, setFocusedTaskId, addTask, setIsChatOpen, bubbleColor, mochiFaces, mochiAnimatedFace } = useOrganiZen();
  
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const [activeTab, setActiveTab] = useState<'Ahora' | 'Hoy' | 'Semana'>('Ahora');
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null);

  const filteredTasks = tasks.filter(t => 
    !t.completed && 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    t.category === activeTab
  );

  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEnfocar = (id: string) => {
    setFocusedTaskId(id);
    onNavigate('focus');
  };

  const attemptCompleteTask = (id: string) => {
    setTaskToComplete(id);
  };

  const confirmCompleteTask = () => {
    if (taskToComplete) {
      completeTask(taskToComplete);
      setTaskToComplete(null);
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        category: activeTab,
        timeEstimate: 15
      });
      setNewTaskTitle('');
      setAddingTask(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-6 mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search & Filter Section */}
      <section className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            className="w-full bg-surface-container-lowest border-none rounded-[24px] py-4 pl-12 pr-4 inner-well focus:ring-2 focus:ring-primary-container text-body-md font-body-md transition-all outline-none" 
            placeholder="Buscar una tarea..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => setActiveTab('Ahora')}
            className={cn("px-6 py-2.5 rounded-full font-title-sm text-[14px] whitespace-nowrap transition-all active:scale-95 shadow-md", activeTab === 'Ahora' ? "bg-primary text-on-primary soft-elevation" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")}
          >Ahora</button>
          <button 
            onClick={() => setActiveTab('Hoy')}
            className={cn("px-6 py-2.5 rounded-full font-title-sm text-[14px] whitespace-nowrap transition-all active:scale-95 shadow-md", activeTab === 'Hoy' ? "bg-primary text-on-primary soft-elevation" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")}
          >Hoy</button>
          <button 
            onClick={() => setActiveTab('Semana')}
            className={cn("px-6 py-2.5 rounded-full font-title-sm text-[14px] whitespace-nowrap transition-all active:scale-95 shadow-md", activeTab === 'Semana' ? "bg-primary text-on-primary soft-elevation" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")}
          >Semana</button>
        </div>
      </section>

      {filteredTasks.length > 0 ? (
        <section className="space-y-4 relative pb-20">
          <div className="flex justify-between items-end">
            <h2 className="text-headline-md font-headline-md text-on-surface">{activeTab}</h2>
          </div>
          
          {filteredTasks.map(task => {
            const isExpanded = expandedTasks[task.id] !== false; // expanded by default
            return (
              <div key={task.id} className="bg-surface-container-lowest rounded-[32px] p-6 soft-elevation border border-indigo-50/50 group mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-[16px] bg-white flex items-center justify-center soft-elevation shrink-0", task.iconColor || "text-primary")}>
                      <span className="material-symbols-outlined">{task.icon || 'task'}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-title-sm font-title-sm text-on-surface font-semibold">{task.title}</h3>
                      {task.subtitle && <p className="text-body-md text-on-surface-variant">{task.subtitle}</p>}
                    </div>
                  </div>
                  <div 
                    onClick={() => toggleExpand(task.id)}
                    className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary cursor-pointer hover:bg-indigo-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {isExpanded && task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-6 space-y-4 border-l-2 border-primary-container/30 ml-2 pl-6">
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} onClick={() => toggleSubtask(task.id, subtask.id)} className="flex items-center gap-4 group/item cursor-pointer">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          subtask.completed ? "border-primary bg-primary text-white" : "border-primary-container text-transparent group-hover/item:text-primary/50 group-hover/item:border-primary/50"
                        )}>
                          <span className="material-symbols-outlined" style={{fontSize: '14px'}}>check</span>
                        </div>
                        <span className={cn(
                          "text-body-md transition-colors",
                          subtask.completed ? "text-slate-400 line-through" : "text-on-surface-variant group-hover/item:text-on-surface"
                        )}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-8 flex items-center justify-between">
                  <button onClick={() => attemptCompleteTask(task.id)} className="text-outline-variant hover:text-green-600 transition-colors flex items-center gap-2 group/btn">
                    <span className="material-symbols-outlined text-[28px] group-hover/btn:hidden">radio_button_unchecked</span>
                    <span className="material-symbols-outlined text-[28px] hidden group-hover/btn:block">check_circle</span>
                    <span className="text-sm font-medium">Completar</span>
                  </button>
                  <button 
                    onClick={() => handleEnfocar(task.id)}
                    className="bg-indigo-50 text-primary font-title-sm text-[14px] px-6 py-2 rounded-full hover:bg-indigo-100 transition-colors font-medium active:scale-95"
                  >
                    Enfocar
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="py-12 text-center text-on-surface-variant">
          <p>No tienes tareas en esta categoría. ¡Añade una nueva!</p>
        </section>
      )}

      {/* Adding Task Modal or inline */}
      {addingTask && (
        <div className="fixed inset-0 z-[60] bg-white/40 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative">
            <h2 className="font-title-sm text-lg mb-4">Nueva Tarea</h2>
            <input 
              autoFocus
              className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 mb-4 outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Leer 10 páginas..."
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            />
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setAddingTask(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddTask}
                className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Task Confirmation Modal */}
      {taskToComplete && (
        <div className="fixed inset-0 z-[60] bg-white/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative">
            <h2 className="font-title-sm text-lg mb-2">¿Completar tarea?</h2>
            <p className="text-body-md text-on-surface-variant mb-6">Mochi está orgulloso de ti. ¿Quieres marcar esta tarea como completada?</p>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setTaskToComplete(null)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmCompleteTask}
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mochi Motivational Bubble */}
       {!searchQuery && (
        <div onClick={() => setIsChatOpen(true)} className="fixed bottom-28 right-6 z-40 max-w-[200px] animate-bounce cursor-pointer group" style={{animationDuration: '3s'}}>
          <div className="bg-white/90 backdrop-blur-md rounded-[24px] rounded-br-[4px] p-4 soft-elevation border border-indigo-50 mb-3 relative group-hover:shadow-md transition-shadow">
            <p className="text-[14px] leading-relaxed font-medium text-indigo-900">¡Mira cuánto has avanzado! Vas genial.</p>
            <div className="absolute bottom-[-10px] right-0 w-4 h-4 bg-white/90 transform rotate-45 border-r border-b border-indigo-50"></div>
          </div>
          <div className="flex justify-end pr-2">
            <div className={cn("w-16 h-16 rounded-full soft-elevation p-0.5 overflow-hidden border border-white transition-all duration-500", bubbleColor)}>
              <img 
                src={mochiAnimatedFace} 
                alt="Mochi Animated" 
                className="w-full h-full object-cover rounded-full transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button 
        onClick={() => setAddingTask(true)}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-secondary text-on-secondary w-14 h-14 rounded-[20px] soft-elevation flex items-center justify-center active:scale-90 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>
    </div>
  );
}
