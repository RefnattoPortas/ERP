import { createClient } from "@libsql/client";

const db = createClient({
  url: "file:local.db"
});

async function run() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pedido_itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id TEXT REFERENCES pedidos(id),
      produto_id INTEGER REFERENCES estoque(id),
      quantity INTEGER NOT NULL,
      price REAL NOT NULL
    );
  `);
  console.log("Table created.");
}

run().catch(console.error);
