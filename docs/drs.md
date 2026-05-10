# Quero-Peças
Documento de Requisitos de Software

# INTRODUÇÃO
Este documento define e consolida os requisitos do sistema Quero Peças - Plataforma B2B Inteligente de Busca e Integração de Peças Automotivas -, servindo de base para as fases de projeto, desenvolvimento, testes e manutenção.

## Definições, acrônimos e abreviações
- B2B (Business-to-Business): modelo de negócio entre empresas, sem envolvimento do consumidor final.
- MVP (Minimum Viable Product): versão do produto com funcionalidades mínimas para validação com usuários reais.
- API (Application Programming Interface): interface de programação para integração entre sistemas.
- NPS (Net Promoter Score): indicador de satisfação e lealdade dos clientes baseado em recomendação.
- RBAC (Role-Based Access Control): controle de acesso baseado em perfil de usuário.
- Distribuidora: empresa atacadista que abastece lojas de autopeças com peças de reposição.
- Placa do veículo: identificador alfanumérico do veículo utilizado para consulta de dados automotivos.

## Metodologia de elicitação
O levantamento de requisitos foi conduzido por meio da metodologia Lean Inception (Paulo Caroli), em sessão de workshop realizada em abril de 2026. As atividades realizadas foram:
- (1) Visão do Produto;
- (2) É/Não É/Faz/Não Faz;
- (3) Objetivos com métricas de sucesso;
- (4) Personas;
- (5) Jornadas de Usuário;
- (6) Brainstorming de Funcionalidades;
- (7) Revisão Técnica/Negócio/UX;
- (8) Sequenciamento de features;
- (9) Canvas MVP;

## Documento de Visão
Lean Inception - Quero Peças v1.0, abril de 2026. Disponível no link: [Lean Inception - QueroPeças](https://miro.com/welcomeonboard/c2h0NWhia2E4R2IwYzNIY0dGRFlyeDdJUFFtZFhmMEdrVXlRTEVTT1pXbmppZGs1MVc2eWlKTnFNNExGeFJkSWtPTE9DQ3VXbXJXenFzcEdDY0FkczlkUGxycnZRcm0zaW84L2tXWWZZNEV6NHg3RlNRQ2huMDVXRldsUGNYWkVzVXVvMm53MW9OWFg5bkJoVXZxdFhRPT0hdjE=?share_link_id=199937401374)

Documento de Visão - Quero Peças v1.0, abril de 2026. Disponível na pasta de projetos: [Documento de Visão](https://docs.google.com/document/u/0/d/1yj296Jq77pvsResUVHLCE_K4leIcSEvw8tLb1KphGXU/edit)

# Visão geral dos requisitos funcionais
| **_ID_**   | **_User Story_**                                   | **_Valor de Negócio_**                                 | **_MoSCoW_** | **_Prioridade_** | **_Story Points_** | **_Dependências_** |
|------------|----------------------------------------------------|--------------------------------------------------------|--------------|------------------|--------------------|--------------------|
| **US-001** | Fazer Login                                        | Acesso seguro ao sistema e proteção de dados           | **MUST**     | Alta             | 3                  | \-                 |
| **US-002** | Registrar Lojistas                                 | Onboarding de novos clientes B2B                       | **MUST**     | Alta             | 5                  | \-                 |
| **US-003** | Aprovar Cadastro                                   | Garantir que apenas lojistas válidos acessem o sistema | **MUST**     | Alta             | 3                  | US-002             |
| **US-004** | Cadastrar Veículo                                  | Facilitar buscas repetidas e histórico de cliente      | **MUST**     | Alta             | 3                  | \-                 |
| **US-005** | Cadastrar Peça                                     | Expandir catálogo de produtos disponíveis              | **MUST**     | Alta             | 5                  | US-004             |
| **US-006** | Buscar Peças por Placa                             | Facilitar busca rápida e precisa de peças              | **MUST**     | Alta             | 5                  | US-004, US-005     |
| **US-007** | Recuperar Senha                                    | Reduzir perda de acessos e suporte técnico             | **MUST**     | Alta             | 3                  | US-002             |
| **US-008** | Buscar Peças por Modelo                            | Ampliar opções de busca por compatibilidade            | **MUST**     | Alta             | 5                  | US-004, US-005     |
| **US-009** | Buscar Peças por Código de Peça                    | Acesso direto e rápido a peças específicas             | **MUST**     | Alta             | 3                  | US-004, US-005     |
| **US-010** | Catálogo de Peças Compatíveis                      | Experiência intuitiva de navegação de produtos         | **SHOULD**   | Média            | 8                  | US-004, US-005     |
| **US-011** | Adicionar ao Carrinho                              | Permitir que lojistas montem pedidos                   | **MUST**     | Alta             | 5                  | US-004, US-005     |
| **US-012** | Orçamento                                          | Aumentar taxa de conversão de pedidos                  | **SHOULD**   | Média            | 5                  | US-011             |
| **US-013** | Consultar Estoque                                  | Garantir disponibilidade e evitar overselling          | **MUST**     | Alta             | 5                  | US-004, US-005     |
| **US-014** | Compra                                             | Gerar receita e capturar vendas B2B                    | **MUST**     | Alta             | 8                  | US-011             |
| **US-015** | Solicitar Devolução                                | Reduzir insatisfação de clientes                       | **SHOULD**   | Média            | 5                  | US-014             |
| **US-016** | Solicitar Garantia                                 | Gerar confiança e lealdade de clientes                 | **SHOULD**   | Média            | 3                  | US-014             |
| **US-017** | Solicitar Crédito                                  | Aumentar volume de vendas a prazo                      | **COULD**    | Baixa            | 8                  | US-014             |
| **US-018** | Envio Automático de Boletos                        | Melhorar experiência de pagamento                      | **SHOULD**   | Média            | 5                  | US-014             |
| **US-019** | Visualizar Histórico de Pedidos                    | Facilitar auditoria e rastreamento de compras          | **COULD**    | Baixa            | 3                  | US-014             |
| **US-020** | Relatório de Pedidos                               | Auxiliar análise de vendas e planejamento              | **COULD**    | Baixa            | 5                  | US-014             |
| **US-021** | Exportar Orçamento para PDF                        | Facilitar compartilhamento de propostas                | **COULD**    | Baixa            | 3                  | US-012             |
| **US-022** | Implementar Autenticação 2FA                       | Proteger contas contra acessos não autorizados         | **SHOULD**   | Média            | 5                  | US-002             |
| **US-023** | Criptografar Senha e Dados sensíveis               | Cumprir requisitos de segurança de dados               | **MUST**     | Alta             | 3                  | \-                 |
| **US-024** | Registrar consentimento LGPD para compartilhamento | Cumprir obrigações legais de privacidade               | **MUST**     | Alta             | 3                  | US-002             |
| **US-025** | Solicitar Exclusão de Dados                        | Dar controle de dados ao usuário (LGPD)                | **MUST**     | Alta             | 5                  | US-002             |
| **US-026** | Logs de Auditoria LGPD                             | Conformidade com LGPD e rastreabilidade                | **MUST**     | Alta             | 8                  | \-                 |
| **US-027** | Exportar dados do lojista                          | Exercer direito de portabilidade de dados (LGPD)       | **MUST**     | Alta             | 5                  | US-002             |
| **US-028** | Acessibilidade Visual                              | Inclusão de usuários com baixa visão                   | **SHOULD**   | Média            | 5                  | \-                 |

# Especificação dos requisitos funcionais
O detalhamento dos requisitos aqui documentados é mantido de forma viva e colaborativa no **quadro de backlog do projeto no GitHub**. Cada História de Usuário (US-001 a US-028) é representada como uma **Issue** individual no repositório, contendo:
- Título conforme especificação deste documento
- Descrição estendida no formato "Como… quero… para…"
- Critérios de aceite no padrão GIVEN-WHEN-THEN
- Labels de prioridade (MUST, SHOULD, COULD) e estimativa de Story Points
- Referências às regras de negócio e requisitos não funcionais vinculados
- Comentários e atualizações decorrentes de revisões e testes de aceitação

**Link para o quadro do projeto no GitHub:** [**Quadro Quero-Pecas**](https://github.com/users/Geannee/projects/2/views/2)

# Lista de regras de negócio

## Cadastro e Acesso

| **ID**                                                   | **Descrição**                                                                                                                                                                                                                                               | **Fonte/autoridade**                                                           | **Impacto**                                                                   |
|----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **RN-001 - Aprovação Obrigatória de Cadastro**           | Todo cadastro de lojista submetido no sistema deve ser revisado e aprovado manualmente por um administrador antes que o acesso às funcionalidades restritas seja liberado. Enquanto o status do cadastro for "Pendente", o usuário não pode realizar login. | Política de Onboarding B2B do Quero-Peças (definida pela área de operações).   | US-002 (Registrar Lojistas), US-003 (Aprovar Cadastro), US-001 (Fazer Login). |
| **RN-002 - Unicidade de CNPJ**                           | O CNPJ informado no formulário de registro deve ser único na base de lojistas ativos. Caso um CNPJ já cadastrado e aprovado seja submetido novamente, o sistema deve recusar o novo registro e exibir a mensagem "CNPJ já possui cadastro ativo".           | Política de Cadastro de Clientes (evitar duplicidade de contas corporativas).  | US-002 (Registrar Lojistas).                                                  |
| **RN-003 - Política de Complexidade de Senha**           | A senha definida pelo usuário no cadastro ou na redefinição deve possuir no mínimo 8 caracteres. Senhas que não atendam a esse critério não podem ser salvas.                                                                                               | Política de Segurança da Informação do Quero-Peças.                            | US-002 (Registrar Lojistas), US-007 (Recuperar Senha).                        |
| **RN-004 - Bloqueio Temporário por Tentativas de Login** | Se um usuário errar a combinação e-mail/senha por e vezes consecutivas em um intervalo de 10 minutos, a conta deve ser bloqueada para novas tentativas de login e deve redefinir senha.                                                                     | Política de Segurança da Informação do Quero-Peças (prevenção de força bruta). | US-001 (Fazer Login).                                                         |
| **RN-005 - Validade do Link de Redefinição de Senha**    | O link enviado para o e-mail do usuário no processo de "Recuperar Senha" deve ter validade de exatamente 1 hora a partir do momento da solicitação. Tentativas de uso de um link expirado devem ser rejeitadas, exigindo nova solicitação pelo usuário.     | Política de Segurança da Informação do Quero-Peças.                            | US-007 (Recuperar Senha).                                                     |
| **RN-006 - Obrigatoriedade de Endereço de Entrega**      | Uma compra somente pode ser finalizada se a loja possuir pelo menos um endereço de entrega cadastrado e válido. O sistema não deve prosseguir para a etapa de pagamento se essa condição não for satisfeita.                                                | Política de Logística e Entregas.                                              | US-014 (Compra), US-029 (Editar Dados Cadastrais).                            |

## Catálogo, Veículos e Peças

| **ID**                                                       | **Descrição**                                                                                                                                                                                                                                                                                                                                        | **Fonte/autoridade**                                                                          | **Impacto**                                                                |
|--------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| **RN-007 - Unicidade de Veículo**                            | Um veículo é identificado unicamente pela combinação dos atributos "Marca", "Modelo" e "Ano". O sistema não pode permitir o cadastro de duas entradas idênticas com essa mesma combinação.                                                                                                                                                           | Padrão interno do Quero-Peças.                                                                | US-004 (Cadastrar Veículo).                                                |
| **RN-008 - Unicidade de Código de Peça**                     | O código de peça (SKU ou código original do fabricante) deve ser único em toda a base de produtos. Não podem coexistir duas peças com o mesmo código.                                                                                                                                                                                                | Padrão interno do Quero-Peças.                                                                | US-005 (Cadastrar Peça).                                                   |
| **RN-009 - Obrigatoriedade de Compatibilidade Veículo-Peça** | Toda peça cadastrada no sistema deve estar associada a no mínimo um veículo. Peças não vinculadas a nenhum veículo não podem ser salvas na base.                                                                                                                                                                                                     | Curadoria de Catálogo de Produtos (garantia de que todas as peças são buscáveis por veículo). | US-005 (Cadastrar Peça), US-006, US-008, US-009, US-010 (todas as buscas). |
| **RN-010 - Identificação de Veículo por Placa**              | A busca por placa deve utilizar a placa como chave de identificação do veículo. Se a placa informada constar na base veicular integrada, o sistema retorna as peças compatíveis com o veículo identificado. Se a placa não for encontrada, o sistema deve informar a impossibilidade de identificação e sugerir a busca manual por marca/modelo/ano. | Documento de Visão do Quero-Peças (premissa do produto: placa como chave inteligente).        | US-006 (Buscar Peças por Placa), US-008 (Buscar Peças por Modelo).         |
| **RN-011 - Indisponibilidade de Peça sem Estoque**           | A quantidade em estoque de uma peça determina sua disponibilidade para venda. Se o estoque for igual a zero, a peça deve ser exibida com o status "Indisponível" e o sistema deve impedir sua adição ao carrinho de compras.                                                                                                                         | Política de Vendas e Estoque.                                                                 | US-011 (Adicionar ao Carrinho), US-013 (Consultar Estoque).                |

## Vendas, Orçamento e Pagamentos

| **ID**                                                               | **Descrição**                                                                                                                                                                                                                                                                                                                                                                                                                      | **Fonte/autoridade**                                                          | **Impacto**                                                          |
|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|----------------------------------------------------------------------|
| **RN-012 - Preço Vigente e Congelamento de Orçamento**               | No carrinho de compras e no momento da finalização do pedido, o preço aplicado às peças deve ser sempre o preço atualizado do catálogo. Ao gerar um orçamento, o preço das peças pode ser congelado com base na data de criação do orçamento, desde que haja um prazo de validade definido para o orçamento (ex.: 7 dias corridos). Após a expiração, o orçamento deve exibir um alerta de que os preços podem ter sido alterados. | Política Comercial do Quero-Peças                                             | US-011 (Adicionar ao Carrinho), US-012 (Orçamento), US-014 (Compra). |
| **RN-013 - Ciclo de Vida do Pedido (Status "Aguardando Pagamento")** | Todo pedido finalizado deve ser criado com o status inicial "Aguardando pagamento". Somente após a confirmação da liquidação financeira (pagamento identificado) o sistema pode alterar o status para "Pago" e proceder com o débito do estoque.                                                                                                                                                                                   | Fluxo Financeiro B2B do Quero-Peças.                                          | US-014 (Compra).                                                     |
| **RN-014 - Cancelamento Automático por Não Pagamento**               | Se um pedido com status "Aguardando pagamento" não tiver a confirmação de pagamento registrada no sistema em até 3 dias corridos a partir da data de criação, o pedido deve ser automaticamente cancelado. O estoque previamente reservado deve ser liberado.                                                                                                                                                                      | Política de Pagamentos do Quero-Peças (evitar reserva indefinida de estoque). | US-014 (Compra), US-018 (Envio Automático de Boletos).               |
| **RN-015 - Geração de Boleto na Finalização do Pedido**              | Se a forma de pagamento selecionada na compra for "Boleto Bancário", um boleto com data de vencimento para 3 dias corridos deve ser gerado automaticamente e enviado por e-mail ao lojista assim que o pedido for criado.                                                                                                                                                                                                          | Política de Pagamentos do Quero-Peças.                                        | US-014 (Compra), US-018 (Envio Automático de Boletos).               |
| **RN-016 - Conversão de Orçamento em Pedido**                        | Um orçamento salvo pode ser convertido em pedido (carrinho ativo) a qualquer momento, desde que todas as peças listadas ainda possuam estoque disponível (quantidade > 0) e o orçamento esteja dentro do prazo de validade (se aplicável).                                                                                                                                                                                         | Política Comercial do Quero-Peças.                                            | US-012 (Orçamento), US-011 (Adicionar ao Carrinho), US-014 (Compra). |

## Pós-venda e Financeiro

| **ID**                                                         | **Descrição**                                                                                                                                                                                                                                                                                                            | **Fonte/autoridade**                                                       | **Impacto**                   |
|----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|-------------------------------|
| **RN-017 - Condição para Solicitação de Devolução**            | A solicitação de devolução de uma peça só pode ser registrada para itens pertencentes a um pedido cujo status seja "Entregue". Pedidos em outros status não devem habilitar a opção de devolução.                                                                                                                        | Política de Trocas e Devoluções do Quero-Peças.                            | US-015 (Solicitar Devolução). |
| **RN-018 - Registro de Evidências em Solicitação de Garantia** | Toda solicitação de garantia deve conter obrigatoriamente a descrição textual do defeito. É opcional, mas permitido, anexar até 5 arquivos de imagem (JPG/PNG) com tamanho máximo individual de 5MB para evidenciar o problema.                                                                                          | Política de Garantia do Quero-Peças (acordada com distribuidores).         | US-016 (Solicitar Garantia).  |
| **RN-019 - Prazo de Garantia por Categoria de Peça**           | O prazo para acionamento de garantia deve respeitar o período definido no cadastro da peça ou de sua categoria (ex.: peças de motor: 90 dias; peças de suspensão: 180 dias). A data de início da contagem é a data de entrega do pedido ao lojista.                                                                      | Política de Garantia do Quero-Peças (acordada com distribuidores).         | US-016 (Solicitar Garantia).  |
| **RN-020 - Análise Manual de Solicitação de Crédito**          | A solicitação de crédito por parte do lojista não concede limite automaticamente. O pedido de crédito deve ser encaminhado para análise manual da área financeira (ou do distribuidor parceiro). O lojista não pode realizar compras a prazo até que a análise seja concluída e o limite aprovado registrado no sistema. | Política de Crédito B2B (definida com a área financeira e distribuidores). | US-017 (Solicitar Crédito).   |

## LGPD e Privacidade

| **ID**                                                   | **Descrição**                                                                                                                                                                                                                                                                                                                               | **Fonte/autoridade**                                                                                                                | **Impacto**                                                                  |
|----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **RN-021 - Registro Imutável de Consentimento**          | No momento do cadastro, o sistema deve armazenar de forma imutável o registro de consentimento do lojista para tratamento de dados, contendo: identificador do usuário, data/hora do consentimento, versão da política de privacidade aceita e a origem (ex.: formulário de cadastro). O cadastro não pode ser concluído sem esse registro. | Lei nº 13.709/2018 (LGPD), Art. 8º, §2º e §4º.                                                                                      | US-024 (Registrar consentimento LGPD), US-002 (Registrar Lojistas).          |
| **RN-022 - Revogação de Consentimento**                  | O usuário pode revogar seu consentimento a qualquer momento. A revogação não invalida o tratamento de dados realizado anteriormente com base no consentimento, mas impede novos tratamentos que dependam exclusivamente dessa base legal a partir da data da revogação.                                                                     | Lei nº 13.709/2018 (LGPD), Art. 8º, §5º.                                                                                            | US-025 (Solicitar Exclusão de Dados), US-024 (Registrar consentimento LGPD). |
| **RN-023 - Prazo para Atendimento de Exclusão de Dados** | A solicitação de exclusão de dados pessoais deve ser atendida em até 15 dias corridos. Dados pessoais devem ser anonimizados ou excluídos, exceto aqueles cuja guarda é obrigatória por legislação fiscal (ex.: notas fiscais vinculadas a pedidos, que devem ser mantidas por 5 anos conforme CTN).                                        | Lei nº 13.709/2018 (LGPD), Art. 16 e Art. 18, VI; Código Tributário Nacional (Lei nº 5.172/1966), Art. 173.                         | US-025 (Solicitar Exclusão de Dados).                                        |
| **RN-024 - Imutabilidade dos Logs de Auditoria**         | Todos os logs de eventos relacionados a consentimento, exclusão e exportação de dados pessoais devem ser armazenados de forma imutável. Nenhum usuário, incluindo administradores do sistema, pode alterar ou excluir fisicamente esses registros.                                                                                          | Lei nº 13.709/2018 (LGPD), Art. 37 (obrigação de manutenção de registros de operações de tratamento) e princípio de accountability. | US-026 (Logs de Auditoria LGPD).                                             |
| **RN-025 - Formato de Portabilidade de Dados**           | O lojista que solicitar a portabilidade de seus dados deve receber um arquivo em formato estruturado e interoperável (JSON, CSV ou XML), contendo todos os dados pessoais e registros de interação associados à sua conta. O arquivo deve ser disponibilizado em até 15 dias corridos.                                                      | Lei nº 13.709/2018 (LGPD), Art. 18, V.                                                                                              | US-027 (Exportar dados do lojista).                                          |

## Segurança da Informação

| **ID**                                                  | **Descrição**                                                                                                                                                                                                                                                    | **Fonte/autoridade**                                                                    | **Impacto**                                                          |
|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| **RN-026 - Armazenamento de Senhas com Hash**           | Nenhuma senha de usuário pode ser armazenada em texto plano. Todas as senhas devem ser transformadas por uma função hash unidirecional (bcrypt com fator de custo mínimo 10) antes de serem persistidas no banco de dados.                                       | Política de Segurança da Informação do Quero-Peças; boas práticas OWASP.                | US-023 (Criptografar Senha e Dados sensíveis), US-001 (Fazer Login). |
| **RN-027 - Criptografia de Dados Sensíveis em Repouso** | Dados pessoais sensíveis (CPF, CNPJ, RG) armazenados no banco de dados devem ser criptografados em repouso utilizando algoritmo AES com chave de 256 bits (AES-256). A chave de criptografia deve ser gerenciada separadamente dos dados (ex.: cofre de chaves). | Política de Segurança da Informação do Quero-Peças; Lei nº 13.709/2018 (LGPD), Art. 46. | US-023 (Criptografar Senha e Dados sensíveis).                       |
| **RN-028 - Oferta Opcional de 2FA**                     | A autenticação em dois fatores (2FA) é uma funcionalidade de segurança adicional oferecida ao usuário, mas sua ativação não é obrigatória para uso do sistema. Uma vez ativada, é exigida a cada novo dispositivo ou a cada 30 dias no mesmo dispositivo.        | Política de Segurança da Informação do Quero-Peças.                                     | US-022 (Implementar Autenticação 2FA).                               |

## Acessibilidade e Requisitos Transversais

| **ID**                                                     | **Descrição**                                                                                                                                                                                                                                               | **Fonte/autoridade**                                                                                          | **Impacto**                                                                                                                                         |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **RN-029 - Conformidade com Diretrizes de Acessibilidade** | Todas as telas do sistema devem atender aos critérios de nível AA das Web Content Accessibility Guidelines (WCAG) 2.1. A interface deve ser compatível com leitores de tela e oferecer contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande. | Diretrizes de Acessibilidade para Produtos Digitais da Equipe de Desenvolvimento; WCAG 2.1 (W3C).             | US-028 (Acessibilidade Visual) e todas as US que envolvem interface (US-001, US-006, US-008, US-009, US-010, US-011, US-012, US-014, US-019, etc.). |
| **RN-030 - Tempo Máximo de Resposta para Busca por Placa** | O tempo de processamento da busca por placa, medido do envio da requisição até a exibição dos resultados na interface, não pode ultrapassar 3 segundos em condições normais de carga do sistema e conectividade.                                            | Documento de Visão do Quero-Peças (Requisitos Não Funcionais).                                                | US-006 (Buscar Peças por Placa).                                                                                                                    |
| **RN-031 - Disponibilidade Mínima do Sistema**             | O sistema deve garantir disponibilidade (uptime) de no mínimo 98% do tempo mensal, excluídas janelas de manutenção programada previamente comunicadas aos usuários com pelo menos 48 horas de antecedência.                                                 | Documento de Visão do Quero-Peças (Requisitos Não Funcionais), Acordo de Nível de Serviço (SLA) com lojistas. | Infraestrutura; todas as US.                                                                                                                        |
| **RN-032 - Compatibilidade com Navegadores**               | O sistema deve ser compatível com as duas últimas versões estáveis dos navegadores Google Chrome, Mozilla Firefox, Microsoft Edge e Apple Safari. Funcionalidades não podem apresentar erros que impeçam a conclusão dos casos de uso nesses ambientes.     | Documento de Visão do Quero-Peças (Requisitos Não Funcionais).                                                | Todas as US de frontend (US-001, US-006, US-008, US-009, US-010, US-011, US-012, US-014, etc.).                                                     |

## LISTA DE REQUISITOS NÃO FUNCIONAIS

**RNF-001 - Tempo de Resposta da Busca por Placa**
- **Descrição:** O endpoint REST responsável pela busca por placa (GET /api/pecas?placa=XXX) deve responder em ≤ 3 segundos para 95% das requisições sob carga de até 500 usuários simultâneos.
    - **Classificação:** Eficiência de desempenho / Comportamento temporal.
    - **Método de verificação:** Teste de carga com JMeter simulando 500 threads executando requisições à API Spring Boot; medição via Spring Actuator + Micrometer (métricas de latência percentil 95).
    - **Critério de aceitação:** Relatório do teste mostra que o percentil 95 do tempo de resposta do endpoint é ≤ 3 segundos.

**RNF-002 - Tempo de Resposta para Navegação de Páginas**
- **Descrição:** As páginas servidas pelo backend (caso use SSR com Thymeleaf) ou as chamadas à API que alimentam o frontend (se SPA) devem ter tempo de resposta ≤ 2 segundos para 90% das requisições sob 1000 usuários ativos.
    - **Classificação:** Eficiência de desempenho.
    - **Método de verificação:** Teste de carga com Gatling (compatível com Java/Scala) ou JMeter, medindo endpoints críticos (/catalogo, /carrinho, /pedidos). Métricas expostas via Actuator + Prometheus.
    - **Critério de aceitação:** Percentil 90 dos endpoints medidos ≤ 2 segundos.

**RNF-003 - Capacidade de Processamento de Pedidos**
- **Descrição:** O sistema deve suportar picos de 200 requisições de finalização de compra (POST /api/pedidos) por minuto sem que o tempo de resposta ultrapasse 5 segundos.
    - **Classificação:** Eficiência de desempenho.
    - **Método de verificação:** Teste de estresse com JMeter, aumentando gradativamente injeções até 200/min, monitorando via Actuator/Micrometer.
    - **Critério de aceitação:** Nenhuma transação falha com erro 5xx e o tempo máximo não ultrapassa 5 segundos.

**RNF-004 - Criptografia de Dados em Trânsito**
- **Descrição:** Toda comunicação HTTP entre cliente e servidor deve ser protegida com TLS 1.3, configurado no Tomcat embutido do Spring Boot.
    - **Classificação:** Segurança / Confidencialidade.
    - **Método de verificação:**
    - **Critério de aceitação:**

**RNF-005 - Proteção contra OWASP Top 10**
- **Descrição:** A aplicação Spring Boot deve ser imune a SQL Injection, XSS, CSRF e ataques de autenticação, utilizando Spring Security e validação de entrada.
    - **Classificação:** Segurança / Integridade e Confidencialidade.
    - **Método de verificação:**
    - **Critério de aceitação:**

**RNF-006 - Registro de Eventos de Segurança (Logs de Auditoria)**
- **Descrição:** Todos os eventos de autenticação, autorização e ações administrativas devem ser registrados via SLF4J/Logback e persistidos de forma imutável, incluindo data, usuário, IP e ação.
    - **Classificação:** Segurança / Auditoria.
    - **Método de verificação:** Executar cenários de login (sucesso/falha), aprovação de cadastro e verificar logs no console/arquivo/sistema de log centralizado.
    - **Critério de aceitação:** Logs aparecem estruturados (JSON) e contêm os campos exigidos; logs não podem ser deletados da camada de persistência.

**RNF-007 - Política de senhas fortes**
- **Descrição:** senhas devem ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas e números. A regra é aplicada via Spring Security ou validação customizada no backend.
    - **Classificação:** Segurança / Autenticidade.
    - **Método de verificação:** testes unitários com PasswordEncoder e validação de bean; submissão de senhas fracas.
    - **Critério de aceitação:** senhas fracas são rejeitadas com mensagem clara; BCryptPasswordEncoder é usado com fator 10+.

**RNF-008 - Disponibilidade do sistema**
- **Descrição:** Uptime de 98% mensal (24×7).
    - **Classificação:** Confiabilidade / Disponibilidade.
    - **Método de verificação:**
    - **Critério de aceitação:**

**RNF-009 - Acessibilidade WCAG 2.1 AA**
- **Descrição:** O frontend (mesmo que servido pelo Spring Boot como Thymeleaf ou como API) deve atender critérios AA.
    - **Classificação:** Usabilidade / Acessibilidade.
    - **Método de verificação:** Lighthouse e testes com NVDA.
    - **Critério de aceitação:**

**RNF-010 - Facilidade de Primeiro Uso**

- **Descrição:** Um mecânico completa "buscar peça por placa e adicionar ao carrinho" em ≤ 2 minutos no primeiro uso.
    - **Classificação:** Usabilidade / Operabilidade.
    - **Método de verificação:** Teste com 5 usuários representativos.
    - **Critério de aceitação:** 4/5 completam em ≤ 2 min.

**RNF-011 - Compatibilidade com Navegadores**
- **Descrição:** Funcionamento correto nas últimas duas versões de Chrome, Firefox, Edge, Safari.
    - **Classificação:** Compatibilidade.
    - **Método de verificação:**
    - **Critério de aceitação:**

**RNF-012 - Design Responsivo**
- **Descrição:** Interface adaptável entre 1024px e 1920px de largura.
    - **Classificação:** Compatibilidade.
    - **Método de verificação:** Testes visuais e manuais.
    - **Critério de aceitação:** Sem truncamento horizontal.

**RNF-013 - Cobertura de Testes Automatizados**
- **Descrição:** Cobertura de linhas ≥ 70% para módulos Spring (services, controllers) e ≥ 60% para frontend.
    - **Classificação:** Manutenibilidade / Testabilidade.
    - **Método de verificação:**
    - **Critério de aceitação:**

## DECLARAÇÃO DE USO ÉTICO E RESPONSÁVEL DE INTELIGÊNCIA ARTIFICIAL
Este documento de requisitos do projeto Quero-Peças foi elaborado com o apoio de ferramentas de inteligência artificial generativa, conforme as boas práticas acadêmicas e de integridade profissional. A ferramenta DeepSeek que é um modelo de linguagem generativa, com sessões executadas entre 30/04 a 08/05. O modelo de IA foi empregado como assistente das atividades Levantamento de Regras de Negócios e Elaboração dos Requisitos não funcionais com supervisão humana.