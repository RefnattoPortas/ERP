"use client";

import { useState, useEffect } from "react";
import { 
  Palette, 
  Bell, 
  Shield, 
  Database, 
  CheckCircle2,
  Monitor,
  Moon,
  Sun,
  Layout,
  Building2,
  FileText,
  Upload,
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getConfiguracoes, saveConfiguracoes } from "./actions";

const THEMES = [
  { 
    id: "modern", 
    name: "Moderno (Padrão)", 
    description: "Interface limpa com tons de cinza e azul royal.", 
    colors: ["bg-white", "bg-blue-600", "bg-gray-100"],
    vars: { 
      "--background": "#f9fafb", 
      "--secondary": "#2563EB", 
      "--foreground": "#111827", 
      "--primary": "#111827",
      "--card": "#ffffff",
      "--card-border": "#d1d5db",
      "--sidebar": "#111827",
      "--sidebar-foreground": "#ffffff"
    }
  },
  { 
    id: "dark-premium", 
    name: "Dark Premium", 
    description: "Fundo grafite profundo com detalhes em dourado.", 
    colors: ["bg-gray-900", "bg-amber-500", "bg-gray-800"],
    vars: { 
      "--background": "#0f172a", 
      "--secondary": "#f59e0b", 
      "--foreground": "#f8fafc", 
      "--primary": "#1e293b",
      "--card": "#1e293b",
      "--card-border": "#334155",
      "--sidebar": "#0f172a",
      "--sidebar-foreground": "#f8fafc"
    }
  },
  { 
    id: "midnight-orchid", 
    name: "Midnight Orchid", 
    description: "Elegante e sofisticado com tons de orquídea e ametista.", 
    colors: ["bg-slate-950", "bg-fuchsia-500", "bg-slate-900"],
    vars: { 
      "--background": "#020617", 
      "--secondary": "#d946ef", 
      "--foreground": "#f8fafc", 
      "--primary": "#1e1b4b",
      "--card": "#0f172a",
      "--card-border": "#1e293b",
      "--sidebar": "#020617",
      "--sidebar-foreground": "#f8fafc"
    }
  },
  { 
    id: "obsidian-gold", 
    name: "Obsidian Gold", 
    description: "Luxo absoluto em preto absoluto e ouro escovado.", 
    colors: ["bg-black", "bg-yellow-600", "bg-zinc-900"],
    vars: { 
      "--background": "#000000", 
      "--secondary": "#ca8a04", 
      "--foreground": "#fafafa", 
      "--primary": "#18181b",
      "--card": "#09090b",
      "--card-border": "#27272a",
      "--sidebar": "#000000",
      "--sidebar-foreground": "#fafafa"
    }
  },
  { 
    id: "nature", 
    name: "Nature Eco", 
    description: "Paleta relaxante com tons de verde oliva e terracota.", 
    colors: ["bg-stone-50", "bg-emerald-600", "bg-orange-700"],
    vars: { 
      "--background": "#f5f5f4", 
      "--secondary": "#059669", 
      "--foreground": "#1c1917", 
      "--primary": "#44403c",
      "--card": "#ffffff",
      "--card-border": "#d6d3d1",
      "--sidebar": "#1c1917",
      "--sidebar-foreground": "#f5f5f4"
    }
  },
  { 
    id: "corporate", 
    name: "Corporativo", 
    description: "Foco total em legibilidade com azul marinho profundo.", 
    colors: ["bg-slate-50", "bg-indigo-900", "bg-white"],
    vars: { 
      "--background": "#f8fafc", 
      "--secondary": "#1e1b4b", 
      "--foreground": "#0f172a", 
      "--primary": "#1e293b",
      "--card": "#ffffff",
      "--card-border": "#cbd5e1",
      "--sidebar": "#0f172a",
      "--sidebar-foreground": "#f8fafc"
    }
  },
  { 
    id: "glassmorphism", 
    name: "Glassmorphism", 
    description: "Efeitos de transparência e desfoque com cores vibrantes.", 
    colors: ["bg-white/30", "bg-purple-500", "bg-pink-500"],
    vars: { 
      "--background": "#fdf4ff", 
      "--secondary": "#a855f7", 
      "--foreground": "#1e1b4b", 
      "--primary": "#1e1b4b",
      "--card": "rgba(255, 255, 255, 0.7)",
      "--card-border": "rgba(0, 0, 0, 0.1)",
      "--sidebar": "#1e1b4b",
      "--sidebar-foreground": "#ffffff"
    }
  },
];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("temas");
  const [activeTheme, setActiveTheme] = useState("modern");
  const [isApplied, setIsApplied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [config, setConfig] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    logradouro: "",
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
    telefone: "",
    email: "",
    logoUrl: "",
    validadeOrcamento: 15,
    formasPagamento: "",
    observacoesPadrao: ""
  });

  const applyTheme = () => {
    const theme = THEMES.find(t => t.id === activeTheme);
    if (theme) {
      Object.entries(theme.vars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      localStorage.setItem("erp-theme", JSON.stringify(theme));
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 3000);
    }
  };

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem("erp-theme");
    if (saved) {
      const theme = JSON.parse(saved);
      setActiveTheme(theme.id);
    }

    async function loadConfig() {
      const data = await getConfiguracoes();
      if (data) {
        // Garantir que nenhum campo seja null para evitar erros no React
        const safeData = { ...data } as any;
        Object.keys(safeData).forEach(key => {
          if (safeData[key] === null) safeData[key] = "";
        });
        setConfig(safeData);
      }
    }
    loadConfig();
  }, []);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    const res = await saveConfiguracoes(config);
    setIsSaving(false);
    if (res.success) {
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 3000);
    } else {
      alert("Erro ao salvar configurações");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12 transition-colors duration-500">
      <header className="py-4">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-3 uppercase tracking-tighter">
          <Palette className="text-secondary" size={24} />
          Configurações do Sistema
        </h1>
        <p className="text-muted text-xs mt-1 font-medium italic">Personalize a sua experiência e gerencie as preferências do ERP.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Mini Settings */}
        <aside className="space-y-1">
          {[
            { id: "temas", icon: Palette, label: "TEMAS" },
            { id: "empresa", icon: Building2, label: "EMPRESA" },
            { id: "orcamentos", icon: FileText, label: "ORÇAMENTOS" },
            { id: "notificacoes", icon: Bell, label: "NOTIFICAÇÕES" },
            { id: "seguranca", icon: Shield, label: "SEGURANÇA" },
            { id: "backup", icon: Database, label: "BACKUP E DADOS" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-[5px] text-[10px] font-black transition-all tracking-[0.15em] uppercase text-left",
                activeTab === tab.id 
                  ? "bg-card text-foreground shadow-sm border border-card-border" 
                  : "text-muted hover:bg-card/30 hover:text-foreground border border-transparent"
              )}
            >
              <tab.icon size={14} className={activeTab === tab.id ? "text-secondary" : "text-muted"} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="md:col-span-3 space-y-6">
          {activeTab === "temas" && (
            <section className="bg-card border border-card-border shadow-sm rounded-[5px] overflow-hidden">
              <div className="p-4 border-b border-card-border bg-background/30">
                 <h2 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">GALERIA DE TEMAS</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 gap-3 overflow-y-auto max-h-[500px] custom-scrollbar">
                {THEMES.map((theme) => (
                  <div 
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={cn(
                      "relative flex items-center gap-6 p-4 rounded-[5px] border cursor-pointer transition-all hover:shadow-sm",
                      activeTheme === theme.id 
                        ? "border-secondary bg-secondary/5 ring-1 ring-secondary/20 shadow-inner" 
                        : "border-card-border bg-background/30 hover:border-secondary/30"
                    )}
                  >
                    <div className="flex -space-x-2 shrink-0">
                      {theme.colors.map((c, i) => (
                        <div key={i} className={cn("w-8 h-8 rounded-full border-2 border-card shadow-sm", c)} />
                      ))}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-black text-foreground text-[10px] uppercase tracking-widest">{theme.name}</h3>
                      <p className="text-muted text-[9px] font-bold mt-0.5 leading-relaxed uppercase tracking-tight opacity-70">{theme.description}</p>
                    </div>

                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-all shadow-sm",
                      activeTheme === theme.id ? "bg-secondary border-secondary" : "border-card-border bg-card"
                    )}>
                      {activeTheme === theme.id && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-background/30 border-t border-card-border flex justify-end items-center gap-4">
                {isApplied && <span className="text-emerald-600 text-[10px] font-black animate-pulse uppercase tracking-[0.2em]">✓ TEMA APLICADO</span>}
                <button 
                  onClick={applyTheme}
                  className="bg-secondary text-white px-8 py-3 rounded-[5px] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-secondary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  ATIVAR ESTILO
                </button>
              </div>
            </section>
          )}

          {activeTab === "empresa" && (
            <section className="bg-card border border-card-border shadow-sm rounded-[5px] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-4 border-b border-card-border bg-background/30">
                 <h2 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">DADOS DA EMPRESA</h2>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Logo Upload Section */}
                <div className="flex items-start gap-8 border-b border-card-border pb-8">
                  <div className="w-32 h-32 rounded-2xl bg-background border-2 border-dashed border-card-border flex flex-col items-center justify-center gap-2 group hover:border-secondary transition-all cursor-pointer overflow-hidden relative">
                    {config.logoUrl ? (
                      <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <>
                        <Upload size={24} className="text-muted group-hover:text-secondary transition-colors" />
                        <span className="text-[8px] font-black text-muted uppercase tracking-widest text-center px-4">Upload Logo (PNG/JPG)</span>
                      </>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Identidade Visual</h3>
                    <p className="text-[10px] text-muted font-bold leading-relaxed uppercase tracking-tight max-w-md">
                      Esta imagem será exibida no cabeçalho dos seus orçamentos e relatórios impressos. Recomendamos fundo transparente.
                    </p>
                    <div className="flex gap-2">
                       <button className="text-[10px] font-black text-secondary hover:bg-secondary/10 px-4 py-2 rounded-lg border border-secondary/20 transition-all uppercase tracking-widest">ALTERAR LOGO</button>
                       <button className="text-[10px] font-black text-muted hover:text-rose-500 px-4 py-2 transition-all uppercase tracking-widest">REMOVER</button>
                    </div>
                  </div>
                </div>

                {/* Info Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Building2 size={12} className="text-secondary" /> RAZÃO SOCIAL
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="Ex: Refnatto Vidros Premium LTDA"
                      value={config.razaoSocial || ""}
                      onChange={(e) => setConfig({...config, razaoSocial: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Building2 size={12} className="text-secondary" /> NOME FANTASIA
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="Ex: Refnatto Vidros"
                      value={config.nomeFantasia || ""}
                      onChange={(e) => setConfig({...config, nomeFantasia: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Shield size={12} className="text-secondary" /> CNPJ / CPF
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="00.000.000/0001-00"
                      value={config.cnpj || ""}
                      onChange={(e) => setConfig({...config, cnpj: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Phone size={12} className="text-secondary" /> WHATSAPP / TELEFONE
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="(00) 00000-0000"
                      value={config.telefone || ""}
                      onChange={(e) => setConfig({...config, telefone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-secondary" /> LOGRADOURO (RUA, Nº, COMPLEMENTO)
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="Rua Exemplo, 123 - Sala 01"
                      value={config.logradouro || ""}
                      onChange={(e) => setConfig({...config, logradouro: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-secondary" /> BAIRRO
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="Centro"
                      value={config.bairro || ""}
                      onChange={(e) => setConfig({...config, bairro: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-secondary" /> CEP
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="00000-000"
                      value={config.cep || ""}
                      onChange={(e) => setConfig({...config, cep: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Globe size={12} className="text-secondary" /> CIDADE
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="São Paulo"
                      value={config.cidade || ""}
                      onChange={(e) => setConfig({...config, cidade: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Globe size={12} className="text-secondary" /> ESTADO (UF)
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="SP"
                      value={config.estado || ""}
                      onChange={(e) => setConfig({...config, estado: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Mail size={12} className="text-secondary" /> E-MAIL DE CONTATO
                    </label>
                    <input 
                      type="email" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="contato@suaempresa.com"
                      value={config.email || ""}
                      onChange={(e) => setConfig({...config, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-background/30 border-t border-card-border flex justify-end items-center gap-4">
                {isApplied && <span className="text-emerald-600 text-[10px] font-black animate-pulse uppercase tracking-[0.2em]">✓ SALVO COM SUCESSO</span>}
                <button 
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="bg-secondary text-white px-8 py-3 rounded-[5px] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-secondary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={14} />
                  {isSaving ? "SALVANDO..." : "SALVAR PERFIL"}
                </button>
              </div>
            </section>
          )}

          {activeTab === "orcamentos" && (
            <section className="bg-card border border-card-border shadow-sm rounded-[5px] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-4 border-b border-card-border bg-background/30">
                 <h2 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">PADRÕES DE ORÇAMENTO</h2>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} className="text-secondary" /> VALIDADE DA PROPOSTA (DIAS)
                    </label>
                    <input 
                      type="number" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      value={config.validadeOrcamento}
                      onChange={(e) => setConfig({...config, validadeOrcamento: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <CreditCard size={12} className="text-secondary" /> FORMAS DE PAGAMENTO PADRÃO
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                      placeholder="Ex: 50% entrada + 50% na entrega"
                      value={config.formasPagamento || ""}
                      onChange={(e) => setConfig({...config, formasPagamento: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={12} className="text-secondary" /> OBSERVAÇÕES GERAIS / GARANTIA
                    </label>
                    <textarea 
                      rows={6}
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none"
                      placeholder="Termos de garantia, prazos de entrega específicos, etc..."
                      value={config.observacoesPadrao || ""}
                      onChange={(e) => setConfig({...config, observacoesPadrao: e.target.value})}
                    />
                  </div>
                </div>

                <div className="bg-secondary/5 p-6 rounded-xl border border-secondary/20 flex items-start gap-4">
                   <div className="p-2 bg-secondary/10 rounded-lg">
                      <FileText className="text-secondary" size={20} />
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-foreground uppercase tracking-tight mb-1">Dica de Conversão</h4>
                      <p className="text-[10px] text-muted font-bold leading-relaxed uppercase tracking-tight opacity-80">
                        Orçamentos bem detalhados e com termos claros transmitem mais segurança ao cliente e aumentam em até 40% a taxa de fechamento.
                      </p>
                   </div>
                </div>
              </div>

              <div className="p-4 bg-background/30 border-t border-card-border flex justify-end items-center gap-4">
                {isApplied && <span className="text-emerald-600 text-[10px] font-black animate-pulse uppercase tracking-[0.2em]">✓ SALVO COM SUCESSO</span>}
                <button 
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="bg-secondary text-white px-8 py-3 rounded-[5px] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-secondary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={14} />
                  {isSaving ? "SALVANDO..." : "SALVAR PADRÕES"}
                </button>
              </div>
            </section>
          )}

          {/* Quick Preview */}
          <div className="bg-card border border-card-border rounded-[5px] p-4 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-4">
                <div className="p-2.5 bg-secondary/10 rounded-[5px] border border-secondary/20">
                   <Layout className="text-secondary" size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Configuração Visual</p>
                   <p className="text-xs font-bold text-foreground uppercase tracking-tight">Interface Otimizada para Retenção de Foco</p>
                </div>
             </div>
             <button className="text-[10px] font-black text-secondary hover:underline uppercase tracking-widest">Ajustar Layout</button>
          </div>
        </main>
      </div>
    </div>
  );
}
