-- Add group_id column to entregas for grouping deliveries to the same address
ALTER TABLE entregas ADD COLUMN IF NOT EXISTS group_id uuid DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_entregas_group_id ON entregas (group_id) WHERE group_id IS NOT NULL;
