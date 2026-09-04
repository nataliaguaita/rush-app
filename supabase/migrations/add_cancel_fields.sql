ALTER TYPE delivery_status ADD VALUE IF NOT EXISTS 'cancelada';

ALTER TABLE entregas
  ADD COLUMN IF NOT EXISTS cancel_reason text;
