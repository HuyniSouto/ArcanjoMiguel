import express from 'express';
import { getAllCampaigns, getCampaignById, createCampaign, updateCampaign, deleteCampaign } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerCampaignRoutes() {
  const router = express.Router();

  /**
   * GET /api/campaigns
   * Listar todas as campanhas ativas
   */
  router.get('/', async (req, res) => {
    try {
      const campaigns = await getAllCampaigns(true);
      res.json(campaigns);
    } catch (error) {
      console.error('[Campaigns] Erro ao listar campanhas:', error);
      res.status(500).json({ error: 'Erro ao listar campanhas' });
    }
  });

  /**
   * GET /api/campaigns/all
   * Listar todas as campanhas (admin)
   */
  router.get('/all', adminMiddleware, async (req, res) => {
    try {
      const campaigns = await getAllCampaigns(false);
      res.json(campaigns);
    } catch (error) {
      console.error('[Campaigns] Erro ao listar todas as campanhas:', error);
      res.status(500).json({ error: 'Erro ao listar campanhas' });
    }
  });

  /**
   * POST /api/campaigns
   * Criar nova campanha (admin)
   */
  router.post('/', adminMiddleware, async (req, res) => {
    try {
      const { nome, descricao, tipo, valorAlvo, dataFim, banner } = req.body;
      if (!nome || !tipo) {
        return res.status(400).json({ error: 'Nome e tipo são obrigatórios' });
      }
      await createCampaign({
        nome,
        descricao,
        tipo,
        valorAlvo: valorAlvo ? parseFloat(valorAlvo) : null,
        dataFim: dataFim ? new Date(dataFim) : null,
        banner,
        criadoPor: req.user.id
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Campaigns] Erro ao criar campanha:', error);
      res.status(500).json({ error: 'Erro ao criar campanha' });
    }
  });

  /**
   * PUT /api/campaigns/:id
   * Atualizar campanha (admin)
   */
  router.put('/:id', adminMiddleware, async (req, res) => {
    try {
      const { nome, descricao, tipo, valorAlvo, dataFim, banner, ativa } = req.body;
      await updateCampaign(parseInt(req.params.id), {
        nome,
        descricao,
        tipo,
        valorAlvo: valorAlvo ? parseFloat(valorAlvo) : null,
        dataFim: dataFim ? new Date(dataFim) : null,
        banner,
        ativa
      });
      res.json({ success: true });
    } catch (error) {
      console.error('[Campaigns] Erro ao atualizar campanha:', error);
      res.status(500).json({ error: 'Erro ao atualizar campanha' });
    }
  });

  /**
   * DELETE /api/campaigns/:id
   * Excluir campanha (admin)
   */
  router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
      await deleteCampaign(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('[Campaigns] Erro ao excluir campanha:', error);
      res.status(500).json({ error: 'Erro ao excluir campanha' });
    }
  });

  /**
   * GET /api/campaigns/:id
   * Obter campanha por ID
   */
  router.get('/:id', async (req, res) => {
    try {
      const campaign = await getCampaignById(parseInt(req.params.id));
      if (!campaign) {
        return res.status(404).json({ error: 'Campanha não encontrada' });
      }
      res.json(campaign);
    } catch (error) {
      console.error('[Campaigns] Erro ao obter campanha:', error);
      res.status(500).json({ error: 'Erro ao obter campanha' });
    }
  });

  return router;
}
