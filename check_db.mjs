import { createClient } from "@libsql/client";

const db = createClient({ url: "file:local.db" });

async function run() {
  const result = await db.execute("PRAGMA table_info('configuracoes')");
  console.log(result.rows);
}

run().catch(console.error);
