# Rush App — Documentação

Sistema interno de gestão de entregas da **Dental Marechal** (distribuidora de produtos odontológicos). Controla o ciclo completo de uma entrega: cadastro do cliente/endereço, criação da entrega, atribuição a um motoboy (entregador), execução da rota e comprovação de entrega (foto + dados do recebedor).

## Índice

- [Arquitetura](./ARQUITETURA.md) — stack, estrutura de pastas, modelo de dados, fluxo de autenticação
- [Funcionalidades](./FUNCIONALIDADES.md) — o que cada papel de usuário vê e faz, tela por tela
- [Como Rodar Localmente](#como-rodar-localmente)
- [Changelog](./CHANGELOG.md) — histórico de mudanças relevantes

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Backend:** Supabase (Auth, Postgres, Storage, Realtime)
- **UI:** Tailwind CSS v4 + shadcn/ui (base-ui)
- **Deploy:** Vercel
- **Outros:** Leaflet (mapas/heatmap), dnd-kit (kanban drag-and-drop), OSRM (cálculo de distância de rota)

## Como Rodar Localmente

```bash
npm install
cp .env.local.example .env.local   # preencher com as chaves do projeto Supabase
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Variáveis de ambiente necessárias (`.env.local`):

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (pública) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de service role — usada nas rotas admin (`/api/admin/*`) para criar/editar usuários |
| `TEST_ENDPOINT_SECRET` | Segredo exigido por `/api/test/seed` e `/api/test/cleanup` (dev/staging only) |

O schema do banco está em [`supabase/schema.sql`](../supabase/schema.sql), com migrações incrementais em `supabase/migrations/` e nos arquivos `supabase/add_*.sql`.

## Convenção deste projeto (importante para outros devs)

- Este repo roda uma versão do Next.js diferente da que os modelos de IA foram treinados — ver [AGENTS.md](../AGENTS.md). Antes de mudar algo relacionado a rotas/APIs do Next, confira `node_modules/next/dist/docs/`.
- Há um grafo de dependências do código gerado por `graphify` em `graphify-out/`. Rode `graphify query "<pergunta>"` para entender relações entre arquivos antes de navegar manualmente pelo código; rode `graphify update .` depois de alterações.

## Mantendo esta documentação atualizada

Sempre que uma funcionalidade for adicionada, alterada ou removida:
1. Atualize a seção correspondente em [FUNCIONALIDADES.md](./FUNCIONALIDADES.md) (ou [ARQUITETURA.md](./ARQUITETURA.md) se mudou estrutura/modelo de dados).
2. Adicione uma linha em [CHANGELOG.md](./CHANGELOG.md).
3. Faça isso no mesmo commit/PR da mudança de código — documentação desatualizada é pior que nenhuma documentação.
