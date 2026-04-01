import express from 'express';
import { getAllUsers, getUserById, updateUserRole, getFinancialStats } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerUserRoutes() {
  const router = express.Router();

  /**
   * GET /api/users
   * Listar todos os usuários (apenas admin)
   */
  router.get('/', adminMiddleware, async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('[Users] Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  });

  /**
   * GET /api/users/stats
   * Obter estatísticas financeiras (apenas admin)
   */
  router.get('/stats', adminMiddleware, async (req, res) => {
    try {
      const stats = await getFinancialStats();
      res.json(stats);
    } catch (error) {
      console.error('[Users] Erro ao obter estatísticas:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  /**
   * GET /api/users/me
   * Obter dados do usuário autenticado
   */
  router.get('/me', (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error('[Users] Erro ao obter usuário atual:', error);
      res.status(500).json({ error: 'Erro ao obter usuário' });
    }
  });

  /**
   * GET /api/users/:id
   * Obter usuário por ID
   */
  router.get('/:id', adminMiddleware, async (req, res) => {
    try {
      const user = await getUserById(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(user);
    } catch (error) {
      console.error('[Users] Erro ao obter usuário:', error);
      res.status(500).json({ error: 'Erro ao obter usuário' });
    }
  });

  /**
   * PUT /api/users/:id/role
   * Atualizar função do usuário (admin)
   */
  router.put('/:id/role', adminMiddleware, async (req, res) => {
    try {
      const { role } = req.body;
      if (!['usuario', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Função inválida' });
      }
      await updateUserRole(parseInt(req.params.id), role);
      res.json({ success: true });
    } catch (error) {
      console.error('[Users] Erro ao atualizar função:', error);
      res.status(500).json({ error: 'Erro ao atualizar função' });
    }
  });

  return router;
}
