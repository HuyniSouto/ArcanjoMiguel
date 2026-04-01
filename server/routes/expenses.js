import express from 'express';
import { getAllExpenses, createExpense } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerExpenseRoutes() {
  const router = express.Router();

  /**
   * GET /api/expenses
   * Listar todas as despesas (apenas admin)
   */
  router.get('/', adminMiddleware, async (req, res) => {
    try {
      const expenses = await getAllExpenses();
      res.json(expenses);
    } catch (error) {
      console.error('[Expenses] Erro ao listar despesas:', error);
      res.status(500).json({ error: 'Erro ao listar despesas' });
    }
  });

  /**
   * POST /api/expenses
   * Criar nova despesa (admin)
   */
  router.post('/', adminMiddleware, async (req, res) => {
    try {
      const { categoria, descricao, valor, data } = req.body;
      if (!categoria || !valor) {
        return res.status(400).json({ error: 'Categoria e valor são obrigatórios' });
      }
      await createExpense({
        categoria,
        descricao,
        valor,
        data: data ? new Date(data) : new Date(),
        criadoPor: req.user.id
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Expenses] Erro ao criar despesa:', error);
      res.status(500).json({ error: 'Erro ao criar despesa' });
    }
  });

  return router;
}
