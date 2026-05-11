import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, serverTimestamp } from 'firebase/firestore';

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
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Provided for compatibility, though not explicitly needed for the backend unless manipulated
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
  mochiFaces: {
    neutral: string;
    happy1: string;
    happy2: string;
  };
  mochiAnimatedFace: string;
}

const OrganiZenContext = createContext<OrganiZenContextType | undefined>(undefined);

export function OrganiZenProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  
  const [timerTotalTime, setTimerTotalTime] = useState(5 * 60);
  const [timerTimeLeft, setTimerTimeLeft] = useState(5 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSession, setTimerSession] = useState(1);

  // Settings
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setThemeState] = useState('Predeterminado');
  const [bubbleColor, setBubbleColorState] = useState('bg-indigo-100');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const mochiFaces = {
    neutral: "/Assets/normal.png",
    happy1: "/Assets/happy_1.png",
    happy2: "/Assets/happpy_2.png"
  };

  const [mochiAnimatedFace, setMochiAnimatedFace] = useState(mochiFaces.happy1);

  useEffect(() => {
    const faces = [mochiFaces.happy1, mochiFaces.happy2, mochiFaces.neutral];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % faces.length;
      setMochiAnimatedFace(faces[i]);
    }, 3000); // Cycle every 3 seconds
    return () => clearInterval(interval);
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

  // Firestore Sync 
  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const unsubSettings = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setThemeState(data.theme ?? 'Predeterminado');
        setBubbleColorState(data.bubbleColor ?? 'bg-indigo-100');
        setSoundsEnabled(data.soundsEnabled ?? true);
        setHapticEnabled(data.hapticEnabled ?? false);
        setNotificationsEnabled(data.notificationsEnabled ?? true);
      } else {
         setDoc(userRef, {
           theme: 'Predeterminado',
           bubbleColor: 'bg-indigo-100',
           soundsEnabled: true,
           hapticEnabled: false,
           notificationsEnabled: true,
           createdAt: serverTimestamp()
         }).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${auth.currentUser?.uid}`));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `users/${auth.currentUser?.uid}`));

    const tasksRef = collection(db, 'users', auth.currentUser.uid, 'tasks');
    const q = query(tasksRef);
    const unsubTasks = onSnapshot(q, (snapshot) => {
       const loadedTasks: Task[] = [];
       snapshot.forEach(docSnap => {
         loadedTasks.push({ id: docSnap.id, ...docSnap.data() } as Task);
       });
       setTasks(loadedTasks);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${auth.currentUser?.uid}/tasks`));

    return () => {
      unsubSettings();
      unsubTasks();
    };
  }, []);

  const updateSetting = async (key: string, value: any) => {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    try {
      await updateDoc(userRef, { [key]: value });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  };

  const setTheme = (v: string) => updateSetting('theme', v);
  const setBubbleColor = (v: string) => updateSetting('bubbleColor', v);
  const setSoundsEnabledDb = (v: boolean) => updateSetting('soundsEnabled', v);
  const setHapticEnabledDb = (v: boolean) => updateSetting('hapticEnabled', v);
  const setNotificationsEnabledDb = (v: boolean) => updateSetting('notificationsEnabled', v);

  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    if (!auth.currentUser) return;
    const tasksRef = collection(db, 'users', auth.currentUser.uid, 'tasks');
    const newDocRef = doc(tasksRef);
    const newTask = {
        title: task.title || "Nueva Tarea",
        category: task.category,
        subtasks: task.subtasks || [],
        completed: false,
        createdAt: serverTimestamp()
    } as any;
    
    if (task.subtitle) newTask.subtitle = task.subtitle;
    if (task.icon) newTask.icon = task.icon;
    if (task.iconColor) newTask.iconColor = task.iconColor;
    if (task.timeEstimate) newTask.timeEstimate = task.timeEstimate;

    try {
      await setDoc(newDocRef, newTask);
      if (!focusedTaskId) setFocusedTaskId(newDocRef.id);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${auth.currentUser.uid}/tasks`);
    }
  };

  const completeTask = async (id: string) => {
    if (!auth.currentUser) return;
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(50);
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    
    const isNowCompleted = !t.completed;
    const newSubtasks = isNowCompleted && t.subtasks 
      ? t.subtasks.map(s => ({ ...s, completed: true })) 
      : t.subtasks || [];
      
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', id), {
        completed: isNowCompleted,
        subtasks: newSubtasks
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}/tasks/${id}`);
    }
  };

  const replaceSubtasks = async (taskId: string, subtaskTitles: string[]) => {
    if (!auth.currentUser) return;
    const t = tasks.find(x => x.id === taskId);
    if (!t) return;
    
    const newSubtasks = subtaskTitles.map(title => ({ id: Math.random().toString(), title, completed: false }));
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', taskId), {
        subtasks: newSubtasks
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}/tasks/${taskId}`);
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    if (!auth.currentUser) return;
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(20);
    
    const t = tasks.find(x => x.id === taskId);
    if (!t || !t.subtasks) return;
    
    const newSubtasks = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', taskId), {
        subtasks: newSubtasks
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}/tasks/${taskId}`);
    }
  };

  const addSubtask = async (taskId: string, title: string) => {
    if (!auth.currentUser) return;
    const t = tasks.find(x => x.id === taskId);
    if (!t) return;
    
    const newSubtasks = [...(t.subtasks || []), { id: Math.random().toString(), title, completed: false }];
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', taskId), {
        subtasks: newSubtasks
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}/tasks/${taskId}`);
    }
  };

  // Provide defaults for user when they register
  const provideDefaultTasks = async () => {
    if(!auth.currentUser) return;
    if(tasks.length > 0) return;
    
    const defaultData = [
      {
        title: 'Limpiar la cocina',
        subtitle: 'Mantén tu espacio tranquilo',
        category: 'Ahora' as const,
        timeEstimate: 15,
        subtasks: [
          { id: 's1', title: 'Guardar los platos limpios', completed: false },
          { id: 's2', title: 'Limpiar la mesa', completed: false },
          { id: 's3', title: 'Barrer el suelo', completed: false }
        ]
      },
      {
        title: 'Hacer la cama',
        subtitle: 'Rutina de mañana',
        category: 'Hoy' as const,
        icon: 'bed',
        iconColor: 'text-primary',
        timeEstimate: 5
      }
    ];

    for (const d of defaultData) {
      await addTask(d);
    }
  };

  // Effect to load defaults once if brand new and tasks load empty
  // We'll skip for now unless wanted.

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
      soundsEnabled, setSoundsEnabled: setSoundsEnabledDb,
      hapticEnabled, setHapticEnabled: setHapticEnabledDb,
      notificationsEnabled, setNotificationsEnabled: setNotificationsEnabledDb,
      theme, setTheme,
      bubbleColor, setBubbleColor,
      isChatOpen, setIsChatOpen,
      replaceSubtasks,
      mochiFaces,
      mochiAnimatedFace
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
