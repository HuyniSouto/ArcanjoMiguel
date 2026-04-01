import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb, closeConnections } from './db.js';
import { authMiddleware, adminMiddleware } from './auth.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerUserRoutes } from './routes/users.js';
import { registerCampaignRoutes } from './routes/campaigns.js';
import { registerContributionRoutes } from './routes/contributions.js';
import { registerPrayerRoutes } from './routes/prayers.js';
import { registerTestimonyRoutes } from './routes/testimonies.js';
import { registerVisitRoutes } from './routes/visits.js';
import { registerStoreRoutes } from './routes/store.js';
import { registerExpenseRoutes } from './routes/expenses.js';
import { registerAnnouncementRoutes } from './routes/announcements.js';
import { registerEventRoutes } from './routes/events.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Verificar se porta está disponível
 */
function isPortAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

/**
 * Encontrar porta disponível
 */
async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`Nenhuma porta disponível a partir de ${startPort}`);
}

/**
 * Iniciar servidor
 */
async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middlewares globais
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // CORS simples
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Verificar conexão com banco de dados
  try {
    const db = await getDb();
    if (db) {
      console.log('[Server] Banco de dados conectado com sucesso');
    } else {
      console.warn('[Server] Aviso: Banco de dados não conectado');
    }
  } catch (error) {
    console.error('[Server] Erro ao conectar ao banco de dados:', error.message);
  }

  // Rotas públicas
  registerAuthRoutes(app);

  // Rotas protegidas (requerem autenticação)
  app.use('/api/users', authMiddleware, registerUserRoutes());
  app.use('/api/campaigns', authMiddleware, registerCampaignRoutes());
  app.use('/api/contributions', authMiddleware, registerContributionRoutes());
  app.use('/api/prayers', authMiddleware, registerPrayerRoutes());
  app.use('/api/testimonies', authMiddleware, registerTestimonyRoutes());
  app.use('/api/visits', authMiddleware, registerVisitRoutes());
  app.use('/api/store', authMiddleware, registerStoreRoutes());
  app.use('/api/expenses', authMiddleware, adminMiddleware, registerExpenseRoutes());
  app.use('/api/announcements', authMiddleware, registerAnnouncementRoutes());
  app.use('/api/events', authMiddleware, registerEventRoutes());

  // Servir arquivos estáticos do cliente
  const clientPath = path.join(__dirname, '../client');
  app.use(express.static(clientPath));

  // SPA fallback - servir index.html para todas as rotas não encontradas
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });

  // Tratamento de erros global
  app.use((err, req, res, next) => {
    console.error('[Server] Erro:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Erro interno do servidor',
    });
  });

  // Encontrar porta disponível
  const preferredPort = parseInt(process.env.PORT || '3000');
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`[Server] Porta ${preferredPort} está em uso, usando porta ${port}`);
  }

  // Iniciar servidor
  server.listen(port, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║     🙏 ARCANJO MIGUEL - Sistema de Gerenciamento      ║
║                                                        ║
║  Servidor rodando em: http://localhost:${port}/
║  Ambiente: ${process.env.NODE_ENV || 'development'}
║  Banco de dados: ${process.env.DATABASE_URL ? 'Conectado' : 'Não configurado'}
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n[Server] Encerrando servidor...');
    await closeConnections();
    server.close(() => {
      console.log('[Server] Servidor encerrado');
      process.exit(0);
    });
  });
}

// Iniciar
startServer().catch(error => {
  console.error('[Server] Erro ao iniciar servidor:', error);
  process.exit(1);
});
