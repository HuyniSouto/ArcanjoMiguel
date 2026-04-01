import express from 'express';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerEventRoutes() {
  const router = express.Router();

  /**
   * GET /api/events
   * Listar eventos ativos
   */
  router.get('/', async (req, res) => {
    try {
      const events = await getAllEvents(true);
      res.json(events);
    } catch (error) {
      console.error('[Events] Erro ao listar eventos:', error);
      res.status(500).json({ error: 'Erro ao listar eventos' });
    }
  });

  /**
   * GET /api/events/all
   * Listar todos os eventos (admin)
   */
  router.get('/all', adminMiddleware, async (req, res) => {
    try {
      const events = await getAllEvents(false);
      res.json(events);
    } catch (error) {
      console.error('[Events] Erro ao listar todos os eventos:', error);
      res.status(500).json({ error: 'Erro ao listar eventos' });
    }
  });

  /**
   * POST /api/events
   * Criar novo evento (admin)
   */
  router.post('/', adminMiddleware, async (req, res) => {
    try {
      const { titulo, descricao, dataEvento, local, banner } = req.body;
      if (!titulo || !dataEvento) {
        return res.status(400).json({ error: 'Título e data são obrigatórios' });
      }
      await createEvent({
        titulo,
        descricao,
        dataEvento: new Date(dataEvento),
        local,
        banner,
        criadoPor: req.user.id
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Events] Erro ao criar evento:', error);
      res.status(500).json({ error: 'Erro ao criar evento' });
    }
  });

  /**
   * PUT /api/events/:id
   * Atualizar evento (admin)
   */
  router.put('/:id', adminMiddleware, async (req, res) => {
    try {
      const { titulo, descricao, dataEvento, local, banner, ativo } = req.body;
      await updateEvent(parseInt(req.params.id), {
        titulo,
        descricao,
        dataEvento: dataEvento ? new Date(dataEvento) : undefined,
        local,
        banner,
        ativo
      });
      res.json({ success: true });
    } catch (error) {
      console.error('[Events] Erro ao atualizar evento:', error);
      res.status(500).json({ error: 'Erro ao atualizar evento' });
    }
  });

  /**
   * DELETE /api/events/:id
   * Excluir evento (admin)
   */
  router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
      await deleteEvent(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('[Events] Erro ao excluir evento:', error);
      res.status(500).json({ error: 'Erro ao excluir evento' });
    }
  });

  return router;
}
