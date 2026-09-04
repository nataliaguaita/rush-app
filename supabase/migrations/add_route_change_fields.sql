ALTER TABLE entregas
  ADD COLUMN IF NOT EXISTS route_change_type text,
  ADD COLUMN IF NOT EXISTS route_change_note text,
  ADD COLUMN IF NOT EXISTS return_confirmed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS return_confirmed_at timestamptz;
