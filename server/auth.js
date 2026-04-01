import 'dotenv/config';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_123456');
const ALGORITHM = 'HS256';

/**
 * Gerar JWT token
 */
export async function generateToken(payload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: ALGORITHM })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);
    return token;
  } catch (error) {
    console.error('[Auth] Erro ao gerar token:', error);
    throw error;
  }
}

/**
 * Verificar JWT token
 */
export async function verifyToken(token) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    console.error('[Auth] Erro ao verificar token:', error.message);
    return null;
  }
}

/**
 * Middleware para verificar autenticação
 */
export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error('[Auth] Erro no middleware:', error);
    res.status(500).json({ error: 'Erro ao verificar autenticação' });
  }
}

/**
 * Middleware para verificar se é admin
 */
export async function adminMiddleware(req, res, next) {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado: privilégios de admin necessários' });
    }
    next();
  } catch (error) {
    console.error('[Auth] Erro no middleware admin:', error);
    res.status(500).json({ error: 'Erro ao verificar permissões' });
  }
}
