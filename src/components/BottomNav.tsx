import { cn } from "@/src/lib/utils";

type Tab = 'tasks' | 'focus' | 'timer' | 'zen';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'tasks', label: 'Tasks', icon: 'check_circle' },
    { id: 'focus', label: 'Focus', icon: 'center_focus_strong' },
    { id: 'timer', label: 'Timer', icon: 'timer' },
    { id: 'zen', label: 'Zen', icon: 'spa' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-slate-50/95 backdrop-blur-2xl border-t border-indigo-100/30 shadow-[0_-10px_40px_-10px_rgba(165,180,252,0.12)] rounded-t-[32px] pb-safe h-20 flex justify-around items-center px-4">
      <div className="flex justify-around items-center w-full max-w-[600px] mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 ease-in-out active:scale-90",
                isActive 
                  ? "bg-primary-container/30 text-primary rounded-[20px]" 
                  : "text-slate-400 hover:text-primary/70"
              )}
            >
              <span className={cn("material-symbols-outlined mb-1", isActive && "filled")}>
                {tab.icon}
              </span>
              <span className={cn("font-['Lexend'] text-[12px] mt-1", isActive ? "font-bold" : "font-medium")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
