"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  UserCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsuariosEmpresa, createFuncionario, deleteFuncionario, type PerfilUsuario } from "./actions";

export default function UsuariosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<PerfilUsuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "funcionario" as "admin" | "funcionario",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUsuarios = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getUsuariosEmpresa();
    if (error) {
      if (error === "Acesso negado") {
        router.replace("/dashboard");
        return;
      }
      showToast("error", error);
    } else {
      setUsuarios(data || []);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    }
    init();
    loadUsuarios();
  }, [loadUsuarios]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.senha) {
      showToast("error", "Preencha todos os campos obrigatórios.");
      return;
    }
    if (form.senha.length < 6) {
      showToast("error", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setFormLoading(true);
    const result = await createFuncionario(form);
    setFormLoading(false);

    if (result.success) {
      showToast("success", "Usuário criado com sucesso!");
      setShowModal(false);
      setForm({ nome: "", email: "", senha: "", role: "funcionario" });
      loadUsuarios();
    } else {
      showToast("error", result.error || "Erro ao criar usuário.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário? Esta ação é irreversível.")) return;
    setDeleteLoading(id);
    const result = await deleteFuncionario(id);
    setDeleteLoading(null);
    if (result.success) {
      showToast("success", "Usuário removido com sucesso.");
      loadUsuarios();
    } else {
      showToast("error", result.error || "Erro ao remover usuário.");
    }
  };

  const roleLabel = (role: string) => role === "admin" ? "Administrador" : "Funcionário";
  const roleIcon = (role: string) => role === "admin" ? <Shield size={12} className="text-secondary" /> : <UserCheck size={12} className="text-muted" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-[5px] shadow-xl border text-xs font-black uppercase tracking-widest animate-in slide-in-from-top-2 duration-300",
          toast.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-600"
        )}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3 uppercase tracking-tighter">
            <Users className="text-secondary" size={24} />
            Gerenciar Usuários
          </h1>
          <p className="text-muted text-xs mt-1 font-medium italic">
            Cadastre e gerencie os acessos dos funcionários da sua empresa.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-black text-[10px] uppercase tracking-[0.2em] px-5 py-3 rounded-[5px] transition-all shadow-md shadow-secondary/20 hover:scale-[1.01] active:scale-[0.99]"
        >
          <UserPlus size={14} />
          Novo Usuário
        </button>
      </header>

      {/* Table */}
      <div className="bg-card border border-card-border rounded-[5px] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-card-border bg-background/40">
          <h2 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">
            Usuários Ativos — {usuarios.length} cadastrado{usuarios.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-muted">
            <Loader2 size={20} className="animate-spin text-secondary" />
            <span className="text-xs font-bold uppercase tracking-widest">Carregando usuários...</span>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-full bg-background border border-card-border flex items-center justify-center">
              <Users size={24} className="text-muted" />
            </div>
            <p className="text-muted text-xs font-bold uppercase tracking-widest text-center max-w-xs">
              Nenhum usuário cadastrado ainda. Clique em "Novo Usuário" para começar.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-card-border">
            {usuarios.map((user) => (
              <div key={user.id} className="flex items-center gap-4 px-6 py-4 hover:bg-background/30 transition-colors group">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center font-black text-sm text-secondary shrink-0">
                  {user.nome.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-foreground uppercase tracking-tight truncate">
                      {user.nome}
                    </p>
                    {user.id === currentUserId && (
                      <span className="text-[8px] font-black text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                        Você
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted font-bold truncate">{user.email || "—"}</p>
                </div>

                {/* Role badge */}
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest shrink-0",
                  user.role === "admin"
                    ? "bg-secondary/10 border-secondary/20 text-secondary"
                    : "bg-background border-card-border text-muted"
                )}>
                  {roleIcon(user.role)}
                  {roleLabel(user.role)}
                </div>

                {/* Delete button */}
                {user.id !== currentUserId && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deleteLoading === user.id}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-[5px] text-muted hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                    title="Remover usuário"
                  >
                    {deleteLoading === user.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} />
                    }
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="bg-secondary/5 border border-secondary/15 rounded-[5px] p-5 flex items-start gap-4">
        <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
          <Shield className="text-secondary" size={18} />
        </div>
        <div>
          <h4 className="text-xs font-black text-foreground uppercase tracking-tight mb-1">Controle de Acesso</h4>
          <p className="text-[10px] text-muted font-bold leading-relaxed uppercase tracking-tight opacity-80">
            Usuários com perfil <strong className="text-foreground">Administrador</strong> têm acesso total ao sistema, incluindo Configurações e Usuários.
            Usuários com perfil <strong className="text-foreground">Funcionário</strong> têm acesso apenas às funcionalidades operacionais.
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-card-border rounded-[5px] shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-card-border">
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Cadastrar Novo Usuário</h3>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">O funcionário já poderá acessar com as credenciais abaixo.</p>
              </div>
              <button
                onClick={() => { setShowModal(false); setForm({ nome: "", email: "", senha: "", role: "funcionario" }); }}
                className="p-1.5 hover:bg-background rounded-lg transition-colors text-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted mb-1.5">
                  <User size={10} className="inline mr-1.5" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  className="w-full bg-background border border-card-border focus:border-secondary focus:ring-1 focus:ring-secondary/20 text-foreground px-4 py-2.5 text-xs outline-none transition-all font-bold rounded-[5px] placeholder:text-muted"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted mb-1.5">
                  <Mail size={10} className="inline mr-1.5" />
                  Endereço de E-mail
                </label>
                <input
                  type="email"
                  placeholder="Ex: joao@empresa.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-background border border-card-border focus:border-secondary focus:ring-1 focus:ring-secondary/20 text-foreground px-4 py-2.5 text-xs outline-none transition-all font-bold rounded-[5px] placeholder:text-muted"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted mb-1.5">
                  <Lock size={10} className="inline mr-1.5" />
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                  className="w-full bg-background border border-card-border focus:border-secondary focus:ring-1 focus:ring-secondary/20 text-foreground px-4 py-2.5 text-xs outline-none transition-all font-bold rounded-[5px] placeholder:text-muted"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted mb-1.5">
                  <Shield size={10} className="inline mr-1.5" />
                  Nível de Acesso
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["funcionario", "admin"] as const).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, role }))}
                      className={cn(
                        "flex items-center justify-center gap-2 py-2.5 rounded-[5px] border font-black text-[9px] uppercase tracking-widest transition-all",
                        form.role === role
                          ? "bg-secondary/10 border-secondary text-secondary"
                          : "bg-background border-card-border text-muted hover:border-secondary/40"
                      )}
                    >
                      {role === "admin" ? <Shield size={12} /> : <UserCheck size={12} />}
                      {role === "admin" ? "Administrador" : "Funcionário"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setForm({ nome: "", email: "", senha: "", role: "funcionario" }); }}
                  className="flex-1 py-2.5 rounded-[5px] border border-card-border text-muted font-black text-[9px] uppercase tracking-widest hover:bg-background transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-secondary text-white py-2.5 rounded-[5px] font-black text-[9px] uppercase tracking-widest hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-secondary/20"
                >
                  {formLoading ? (
                    <><Loader2 size={12} className="animate-spin" /> Criando...</>
                  ) : (
                    <><UserPlus size={12} /> Criar Usuário</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
