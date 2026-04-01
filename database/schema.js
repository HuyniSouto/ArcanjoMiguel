import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Tabela de usuários com autenticação e controle de acesso por função
 */
export const usuarios = mysqlTable("usuarios", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  nome: text("nome"),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 20 }),
  endereco: text("endereco"),
  dataNascimento: timestamp("dataNascimento"),
  metodoLogin: varchar("metodoLogin", { length: 64 }),
  senha: varchar("senha", { length: 255 }),
  funcao: mysqlEnum("funcao", ["usuario", "admin"]).default("usuario").notNull(),
  tipoUsuario: mysqlEnum("tipoUsuario", ["membro", "visitante", "cooperador"]).default("membro"),
  fotoPerfil: text("fotoPerfil"),
  ativo: boolean("ativo").default(true),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
  ultimoAcesso: timestamp("ultimoAcesso").defaultNow().notNull(),
  deletadoEm: timestamp("deletadoEm"),
});

/**
 * Campanhas de doações (dízimos, ofertas, votações, campanhas especiais)
 */
export const campanhas = mysqlTable("campanhas", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  tipo: mysqlEnum("tipo", ["dizimo", "oferta", "votacao", "especial"]).notNull(),
  valorAlvo: decimal("valorAlvo", { precision: 10, scale: 2 }),
  valorAtual: decimal("valorAtual", { precision: 10, scale: 2 }).default("0"),
  dataInicio: timestamp("dataInicio").notNull(),
  dataFim: timestamp("dataFim"),
  ativa: boolean("ativa").default(true),
  banner: text("banner"),
  criadoPor: int("criadoPor").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

/**
 * Contribuições financeiras (dízimos, ofertas, votações, doações de campanhas)
 */
export const contribuicoes = mysqlTable("contribuicoes", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull(),
  campanhaId: int("campanhaId"),
  tipo: mysqlEnum("tipo", ["dizimo", "oferta", "votacao", "campanha"]).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  metodoPagamento: mysqlEnum("metodoPagamento", ["pix", "cartao", "dinheiro", "transferencia"]).notNull(),
  comproantePagamento: text("comproantePagamento"),
  status: mysqlEnum("status", ["pendente", "confirmado", "rejeitado"]).default("pendente"),
  mensagem: text("mensagem"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

/**
 * Pedidos de oração com fotos e funcionalidade de chat
 */
export const pedidosOracao = mysqlTable("pedidosOracao", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao").notNull(),
  fotos: json("fotos"),
  status: mysqlEnum("status", ["aberto", "fechado"]).default("aberto"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
  deletadoEm: timestamp("deletadoEm"),
});

/**
 * Mensagens/Chat para pedidos de oração e comunicação geral
 */
export const mensagens = mysqlTable("mensagens", {
  id: int("id").autoincrement().primaryKey(),
  pedidoOracaoId: int("pedidoOracaoId"),
  usuarioId: int("usuarioId").notNull(),
  conteudo: text("conteudo").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
});

/**
 * Testemunhos com fluxo de moderação
 */
export const testemunhos = mysqlTable("testemunhos", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  conteudo: text("conteudo").notNull(),
  fotos: json("fotos"),
  status: mysqlEnum("status", ["pendente", "aprovado", "rejeitado"]).default("pendente"),
  aprovadoPor: int("aprovadoPor"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
  deletadoEm: timestamp("deletadoEm"),
});

/**
 * Agendamento de visitas com fluxo de aprovação
 */
export const agendamentosVisitas = mysqlTable("agendamentosVisitas", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull(),
  dataRequisitada: timestamp("dataRequisitada").notNull(),
  horaRequisitada: varchar("horaRequisitada", { length: 5 }),
  motivo: text("motivo"),
  status: mysqlEnum("status", ["pendente", "aprovado", "rejeitado", "concluido"]).default("pendente"),
  aprovadoPor: int("aprovadoPor"),
  cooperadorId: int("cooperadorId"),
  notas: text("notas"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
  deletadoEm: timestamp("deletadoEm"),
});

/**
 * Produtos da loja interna
 */
export const produtosLoja = mysqlTable("produtosLoja", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  quantidade: int("quantidade").default(0),
  imagem: text("imagem"),
  criadoPor: int("criadoPor").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

/**
 * Compras na loja (para retirada presencial)
 */
export const comprasLoja = mysqlTable("comprasLoja", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull(),
  produtoId: int("produtoId").notNull(),
  quantidade: int("quantidade").notNull(),
  precoTotal: decimal("precoTotal", { precision: 10, scale: 2 }).notNull(),
  metodoPagamento: mysqlEnum("metodoPagamento", ["pix", "cartao", "dinheiro"]).notNull(),
  comproantePagamento: text("comproantePagamento"),
  status: mysqlEnum("status", ["pendente", "confirmado", "pronto_retirada", "concluido"]).default("pendente"),
  dataRetirada: timestamp("dataRetirada"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

/**
 * Despesas e gestão financeira
 */
export const despesas = mysqlTable("despesas", {
  id: int("id").autoincrement().primaryKey(),
  categoria: mysqlEnum("categoria", ["aluguel", "agua", "eletricidade", "manutencao", "suprimentos", "outro"]).notNull(),
  descricao: varchar("descricao", { length: 255 }),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  data: timestamp("data").notNull(),
  criadoPor: int("criadoPor").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

/**
 * Anúncios/Avisos da Igreja
 */
export const anuncios = mysqlTable("anuncios", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  conteudo: text("conteudo").notNull(),
  tipo: mysqlEnum("tipo", ["aviso", "apelo_doacao", "evento", "outro"]).notNull(),
  prioridade: mysqlEnum("prioridade", ["baixa", "media", "alta"]).default("media"),
  banner: text("banner"),
  criadoPor: int("criadoPor").notNull(),
  ativo: boolean("ativo").default(true),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

/**
 * Versículos bíblicos diários (em cache da API)
 */
export const versiculosDiarios = mysqlTable("versiculosDiarios", {
  id: int("id").autoincrement().primaryKey(),
  data: timestamp("data").notNull().unique(),
  livro: varchar("livro", { length: 50 }).notNull(),
  capitulo: int("capitulo").notNull(),
  versiculo: int("versiculo").notNull(),
  texto: text("texto").notNull(),
  traducao: varchar("traducao", { length: 50 }).default("ACF"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
});

/**
 * Tabela de Eventos da Igreja
 */
export const eventos = mysqlTable("eventos", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  dataEvento: timestamp("dataEvento").notNull(),
  local: varchar("local", { length: 255 }),
  banner: text("banner"),
  criadoPor: int("criadoPor").notNull(),
  ativo: boolean("ativo").default(true),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});
