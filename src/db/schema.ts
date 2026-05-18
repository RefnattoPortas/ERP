import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const clientes = sqliteTable("clientes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  company: text("company"),
  doc: text("doc"),
  email: text("email"),
  phone: text("phone"),
  status: text("status", { enum: ["Ativo", "Inativo"] }).default("Ativo"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const clientesRelations = relations(clientes, ({ many }) => ({
  pedidos: many(pedidos),
}));

export const estoque = sqliteTable("estoque", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  sku: text("sku").unique().notNull(),
  category: text("category"),
  stock: integer("stock").default(0),
  minStock: integer("min_stock").default(0),
  cost: real("cost").default(0),
  purchasePrice: real("purchase_price").default(0),
  supplier: text("supplier"),
  critical: integer("critical", { mode: "boolean" }).default(false),
});

export const financeiro = sqliteTable("financeiro", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  doc: text("doc"),
  description: text("description").notNull(),
  value: real("value").notNull(),
  category: text("category"),
  type: text("type", { enum: ["in", "out"] }).notNull(),
  status: text("status", { enum: ["Pago", "Pendente"] }).default("Pendente"),
});

export const pedidos = sqliteTable("pedidos", {
  id: text("id").primaryKey(), // PD-2024-001
  clienteId: integer("cliente_id").references(() => clientes.id),
  date: text("date").notNull(),
  status: text("status").notNull(),
  total: real("total").notNull(),
});

export const pedidosRelations = relations(pedidos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [pedidos.clienteId],
    references: [clientes.id],
  }),
  itens: many(pedidoItens),
}));

export const pedidoItens = sqliteTable("pedido_itens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pedidoId: text("pedido_id").references(() => pedidos.id),
  produtoId: integer("produto_id").references(() => estoque.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

export const pedidoItensRelations = relations(pedidoItens, ({ one }) => ({
  pedido: one(pedidos, {
    fields: [pedidoItens.pedidoId],
    references: [pedidos.id],
  }),
  produto: one(estoque, {
    fields: [pedidoItens.produtoId],
    references: [estoque.id],
  }),
}));

export const configuracoes = sqliteTable("configuracoes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // Empresa
  razaoSocial: text("razao_social"),
  nomeFantasia: text("nome_fantasia"),
  cnpj: text("cnpj"),
  // Endereço
  logradouro: text("logradouro"),
  bairro: text("bairro"),
  cidade: text("cidade"),
  estado: text("estado"),
  cep: text("cep"),

  telefone: text("telefone"),
  email: text("email"),
  logoUrl: text("logo_url"),
  // Orçamentos
  validadeOrcamento: integer("validade_orcamento").default(15), // dias
  formasPagamento: text("formas_pagamento"),
  observacoesPadrao: text("observacoes_padrao"),
});
