/** @jest-environment node */
import { readdirSync } from "fs";
import path from "path";

// Arquivos de antes do padrão <versão>_<nome>.sql. O Supabase CLI os ignora.
// Não adicione nomes aqui: migrations novas seguem o padrão.
const LEGADO = new Set([
  "add_cancel_fields.sql",
  "add_clientes_excluidos_integracao.sql",
  "add_devolucao_fields.sql",
  "add_enderecos_active.sql",
  "add_enderecos_origem_integracao.sql",
  "add_group_id.sql",
  "add_integracao_vendas_fields.sql",
  "add_locais_frequentes.sql",
  "add_route_change_fields.sql",
  "add_route_started_at.sql",
  "nullable_endereco_cliente.sql",
  "security_hardening_authz.sql",
]);

const PADRAO = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})_[a-z0-9_]+\.sql$/;

const arquivos = readdirSync(path.join(__dirname, "../migrations")).filter(
  (f) => f.endsWith(".sql") && !LEGADO.has(f),
);

test.each(arquivos)("%s segue <YYYYMMDDHHMMSS UTC>_<nome>.sql, sem data no futuro", (arquivo) => {
  const m = arquivo.match(PADRAO);
  expect(m).not.toBeNull();
  const [, y, mo, d, h, mi, s] = m!.map(Number);
  const data = Date.UTC(y, mo - 1, d, h, mi, s);
  // Versão inválida (ex.: mês 13) vira outra data ao normalizar.
  expect(new Date(data).getUTCMonth()).toBe(mo - 1);
  // O Supabase registra a hora em que aplicou; versão no futuro nunca bate com produção.
  expect(data).toBeLessThanOrEqual(Date.now());
});

test("versões não se repetem", () => {
  const versoes = arquivos.map((f) => f.slice(0, 14));
  expect(new Set(versoes).size).toBe(versoes.length);
});
