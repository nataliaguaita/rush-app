-- Enderecos usados em entregas em grupo (endereço digitado ou local fixo) não
-- pertencem a um cliente específico — antes eram forçados a "pertencer" ao
-- primeiro destinatário do grupo, poluindo o cadastro dele.
ALTER TABLE enderecos ALTER COLUMN cliente_id DROP NOT NULL;
