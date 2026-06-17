"use server";

import { db } from "@/db";
import { pedidos, pedidoItens, estoque, financeiro } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface PedidoInput {
  id: string;
  clienteId: number | null;
  date: string;
  status: string;
  total: number;
  paymentMethod?: string;
  paymentStatus?: "Pago" | "Pendente";
}

interface ItemInput {
  produtoId: number;
  quantity: number;
  price: number;
}

export async function getPedidos(searchQuery?: string) {
  try {
    const data = await db.query.pedidos.findMany({
      with: {
        cliente: true
      },
      orderBy: [desc(pedidos.date)],
    });

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      return data.filter(p => 
        p.id.toLowerCase().includes(lowerQuery) || 
        (p.cliente && p.cliente.name.toLowerCase().includes(lowerQuery))
      );
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return [];
  }
}

export async function savePedido(pedidoData: PedidoInput, itens: ItemInput[]) {
  try {
    // Start transaction for atomic operation
    return await db.transaction(async (tx) => {
      // 1. Save Pedido
      const existing = await tx.select().from(pedidos).where(eq(pedidos.id, pedidoData.id));
      if (pedidoData.id && existing.length > 0) {
         // Update logic simplified for now
         await tx.update(pedidos).set({
           status: pedidoData.status,
           total: Number(pedidoData.total),
           clienteId: pedidoData.clienteId,
         }).where(eq(pedidos.id, pedidoData.id));
         
         // Rollback stock and remove old items
         const oldItems = await tx.select().from(pedidoItens).where(eq(pedidoItens.pedidoId, pedidoData.id));
         for (const oi of oldItems) {
           if (oi.produtoId) {
             const prod = await tx.select().from(estoque).where(eq(estoque.id, oi.produtoId));
             if (prod.length > 0) {
               await tx.update(estoque).set({ stock: (prod[0].stock || 0) + oi.quantity }).where(eq(estoque.id, oi.produtoId));
             }
           }
         }
         await tx.delete(pedidoItens).where(eq(pedidoItens.pedidoId, pedidoData.id));
      } else {
        await tx.insert(pedidos).values({
          id: pedidoData.id, // PD-2024-XXX
          clienteId: pedidoData.clienteId,
          date: pedidoData.date,
          status: pedidoData.status,
          total: Number(pedidoData.total),
        });
      }

      // 2. Save Items and update Stock
      for (const item of itens) {
        await tx.insert(pedidoItens).values({
          pedidoId: pedidoData.id,
          produtoId: item.produtoId || null,
          quantity: item.quantity,
          price: item.price,
        });

        // Update Stock
        const prod = await tx.select().from(estoque).where(eq(estoque.id, item.produtoId));
        if (prod.length > 0) {
          await tx.update(estoque).set({
            stock: (prod[0].stock || 0) - item.quantity,
          }).where(eq(estoque.id, item.produtoId));
        }
      }

      // 3. Launch Financeiro (Receita) se mudou para 'Venda'
      let shouldLaunchFinanceiro = false;
      if (pedidoData.status === "Venda") {
        if (existing.length === 0) {
          shouldLaunchFinanceiro = true;
        } else if (existing[0].status !== "Venda" && existing[0].status !== "Finalizado") {
          shouldLaunchFinanceiro = true;
        }
      }

      if (shouldLaunchFinanceiro) {
        await tx.insert(financeiro).values({
          date: pedidoData.date,
          doc: pedidoData.id,
          description: `Pedido ${pedidoData.id} - ${pedidoData.paymentMethod || "Dinheiro / PIX"}`,
          value: Number(pedidoData.total),
          type: "in",
          category: "Vendas",
          status: pedidoData.paymentStatus || "Pendente",
        });
      }

      revalidatePath("/pedidos");
      revalidatePath("/estoque");
      revalidatePath("/financeiro");
      return { success: true };
    });
  } catch (error) {
    console.error("Erro ao processar pedido:", error);
    return { success: false, error: "Falha ao salvar pedido" };
  }
}

export async function getPedidoById(id: string) {
  try {
    const data = await db.query.pedidos.findFirst({
      where: eq(pedidos.id, id),
      with: {
        cliente: true,
        itens: {
          with: {
            produto: true
          }
        }
      }
    });
    return data || null;
  } catch (error) {
    console.error("Erro ao buscar pedido por ID:", error);
    return null;
  }
}
