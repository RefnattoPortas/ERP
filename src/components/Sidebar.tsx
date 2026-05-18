"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getConfiguracoes } from "@/app/(dashboard)/configuracoes/actions";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  ClipboardList, 
  Calendar as CalendarIcon,
  Settings,
  Menu, 
  X, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Inicial", href: "/" },
  { icon: ShoppingCart, label: "Pedidos", href: "/pedidos" },
  { icon: Package, label: "Estoque", href: "/estoque" },
  { icon: ClipboardList, label: "Kanban", href: "/kanban" },
  { icon: DollarSign, label: "Financeiro", href: "/financeiro" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: CalendarIcon, label: "Calendário", href: "/calendario" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [companyName, setCompanyName] = useState("ERP SISTEMA");
  const pathname = usePathname();

  useEffect(() => {
    async function load() {
      const config = await getConfiguracoes();
      if (config && (config.nomeFantasia || config.razaoSocial)) {
        setCompanyName(config.nomeFantasia || config.razaoSocial || "ERP SISTEMA");
      }
    }
    load();
  }, [pathname]); // Recarregar quando mudar de página pode ajudar a manter atualizado

  return (
    <aside 
      className={cn(
        "bg-sidebar border-r border-card-border sticky top-0 h-screen transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between border-b border-card-border">
        {!isCollapsed && <span className="font-black text-xl text-sidebar-foreground tracking-tighter uppercase">AGIL ERP</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-white/10 text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-lg transition-all cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1">
        {menuItems.map((item) => {
          const isExactActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-[5px] transition-all font-black text-[10px] uppercase tracking-widest",
                isExactActive 
                  ? "bg-white/10 text-white shadow-inner" 
                  : "text-sidebar-foreground/50 hover:bg-white/5 hover:text-sidebar-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon size={18} className={cn(isExactActive ? "text-secondary" : "opacity-70")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="flex flex-col gap-6">
          {!isCollapsed && (
             <div className="bg-white/5 border border-white/10 rounded-[5px] p-4 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-all">
                <div className="overflow-hidden">
                   <p className="text-[8px] text-sidebar-foreground/40 font-black tracking-[0.2em] uppercase mb-1">Empresa Ativa</p>
                   <p className="text-xs font-black truncate text-sidebar-foreground uppercase tracking-tight">{companyName}</p>
                </div>
                <ChevronRight size={14} className="text-sidebar-foreground/40" />
             </div>
          )}
          
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-black text-sm shadow-lg shadow-secondary/20 border-2 border-sidebar">
              R
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-black text-sidebar-foreground truncate uppercase tracking-tight">Renato Luis</p>
                <p className="text-[10px] text-sidebar-foreground/50 truncate font-bold uppercase tracking-widest">Administrador</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
