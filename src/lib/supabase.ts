import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isDevMode =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes("sua-url-aqui") ||
  supabaseAnonKey.includes("sua-anon-key");

if (isDevMode) {
  console.info(
    "[Supabase Dev Mode] Usando autenticação local mockada. " +
      "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para usar o Supabase real."
  );
}

// Dados mockados para desenvolvimento
const DEV_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "adm@teste.com",
  user_metadata: {
    empresa_id: "00000000-0000-0000-0000-000000000002",
    nome: "Administrador",
  },
};

const DEV_PROFILE = {
  id: DEV_USER.id,
  empresa_id: DEV_USER.user_metadata.empresa_id,
  nome: "Administrador",
  role: "admin",
};

const DEV_EMPRESA = {
  id: DEV_USER.user_metadata.empresa_id,
  nome_fantasia: "Ágil ERP (Ambiente de Desenvolvimento)",
  tema: null,
};

function getDevSession(): { user: typeof DEV_USER } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("erp-dev-session");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setDevSession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("erp-dev-session", JSON.stringify({ user: DEV_USER }));
}

function clearDevSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("erp-dev-session");
}

const realClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

function createDevClient() {
  const authHandler: ProxyHandler<typeof realClient.auth> = {
    get(target, prop) {
      if (prop === "getUser") {
        return async () => {
          const session = getDevSession();
          if (session) {
            return { data: { user: session.user }, error: null };
          }
          return {
            data: { user: null },
            error: { message: "No session", status: 401, name: "AuthError" },
          };
        };
      }
      if (prop === "signInWithPassword") {
        return async ({
          email,
          password,
        }: {
          email: string;
          password: string;
        }) => {
          if (email === "adm@teste.com" && password === "adm123") {
            setDevSession();
            return { data: { user: DEV_USER }, error: null };
          }
          return {
            data: { user: null },
            error: new Error("Credenciais inválidas"),
          };
        };
      }
      if (prop === "updateUser") {
        return async (attrs: { data?: Record<string, unknown> }) => {
          const session = getDevSession();
          if (session) {
            const updatedUser = {
              ...session.user,
              user_metadata: {
                ...session.user.user_metadata,
                ...(attrs.data || {}),
              },
            };
            localStorage.setItem(
              "erp-dev-session",
              JSON.stringify({ user: updatedUser })
            );
            return { data: { user: updatedUser }, error: null };
          }
          return { data: { user: DEV_USER }, error: null };
        };
      }
      if (prop === "signOut") {
        return async () => {
          clearDevSession();
          return { error: null };
        };
      }
      if (prop === "onAuthStateChange") {
        return () => ({
          data: { subscription: { unsubscribe: () => {} } },
        });
      }
      if (prop === "getSession") {
        return async () => {
          const session = getDevSession();
          return { data: { session }, error: null };
        };
      }
      return Reflect.get(target, prop, target);
    },
  };

  function queryBuilder(table: string) {
    const state: {
      select: string;
      eqField: string | null;
      eqValue: unknown;
      isSingle: boolean;
      orderField: string | null;
      orderDir: string;
      insertData: unknown;
    } = {
      select: "*",
      eqField: null,
      eqValue: null,
      isSingle: false,
      orderField: null,
      orderDir: "asc",
      insertData: null,
    };

    const builder = {
      select(cols: string) {
        state.select = cols;
        return builder;
      },
      eq(field: string, value: unknown) {
        state.eqField = field;
        state.eqValue = value;
        return builder;
      },
      single() {
        state.isSingle = true;
        return builder;
      },
      order(field: string, opts?: { ascending?: boolean }) {
        state.orderField = field;
        state.orderDir = opts?.ascending ? "asc" : "desc";
        return builder;
      },
      insert(values: unknown) {
        state.insertData = values;
        return builder;
      },
      then<TResult1 = unknown, TResult2 = never>(
        onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
      ): Promise<TResult1 | TResult2> {
        return executeQuery().then(onfulfilled, onrejected);
      },
      catch(
        onrejected?: ((reason: unknown) => unknown) | undefined | null
      ): Promise<unknown> {
        return executeQuery().catch(onrejected);
      },
      finally(onfinally?: (() => void) | undefined | null): Promise<unknown> {
        return executeQuery().finally(onfinally);
      },
    };

    async function executeQuery() {
      // Handle insert
      if (state.insertData) {
        return { data: state.insertData, error: null };
      }

      if (table === "perfis_usuarios") {
        if (state.eqField === "id" && state.eqValue === DEV_USER.id) {
          return {
            data: state.isSingle ? DEV_PROFILE : [DEV_PROFILE],
            error: null,
          };
        }
        return { data: state.isSingle ? null : [], error: null };
      }

      if (table === "empresas") {
        if (state.eqField === "id" && state.eqValue === DEV_EMPRESA.id) {
          return {
            data: state.isSingle ? DEV_EMPRESA : [DEV_EMPRESA],
            error: null,
          };
        }
        return { data: state.isSingle ? null : [], error: null };
      }

      if (table === "chamados_suporte") {
        return { data: null, error: null };
      }

      return { data: state.isSingle ? null : [], error: null };
    }

    return builder;
  }

  return new Proxy(realClient, {
    get(target, prop) {
      if (prop === "auth") {
        return new Proxy(target.auth, authHandler);
      }
      if (prop === "from") {
        return (table: string) => queryBuilder(table);
      }
      return Reflect.get(target, prop, target);
    },
  });
}

export const supabase = isDevMode ? createDevClient() : realClient;
