-- ============================================
-- Alinha as migrations do repo com o schema de produção.
-- Estes itens foram criados direto no banco e nunca versionados; quem montava
-- o banco a partir do repo ficava sem eles (e o trigger
-- restrict_entregador_entrega_columns quebrava por falta de numero_sacolas).
-- Tudo idempotente: em produção esta migration não muda nada.
-- ============================================

ALTER TYPE delivery_status ADD VALUE IF NOT EXISTS 'retornada' AFTER 'recusada';
ALTER TYPE delivery_action ADD VALUE IF NOT EXISTS 'receber_e_assinar';

ALTER TABLE entregas ADD COLUMN IF NOT EXISTS numero_sacolas INTEGER NOT NULL DEFAULT 1;
ALTER TABLE enderecos ADD COLUMN IF NOT EXISTS origem_sistema_vendas BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE clientes_excluidos_integracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE locais_frequentes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'locais_frequentes' AND policyname = 'Allow all for authenticated users'
  ) THEN
    CREATE POLICY "Allow all for authenticated users" ON locais_frequentes
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
