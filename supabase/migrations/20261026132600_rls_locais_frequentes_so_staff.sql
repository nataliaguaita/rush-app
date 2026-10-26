-- Etapa 2, item B2: locais_frequentes tinha "Allow all for authenticated users" (qualquer logado, inclusive
-- entregador, lia e escrevia). Só admin e vendedor usam a tela "Endereços Fixos" (o app do entregador não lê
-- essa tabela), então leitura e escrita ficam só com eles. Depende de public.is_staff() (migration anterior).
-- Sempre "public." nos nomes: no servidor novo o arquivo é aplicado com sed 's/\bpublic\./rush./g' (schema rush).

DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.locais_frequentes;
DROP POLICY IF EXISTS locais_frequentes_staff ON public.locais_frequentes;
CREATE POLICY locais_frequentes_staff ON public.locais_frequentes FOR ALL TO authenticated
  USING ((SELECT public.is_staff()))
  WITH CHECK ((SELECT public.is_staff()));
