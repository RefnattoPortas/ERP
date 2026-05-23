"use client";

import { useState, useEffect } from "react";
import { 
  ClipboardList, 
  MoreVertical, 
  Plus, 
  User, 
  Calendar,
  X,
  Edit2,
  ArrowRight,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Clock,
  Settings2,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPedidos, savePedido } from "../pedidos/actions";

interface KanbanCard {
  id: string;
  title: string;
  client: string;
  user: string;
  priority: string;
  due: string;
  status: string;
  fullData?: {
    id: string;
    date: string;
    status: string;
    total: number;
    clienteId: number;
    cliente?: { name: string } | null;
    itens?: { produtoId: number; quantity: number; price: number }[];
  };
}

const INITIAL_CARDS = [
  { id: "1024", title: "Criação de Logo", client: "Padaria do Zé", user: "Renatinho", priority: "Média", due: "05/04", status: "Backlog" },
  { id: "1025", title: "Impressão 500 Cards", client: "Advocacia Silva", user: "Vendas", priority: "Alta", due: "Hoje", status: "Backlog" },
  { id: "1026", title: "Banner 2x1", client: "Igreja Matriz", user: "Operacional", priority: "Alta", due: "Urgente", status: "Em Produção" },
  { id: "1027", title: "Panfletos A5", client: "Pizzaria Top", user: "Operacional", priority: "Média", due: "Finalizado", status: "Revisão / Acabamento" },
];

const INITIAL_COLUMNS = ["Backlog", "Em Produção", "Revisão / Acabamento", "Pronto para Retirada"];

export default function KanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const orders = await getPedidos();
      // Only show orders that are not quotes
      const kanbanOrders = orders.filter((o: { status: string }) => o.status !== "Orçamento").map((o: { status: string, id: string, cliente?: { name: string } | null, total: number, date: string, itens?: { produtoId: number; quantity: number; price: number }[], clienteId: number }) => ({
        id: o.id,
        title: `Pedido ${o.id}`,
        client: o.cliente?.name || "Sem Cliente",
        user: "Operacional",
        priority: o.total > 1000 ? "Alta" : "Média",
        due: o.date,
        status: INITIAL_COLUMNS.includes(o.status) ? o.status : "Backlog",
        fullData: o
      }));
      setCards(kanbanOrders);
      setIsLoading(false);
    }
    load();
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    user: "",
    priority: "Média",
    due: "",
    status: "Backlog"
  });

  const handleOpenForm = (card: KanbanCard | null = null) => {
    if (card) {
      setEditingCard(card);
      setFormData(card);
    } else {
      setEditingCard(null);
      setFormData({
        title: "",
        client: "",
        user: "",
        priority: "Média",
        due: "",
        status: columns[0]
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editingCard) {
      setCards(cards.map(c => c.id === editingCard.id ? { ...formData, id: c.id } : c));
    } else {
      const newId = (Math.floor(Math.random() * 9000) + 1000).toString();
      setCards([...cards, { ...formData, id: newId }]);
    }
    setIsFormOpen(false);
  };

  const moveCard = async (id: string, direction: "next" | "prev") => {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    const currentIndex = columns.indexOf(card.status);
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex >= 0 && nextIndex < columns.length) {
      const newStatus = columns[nextIndex];
      
      // Update local state
      setCards(cards.map(c => c.id === id ? { ...c, status: newStatus } : c));
      
      // Update DB
      if (card.fullData) {
        await savePedido({ ...card.fullData, status: newStatus }, card.fullData.itens || []);
      }
    }
  };

  const deleteCard = (id: string) => {
    if (confirm("Deseja excluir esta tarefa?")) {
      setCards(cards.filter(c => c.id !== id));
      setIsFormOpen(false);
    }
  };

  const addColumn = () => {
    const name = prompt("Nome da nova coluna:");
    if (name) setColumns([...columns, name]);
  };

  const removeColumn = (col: string) => {
    if (confirm(`Excluir coluna "${col}"? Os cards nela serão movidos para a primeira coluna.`)) {
      setCards(cards.map(c => c.status === col ? { ...c, status: columns[0] } : c));
      setColumns(columns.filter(c => c !== col));
    }
  };

  const renameColumn = (oldName: string) => {
    const newName = prompt("Novo nome da coluna:", oldName);
    if (newName && newName !== oldName) {
      setColumns(columns.map(c => c === oldName ? newName : c));
      setCards(cards.map(c => c.status === oldName ? { ...c, status: newName } : c));
    }
  };

  return (
    <div className="space-y-6 pb-20 transition-colors duration-500 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3 uppercase tracking-tighter">
            <ClipboardList className="text-secondary" size={24} />
            Fluxo Operacional
          </h1>
          <p className="text-muted text-xs mt-1 font-medium italic">Gerencie o pipeline de produção em tempo real.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="p-2.5 border border-card-border text-muted hover:text-secondary hover:bg-card rounded-[5px] transition-all shadow-sm flex items-center justify-center"
            title="Configurar Colunas"
          >
            <Settings2 size={18} />
          </button>
          <button 
            onClick={() => handleOpenForm()}
            className="bg-secondary text-white px-6 py-2.5 rounded-[5px] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2"
          >
            <Plus size={16} />
            NOVA ORDEM
          </button>
        </div>
      </header>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-8 pt-2 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max px-2">
          {columns.map((column, idx) => (
            <KanbanColumn 
              key={column}
              index={idx}
              title={column} 
              count={cards.filter(c => c.status === column).length} 
              active={idx === 1} // Just for visual accent
              cards={cards.filter(c => c.status === column)}
              onEdit={handleOpenForm}
              onMove={moveCard}
              onRename={() => renameColumn(column)}
              onDelete={() => removeColumn(column)}
              isConfigMode={isConfigOpen}
              columnsCount={columns.length}
            />
          ))}
          
          {isConfigOpen && (
             <button 
                onClick={addColumn}
                className="w-[320px] h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-card-border rounded-[5px] text-muted hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all group"
             >
                <Plus size={32} className="mb-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <span className="font-black text-[10px] uppercase tracking-widest">Adicionar Coluna</span>
             </button>
          )}
        </div>
      </div>

      {/* Form Sidebar */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
          <aside className="relative w-full max-w-md bg-card shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-500 border-l border-card-border">
            <header className="p-8 border-b border-card-border flex justify-between items-center bg-background/50">
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">
                  {editingCard ? "Ajustar O.S." : "Nova Produção"}
                </h2>
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mt-1 italic">Gestão de Pipeline Operacional</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 hover:bg-background rounded-full transition-colors text-muted hover:text-foreground">
                <X size={20} />
              </button>
            </header>

            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Nome do Projeto / Item</label>
                <input 
                  type="text" 
                  className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground placeholder:text-muted/30"
                  placeholder="Ex: Impressão de Banners Igreja"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Cliente Associado</label>
                <input 
                  type="text" 
                  className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground placeholder:text-muted/30"
                  placeholder="Busque ou digite o cliente"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 relative">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Operador</label>
                  <input 
                    type="text" 
                    className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground placeholder:text-muted/30"
                    placeholder="Quem fará?"
                    value={formData.user}
                    onChange={(e) => setFormData({...formData, user: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Data Limite</label>
                  <input 
                    type="text" 
                    className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground placeholder:text-muted/30"
                    placeholder="Ex: Amanhã"
                    value={formData.due}
                    onChange={(e) => setFormData({...formData, due: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3 relative">
                <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Nível de Urgência</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Baixa", "Média", "Alta"].map(p => (
                    <button
                      key={p}
                      onClick={() => setFormData({...formData, priority: p})}
                      className={cn(
                        "py-2 rounded-[5px] text-[9px] font-black uppercase tracking-widest border transition-all shadow-sm",
                        formData.priority === p 
                          ? "bg-secondary border-secondary text-white" 
                          : "border-card-border bg-background text-muted hover:border-secondary/40"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Mover para Coluna</label>
                <select 
                  className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  {columns.map(col => <option key={col} value={col}>{col.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            <footer className="p-8 border-t border-card-border bg-background/50 flex flex-col gap-4">
              <button 
                onClick={handleSave}
                className="w-full py-4 bg-secondary text-white font-black text-xs rounded-[5px] shadow-xl shadow-secondary/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
              >
                <CheckCircle2 size={18} />
                {editingCard ? "ATUALIZAR DADOS" : "CRIAR ORDEM DE SERVIÇO"}
              </button>
              {editingCard && (
                <button 
                  onClick={() => deleteCard(editingCard.id)}
                  className="w-full py-3 bg-background border border-rose-500/20 text-rose-600 font-black text-[10px] rounded-[5px] hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <Trash2 size={14} />
                  REMOVER DEFINITIVAMENTE
                </button>
              )}
            </footer>
          </aside>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ 
  index,
  title, 
  count, 
  cards, 
  onEdit, 
  onMove, 
  onRename, 
  onDelete, 
  isConfigMode,
  columnsCount,
  active = false 
}: { 
  index: number,
  title: string, 
  count: number, 
  cards: KanbanCard[], 
  onEdit: (c: KanbanCard | null) => void, 
  onMove: (id: string, dir: "next" | "prev") => void, 
  onRename: () => void,
  onDelete: () => void,
  isConfigMode: boolean,
  columnsCount: number,
  active?: boolean 
}) {
  return (
    <div className={cn(
      "w-[340px] flex-shrink-0 flex flex-col rounded-[5px] p-4 bg-card border border-card-border shadow-sm transition-all relative group/col h-fit",
      active ? "ring-1 ring-secondary/30" : ""
    )}>
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className={cn(
             "w-1 h-8 rounded-full",
             active ? "bg-secondary shadow-[0_0_10px_rgba(var(--secondary),0.5)]" : "bg-card-border"
          )} />
          <div>
            <h3 className="font-black text-[10px] text-foreground uppercase tracking-[0.2em]">{title}</h3>
            <p className="text-[9px] font-bold text-muted mt-0.5 uppercase tracking-widest">{count} tarefas</p>
          </div>
        </div>
        
        {isConfigMode ? (
           <div className="flex gap-1 animate-in fade-in zoom-in duration-300">
              <button onClick={onRename} className="p-1.5 hover:bg-background rounded-[5px] text-secondary"><Edit2 size={14} /></button>
              <button onClick={onDelete} className="p-1.5 hover:bg-rose-500/10 rounded-[5px] text-rose-500"><Trash2 size={14} /></button>
           </div>
        ) : (
           <button className="text-muted hover:text-foreground transition-colors p-1">
             <MoreVertical size={16} />
           </button>
        )}
      </div>

      <div className="space-y-4">
        {cards.map((card) => (
          <div key={card.id} className="bg-background border border-card-border shadow-sm hover:shadow-xl hover:border-secondary/30 rounded-[5px] p-4 cursor-default transition-all group animate-in fade-in slide-in-from-top-2 duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-card-border to-transparent opacity-30" />
            
            <div className="flex justify-between items-start mb-3">
              <span className={cn(
                "text-[8px] uppercase font-black px-2 py-0.5 rounded-md border tracking-widest shadow-sm",
                card.priority === "Alta" ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse" : 
                card.priority === "Média" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-emerald-50 text-emerald-700 border-emerald-200"
              )}>
                {card.priority}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEdit(card)}
                  className="p-1 text-muted hover:text-secondary hover:bg-secondary/5 rounded-[5px] transition-all"
                  title="Detalhes"
                >
                  <Edit2 size={12} />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="font-black text-foreground text-xs leading-snug mb-0.5 uppercase tracking-tight group-hover:text-secondary transition-colors">{card.title}</p>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest">{card.client}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-card-border/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[5px] bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-sm">
                  <User size={12} className="text-secondary" />
                </div>
                <span className="text-[9px] font-black text-foreground uppercase tracking-tighter">{card.user}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted">
                <Clock size={10} className={card.due === "Urgente" ? "text-rose-500" : ""} />
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.1em]",
                  card.due === "Hoje" || card.due === "Urgente" ? "text-rose-600" : "text-muted"
                )}>
                  {card.due}
                </span>
              </div>
            </div>

            {/* Move Controls */}
            <div className="mt-4 pt-3 border-t border-card-border/50 flex justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
              <button 
                onClick={() => onMove(card.id, "prev")}
                className="flex-1 flex items-center justify-center py-1.5 bg-card text-muted hover:bg-background hover:text-foreground rounded-[5px] transition-all border border-card-border shadow-sm disabled:opacity-10 disabled:cursor-not-allowed"
                disabled={index === 0}
              >
                <ArrowLeft size={14} />
              </button>
              <button 
                onClick={() => onMove(card.id, "next")}
                className="flex-1 flex items-center justify-center py-1.5 bg-secondary text-white hover:opacity-90 rounded-[5px] transition-all shadow-lg shadow-secondary/20 disabled:opacity-10 disabled:cursor-not-allowed"
                disabled={index === columnsCount - 1}
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-muted border border-dashed border-card-border rounded-[5px] bg-background/30 mt-4">
            <ClipboardList size={24} className="mb-3 opacity-10" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30">Vazio</p>
          </div>
        )}
      </div>
      
      {!isConfigMode && (
         <button 
           onClick={() => onEdit(null)}
           className="mt-6 w-full py-3 rounded-[5px] border border-dashed border-card-border text-muted hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 group/btn"
         >
           <Plus size={14} className="group-hover/btn:rotate-90 transition-transform duration-300" />
           ADICIONAR NOVA TAREFA
         </button>
      )}
    </div>
  );
}
