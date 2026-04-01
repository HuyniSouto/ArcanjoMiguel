import express from 'express';
import { getAllStoreProducts, getStoreProductById, getPurchasesByUser, getAllStorePurchases, createStoreProduct, updateStoreProduct, deleteStoreProduct, createStorePurchase } from '../db.js';
import { adminMiddleware } from '../auth.js';

export function registerStoreRoutes() {
  const router = express.Router();

  /**
   * GET /api/store/products
   * Listar todos os produtos da loja
   */
  router.get('/products', async (req, res) => {
    try {
      const products = await getAllStoreProducts();
      res.json(products);
    } catch (error) {
      console.error('[Store] Erro ao listar produtos:', error);
      res.status(500).json({ error: 'Erro ao listar produtos' });
    }
  });

  /**
   * POST /api/store/products
   * Criar novo produto (admin)
   */
  router.post('/products', adminMiddleware, async (req, res) => {
    try {
      const { nome, descricao, preco, quantidade, imagem } = req.body;
      if (!nome || !preco) {
        return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
      }
      await createStoreProduct({
        nome,
        descricao,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade) || 0,
        imagem,
        criadoPor: req.user.id
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Store] Erro ao criar produto:', error);
      res.status(500).json({ error: 'Erro ao criar produto' });
    }
  });

  /**
   * PUT /api/store/products/:id
   * Atualizar produto (admin)
   */
  router.put('/products/:id', adminMiddleware, async (req, res) => {
    try {
      const { nome, descricao, preco, quantidade, imagem } = req.body;
      await updateStoreProduct(parseInt(req.params.id), {
        nome,
        descricao,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade) || 0,
        imagem
      });
      res.json({ success: true });
    } catch (error) {
      console.error('[Store] Erro ao atualizar produto:', error);
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  });

  /**
   * DELETE /api/store/products/:id
   * Excluir produto (admin)
   */
  router.delete('/products/:id', adminMiddleware, async (req, res) => {
    try {
      await deleteStoreProduct(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('[Store] Erro ao excluir produto:', error);
      res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  });

  /**
   * GET /api/store/products/:id
   * Obter produto por ID
   */
  router.get('/products/:id', async (req, res) => {
    try {
      const product = await getStoreProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json(product);
    } catch (error) {
      console.error('[Store] Erro ao obter produto:', error);
      res.status(500).json({ error: 'Erro ao obter produto' });
    }
  });

  /**
   * POST /api/store/purchases
   * Realizar compra
   */
  router.post('/purchases', async (req, res) => {
    try {
      const { produtoId, quantidade, precoTotal, metodoPagamento } = req.body;
      if (!produtoId || !quantidade || !precoTotal || !metodoPagamento) {
        return res.status(400).json({ error: 'Dados da compra incompletos' });
      }
      await createStorePurchase({
        usuarioId: req.user.id,
        produtoId,
        quantidade,
        precoTotal,
        metodoPagamento
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('[Store] Erro ao realizar compra:', error);
      res.status(500).json({ error: 'Erro ao realizar compra' });
    }
  });

  /**
   * GET /api/store/purchases
   * Listar compras do usuário
   */
  router.get('/purchases', async (req, res) => {
    try {
      const purchases = await getPurchasesByUser(req.user.id);
      res.json(purchases);
    } catch (error) {
      console.error('[Store] Erro ao listar compras:', error);
      res.status(500).json({ error: 'Erro ao listar compras' });
    }
  });

  /**
   * GET /api/store/purchases/all
   * Listar todas as compras (apenas admin)
   */
  router.get('/purchases/all', adminMiddleware, async (req, res) => {
    try {
      const purchases = await getAllStorePurchases();
      res.json(purchases);
    } catch (error) {
      console.error('[Store] Erro ao listar todas as compras:', error);
      res.status(500).json({ error: 'Erro ao listar compras' });
    }
  });

  return router;
}
