-- Campos para reaproveitar cadastros do sistema de vendas via integração.
-- codigo_externo é a chave de deduplicação (código interno do cliente lá).
ALTER TABLE clientes ADD COLUMN codigo_externo TEXT UNIQUE;
ALTER TABLE clientes ADD COLUMN cpf_cnpj TEXT;
