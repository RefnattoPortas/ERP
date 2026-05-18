-- Script de Migração Inicial (Supabase / Postgres)
-- ERP 'Less is More' para MPEs

-- 1. EXTENSÕES E SCHEMAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELAS DE BASE
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'operacional' CHECK (role IN ('admin', 'vendas', 'operacional')),
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  tax_id TEXT UNIQUE, -- CPF/CNPJ
  email TEXT,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('final', 'insumo')),
  min_stock NUMERIC DEFAULT 0,
  current_stock NUMERIC DEFAULT 0,
  last_cost_price NUMERIC DEFAULT 0,
  sell_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  status TEXT DEFAULT 'quote' CHECK (status IN ('draft', 'quote', 'approved', 'cancelled', 'completed')),
  total_amount NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  total NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE TABLE service_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'doing', 'review', 'done')),
  assigned_to UUID REFERENCES profiles(id),
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE financial_ledgers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT,
  amount NUMERIC NOT NULL,
  order_id UUID REFERENCES orders(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  due_date DATE NOT NULL,
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inventory_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  quantity NUMERIC NOT NULL,
  unit_cost NUMERIC,
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. POLÍTICAS DE RLS (SEGURANÇA)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- Adicionar políticas conforme a necessidade (ex: apenas admin vê tudo)

-- 4. FUNÇÕES DE AUTOMAÇÃO (Triggers)
-- Exemplo: Criar OS e Financeiro ao aprovar pedido
CREATE OR REPLACE FUNCTION handle_order_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status = 'approved' AND OLD.status != 'approved') THEN
    -- Criar Ordem de Serviço
    INSERT INTO service_orders (order_id, status) VALUES (NEW.id, 'backlog');
    
    -- Lançar Financeiro (Contas a Receber)
    INSERT INTO financial_ledgers (type, amount, order_id, due_date, status)
    VALUES ('income', NEW.total_amount, NEW.id, CURRENT_DATE + INTERVAL '30 days', 'pending');
    
    -- Baixa de Estoque (Simplificado)
    -- Em um cenário real, iteraríamos sobre order_items e inseriríamos em inventory_logs
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_order_approved
  AFTER UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION handle_order_approval();
