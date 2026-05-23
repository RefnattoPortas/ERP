"use client";

import Link from "next/link";
import { 
  ArrowUpRight, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users, 
  Zap, 
  ShieldCheck, 
  Database
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f4] text-[#1c1917] selection:bg-[#059669] selection:text-white font-sans overflow-x-hidden relative transition-colors duration-500">
      
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Top Navigation */}
      <nav className="border-b border-[#d6d3d1] py-6 px-6 sm:px-12 flex items-center justify-between relative z-10 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#059669] flex items-center justify-center border-2 border-[#1c1917] shadow-[2px_2px_0px_#d6d3d1] rounded-[4px]">
            <Zap className="text-white w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="font-black text-lg tracking-[-0.05em] uppercase text-[#1c1917]">
            AGIL <span className="text-[#059669]">ERP</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-white border border-[#d6d3d1] px-3.5 py-2 rounded-[5px] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#44403c]/80">BANCO DE DADOS LIMPO</span>
          </div>
          
          <Link 
            href="/login" 
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white text-[#1c1917] hover:text-[#059669] border border-[#d6d3d1] hover:border-[#059669] px-5 py-2.5 rounded-[5px] hover:bg-emerald-50/50 shadow-sm hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300"
          >
            Entrar <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-28 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Massive Outline Text Background */}
        <div className="select-none pointer-events-none absolute left-1/2 -translate-x-1/2 top-4 w-full text-center overflow-hidden z-0">
          <span className="text-[14vw] font-black leading-none uppercase tracking-tighter text-transparent" style={{ WebkitTextStroke: "1.5px rgba(28,25,23,0.03)" }}>
            AGIL ERP
          </span>
        </div>

        {/* Hero Tagline */}
        <div className="inline-flex items-center gap-2 bg-[#059669]/10 border border-[#059669]/20 px-4 py-2 text-[#059669] mb-8 mt-8 rounded-[5px] relative z-10">
          <Database className="w-3.5 h-3.5" />
          <span className="text-[9px] font-black uppercase tracking-[0.25em]">Base de dados totalmente redefinida e pronta</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] max-w-5xl mb-8 relative z-10 text-[#1c1917]">
          A GESTÃO DO SEU NEGÓCIO. <br />
          <span className="text-transparent" style={{ WebkitTextStroke: "2.5px #1c1917" }}>DESCOMPLICADA.</span> <br />
          <span className="text-[#059669]">EFICIENTE.</span>
        </h1>

        {/* Description */}
        <p className="text-[#44403c] text-sm sm:text-lg max-w-2xl font-bold mb-12 leading-relaxed relative z-10 opacity-90">
          Acesse uma plataforma de gestão integrada projetada especificamente para micro e pequenas empresas. Controle orçamentos, estoque, fluxo de caixa e clientes com velocidade extrema e zero distrações.
        </p>

        {/* Main CTA - Premium Epic Button */}
        <div className="relative z-10 mb-20">
          <Link 
            href="/cadastro"
            className="group inline-flex items-center gap-3 bg-[#059669] text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] px-10 py-5.5 rounded-[5px] shadow-xl shadow-emerald-700/20 hover:shadow-emerald-700/40 hover:bg-[#047857] hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            Começar Grátis / Criar Conta
            <ArrowUpRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Visual Info Bar (Fita Adesiva Industrial Estilizada no Tema Nature Eco) */}
        <div className="w-full bg-white text-[#1c1917] py-4.5 px-6 border border-[#d6d3d1] rounded-[5px] shadow-sm relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mb-24">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#059669] stroke-[2.5]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#1c1917]">Aviso de Configuração</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-wide text-center text-[#44403c]">
            🔔 Todos os dados do banco Playarts foram excluídos. O sistema está totalmente limpo para uso comercial.
          </div>
          <div className="text-[10px] font-black uppercase border border-[#059669] text-[#059669] bg-emerald-50 px-3 py-1 rounded-[5px]">
            Status: Pronto
          </div>
        </div>

        {/* Section: Features (Grid Fragmentado Assimétrico) */}
        <section className="w-full max-w-6xl relative z-10">
          <div className="text-left mb-12">
            <p className="text-[#059669] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Recursos Integrados</p>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1c1917]">Módulos de Controle Operacional</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Feature 1: Large (Vendas) */}
            <div className="md:col-span-7 bg-white border border-[#d6d3d1] rounded-[5px] p-8 text-left hover:border-[#059669] hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-[#059669] flex items-center justify-center rounded-[5px] mb-6 group-hover:bg-[#059669]/10 group-hover:border-[#059669]/20 transition-all duration-300">
                  <ShoppingCart className="w-6 h-6 text-[#059669]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-[#1c1917] group-hover:text-[#059669] transition-colors duration-300">Pedidos e Orçamentos</h3>
                <p className="text-xs text-[#44403c] leading-relaxed max-w-md font-bold opacity-80">
                  Gere orçamentos e pedidos de venda em segundos. Converta propostas em vendas ativas instantaneamente e controle o fluxo de entrega de itens.
                </p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#059669] mt-6 flex items-center gap-1.5">
                Módulo Ativo <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
              </div>
            </div>

            {/* Feature 2: Small (Estoque) */}
            <div className="md:col-span-5 bg-white border border-[#d6d3d1] rounded-[5px] p-8 text-left hover:border-[#059669] hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-[#059669] flex items-center justify-center rounded-[5px] mb-6 group-hover:bg-[#059669]/10 group-hover:border-[#059669]/20 transition-all duration-300">
                  <Package className="w-6 h-6 text-[#059669]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-[#1c1917] group-hover:text-[#059669] transition-colors duration-300">Controle de Estoque</h3>
                <p className="text-xs text-[#44403c] leading-relaxed font-bold opacity-80">
                  Gerencie o estoque com alertas automáticos para itens abaixo do limite mínimo de segurança, garantindo que você nunca perca uma venda.
                </p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#059669] mt-6 flex items-center gap-1.5">
                Módulo Ativo <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
              </div>
            </div>

            {/* Feature 3: Small (Financeiro) */}
            <div className="md:col-span-5 bg-white border border-[#d6d3d1] rounded-[5px] p-8 text-left hover:border-[#059669] hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-[#059669] flex items-center justify-center rounded-[5px] mb-6 group-hover:bg-[#059669]/10 group-hover:border-[#059669]/20 transition-all duration-300">
                  <DollarSign className="w-6 h-6 text-[#059669]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-[#1c1917] group-hover:text-[#059669] transition-colors duration-300">Gestão Financeira</h3>
                <p className="text-xs text-[#44403c] leading-relaxed font-bold opacity-80">
                  Monitore suas receitas e despesas com lançamentos claros de fluxo de caixa, controle de pagamentos pendentes e visibilidade financeira em tempo real.
                </p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#059669] mt-6 flex items-center gap-1.5">
                Módulo Ativo <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
              </div>
            </div>

            {/* Feature 4: Large (Clientes) */}
            <div className="md:col-span-7 bg-white border border-[#d6d3d1] rounded-[5px] p-8 text-left hover:border-[#059669] hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-[#059669] flex items-center justify-center rounded-[5px] mb-6 group-hover:bg-[#059669]/10 group-hover:border-[#059669]/20 transition-all duration-300">
                  <Users className="w-6 h-6 text-[#059669]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-[#1c1917] group-hover:text-[#059669] transition-colors duration-300">Cadastro de Clientes</h3>
                <p className="text-xs text-[#44403c] leading-relaxed max-w-md font-bold opacity-80">
                  Mantenha uma base sólida de dados de contato de seus clientes, com histórico integrado de pedidos e controle de adimplência.
                </p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#059669] mt-6 flex items-center gap-1.5">
                Módulo Ativo <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#d6d3d1] py-12 px-6 sm:px-12 text-center text-xs text-[#44403c] bg-white relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-[-0.05em] uppercase text-[#1c1917]">
              AGIL <span className="text-[#059669]">ERP</span>
            </span>
            <span className="text-[#d6d3d1]">|</span>
            <span className="font-bold opacity-80">Gestão Ágil para Micro e Pequenas Empresas</span>
          </div>
          <div className="font-bold opacity-80">
            © {new Date().getFullYear()} Agil ERP. Todos os direitos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
}
