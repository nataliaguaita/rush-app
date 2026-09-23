# Graph Report - rush-app  (2026-09-23)

## Corpus Check
- 176 files · ~70,945 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 905 nodes · 2324 edges · 69 communities (40 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `030c06f7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- entregas/actions.ts
- NovaEntregaGrupoForm
- enderecos-sem-gps/page.tsx
- cn
- dependencies
- compilerOptions
- devDependencies
- components.json
- dashboard/page.tsx
- createClient
- clsx
- @dnd-kit/sortable
- database.ts
- @dnd-kit/utilities
- create-user/route.ts
- Arquitetura
- manifest.json
- local-dialog.test.tsx
- app/layout.tsx
- entregador-nav.tsx
- seed/route.ts
- CLAUDE.md
- leaflet
- geocode
- delete-endereco/route.ts
- app-shell.tsx
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
- kanban-board.tsx
- EditEntregaView
- jest.config.js
- next
- next-themes
- react
- react-dom
- sonner
- entregas/[id]/page.tsx
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- cadastro-dialog.test.tsx
- RelatoriosPage
- check-security-lint.mjs
- sidebar-nav.tsx
- cliente-edit-form.test.tsx
- NovoClientePage
- client.ts
- sidebar-nav.test.tsx
- backfill-geocode.mjs
- heatmap.tsx
- sw.js
- assignEntregador
- delete-cliente/route.ts
- migrations.test.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 101 edges
2. `createClient()` - 98 edges
3. `Button()` - 37 edges
4. `formatOrderNumber()` - 30 edges
5. `Input()` - 28 edges
6. `geocode()` - 25 edges
7. `useUnsavedChanges()` - 24 edges
8. `toTitleCase()` - 24 edges
9. `Card()` - 23 edges
10. `CardContent()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `updateEntregaStatus()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `confirmarRetorno()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `load()` --calls--> `fetchAll()`  [EXTRACTED]
  src/app/dashboard/entregas/nova/page.tsx → src/lib/fetch-all.ts

## Import Cycles
- None detected.

## Communities (69 total, 23 thin omitted)

### Community 0 - "entregas/actions.ts"
Cohesion: 0.20
Nodes (11): applyAddressChange(), confirmarRetorno(), createEntrega(), FinalizacaoPainel, finalizarPeloPainel(), resolveEnderecoId(), updateEntrega(), updateEntregaStatus() (+3 more)

### Community 1 - "NovaEntregaGrupoForm"
Cohesion: 0.22
Nodes (6): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor()

### Community 2 - "enderecos-sem-gps/page.tsx"
Cohesion: 0.10
Nodes (34): CadastrosPage(), Filtro, ClienteResumo, ClientesPage(), Filtro, AddressFields, EnderecoSemGpsKind, resgatarClienteExcluido() (+26 more)

### Community 3 - "cn"
Cohesion: 0.06
Nodes (50): Modo, KanbanBoardProps, VisualItem, EntregaDevolucao, EntregaFinalizada, EntregadorPage(), readCache(), AlertDialogMedia() (+42 more)

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

### Community 8 - "dashboard/page.tsx"
Cohesion: 0.07
Nodes (32): darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), EntregaDevolucao, EntregaDetailPage(), copyAddress() (+24 more)

### Community 9 - "createClient"
Cohesion: 0.06
Nodes (67): deleteCliente(), deleteEndereco(), ClienteDetailPage(), handleDeleteCliente(), handleDeleteEndereco(), EntregasPage(), DashboardLayout(), applyConfirmarRetorno() (+59 more)

### Community 12 - "database.ts"
Cohesion: 0.13
Nodes (11): brl, CanceladasTable(), RelatorioEntrega, Database, DeliveryAction, DeliveryPeriod, DeliveryStatus, EntregaFoto (+3 more)

### Community 14 - "create-user/route.ts"
Cohesion: 0.20
Nodes (15): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+7 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (30): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+22 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "local-dialog.test.tsx"
Cohesion: 0.15
Nodes (11): createLocal(), LocalFormData, readLocalForm(), updateLocal(), handleSubmit(), field(), fillRequired(), mockedCreateLocal (+3 more)

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
Cohesion: 0.17
Nodes (14): addEndereco(), createCliente(), createClienteMultiEnderecos(), geocodeExistingAddresses(), updateEndereco(), handleSubmit(), handleSubmit(), createEntregaGrupo() (+6 more)

### Community 25 - "app-shell.tsx"
Cohesion: 0.17
Nodes (9): AppShell(), profile, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+1 more)

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (15): NovaEntregaForm(), EnderecoResumo, NovaEntregaPage(), load(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco (+7 more)

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

### Community 40 - "kanban-board.tsx"
Cohesion: 0.14
Nodes (15): applyRouteChange(), persistColumnState(), releaseRoute(), haversine(), KanbanBoard(), expandToEntregaIds(), handleDragEnd(), nearestNeighborSort() (+7 more)

### Community 41 - "EditEntregaView"
Cohesion: 0.24
Nodes (5): cancelEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "entregas/[id]/page.tsx"
Cohesion: 0.09
Nodes (58): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), AddEnderecoForm(), ClienteEditForm() (+50 more)

### Community 52 - "cadastro-dialog.test.tsx"
Cohesion: 0.22
Nodes (4): mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 53 - "RelatoriosPage"
Cohesion: 0.25
Nodes (3): computeCoreStats(), pctChange(), RelatoriosPage()

### Community 55 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 59 - "cliente-edit-form.test.tsx"
Cohesion: 0.29
Nodes (7): updateCliente(), handleSubmit(), cliente, mockedUpdateCliente, Select(), handleSelect(), SelectItem()

### Community 60 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 61 - "client.ts"
Cohesion: 0.46
Nodes (3): PesquisarEntregaDialogProps, Spinner(), Profile

### Community 62 - "sidebar-nav.test.tsx"
Cohesion: 0.29
Nodes (5): SidebarNav(), adminProfile, mockedLogout, mockedUsePathname, vendedorProfile

### Community 63 - "backfill-geocode.mjs"
Cohesion: 0.67
Nodes (3): buscarNominatim(), geocode(), supabase

### Community 64 - "heatmap.tsx"
Cohesion: 0.40
Nodes (4): HeatmapCard(), renderHeat(), LeafletHeat, HeatmapCard

### Community 66 - "assignEntregador"
Cohesion: 0.67
Nodes (3): assignEntregador(), AssignEntregadorSelect(), handleAssign()

## Knowledge Gaps
- **225 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+220 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 334 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `entregas/actions.ts`, `enderecos-sem-gps/page.tsx`, `cn`, `dashboard/page.tsx`, `database.ts`, `local-dialog.test.tsx`, `entregador-nav.tsx`, `geocode`, `nova-entrega-form.test.tsx`, `PesquisarEntregaDialog`, `kanban-board.tsx`, `EditEntregaView`, `entregas/[id]/page.tsx`, `RelatoriosPage`, `sidebar-nav.tsx`, `cliente-edit-form.test.tsx`, `client.ts`, `sidebar-nav.test.tsx`, `assignEntregador`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `enderecos-sem-gps/page.tsx`, `dashboard/page.tsx`, `kanban-board.tsx`, `entregas/[id]/page.tsx`, `entregador-nav.tsx`, `sidebar-nav.tsx`, `app-shell.tsx`, `client.ts`, `sidebar-nav.test.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `geocode()` connect `geocode` to `entregas/actions.ts`, `clientes/route.ts`, `enderecos-sem-gps/page.tsx`, `entregas/[id]/page.tsx`, `local-dialog.test.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _225 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `enderecos-sem-gps/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10359408033826638 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._