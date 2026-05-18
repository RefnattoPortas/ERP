import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: "file:local.db",
  });

  const data = {
    "empresa": "Solagua - Playarts Pets",
    "tabela_versao": "Abril 2026",
    "politicas": {
      "pedido_minimo": 1800.00,
      "prazo_entrega_dias": "10 a 20 dias",
      "forma_pagamento": ["Pix", "Boleto"],
      "observacoes": "Valores para playground com pintura somente nas varetas horizontais (Linha Mista). Na linha com pintura completa será acrescido 30%. Frete FOB com pedido mínimo de R$ 1000,00 para retirar na fábrica."
    },
    "categorias": {
      "brinquedos_aves": [
        {"id": "001", "nome": "BRINQUEDO PAPAGAIO COLORIDO - GAIOLA", "preco_unitario": 8.63},
        {"id": "002", "nome": "BRINQUEDO PAPAGAIO NATURAL - GAIOLA", "preco_unitario": 7.88},
        {"id": "003", "nome": "BRINQ. CALOPS. TRAP. PEQ. COLORIDO - GAIOLA", "preco_unitario": 5.25},
        {"id": "004", "nome": "BRINQ. CALOPS. PEQ. COLORIDO - GAIOLA", "preco_unitario": 5.25},
        {"id": "005", "nome": "BALANÇO PAPAGAIO BASTÃO COLORIDO", "preco_unitario": 11.00},
        {"id": "006", "nome": "BALANÇO PAPAGAIO BASTÃO NATURAL", "preco_unitario": 10.00},
        {"id": "007", "nome": "BALANÇO CALOPSITA BASTÃO COLORIDO", "preco_unitario": 9.20},
        {"id": "008", "nome": "BALANÇO CALOPSITA BASTÃO NATURAL", "preco_unitario": 8.20},
        {"id": "009", "nome": "BALANÇO EM ARCO PERIQUITO COLORIDO GAIOLA", "preco_unitario": 7.13},
        {"id": "011", "nome": "BALANÇO EM ARCO CALOPSITA COLORIDO GAIOLA", "preco_unitario": 8.90},
        {"id": "012", "nome": "ESCADA BALANÇO COM 2 DEGRAUS - GAIOLA", "preco_unitario": 9.38},
        {"id": "013", "nome": "ESCADA COM 3 DEGRAUS COLORIDO GAIOLA", "preco_unitario": 8.25},
        {"id": "014", "nome": "ESCADA C/ 4 DEGRAUS COLORIDO GAIOLA", "preco_unitario": 9.50},
        {"id": "015", "nome": "ESCADA COM 4 DEGRAUS PERIQUITO COLORIDO (FIXA)", "preco_unitario": 9.25},
        {"id": "018", "nome": "ESCADA COM 40 cm (PAPAGAIO, CALOPSITA) C/ 17 LARG", "preco_unitario": 12.30},
        {"id": "019", "nome": "ESCADA COM 60 cm (PAPAGAIO, CALOPSITA) C/ 17 LARG", "preco_unitario": 15.60},
        {"id": "020", "nome": "ESCADA COM 80 cm (PAPAGAIO, CALOPSITA) C/ 17 LARG", "preco_unitario": 16.80},
        {"id": "021", "nome": "ESCADA COM 1mt (PAPAGAIO, CALOPSITA) C/ 17 LARG", "preco_unitario": 18.50},
        {"id": "065", "nome": "BRINQUEDO ESCADA PARA PAPAGAIO COM 1MT", "preco_unitario": 25.60},
        {"id": "022", "nome": "ESPELHO PARA CALOPSITA Med. 12cm compr x 10 larg", "preco_unitario": 5.50},
        {"id": "1026", "nome": "ESPELHO DUPLO PARA CALOPSITA", "preco_unitario": 9.90},
        {"id": "023", "nome": "BALANÇO EM ARCO C/ CASCA DE PINUS - GAIOLA", "preco_unitario": 9.50},
        {"id": "024", "nome": "BRINQ PAPAGAIO CASCA PINUS PEQUENO GAIOLA", "preco_unitario": 8.90},
        {"id": "025", "nome": "BRINQ PAPAGAIO CASCA PINUS MEDIO GAIOLA", "preco_unitario": 9.90},
        {"id": "026", "nome": "ESCADA COM 5 DEGRAUS COLORIDA", "preco_unitario": 11.00},
        {"id": "027", "nome": "BRINQUEDO COBRINHA 40 CM - GAIOLA (CASCA DE PINUS)", "preco_unitario": 10.63},
        {"id": "028", "nome": "BRINQ BALANÇO RING NECK", "preco_unitario": 11.13},
        {"id": "029", "nome": "BRINQ TRAPÉZIO PARA PAPAGAIO", "preco_unitario": 10.13},
        {"id": "030", "nome": "BRINQUEDO COM 4 CANELAS E 3 MADEIRAS", "preco_unitario": 16.13},
        {"id": "031", "nome": "BRINQ PONTE PARA CALOPSITA GAIOLA", "preco_unitario": 10.13},
        {"id": "032", "nome": "BRINQ REDONDO PARA GAIOLA", "preco_unitario": 10.13},
        {"id": "034", "nome": "BALANÇO PERIQUITO COM TRAVESSA", "preco_unitario": 8.50},
        {"id": "036", "nome": "BRINQ BALANÇO CAMURÇA", "preco_unitario": 16.13},
        {"id": "040", "nome": "BRINQ COM SINO", "preco_unitario": 14.88},
        {"id": "042", "nome": "BRINQUEDO PIRAMEDE GRANDE", "preco_unitario": 16.13},
        {"id": "044", "nome": "BRINQUEDO COM 12 PALITOS", "preco_unitario": 12.38},
        {"id": "045", "nome": "BRINQUEDO COBRINHA COM CASCA", "preco_unitario": 13.63},
        {"id": "050", "nome": "BRINQUEDO PINGENTE COM CASCA DE PINUS", "preco_unitario": 14.00},
        {"id": "059", "nome": "BRINQUEDO POLEIRO BALANÇA", "preco_unitario": 12.38},
        {"id": "062", "nome": "BRINQUEDO BALANÇO COM CASCA DE PINUS", "preco_unitario": 17.38},
        {"id": "069", "nome": "BRINQUEDO PARA ARARA (VIVEIRO)", "preco_unitario": 45.60},
        {"id": "070", "nome": "BRINQUEDO BALANÇO PAPAGAIO DUPLO COLORIDO", "preco_unitario": 15.00},
        {"id": "071", "nome": "BRINQUEDO BALANÇO PAPAGAIO GIGANTE", "preco_unitario": 35.80},
        {"id": "072", "nome": "BRINQUEDO BALANÇO COM CASCA NATURAL", "preco_unitario": 9.00},
        {"id": "077", "nome": "CORRENTE PLASTICA PEQUENA", "preco_unitario": 11.13},
        {"id": "078", "nome": "CORRENTE PLASTICA GRANDE", "preco_unitario": 12.38},
        {"id": "085", "nome": "BRINQ PONTE PARA GAIOLA NATURAL", "preco_unitario": 10.25},
        {"id": "086", "nome": "BRINQ ARGOLA PARA CALOPSITA", "preco_unitario": 6.00},
        {"id": "087", "nome": "BRINQ ARGOLA PARA PERIQUITO", "preco_unitario": 4.50},
        {"id": "096", "nome": "BRINQ PAPAGAIO COM CORRENTE", "preco_unitario": 26.00},
        {"id": "098", "nome": "BRINQ PINGENTE NATURAL", "preco_unitario": 11.13},
        {"id": "099", "nome": "BRINQ EM MADEIRA NATURAL", "preco_unitario": 11.13},
        {"id": "100", "nome": "BRINQ ARGOLA E CASCA", "preco_unitario": 12.38},
        {"id": "101", "nome": "BRINQ PENDULO CASCA MADEIRA", "preco_unitario": 17.00},
        {"id": "105", "nome": "BRINQ PASSARINHO", "preco_unitario": 12.38},
        {"id": "106", "nome": "BRINQ PASSARINHO DUPLO", "preco_unitario": 12.38},
        {"id": "112", "nome": "BRINQ. BALANÇO PAPAGAIO", "preco_unitario": 18.00},
        {"id": "123", "nome": "ESCADA CURVADA", "preco_unitario": 9.25},
        {"id": "127", "nome": "PLATAFORMA", "preco_unitario": 15.00},
        {"id": "129", "nome": "BRINQ ANDAIME", "preco_unitario": 17.00},
        {"id": "131", "nome": "BRINQ. BALANÇO RING NECK COM CASCA", "preco_unitario": 15.00}
      ],
      "playground_aves": [
        {"id": "1001", "nome": "PLAYGROUND CARACOL", "preco_unitario_misto": 18.70, "preco_unitario_colorido": 24.31},
        {"id": "1002", "nome": "PLAYGROUND TRAPÉZIO", "preco_unitario_misto": 18.70, "preco_unitario_colorido": 24.31},
        {"id": "1003", "nome": "PLAYGROUND BABY", "preco_unitario_misto": 18.50, "preco_unitario_colorido": 24.05},
        {"id": "1004", "nome": "PLAYGROUND MINI", "preco_unitario_misto": 18.80, "preco_unitario_colorido": 24.44},
        {"id": "1005", "nome": "PLAYGROUND MÉDIO", "preco_unitario_misto": 18.80, "preco_unitario_colorido": 24.44},
        {"id": "1006", "nome": "PLAYGROUND GRANDE S/PONTE", "preco_unitario_misto": 39.90, "preco_unitario_colorido": 51.87},
        {"id": "1007", "nome": "PLAYGROUND MARITACA CARACOL PEQ", "preco_unitario_misto": 29.90, "preco_unitario_colorido": 38.87},
        {"id": "1008", "nome": "TRANSPORTE PNO PARA CALOPSITA ADULTA", "preco_unitario_misto": 31.50, "preco_unitario_colorido": 40.95},
        {"id": "1011", "nome": "PLAYGROUND JANDAIA", "preco_unitario_misto": 49.00, "preco_unitario_colorido": 63.70},
        {"id": "1013", "nome": "PLAYGROUND ARVORE COM ESPELHO", "preco_unitario_misto": 38.70, "preco_unitario_colorido": 50.31},
        {"id": "1015", "nome": "PLAYGROUND COM CHALÉ", "preco_unitario_misto": 42.50, "preco_unitario_colorido": 55.25},
        {"id": "1016", "nome": "SUPORTE 23MM COLORIDO 80 cm", "preco_unitario_misto": 30.80, "preco_unitario_colorido": 40.04},
        {"id": "1019", "nome": "PLAYGROUND CASTELO COM ESPELHO", "preco_unitario_misto": 42.50, "preco_unitario_colorido": 55.25},
        {"id": "1020", "nome": "PLAYGROUND NINHO", "preco_unitario_misto": 42.50, "preco_unitario_colorido": 55.25},
        {"id": "1021", "nome": "PLAYGROUND CASINHA", "preco_unitario_misto": 32.00, "preco_unitario_colorido": 41.60},
        {"id": "1022", "nome": "PLAY CASA GRANDE/MÓVEL 2 FACE COM ESPELHO", "preco_unitario_misto": 56.40, "preco_unitario_colorido": 73.32},
        {"id": "1023", "nome": "PLAY QUIOSQUE", "preco_unitario_misto": 67.70, "preco_unitario_colorido": 88.01},
        {"id": "1024", "nome": "TRANSPORTE GDE PARA CALOPSITA ADULTA", "preco_unitario_misto": 44.60, "preco_unitario_colorido": 57.98},
        {"id": "1025", "nome": "PLAYGROUND P/PAPAGAIO C/ 3 ESCADAS", "preco_unitario_misto": 98.80, "preco_unitario_colorido": 128.44},
        {"id": "1027", "nome": "PLAYGROUND CASA DA ARVORE COM ESPELHO", "preco_unitario_misto": 42.50, "preco_unitario_colorido": 55.25},
        {"id": "1029", "nome": "PLAYGROUND GRANDE C/PONTE", "preco_unitario_misto": 42.50, "preco_unitario_colorido": 55.25},
        {"id": "1030", "nome": "SUPORTE PARA PLAYGROUND PAPAG. GIGANTE", "preco_unitario_misto": 44.50, "preco_unitario_colorido": 57.85},
        {"id": "1031", "nome": "NINHO EM MDF PARA CALOPSITA (GRANDE)", "preco_unitario_misto": 23.50, "preco_unitario_colorido": 30.55},
        {"id": "1034", "nome": "PLAY FANTASIA 2 ANDARES PONTE", "preco_unitario_misto": 98.80, "preco_unitario_colorido": 128.44},
        {"id": "1036", "nome": "PLAYGROUND JANDAIA C/PONTE", "preco_unitario_misto": 55.00, "preco_unitario_colorido": 71.50},
        {"id": "1037", "nome": "PLAY PAPAGAIO GIG. C/ CASINHA", "preco_unitario_misto": 126.80, "preco_unitario_colorido": 164.84},
        {"id": "1038", "nome": "PLAY TRAPEZIO COM CASINHA", "preco_unitario_misto": 98.90, "preco_unitario_colorido": 128.57},
        {"id": "1044", "nome": "PLAY DOCE LAR COM ESPELHO", "preco_unitario_misto": 72.00, "preco_unitario_colorido": 93.60},
        {"id": "1009", "nome": "TRATADOR PARA PÁSSAROS MDF", "preco_unitario_misto": 35.50, "preco_unitario_colorido": 46.15},
        {"id": "1010", "nome": "TRATADOR PARA PÁSSAROS COM NINHO MDF", "preco_unitario_misto": 42.30, "preco_unitario_colorido": 54.99},
        {"id": "1032", "nome": "TRATADOR PARA PÁSSAROS EM PINUS", "preco_unitario_misto": 49.90, "preco_unitario_colorido": 64.87},
        {"id": "1045", "nome": "PLAY DOCE LAR CASA ABERTA", "preco_unitario_misto": 72.00, "preco_unitario_colorido": 93.60},
        {"id": "1050", "nome": "PLAY FANTASIA 2 ANDARES COM 4 ESCADAS", "preco_unitario_misto": 98.90, "preco_unitario_colorido": 128.57},
        {"id": "1051", "nome": "PLAY FANTASIA PAPAGAIO GIGANTE", "preco_unitario_misto": 154.00, "preco_unitario_colorido": 200.20},
        {"id": "1053", "nome": "PLAY FANTASIA 2 ANDARES COM CASINHA ABERTA", "preco_unitario_misto": 110.00, "preco_unitario_colorido": 143.00},
        {"id": "1057", "nome": "PLAYGROUND SONHO MEU COM ESPELHO", "preco_unitario_misto": 42.50, "preco_unitario_colorido": 55.25},
        {"id": "1066", "nome": "PLAY PARA RING NECK", "preco_unitario_misto": 65.00, "preco_unitario_colorido": 84.50},
        {"id": "1068", "nome": "PLAY DIVERTIDO", "preco_unitario_misto": 90.00, "preco_unitario_colorido": 117.00},
        {"id": "1070", "nome": "PLAYGROUND COD 1070", "preco_unitario_misto": 70.00, "preco_unitario_colorido": 74.90}
      ],
      "roedores": [
        {"id": "2000", "nome": "TOCA VARETA HAMSTER", "preco_unitario": 9.20},
        {"id": "2003", "nome": "TOCA HAMSTER PEQUENA COLORIDA", "preco_unitario": 9.20},
        {"id": "2004", "nome": "CASINHA PARA PORQUINHO (PEQUENA)", "preco_unitario": 23.63},
        {"id": "2005", "nome": "CASINHA MEDIA MINI COELHO", "preco_unitario": 25.70},
        {"id": "2006", "nome": "CASINHA GRANDE P/ COELHO", "preco_unitario": 31.50},
        {"id": "2007", "nome": "CASINHA PORQUINHO DA INDIA C/ TETO REMOV.", "preco_unitario": 45.75},
        {"id": "2009", "nome": "BRINQ. EM MDF/MADEIRA U PARA COELHO", "preco_unitario": 14.88},
        {"id": "2010", "nome": "BRINQ. EM MDF/MADEIRA U C/ CASCA", "preco_unitario": 14.88},
        {"id": "2011", "nome": "BRINQUEDO EM MADEIRA E CASCA PARA HAMSTER", "preco_unitario": 11.00},
        {"id": "2012", "nome": "BRINQUEDO PORTA FENO PARA COELHO GRANDE", "preco_unitario": 11.00},
        {"id": "2013", "nome": "BRINQUEDO PORTA FENO PARA COELHO MEDIO", "preco_unitario": 9.00},
        {"id": "2020", "nome": "BRINQ. TOCA PARA COELHO VARETAS", "preco_unitario": 40.60},
        {"id": "2022", "nome": "BRINQ. GANGORRA", "preco_unitario": 5.50},
        {"id": "2023", "nome": "BRINQ. PLAYGROUND EM MADEIRA P/ HAMSTER CARACOL", "preco_unitario": 18.00},
        {"id": "2030", "nome": "BRINQ. BALANÇO PARA HAMSTER", "preco_unitario": 7.90},
        {"id": "2029", "nome": "CUBO HAMSTER", "preco_unitario": 7.90},
        {"id": "2034", "nome": "TOCA EM ARCO PARA PORQUINHO DA INDIA", "preco_unitario": 29.00},
        {"id": "2035", "nome": "BRINQ DIVERTIDO COM ARGOLAS", "preco_unitario": 17.90},
        {"id": "2036", "nome": "BRINQ PEQ EM MADEIRA E CORDA", "preco_unitario": 10.00},
        {"id": "2037", "nome": "BRINQ MEDIO EM MADEIRA E CORDA", "preco_unitario": 12.00},
        {"id": "2038", "nome": "BRINQ GRANDE EM MADEIRA E CORDA", "preco_unitario": 14.00},
        {"id": "2039", "nome": "BRINQ POSTINHO EM MADEIRA E CORDA", "preco_unitario": 29.00},
        {"id": "2040", "nome": "BRINQ CADE O PETISCO", "preco_unitario": 25.00},
        {"id": "2041", "nome": "BRINQ PETISQUEIRA POSTINHO", "preco_unitario": 17.00},
        {"id": "2042", "nome": "BRINQ PLATAFORMA DIVERTIDA", "preco_unitario": 32.00}
      ],
      "gatos": [
        {"id": "3003", "nome": "CAMA DE GATO SEM REDE", "preco_unitario": 42.50},
        {"id": "3004", "nome": "PONTE DIVERTIDA", "preco_unitario": 65.00},
        {"id": "3005", "nome": "ESCADA PARA GATOS", "preco_unitario": 65.00},
        {"id": "3006", "nome": "ARRANHADOR PAREDE", "preco_unitario": 55.00},
        {"id": "3007", "nome": "ARRANHADOR GIRATORIO", "preco_unitario": 55.00},
        {"id": "3008", "nome": "COMEDOURO ELEVADO DUPLO PEQUENO", "preco_unitario": 35.00},
        {"id": "3009", "nome": "COMEDOURO ELEVADO DUPLO MEDIO", "preco_unitario": 40.00}
      ],
      "jardim": [
        {"id": "5000", "nome": "FLOREIRA VERTICAL DUPLA EM PINUS NATURAL", "preco_unitario": 65.00},
        {"id": "5001", "nome": "FLOREIRA CARRIOLA EM PINUS NATURAL", "preco_unitario": 50.00},
        {"id": "5002", "nome": "PLAQUINHA DE JARDIM MEDIA", "preco_unitario": 19.90},
        {"id": "5003", "nome": "FLOREIRA VERTICAL PLATAFORMA EM PINUS NATURAL", "preco_unitario": 50.00},
        {"id": "5004", "nome": "FLOREIRA VERTICAL CACHEPÓ EM PINUS NATURAL", "preco_unitario": 50.00},
        {"id": "5005", "nome": "FLOREIRA VERTICAL CCHEPÓ EM PINUS NATURAL (VARIÇÃO)", "preco_unitario": 50.00}
      ],
      "varetas": [
        {"id": "6000", "nome": "VARETA DE 9,5 MM ESTRIADA COM 1 MT", "preco_unitario": 1.80},
        {"id": "6001", "nome": "VARETA DE 12 MM ESTRIADA COM 1 MT", "preco_unitario": 2.10},
        {"id": "6002", "nome": "VARETA DE 15MM LISA COM 1 MT", "preco_unitario": 2.50},
        {"id": "6003", "nome": "VARETA DE 23 MM LISA COM 1 MT", "preco_unitario": 4.50}
      ],
      "tratadores": [
        {"id": "7000", "nome": "TRATADOR GRANDE COM POLEIRO EM PINUS NATURAL", "preco_unitario": 70.00},
        {"id": "7001", "nome": "TRATADOR PEQ EM PINUS NATURAL", "preco_unitario": 60.00},
        {"id": "7002", "nome": "TRATADOR PEQ PAREDE EM PINUS NATURAL", "preco_unitario": 50.00},
        {"id": "7003", "nome": "TRATADOR PEQ CASINHA EM PINUS NATURAL", "preco_unitario": 65.00},
        {"id": "7004", "nome": "CASINHA DECORATIVA NINHO PEQUENO", "preco_unitario": 35.00}
      ]
    }
  };

  try {
    console.log("Iniciando importação Playarts Pets (via SQL)...");

    // Limpar estoque
    await client.execute("DELETE FROM estoque");
    console.log("Estoque limpo.");

    const itemsToInsert = [];

    // Brinquedos e Categorias Simples
    for (const [catKey, products] of Object.entries(data.categorias)) {
      if (catKey === "playground_aves") continue;

      products.forEach(p => {
        itemsToInsert.push({
          name: p.nome,
          sku: `PP-${p.id}`,
          category: catKey.charAt(0).toUpperCase() + catKey.slice(1),
          stock: 50,
          purchase_price: p.preco_unitario,
          cost: p.preco_unitario,
          supplier: "Playarts Pets"
        });
      });
    }

    // Playground Aves
    data.categorias.playground_aves.forEach(p => {
      itemsToInsert.push({
        name: `${p.nome} - Misto`,
        sku: `PP-${p.id}-M`,
        category: "Playground Aves",
        stock: 30,
        purchase_price: p.preco_unitario_misto,
        cost: p.preco_unitario_misto,
        supplier: "Playarts Pets"
      });
      itemsToInsert.push({
        name: `${p.nome} - Colorido`,
        sku: `PP-${p.id}-C`,
        category: "Playground Aves",
        stock: 30,
        purchase_price: p.preco_unitario_colorido,
        cost: p.preco_unitario_colorido,
        supplier: "Playarts Pets"
      });
    });

    // Inserir produtos
    for (const item of itemsToInsert) {
      await client.execute({
        sql: "INSERT INTO estoque (name, sku, category, stock, purchase_price, cost, supplier) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [item.name, item.sku, item.category, item.stock, item.purchase_price, item.cost, item.supplier]
      });
    }
    console.log(`${itemsToInsert.length} produtos importados.`);

    // Atualizar Configurações
    await client.execute("DELETE FROM configuracoes");
    const obs = data.politicas.observacoes + "\nPedido Minimo: R$ " + data.politicas.pedido_minimo.toFixed(2);
    await client.execute({
      sql: "INSERT INTO configuracoes (nome_fantasia, razao_social, formas_pagamento, observacoes_padrao) VALUES (?, ?, ?, ?)",
      args: [data.empresa, data.empresa, data.politicas.forma_pagamento.join(", "), obs]
    });
    console.log("Configurações atualizadas.");

    console.log("Importação concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro na importação:", error);
    process.exit(1);
  }
}

main();
