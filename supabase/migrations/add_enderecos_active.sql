-- Faltava no histórico de migrations: enderecos.active já existe em produção
-- (aplicada direto no SQL Editor) mas nunca foi salva como arquivo. Sem isso,
-- recriar o banco do zero a partir de supabase/ quebra todo código que filtra
-- por endereço ativo (soft delete, listagens, "Endereços sem GPS").
ALTER TABLE enderecos ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;
