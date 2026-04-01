-- ============================================
-- CRIAR BANCO DE DADOS
-- ============================================
CREATE DATABASE IF NOT EXISTS arcanjo_miguel;
USE arcanjo_miguel;

-- ============================================
-- TABELA: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  nome TEXT,
  email VARCHAR(320),
  telefone VARCHAR(20),
  endereco TEXT,
  dataNascimento TIMESTAMP NULL,
  metodoLogin VARCHAR(64),
  senha VARCHAR(255),
  funcao ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario',
  tipoUsuario ENUM('membro', 'visitante', 'cooperador') DEFAULT 'membro',
  fotoPerfil TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ultimoAcesso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deletadoEm TIMESTAMP NULL,
  INDEX idx_openId (openId),
  INDEX idx_funcao (funcao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: campanhas
-- ============================================
CREATE TABLE IF NOT EXISTS campanhas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo ENUM('dizimo', 'oferta', 'votacao', 'especial') NOT NULL,
  valorAlvo DECIMAL(10, 2),
  valorAtual DECIMAL(10, 2) DEFAULT 0,
  dataInicio TIMESTAMP NOT NULL,
  dataFim TIMESTAMP NULL,
  ativa BOOLEAN DEFAULT TRUE,
  banner TEXT,
  criadoPor INT NOT NULL,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (criadoPor) REFERENCES usuarios(id),
  INDEX idx_tipo (tipo),
  INDEX idx_ativa (ativa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: contribuicoes
-- ============================================
CREATE TABLE IF NOT EXISTS contribuicoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  campanhaId INT,
  tipo ENUM('dizimo', 'oferta', 'votacao', 'campanha') NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  metodoPagamento ENUM('pix', 'cartao', 'dinheiro', 'transferencia') NOT NULL,
  comproantePagamento TEXT,
  status ENUM('pendente', 'confirmado', 'rejeitado') DEFAULT 'pendente',
  mensagem TEXT,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
  FOREIGN KEY (campanhaId) REFERENCES campanhas(id),
  INDEX idx_usuarioId (usuarioId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: pedidosOracao
-- ============================================
CREATE TABLE IF NOT EXISTS pedidosOracao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  fotos JSON,
  status ENUM('aberto', 'fechado') DEFAULT 'aberto',
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletadoEm TIMESTAMP NULL,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
  INDEX idx_usuarioId (usuarioId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: mensagens
-- ============================================
CREATE TABLE IF NOT EXISTS mensagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedidoOracaoId INT,
  usuarioId INT NOT NULL,
  conteudo TEXT NOT NULL,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedidoOracaoId) REFERENCES pedidosOracao(id),
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
  INDEX idx_pedidoOracaoId (pedidoOracaoId),
  INDEX idx_usuarioId (usuarioId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: testemunhos
-- ============================================
CREATE TABLE IF NOT EXISTS testemunhos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  fotos JSON,
  status ENUM('pendente', 'aprovado', 'rejeitado') DEFAULT 'pendente',
  aprovadoPor INT,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletadoEm TIMESTAMP NULL,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
  FOREIGN KEY (aprovadoPor) REFERENCES usuarios(id),
  INDEX idx_usuarioId (usuarioId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: agendamentosVisitas
-- ============================================
CREATE TABLE IF NOT EXISTS agendamentosVisitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  dataRequisitada TIMESTAMP NOT NULL,
  horaRequisitada VARCHAR(5),
  motivo TEXT,
  status ENUM('pendente', 'aprovado', 'rejeitado', 'concluido') DEFAULT 'pendente',
  aprovadoPor INT,
  cooperadorId INT,
  notas TEXT,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletadoEm TIMESTAMP NULL,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
  FOREIGN KEY (aprovadoPor) REFERENCES usuarios(id),
  FOREIGN KEY (cooperadorId) REFERENCES usuarios(id),
  INDEX idx_usuarioId (usuarioId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: produtosLoja
-- ============================================
CREATE TABLE IF NOT EXISTS produtosLoja (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  quantidade INT DEFAULT 0,
  imagem TEXT,
  criadoPor INT NOT NULL,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (criadoPor) REFERENCES usuarios(id),
  INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: comprasLoja
-- ============================================
CREATE TABLE IF NOT EXISTS comprasLoja (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  produtoId INT NOT NULL,
  quantidade INT NOT NULL,
  precoTotal DECIMAL(10, 2) NOT NULL,
  metodoPagamento ENUM('pix', 'cartao', 'dinheiro') NOT NULL,
  comproantePagamento TEXT,
  status ENUM('pendente', 'confirmado', 'pronto_retirada', 'concluido') DEFAULT 'pendente',
  dataRetirada TIMESTAMP NULL,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
  FOREIGN KEY (produtoId) REFERENCES produtosLoja(id),
  INDEX idx_usuarioId (usuarioId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: despesas
-- ============================================
CREATE TABLE IF NOT EXISTS despesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria ENUM('aluguel', 'agua', 'eletricidade', 'manutencao', 'suprimentos', 'outro') NOT NULL,
  descricao VARCHAR(255),
  valor DECIMAL(10, 2) NOT NULL,
  data TIMESTAMP NOT NULL,
  criadoPor INT NOT NULL,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (criadoPor) REFERENCES usuarios(id),
  INDEX idx_categoria (categoria),
  INDEX idx_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: anuncios
-- ============================================
CREATE TABLE IF NOT EXISTS anuncios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  tipo ENUM('aviso', 'apelo_doacao', 'evento', 'outro') NOT NULL,
  prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
  banner TEXT,
  criadoPor INT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (criadoPor) REFERENCES usuarios(id),
  INDEX idx_ativo (ativo),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: versiculosDiarios
-- ============================================
CREATE TABLE IF NOT EXISTS versiculosDiarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data TIMESTAMP NOT NULL UNIQUE,
  livro VARCHAR(50) NOT NULL,
  capitulo INT NOT NULL,
  versiculo INT NOT NULL,
  texto TEXT NOT NULL,
  traducao VARCHAR(50) DEFAULT 'ACF',
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: eventos
-- ============================================
CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  dataEvento TIMESTAMP NOT NULL,
  local VARCHAR(255),
  banner TEXT,
  criadoPor INT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (criadoPor) REFERENCES usuarios(id),
  INDEX idx_ativo (ativo),
  INDEX idx_dataEvento (dataEvento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DADOS INICIAIS (OPCIONAL)
-- ============================================
-- Inserir um usuário admin padrão (senha: admin123 - hash bcrypt)
-- Para gerar o hash, use: bcrypt.hashSync('admin123', 10)
-- Hash gerado: $2a$10$YourHashHere (substitua com hash real em produção)
INSERT IGNORE INTO usuarios (openId, nome, email, funcao, senha, ativo) 
VALUES ('admin_001', 'Administrador', 'admin@arcanjo.local', 'admin', 'admin', 1);
