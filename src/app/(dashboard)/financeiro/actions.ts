"use server";

import { db } from "@/db";
import { financeiro } from "@/db/schema";
import { eq, like, or, desc, and, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getFinanceiro(searchQuery?: string, fromDate?: string, toDate?: string) {
  try {
    let conditions = [];

    if (searchQuery) {
      conditions.push(
        or(
          like(financeiro.description, `%${searchQuery}%`),
          like(financeiro.category, `%${searchQuery}%`),
          like(financeiro.doc, `%${searchQuery}%`)
        )
      );
    }

    if (fromDate) {
      conditions.push(gte(financeiro.date, fromDate));
    }

    if (toDate) {
      conditions.push(lte(financeiro.date, toDate));
    }

    if (conditions.length > 0) {
      return await db.select().from(financeiro).where(and(...conditions)).orderBy(desc(financeiro.date));
    }

    return await db.select().from(financeiro).orderBy(desc(financeiro.date));
  } catch (error) {
    console.error("Erro ao buscar financeiro:", error);
    return [];
  }
}

export async function saveLancamento(data: any) {
  try {
    if (data.id) {
      await db.update(financeiro).set({
        date: data.date,
        doc: data.doc,
        description: data.description,
        value: Number(data.value),
        category: data.category,
        type: data.type,
        status: data.status,
      }).where(eq(financeiro.id, data.id));
    } else {
      await db.insert(financeiro).values({
        date: data.date,
        doc: data.doc,
        description: data.description,
        value: Number(data.value),
        category: data.category,
        type: data.type,
        status: data.status,
      });
    }
    revalidatePath("/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar lançamento financeiro:", error);
    return { success: false, error: "Falha ao salvar lançamento" };
  }
}

export async function deleteLancamento(id: number) {
  try {
    await db.delete(financeiro).where(eq(financeiro.id, id));
    revalidatePath("/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir lançamento financeiro:", error);
    return { success: false, error: "Falha ao excluir lançamento" };
  }
}
