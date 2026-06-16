"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Admin client - uses Service Role Key to manage auth.users
function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Missing Supabase admin credentials");
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Server client - to get session/user from the calling admin
async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* read-only context */ }
        },
      },
    }
  );
}

export interface PerfilUsuario {
  id: string;
  nome: string;
  role: string;
  email?: string;
}

// Buscar todos os funcionários da empresa do admin logado
export async function getUsuariosEmpresa(): Promise<{ data: PerfilUsuario[] | null; error: string | null }> {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autenticado" };

    // Obter empresa_id do admin
    const { data: adminProfile } = await supabase
      .from("perfis_usuarios")
      .select("empresa_id, role")
      .eq("id", user.id)
      .single();

    if (!adminProfile || adminProfile.role !== "admin") {
      return { data: null, error: "Acesso negado" };
    }

    const adminClient = createAdminClient();

    // Buscar todos os perfis da empresa
    const { data: profiles, error } = await adminClient
      .from("perfis_usuarios")
      .select("id, nome, role")
      .eq("empresa_id", adminProfile.empresa_id);

    if (error) throw error;

    // Enriquecer com e-mails da tabela auth.users
    const enriched: PerfilUsuario[] = [];
    for (const profile of profiles || []) {
      const { data: authUser } = await adminClient.auth.admin.getUserById(profile.id);
      enriched.push({
        id: profile.id,
        nome: profile.nome,
        role: profile.role,
        email: authUser?.user?.email,
      });
    }

    return { data: enriched, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return { data: null, error: msg };
  }
}

// Criar novo funcionário
export async function createFuncionario(input: {
  nome: string;
  email: string;
  senha: string;
  role: "admin" | "funcionario";
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Não autenticado" };

    // Verificar que o chamador é admin
    const { data: adminProfile } = await supabase
      .from("perfis_usuarios")
      .select("empresa_id, role")
      .eq("id", user.id)
      .single();

    if (!adminProfile || adminProfile.role !== "admin") {
      return { success: false, error: "Apenas administradores podem criar usuários" };
    }

    const adminClient = createAdminClient();

    // 1. Criar o usuário no auth.users (sem precisar de confirmação de e-mail)
    const { data: newAuthUser, error: authError } = await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.senha,
      email_confirm: true, // Marcar e-mail como confirmado automaticamente
      user_metadata: {
        nome: input.nome,
        empresa_id: adminProfile.empresa_id,
      },
    });

    if (authError) throw authError;
    if (!newAuthUser.user) throw new Error("Falha ao criar usuário no auth");

    // 2. Criar o perfil na tabela perfis_usuarios
    const { error: profileError } = await adminClient
      .from("perfis_usuarios")
      .insert({
        id: newAuthUser.user.id,
        empresa_id: adminProfile.empresa_id,
        nome: input.nome,
        role: input.role,
      });

    if (profileError) throw profileError;

    revalidatePath("/(dashboard)/usuarios");
    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return { success: false, error: msg };
  }
}

// Remover funcionário
export async function deleteFuncionario(funcionarioId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Não autenticado" };

    const { data: adminProfile } = await supabase
      .from("perfis_usuarios")
      .select("empresa_id, role")
      .eq("id", user.id)
      .single();

    if (!adminProfile || adminProfile.role !== "admin") {
      return { success: false, error: "Apenas administradores podem remover usuários" };
    }

    // Não deixar remover a si mesmo
    if (funcionarioId === user.id) {
      return { success: false, error: "Você não pode remover sua própria conta" };
    }

    const adminClient = createAdminClient();

    // Verificar que o funcionário pertence à mesma empresa
    const { data: targetProfile } = await adminClient
      .from("perfis_usuarios")
      .select("empresa_id")
      .eq("id", funcionarioId)
      .single();

    if (!targetProfile || targetProfile.empresa_id !== adminProfile.empresa_id) {
      return { success: false, error: "Usuário não pertence à sua empresa" };
    }

    // Deletar perfil e usuário do auth
    await adminClient.from("perfis_usuarios").delete().eq("id", funcionarioId);
    await adminClient.auth.admin.deleteUser(funcionarioId);

    revalidatePath("/(dashboard)/usuarios");
    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return { success: false, error: msg };
  }
}
