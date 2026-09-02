CREATE TABLE rotas_diarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entregador_id UUID NOT NULL REFERENCES profiles(id),
  data DATE NOT NULL,
  period delivery_period NOT NULL,
  distance_km DOUBLE PRECISION NOT NULL DEFAULT 0,
  entregas_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(entregador_id, data, period)
);

ALTER TABLE rotas_diarias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rotas_select" ON rotas_diarias
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "rotas_upsert" ON rotas_diarias
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "rotas_update" ON rotas_diarias
  FOR UPDATE TO authenticated USING (true);
