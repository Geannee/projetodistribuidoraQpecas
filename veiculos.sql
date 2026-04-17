-- ================================================================
--  QUERO PEÇAS — Veículos
--  Adiciona coluna cor + insere 20 veículos
-- ================================================================

USE quero_pecas;

-- Adiciona campo cor (não previsto no schema original)
ALTER TABLE veiculos
  ADD COLUMN cor VARCHAR(30) NULL AFTER chassis;

-- ----------------------------------------------------------------
--  INSERT — 20 veículos
-- ----------------------------------------------------------------
INSERT INTO veiculos (placa, marca, modelo, ano_fab, ano_mod, motor, chassis, cor) VALUES
  ('PBQ2694', 'VW',       'GOL',       2019, 2019, '1.6', '9BWAL45U0KT104252', 'BRANCO'),
  ('JHA7426', 'GM',       'CLASSIC',   2006, 2006, '1.0', '9BGSA19907B121488', 'CINZA'),
  ('JJH5152', 'FIAT',     'PALIO',     2011, 2011, '1.0', '8AP17164LC3029277', 'CINZA'),
  ('OVM1510', 'HONDA',    'FIT',       2013, 2013, '1.5', '93HGE8890EZ106227', 'CINZA'),
  ('JHJ3508', 'PEUGEOT',  '307',       2008, 2008, '1.6', '8AD3CN6B49G017544', 'VERMELHO'),
  ('PRM6531', 'TOYOTA',   'COROLLA',   2018, 2018, '1.8', '9BRBL3HE5J0149029', 'PRATA'),
  ('JIX0751', 'FIAT',     'UNO',       2011, 2011, '1.0', '9BD15802AC6656467', 'VERMELHO'),
  ('JKD0284', 'CITROEN',  'C4 PICASSO',2011, 2011, '2.0', 'VF7UDRFJWBJ555532', 'PRATA'),
  ('PBJ2837', 'GM',       'S10',       2017, 2017, '2.8', '9BG148PK0JC439030', 'VERMELHO'),
  ('NGH2366', 'HYUNDAI',  'TUCSON',    2007, 2007, '2.0', 'KMHJM81BP7U654003', 'PRETA'),
  ('FMG3E13', 'FORD',     'FOCUS',     2014, 2014, '1.6', '8AFVZZFHCEJ164513', 'PRATA'),
  ('PZL5H39', 'FIAT',     'MOBI',      2017, 2017, '1.0', '9BD341A8CJY478557', 'VERMELHO'),
  ('RFL3I51', 'FIAT',     'MOBI',      2020, 2020, '1.0', '9BD341A5XLY690214', 'BRANCO'),
  ('OGT7444', 'FIAT',     'UNO',       2012, 2012, '1.0', '9BD195162D0372338', 'CINZA'),
  ('OVP5504', 'TOYOTA',   'ETIOS',     2013, 2013, '1.5', '9BRB29BT0E2030019', 'PRETA'),
  ('JGY4411', 'PEUGEOT',  '307',       2008, 2008, '1.6', '8AD3CN6B49G032523', 'PRATA'),
  ('NGG0566', 'GM',       'CLASSIC',   2007, 2007, '1.0', '8AGSA19908R117606', 'PRETA'),
  ('JHG3927', 'CITROEN',  'C3',        2007, 2007, '1.4', '935FCKFV88B516907', 'PRETA'),
  ('JIN5200', 'KIA',      'CERATO',    2011, 2011, '1.6', 'KNAFU411BB5921903', 'PRATA'),
  ('JET2227', 'HYUNDAI',  'HB20',      2013, 2013, '1.0', '9BHBG51CADP048935', 'BRANCO');

-- ================================================================
--  FIM
-- ================================================================
