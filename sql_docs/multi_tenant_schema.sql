-- ====================================================================
-- SCRIPT DE BANCO DE DADOS - ARQUITETURA MULTI-TENANT (SUPABASE SQL)
-- Ágil ERP - Focado em Micro e Pequenas Empresas
-- ====================================================================

-- Habilitar a extensão UUID-OSSP caso não esteja ativa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE EMPRESAS (Inquilinos/Tenants)
CREATE TABLE public.empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_fantasia TEXT NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS para empresas
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- 2. TABELA DE PERFIS DE USUÁRIOS
-- Vinculada diretamente à tabela de autenticação nativa do Supabase (auth.users)
CREATE TABLE public.perfis_usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'vendas', 'operacional')),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS para perfis_usuarios
ALTER TABLE public.perfis_usuarios ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- FUNÇÃO AUXILIAR DE SEGURANÇA (OBTER EMPRESA DO USUÁRIO LOGADO)
-- ====================================================================
-- Retorna o empresa_id do usuário autenticado. 
-- Abordagem Híbrida de Altíssima Performance:
-- 1. Tenta ler direto do JWT (User Metadata). Rápido, sem consulta física extra.
-- 2. Se vazio, faz o fallback buscando diretamente na tabela perfis_usuarios.
-- Definida como SECURITY DEFINER para poder ler a tabela perfis_usuarios independentemente das políticas de RLS.
CREATE OR REPLACE FUNCTION public.get_my_empresa_id()
RETURNS UUID AS $$
DECLARE
    v_empresa_id UUID;
BEGIN
    -- 1. Tentar obter do JWT claims
    BEGIN
        v_empresa_id := NULLIF(current_setting('request.jwt.claims', true)::json->'user_metadata'->>'empresa_id', '')::uuid;
    EXCEPTION WHEN OTHERS THEN
        v_empresa_id := NULL;
    END;

    -- 2. Fallback: Se não estiver nos metadados do JWT, consulta o banco
    IF v_empresa_id IS NULL THEN
        SELECT empresa_id INTO v_empresa_id
        FROM public.perfis_usuarios
        WHERE perfis_usuarios.id = auth.uid();
    END IF;

    RETURN v_empresa_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ====================================================================
-- POLÍTICAS DE RLS: EMPRESAS E PERFIS_USUARIOS
-- ====================================================================

-- Usuários só podem ler os dados da sua própria empresa
CREATE POLICY select_minha_empresa ON public.empresas
    FOR SELECT
    TO authenticated
    USING (id = public.get_my_empresa_id());

-- Administradores podem atualizar os dados da sua própria empresa
CREATE POLICY update_minha_empresa ON public.empresas
    FOR UPDATE
    TO authenticated
    USING (id = public.get_my_empresa_id())
    WITH CHECK (id = public.get_my_empresa_id());

-- Qualquer usuário (autenticado ou anon durante signUp) pode criar uma empresa no cadastro
CREATE POLICY insert_empresa ON public.empresas
    FOR INSERT
    WITH CHECK (true);

-- Perfis de Usuários: Um usuário só pode ler/escrever no seu próprio perfil (Evita recursão infinita!)
CREATE POLICY user_profile_policy ON public.perfis_usuarios
    FOR SELECT, UPDATE, DELETE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Qualquer usuário (autenticado ou anon durante signUp) pode criar seu perfil inicial
CREATE POLICY insert_perfil ON public.perfis_usuarios
    FOR INSERT
    WITH CHECK (id = auth.uid());

-- ====================================================================
-- 3. EXEMPLO DE TABELA DE NEGÓCIO: CLIENTES
-- ====================================================================
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    documento TEXT, -- CPF/CNPJ
    status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS para clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para isolamento de dados de clientes por empresa (inquilino)
CREATE POLICY select_clientes ON public.clientes
    FOR SELECT
    TO authenticated
    USING (empresa_id = public.get_my_empresa_id());

CREATE POLICY insert_clientes ON public.clientes
    FOR INSERT
    TO authenticated
    WITH CHECK (empresa_id = public.get_my_empresa_id());

CREATE POLICY update_clientes ON public.clientes
    FOR UPDATE
    TO authenticated
    USING (empresa_id = public.get_my_empresa_id())
    WITH CHECK (empresa_id = public.get_my_empresa_id());

CREATE POLICY delete_clientes ON public.clientes
    FOR DELETE
    TO authenticated
    USING (empresa_id = public.get_my_empresa_id());

-- ====================================================================
-- 4. TABELA DE SUPORTE: CHAMADOS_SUPORTE
-- ====================================================================
CREATE TABLE public.chamados_suporte (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES public.perfis_usuarios(id) ON DELETE CASCADE,
    mensagem TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_atendimento', 'resolvido')),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS para chamados_suporte
ALTER TABLE public.chamados_suporte ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para chamados_suporte (isolamento por empresa e criação própria)
CREATE POLICY select_chamados ON public.chamados_suporte
    FOR SELECT
    TO authenticated
    USING (empresa_id = public.get_my_empresa_id());

CREATE POLICY insert_chamados ON public.chamados_suporte
    FOR INSERT
    TO authenticated
    WITH CHECK (
        empresa_id = public.get_my_empresa_id() AND
        usuario_id = auth.uid()
    );

-- Apenas admins da empresa podem fechar ou atualizar o status do chamado
CREATE POLICY update_chamados ON public.chamados_suporte
    FOR UPDATE
    TO authenticated
    USING (
        empresa_id = public.get_my_empresa_id() AND 
        EXISTS (
            SELECT 1 FROM public.perfis_usuarios 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
