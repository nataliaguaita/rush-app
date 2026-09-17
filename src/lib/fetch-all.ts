// O Supabase limita cada select a 1000 linhas (db-max-rows do projeto), mesmo
// pedindo um range maior. Acima disso é preciso paginar manualmente.
const TAMANHO_LOTE = 1000;

export async function fetchAll<T>(
  query: (from: number, to: number) => PromiseLike<{ data: T[] | null }>
): Promise<T[]> {
  const todos: T[] = [];
  let offset = 0;
  while (true) {
    const { data } = await query(offset, offset + TAMANHO_LOTE - 1);
    if (!data || data.length === 0) break;
    todos.push(...data);
    if (data.length < TAMANHO_LOTE) break;
    offset += TAMANHO_LOTE;
  }
  return todos;
}
