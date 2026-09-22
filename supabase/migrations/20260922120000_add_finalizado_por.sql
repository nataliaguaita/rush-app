-- Entregas finalizadas pelo painel do admin (quando o entregador não finalizou).
-- NULL = finalizada pelo próprio entregador.
ALTER TABLE entregas ADD COLUMN IF NOT EXISTS finalizado_por UUID REFERENCES profiles(id);

-- Entregador não pode marcar a própria entrega como finalizada pelo admin.
CREATE OR REPLACE FUNCTION restrict_entregador_entrega_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor')) THEN
    RETURN NEW;
  END IF;

  IF NEW.valor IS DISTINCT FROM OLD.valor
    OR NEW.cliente_id IS DISTINCT FROM OLD.cliente_id
    OR NEW.endereco_id IS DISTINCT FROM OLD.endereco_id
    OR NEW.created_by IS DISTINCT FROM OLD.created_by
    OR NEW.entregador_id IS DISTINCT FROM OLD.entregador_id
    OR NEW.actions IS DISTINCT FROM OLD.actions
    OR NEW.scheduled_date IS DISTINCT FROM OLD.scheduled_date
    OR NEW.scheduled_period IS DISTINCT FROM OLD.scheduled_period
    OR NEW.numero_sacolas IS DISTINCT FROM OLD.numero_sacolas
    OR NEW.is_urgent IS DISTINCT FROM OLD.is_urgent
    OR NEW.notes IS DISTINCT FROM OLD.notes
    OR NEW.interested_name IS DISTINCT FROM OLD.interested_name
    OR NEW.interested_note IS DISTINCT FROM OLD.interested_note
    OR NEW.return_reminder IS DISTINCT FROM OLD.return_reminder
    OR NEW.route_order IS DISTINCT FROM OLD.route_order
    OR NEW.group_id IS DISTINCT FROM OLD.group_id
    OR NEW.nota_devolvida IS DISTINCT FROM OLD.nota_devolvida
    OR NEW.nota_devolvida_at IS DISTINCT FROM OLD.nota_devolvida_at
    OR NEW.route_change_type IS DISTINCT FROM OLD.route_change_type
    OR NEW.route_change_note IS DISTINCT FROM OLD.route_change_note
    OR NEW.finalizado_por IS DISTINCT FROM OLD.finalizado_por
  THEN
    RAISE EXCEPTION 'Entregador só pode atualizar os campos de execução da própria entrega';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.restrict_entregador_entrega_columns() FROM anon, authenticated, public;

DROP TRIGGER IF EXISTS entregas_restrict_entregador_columns ON entregas;
CREATE TRIGGER entregas_restrict_entregador_columns
  BEFORE UPDATE ON entregas
  FOR EACH ROW EXECUTE FUNCTION restrict_entregador_entrega_columns();
