"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  UserPlus, 
  Users,
  History,
  CheckCircle,
  FileCheck2,
  ArrowLeft,
  FileText,
  Filter,
  ExternalLink,
  Printer,
  MessageCircle,
  AlertCircle,
  CloudLightning,
  ChevronDown,
  XCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPedidos, savePedido, getPedidoById } from "./actions";
import { getClientes } from "../clientes/actions";
import { getEstoque } from "../estoque/actions";
import { useRouter } from "next/navigation";

interface Item {
  id: string;
  produtoId: number;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface Order {
  id: string;
  clienteId: number | null;
  clienteName?: string;
  cliente?: { name: string; company?: string | null; phone?: string | null };
  date: string;
  total: number;
  status: "Orçamento" | "Venda" | "Finalizado" | "Cancelado" | "Pago" | "Pronto para Retirada" | "Backlog" | "Em Produção" | "Revisão / Acabamento";
}

export default function PedidosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [dbClients, setDbClients] = useState<{ id: number; name: string; company?: string | null }[]>([]);
  const [dbProducts, setDbProducts] = useState<{ id: number; name: string; cost?: number | null }[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedCliente, setSelectedCliente] = useState<{id: number, name: string} | null>(null);
  const [isClientFocused, setIsClientFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedModalData, setSavedModalData] = useState<{ id: string, status: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Dinheiro / PIX");
  const [paymentStatus, setPaymentStatus] = useState<"Pago" | "Pendente">("Pendente");
  const [orderStatus, setOrderStatus] = useState("Orçamento");

  // Load orders, clients and products
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const ordersData = await getPedidos(searchQuery);
      setOrders(ordersData as Order[]);
      
      const clientsData = await getClientes();
      setDbClients(clientsData);

      const stockData = await getEstoque();
      setDbProducts(stockData);
      
      setIsLoading(false);
    }
    load();
  }, [searchQuery]);

  const filteredClients = dbClients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
    (c.company && c.company.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  // Product Combobox state
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

  // Automations state
  const [autoOs, setAutoOs] = useState(true);
  const [autoEstoque, setAutoEstoque] = useState(true);
  const [autoReceita, setAutoReceita] = useState(false);

  // Mock autosave
  useEffect(() => {
    if (isCreating && (items.length > 0 || selectedCliente)) {
      const timer = setTimeout(() => {
        setLastSaved(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [items, selectedCliente, isCreating]);

  const handleEditOrder = async (orderId: string) => {
    setIsLoading(true);
    const fullOrder = await getPedidoById(orderId);
    if (fullOrder) {
      if (fullOrder.cliente) {
        setSelectedCliente({ id: fullOrder.cliente.id, name: fullOrder.cliente.name });
        setClientSearch(fullOrder.cliente.name);
      } else {
        setSelectedCliente(null);
        setClientSearch("");
      }
      
      setItems(fullOrder.itens.map((i) => ({
        id: Math.random().toString(36).substr(2, 9),
        produtoId: i.produtoId || 0,
        name: i.produto?.name || "Produto Genérico",
        quantity: i.quantity,
        unit: "un", 
        price: i.price
      })));
      setEditingOrderId(fullOrder.id);
      setOrderStatus(fullOrder.status);
      setIsCreating(true);
    } else {
      alert("Erro ao carregar detalhes do pedido.");
    }
    setIsLoading(false);
  };

  const handleSavePedido = async (status: "Orçamento" | "Venda" | "Finalizado", selectedPaymentMethod?: string, selectedPaymentStatus?: "Pago" | "Pendente") => {
    if (!selectedCliente || items.length === 0) {
      alert("Selecione um cliente e adicione pelo menos um item.");
      return;
    }

    setIsSaving(true);
    const orderId = editingOrderId || `PD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    
    const pedidoData = {
      id: orderId,
      clienteId: selectedCliente.id,
      date: new Date().toLocaleDateString('pt-BR'),
      status: status,
      total: total,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: status === "Venda" ? (selectedPaymentStatus || "Pendente") : undefined
    };

    const res = await savePedido(pedidoData, items);
    setIsSaving(false);
    
    if (res.success) {
      setSavedModalData({ id: orderId, status });
      setEditingOrderId(orderId);
      setOrderStatus(status);
    } else {
      alert("error" in res ? res.error : "Erro ao salvar pedido");
    }
  };

  const addItem = () => {
    const newItem: Item = {
      id: Math.random().toString(36).substr(2, 9),
      produtoId: 0,
      name: "",
      quantity: 1,
      unit: "un",
      price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const selectProduct = (itemId: string, product: { id: number, name: string, cost?: number | null }) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            produtoId: product.id, 
            name: product.name, 
            price: product.cost || 0, // Using cost as base price if not defined
            unit: "un" 
          } 
        : item
    ));
    setFocusedItemId(null);
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  if (isCreating) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-120px)] max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors duration-500">
        {/* Main Order Area */}
        <div className="flex-1 space-y-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar">
          <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-card p-4 sm:p-6 rounded-[5px] border border-card-border/60 shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => setIsCreating(false)}
                className="p-2 hover:bg-background rounded-full transition-colors text-muted shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg sm:text-2xl font-black text-foreground uppercase tracking-tight">
                  {editingOrderId ? `Editando ${editingOrderId}` : "Novo Pedido / Orçamento"}
                </h1>
                <p className="text-muted text-[10px] mt-1 font-black uppercase tracking-widest">
                  {editingOrderId ? "" : `#NOVO | ${new Date().toLocaleDateString('pt-BR')}`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center sm:justify-end">
              {lastSaved && (
                <span className="text-[10px] text-muted flex items-center gap-1 font-black uppercase tracking-widest">
                  <CloudLightning size={14} className="text-emerald-500" />
                  Sincronizado às {lastSaved}
                </span>
              )}
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none p-2.5 border border-card-border text-muted hover:text-foreground hover:bg-background rounded-xl transition-all flex items-center justify-center">
                  <History size={20} />
                </button>
                <button 
                  onClick={() => handleSavePedido(orderStatus as "Orçamento" | "Venda" | "Finalizado")}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none bg-foreground text-card px-4 sm:px-6 py-2.5 rounded-[5px] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {isSaving ? "Salvando..." : (orderStatus === "Orçamento" ? "Salvar Rascunho" : "Salvar Alterações")}
                </button>
              </div>
            </div>
          </header>

          {/* Client Selection */}
          <section className="bg-card border border-card-border/60 shadow-sm rounded-[5px] p-6 flex flex-col gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                <Users size={14} className="text-secondary" />
                IDENTIFICAÇÃO DO CLIENTE
             </div>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 group w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-secondary transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar cliente por nome ou empresa..." 
                  className="w-full bg-background border border-card-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-sm font-bold text-foreground transition-all placeholder:text-muted/50"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  onFocus={() => setIsClientFocused(true)}
                  onBlur={() => setTimeout(() => setIsClientFocused(false), 200)}
                />
                
                {isClientFocused && clientSearch.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-card-border rounded-xl shadow-2xl z-50 overflow-hidden">
                    {filteredClients.length > 0 ? (
                      <ul className="max-h-48 overflow-y-auto">
                        {filteredClients.map(c => (
                          <li 
                            key={c.id}
                            className="p-4 hover:bg-background cursor-pointer border-b border-card-border last:border-0"
                            onClick={() => {
                              setSelectedCliente({id: c.id, name: c.name});
                              setClientSearch(c.name);
                              setIsClientFocused(false);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-black text-sm text-foreground uppercase tracking-tight">{c.name}</p>
                                <p className="text-[10px] text-muted font-bold">{c.company}</p>
                              </div>
                              <ChevronRight size={16} className="text-muted" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-xs text-muted font-black uppercase italic tracking-widest">
                        Nenhum cliente encontrado.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button className="flex items-center justify-center w-full md:w-auto gap-2 text-secondary font-black hover:bg-secondary/10 px-6 py-4 rounded-xl border border-secondary/20 transition-all text-xs uppercase tracking-widest">
                <UserPlus size={18} />
                NOVO CLIENTE
              </button>
            </div>
          </section>

          {/* Items Table / List */}
          <section className="bg-card border border-card-border/60 shadow-sm rounded-[5px] overflow-visible min-h-[450px]">
            {/* Mobile: Card layout for items */}
            <div className="md:hidden divide-y divide-card-border/50">
              {items.map((item) => {
                const filteredProducts = dbProducts.filter(p => p.name.toLowerCase().includes(item.name.toLowerCase()));
                const showDropdown = focusedItemId === item.id && item.name.length > 0;

                return (
                  <div key={item.id} className="p-4 space-y-3 relative">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          placeholder="Produto..." 
                          className="w-full bg-transparent border-none focus:outline-none text-sm font-black text-foreground placeholder:text-muted/40 px-0"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                          onFocus={() => setFocusedItemId(item.id)}
                          onBlur={() => setTimeout(() => setFocusedItemId(null), 200)}
                        />
                        {showDropdown && (
                          <ul className="absolute left-0 top-full mt-1 w-full bg-card border border-card-border shadow-2xl rounded-xl overflow-hidden z-[60] max-h-44 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                            {filteredProducts.length > 0 ? (
                              filteredProducts.map(prod => (
                                <li 
                                  key={prod.id} 
                                  className="px-4 py-2.5 hover:bg-secondary/10 cursor-pointer text-sm border-b border-card-border last:border-0 flex justify-between items-center transition-colors"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectProduct(item.id, prod);
                                  }}
                                >
                                  <span className="font-black text-foreground text-xs uppercase">{prod.name}</span>
                                  <span className="text-secondary text-[9px] font-black bg-secondary/5 px-2 py-0.5 rounded">R$ {(prod.cost || 0).toFixed(2)}</span>
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-3 text-[10px] text-muted font-black uppercase tracking-widest text-center italic">
                                Item não catalogado. Registro manual ativado.
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[8px] font-black text-muted uppercase tracking-widest mb-1 block">Qtd</label>
                        <input 
                          type="number" 
                          className="w-full bg-background border border-card-border rounded-lg p-2 text-center text-sm font-black text-foreground focus:ring-1 focus:ring-secondary outline-none"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-muted uppercase tracking-widest mb-1 block">Un</label>
                        <select 
                          className="w-full bg-background border border-card-border rounded-lg p-2 text-center text-xs font-black text-foreground focus:ring-1 focus:ring-secondary outline-none appearance-none cursor-pointer"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                        >
                          <option value="un">UN</option>
                          <option value="m²">M²</option>
                          <option value="kg">KG</option>
                          <option value="m">M LINEAR</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-muted uppercase tracking-widest mb-1 block">Preço</label>
                        <div className="relative">
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-muted text-[9px] font-black">R$</span>
                          <input 
                            type="number" 
                            className="w-full bg-background border border-card-border rounded-lg p-2 pl-6 text-right text-sm font-black text-foreground focus:ring-1 focus:ring-secondary outline-none"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <span className="text-xs font-black text-foreground">
                        Subtotal: R$ {(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="p-4 bg-background/20">
                <button 
                  onClick={addItem}
                  className="flex items-center gap-3 text-secondary font-black hover:scale-105 transition-all text-xs uppercase tracking-widest"
                >
                  <Plus className="bg-secondary text-white p-1 rounded-lg" size={24} />
                  ADICIONAR ITEM À LISTA
                </button>
              </div>
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead className="bg-secondary border-b border-secondary/20">
                  <tr>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-white/90 border-r border-white/10">Produto / Serviço</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-white/90 border-r border-white/10 w-24 text-center">Qtd.</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-white/90 border-r border-white/10 w-28 text-center">Unid.</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-white/90 border-r border-white/10 w-36 text-center">Preço Un.</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-white/90 border-r border-white/10 w-40 text-right">Subtotal</th>
                    <th className="py-4 px-6 w-14 text-center text-white/90"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/50">
                  {items.map((item) => {
                    const filteredProducts = dbProducts.filter(p => p.name.toLowerCase().includes(item.name.toLowerCase()));
                    const showDropdown = focusedItemId === item.id && item.name.length > 0;

                    return (
                      <tr key={item.id} className="group hover:bg-background/30 transition-all relative">
                        <td className="py-3 px-6 border-r border-card-border/30 relative">
                          <input 
                            type="text" 
                            placeholder="Digite ou busque o produto..." 
                            className="w-full bg-transparent border-none focus:outline-none text-sm font-black text-foreground placeholder:text-muted/40 px-2"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            onFocus={() => setFocusedItemId(item.id)}
                            onBlur={() => setTimeout(() => setFocusedItemId(null), 200)}
                          />
                          
                          {/* Combobox Dropdown */}
                          {showDropdown && (
                            <ul className="absolute left-0 top-full mt-2 w-full bg-card border border-card-border shadow-2xl rounded-xl overflow-hidden z-[60] max-h-52 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                              {filteredProducts.length > 0 ? (
                                filteredProducts.map(prod => (
                                  <li 
                                    key={prod.id} 
                                    className="px-5 py-3 hover:bg-secondary/10 cursor-pointer text-sm border-b border-card-border last:border-0 flex justify-between items-center transition-colors"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      selectProduct(item.id, prod);
                                    }}
                                  >
                                    <span className="font-black text-foreground text-xs uppercase">{prod.name}</span>
                                    <span className="text-secondary text-[10px] font-black bg-secondary/5 px-2 py-0.5 rounded">R$ {(prod.cost || 0).toFixed(2)}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="px-5 py-4 text-[10px] text-muted font-black uppercase tracking-widest text-center italic">
                                  Item não catalogado. Registro manual ativado.
                                </li>
                              )}
                            </ul>
                          )}
                        </td>
                      <td className="py-3 px-6 border-r border-card-border/30">
                        <input 
                          type="number" 
                          className="w-full bg-background border border-card-border rounded-lg p-2 text-center text-sm font-black text-foreground focus:ring-1 focus:ring-secondary outline-none"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        />
                      </td>
                      <td className="py-3 px-6 border-r border-card-border/30">
                        <select 
                          className="w-full bg-background border border-card-border rounded-lg p-2 text-center text-xs font-black text-foreground focus:ring-1 focus:ring-secondary outline-none appearance-none cursor-pointer"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                        >
                          <option value="un">UN</option>
                          <option value="m²">M²</option>
                          <option value="kg">KG</option>
                          <option value="m">M LINEAR</option>
                        </select>
                      </td>
                      <td className="py-3 px-6 border-r border-card-border/30">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted text-[10px] font-black">R$</span>
                          <input 
                            type="number" 
                            className="w-full bg-background border border-card-border rounded-lg p-2 pl-8 text-right text-sm font-black text-foreground focus:ring-1 focus:ring-secondary outline-none"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-6 border-r border-card-border/30 text-right font-black text-sm text-foreground pr-6">
                        R$ {(item.quantity * item.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={6} className="p-4 bg-background/20">
                      <button 
                        onClick={addItem}
                        className="flex items-center gap-3 text-secondary font-black hover:scale-105 transition-all text-xs uppercase tracking-widest"
                      >
                        <Plus className="bg-secondary text-white p-1 rounded-lg" size={24} />
                        ADICIONAR ITEM À LISTA
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Checkout Sidebar */}
        <aside className="w-full lg:w-96 bg-card border border-card-border/60 shadow-xl rounded-[5px] p-4 sm:p-8 flex flex-col justify-between lg:sticky lg:bottom-0 lg:h-auto lg:overflow-y-auto">
          <div className="space-y-8">
            <h2 className="text-xl font-black flex items-center justify-between text-foreground border-b border-card-border pb-6 uppercase tracking-tighter">
              {orderStatus} <FileCheck2 className="text-secondary" size={24} />
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-muted text-xs font-black uppercase tracking-widest">
                <span>SUBTOTAL</span>
                <span className="font-black text-foreground">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted text-xs font-black uppercase tracking-widest">
                <span>DESCONTOS</span>
                <span className="text-secondary font-black cursor-pointer hover:underline">0,00 %</span>
              </div>
              <div className="h-px bg-card-border my-6" />
              <div className="flex flex-col bg-secondary/5 p-6 rounded-[5px] border border-secondary/20 shadow-inner">
                <span className="text-secondary font-black text-[10px] uppercase tracking-[0.2em] mb-2 text-center">VALOR TOTAL DO PEDIDO</span>
                <span className="text-5xl font-black text-foreground text-center tracking-tighter">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-card-border">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-black">ROTINAS AUTOMATIZADAS</p>
              <div className="space-y-1">
                <AutomationToggle label="Gerar O.S. (Produção)" active={autoOs} onChange={setAutoOs} />
                <AutomationToggle label="Abatimento de Estoque" active={autoEstoque} onChange={setAutoEstoque} />
                <AutomationToggle label="Lançar no Financeiro" active={autoReceita} onChange={setAutoReceita} />
              </div>
            </div>
          </div>

          <div className="pt-10 mt-auto">
            {orderStatus === "Orçamento" ? (
              <button 
                onClick={() => {
                  if (!selectedCliente || items.length === 0) {
                    alert("Selecione um cliente e adicione pelo menos um item.");
                    return;
                  }
                  setCheckoutModalOpen(true);
                }}
                disabled={isSaving}
                className="w-full py-5 bg-secondary text-white font-black text-sm rounded-[5px] shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mb-4 text-center uppercase tracking-[0.2em] disabled:opacity-50"
              >
                {isSaving ? "PROCESSANDO..." : "GERAR VENDA"}
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (!selectedCliente || items.length === 0) {
                    alert("Selecione um cliente e adicione pelo menos um item.");
                    return;
                  }
                  handleSavePedido("Finalizado");
                }}
                disabled={isSaving}
                className="w-full py-5 bg-emerald-600 text-white font-black text-sm rounded-[5px] shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all mb-4 text-center uppercase tracking-[0.2em] disabled:opacity-50"
              >
                {isSaving ? "PROCESSANDO..." : "FINALIZAR PEDIDO"}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-muted text-[10px] text-center mb-8 font-black uppercase tracking-tighter">
              <CheckCircle size={14} className="text-emerald-500" /> 
              SISTEMA EM MODO DE CONFORMIDADE
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-card-border">
              <button 
                onClick={() => {
                  if(confirm("Tem certeza que deseja cancelar este orçamento?")) {
                    setIsCreating(false);
                  }
                }}
                className="flex items-center justify-center gap-2 py-3.5 border border-card-border bg-background text-muted rounded-xl text-[10px] font-black hover:bg-card hover:text-amber-500 hover:border-amber-500/20 transition-all uppercase tracking-widest"
              >
                <XCircle size={16} />
                CANCELAR
              </button>
              <button 
                onClick={() => {
                  if(confirm("Deseja excluir permanentemente este registro?")) {
                    setIsCreating(false);
                  }
                }}
                className="flex items-center justify-center gap-2 py-3.5 border border-card-border bg-background text-muted rounded-xl text-[10px] font-black hover:bg-card hover:text-rose-500 hover:border-rose-500/20 transition-all uppercase tracking-widest"
              >
                <Trash2 size={16} />
                EXCLUIR
              </button>
            </div>
          </div>
        </aside>

        {/* Modal de Fechamento / Pagamento */}
        {checkoutModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-card-border rounded-xl shadow-2xl p-8 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-card-border pb-4">
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                  <DollarSign className="text-secondary" />
                  Dados do Pagamento
                </h3>
                <button onClick={() => setCheckoutModalOpen(false)} className="text-muted hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-lg text-center">
                  <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Total do Pedido</p>
                  <p className="text-3xl font-black text-foreground">R$ {total.toFixed(2)}</p>
                </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Forma de Pagamento</label>
                    <select 
                      className="w-full bg-background border border-card-border rounded-lg p-3 text-sm font-bold text-foreground focus:ring-1 focus:ring-secondary outline-none appearance-none"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Dinheiro / PIX">Dinheiro / PIX</option>
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Cartão de Débito">Cartão de Débito</option>
                      <option value="Boleto Bancário">Boleto Bancário</option>
                      <option value="Transferência">Transferência Bancária</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Status do Pagamento</label>
                    <select 
                      className="w-full bg-background border border-card-border rounded-lg p-3 text-sm font-bold text-foreground focus:ring-1 focus:ring-secondary outline-none appearance-none"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as "Pago" | "Pendente")}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Pago">Pago</option>
                    </select>
                  </div>
                </div>

              <div className="flex gap-3 pt-4 border-t border-card-border">
                <button 
                  onClick={() => setCheckoutModalOpen(false)}
                  className="flex-1 bg-background border border-card-border text-muted py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-card hover:text-foreground transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setCheckoutModalOpen(false);
                    handleSavePedido("Venda", paymentMethod, paymentStatus);
                  }}
                  className="flex-1 bg-secondary text-white py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Confirmar Venda
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Sucesso */}
        {savedModalData && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-card-border rounded-xl shadow-2xl p-8 max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <CheckCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                  {savedModalData.status === "Orçamento" ? "Orçamento Salvo!" : "Pedido Finalizado!"}
                </h3>
                <p className="text-sm text-muted mt-2 font-medium">
                  O documento <strong className="text-foreground">{savedModalData.id}</strong> foi gravado com sucesso no sistema. O que deseja fazer agora?
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={() => router.push(`/pedidos/${savedModalData.id}/print`)}
                  className="w-full bg-secondary text-white py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
                >
                  <Printer size={16} />
                  Visualizar / Imprimir
                </button>
                <button 
                  onClick={() => setSavedModalData(null)}
                  className="w-full bg-secondary/10 text-secondary py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-secondary/20 transition-all border border-secondary/10"
                >
                  Continuar Editando
                </button>
                <button 
                  onClick={async () => {
                    setSavedModalData(null);
                    setIsCreating(false);
                    setEditingOrderId(null);
                    setOrderStatus("Orçamento");
                    setItems([]);
                    setSelectedCliente(null);
                    setClientSearch("");
                    setPaymentMethod("Dinheiro / PIX");
                    setPaymentStatus("Pendente");
                    const ordersData = await getPedidos(searchQuery);
                    setOrders(ordersData as Order[]);
                  }}
                  className="w-full bg-background border border-card-border text-muted py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-card hover:text-foreground transition-all"
                >
                  Voltar para Listagem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Calculate pagination
  const filteredOrders = orders.filter(order => {
    const clientName = order.cliente?.name || "";
    const matchesSearch = clientName.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- List View ---
  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 transition-colors duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3 uppercase tracking-tighter">
            <FileText className="text-secondary" size={24} />
            Pedidos e Orçamentos
          </h1>
          <p className="text-muted text-xs mt-1 font-medium italic">Painel de controle de vendas e fluxos de rascunhos.</p>
        </div>
      </header>

      <section className="bg-card border border-card-border/50 shadow-sm rounded-[5px] overflow-hidden relative">
        {/* Soft outline effect (subtle ring) */}
        <div className="absolute inset-0 pointer-events-none rounded-[5px] ring-1 ring-black/5 dark:ring-white/5" />
        
        <div className="p-4 border-b border-card-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/30 relative z-10">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-secondary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por cliente ou ID..." 
              className="w-full bg-card border border-card-border rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-sm transition-all font-bold text-foreground placeholder:text-muted/50"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />

            {isSearchFocused && searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-card-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <ul className="max-h-60 overflow-y-auto">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <li 
                        key={order.id}
                        className="p-3 hover:bg-background cursor-pointer border-b border-card-border last:border-0 flex justify-between items-center"
                        onClick={() => {
                          setSearchQuery(order.cliente?.name || "");
                          setIsSearchFocused(false);
                        }}
                      >
                        <div>
                          <p className="font-black text-sm text-foreground uppercase tracking-tighter">{order.cliente?.name || "S/ CLIENTE"}</p>
                          <p className="text-[10px] text-muted font-black">{order.id} • {order.date}</p>
                        </div>
                        <span className="text-xs font-black text-foreground">
                          R$ {order.total.toFixed(2)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[10px] font-black text-muted uppercase tracking-widest">Nenhum resultado encontrado</div>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
            <button 
              onClick={() => {
                setEditingOrderId(null);
                setOrderStatus("Orçamento");
                setItems([]);
                setSelectedCliente(null);
                setClientSearch("");
                setPaymentMethod("Dinheiro / PIX");
                setPaymentStatus("Pendente");
                setIsCreating(true);
              }}
              className="w-full sm:w-auto bg-secondary text-white px-6 py-2.5 rounded-[5px] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} />
              Novo Pedido
            </button>
            <div className="relative group w-full sm:w-48">
              <select
                className="w-full appearance-none bg-card border border-card-border hover:border-secondary/30 text-foreground text-xs font-black uppercase tracking-widest rounded-[5px] py-2.5 pl-10 pr-8 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary cursor-pointer transition-all shadow-sm"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="Todos">Filtro: Todos</option>
                <option value="Orçamento">Apenas Orçamentos</option>
                <option value="Venda">Apenas Vendas</option>
                <option value="Finalizado">Apenas Finalizados</option>
                <option value="Cancelado">Apenas Cancelados</option>
              </select>
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" size={16} />
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary border-b border-secondary/20">
              <tr>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10 text-center w-48">Ações</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">ID Interno</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">Emissão</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10">Cliente</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border-r border-white/10 text-center">Status</th>
                <th className="py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right">Valor Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/70">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-background/40 transition-all group cursor-pointer" onClick={() => handleEditOrder(order.id)}>
                  <td className="py-2 px-6 text-center border-r border-card-border/30">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditOrder(order.id); }}
                        className="p-1.5 text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all border border-transparent hover:border-secondary/20"
                        title="Ver Detalhes"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        className="p-1.5 text-muted hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all border border-transparent hover:border-emerald-100"
                        title="WhatsApp"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const phone = order.cliente?.phone?.replace(/\D/g, "");
                          if (!phone) {
                            alert("Cliente sem telefone cadastrado.");
                            return;
                          }
                          const text = encodeURIComponent(`Olá ${order.cliente?.name}, segue o orçamento ${order.id} no valor de R$ ${order.total.toFixed(2)}. Acesse o link para visualizar: ${window.location.origin}/pedidos/${order.id}/print`);
                          window.open(`https://wa.me/55${phone}?text=${text}`, "_blank");
                        }}
                      >
                        <MessageCircle size={16} />
                      </button>
                      <Link 
                        href={`/pedidos/${order.id}/print`}
                        className="p-1.5 text-muted hover:text-foreground hover:bg-background rounded-lg transition-all border border-transparent hover:border-card-border"
                        title="Imprimir"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Printer size={16} />
                      </Link>
                    </div>
                  </td>
                  <td className="py-2 px-6 border-r border-card-border/30">
                    <span className="font-mono text-xs font-black text-foreground/80 bg-background/50 border border-card-border px-2 py-0.5 rounded-md">{order.id}</span>
                  </td>
                  <td className="py-2 px-6 border-r border-card-border/30 text-xs font-medium text-muted">{order.date}</td>
                  <td className="py-2 px-6 border-r border-card-border/30">
                     <div className="flex flex-col">
                        <span className="font-medium text-foreground uppercase tracking-tight text-sm group-hover:text-secondary transition-colors">{order.cliente?.name || "Cliente Excluído"}</span>
                        <span className="text-[10px] text-muted font-medium">{order.cliente?.company || "Venda Direta"}</span>
                     </div>
                  </td>
                  <td className="py-2 px-6 border-r border-card-border/30 text-center">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border shadow-sm inline-block",
                      order.status === "Finalizado" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      order.status === "Pronto para Retirada" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      order.status === "Venda" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      order.status === "Backlog" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      order.status === "Em Produção" ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" :
                      order.status === "Revisão / Acabamento" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      order.status === "Orçamento" ? "bg-secondary/10 text-secondary border-secondary/20" :
                      "bg-rose-50 text-rose-700 border-rose-200"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-6 text-sm font-black text-foreground text-right">
                    R$ {order.total.toFixed(2)}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 px-6 text-center text-muted font-medium italic text-sm">
                    Nenhum registro de pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Paginação */}
          <div className="p-4 border-t border-card-border flex items-center justify-between bg-background/20">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest">
              Mostrando <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> de <span className="text-foreground">{filteredOrders.length}</span>
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
      </section>
    </div>
  );
}

function AutomationToggle({ label, active, onChange }: { label: string, active: boolean, onChange: (v: boolean) => void }) {
  return (
    <div 
      className="flex items-center justify-between py-3 border-b border-card-border last:border-0 cursor-pointer group"
      onClick={() => onChange(!active)}
    >
      <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", active ? "text-foreground" : "text-muted group-hover:text-foreground")}>{label}</span>
      <div className={cn(
        "w-10 h-5 rounded-full relative transition-all p-[3px]",
        active ? "bg-secondary shadow-lg shadow-secondary/30" : "bg-card-border group-hover:bg-muted/50"
      )}>
        <div className={cn(
          "h-3.5 w-3.5 bg-white rounded-full transition-all shadow-sm",
          active ? "translate-x-5" : "translate-x-0"
        )} />
      </div>
    </div>
  );
}
