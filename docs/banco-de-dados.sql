-- ================================================================
--  QUERO PEÇAS — Script MySQL
--  Criação completa do banco de dados
-- ================================================================

CREATE DATABASE IF NOT EXISTS quero_pecas_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE quero_pecas_db;

create table endereco
(
    id_endereco bigint auto_increment
        primary key,
    bairro      varchar(255) null,
    cep         varchar(255) null,
    cidade      varchar(255) null,
    estado      varchar(255) null,
    logradouro  varchar(255) null,
    numero      int          not null
);

create table entrega
(
    id_entrega          bigint auto_increment
        primary key,
    prazo               varchar(255) null,
    status              varchar(255) null,
    destino_endereco_id bigint       null,
    constraint UKh0k79gl1elqe1s8e2il1h2jca
        unique (destino_endereco_id),
    constraint FKhic6q1fq9m0kqcbi1g298j8b1
        foreign key (destino_endereco_id) references endereco (id_endereco)
);

create table fabricante
(
    id_fabricante bigint auto_increment
        primary key,
    cnpj          varchar(255) null,
    nome          varchar(255) null
);

create table peca
(
    id_peca       bigint auto_increment
        primary key,
    descricao     varchar(255) null,
    estoque       int          not null,
    marca         varchar(255) null,
    nome          varchar(255) null,
    preco_base    float        not null,
    fabricante_id bigint       null,
    constraint UKsho0wwgfyug2bti3tk9ktfxfp
        unique (fabricante_id),
    constraint FK4ywpnxk0apagm5bnh2h94uda2
        foreign key (fabricante_id) references fabricante (id_fabricante)
);

create table usuario
(
    id_usuario          bigint auto_increment
        primary key,
    ativo               tinyint default 0                 null,
    cnpj                varchar(255)                      null,
    email               varchar(255)                      null,
    nome_fantasia       varchar(255)                      null,
    razao_social        varchar(255)                      null,
    representante_legal varchar(255)                      null,
    senha               varchar(255)                      null,
    tipo_usuario        enum ('DISTRIBUIDOR', 'MECANICO') null,
    endereco_id         bigint                            null,
    constraint UKi068p2cyc5fi4d8j8ago5s6y5
        unique (cnpj),
    constraint UKt7mwqqaisjlrg6yoj4dtwh0vd
        unique (endereco_id),
    constraint FK8fl5dxscva53gw12f19q6qxf8
        foreign key (endereco_id) references endereco (id_endereco)
);

create table pedido
(
    id_pedido     bigint auto_increment
        primary key,
    data          datetime(6)  null,
    numero_pedido varchar(255) null,
    status        varchar(255) null,
    valor_frete   float        not null,
    valor_total   float        not null,
    entrega_id    bigint       null,
    usuario_id    bigint       null,
    constraint UKfmcm2nikue28ay7mcvvlaw03c
        unique (entrega_id),
    constraint FK6uxomgomm93vg965o8brugt00
        foreign key (usuario_id) references usuario (id_usuario),
    constraint FKevm8nwtd6mwuj3jy0oc4brbil
        foreign key (entrega_id) references entrega (id_entrega)
);

create table pagamento
(
    id_pagamento     bigint auto_increment
        primary key,
    data_pagamento   datetime(6)                                                                     null,
    status_pagamento enum ('AGUARDANDO_PAGAMENTO', 'CANCELADO', 'EM_TRANSPORTE', 'ENTREGUE', 'PAGO') null,
    tipo_pagamento   varchar(255)                                                                    null,
    pedido_id        bigint                                                                          null,
    constraint UKsc46s3wc046ujpdoumidm4cr7
        unique (pedido_id),
    constraint FKthad9tkw4188hb3qo1lm5ueb0
        foreign key (pedido_id) references pedido (id_pedido)
);

create table peca_pedido
(
    id_peca_pedido bigint auto_increment
        primary key,
    preco_venda    float  not null,
    quantidade     int    not null,
    peca_id        bigint null,
    pedido_id      bigint null,
    constraint FK5vearayu4e7rgurvdnl7lvh5l
        foreign key (peca_id) references peca (id_peca),
    constraint FKbg91l87fooub8l4yeepjt9hbp
        foreign key (pedido_id) references pedido (id_pedido)
);

create table telefone
(
    id_telefone bigint auto_increment
        primary key,
    telefone    varchar(255) null,
    tipo        varchar(255) null,
    usuario_id  bigint       null,
    constraint FK92q33nmw94rylnpis5mgcy3v
        foreign key (usuario_id) references usuario (id_usuario)
);

create table veiculo
(
    id_veiculo     bigint auto_increment
        primary key,
    ano_fabricacao year         null,
    chassi         varchar(255) null,
    marca          varchar(255) null,
    modelo         varchar(255) null,
    placa          varchar(255) null
);

create table peca_veiculo
(
    peca_veiculo bigint auto_increment
        primary key,
    peca_id      bigint null,
    veiculo_id   bigint null,
    constraint FK1uorvnhq8m16m21gcfydrlv9v
        foreign key (veiculo_id) references veiculo (id_veiculo),
    constraint FKlam70n8pjurhhwstf52303q49
        foreign key (peca_id) references peca (id_peca)
);

