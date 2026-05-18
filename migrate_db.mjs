import { createClient } from "@libsql/client";
import fs from "fs";

const db = createClient({ url: "file:local.db" });

const files = [
  "drizzle/0000_material_dakota_north.sql",
  "drizzle/0001_small_galactus.sql"
];

async function run() {
  for (const file of files) {
    const sql = fs.readFileSync(file, "utf-8");
    const statements = sql.split("--> statement-breakpoint");
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await db.execute(stmt.trim());
          console.log("Executed successfully.");
        } catch (e) {
          console.error("Ignored/Error executing:", e.message);
        }
      }
    }
  }
  console.log("Migration complete.");
}

run().catch(console.error);
