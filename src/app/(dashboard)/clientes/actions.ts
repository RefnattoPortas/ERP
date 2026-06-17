"use server";

import { db } from "@/db";
import { clientes } from "@/db/schema";
import { eq, like, or, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getClientes(searchQuery?: string) {
  try {
    if (searchQuery) {
      return await db.select().from(clientes).where(
        or(
          like(clientes.name, `%${searchQuery}%`),
          like(clientes.company, `%${searchQuery}%`),
          like(clientes.doc, `%${searchQuery}%`)
        )
      ).orderBy(desc(clientes.id));
    }
    return await db.select().from(clientes).orderBy(desc(clientes.id));
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
}

export interface ClienteInput {
  id?: number;
  name: string;
  company?: string;
  doc?: string;
  email?: string;
  phone?: string;
  status?: "Ativo" | "Inativo";
}

export async function saveCliente(data: ClienteInput) {
  try {
    if (data.id) {
      // Update
      await db.update(clientes).set({
        name: data.name,
        company: data.company,
        doc: data.doc,
        email: data.email,
        phone: data.phone,
        status: data.status,
      }).where(eq(clientes.id, data.id));
    } else {
      // Create
      await db.insert(clientes).values({
        name: data.name,
        company: data.company,
        doc: data.doc,
        email: data.email,
        phone: data.phone,
        status: data.status,
      });
    }
    revalidatePath("/clientes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    return { success: false, error: "Falha ao salvar cliente" };
  }
}

export async function deleteCliente(id: number) {
  try {
    await db.delete(clientes).where(eq(clientes.id, id));
    revalidatePath("/clientes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    return { success: false, error: "Falha ao excluir cliente" };
  }
}
