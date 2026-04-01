import express from 'express';
import { getVisitSchedulesByUser, getAllVisitSchedules, getPendingVisitSchedules, createVisitSchedule, updateVisitStatus, deleteVisitSchedule, getVisitScheduleById, createEvent } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerVisitRoutes() {
  const router = express.Router();

  /**
   * GET /api/visits
   * Listar agendamentos do usuário
   */
  router.get('/', async (req, res) => {
    try {
      const visits = await getVisitSchedulesByUser(req.user.id);
      res.json(visits);
    } catch (error) {
      console.error('[Visits] Erro ao listar agendamentos:', error);
      res.status(500).json({ error: 'Erro ao listar agendamentos' });
    }
  });

  /**
   * POST /api/visits
   * Solicitar nova visita (apenas usuários comuns)
   */
  router.post('/', async (req, res) => {
    try {
      if (req.user.role === 'admin') {
        return res.status(403).json({ error: 'Administradores não podem solicitar visitas' });
      }

      const { dataRequisitada, horaRequisitada, motivo } = req.body;
      if (!dataRequisitada || !horaRequisitada || !motivo) {
        return res.status(400).json({ error: 'Data, hora e motivo são obrigatórios' });
      }
      await createVisitSchedule({
        usuarioId: req.user.id,
        dataRequisitada: new Date(dataRequisitada),
        horaRequisitada,
        motivo
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Visits] Erro ao solicitar visita:', error);
      res.status(500).json({ error: 'Erro ao solicitar visita' });
    }
  });

  /**
   * GET /api/visits/pending
   * Listar visitas pendentes (apenas admin)
   */
  router.get('/pending', adminMiddleware, async (req, res) => {
    try {
      const visits = await getPendingVisitSchedules();
      res.json(visits);
    } catch (error) {
      console.error('[Visits] Erro ao listar visitas pendentes:', error);
      res.status(500).json({ error: 'Erro ao listar visitas pendentes' });
    }
  });

  /**
   * GET /api/visits/all
   * Listar todos os agendamentos (apenas admin)
   */
  router.get('/all', adminMiddleware, async (req, res) => {
    try {
      const visits = await getAllVisitSchedules();
      res.json(visits);
    } catch (error) {
      console.error('[Visits] Erro ao listar todos os agendamentos:', error);
      res.status(500).json({ error: 'Erro ao listar agendamentos' });
    }
  });

  /**
   * PUT /api/visits/:id/status
   * Atualizar status da visita (admin)
   * Se status for 'aprovado', cria um evento correspondente
   */
  router.put('/:id/status', adminMiddleware, async (req, res) => {
    try {
      const { status } = req.body;
      if (!['aprovado', 'rejeitado', 'concluido', 'pendente'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      const visitId = parseInt(req.params.id);
      
      // Se a visita foi aprovada, criar um evento correspondente
      if (status === 'aprovado') {
        const visit = await getVisitScheduleById(visitId);
        if (visit) {
          // Combinar data e hora para criar o dataEvento
          const dataEvento = new Date(`${visit.dataRequisitada.toISOString().split('T')[0]}T${visit.horaRequisitada}:00`);
          
          await createEvent({
            titulo: `Visita Agendada - ${visit.motivo}`,
            descricao: `Visita solicitada por usuário. Motivo: ${visit.motivo}`,
            dataEvento: dataEvento,
            local: 'Igreja',
            ativo: true,
            criadoPor: req.user.id,
            visitaAgendadaId: visitId
          });
        }
      }

      await updateVisitStatus(visitId, status);
      res.json({ success: true });
    } catch (error) {
      console.error('[Visits] Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  });

  /**
   * DELETE /api/visits/:id
   * Deletar agendamento de visita (admin)
   */
  router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
      await deleteVisitSchedule(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('[Visits] Erro ao deletar agendamento:', error);
      res.status(500).json({ error: 'Erro ao deletar agendamento' });
    }
  });

  return router;
}
