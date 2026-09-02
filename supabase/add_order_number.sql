-- Add sequential order_number to entregas
CREATE SEQUENCE IF NOT EXISTS entregas_order_number_seq;

ALTER TABLE entregas
  ADD COLUMN order_number INTEGER UNIQUE DEFAULT nextval('entregas_order_number_seq');

-- Backfill existing rows ordered by creation date
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
  FROM entregas
)
UPDATE entregas SET order_number = numbered.rn
FROM numbered WHERE entregas.id = numbered.id;

-- Now make it NOT NULL
ALTER TABLE entregas ALTER COLUMN order_number SET NOT NULL;
