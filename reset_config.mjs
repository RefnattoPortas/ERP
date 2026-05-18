import { createClient } from "@libsql/client";
import fs from "fs";

const db = createClient({ url: "file:local.db" });

async function run() {
  await db.execute("DROP TABLE IF EXISTS configuracoes");
  
  const sql = fs.readFileSync("drizzle/0000_material_dakota_north.sql", "utf-8");
  const statements = sql.split("--> statement-breakpoint");
  for (const stmt of statements) {
    if (stmt.includes("CREATE TABLE `configuracoes`")) {
      await db.execute(stmt.trim());
      console.log("Recreated configuracoes");
    }
  }
}

run().catch(console.error);
