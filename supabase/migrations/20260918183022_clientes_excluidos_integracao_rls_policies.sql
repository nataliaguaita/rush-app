-- RLS foi habilitado nesta tabela em algum momento sem nenhuma policy, então
-- toda consulta autenticada retornava vazio mesmo com linhas existentes.
-- Mesma regra já usada em clientes/enderecos: leitura livre, escrita
-- (aqui, exclusão da lista negra = "resgatar" cliente) só admin/vendedor.
CREATE POLICY "clientes_excluidos_integracao_select" ON clientes_excluidos_integracao
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "clientes_excluidos_integracao_delete" ON clientes_excluidos_integracao
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'vendedor')
    )
  );
