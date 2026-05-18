CREATE TABLE `clientes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`company` text,
	`doc` text,
	`email` text,
	`phone` text,
	`status` text DEFAULT 'Ativo',
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `configuracoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`razao_social` text,
	`nome_fantasia` text,
	`cnpj` text,
	`logradouro` text,
	`bairro` text,
	`cidade` text,
	`estado` text,
	`cep` text,
	`telefone` text,
	`email` text,
	`logo_url` text,
	`validade_orcamento` integer DEFAULT 15,
	`formas_pagamento` text,
	`observacoes_padrao` text
);
--> statement-breakpoint
CREATE TABLE `estoque` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`sku` text NOT NULL,
	`category` text,
	`stock` integer DEFAULT 0,
	`cost` real DEFAULT 0,
	`supplier` text,
	`critical` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `estoque_sku_unique` ON `estoque` (`sku`);--> statement-breakpoint
CREATE TABLE `financeiro` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`doc` text,
	`description` text NOT NULL,
	`value` real NOT NULL,
	`category` text,
	`type` text NOT NULL,
	`status` text DEFAULT 'Pendente'
);
--> statement-breakpoint
CREATE TABLE `pedido_itens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pedido_id` text,
	`produto_id` integer,
	`quantity` integer NOT NULL,
	`price` real NOT NULL,
	FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`produto_id`) REFERENCES `estoque`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pedidos` (
	`id` text PRIMARY KEY NOT NULL,
	`cliente_id` integer,
	`date` text NOT NULL,
	`status` text NOT NULL,
	`total` real NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE no action
);
