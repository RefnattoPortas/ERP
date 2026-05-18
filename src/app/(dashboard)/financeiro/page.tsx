"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Search,
  CheckCircle,
  Edit2,
  X,
  Save,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getFinanceiro } from "./actions";

interface Transaction {
  id: number;
  date: string;
  doc: string | null;
  description: string;
  category: string | null;
  value: number;
  type: "in" | "out";
  status: "Pago" | "Pendente";
}

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<"Receita" | "Despesa">("Receita");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await getFinanceiro(searchQuery, fromDate, toDate);
      setTransactions(data as Transaction[]);
      setIsLoading(false);
    }
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fromDate, toDate, refreshKey]);

  function parseDate(dateStr: string) {
    if (!dateStr) return { day: 0, month: 0, year: 0 };
    if (dateStr.includes('/')) {
      const [d, m, y] = dateStr.split('/').map(Number);
      return { day: d, month: m, year: y };
    }
    const [y, m, d] = dateStr.split('-').map(Number);
    return { day: d, month: m, year: y };
  }

  const filteredTx = transactions; 
  const totalPages = Math.ceil(filteredTx.length / itemsPerPage);
  const paginatedTx = filteredTx.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const saldoTotal = transactions.reduce((acc, tx) => tx.type === "in" ? acc + tx.value : acc - tx.value, 0);
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  const entradasMes = transactions
    .filter(tx => {
      const { month, year } = parseDate(tx.date);
      return month === currentMonth && year === currentYear && tx.type === "in";
    })
    .reduce((acc, tx) => acc + tx.value, 0);
    
  const saidasMes = transactions
    .filter(tx => {
      const { month, year } = parseDate(tx.date);
      return month === currentMonth && year === currentYear && tx.type === "out";
    })
    .reduce((acc, tx) => acc + tx.value, 0);

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-card border border-transparent hover:border-card-border rounded-[5px] text-muted transition-all">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-black text-foreground uppercase tracking-tighter">Novo Lançamento: {formType}</h1>
              <p className="text-emerald-600 text-[10px] mt-0.5 font-black uppercase tracking-widest italic">Registrando entrada financeira no sistema</p>
            </div>
          </div>
          <button onClick={() => setIsFormOpen(false)} className="bg-secondary text-white px-8 py-2.5 rounded-[5px] font-black text-xs uppercase tracking-widest shadow-lg shadow-secondary/20 hover:opacity-90 transition-all">
            SALVAR {formType.toUpperCase()}
          </button>
        </header>

        <section className="bg-card border border-card-border shadow-sm rounded-[5px] p-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="absolute inset-0 pointer-events-none rounded-[5px] ring-1 ring-black/5 dark:ring-white/5" />
          
          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Descrição do Lançamento</label>
            <input type="text" className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground placeholder:text-muted/30" placeholder="Ex: Venda de Material ou Conta de Luz" />
          </div>
          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Valor (R$)</label>
            <input type="number" className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-lg font-black text-foreground placeholder:text-muted/30" placeholder="0,00" />
          </div>
          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Data do Vencimento</label>
            <input type="date" className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground" />
          </div>
          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Categoria Financeira</label>
            <select className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground appearance-none cursor-pointer">
              <option>Vendas</option>
              <option>Custos Operacionais</option>
              <option>Marketing</option>
              <option>Infraestrutura</option>
            </select>
          </div>
          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Forma de Pagamento</label>
            <select className="w-full border border-card-border bg-background rounded-[5px] px-4 py-2.5 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground appearance-none cursor-pointer">
              <option>Dinheiro / PIX</option>
              <option>Cartão de Crédito</option>
              <option>Cartão de Débito</option>
              <option>Boleto Bancário</option>
              <option>Transferência</option>
            </select>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 transition-colors duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3 uppercase tracking-tighter">
            <DollarSign className="text-secondary" size={24} />
            Gestão Financeira
          </h1>
          <p className="text-muted text-xs mt-1 font-medium italic">Controle de caixa, entradas e saídas estratégicas.</p>
        </div>
        <div className="flex gap-3">
          {/* Botões removidos daqui para serem colocados na barra de filtros */}
        </div>
      </header>

      {/* Resumo Financeiro */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-card-border shadow-sm rounded-[5px] p-6 hover:shadow-md transition-all relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
           <p className="text-muted text-[9px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-secondary transition-colors">Saldo em Contas</p>
           <p className="text-3xl font-black tracking-tighter text-foreground">R$ {saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card border border-card-border shadow-sm rounded-[5px] p-6 hover:shadow-md transition-all relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600" />
           <p className="text-emerald-700 bg-emerald-500/10 inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.2em] mb-2 border border-emerald-500/20">Entradas (Mês)</p>
           <p className="text-3xl font-black tracking-tighter text-emerald-600">R$ {entradasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card border border-card-border shadow-sm rounded-[5px] p-6 hover:shadow-md transition-all relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-rose-600" />
           <p className="text-rose-700 bg-rose-500/10 inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.2em] mb-2 border border-rose-500/20">Saídas (Mês)</p>
           <p className="text-3xl font-black tracking-tighter text-rose-600">R$ {saidasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </section>

      {/* Container Integrado (Filtros + Tabela) */}
      <div className="bg-card border border-card-border shadow-sm rounded-[5px] overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none rounded-[5px] ring-1 ring-black/5 dark:ring-white/5" />
        
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/30 relative z-10 border-b border-card-border">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-secondary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filtrar por descrição, documento ou categoria..." 
              className="w-full bg-card border border-card-border rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-sm transition-all font-bold text-foreground shadow-sm placeholder:text-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            
            {isSearchFocused && searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-card-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <ul className="max-h-60 overflow-y-auto">
                  {transactions.length > 0 ? (
                    transactions.map(tx => (
                      <li 
                        key={tx.id}
                        className="p-3 hover:bg-background cursor-pointer border-b border-card-border last:border-0 flex justify-between items-center"
                        onClick={() => {
                          setSearchQuery(tx.description);
                          setIsSearchFocused(false);
                        }}
                      >
                        <div>
                          <p className="font-black text-sm text-foreground uppercase tracking-tight">{tx.description}</p>
                          <p className="text-[10px] text-muted font-black uppercase tracking-tighter">{tx.doc || "Sem Doc"} • {tx.category || "Sem Categoria"}</p>
                        </div>
                        <span className={cn("text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest border shadow-sm", tx.type === "in" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200")}>
                          R$ {Math.abs(tx.value).toFixed(2)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[10px] font-black text-muted uppercase tracking-widest">Nenhum lançamento encontrado</div>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => { setFormType("Despesa"); setIsFormOpen(true); }}
                className="flex-1 sm:flex-none bg-rose-500 text-white border border-rose-600 px-4 py-2.5 rounded-[5px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <ArrowDownRight size={14} />
                Despesa
              </button>
              <button 
                onClick={() => { setFormType("Receita"); setIsFormOpen(true); }}
                className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-2.5 rounded-[5px] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <ArrowUpRight size={14} />
                Receita
              </button>
            </div>

            <div className="flex items-center gap-2 bg-card border border-card-border rounded-[5px] px-3 py-1.5 shadow-sm">
               <Calendar size={14} className="text-secondary" />
               <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    className="bg-transparent border-none text-[10px] font-black uppercase text-foreground focus:ring-0 p-0 cursor-pointer" 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                  <span className="text-[10px] font-black text-muted uppercase">ATÉ</span>
                  <input 
                    type="date" 
                    className="bg-transparent border-none text-[10px] font-black uppercase text-foreground focus:ring-0 p-0 cursor-pointer" 
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
               </div>
            </div>

            <div className="relative w-full sm:w-44 group">
              <select 
                className="w-full appearance-none bg-card border border-card-border hover:border-secondary/30 text-foreground text-[10px] font-black uppercase tracking-widest rounded-[5px] py-2.5 pl-10 pr-8 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary cursor-pointer transition-all shadow-sm"
              >
                <option>Filtro: Status</option>
                <option>Apenas Pago</option>
                <option>Pendente</option>
                <option>Atrasado</option>
              </select>
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" size={14} />
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary border-b border-secondary/20">
              <tr>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10 text-center w-36">Ações</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">Data / Doc</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">Descrição</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">Categoria</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right border-r border-white/10">Valor</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/70">
              {paginatedTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-background/40 transition-all group">
                  <td className="py-2 px-6 text-center border-r border-card-border/30">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => {
                          setFormType(tx.type === "in" ? "Receita" : "Despesa");
                          // To truly edit we need a way to set form state.
                          // Since form is just static UI now, we'll alert for now if no state binding exists.
                          alert(`Editar transação ${tx.id} - Em breve conectado ao formulário.`);
                        }} 
                        className="p-1.5 text-muted hover:text-secondary hover:bg-secondary/10 rounded-[5px] transition-all border border-transparent hover:border-secondary/20" 
                        title="Alterar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={async () => {
                          const { saveLancamento } = await import("./actions");
                          await saveLancamento({ ...tx, status: tx.status === "Pago" ? "Pendente" : "Pago" });
                          setRefreshKey(k => k + 1);
                        }} 
                        className="p-1.5 text-muted hover:text-emerald-600 hover:bg-emerald-500/10 rounded-[5px] transition-all border border-transparent hover:border-emerald-100" 
                        title={tx.status === "Pago" ? "Marcar Pendente" : "Dar Baixa"}
                      >
                        <CheckCircle size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-6 border-r border-card-border/30">
                    <p className="font-medium text-xs text-foreground uppercase tracking-tighter">{tx.date}</p>
                    <p className="text-[10px] text-muted font-medium font-mono uppercase">{tx.doc || "S/DOC"}</p>
                  </td>
                  <td className="py-2 px-6 font-medium text-sm text-foreground uppercase tracking-tight border-r border-card-border/30 group-hover:text-secondary transition-colors">{tx.description}</td>
                  <td className="py-2 px-6 border-r border-card-border/30">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-background border border-card-border text-muted uppercase tracking-widest">
                      {tx.category || "Geral"}
                    </span>
                  </td>
                  <td className={cn(
                    "py-2 px-6 text-right font-black border-r border-card-border/30 text-sm tracking-tighter",
                    tx.type === "in" ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {tx.type === "in" ? "+" : "-"} R$ {Math.abs(tx.value).toFixed(2)}
                  </td>
                  <td className="py-2 px-6 text-center">
                    <span className={cn(
                      "text-[9px] uppercase font-black px-3 py-1 rounded-md border shadow-sm tracking-widest",
                      tx.status === "Pago" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="p-4 border-t border-card-border flex items-center justify-between bg-background/20">
          <span className="text-[10px] font-black text-muted uppercase tracking-widest">
            Mostrando <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredTx.length)}</span> de <span className="text-foreground">{filteredTx.length}</span>
          </span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-card-border rounded-[5px] text-muted hover:bg-card hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-card border border-card-border rounded-[5px] shadow-sm">
              <span className="text-xs font-black text-foreground">
                {currentPage}
              </span>
              <span className="text-[10px] font-black text-muted uppercase">/</span>
              <span className="text-[10px] font-black text-muted">
                {totalPages}
              </span>
            </div>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-card-border rounded-[5px] text-muted hover:bg-card hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
