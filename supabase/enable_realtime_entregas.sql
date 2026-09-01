-- Confirma que o Supabase Realtime está habilitado para a tabela "entregas".
--
-- O schema.sql do projeto já contém "ALTER PUBLICATION supabase_realtime ADD
-- TABLE entregas;" (linha ~292), então é possível que isso já esteja
-- aplicado no banco em produção. Antes de rodar este script, confira em
-- Database > Replication no painel do Supabase se "entregas" já aparece na
-- publicação supabase_realtime — se já estiver lá, não precisa rodar nada.
--
-- Este script só existe porque este ambiente não tem uma conexão autenticada
-- com o projeto Supabase para eu verificar/aplicar isso diretamente.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'entregas'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.entregas;
  END IF;
END $$;
