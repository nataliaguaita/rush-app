# Graph Report - rush-app  (2026-09-22)

## Corpus Check
- 173 files · ~69,539 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 892 nodes · 2274 edges · 64 communities (37 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c5224d67`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- use-stale-entregas.ts
- clientes/[id]/page.tsx
- cn
- dependencies
- compilerOptions
- devDependencies
- components.json
- kanban-board.tsx
- entregador/actions.ts
- clsx
- @dnd-kit/sortable
- relatorios/page.tsx
- @dnd-kit/utilities
- create-user/route.ts
- Arquitetura
- manifest.json
- RelatoriosPage
- app/layout.tsx
- entregador-nav.tsx
- seed/route.ts
- CLAUDE.md
- leaflet
- geocode
- delete-endereco/route.ts
- sidebar-nav.test.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- leaflet.heat
- PesquisarEntregaDialog
- clientes/route.ts
- lucide-react
- package.json
- scripts
- KanbanBoard
- client.ts
- jest.config.js
- next
- next-themes
- react
- react-dom
- sonner
- nova-entrega-grupo-form.tsx
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- Profile
- enderecos-sem-gps/page.tsx
- check-security-lint.mjs
- nova-grupo/page.tsx
- database.ts
- DevolucoesPage
- entregador/layout.tsx
- backfill-geocode.mjs
- delete-cliente/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 101 edges
2. `createClient()` - 98 edges
3. `Button()` - 37 edges
4. `formatOrderNumber()` - 30 edges
5. `Input()` - 28 edges
6. `geocode()` - 25 edges
7. `toTitleCase()` - 24 edges
8. `Card()` - 23 edges
9. `CardContent()` - 23 edges
10. `Label()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `updateCliente()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/cliente-edit-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `updateEntregaStatus()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `confirmarRetorno()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (64 total, 21 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.18
Nodes (19): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteCliente(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco() (+11 more)

### Community 1 - "use-stale-entregas.ts"
Cohesion: 0.25
Nodes (6): mockedUseStaleEntregas, mockedCreateClient, sampleEntrega, StaleEntrega, useStaleEntregas(), STALE_STATUSES

### Community 2 - "clientes/[id]/page.tsx"
Cohesion: 0.07
Nodes (46): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), CadastrosPage(), Filtro (+38 more)

### Community 3 - "cn"
Cohesion: 0.05
Nodes (48): adminLinks, ctaLink, SidebarNav(), vendedorLinks, mockedUseTheme, ThemeToggle(), AlertDialogMedia(), AlertDialogOverlay() (+40 more)

### Community 4 - "dependencies"
Cohesion: 0.15
Nodes (13): @base-ui/react, class-variance-authority, date-fns, @dnd-kit/core, dependencies, @base-ui/react, class-variance-authority, date-fns (+5 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "devDependencies"
Cohesion: 0.04
Nodes (47): @commitlint/cli, @commitlint/config-conventional, dotenv, eslint, eslint-config-next, eslint-plugin-security, husky, jest-environment-jsdom (+39 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "kanban-board.tsx"
Cohesion: 0.08
Nodes (54): EntregaDevolucao, FinalizarPainelCard(), Modo, actionLabels, EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp() (+46 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.07
Nodes (58): applyConfirmarRetorno(), applyCopiarFoto(), applyIniciar(), applyOp(), applyRegistrarEntrega(), applyRegistrarRecusa(), applyRemoverFotos(), applyUploadFoto() (+50 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.14
Nodes (9): HeatmapCard(), renderHeat(), LeafletHeat, brl, CanceladasTable(), HeatmapCard, RelatorioEntrega, DeliveryPeriod (+1 more)

### Community 14 - "create-user/route.ts"
Cohesion: 0.20
Nodes (15): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+7 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (30): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+22 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "RelatoriosPage"
Cohesion: 0.25
Nodes (3): computeCoreStats(), pctChange(), RelatoriosPage()

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "entregador-nav.tsx"
Cohesion: 0.29
Nodes (7): logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname, profile

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 23 - "geocode"
Cohesion: 0.25
Nodes (9): CreateEntregaGrupoParams, DestinatarioData, createLocal(), LocalFormData, readLocalForm(), updateLocal(), handleSubmit(), buscarNominatim() (+1 more)

### Community 25 - "sidebar-nav.test.tsx"
Cohesion: 0.40
Nodes (4): adminProfile, mockedLogout, mockedUsePathname, vendedorProfile

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.11
Nodes (9): NovaEntregaForm(), clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill, Select(), handleSelect() (+1 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "clientes/route.ts"
Cohesion: 0.16
Nodes (15): CIDADES_ATENDIDAS, ClienteExterno, getAdminClient(), mesmoEndereco(), POST(), safeEqual(), sleep(), soDigitos() (+7 more)

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 40 - "KanbanBoard"
Cohesion: 0.28
Nodes (7): applyRouteChange(), persistColumnState(), releaseRoute(), KanbanBoard(), expandToEntregaIds(), handleDragEnd(), toGroupId()

### Community 41 - "client.ts"
Cohesion: 0.11
Nodes (16): assignEntregador(), cancelEntrega(), confirmarRetorno(), createEntrega(), FinalizacaoPainel, finalizarPeloPainel(), resolveEnderecoId(), updateEntrega() (+8 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "nova-entrega-grupo-form.tsx"
Cohesion: 0.06
Nodes (43): AddEnderecoForm(), EditEnderecoForm(), emptyEndereco(), EnderecoCard(), EnderecoForm, NovoClientePage(), addEndereco(), handleSubmit() (+35 more)

### Community 52 - "Profile"
Cohesion: 0.40
Nodes (4): PesquisarEntregaDialogProps, AppShell(), profile, Profile

### Community 53 - "enderecos-sem-gps/page.tsx"
Cohesion: 0.22
Nodes (15): AddressFields, EnderecoSemGpsKind, resgatarClienteExcluido(), retryGeocode(), setManualCoords(), tableFor(), toRow(), ClienteExcluido (+7 more)

### Community 55 - "nova-grupo/page.tsx"
Cohesion: 0.32
Nodes (6): ClientesPage(), NovaEntregaGrupoPage(), load(), NovaEntregaPage(), load(), fetchAll()

### Community 59 - "database.ts"
Cohesion: 0.25
Nodes (7): Database, DeliveryAction, EntregaFoto, ReceiverRole, RotaDiaria, RouteChangeType, UserRole

### Community 60 - "DevolucoesPage"
Cohesion: 0.33
Nodes (5): darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer()

### Community 61 - "entregador/layout.tsx"
Cohesion: 0.23
Nodes (6): DashboardLayout(), cachedProfile(), EntregadorLayout(), loadProfile(), Home(), Spinner()

### Community 63 - "backfill-geocode.mjs"
Cohesion: 0.67
Nodes (3): buscarNominatim(), geocode(), supabase

## Knowledge Gaps
- **220 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+215 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 327 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `PesquisarEntregaDialog`, `clientes/[id]/page.tsx`, `cn`, `use-stale-entregas.ts`, `kanban-board.tsx`, `client.ts`, `KanbanBoard`, `entregador/actions.ts`, `relatorios/page.tsx`, `nova-entrega-grupo-form.tsx`, `RelatoriosPage`, `entregador-nav.tsx`, `geocode`, `enderecos-sem-gps/page.tsx`, `nova-grupo/page.tsx`, `DevolucoesPage`, `entregador/layout.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `clientes/[id]/page.tsx`, `kanban-board.tsx`, `nova-entrega-grupo-form.tsx`, `entregador-nav.tsx`, `entregador/layout.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `geocode()` connect `geocode` to `createClient`, `clientes/route.ts`, `client.ts`, `nova-entrega-grupo-form.tsx`, `enderecos-sem-gps/page.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _220 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `clientes/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07075873827791987 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._