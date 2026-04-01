import express from 'express';
import { getPrayerRequestsByUser, getAllPrayerRequests, getPrayerRequestById, getMessagesByPrayerRequest, createPrayerRequest, createMessage, deletePrayerRequest } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerPrayerRoutes() {
  const router = express.Router();

  /**
   * GET /api/prayers
   * Listar pedidos de oração do usuário
   */
  router.get('/', async (req, res) => {
    try {
      const prayers = await getPrayerRequestsByUser(req.user.id);
      res.json(prayers);
    } catch (error) {
      console.error('[Prayers] Erro ao listar pedidos de oração:', error);
      res.status(500).json({ error: 'Erro ao listar pedidos de oração' });
    }
  });

  /**
   * POST /api/prayers
   * Criar novo pedido de oração (apenas usuários comuns)
   */
  router.post('/', async (req, res) => {
    try {
      if (req.user.role === 'admin') {
        return res.status(403).json({ error: 'Administradores não podem criar pedidos de oração' });
      }

      const { titulo, descricao, fotos } = req.body;
      if (!titulo || !descricao) {
        return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
      }
      await createPrayerRequest({
        usuarioId: req.user.id,
        titulo,
        descricao,
        fotos
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Prayers] Erro ao criar pedido:', error);
      res.status(500).json({ error: 'Erro ao criar pedido de oração' });
    }
  });

  /**
   * GET /api/prayers/all
   * Listar todos os pedidos de oração (apenas admin)
   */
  router.get('/all', adminMiddleware, async (req, res) => {
    try {
      const prayers = await getAllPrayerRequests();
      res.json(prayers);
    } catch (error) {
      console.error('[Prayers] Erro ao listar todos os pedidos:', error);
      res.status(500).json({ error: 'Erro ao listar pedidos de oração' });
    }
  });

  /**
   * GET /api/prayers/:id
   * Obter pedido de oração por ID
   */
  router.get('/:id', async (req, res) => {
    try {
      const prayer = await getPrayerRequestById(parseInt(req.params.id));
      if (!prayer) {
        return res.status(404).json({ error: 'Pedido de oração não encontrado' });
      }
      res.json(prayer);
    } catch (error) {
      console.error('[Prayers] Erro ao obter pedido:', error);
      res.status(500).json({ error: 'Erro ao obter pedido de oração' });
    }
  });

  /**
   * DELETE /api/prayers/:id
   * Deletar pedido de oração (admin ou dono)
   */
  router.delete('/:id', async (req, res) => {
    try {
      const prayer = await getPrayerRequestById(parseInt(req.params.id));
      if (!prayer) {
        return res.status(404).json({ error: 'Pedido de oração não encontrado' });
      }

      // Verificar permissão
      if (req.user.role !== 'admin' && req.user.id !== prayer.usuarioId) {
        return res.status(403).json({ error: 'Sem permissão para deletar este pedido' });
      }

      await deletePrayerRequest(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('[Prayers] Erro ao deletar pedido:', error);
      res.status(500).json({ error: 'Erro ao deletar pedido de oração' });
    }
  });

  /**
   * GET /api/prayers/:id/messages
   * Obter mensagens de um pedido de oração
   */
  router.get('/:id/messages', async (req, res) => {
    try {
      const messages = await getMessagesByPrayerRequest(parseInt(req.params.id));
      res.json(messages);
    } catch (error) {
      console.error('[Prayers] Erro ao obter mensagens:', error);
      res.status(500).json({ error: 'Erro ao obter mensagens' });
    }
  });

  /**
   * POST /api/prayers/:id/messages
   * Enviar mensagem em um pedido de oração
   */
  router.post('/:id/messages', async (req, res) => {
    try {
      const { conteudo } = req.body;
      if (!conteudo) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }
      await createMessage({
        pedidoOracaoId: parseInt(req.params.id),
        usuarioId: req.user.id,
        conteudo
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Prayers] Erro ao enviar mensagem:', error);
      res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
  });

  return router;
}
