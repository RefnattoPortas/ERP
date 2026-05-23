"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Zap, ArrowRight, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password } = formData;

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      // 1. Autenticar usuário com E-mail e Senha no Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) {
        throw new Error("Erro inesperado durante a autenticação. Tente novamente.");
      }

      const userId = authData.user.id;

      // 2. Buscar o perfil do usuário para capturar o seu empresa_id e validar a conta no ERP
      const { data: profileData, error: profileError } = await supabase
        .from("perfis_usuarios")
        .select("empresa_id, nome, role")
        .eq("id", userId)
        .single();

      if (profileError) {
        // Tratar caso onde o auth.user existe mas o perfil ERP ainda não foi criado (ex: cadastro corrompido)
        throw new Error(
          "Perfil de usuário não encontrado para este inquilino. Entre em contato com o suporte."
        );
      }

      // 3. Opcional: Se o empresa_id não estiver nos metadados do Auth, atualizamos agora para garantir JWT cache
      if (!authData.user.user_metadata?.empresa_id) {
        await supabase.auth.updateUser({
          data: {
            empresa_id: profileData.empresa_id,
          },
        });
      }

      setSuccess(true);

      // Redirecionar para o dashboard após breve feedback
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (err: unknown) {
      console.error("Erro no login:", err);
      setError(err instanceof Error ? err.message : "Credenciais inválidas ou erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1917] text-[#f5f5f4] flex flex-col justify-center items-center font-sans overflow-x-hidden relative select-none">
      
      {/* Malha Quadriculada de Fundo Premium sutil em tom carvão escuro */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#f5f5f4_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f4_1px,transparent_1px)] bg-[size:30px_30px]"></div>

      {/* Brilho verde esmeralda no topo */}
      <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#059669]/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-[#1c1917]/90 border border-white/5 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-500 rounded-[2px]">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-[#059669] flex items-center justify-center border border-white/10 shadow-[4px_4px_0px_rgba(5,150,105,0.2)] rounded-[2px] mb-4">
            <Zap className="text-white w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black tracking-[0.25em] text-[#059669] uppercase mb-1">Ágil ERP SaaS</span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Entrar no Sistema</h2>
          <p className="text-[#a8a29e] text-[11px] font-bold mt-1 text-center">
            Acesse seu painel operacional multi-tenant com segurança RLS
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 mb-6 flex items-start gap-2.5 rounded-[2px] animate-shake">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="text-[11px] font-bold leading-normal">{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-[#059669]/10 border border-[#059669]/20 text-[#34d399] p-3 mb-6 flex items-start gap-2.5 rounded-[2px]">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="text-[11px] font-bold leading-normal">
              Autenticação bem-sucedida! Entrando no sistema...
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#a8a29e] mb-1.5">
              Endereço de E-mail
            </label>
            <input
              type="email"
              name="email"
              placeholder="seuemail@empresa.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || success}
              className="w-full bg-white/5 border border-white/10 focus:border-[#059669] text-white px-4 py-3 text-xs outline-none transition-all duration-300 font-bold rounded-[2px] placeholder:text-[#57534e]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#a8a29e] mb-1.5">
              Senha de Acesso
            </label>
            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              disabled={loading || success}
              className="w-full bg-white/5 border border-white/10 focus:border-[#059669] text-white px-4 py-3 text-xs outline-none transition-all duration-300 font-bold rounded-[2px] placeholder:text-[#57534e]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#059669] hover:bg-[#047857] active:scale-[0.98] disabled:opacity-50 text-white font-black text-[11px] uppercase tracking-[0.2em] py-3.5 mt-2 rounded-[2px] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Autenticando Credenciais...
              </>
            ) : (
              <>
                Entrar no ERP <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-[#a8a29e] text-[11px] font-bold">
            Ainda não tem conta corporativa?{" "}
            <Link 
              href="/cadastro" 
              className="text-[#059669] hover:text-[#34d399] underline transition-colors"
            >
              Criar Conta Grátis
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
