import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: 'Ahora' | 'Hoy' | 'Semana';
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  subtasks?: Subtask[];
  completed: boolean;
  timeEstimate?: number; // minutes
}

interface OrganiZenContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;
  completeTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  timerTotalTime: number;
  setTimerTotalTime: (t: number) => void;
  timerTimeLeft: number;
  setTimerTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  timerSession: number;
  
  soundsEnabled: boolean;
  setSoundsEnabled: (v: boolean) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (v: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
  theme: string;
  setTheme: (v: string) => void;

  bubbleColor: string;
  setBubbleColor: (v: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (v: boolean) => void;
  replaceSubtasks: (taskId: string, subtaskTitles: string[]) => void;
  mochiFaceUrl: string;
}

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Limpiar la cocina',
    subtitle: 'Mantén tu espacio tranquilo',
    category: 'Ahora',
    completed: false,
    timeEstimate: 15,
    subtasks: [
      { id: 's1', title: 'Guardar los platos limpios', completed: false },
      { id: 's2', title: 'Limpiar la mesa', completed: false },
      { id: 's3', title: 'Barrer el suelo', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Hacer la cama',
    subtitle: 'Rutina de mañana',
    category: 'Hoy',
    icon: 'bed',
    iconColor: 'text-primary',
    completed: false,
    timeEstimate: 5
  },
  {
    id: '3',
    title: 'Llamar al médico',
    subtitle: 'Cita pendiente',
    category: 'Hoy',
    icon: 'medical_services',
    iconColor: 'text-secondary',
    completed: false,
    timeEstimate: 10
  },
  {
    id: '4',
    title: 'Comprar pan',
    subtitle: 'Lista de compras',
    category: 'Hoy',
    icon: 'shopping_basket',
    iconColor: 'text-tertiary',
    completed: false,
    timeEstimate: 20
  }
];

// Provide 12 dummy tasks for Semana to reflect the "12" counter in the UI.
for (let i=0; i<12; i++) {
  defaultTasks.push({
    id: `w${i}`,
    title: `Tarea clave de la semana ${i+1}`,
    category: 'Semana',
    completed: false,
    timeEstimate: 30
  });
}

const OrganiZenContext = createContext<OrganiZenContextType | undefined>(undefined);

export function OrganiZenProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>('1');
  
  const [timerTotalTime, setTimerTotalTime] = useState(5 * 60);
  const [timerTimeLeft, setTimerTimeLeft] = useState(5 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSession, setTimerSession] = useState(1);

  // Settings
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState('Predeterminado');

  const [bubbleColor, setBubbleColor] = useState('bg-indigo-100');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const MOCHI_FACES = [
    // Neutral (Focus)
    "https://lh3.googleusercontent.com/aida/ADBb0ujv1R7NmtIqJ5Ryq_mzVh7nIitKlU7dxD_zAtAESA6bI0T9FunnHkofL6RbdKC8F--uFp6INPrUfPw5cBZfFMMrx2tUBheM1_Qp8xzQq_QiLxa7zQiQN7wDC7OIaahLGMbNyL8Xh_s9-OsMIQD8ufA5Lxb5BA1IrLfMqzbicD4DIOg_eaBFc2xptYBPje8XsDoyTH1FTEBnGlZ2pEYLr5EHzhaw2H16J6EPXuQ_9MhfYQdV0UpXdM1uplFiZl7bRQdWbLRp82mo",
    // Feliz 1 (Bubble)
    "https://lh3.googleusercontent.com/aida/ADBb0uhNHSjl0Vvub7voET0s9tWzu9yI94QNVlg4LrrsqaBQVwf-sqpohlliOfyOBSSKxM9cwaQDkEm8xo4v1LEWRASo_OpG0Nl1Qey3Hl3iBskvo1vmnSoyg9D6H1RVSK6cTFBxRAegtSrM4aTE5NiOffLOmMJj41dweOeDWVliOzL2vWOtwBkWnmORM4CreJ82no2pygmgmg0zVjLmTCASGbcG2GVWiNrrKRia5zDkX9Pb633ntEzsnDW6m7vg6AgqgG-FwJwZZow",
    // Feliz 2 (Perfil)
    "https://lh3.googleusercontent.com/aida/ADBb0uhkbTjRmFtHKuQ-3gQePqy2qhYrQY1zAeS3YpfJU9MykUQOTDVFxC43eqgth1LapxXQ9a1elDCTzM4rMCGrRes-9VYjFihMfhOEzVTR4sov6tuUfn-bTZ8l07nRwxJX8chlYgrpkIQLBrHZnnjBEygSgIkFHiFcnM2MizcP1Rj_sBAnYkxRwoub6yUJJ4us92pMITgnFsAj5SjbtqXEefrhXzVFk2YNYE62aqH3yifLAzbnJ4p61-2ESFsBxi4vhBoHwK8NqjuDIw"
  ];
  const [mochiFaceIndex, setMochiFaceIndex] = useState(0);

  useEffect(() => {
    const faceInterval = setInterval(() => {
      setMochiFaceIndex(prev => (prev + 1) % MOCHI_FACES.length);
    }, 5000);
    return () => clearInterval(faceInterval);
  }, []);

  useEffect(() => {
    const styleId = 'organizenz-theme-styles';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    let css = '';
    
    if (theme === 'Noche Estrellada') {
      css = `
        :root {
          --color-background: #0f172a;
          --color-surface: #1e293b;
          --color-surface-container-lowest: #020617;
          --color-surface-container-low: #0f172a;
          --color-surface-container: #1e293b;
          --color-surface-container-highest: #334155;
          --color-surface-bright: #334155;
          --color-on-background: #f8fafc;
          --color-on-surface: #f8fafc;
          --color-on-surface-variant: #cbd5e1;
          --color-primary: #818cf8;
          --color-primary-container: #3730a3;
          --color-on-primary-container: #e0e7ff;
          --color-outline-variant: #475569;
        }
      `;
    } else if (theme === 'Calma Pastel') {
       css = `
        :root {
          --color-background: #fdfbf7;
          --color-surface: #fcf9f2;
          --color-surface-container-lowest: #ffffff;
          --color-surface-container-low: #f5f0e6;
          --color-surface-container: #eee7d9;
          --color-surface-container-highest: #e4dccc;
          --color-surface-bright: #ffffff;
          --color-on-background: #4338ca;
          --color-on-surface: #4338ca;
          --color-on-surface-variant: #6366f1;
           --color-primary: #818cf8;
           --color-primary-container: #e0e7ff;
           --color-on-primary-container: #3730a3;
           --color-outline-variant: #c7d2fe;
        }
      `;
    } else if (theme === 'Alto Contraste') {
      css = `
        :root {
          --color-background: #000000;
          --color-surface: #000000;
          --color-surface-container-lowest: #000000;
          --color-surface-container-low: #111111;
          --color-surface-container: #222222;
          --color-surface-container-highest: #333333;
          --color-surface-bright: #111111;
          --color-on-background: #ffffff;
          --color-on-surface: #ffffff;
          --color-on-surface-variant: #cccccc;
          --color-primary: #fbbf24;
          --color-primary-container: #78350f;
          --color-on-primary-container: #fde68a;
          --color-outline-variant: #555555;
        }
      `;
    }
    
    styleEl.innerHTML = css;
    
  }, [theme]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerTimeLeft > 0) {
      interval = setInterval(() => {
        setTimerTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timerTimeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerSession(s => s + 1);
      if (soundsEnabled) {
        // Simple beep using Web Audio API as a fallback sound
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.value = 440; // A4
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
          
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 1.5);
        } catch (e) {
          console.error('Audio playback failed', e);
        }
      }
      if (hapticEnabled && navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerTimeLeft, soundsEnabled, hapticEnabled]);

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    setTasks(prev => [...prev, { ...task, id: Math.random().toString(), completed: false }]);
  };

  const completeTask = (id: string) => {
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(50);
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isNowCompleted = !t.completed;
        return { 
          ...t, 
          completed: isNowCompleted,
          subtasks: isNowCompleted && t.subtasks 
            ? t.subtasks.map(s => ({ ...s, completed: true })) 
            : t.subtasks
        };
      }
      return t;
    }));
  };

  const replaceSubtasks = (taskId: string, subtaskTitles: string[]) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: subtaskTitles.map(title => ({ id: Math.random().toString(), title, completed: false }))
        };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(20);
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s)
        };
      }
      return t;
    }));
  };

  const addSubtask = (taskId: string, title: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [...(t.subtasks || []), { id: Math.random().toString(), title, completed: false }]
        };
      }
      return t;
    }));
  };

  const mochiFaceUrl = MOCHI_FACES[mochiFaceIndex];

  return (
    <OrganiZenContext.Provider value={{
      tasks, setTasks,
      searchQuery, setSearchQuery,
      focusedTaskId, setFocusedTaskId,
      completeTask, toggleSubtask, addSubtask, addTask,
      timerTotalTime, setTimerTotalTime,
      timerTimeLeft, setTimerTimeLeft,
      isTimerRunning, setIsTimerRunning,
      timerSession,
      soundsEnabled, setSoundsEnabled,
      hapticEnabled, setHapticEnabled,
      notificationsEnabled, setNotificationsEnabled,
      theme, setTheme,
      bubbleColor, setBubbleColor,
      isChatOpen, setIsChatOpen,
      replaceSubtasks,
      mochiFaceUrl
    }}>
      {children}
    </OrganiZenContext.Provider>
  );
}

export function useOrganiZen() {
  const context = useContext(OrganiZenContext);
  if (!context) throw new Error("useOrganiZen must be used within OrganiZenProvider");
  return context;
}
