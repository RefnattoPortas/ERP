"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-background transition-colors duration-500 relative">
        
        {/* Backdrop para mobile */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-all duration-300 animate-in fade-in"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar com controle de estado mobile */}
        <Sidebar isOpenMobile={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

        {/* Área principal do conteúdo */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Cabeçalho mobile */}
          <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-card-border sticky top-0 z-30 transition-colors">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 hover:bg-foreground/5 text-foreground rounded-lg transition-all cursor-pointer"
              aria-label="Abrir Menu"
            >
              <Menu size={22} />
            </button>
            <span className="font-black text-sm text-foreground tracking-tighter uppercase">AGIL ERP</span>
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-black text-xs shadow-sm">
              E
            </div>
          </header>

          {/* Conteúdo da página */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto animate-in fade-in duration-500 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

