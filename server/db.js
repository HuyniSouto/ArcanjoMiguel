import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq, and, desc, sql } from 'drizzle-orm';
import * as schema from '../database/schema.js';

let _db = null;
let _connection = null;

/**
 * Obter instância do Drizzle ORM
 */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL, { schema, mode: 'default' });
      console.log('[Database] Conectado com sucesso');
    } catch (error) {
      console.error('[Database] Erro ao conectar:', error.message);
      _db = null;
    }
  }
  return _db;
}

/**
 * Obter conexão raw do MySQL
 */
export async function getRawConnection() {
  if (!_connection && process.env.DATABASE_URL) {
    try {
      _connection = await mysql.createConnection(process.env.DATABASE_URL);
      console.log('[Database] Conexão raw estabelecida');
    } catch (error) {
      console.error('[Database] Erro ao conectar (raw):', error.message);
      _connection = null;
    }
  }
  return _connection;
}

/**
 * Fechar conexões
 */
export async function closeConnections() {
  if (_connection) {
    await _connection.end();
    _connection = null;
  }
  _db = null;
}

// ============ USER QUERIES ============
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.query.usuarios.findMany({
    orderBy: [desc(schema.usuarios.criadoEm)]
  });
}

export async function getUserById(id) {
  const db = await getDb();
  if (!db) return undefined;
  return db.query.usuarios.findFirst({
    where: (usuarios, { eq }) => eq(usuarios.id, id),
  });
}

export async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return undefined;
  return db.query.usuarios.findFirst({
    where: (usuarios, { eq }) => eq(usuarios.openId, openId),
  });
}

export async function updateUserRole(id, role) {
  const db = await getDb();
  if (!db) return;
  return db.update(schema.usuarios).set({ funcao: role }).where(eq(schema.usuarios.id, id));
}

export async function upsertUser(user) {
  const db = await getDb();
  if (!db) return;

  try {
    const values = { openId: user.openId };
    const updateSet = {};

    if (user.name !== undefined) { values.nome = user.name ?? null; updateSet.nome = user.name ?? null; }
    if (user.email !== undefined) { values.email = user.email ?? null; updateSet.email = user.email ?? null; }
    if (user.loginMethod !== undefined) { values.metodoLogin = user.loginMethod ?? null; updateSet.metodoLogin = user.loginMethod ?? null; }
    if (user.lastSignedIn !== undefined) { values.ultimoAcesso = user.lastSignedIn; updateSet.ultimoAcesso = user.lastSignedIn; }
    if (user.role !== undefined) { values.funcao = user.role; updateSet.funcao = user.role; }

    if (!values.ultimoAcesso) values.ultimoAcesso = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.ultimoAcesso = new Date();

    await db.insert(schema.usuarios).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error('[Database] Erro ao fazer upsert de usuário:', error);
    throw error;
  }
}

// ============ CAMPAIGN QUERIES ============
export async function getAllCampaigns(onlyActive = true) {
  const db = await getDb();
  if (!db) return [];
  return db.query.campanhas.findMany({
    where: onlyActive ? (campanhas, { eq }) => eq(campanhas.ativa, true) : undefined,
    orderBy: [desc(schema.campanhas.criadoEm)]
  });
}

export async function createCampaign(campaign) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.campanhas).values({
    nome: campaign.nome,
    descricao: campaign.descricao,
    tipo: campaign.tipo,
    valorAlvo: campaign.valorAlvo,
    dataInicio: campaign.dataInicio || new Date(),
    dataFim: campaign.dataFim,
    ativa: campaign.ativa ?? true,
    banner: campaign.banner,
    criadoPor: campaign.criadoPor
  });
}

export async function updateCampaign(id, campaign) {
  const db = await getDb();
  if (!db) return;
  return db.update(schema.campanhas).set(campaign).where(eq(schema.campanhas.id, id));
}

export async function deleteCampaign(id) {
  const db = await getDb();
  if (!db) return;
  return db.delete(schema.campanhas).where(eq(schema.campanhas.id, id));
}

export async function getCampaignById(id) {
  const db = await getDb();
  if (!db) return undefined;
  return db.query.campanhas.findFirst({
    where: (campanhas, { eq }) => eq(campanhas.id, id),
  });
}

// ============ CONTRIBUTION QUERIES ============
export async function createContribution(contribution) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.contribuicoes).values({
    usuarioId: contribution.usuarioId,
    campanhaId: contribution.campanhaId,
    tipo: contribution.tipo,
    valor: contribution.valor,
    metodoPagamento: contribution.metodoPagamento,
    mensagem: contribution.mensagem,
    status: 'confirmado'
  });
}

export async function getContributionsByUser(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.query.contribuicoes.findMany({
    where: (contribuicoes, { eq }) => eq(contribuicoes.usuarioId, userId),
    orderBy: [desc(schema.contribuicoes.criadoEm)]
  });
}

export async function getAllContributions() {
  const db = await getDb();
  if (!db) return [];
  return db.query.contribuicoes.findMany({
    orderBy: [desc(schema.contribuicoes.criadoEm)]
  });
}

export async function getFinancialStats() {
  const db = await getDb();
  if (!db) return { totalEntradas: 0, totalSaidas: 0, saldo: 0 };
  
  const entradas = await db.select({ total: sql`sum(${schema.contribuicoes.valor})` }).from(schema.contribuicoes);
  const saidas = await db.select({ total: sql`sum(${schema.despesas.valor})` }).from(schema.despesas);
  const compras = await db.select({ total: sql`sum(${schema.comprasLoja.precoTotal})` }).from(schema.comprasLoja);

  const totalEntradas = Number(entradas[0]?.total || 0) + Number(compras[0]?.total || 0);
  const totalSaidas = Number(saidas[0]?.total || 0);

  return {
    totalEntradas,
    totalSaidas,
    saldo: totalEntradas - totalSaidas
  };
}

// ============ PRAYER REQUEST QUERIES ============
export async function createPrayerRequest(prayer) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.pedidosOracao).values({
    usuarioId: prayer.usuarioId,
    titulo: prayer.titulo,
    descricao: prayer.descricao,
    fotos: prayer.fotos || []
  });
}

export async function getPrayerRequestsByUser(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.query.pedidosOracao.findMany({
    where: (pedidosOracao, { eq }) => eq(pedidosOracao.usuarioId, userId),
    orderBy: [desc(schema.pedidosOracao.criadoEm)]
  });
}

export async function getAllPrayerRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.query.pedidosOracao.findMany({
    orderBy: [desc(schema.pedidosOracao.criadoEm)]
  });
}

export async function getPrayerRequestById(id) {
  const db = await getDb();
  if (!db) return undefined;
  return db.query.pedidosOracao.findFirst({
    where: (pedidosOracao, { eq }) => eq(pedidosOracao.id, id),
  });
}

// ============ MESSAGE QUERIES ============
export async function createMessage(message) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.mensagens).values({
    pedidoOracaoId: message.pedidoOracaoId,
    usuarioId: message.usuarioId,
    conteudo: message.conteudo
  });
}

export async function getMessagesByPrayerRequest(prayerRequestId) {
  const db = await getDb();
  if (!db) return [];
  return db.query.mensagens.findMany({
    where: (mensagens, { eq }) => eq(mensagens.pedidoOracaoId, prayerRequestId),
    orderBy: [schema.mensagens.criadoEm]
  });
}

// ============ TESTIMONY QUERIES ============
export async function createTestimony(testimony) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.testemunhos).values({
    usuarioId: testimony.usuarioId,
    titulo: testimony.titulo,
    conteudo: testimony.conteudo,
    fotos: testimony.fotos || [],
    status: 'pendente'
  });
}

export async function updateTestimonyStatus(id, status, adminId) {
  const db = await getDb();
  if (!db) return;
  return db.update(schema.testemunhos).set({ status, aprovadoPor: adminId }).where(eq(schema.testemunhos.id, id));
}

export async function getApprovedTestimonies() {
  const db = await getDb();
  if (!db) return [];
  return db.query.testemunhos.findMany({
    where: (testemunhos, { eq }) => eq(testemunhos.status, 'aprovado'),
    orderBy: [desc(schema.testemunhos.criadoEm)]
  });
}

export async function getAllTestimonies() {
  const db = await getDb();
  if (!db) return [];
  return db.query.testemunhos.findMany({
    orderBy: [desc(schema.testemunhos.criadoEm)]
  });
}

export async function getTestimoniesByUser(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.query.testemunhos.findMany({
    where: (testemunhos, { eq }) => eq(testemunhos.usuarioId, userId),
    orderBy: [desc(schema.testemunhos.criadoEm)]
  });
}

// ============ VISIT SCHEDULE QUERIES ============
export async function createVisitSchedule(visit) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.agendamentosVisitas).values({
    usuarioId: visit.usuarioId,
    dataRequisitada: visit.dataRequisitada,
    horaRequisitada: visit.horaRequisitada,
    motivo: visit.motivo,
    status: 'pendente'
  });
}

export async function updateVisitStatus(id, status) {
  const db = await getDb();
  if (!db) return;
  return db.update(schema.agendamentosVisitas).set({ status }).where(eq(schema.agendamentosVisitas.id, id));
}

export async function getVisitSchedulesByUser(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.query.agendamentosVisitas.findMany({
    where: (agendamentosVisitas, { eq }) => eq(agendamentosVisitas.usuarioId, userId),
    orderBy: [desc(schema.agendamentosVisitas.criadoEm)]
  });
}

export async function getAllVisitSchedules() {
  const db = await getDb();
  if (!db) return [];
  return db.query.agendamentosVisitas.findMany({
    orderBy: [desc(schema.agendamentosVisitas.criadoEm)]
  });
}

export async function getPendingVisitSchedules() {
  const db = await getDb();
  if (!db) return [];
  return db.query.agendamentosVisitas.findMany({
    where: (agendamentosVisitas, { eq }) => eq(agendamentosVisitas.status, 'pendente'),
    orderBy: [desc(schema.agendamentosVisitas.criadoEm)]
  });
}

// ============ STORE QUERIES ============
export async function getAllStoreProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.query.produtosLoja.findMany({
    orderBy: [desc(schema.produtosLoja.criadoEm)]
  });
}

export async function getStoreProductById(id) {
  const db = await getDb();
  if (!db) return undefined;
  return db.query.produtosLoja.findFirst({
    where: (produtosLoja, { eq }) => eq(produtosLoja.id, id),
  });
}

export async function createStoreProduct(product) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.produtosLoja).values(product);
}

export async function updateStoreProduct(id, product) {
  const db = await getDb();
  if (!db) return;
  return db.update(schema.produtosLoja).set(product).where(eq(schema.produtosLoja.id, id));
}

export async function deleteStoreProduct(id) {
  const db = await getDb();
  if (!db) return;
  return db.delete(schema.produtosLoja).where(eq(schema.produtosLoja.id, id));
}

export async function createStorePurchase(purchase) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.comprasLoja).values(purchase);
}

export async function getPurchasesByUser(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.query.comprasLoja.findMany({
    where: (comprasLoja, { eq }) => eq(comprasLoja.usuarioId, userId),
    orderBy: [desc(schema.comprasLoja.criadoEm)]
  });
}

export async function getAllStorePurchases() {
  const db = await getDb();
  if (!db) return [];
  return db.query.comprasLoja.findMany({
    orderBy: [desc(schema.comprasLoja.criadoEm)]
  });
}

// ============ EXPENSE QUERIES ============
export async function createExpense(expense) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.despesas).values(expense);
}

export async function getAllExpenses() {
  const db = await getDb();
  if (!db) return [];
  return db.query.despesas.findMany({
    orderBy: [desc(schema.despesas.data)]
  });
}

// ============ ANNOUNCEMENT QUERIES ============
export async function getActiveAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  return db.query.anuncios.findMany({
    where: (anuncios, { eq }) => eq(anuncios.ativo, true),
    orderBy: [desc(schema.anuncios.prioridade), desc(schema.anuncios.criadoEm)]
  });
}

export async function getAllAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  return db.query.anuncios.findMany({
    orderBy: [desc(schema.anuncios.criadoEm)]
  });
}

export async function createAnnouncement(announcement) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.anuncios).values(announcement);
}

export async function updateAnnouncement(id, announcement) {
  const db = await getDb();
  if (!db) return;
  return db.update(schema.anuncios).set(announcement).where(eq(schema.anuncios.id, id));
}

export async function deleteAnnouncement(id) {
  const db = await getDb();
  if (!db) return;
  return db.delete(schema.anuncios).where(eq(schema.anuncios.id, id));
}

// ============ EVENT QUERIES ============
export async function getAllEvents(onlyActive = true) {
  const db = await getDb();
  if (!db) return [];
  return db.query.eventos.findMany({
    where: onlyActive ? (eventos, { eq }) => eq(eventos.ativo, true) : undefined,
    orderBy: [desc(schema.eventos.dataEvento)]
  });
}

export async function createEvent(event) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.eventos).values(event);
}

export async function updateEvent(id, event) {
  const db = await getDb();
  if (!db) return;
  return db.update(schema.eventos).set(event).where(eq(schema.eventos.id, id));
}

export async function deleteEvent(id) {
  const db = await getDb();
  if (!db) return;
  return db.delete(schema.eventos).where(eq(schema.eventos.id, id));
}

// ============ REGISTRATION & PASSWORD QUERIES ============
export async function getUserByEmail(email) {
  const db = await getDb();
  if (!db) return undefined;
  return db.query.usuarios.findFirst({
    where: (usuarios, { eq }) => eq(usuarios.email, email),
  });
}

export async function createUser(user) {
  const db = await getDb();
  if (!db) return;
  return db.insert(schema.usuarios).values({
    openId: user.openId,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    endereco: user.endereco,
    senha: user.senha,
    funcao: user.funcao || 'usuario',
    tipoUsuario: user.tipoUsuario || 'membro',
    ativo: true
  });
}

export async function updateUserPassword(id, senha) {
  const db = await getDb();
  if (!db) return;
  return db.update(schema.usuarios).set({ senha }).where(eq(schema.usuarios.id, id));
}

// ============ DELETE QUERIES ============
export async function deletePrayerRequest(id) {
  const db = await getDb();
  if (!db) return;
  return db.delete(schema.pedidosOracao).where(eq(schema.pedidosOracao.id, id));
}

export async function deleteTestimony(id) {
  const db = await getDb();
  if (!db) return;
  return db.delete(schema.testemunhos).where(eq(schema.testemunhos.id, id));
}

export async function getVisitScheduleById(id) {
  const db = await getDb();
  if (!db) return undefined;
  return db.query.agendamentosVisitas.findFirst({
    where: (agendamentosVisitas, { eq }) => eq(agendamentosVisitas.id, id),
  });
}

export async function deleteVisitSchedule(id) {
  const db = await getDb();
  if (!db) return;
  return db.delete(schema.agendamentosVisitas).where(eq(schema.agendamentosVisitas.id, id));
}

// ============ PENDING QUERIES ============
export async function getPendingTestimonies() {
  const db = await getDb();
  if (!db) return [];
  return db.query.testemunhos.findMany({
    where: (testemunhos, { eq }) => eq(testemunhos.status, 'pendente'),
    orderBy: [desc(schema.testemunhos.criadoEm)]
  });
}
