import express from 'express';
import { generateToken, verifyToken } from '../auth.js';
import { getUserByOpenId, getUserByEmail, createUser, upsertUser } from '../db.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Fazer login com email e senha
 */
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário por email
    let user = await getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verificar senha
    if (user.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Atualizar último login
    await upsertUser({
      openId: user.openId,
      lastSignedIn: new Date(),
    });

    // Recarregar usuário para garantir dados atualizados
    user = await getUserByEmail(email);

    // Gerar token
    const token = await generateToken({
      id: user.id,
      openId: user.openId,
      name: user.nome,
      email: user.email,
      role: user.funcao,
    });

    res.json({
      token,
      user: {
        id: user.id,
        openId: user.openId,
        name: user.nome,
        email: user.email,
        role: user.funcao,
      },
    });
  } catch (error) {
    console.error('[Auth] Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

/**
 * POST /api/auth/register
 * Registrar novo usuário comum
 */
router.post('/register', async (req, res) => {
  try {
    const { nome, email, telefone, endereco, senha, confirmaSenha } = req.body;

    if (!nome || !email || !senha || !confirmaSenha) {
      return res.status(400).json({ error: 'Nome, email, senha e confirmação são obrigatórios' });
    }

    if (senha !== confirmaSenha) {
      return res.status(400).json({ error: 'Senhas não conferem' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Verificar se email já existe
    const usuarioExistente = await getUserByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Gerar openId único
    const openId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Criar novo usuário
    await createUser({
      openId,
      nome,
      email,
      telefone: telefone || null,
      endereco: endereco || null,
      senha,
      funcao: 'usuario',
      tipoUsuario: 'membro'
    });

    // Buscar usuário criado
    const user = await getUserByEmail(email);

    // Gerar token
    const token = await generateToken({
      id: user.id,
      openId: user.openId,
      name: user.nome,
      email: user.email,
      role: user.funcao,
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        openId: user.openId,
        name: user.nome,
        email: user.email,
        role: user.funcao,
      },
    });
  } catch (error) {
    console.error('[Auth] Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

/**
 * POST /api/auth/logout
 * Fazer logout (apenas limpa no cliente)
 */
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

/**
 * GET /api/auth/verify
 * Verificar se token é válido
 */
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, user: payload });
  } catch (error) {
    console.error('[Auth] Erro ao verificar token:', error);
    res.status(401).json({ valid: false });
  }
});

export function registerAuthRoutes(app) {
  app.use('/api/auth', router);
}
