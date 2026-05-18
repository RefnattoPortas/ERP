import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: "file:local.db",
  });

  try {
    console.log("Iniciando limpeza de dados (via SQL)...");

    await client.execute("DELETE FROM pedido_itens");
    await client.execute("DELETE FROM pedidos");
    await client.execute("DELETE FROM estoque");
    await client.execute("DELETE FROM clientes");
    await client.execute("DELETE FROM financeiro");
    await client.execute("DELETE FROM configuracoes");

    console.log("Sistema resetado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro na limpeza:", error);
    process.exit(1);
  }
}

main();
