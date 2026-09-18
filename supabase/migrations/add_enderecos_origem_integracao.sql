-- Marca de forma estável o endereço criado pela integração de vendas, para
-- a sync não depender do "label" (editável livremente no formulário de
-- edição) pra saber qual endereço não deve sobrescrever/duplicar.
ALTER TABLE enderecos ADD COLUMN origem_integracao BOOLEAN NOT NULL DEFAULT false;

-- Backfill: endereços já sincronizados antes desta coluna existir ainda só
-- têm o label antigo como pista. Sem isso, a próxima sync duplicaria todos.
UPDATE enderecos SET origem_integracao = true WHERE label = 'Sistema de vendas';
