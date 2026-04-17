-- ================================================================
--  QUERO PEÇAS — Script MySQL
--  Criação completa do banco de dados
-- ================================================================

CREATE DATABASE IF NOT EXISTS quero_pecas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE quero_pecas;

-- ----------------------------------------------------------------
--  CLIENTES
-- ----------------------------------------------------------------
CREATE TABLE clientes (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  cnpj            VARCHAR(18)     NOT NULL,
  razao_social    VARCHAR(150)    NOT NULL,
  nome_fantasia   VARCHAR(100)    NOT NULL,
  especialidade   VARCHAR(200)        NULL,
  responsavel     VARCHAR(100)    NOT NULL,
  telefone        VARCHAR(20)     NOT NULL,
  email           VARCHAR(100)    NOT NULL,
  senha_hash      VARCHAR(255)    NOT NULL,
  limite_credito  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_clientes_cnpj  (cnpj),
  UNIQUE KEY uq_clientes_email (email)
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  ENDEREÇOS
-- ----------------------------------------------------------------
CREATE TABLE enderecos (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  cliente_id  INT UNSIGNED  NOT NULL,
  cep         VARCHAR(9)    NOT NULL,
  logradouro  VARCHAR(150)  NOT NULL,
  numero      VARCHAR(10)   NOT NULL,
  bairro      VARCHAR(80)   NOT NULL,
  cidade      VARCHAR(80)   NOT NULL,
  estado      CHAR(2)       NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_enderecos_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  VEÍCULOS  (base de aplicação para busca por placa)
-- ----------------------------------------------------------------
CREATE TABLE veiculos (
  id        INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  placa     VARCHAR(8)    NOT NULL,
  marca     VARCHAR(50)   NOT NULL,
  modelo    VARCHAR(80)   NOT NULL,
  ano_fab   SMALLINT      NOT NULL,
  ano_mod   SMALLINT      NOT NULL,
  motor     VARCHAR(50)       NULL,
  cambio    VARCHAR(50)       NULL,
  chassis   VARCHAR(30)       NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_veiculos_placa (placa)
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  PEÇAS
-- ----------------------------------------------------------------
CREATE TABLE pecas (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  referencia  VARCHAR(50)     NOT NULL,
  marca       VARCHAR(60)     NOT NULL,
  nome        VARCHAR(150)    NOT NULL,
  categoria   VARCHAR(80)     NOT NULL,
  tipo        ENUM('Original','Premium','Econômico') NOT NULL DEFAULT 'Original',
  preco       DECIMAL(10,2)   NOT NULL,
  estoque     INT             NOT NULL DEFAULT 0,
  unidade     VARCHAR(20)     NOT NULL DEFAULT 'un',
  PRIMARY KEY (id),
  UNIQUE KEY uq_pecas_referencia (referencia)
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  COMPATIBILIDADE PEÇA × VEÍCULO  (N:N)
-- ----------------------------------------------------------------
CREATE TABLE peca_veiculo (
  peca_id     INT UNSIGNED  NOT NULL,
  veiculo_id  INT UNSIGNED  NOT NULL,
  PRIMARY KEY (peca_id, veiculo_id),
  CONSTRAINT fk_pv_peca
    FOREIGN KEY (peca_id)    REFERENCES pecas    (id) ON DELETE CASCADE,
  CONSTRAINT fk_pv_veiculo
    FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  PEDIDOS
-- ----------------------------------------------------------------
CREATE TABLE pedidos (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  numero        VARCHAR(20)   NOT NULL,
  cliente_id    INT UNSIGNED  NOT NULL,
  total         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status        ENUM(
    'aguardando',
    'nota_emitida',
    'aguardando_rota',
    'em_rota',
    'entregue'
  ) NOT NULL DEFAULT 'aguardando',
  criado_em     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pedidos_numero (numero),
  CONSTRAINT fk_pedidos_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  ITENS DO PEDIDO
-- ----------------------------------------------------------------
CREATE TABLE itens_pedido (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  pedido_id       INT UNSIGNED    NOT NULL,
  peca_id         INT UNSIGNED    NOT NULL,
  quantidade      INT             NOT NULL DEFAULT 1,
  preco_unitario  DECIMAL(10,2)   NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_itens_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
  CONSTRAINT fk_itens_peca
    FOREIGN KEY (peca_id)   REFERENCES pecas   (id)
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  BOLETOS
-- ----------------------------------------------------------------
CREATE TABLE boletos (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  numero      VARCHAR(20)   NOT NULL,
  pedido_id   INT UNSIGNED  NOT NULL,
  cliente_id  INT UNSIGNED  NOT NULL,
  valor       DECIMAL(10,2) NOT NULL,
  vencimento  DATE          NOT NULL,
  status      ENUM('pendente','pago','vencido') NOT NULL DEFAULT 'pendente',
  pago_em     DATETIME          NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_boletos_numero (numero),
  CONSTRAINT fk_boletos_pedido
    FOREIGN KEY (pedido_id)  REFERENCES pedidos  (id),
  CONSTRAINT fk_boletos_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  DEVOLUÇÕES
-- ----------------------------------------------------------------
CREATE TABLE devolucoes (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  protocolo   VARCHAR(20)   NOT NULL,
  pedido_id   INT UNSIGNED  NOT NULL,
  cliente_id  INT UNSIGNED  NOT NULL,
  motivo      VARCHAR(100)  NOT NULL,
  descricao   TEXT              NULL,
  status      ENUM('em_andamento','aprovada','negada') NOT NULL DEFAULT 'em_andamento',
  criado_em   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_devolucoes_protocolo (protocolo),
  CONSTRAINT fk_dev_pedido
    FOREIGN KEY (pedido_id)  REFERENCES pedidos  (id),
  CONSTRAINT fk_dev_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  GARANTIAS
-- ----------------------------------------------------------------
CREATE TABLE garantias (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  protocolo   VARCHAR(20)   NOT NULL,
  pedido_id   INT UNSIGNED  NOT NULL,
  peca_id     INT UNSIGNED  NOT NULL,
  cliente_id  INT UNSIGNED  NOT NULL,
  defeito     VARCHAR(150)  NOT NULL,
  descricao   TEXT              NULL,
  status      ENUM('em_analise','aprovada','negada') NOT NULL DEFAULT 'em_analise',
  criado_em   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_garantias_protocolo (protocolo),
  CONSTRAINT fk_gar_pedido
    FOREIGN KEY (pedido_id)  REFERENCES pedidos  (id),
  CONSTRAINT fk_gar_peca
    FOREIGN KEY (peca_id)    REFERENCES pecas    (id),
  CONSTRAINT fk_gar_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
) ENGINE=InnoDB;


-- ----------------------------------------------------------------
--  CRÉDITOS
-- ----------------------------------------------------------------
CREATE TABLE creditos (
  id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  protocolo           VARCHAR(20)     NOT NULL,
  cliente_id          INT UNSIGNED    NOT NULL,
  limite_solicitado   DECIMAL(10,2)   NOT NULL,
  limite_aprovado     DECIMAL(10,2)       NULL,
  finalidade          VARCHAR(150)    NOT NULL,
  status              ENUM('em_analise','aprovada','negada') NOT NULL DEFAULT 'em_analise',
  resposta            TEXT                NULL,
  criado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_creditos_protocolo (protocolo),
  CONSTRAINT fk_cre_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
) ENGINE=InnoDB;


-- ================================================================
--  FIM DO SCRIPT
-- ================================================================
