import express from 'express';
import { getApprovedTestimonies, getPendingTestimonies, getAllTestimonies, getTestimoniesByUser, createTestimony, updateTestimonyStatus, deleteTestimony } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerTestimonyRoutes() {
  const router = express.Router();

  /**
   * GET /api/testimonies
   * Listar testemunhos aprovados
   */
  router.get('/', async (req, res) => {
    try {
      const testimonies = await getApprovedTestimonies();
      res.json(testimonies);
    } catch (error) {
      console.error('[Testimonies] Erro ao listar testemunhos:', error);
      res.status(500).json({ error: 'Erro ao listar testemunhos' });
    }
  });

  /**
   * POST /api/testimonies
   * Criar novo testemunho (apenas usuários comuns)
   */
  router.post('/', async (req, res) => {
    try {
      if (req.user.role === 'admin') {
        return res.status(403).json({ error: 'Administradores não podem criar testemunhos' });
      }

      const { titulo, conteudo, fotos } = req.body;
      if (!titulo || !conteudo) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
      }
      await createTestimony({
        usuarioId: req.user.id,
        titulo,
        conteudo,
        fotos
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Testimonies] Erro ao criar testemunho:', error);
      res.status(500).json({ error: 'Erro ao criar testemunho' });
    }
  });

  /**
   * GET /api/testimonies/user
   * Listar testemunhos do usuário autenticado
   */
  router.get('/user', async (req, res) => {
    try {
      const testimonies = await getTestimoniesByUser(req.user.id);
      res.json(testimonies);
    } catch (error) {
      console.error('[Testimonies] Erro ao listar testemunhos do usuário:', error);
      res.status(500).json({ error: 'Erro ao listar testemunhos' });
    }
  });

  /**
   * GET /api/testimonies/pending
   * Listar testemunhos pendentes (apenas admin)
   */
  router.get('/pending', adminMiddleware, async (req, res) => {
    try {
      const testimonies = await getPendingTestimonies();
      res.json(testimonies);
    } catch (error) {
      console.error('[Testimonies] Erro ao listar testemunhos pendentes:', error);
      res.status(500).json({ error: 'Erro ao listar testemunhos pendentes' });
    }
  });

  /**
   * GET /api/testimonies/all
   * Listar todos os testemunhos (apenas admin)
   */
  router.get('/all', adminMiddleware, async (req, res) => {
    try {
      const testimonies = await getAllTestimonies();
      res.json(testimonies);
    } catch (error) {
      console.error('[Testimonies] Erro ao listar todos os testemunhos:', error);
      res.status(500).json({ error: 'Erro ao listar testemunhos' });
    }
  });

  /**
   * PUT /api/testimonies/:id/status
   * Aprovar ou rejeitar testemunho (admin)
   */
  router.put('/:id/status', adminMiddleware, async (req, res) => {
    try {
      const { status } = req.body;
      if (!['aprovado', 'rejeitado', 'pendente'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }
      await updateTestimonyStatus(parseInt(req.params.id), status, req.user.id);
      res.json({ success: true });
    } catch (error) {
      console.error('[Testimonies] Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  });

  /**
   * DELETE /api/testimonies/:id
   * Deletar testemunho (admin)
   */
  router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
      await deleteTestimony(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('[Testimonies] Erro ao deletar testemunho:', error);
      res.status(500).json({ error: 'Erro ao deletar testemunho' });
    }
  });

  return router;
}
