import { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TasksScreen } from './screens/TasksScreen';
import { FocusScreen } from './screens/FocusScreen';
import { TimerScreen } from './screens/TimerScreen';
import { ZenScreen } from './screens/ZenScreen';
import { OrganiZenProvider } from './context/OrganiZenContext';
import { ChatModal } from './components/ChatModal';

type Tab = 'tasks' | 'focus' | 'timer' | 'zen';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  const handleStartTimer = () => {
    setActiveTab('timer');
  };

  const handleCompleteTimer = () => {
    setActiveTab('tasks');
  };

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
