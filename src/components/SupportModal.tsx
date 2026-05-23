"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Send, Loader2, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState<{ userId: string; companyId: string } | null>(null);

  // Carregar dados de autenticação e inquilino ao montar
  useEffect(() => {
    async function getUserDetails() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Usuário não autenticado no sistema.");
        }

        // Tentar ler empresa_id dos metadados do Auth
        let companyId = user.user_metadata?.empresa_id;

        // Fallback: Se não estiver nos metadados, consultar a tabela de perfis
        if (!companyId) {
          const { data: profile, error: profileError } = await supabase
            .from("perfis_usuarios")
            .select("empresa_id")
            .eq("id", user.id)
            .single();

          if (profileError || !profile) {
            throw new Error("Não foi possível carregar as informações do seu inquilino ERP.");
          }
          companyId = profile.empresa_id;
        }

        setUserInfo({ userId: user.id, companyId });
      } catch (err: unknown) {
        console.error("Erro ao obter dados do usuário para suporte:", err);
        setError("Para abrir chamados de suporte, certifique-se de estar logado corretamente.");
      }
    }

    if (isOpen) {
      getUserDetails();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) {
      setError("Por favor, digite sua mensagem antes de enviar.");
      return;
    }

    if (!userInfo) {
      setError("Erro de sessão: Informações de usuário não carregadas. Tente novamente.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Inserir o chamado diretamente na tabela chamados_suporte no Supabase
      const { error: insertError } = await supabase
        .from("chamados_suporte")
        .insert({
          empresa_id: userInfo.companyId,
          usuario_id: userInfo.userId,
          mensagem: mensagem.trim(),
          status: "aberto",
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setMensagem("");
      
      // Fechar modal após sucesso breve
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);

    } catch (err: unknown) {
      console.error("Erro ao criar chamado de suporte:", err);
      setError(err instanceof Error ? err.message : "Erro ao conectar com o servidor do Supabase. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="w-full max-w-lg bg-[#1c1917] border border-white/10 text-[#f5f5f4] shadow-2xl relative animate-in zoom-in-95 duration-200 rounded-[2px]"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#059669]/10 border border-[#059669]/20 text-[#059669] flex items-center justify-center rounded-[2px]">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Central de Suporte</h3>
              <p className="text-[10px] text-[#a8a29e] font-bold">Abra chamados para suporte operacional técnico</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 text-[#a8a29e] hover:text-white rounded-[2px] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 mb-5 flex items-start gap-2.5 rounded-[2px] animate-shake">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-400" />
              <div className="text-[11px] font-bold leading-normal">{error}</div>
            </div>
          )}

          {success && (
            <div className="bg-[#059669]/10 border border-[#059669]/20 text-[#34d399] p-4 mb-5 flex items-center gap-3 rounded-[2px]">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#34d399] animate-bounce" />
              <div className="text-[11px] font-bold">
                Chamado enviado com sucesso! Nossa equipe técnica retornará em breve.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#a8a29e] mb-2">
                Descreva sua Dúvida ou Problema Técnico
              </label>
              <textarea
                rows={5}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                disabled={loading || success}
                placeholder="Descreva aqui o problema em detalhes. Se aplicável, inclua números de pedidos, nomes de clientes ou erros ocorridos."
                className="w-full bg-white/5 border border-white/10 focus:border-[#059669] text-white p-3.5 text-xs outline-none transition-all duration-300 font-bold rounded-[2px] placeholder:text-[#57534e] resize-none leading-relaxed"
              />
            </div>

            {/* Inquilino info footer */}
            {userInfo && (
              <div className="bg-white/2 flex justify-between items-center py-2 px-3 border border-white/5 text-[9px] text-[#a8a29e] uppercase font-black tracking-widest rounded-[2px]">
                <span>Inquilino Ativo</span>
                <span className="text-[#059669] max-w-[200px] truncate">{userInfo.companyId}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading || success}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#a8a29e] hover:text-white bg-transparent hover:bg-white/5 border border-transparent rounded-[2px] transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || success || !mensagem.trim()}
                className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] active:scale-[0.98] disabled:opacity-40 text-white font-black text-[10px] uppercase tracking-widest rounded-[2px] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-950/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar Chamado <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
