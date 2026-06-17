"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  UserPlus, 
  Mail, 
  Phone,
  MoreVertical,
  Edit2,
  Trash2,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Save,
  Building2,
  FileText,
  MapPin,
  History as HistoryIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getClientes, saveCliente, deleteCliente, type ClienteInput } from "./actions";

interface Client {
  id: number;
  name: string;
  company: string | null;
  doc: string | null;
  phone: string | null;
  email: string | null;
  status: "Ativo" | "Inativo";
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const itemsPerPage = 10;

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [activeTab, setActiveTab] = useState<"dados" | "historico">("dados");
  
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "", company: "", doc: "", phone: "", email: "", status: "Ativo"
  });

  // Load clients
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await getClientes(searchQuery);
      setClients(data as Client[]);
      setIsLoading(false);
    }
    const timer = setTimeout(load, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedClients = clients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenForm = (client?: Client) => {
    if (client) {
      setEditingId(client.id);
      setFormData(client);
    } else {
      setEditingId(null);
      setFormData({ 
        name: "", company: "", doc: "", phone: "", email: "", status: "Ativo"
      });
    }
    setActiveTab("dados");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("Nome é obrigatório.");
      return;
    }
    
    const result = await saveCliente({ ...formData, id: editingId ?? undefined } as ClienteInput);
    if (result.success) {
      const data = await getClientes(searchQuery);
      setClients(data as Client[]);
      handleCloseForm();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja realmente excluir este cliente?")) {
      const result = await deleteCliente(id);
      if (result.success) {
        const data = await getClientes(searchQuery);
        setClients(data as Client[]);
        if (paginatedClients.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        alert(result.error);
      }
    }
  };

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors duration-500">
        <header className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCloseForm}
              className="p-1.5 hover:bg-background rounded-full transition-colors text-muted"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-black text-foreground uppercase tracking-tight">{editingId ? "Editar Cliente" : "Novo Cliente"}</h1>
              <p className="text-muted text-[10px] mt-1 font-medium italic">Preencha os dados do cliente abaixo.</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="bg-secondary text-white px-6 py-2.5 rounded-[5px] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2"
          >
            <Save size={16} />
            Salvar Cliente
          </button>
        </header>

        <div className="flex border-b border-card-border gap-6 px-2">
          <button 
            className={cn("pb-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2", activeTab === "dados" ? "border-secondary text-secondary" : "border-transparent text-muted hover:text-foreground")}
            onClick={() => setActiveTab("dados")}
          >
            Dados Principais
          </button>
          {editingId && (
            <button 
              className={cn("pb-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2", activeTab === "historico" ? "border-secondary text-secondary" : "border-transparent text-muted hover:text-foreground")}
              onClick={() => setActiveTab("historico")}
            >
              Histórico de Pedidos
            </button>
          )}
        </div>

        {activeTab === "dados" && (
        <section className="bg-card border border-card-border shadow-sm rounded-[5px] p-6 space-y-8">
          {/* Dados Principais */}
          <div>
            <h3 className="text-base font-black text-foreground mb-6 border-b border-card-border pb-4 uppercase tracking-tight">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em] flex items-center gap-2">
                <Users size={14} className="text-secondary" /> Nome do Contato *
              </label>
              <input 
                type="text" 
                className="w-full border border-card-border bg-background rounded-xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground"
                placeholder="Ex: João da Silva"
                value={formData.name || ""}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em] flex items-center gap-2">
                <Building2 size={14} className="text-secondary" /> Nome da Empresa *
              </label>
              <input 
                type="text" 
                className="w-full border border-card-border bg-background rounded-xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground"
                placeholder="Ex: Pizzaria Top"
                value={formData.company || ""}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em] flex items-center gap-2">
                <FileText size={14} className="text-secondary" /> CPF / CNPJ
              </label>
              <input 
                type="text" 
                className="w-full border border-card-border bg-background rounded-xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm font-black font-mono text-foreground"
                placeholder="000.000.000-00"
                value={formData.doc || ""}
                onChange={(e) => setFormData({...formData, doc: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em] flex items-center gap-2">
                <Phone size={14} className="text-secondary" /> Telefone / WhatsApp
              </label>
              <input 
                type="text" 
                className="w-full border border-card-border bg-background rounded-xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground"
                placeholder="(00) 00000-0000"
                value={formData.phone || ""}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em] flex items-center gap-2">
                <Mail size={14} className="text-secondary" /> E-mail
              </label>
              <input 
                type="email" 
                className="w-full border border-card-border bg-background rounded-xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground"
                placeholder="contato@empresa.com"
                value={formData.email || ""}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Status</label>
              <select 
                className="w-full border border-card-border bg-background rounded-xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm font-bold text-foreground appearance-none cursor-pointer"
                value={formData.status || "Ativo"}
                onChange={(e) => setFormData({...formData, status: e.target.value as "Ativo" | "Inativo"})}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>
          </div>
        </section>
        )}

        {activeTab === "historico" && (
          <section className="bg-card border border-card-border shadow-sm rounded-[5px] overflow-hidden">
            <div className="p-4 border-b border-card-border bg-background/50 flex justify-between items-center">
              <h3 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-tighter">
                <HistoryIcon size={16} className="text-secondary" />
                Histórico de Operações
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary border-b border-secondary/20">
                  <tr>
                    <th className="p-3 text-[10px] font-black uppercase tracking-widest text-white/90">ID Operação</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-widest text-white/90">Data</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-widest text-white/90">Status</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-widest text-white/90 text-right">Valor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  <tr className="hover:bg-background/50 transition-colors">
                    <td className="p-3 font-mono text-[10px] text-muted">PED-000450</td>
                    <td className="p-3 font-bold text-foreground">02/04/2026</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase rounded-md border border-emerald-200">Finalizado</span></td>
                    <td className="p-3 text-right font-black text-foreground">R$ 1.500,00</td>
                  </tr>
                  <tr className="hover:bg-background/50 transition-colors">
                    <td className="p-3 font-mono text-[10px] text-muted">PED-000412</td>
                    <td className="p-3 font-bold text-foreground">15/03/2026</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[9px] font-black uppercase rounded-md border border-secondary/20">Orçamento</span></td>
                    <td className="p-3 text-right font-black text-foreground">R$ 350,50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 transition-colors duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3 uppercase tracking-tighter">
            <Users className="text-secondary" size={24} />
            Base de Clientes
          </h1>
          <p className="text-muted text-xs mt-1 font-medium italic">Gestão centralizada de contatos e histórico de relacionamento.</p>
        </div>
        <div className="flex gap-3">
          {/* Botão removido daqui para ser colocado na barra de filtros */}
        </div>
      </header>

      {/* Tabela e Filtros */}
      <section className="bg-card border border-card-border shadow-sm rounded-[5px] overflow-hidden">
        <div className="p-4 border-b border-card-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/30">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-secondary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, empresa ou documento..." 
              className="w-full bg-card border border-card-border rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-sm transition-all font-bold text-foreground shadow-sm placeholder:text-muted/50"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />

            {isSearchFocused && searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-card-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <ul className="max-h-60 overflow-y-auto">
                  {clients.length > 0 ? (
                    clients.map(c => (
                      <li 
                        key={c.id}
                        className="p-3 hover:bg-background cursor-pointer border-b border-card-border last:border-0 flex justify-between items-center"
                        onClick={() => {
                          setSearchQuery(c.name);
                          setIsSearchFocused(false);
                        }}
                      >
                        <div>
                          <p className="font-bold text-sm text-foreground">{c.name}</p>
                          <p className="text-[10px] text-muted font-mono">{c.company || "Sem Empresa"} • {c.doc || "Sem Doc"}</p>
                        </div>
                        <span className={cn(
                          "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter",
                          c.status === "Ativo" ? "text-emerald-700 bg-emerald-50 border border-emerald-100" : "text-rose-700 bg-rose-50 border border-rose-100"
                        )}>
                          {c.status}
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted">Nenhum cliente encontrado</div>
                  )}
                </ul>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleOpenForm()}
            className="w-full sm:w-auto bg-secondary text-white px-6 py-2.5 rounded-[5px] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <UserPlus size={16} />
            Novo Cliente
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary border-b border-secondary/20">
              <tr>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10 text-center w-36">Ações</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">Cliente / Empresa</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">Documento</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">Contato Principal</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/70">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-background/40 transition-all group">
                  <td className="py-2 px-6 text-center border-r border-card-border/30">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => handleOpenForm(client)}
                        className="p-1.5 text-muted hover:text-secondary hover:bg-secondary/10 rounded-[5px] transition-all border border-transparent hover:border-secondary/20"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="p-1.5 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-[5px] transition-all border border-transparent hover:border-rose-100"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-6 border-r border-card-border/30">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-[5px] bg-background flex items-center justify-center font-black text-secondary text-base border border-card-border group-hover:border-secondary transition-colors shadow-sm uppercase">
                        {client.company?.charAt(0) || client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground text-sm uppercase tracking-tight leading-none group-hover:text-secondary transition-colors">{client.company || "Pessoa Física"}</h3>
                        <p className="text-[10px] text-muted font-medium mt-1 uppercase tracking-tighter">{client.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-6 border-r border-card-border/30">
                    <span className="font-mono text-[11px] font-black text-foreground/80 bg-background/50 border border-card-border px-2 py-0.5 rounded-md">{client.doc || "-"}</span>
                  </td>
                  <td className="py-2 px-6 border-r border-card-border/30">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-black text-foreground/80">
                        <Phone size={12} className="text-secondary" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-tighter">
                        <Mail size={12} className="text-muted" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-6 text-center">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border shadow-sm",
                      client.status === "Ativo" 
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : "text-rose-700 bg-rose-50 border-rose-200"
                    )}>
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted font-medium italic text-xs">
                    Nenhum cliente encontrado na base de dados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
          <div className="p-4 border-t border-card-border flex items-center justify-between bg-background/20">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest">
              Mostrando <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-foreground">{Math.min(currentPage * itemsPerPage, clients.length)}</span> de <span className="text-foreground">{clients.length}</span>
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
        </section>
    </div>
  );
}
