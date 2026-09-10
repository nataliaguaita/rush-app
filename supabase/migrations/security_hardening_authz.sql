-- ============================================
-- SECURITY HARDENING: authorization gaps found in pentest review
-- ============================================

-- (1) CRÍTICO — escalação de privilégio via profiles_update.
-- A policy só verifica "id = auth.uid()" em USING e não define WITH CHECK,
-- então o Postgres reusa o USING como CHECK: qualquer usuário autenticado
-- podia fazer UPDATE na própria linha de profiles e setar role = 'admin'
-- (ou active = true) direto via REST/console do navegador, sem passar pela
-- API /api/admin/*. Bloqueado aqui independente do que a UI permite.
CREATE OR REPLACE FUNCTION prevent_profile_privilege_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- As rotas /api/admin/* usam a service-role key (auth.role() =
  -- 'service_role') e já validam que quem chamou é admin antes de
  -- atualizar o profile; esse caminho é confiável e não passa por aqui.
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.active IS DISTINCT FROM OLD.active)
     AND NOT EXISTS (
       SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
     )
  THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar role ou active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.prevent_profile_privilege_escalation() FROM anon, authenticated, public;

DROP TRIGGER IF EXISTS profiles_prevent_escalation ON profiles;
CREATE TRIGGER profiles_prevent_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_profile_privilege_escalation();

-- (2) ALTO — IDOR no storage bucket "entregas".
-- As policies de storage só checavam bucket_id = 'entregas', sem olhar o
-- dono da entrega dona da pasta. Qualquer usuário autenticado (inclusive
-- um entregador de outra rota) podia ler ou escrever fotos de QUALQUER
-- entrega, bastando saber o UUID (usado como nome da pasta). Passa a
-- espelhar exatamente a regra já usada em entregas_select/fotos_insert.
DROP POLICY IF EXISTS "entregas_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "entregas_storage_select" ON storage.objects;

CREATE POLICY "entregas_storage_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'entregas'
    AND EXISTS (
      SELECT 1 FROM entregas
      WHERE entregas.id::text = (storage.foldername(name))[1]
      AND (
        entregas.entregador_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
      )
    )
  );

CREATE POLICY "entregas_storage_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'entregas'
    AND EXISTS (
      SELECT 1 FROM entregas
      WHERE entregas.id::text = (storage.foldername(name))[1]
      AND (
        entregas.entregador_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
      )
    )
  );

-- (3) MÉDIO — entregas_update não restringe COLUNAS, só a linha.
-- Um entregador pode dar UPDATE na sua própria entrega (correto), mas a
-- policy não impede que ele altere valor, cliente_id, endereco_id etc. via
-- chamada direta à API — campos que a tela dele nunca edita (só
-- src/app/entregador/actions.ts, que mexe em status/receiver_*/refusal_*/
-- return_confirmed*/route_started_at). Reforça no banco o que a UI já
-- assume, sem alterar o que admin/vendedor podem fazer.
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
