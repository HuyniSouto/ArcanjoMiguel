import express from 'express';
import { getActiveAnnouncements, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerAnnouncementRoutes() {
  const router = express.Router();

  /**
   * GET /api/announcements
   * Listar anúncios ativos
   */
  router.get('/', async (req, res) => {
    try {
      const announcements = await getActiveAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error('[Announcements] Erro ao listar anúncios:', error);
      res.status(500).json({ error: 'Erro ao listar anúncios' });
    }
  });

  /**
   * GET /api/announcements/all
   * Listar todos os anúncios (admin)
   */
  router.get('/all', adminMiddleware, async (req, res) => {
    try {
      const announcements = await getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error('[Announcements] Erro ao listar todos os anúncios:', error);
      res.status(500).json({ error: 'Erro ao listar anúncios' });
    }
  });

  /**
   * POST /api/announcements
   * Criar novo anúncio (admin)
   */
  router.post('/', adminMiddleware, async (req, res) => {
    try {
      const { titulo, conteudo, tipo, prioridade, banner } = req.body;
      if (!titulo || !conteudo) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
      }
      await createAnnouncement({
        titulo,
        conteudo,
        tipo,
        prioridade,
        banner,
        criadoPor: req.user.id
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Announcements] Erro ao criar anúncio:', error);
      res.status(500).json({ error: 'Erro ao criar anúncio' });
    }
  });

  /**
   * PUT /api/announcements/:id
   * Atualizar anúncio (admin)
   */
  router.put('/:id', adminMiddleware, async (req, res) => {
    try {
      const { titulo, conteudo, tipo, prioridade, banner, ativo } = req.body;
      await updateAnnouncement(parseInt(req.params.id), {
        titulo,
        conteudo,
        tipo,
        prioridade,
        banner,
        ativo
      });
      res.json({ success: true });
    } catch (error) {
      console.error('[Announcements] Erro ao atualizar anúncio:', error);
      res.status(500).json({ error: 'Erro ao atualizar anúncio' });
    }
  });

  /**
   * DELETE /api/announcements/:id
   * Excluir anúncio (admin)
   */
  router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
      await deleteAnnouncement(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('[Announcements] Erro ao excluir anúncio:', error);
      res.status(500).json({ error: 'Erro ao excluir anúncio' });
    }
  });

  return router;
}
