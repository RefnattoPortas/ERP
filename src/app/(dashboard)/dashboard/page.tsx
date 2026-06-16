"use client";

import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  CreditCard, 
  PackageSearch,
  ChevronRight,
  ArrowRight,
  PlusCircle,
  Receipt,
  Boxes,
  Users,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardStats } from "../actions";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"pedidos" | "lembretes">("pedidos");
  const [stats, setStats] = useState<{
    saldo: number;
    vendasMes: number;
    contasHoje: number;
    estoqueCritico: number;
    recentOrders: Array<{
      id: string;
      total: number;
      status: string;
      date: string;
      cliente: { name: string } | null;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getDashboardStats();
      setStats(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const now = new Date();
  const dayName = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

  return (
    <div className="space-y-8 max-w-7xl mx-auto transition-colors duration-500">
      {/* Header */}
      <header className="flex flex-col gap-1 border-b border-card-border pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase tracking-tighter">
          Inicial
        </h1>
        <p className="text-muted text-sm font-medium">Visão geral do seu negócio hoje, {dayName}.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left/Main Content - Spans 3 columns */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* Quick Access Row */}
          <section>
            <h2 className="text-[11px] font-black text-muted mb-4 uppercase tracking-[0.2em]">Acesso Rápido</h2>
            <div className="flex flex-wrap gap-4">
              <ActionButtonSquare icon={PlusCircle} label="Orçamento" shortcut="Alt+N" />
              <ActionButtonSquare icon={Receipt} label="Despesa" shortcut="Alt+D" />
              <ActionButtonSquare icon={Boxes} label="Estoque" shortcut="Alt+E" />
              <ActionButtonSquare icon={Users} label="Cliente" shortcut="Alt+C" />
            </div>
          </section>

          {/* Recent Orders & Reminders Tabs */}
          <section className="space-y-4">
            <div className="flex justify-between items-center pb-0 border-b border-card-border/50">
              <div className="flex gap-6">
                <button 
                  onClick={() => setActiveTab("pedidos")}
                  className={cn(
                    "text-[11px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-colors -mb-[1px]",
                    activeTab === "pedidos" ? "border-secondary text-secondary" : "border-transparent text-muted hover:text-foreground"
                  )}
                >
                  Pedidos Recentes
                </button>
                <button 
                  onClick={() => setActiveTab("lembretes")}
                  className={cn(
                    "text-[11px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-colors -mb-[1px]",
                    activeTab === "lembretes" ? "border-secondary text-secondary" : "border-transparent text-muted hover:text-foreground"
                  )}
                >
                  Lembretes
                </button>
              </div>
              <button className="text-secondary hover:text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors pb-3">
                Ver todos <ArrowRight size={12} />
              </button>
            </div>
            
            <div className="bg-card border-2 border-card-border rounded-2xl p-2 sm:p-4 shadow-sm">
              <div className="space-y-1.5">
                {activeTab === "pedidos" && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {isLoading ? (
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest text-center py-8 italic">Carregando dados reais...</p>
                    ) : stats?.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order: { id: string; cliente: { name: string } | null; total: number; status: string; date: string }) => (
                        <div key={order.id} className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-background transition-colors cursor-pointer border border-transparent hover:border-card-border group">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-7 h-7 rounded-full bg-background flex-shrink-0 flex items-center justify-center border border-card-border group-hover:border-secondary/30 transition-colors shadow-sm">
                              <ArrowUpRight size={14} className="text-muted group-hover:text-secondary" />
                            </div>
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-bold text-foreground text-xs whitespace-nowrap">{order.id}</span>
                              <span className="text-[10px] text-muted font-medium truncate hidden sm:inline-block">— {order.cliente?.name || "Sem Cliente"}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest hidden md:block px-2 py-0.5 rounded border",
                              order.status === "Finalizado" ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                              order.status === "Venda" ? "text-blue-600 bg-blue-50 border-blue-100" :
                              "text-amber-600 bg-amber-50 border-amber-100"
                            )}>
                              {order.status}
                            </span>
                            <span className="font-bold text-foreground text-xs sm:w-24 text-right">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest text-center py-8 italic">Nenhum pedido recente encontrado.</p>
                    )}
                  </div>
                )}

                {activeTab === "lembretes" && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {[
                      { title: "Ligar para fornecedor", time: "Hoje, 14:00", type: "urgente" },
                      { title: "Revisar metas do mês", time: "Amanhã, 09:00", type: "normal" },
                      { title: "Pagamento de aluguel", time: "Dia 05", type: "alerta" },
                    ].map((lembrete, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-background transition-colors cursor-pointer border border-transparent hover:border-card-border group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-7 h-7 rounded-full bg-background flex-shrink-0 flex items-center justify-center border border-card-border group-hover:border-secondary/30 transition-colors shadow-sm">
                            <Clock size={14} className="text-muted group-hover:text-secondary" />
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-bold text-foreground text-xs whitespace-nowrap">{lembrete.title}</span>
                            <span className="text-[10px] text-muted font-medium truncate hidden sm:inline-block">— {lembrete.time}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {lembrete.type === "urgente" && <span className="text-[9px] text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Urgente</span>}
                          {lembrete.type === "alerta" && <span className="text-[9px] text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Importante</span>}
                          {lembrete.type === "normal" && <span className="text-[9px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Aviso</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Content - Spans 1 column (Cards slider) */}
        <div className="lg:col-span-1 flex flex-col">
          <h2 className="text-[11px] font-black text-muted mb-4 uppercase tracking-[0.2em]">Indicadores</h2>
          <div className="flex flex-col gap-3">
            <StatCard 
              icon={CreditCard} 
              label="Saldo Disponível" 
              value={`R$ ${stats?.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "0,00"}`} 
              trend="Balanço" 
              color="blue" 
            />
            <StatCard 
              icon={TrendingUp} 
              label="Vendas (Mês)" 
              value={`R$ ${stats?.vendasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "0,00"}`} 
              trend="Consolidado" 
              color="emerald" 
            />
            <StatCard 
              icon={AlertCircle} 
              label="Contas Hoje" 
              value={`R$ ${stats?.contasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "0,00"}`} 
              trend="Pagar" 
              color="rose" 
              isAlert={stats?.contasHoje > 0}
            />
            <StatCard 
              icon={PackageSearch} 
              label="Estoque Crítico" 
              value={`${stats?.estoqueCritico || 0} itens`} 
              trend="Reposição" 
              color="amber" 
            />
          </div>
          
          <div className="mt-8 flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
            <AlertCircle size={20} />
            <div className="leading-tight">
              <p className="text-[10px] font-black uppercase tracking-widest">Estado</p>
              <p className="text-xs font-bold">Sistema Online</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color, 
  isAlert = false 
}: { 
  icon: ElementType, 
  label: string, 
  value: string, 
  trend: string, 
  color: "blue" | "emerald" | "rose" | "amber",
  isAlert?: boolean 
}) {
  const colorMap = {
    blue: { icon: "text-blue-600 bg-blue-50 border-blue-200", shadow: "hover:shadow-blue-500/30 shadow-blue-500/5 border-blue-100" },
    emerald: { icon: "text-emerald-600 bg-emerald-50 border-emerald-200", shadow: "hover:shadow-emerald-500/30 shadow-emerald-500/5 border-emerald-100" },
    rose: { icon: "text-rose-600 bg-rose-50 border-rose-200", shadow: "hover:shadow-rose-500/30 shadow-rose-500/5 border-rose-100" },
    amber: { icon: "text-amber-600 bg-amber-50 border-amber-200", shadow: "hover:shadow-amber-500/30 shadow-amber-500/5 border-amber-100" },
  };
  const theme = colorMap[color];

  return (
    <div className={cn(
      "bg-card border-2 shadow-sm rounded-2xl p-4 flex items-center justify-between transition-all duration-300 group hover:scale-[1.02] hover:z-10",
      theme.shadow
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-xl border-2 transition-colors", theme.icon)}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-muted text-[10px] font-black uppercase tracking-widest">{label}</p>
          <p className="text-base font-black tracking-tight text-foreground">{value}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={cn(
          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border-2", 
          isAlert ? "text-rose-700 bg-rose-50 border-rose-200 animate-pulse" : "text-muted bg-background border-card-border"
        )}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function ActionButtonSquare({ icon: Icon, label, shortcut }: { icon: ElementType, label: string, shortcut: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-2 w-24 sm:w-28 h-24 sm:h-28 rounded-2xl border-2 border-card-border bg-card hover:border-secondary hover:shadow-md hover:shadow-secondary/5 transition-all group text-center cursor-pointer">
      <div className="p-2 rounded-full bg-background border-2 border-card-border group-hover:bg-secondary/10 group-hover:border-secondary/20 transition-colors">
        <Icon size={20} className="text-muted group-hover:text-secondary transition-colors" />
      </div>
      <span className="text-xs font-bold text-foreground group-hover:text-secondary leading-tight">{label}</span>
      <span className="text-[9px] bg-background border border-card-border px-1.5 py-0.5 rounded-md text-muted font-black tracking-tighter opacity-70 group-hover:opacity-100">
        {shortcut}
      </span>
    </button>
  );
}
