"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Search, 
  Filter,
  History,
  AlertTriangle,
  ExternalLink,
  Edit2,
  X,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getEstoque } from "./actions";

interface EstoqueItem {
  id: number;
  sku: string;
  name: string;
  category: string | null;
  stock: number | null;
  minStock: number | null;
  critical: boolean | null;
  cost: number | null;
  purchasePrice: number | null;
  supplier: string | null;
}

export default function EstoquePage() {
  const [estoqueItems, setEstoqueItems] = useState<EstoqueItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tudo");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await getEstoque(searchQuery);
      setEstoqueItems(data as EstoqueItem[]);
      setIsLoading(false);
    }
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredItems = estoqueItems.filter(item => {
    if (activeFilter === "Crítico") return item.critical;
    if (activeFilter === "Insumos") return item.category === "Insumo";
    if (activeFilter === "M. Primas") return item.category === "M. Prima";
    return true; // "Tudo"
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 transition-colors duration-500 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3 uppercase tracking-tighter">
            <Package className="text-secondary" size={24} />
            Controle de Estoque
          </h1>
          <p className="text-muted text-xs mt-1 font-medium italic">Gestão de produtos finais, matérias-primas e insumos.</p>
        </div>
        <div className="flex gap-3">
          {/* Botões removidos daqui para serem colocados na barra de filtros */}
        </div>
      </header>

      {/* Integrated Table Header Container */}
      <div className="bg-card border border-card-border shadow-sm rounded-[5px] overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none rounded-[5px] ring-1 ring-black/5 dark:ring-white/5" />
        
        {/* Search and Filters Bar */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/30 relative z-10 border-b border-card-border">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-secondary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por SKU, Nome ou Categoria..." 
              className="w-full bg-card border border-card-border rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-sm transition-all font-bold text-foreground shadow-sm placeholder:text-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            
            {isSearchFocused && searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-card-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <ul className="max-h-60 overflow-y-auto">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <li 
                        key={item.sku}
                        className="p-3 hover:bg-background cursor-pointer border-b border-card-border last:border-0 flex justify-between items-center"
                        onClick={() => {
                          setSearchQuery(item.name);
                          setIsSearchFocused(false);
                        }}
                      >
                        <div>
                          <p className="font-black text-sm text-foreground uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] text-muted font-black">{item.sku} • {item.category}</p>
                        </div>
                        <span className={cn(
                          "text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest border shadow-sm",
                          item.critical ? "text-rose-700 bg-rose-50 border-rose-200" : "text-emerald-700 bg-emerald-50 border-emerald-200"
                        )}>
                          {item.stock} UN
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[10px] font-black text-muted uppercase tracking-widest">Nenhum item encontrado</div>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsAnalysisOpen(true)}
                className="flex-1 sm:flex-none bg-card text-foreground border border-card-border px-4 py-2.5 rounded-[5px] font-black text-[10px] uppercase tracking-widest hover:bg-background transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <History size={14} className="text-secondary" />
                Histórico
              </button>
              <Link href="/estoque/novo" className="flex-1 sm:flex-none bg-secondary text-white px-4 py-2.5 rounded-[5px] font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2">
                <Plus size={14} />
                Novo Item
              </Link>
            </div>

            <div className="relative w-full sm:w-48 group">
              <select 
                className="w-full appearance-none bg-card border border-card-border hover:border-secondary/30 text-foreground text-xs font-black uppercase tracking-widest rounded-[5px] py-2.5 pl-10 pr-8 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary cursor-pointer transition-all shadow-sm"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <option value="Tudo">Filtro: Todos</option>
                <option value="Crítico">Apenas Crítico</option>
                <option value="Insumos">Apenas Insumos</option>
                <option value="M. Primas">M. Primas</option>
              </select>
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" size={16} />
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary border-b border-secondary/20">
              <tr>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10 text-center w-40">Ações</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">Item / SKU</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10 text-right">Saldo Atual</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10 text-right">P. Compra</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10 text-right">P. Venda (Custo)</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right">Margem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/70">
              {paginatedItems.map((item) => {
                const isLowStock = item.stock !== null && item.minStock !== null && item.stock <= item.minStock;
                const margin = item.purchasePrice && item.cost ? ((item.cost - item.purchasePrice) / item.purchasePrice * 100).toFixed(1) : "0";

                return (
                  <tr key={item.id} className="hover:bg-background/40 transition-all group">
                    <td className="py-2 px-6 text-center border-r border-card-border/30">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link 
                          href={`/estoque/novo?id=${item.id}`}
                          className="p-1.5 text-muted hover:text-secondary hover:bg-secondary/10 rounded-[5px] transition-all border border-transparent hover:border-secondary/20" title="Abrir Item"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link 
                          href={`/estoque/novo?id=${item.id}`}
                          className="p-1.5 text-muted hover:text-amber-600 hover:bg-amber-500/10 rounded-[5px] transition-all border border-transparent hover:border-amber-100" title="Editar Item"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => setIsAnalysisOpen(true)}
                          className="p-1.5 text-muted hover:text-foreground hover:bg-background rounded-[5px] transition-colors border border-transparent hover:border-card-border" title="Ver Histórico"
                        >
                          <History size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-6 border-r border-card-border/30">
                      <div>
                        <p className="font-medium text-sm text-foreground uppercase tracking-tight group-hover:text-secondary transition-colors">{item.name}</p>
                        <p className="text-[10px] text-muted font-medium mt-0.5 uppercase tracking-tighter">{item.sku}</p>
                      </div>
                    </td>
                    <td className="py-2 px-6 border-r border-card-border/30 text-right">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          {isLowStock && <AlertTriangle size={14} className="text-amber-500 animate-pulse" />}
                          <span className={cn(
                            "text-base font-black uppercase tracking-tighter",
                            isLowStock ? "text-amber-600" : "text-foreground"
                          )}>
                            {item.stock || 0} UN
                          </span>
                        </div>
                        {isLowStock && <span className="text-[8px] font-black text-amber-600/70 uppercase tracking-widest mt-0.5">Mín: {item.minStock}</span>}
                      </div>
                    </td>
                    <td className="py-2 px-6 border-r border-card-border/30 text-right font-black text-xs text-foreground/60 italic">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.purchasePrice || 0)}
                    </td>
                    <td className="py-2 px-6 border-r border-card-border/30 text-right font-black text-xs text-foreground/80">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.cost || 0)}
                    </td>
                    <td className="py-2 px-6 text-right">
                       <span className={cn(
                         "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter",
                         Number(margin) > 30 ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                       )}>
                         {margin}%
                       </span>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted font-medium italic text-xs">
                    Nenhum item encontrado no estoque.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="p-4 border-t border-card-border flex items-center justify-between bg-background/20">
          <span className="text-[10px] font-black text-muted uppercase tracking-widest">
            Mostrando <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> de <span className="text-foreground">{filteredItems.length}</span>
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

      {/* Analysis Modal */}
      {isAnalysisOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-card-border rounded-[5px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <header className="p-6 flex justify-between items-center bg-background/50">
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">Análise de Movimentação</h2>
                <p className="text-muted text-[10px] font-medium italic">Relatório detalhado de entradas e saídas.</p>
              </div>
              <button onClick={() => setIsAnalysisOpen(false)} className="p-1.5 hover:bg-background rounded-full transition-colors text-muted hover:text-foreground">
                <X size={20} />
              </button>
            </header>
            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-[5px]">
                  <p className="text-[10px] font-black uppercase text-emerald-600 mb-1 tracking-widest">Total Entradas</p>
                  <p className="text-2xl font-black text-emerald-600 uppercase tracking-tighter">+ 1.250 un</p>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-[5px]">
                  <p className="text-[10px] font-black uppercase text-rose-600 mb-1 tracking-widest">Total Saídas</p>
                  <p className="text-2xl font-black text-rose-600 uppercase tracking-tighter">- 840 un</p>
                </div>
                <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-[5px]">
                  <p className="text-[10px] font-black uppercase text-secondary mb-1 tracking-widest">Giro de Estoque</p>
                  <p className="text-2xl font-black text-secondary uppercase tracking-tighter">4.2x /mês</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-black text-foreground uppercase tracking-widest text-[10px]">Gráfico de Tendência</h3>
                <div className="h-48 w-full bg-background border border-dashed border-card-border rounded-[5px] flex items-center justify-center text-[10px] text-muted font-black uppercase tracking-[0.2em] italic">
                  Visualização de Tendência de Consumo
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
