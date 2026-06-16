"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const THEMES = [
  { 
    id: "modern", 
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      // 1. Tentar pegar o fallback rápido do cache local
      const saved = localStorage.getItem("erp-theme");
      if (saved) {
        try {
          const theme = JSON.parse(saved);
          if (theme && theme.vars) {
            Object.entries(theme.vars).forEach(([key, value]) => {
              document.documentElement.style.setProperty(key, value as string);
            });
          }
        } catch (e) {}
      }

      // 2. Buscar o tema real global da empresa do usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let compId = user.user_metadata?.empresa_id;
        if (!compId) {
          const { data: profile } = await supabase.from("perfis_usuarios").select("empresa_id").eq("id", user.id).single();
          compId = profile?.empresa_id;
        }

        if (compId) {
          const { data: empresa } = await supabase.from("empresas").select("tema").eq("id", compId).single();
          if (empresa?.tema) {
            const theme = THEMES.find(t => t.id === empresa.tema);
            if (theme) {
              Object.entries(theme.vars).forEach(([key, value]) => {
                document.documentElement.style.setProperty(key, value);
              });
              localStorage.setItem("erp-theme", JSON.stringify(theme));
            }
          }
        }
      }
      setMounted(true);
    }
    
    loadTheme();
  }, []);

  return <>{children}</>;
}
