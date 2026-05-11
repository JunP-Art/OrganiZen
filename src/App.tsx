import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TasksScreen } from './screens/TasksScreen';
import { FocusScreen } from './screens/FocusScreen';
import { TimerScreen } from './screens/TimerScreen';
import { ZenScreen } from './screens/ZenScreen';
import { OrganiZenProvider } from './context/OrganiZenContext';
import { ChatModal } from './components/ChatModal';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle } from './services/firebase';

type Tab = 'tasks' | 'focus' | 'timer' | 'zen';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleStartTimer = () => {
    setActiveTab('timer');
  };

  const handleCompleteTimer = () => {
    setActiveTab('tasks');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body-md text-primary">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body-md bg-mesh p-4">
        <div className="bg-surface-bright rounded-[32px] p-8 shadow-xl max-w-sm w-full text-center flex flex-col items-center gap-6">
          <img src="/Assets/happy_1.png" alt="Mochi" className="w-32 h-32 object-contain drop-shadow-md" />
          <h1 className="text-3xl font-title-large text-primary">OrganiZen</h1>
          <p className="text-on-surface-variant font-body-md">Inicia sesión para mantener tus tareas organizadas en la nube.</p>
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-primary text-on-primary px-6 py-4 rounded-full font-label-large hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            Continuar con Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <OrganiZenProvider>
      <div className="bg-background min-h-screen font-body-md text-on-background bg-mesh">
        <Header />
        
        <main>
          {activeTab === 'tasks' && <TasksScreen onNavigate={setActiveTab} />}
          {activeTab === 'focus' && <FocusScreen onStart={handleStartTimer} />}
          {activeTab === 'timer' && <TimerScreen onComplete={handleCompleteTimer} onViewNext={() => setActiveTab('tasks')} />}
          {activeTab === 'zen' && <ZenScreen />}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <ChatModal />
      </div>
    </OrganiZenProvider>
  );
}
