import { createClient } from "@libsql/client";

const db = createClient({ url: "file:local.db" });

async function run() {
  const tables = ["pedidos", "pedido_itens", "clientes", "estoque", "configuracoes", "financeiro"];
  for (const table of tables) {
    const result = await db.execute(`PRAGMA table_info('${table}')`);
    console.log(`\n--- ${table} ---`);
    console.log(result.rows.map(r => r.name).join(", "));
  }
}

run().catch(console.error);
