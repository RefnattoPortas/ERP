"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Zap, ArrowRight, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    userName: "",
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

    const { companyName, userName, email, password } = formData;

    if (!companyName || !userName || !email || !password) {
      setError("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      // 1. Cadastrar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: userName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) {
        throw new Error("Não foi possível criar o usuário. Tente novamente.");
      }

      const userId = authData.user.id;

      // 2. Inserir a nova empresa na tabela public.empresas
      const { data: companyData, error: companyError } = await supabase
        .from("empresas")
        .insert({ nome_fantasia: companyName })
        .select()
        .single();

      if (companyError) throw companyError;
      if (!companyData) {
        throw new Error("Falha ao registrar a empresa no banco de dados.");
      }

      const companyId = companyData.id;

      // 3. Criar o perfil do usuário vinculado ao seu auth.users e à empresa recém-criada
      const { error: profileError } = await supabase
        .from("perfis_usuarios")
        .insert({
          id: userId,
          empresa_id: companyId,
          nome: userName,
          role: "admin",
        });

      if (profileError) throw profileError;

      // 4. Atualizar os metadados do usuário logado no Auth com o empresa_id
      // Isso garantirá que o JWT contenha o empresa_id de imediato para futuras sessões e RLS ultra-rápido
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: {
          empresa_id: companyId,
        },
      });

      if (updateAuthError) {
        console.warn("Aviso: Falha ao persistir metadados da empresa no JWT do Auth", updateAuthError);
      }

      setSuccess(true);
      
      // Redirecionar para o dashboard após breve animação de sucesso
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (err: unknown) {
      console.error("Erro no fluxo de cadastro:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido no servidor.");
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
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Criar Nova Conta</h2>
          <p className="text-[#a8a29e] text-[11px] font-bold mt-1 text-center">
            Comece a gerenciar sua empresa com máxima performance e simplicidade
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
              Cadastro concluído com sucesso! Redirecionando para o sistema...
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#a8a29e] mb-1.5">
              Nome Fantasia da Empresa
            </label>
            <input
              type="text"
              name="companyName"
              placeholder="Ex: Minha Empresa LTDA"
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading || success}
              className="w-full bg-white/5 border border-white/10 focus:border-[#059669] text-white px-4 py-3 text-xs outline-none transition-all duration-300 font-bold rounded-[2px] placeholder:text-[#57534e]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#a8a29e] mb-1.5">
              Seu Nome Completo (Administrador)
            </label>
            <input
              type="text"
              name="userName"
              placeholder="Ex: Renato Luis"
              value={formData.userName}
              onChange={handleChange}
              disabled={loading || success}
              className="w-full bg-white/5 border border-white/10 focus:border-[#059669] text-white px-4 py-3 text-xs outline-none transition-all duration-300 font-bold rounded-[2px] placeholder:text-[#57534e]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#a8a29e] mb-1.5">
              Endereço de E-mail
            </label>
            <input
              type="email"
              name="email"
              placeholder="Ex: seuemail@empresa.com"
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
              placeholder="Mínimo 6 caracteres"
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
                Criando Ambiente...
              </>
            ) : (
              <>
                Criar Minha Empresa <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-[#a8a29e] text-[11px] font-bold">
            Já possui uma conta ativa?{" "}
            <Link 
              href="/login" 
              className="text-[#059669] hover:text-[#34d399] underline transition-colors"
            >
              Fazer Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
