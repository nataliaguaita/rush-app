/* eslint-disable security/detect-non-literal-fs-filename -- o teste lê só o próprio código-fonte do repositório */
/**
 * Trava contra esquecimento: toda criação de cliente Supabase com acesso a tabelas precisa passar o schema (DB_SCHEMA).
 * Sem isso, o app falaria com o schema "public" mesmo depois da troca para "rush".
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

function arquivos(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return nome === "__tests__" ? [] : arquivos(caminho);
    return /\.(ts|tsx)$/.test(nome) ? [caminho] : [];
  });
}

const CRIACAO = /\b(createClient|createServiceClient|createBrowserClient|createServerClient)\(\s*\n?\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL/;

describe("schema do Supabase", () => {
  const com_cliente = arquivos(join(__dirname, "..", "..")).filter((f) => CRIACAO.test(readFileSync(f, "utf8")));

  it("encontra os arquivos que criam clientes", () => {
    expect(com_cliente.length).toBeGreaterThanOrEqual(11);
  });

  it.each(com_cliente.map((f) => [f.split("src")[1]]))("%s passa DB_SCHEMA ao criar o cliente", (f) => {
    expect(readFileSync(join(__dirname, "..", "..", f.slice(1)), "utf8")).toContain("DB_SCHEMA");
  });

  it("os hooks de tempo real escutam o schema configurado, não 'public' fixo", () => {
    for (const hook of ["use-realtime-refresh.ts", "use-stale-entregas.ts"]) {
      const src = readFileSync(join(__dirname, "..", "..", "hooks", hook), "utf8");
      expect(src).not.toMatch(/schema:\s*["']public["']/);
      expect(src).toContain("schema: DB_SCHEMA");
    }
  });
});
