-- Guarda o codigo_externo de clientes excluídos manualmente (admin) que vieram
-- da integração com o sistema de vendas, pra o próximo sync não recriar quem
-- já foi descartado de propósito.
CREATE TABLE clientes_excluidos_integracao (
  codigo_externo TEXT PRIMARY KEY,
  excluido_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
