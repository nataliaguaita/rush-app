# Graph Report - rush-app  (2026-09-18)

## Corpus Check
- 163 files · ~66,329 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 873 nodes · 2188 edges · 64 communities (37 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4fd03a85`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NovaEntregaGrupoForm
- utils.ts
- cadastro-dialog.test.tsx
- dashboard/layout.tsx
- dependencies
- compilerOptions
- devDependencies
- components.json
- dashboard/page.tsx
- entregador/actions.ts
- clsx
- @dnd-kit/sortable
- relatorios/page.tsx
- @dnd-kit/utilities
- create-user/route.ts
- Arquitetura
- manifest.json
- cn
- app/layout.tsx
- entregador-nav.tsx
- seed/route.ts
- CLAUDE.md
- leaflet
- createClient
- delete-endereco/route.ts
- heatmap.tsx
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
- NovoClientePage
- kanban-board.tsx
- jest.config.js
- next
- next-themes
- react
- react-dom
- sonner
- clientes/[id]/page.tsx
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- database.ts
- enderecos-sem-gps/actions.ts
- check-security-lint.mjs
- locais/actions.ts
- cliente-edit-form.test.tsx
- sidebar-nav.tsx
- backfill-geocode.mjs
- local-dialog.test.tsx
- delete-cliente/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 101 edges
2. `createClient()` - 93 edges
3. `Button()` - 36 edges
4. `formatOrderNumber()` - 28 edges
5. `Input()` - 26 edges
6. `geocode()` - 25 edges
7. `Card()` - 22 edges
8. `CardContent()` - 22 edges
9. `toTitleCase()` - 22 edges
10. `Badge()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `load()` --calls--> `fetchAll()`  [EXTRACTED]
  src/app/dashboard/entregas/nova/page.tsx → src/lib/fetch-all.ts
- `EntregasPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/page.tsx → src/lib/supabase/client.ts
- `DashboardPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/page.tsx → src/lib/supabase/client.ts
- `POST()` --calls--> `toTitleCase()`  [EXTRACTED]
  src/app/api/admin/create-user/route.ts → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (64 total, 21 thin omitted)

### Community 0 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 1 - "utils.ts"
Cohesion: 0.19
Nodes (15): addEndereco(), createCliente(), createClienteMultiEnderecos(), geocodeExistingAddresses(), updateEndereco(), handleSubmit(), handleSubmit(), createEntrega() (+7 more)

### Community 2 - "cadastro-dialog.test.tsx"
Cohesion: 0.16
Nodes (8): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 3 - "dashboard/layout.tsx"
Cohesion: 0.32
Nodes (3): DashboardLayout(), Home(), Spinner()

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
Cohesion: 0.06
Nodes (38): darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), EntregaDevolucao, EntregaDetailPage(), copyAddress() (+30 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.06
Nodes (61): applyConfirmarRetorno(), applyCopiarFoto(), applyIniciar(), applyOp(), applyRegistrarEntrega(), applyRegistrarRecusa(), applyRemoverFotos(), applyUploadFoto() (+53 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.13
Nodes (7): brl, computeCoreStats(), pctChange(), RelatorioEntrega, RelatoriosPage(), DeliveryPeriod, DeliveryStatus

### Community 14 - "create-user/route.ts"
Cohesion: 0.20
Nodes (15): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+7 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (30): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+22 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "cn"
Cohesion: 0.06
Nodes (43): EntregasPage(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+35 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "entregador-nav.tsx"
Cohesion: 0.29
Nodes (7): logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname, profile

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 23 - "createClient"
Cohesion: 0.16
Nodes (13): CadastrosPage(), deleteCliente(), deleteEndereco(), ClienteDetailPage(), handleDeleteCliente(), handleDeleteEndereco(), assignEntregador(), confirmarRetorno() (+5 more)

### Community 25 - "heatmap.tsx"
Cohesion: 0.40
Nodes (4): HeatmapCard(), renderHeat(), LeafletHeat, HeatmapCard

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.08
Nodes (14): NovaEntregaForm(), EnderecoResumo, NovaEntregaPage(), load(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco (+6 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "clientes/route.ts"
Cohesion: 0.18
Nodes (12): CIDADES_ATENDIDAS, ClienteExterno, getAdminClient(), POST(), safeEqual(), sleep(), createSupabaseMock(), Operation (+4 more)

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 40 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 41 - "kanban-board.tsx"
Cohesion: 0.09
Nodes (37): applyAddressChange(), applyRouteChange(), cancelEntrega(), persistColumnState(), releaseRoute(), updateEntrega(), actionLabels, EditEntregaView() (+29 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "clientes/[id]/page.tsx"
Cohesion: 0.09
Nodes (60): EditProfileDialog(), handleSubmit(), Filtro, AddEnderecoForm(), EditEnderecoForm(), EntregaResumo, OrdemEntregas, EnderecoCard() (+52 more)

### Community 52 - "database.ts"
Cohesion: 0.18
Nodes (10): PesquisarEntregaDialogProps, AppShell(), profile, Database, DeliveryAction, EntregaFoto, Profile, ReceiverRole (+2 more)

### Community 53 - "enderecos-sem-gps/actions.ts"
Cohesion: 0.23
Nodes (12): AddressFields, EnderecoSemGpsKind, resgatarClienteExcluido(), retryGeocode(), setManualCoords(), tableFor(), toRow(), handleResgatar() (+4 more)

### Community 55 - "locais/actions.ts"
Cohesion: 0.53
Nodes (5): createLocal(), LocalFormData, readLocalForm(), updateLocal(), handleSubmit()

### Community 59 - "cliente-edit-form.test.tsx"
Cohesion: 0.28
Nodes (8): updateCliente(), ClienteEditForm(), handleSubmit(), cliente, mockedUpdateCliente, Select(), handleSelect(), SelectItem()

### Community 62 - "sidebar-nav.tsx"
Cohesion: 0.16
Nodes (10): adminLinks, ctaLink, SidebarNav(), vendedorLinks, adminProfile, mockedLogout, mockedUsePathname, vendedorProfile (+2 more)

### Community 63 - "backfill-geocode.mjs"
Cohesion: 0.67
Nodes (3): buscarNominatim(), geocode(), supabase

### Community 64 - "local-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): field(), fillRequired(), mockedCreateLocal, mockedUpdateLocal, mockedUseCep, PointerEventPolyfill

## Knowledge Gaps
- **218 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+213 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 322 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `utils.ts`, `cadastro-dialog.test.tsx`, `PesquisarEntregaDialog`, `dashboard/layout.tsx`, `dashboard/page.tsx`, `kanban-board.tsx`, `entregador/actions.ts`, `relatorios/page.tsx`, `clientes/[id]/page.tsx`, `cn`, `entregador-nav.tsx`, `enderecos-sem-gps/actions.ts`, `locais/actions.ts`, `sidebar-nav.tsx`, `cliente-edit-form.test.tsx`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `utils.ts`, `dashboard/layout.tsx`, `dashboard/page.tsx`, `kanban-board.tsx`, `clientes/[id]/page.tsx`, `entregador-nav.tsx`, `sidebar-nav.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `geocode()` connect `utils.ts` to `clientes/route.ts`, `kanban-board.tsx`, `clientes/[id]/page.tsx`, `enderecos-sem-gps/actions.ts`, `locais/actions.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._