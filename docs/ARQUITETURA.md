# Arquitetura

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Server Components + Server Actions) |
| Linguagem | TypeScript |
| UI | Tailwind CSS v4, shadcn/ui (base-ui), lucide-react (ícones) |
| Estado global (cliente) | Zustand |
| Auth + Banco + Storage + Realtime | Supabase |
| Mapas / heatmap | Leaflet + leaflet.heat |
| Drag-and-drop (kanban) | dnd-kit |
| Cálculo de rota | OSRM (via `src/lib/route-distance.ts`) |
| Deploy | Vercel |
| PWA | `manifest.json` em `public/` |

## Estrutura de pastas

```
src/
  app/
    login/                 # tela de login
    dashboard/             # área do admin/vendedor
      page.tsx             # visão geral (KPIs, torre de controle)
      entregas/            # listagem, criação (nova/nova-grupo), detalhe [id], kanban-board
      clientes/            # CRUD de clientes e endereços
      locais/              # locais frequentes (endereços reutilizáveis)
      cadastros/           # CRUD de usuários (vendedores/entregadores)
    entregador/            # área do motoboy (mobile-first)
      page.tsx             # rota do dia (kanban simplificado)
      finalizadas/         # histórico de entregas concluídas
      actions.ts           # server actions: iniciar, registrar entrega/recusa, upload de foto
    relatorios/            # relatórios e KPIs (admin), export PDF via print
    configuracoes/         # configurações da conta
    api/
      admin/               # create-user, update-user, delete-endereco (usam service role)
      resolve-username/    # resolve username -> email sintético (login por usuário)
      test/                # seed/cleanup para ambiente de teste
    auth/callback/         # callback do fluxo de auth do Supabase
  components/
    ui/                    # componentes shadcn/ui (button, card, dialog, sheet, tabs, etc.)
    sidebar-nav.tsx         # navegação lateral, com listas de links por papel (adminLinks/vendedorLinks)
  lib/
    supabase/
      client.ts            # cliente Supabase (browser)
      server.ts            # cliente Supabase (server components/actions)
      middleware.ts         # updateSession() — sessão + redirects de auth
    username.ts             # normalização/validação de username, geração de e-mail sintético
    status.ts               # labels e cores de status de entrega, formatação de nº de pedido
    route-distance.ts       # cálculo de km via OSRM
    utils.ts                # cn() e helpers gerais
  types/
    database.ts             # tipos do banco (fonte da verdade do modelo de dados)
supabase/
  schema.sql                # schema completo
  migrations/, add_*.sql    # migrações incrementais
```

## Modelo de dados

Definido em [`src/types/database.ts`](../src/types/database.ts) e no schema SQL em [`supabase/schema.sql`](../supabase/schema.sql).

### Tabelas principais

- **`profiles`** — usuários do sistema. `role`: `admin` | `vendedor` | `entregador`. Login pode ser por username (convertido em e-mail sintético, ver `src/lib/username.ts`).
- **`clientes`** — clientes da Dental Marechal.
- **`enderecos`** — endereços de entrega, N:1 com `clientes`. Tem `lat`/`lng` (geocodificados) usados no mapa/heatmap e no cálculo de rota.
- **`locais_frequentes`** — endereços avulsos reutilizáveis (não vinculados a um cliente específico), usados para agilizar cadastro de entrega.
- **`entregas`** — a entidade central. Principais campos:
  - `status`: `aguardando_atribuicao → rota_definida → em_rota → entregue | recusada | retornada | cancelada`
  - `entregador_id`, `route_order`, `scheduled_period` (`manha`/`tarde`), `scheduled_date`
  - Comprovação: `receiver_name`, `receiver_role`, `receiver_note`, `delivered_at`
  - `group_id` — agrupa entregas criadas juntas (ver "nova-grupo")
  - `order_number` — número sequencial legível, formatado como `#0001` (`formatOrderNumber` em `src/lib/status.ts`)
- **`entrega_fotos`** — fotos de comprovação, N:1 com `entregas`, armazenadas no Supabase Storage (`storage_path`).
- **`rotas_diarias`** — km percorrido por entregador/dia/período, calculado automaticamente ao finalizar a última entrega do período.

### Fluxo de status de uma entrega

```
aguardando_atribuicao → rota_definida → em_rota → entregue
                                              ↘ recusada
                                              ↘ retornada
                    (cancelada pode ocorrer a partir de qualquer estado anterior a "entregue")
```

## Autenticação e papéis

- Auth via Supabase (`@supabase/ssr`). `src/lib/supabase/middleware.ts` roda em todo request: sem usuário autenticado → redireciona para `/login`; usuário autenticado tentando acessar `/login` → redireciona para `/dashboard`.
- Login pode ser feito por **username** (não apenas e-mail): `src/app/api/login/route.ts` deriva o e-mail sintético via `usernameToSyntheticEmail()` (`src/lib/username.ts`, determinístico a partir do username, sem consulta ao banco) e chama `signInWithPassword` no servidor, sempre respondendo com a mesma mensagem genérica em caso de erro — não há endpoint separado que confirme se um username existe.
- Depois do login, o papel (`profiles.role`) decide o redirecionamento: `entregador` vai para `/entregador`; `admin`/`vendedor` vão para `/dashboard` (ver `src/app/dashboard/layout.tsx`).
- Criação/edição de usuários (`/api/admin/create-user`, `/api/admin/update-user`) usa a **service role key** do Supabase no servidor — nunca exposta ao cliente.

## Navegação por papel

`src/components/sidebar-nav.tsx` define `adminLinks` e `vendedorLinks` — os menus mudam de acordo com `profiles.role`. A área `/entregador` tem seu próprio layout, mobile-first, sem o sidebar do dashboard.

## Pontos de integração externos

- **OSRM** — cálculo de distância de rota (`src/lib/route-distance.ts`), disparado automaticamente quando o entregador finaliza a última entrega de um período (manhã = ida e volta, tarde = somente ida).
- **Supabase Storage** — fotos de comprovação de entrega.
- **Origem fixa** — coordenadas da matriz da Dental Marechal (R. Mal. Deodoro, 500 - Sl 151, Centro, Curitiba), usadas como ponto de partida das rotas. Definidas em `src/lib/constants.ts`.

## Convenção do repositório: `graphify`

O projeto mantém um grafo de código em `graphify-out/` (nós, comunidades, god nodes). Use `graphify query "<pergunta>"` para navegar relações entre arquivos antes de grep manual, e rode `graphify update .` após alterar código — é só análise AST, sem custo de API.
