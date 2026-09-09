ALTER TABLE entregas
  ADD COLUMN IF NOT EXISTS nota_devolvida boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS nota_devolvida_at timestamptz;
