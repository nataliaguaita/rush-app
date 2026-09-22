@AGENTS.md

## Migrations Supabase

O Supabase compara as versões em `supabase_migrations.schema_migrations` (produção) com os arquivos de `supabase/migrations/`. Qualquer diferença quebra o check do PR ("Remote migration versions not found in local migrations directory").

- Arquivo novo: `supabase/migrations/<YYYYMMDDHHMMSS em UTC>_<nome>.sql`. Gere a versão com `date -u +%Y%m%d%H%M%S`. Nunca use data no futuro. O teste `supabase/__tests__/migrations.test.ts` valida isso.
- Aplicou em produção pelo MCP (`apply_migration`)? O Supabase grava como versão a **hora da aplicação**, não o nome do arquivo. Logo depois, rode `select version, name from supabase_migrations.schema_migrations order by version desc limit 3` e renomeie o arquivo para essa versão **no mesmo PR, antes do merge**.
- Nunca altere o schema de produção (MCP `execute_sql`, SQL Editor) sem o arquivo de migration correspondente.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
