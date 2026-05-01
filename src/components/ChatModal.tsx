import { useState, useRef, useEffect } from 'react';
import { useOrganiZen } from '../context/OrganiZenContext';
import { askMochi } from '../services/geminiService';
import { cn } from '../lib/utils';

export function ChatModal() {
  const { isChatOpen, setIsChatOpen, bubbleColor, mochiFaceUrl } = useOrganiZen();
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: "¡Hola! Soy Mochi. *sniff sniff* ¿En qué te puedo ayudar hoy a organizar tu mente?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const reply = await askMochi(userMsg, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
       <div className="bg-surface-container-lowest w-full h-[85vh] sm:h-[80vh] max-w-[600px] sm:rounded-[40px] rounded-t-[40px] shadow-2xl flex flex-col border border-white/50 overflow-hidden">
         {/* Headers */}
         <div className="px-6 py-4 border-b border-surface-variant flex justify-between items-center bg-surface-bright">
           <div className="flex items-center gap-3">
             <div className={cn("w-10 h-10 rounded-full flex items-center justify-center p-0.5 border border-white transition-all duration-500", bubbleColor)}>
               <img src={mochiFaceUrl} alt="Mochi" className="w-full h-full object-cover rounded-full transition-opacity duration-300"/>
             </div>
             <div>
               <h3 className="font-title-sm text-primary font-semibold text-[16px]">Mochi</h3>
               <p className="text-[10px] text-green-500 font-bold tracking-widest uppercase">En Línea</p>
             </div>
           </div>
           <button onClick={() => setIsChatOpen(false)} className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-2 rounded-full transition-colors">
             <span className="material-symbols-outlined text-[20px]">close</span>
           </button>
         </div>

         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/50">
           {messages.map((m, i) => (
             <div key={i} className={cn("flex w-full", m.role === 'user' ? "justify-end" : "justify-start")}>
               <div className={cn("max-w-[85%] rounded-[20px] px-4 py-3 text-body-md shadow-sm", m.role === 'user' ? "bg-primary text-on-primary rounded-tr-sm" : "bg-white text-on-surface border border-surface-variant rounded-tl-sm")}>
                 {m.text}
               </div>
             </div>
           ))}
           {isLoading && (
             <div className="flex w-full justify-start">
               <div className="max-w-[80%] rounded-[20px] rounded-tl-sm px-4 py-3 bg-white border border-surface-variant text-on-surface-variant flex gap-1 items-center shadow-sm h-12">
                 <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></div>
                 <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                 <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{animationDelay: "0.4s"}}></div>
               </div>
             </div>
           )}
           <div ref={endRef} />
         </div>

         {/* Input Area */}
         <div className="p-4 sm:p-6 bg-surface-bright border-t border-surface-variant flex gap-2 pb-safe">
           <input 
             type="text" 
             value={input}
             onChange={e => setInput(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleSend()}
             placeholder="Escríbele a Mochi..."
             className="flex-1 rounded-full border border-surface-variant bg-surface-container-lowest py-3 px-5 focus:ring-2 focus:ring-primary/50 focus:border-transparent text-body-md shadow-sm outline-none"
           />
           <button 
             onClick={handleSend}
             disabled={!input.trim() || isLoading}
             className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-sm"
           >
             <span className="material-symbols-outlined text-[20px]">send</span>
           </button>
         </div>
       </div>
    </div>
  );
}
