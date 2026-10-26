-- Fecha a leitura de dados pessoais para o entregador (Etapa 2, item A2).
-- Antes: clientes, enderecos, entrega_fotos, profiles e rotas_diarias liberavam leitura (rotas, também escrita)
-- a qualquer usuário logado. Agora: admin e vendedor continuam vendo tudo; o entregador vê só o que é dele.
--   clientes / enderecos / entrega_fotos: só os ligados às próprias entregas
--   rotas_diarias: só as próprias
--   profiles: só o próprio perfil
-- Sempre "public." nos nomes: no servidor novo o arquivo é aplicado com sed 's/\bpublic\./rush./g' (schema rush).

-- Security definer para a política de profiles não se consultar a si mesma (recursão infinita).
CREATE OR REPLACE FUNCTION public.is_staff() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'vendedor')
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_staff() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;

DROP POLICY IF EXISTS profiles_select ON public.profiles;
-- Sem "(SELECT ...)" aqui de propósito: um subselect nesta política, somado ao subselect em profiles que
-- profiles_update/entregas_* já têm, dá "infinite recursion detected in policy for relation profiles".
CREATE POLICY profiles_select ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS clientes_select ON public.clientes;
CREATE POLICY clientes_select ON public.clientes FOR SELECT TO authenticated
  USING (
    (SELECT public.is_staff())
    OR EXISTS (SELECT 1 FROM public.entregas e WHERE e.cliente_id = clientes.id AND e.entregador_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS enderecos_select ON public.enderecos;
CREATE POLICY enderecos_select ON public.enderecos FOR SELECT TO authenticated
  USING (
    (SELECT public.is_staff())
    OR EXISTS (SELECT 1 FROM public.entregas e WHERE e.endereco_id = enderecos.id AND e.entregador_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS fotos_select ON public.entrega_fotos;
CREATE POLICY fotos_select ON public.entrega_fotos FOR SELECT TO authenticated
  USING (
    (SELECT public.is_staff())
    OR EXISTS (SELECT 1 FROM public.entregas e WHERE e.id = entrega_fotos.entrega_id AND e.entregador_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS rotas_select ON public.rotas_diarias;
CREATE POLICY rotas_select ON public.rotas_diarias FOR SELECT TO authenticated
  USING ((SELECT public.is_staff()) OR entregador_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS rotas_upsert ON public.rotas_diarias;
CREATE POLICY rotas_upsert ON public.rotas_diarias FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_staff()) OR entregador_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS rotas_update ON public.rotas_diarias;
CREATE POLICY rotas_update ON public.rotas_diarias FOR UPDATE TO authenticated
  USING ((SELECT public.is_staff()) OR entregador_id = (SELECT auth.uid()))
  WITH CHECK ((SELECT public.is_staff()) OR entregador_id = (SELECT auth.uid()));
