-- Saved common delivery locations (courses, offices, etc.)
CREATE TABLE IF NOT EXISTS locais_frequentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rua text NOT NULL,
  numero text NOT NULL,
  complemento text,
  bairro text,
  cidade text NOT NULL,
  cep text,
  lat double precision,
  lng double precision,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
