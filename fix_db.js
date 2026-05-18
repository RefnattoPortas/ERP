import Database from 'better-sqlite3';

const db = new Database('local.db');

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pedido_itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id TEXT REFERENCES pedidos(id),
      produto_id INTEGER REFERENCES estoque(id),
      quantity INTEGER NOT NULL,
      price REAL NOT NULL
    );
  `);
  console.log('Tabela pedido_itens criada com sucesso.');
} catch (e) {
  console.error(e);
}
