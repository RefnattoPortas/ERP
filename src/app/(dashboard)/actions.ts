"use server";

import { db } from "@/db";
import { pedidos, financeiro, estoque } from "@/db/schema";
import { eq, and, sql, gte, lte, desc } from "drizzle-orm";

function parseDate(dateStr: string) {
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/').map(Number);
    return { day: d, month: m, year: y };
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  return { day: d, month: m, year: y };
}

export async function getDashboardStats() {
  try {
    // 1. Saldo Disponível (Financeiro)
    const allFinanceiro = await db.select().from(financeiro);
    const saldo = allFinanceiro.reduce((acc, curr) => {
      return curr.type === "in" ? acc + curr.value : acc - curr.value;
    }, 0);

    // 2. Vendas (Mês Atual)
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    const monthOrders = await db.select().from(pedidos);
    const vendasMes = monthOrders.filter(p => {
      const { month, year } = parseDate(p.date);
      return month === currentMonth && year === currentYear && (p.status === "Venda" || p.status === "Finalizado");
    }).reduce((acc, p) => acc + p.total, 0);

    // 3. Contas Hoje (Financeiro 'out' Pendente hoje)
    const todayStr = now.toLocaleDateString('pt-BR');
    const contasHoje = allFinanceiro.filter(f => {
      const { day, month, year } = parseDate(f.date);
      return f.type === "out" && f.status === "Pendente" && 
             day === now.getDate() && month === currentMonth && year === currentYear;
    }).reduce((acc, f) => acc + f.value, 0);

    // 4. Estoque Crítico
    const allEstoque = await db.select().from(estoque);
    const estoqueCritico = allEstoque.filter(e => (e.stock || 0) <= (e.minStock || 0)).length;

    // 5. Pedidos Recentes
    const recentOrders = await db.query.pedidos.findMany({
      with: {
        cliente: true
      },
      orderBy: [desc(pedidos.date)],
      limit: 5
    });

    return {
      saldo,
      vendasMes,
      contasHoje,
      estoqueCritico,
      recentOrders
    };
  } catch (error) {
    console.error("Erro ao carregar estatísticas do dashboard:", error);
    return {
      saldo: 0,
      vendasMes: 0,
      contasHoje: 0,
      estoqueCritico: 0,
      recentOrders: []
    };
  }
}
