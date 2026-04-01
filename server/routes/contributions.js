import express from 'express';
import { createContribution, getContributionsByUser, getAllContributions } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerContributionRoutes() {
  const router = express.Router();

  /**
   * GET /api/contributions
   * Listar contribuições do usuário autenticado
   */
  router.get('/', async (req, res) => {
    try {
      const contributions = await getContributionsByUser(req.user.id);
      res.json(contributions);
    } catch (error) {
      console.error('[Contributions] Erro ao listar contribuições:', error);
      res.status(500).json({ error: 'Erro ao listar contribuições' });
    }
  });

  /**
   * POST /api/contributions
   * Criar nova contribuição (Dízimo, Oferta, Voto)
   */
  router.post('/', async (req, res) => {
    try {
      const { campanhaId, tipo, valor, metodoPagamento, mensagem } = req.body;
      if (!tipo || !valor || !metodoPagamento) {
        return res.status(400).json({ error: 'Tipo, valor e método de pagamento são obrigatórios' });
      }
      await createContribution({
        usuarioId: req.user.id,
        campanhaId: campanhaId || null,
        tipo,
        valor: parseFloat(valor),
        metodoPagamento,
        mensagem
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Contributions] Erro ao criar contribuição:', error);
      res.status(500).json({ error: 'Erro ao processar contribuição' });
    }
  });

  /**
   * GET /api/contributions/all
   * Listar todas as contribuições (apenas admin)
   */
  router.get('/all', adminMiddleware, async (req, res) => {
    try {
      const contributions = await getAllContributions();
      res.json(contributions);
    } catch (error) {
      console.error('[Contributions] Erro ao listar todas as contribuições:', error);
      res.status(500).json({ error: 'Erro ao listar contribuições' });
    }
  });

  return router;
}
