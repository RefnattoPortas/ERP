"use server";

import { db } from "@/db";
import { estoque } from "@/db/schema";
import { eq, like, or, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEstoque(searchQuery?: string) {
  try {
    if (searchQuery) {
      return await db.select().from(estoque).where(
        or(
          like(estoque.name, `%${searchQuery}%`),
          like(estoque.sku, `%${searchQuery}%`),
          like(estoque.category, `%${searchQuery}%`)
        )
      ).orderBy(desc(estoque.id));
    }
    return await db.select().from(estoque).orderBy(desc(estoque.id));
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    return [];
  }
}

export async function saveItemEstoque(data: any) {
  try {
    if (data.id) {
      await db.update(estoque).set({
        name: data.name,
        sku: data.sku,
        category: data.category,
        stock: Number(data.stock),
        minStock: Number(data.minStock),
        cost: Number(data.cost),
        purchasePrice: Number(data.purchasePrice),
        supplier: data.supplier,
        critical: data.critical,
      }).where(eq(estoque.id, data.id));
    } else {
      await db.insert(estoque).values({
        name: data.name,
        sku: data.sku,
        category: data.category,
        stock: Number(data.stock),
        minStock: Number(data.minStock),
        cost: Number(data.cost),
        purchasePrice: Number(data.purchasePrice),
        supplier: data.supplier,
        critical: data.critical,
      });
    }
    revalidatePath("/estoque");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao salvar item:", error);
    return { success: false, error: error.message || "Falha ao salvar item" };
  }
}

export async function deleteItemEstoque(id: number) {
  try {
    await db.delete(estoque).where(eq(estoque.id, id));
    revalidatePath("/estoque");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir item do estoque:", error);
    return { success: false, error: "Falha ao excluir item" };
  }
}
export async function getItemEstoque(id: number) {
  try {
    const res = await db.select().from(estoque).where(eq(estoque.id, id)).limit(1);
    return res[0] || null;
  } catch (error) {
    console.error("Erro ao buscar item no estoque:", error);
    return null;
  }
}
