"use server";

import { db } from "@/db";
import { configuracoes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getConfiguracoes() {
  try {
    const res = await db.select().from(configuracoes).limit(1);
    return res[0] || null;
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return null;
  }
}

export async function saveConfiguracoes(data: any) {
  try {
    const existing = await db.select().from(configuracoes).limit(1);
    
    if (existing.length > 0) {
      await db.update(configuracoes)
        .set(data)
        .where(eq(configuracoes.id, existing[0].id));
    } else {
      await db.insert(configuracoes).values(data);
    }
    
    revalidatePath("/(dashboard)/configuracoes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return { success: false, error: "Falha ao salvar configurações" };
  }
}
