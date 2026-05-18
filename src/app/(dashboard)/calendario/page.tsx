"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Calendar as CalendarIcon,
  Clock,
  MessageSquare,
  Bell,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to get days in month
const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const INITIAL_REMINDERS = [
  { id: "1", date: 15, text: "Entrega Banner Igreja", type: "Entrega" },
  { id: "2", date: 18, text: "Revisão de Estoque", type: "Tarefa" },
  { id: "3", date: 15, text: "Pagamento Fornecedor", type: "Financeiro" },
];

export default function CalendarioPage() {
  const now = new Date();
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReminder, setNewReminder] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = days[0].getDay();
  const blanks = Array(startDay).fill(null);

  const handleAddReminder = () => {
    if (newReminder && selectedDate) {
      setReminders([...reminders, {
        id: Math.random().toString(),
        date: selectedDate,
        text: newReminder,
        type: "Lembrete"
      }]);
      setNewReminder("");
      setIsFormOpen(false);
    }
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500 transition-colors duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3 uppercase tracking-tighter">
            <CalendarIcon className="text-secondary" size={24} />
            Calendário de Produção
          </h1>
          <p className="text-muted text-xs mt-1 font-medium italic">Sincronize prazos, entregas e lembretes operacionais.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-card p-1 rounded-[5px] border border-card-border">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="p-1.5 hover:bg-background rounded-[5px] transition-all text-muted hover:text-foreground"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.15em] text-foreground min-w-[140px] text-center">
                {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-1.5 hover:bg-background rounded-[5px] transition-all text-muted hover:text-foreground"
              >
                <ChevronRight size={18} />
              </button>
           </div>
           <button className="bg-secondary text-white px-6 py-2.5 rounded-[5px] font-black text-xs uppercase tracking-widest shadow-lg shadow-secondary/20 hover:opacity-90 transition-all flex items-center gap-2">
             <Plus size={16} />
             NOVO AVISO
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-card border border-card-border rounded-[5px] shadow-sm overflow-hidden p-4">
          <div className="grid grid-cols-7 mb-4">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-muted uppercase tracking-[0.2em] py-2">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-card-border border border-card-border rounded-[5px] overflow-hidden">
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="h-20 bg-background/50" />
            ))}
            {days.map(date => {
              const dayNum = date.getDate();
              const dayReminders = reminders.filter(r => r.date === dayNum && currentDate.getMonth() === 3); // April 2026 remnants
              const isToday = dayNum === now.getDate() && currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear();

              return (
                <div 
                  key={dayNum} 
                  onClick={() => { setSelectedDate(dayNum); setIsFormOpen(true); }}
                  className={cn(
                    "h-20 p-2 bg-card transition-all cursor-default hover:bg-secondary/5 relative group border-r border-b border-card-border last:border-0",
                    isToday && "bg-secondary/5"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full mb-1",
                    isToday ? "bg-secondary text-white shadow-lg" : "text-muted"
                  )}>
                    {dayNum}
                  </span>
                  
                  <div className="space-y-0.5 overflow-hidden">
                    {dayReminders.slice(0, 2).map(r => (
                      <div key={r.id} className={cn(
                        "text-[7px] font-black px-1.5 py-0.5 rounded-[3px] border truncate uppercase tracking-tighter",
                        r.type === "Entrega" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        r.type === "Financeiro" ? "bg-rose-50 text-rose-700 border-rose-100" :
                        "bg-secondary/10 text-secondary border-secondary/20"
                      )}>
                        {r.text}
                      </div>
                    ))}
                    {dayReminders.length > 2 && <p className="text-[6px] text-muted font-black uppercase ml-1">+{dayReminders.length - 2} mais</p>}
                  </div>

                  <button className="absolute bottom-1 right-1 p-1 bg-secondary text-white rounded-[3px] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-sm">
                    <Plus size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Insights / Today */}
        <div className="space-y-6">
          <section className="bg-card border border-card-border rounded-[5px] shadow-sm p-5">
             <h2 className="text-[10px] font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
               <Bell size={14} className="text-secondary" />
               Lembretes Hoje
             </h2>
             <div className="space-y-3">
                {reminders.filter(r => r.date === now.getDate()).length > 0 ? (
                  reminders.filter(r => r.date === now.getDate()).map(r => (
                    <div key={r.id} className="p-3 bg-background/50 rounded-[5px] border border-card-border group hover:border-secondary/30 transition-colors">
                       <div className="flex justify-between items-start">
                         <p className="text-[9px] font-black uppercase text-secondary mb-1 tracking-widest">{r.type}</p>
                         <button onClick={(e) => { e.stopPropagation(); removeReminder(r.id); }} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5">
                           <Trash2 size={12} className="text-muted hover:text-rose-600" />
                         </button>
                       </div>
                       <p className="text-[11px] font-bold text-foreground leading-tight">{r.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-muted font-medium italic text-center py-4 uppercase tracking-widest">Sem avisos</p>
                )}
             </div>
          </section>

          <section className="bg-gradient-to-br from-secondary to-secondary/80 rounded-[5px] shadow-xl p-5 text-white overflow-hidden relative group cursor-default">
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <CalendarIcon size={120} />
             </div>
             <MessageSquare size={20} className="mb-4 opacity-50" />
             <h3 className="font-black text-base leading-snug mb-2 relative z-10 uppercase tracking-tight">Prazos em dia aumentam a confiança do cliente.</h3>
             <p className="text-[9px] opacity-80 uppercase tracking-widest font-black relative z-10 italic">Dica do Sistema</p>
          </section>
        </div>
      </div>

      {/* New Reminder Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-md bg-card rounded-[5px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-card-border">
            <header className="p-6 border-b border-card-border flex justify-between items-center bg-background/50">
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">Lembretes do Dia</h2>
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mt-1">Dia {selectedDate} de {currentDate.toLocaleDateString('pt-BR', { month: 'long' })}</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 hover:bg-background rounded-full text-muted transition-colors">
                <X size={20} />
              </button>
            </header>
            
            <div className="p-6 space-y-6">
              {/* Existing Reminders List */}
              <div className="space-y-3 relative">
                <p className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Agendados</p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {reminders.filter(r => r.date === selectedDate).length > 0 ? (
                    reminders.filter(r => r.date === selectedDate).map(r => (
                      <div key={r.id} className="flex justify-between items-center p-3 bg-background/50 rounded-[5px] border border-card-border group">
                        <p className="text-xs font-bold text-foreground">{r.text}</p>
                        <button onClick={() => removeReminder(r.id)} className="p-1.5 hover:bg-rose-50 text-muted hover:text-rose-600 rounded-[5px] transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted font-medium italic py-4 text-center">Nenhum lembrete registrado.</p>
                  )}
                </div>
              </div>

              {/* Add Form */}
              <div className="pt-6 border-t border-card-border space-y-4">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Novo Aviso</label>
                  <textarea 
                    className="w-full border border-card-border bg-background rounded-[5px] px-4 py-3 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground resize-none placeholder:text-muted/30"
                    rows={2}
                    placeholder="O que você precisa lembrar hoje?"
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleAddReminder}
                  className="w-full py-4 bg-secondary text-white font-black text-xs rounded-[5px] shadow-xl shadow-secondary/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
                >
                  <Plus size={18} />
                  SALVAR NO CALENDÁRIO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
