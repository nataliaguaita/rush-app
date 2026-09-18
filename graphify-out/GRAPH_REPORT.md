# Graph Report - rush-app  (2026-09-18)

## Corpus Check
- 160 files · ~65,074 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 864 nodes · 2170 edges · 61 communities (34 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dba92081`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NovaEntregaGrupoForm
- database.ts
- cadastro-dialog.test.tsx
- entregador/layout.tsx
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
- utils.ts
- Arquitetura
- manifest.json
- cn
- app/layout.tsx
- entregador-nav.tsx
- seed/route.ts
- CLAUDE.md
- leaflet
- EditEntregaView
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
- createClient
- jest.config.js
- next
- next-themes
- react
- react-dom
- sonner
- pesquisar-entrega-dialog.tsx
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- enderecos-sem-gps/page.tsx
- check-security-lint.mjs
- sidebar-nav.tsx
- backfill-geocode.mjs
- local-dialog.test.tsx
- delete-cliente/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 101 edges
2. `createClient()` - 92 edges
3. `Button()` - 36 edges
4. `formatOrderNumber()` - 28 edges
5. `Input()` - 26 edges
6. `geocode()` - 24 edges
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
- `LocaisPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/locais/page.tsx → src/lib/supabase/client.ts
- `DashboardPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/page.tsx → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (61 total, 21 thin omitted)

### Community 0 - "NovaEntregaGrupoForm"
Cohesion: 0.22
Nodes (6): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor()

### Community 1 - "database.ts"
Cohesion: 0.16
Nodes (13): darBaixaDevolucao(), desfazerBaixaDevolucao(), EntregaDevolucao, NovaEntregaGrupoPage(), Cliente, ClienteWithEnderecos, Database, DeliveryAction (+5 more)

### Community 2 - "cadastro-dialog.test.tsx"
Cohesion: 0.22
Nodes (4): mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 3 - "entregador/layout.tsx"
Cohesion: 0.31
Nodes (5): cachedProfile(), EntregadorLayout(), loadProfile(), Home(), Spinner()

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
Cohesion: 0.06
Nodes (67): deleteCliente(), deleteEndereco(), ClienteDetailPage(), handleDeleteCliente(), handleDeleteEndereco(), EntregaResumo, OrdemEntregas, DevolucoesPage() (+59 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.06
Nodes (59): applyConfirmarRetorno(), applyCopiarFoto(), applyIniciar(), applyOp(), applyRegistrarEntrega(), applyRegistrarRecusa(), applyRemoverFotos(), applyUploadFoto() (+51 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.13
Nodes (7): brl, computeCoreStats(), pctChange(), RelatorioEntrega, RelatoriosPage(), DeliveryPeriod, DeliveryStatus

### Community 14 - "utils.ts"
Cohesion: 0.07
Nodes (46): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+38 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (30): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+22 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "cn"
Cohesion: 0.06
Nodes (42): EntregasPage(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+34 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "entregador-nav.tsx"
Cohesion: 0.16
Nodes (12): logout(), EntregadorBottomNav(), EntregadorHeader(), links, SidebarNav(), mockedLogout, mockedUsePathname, profile (+4 more)

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 23 - "EditEntregaView"
Cohesion: 0.27
Nodes (6): cancelEntrega(), updateEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 25 - "heatmap.tsx"
Cohesion: 0.40
Nodes (4): HeatmapCard(), renderHeat(), LeafletHeat, HeatmapCard

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.08
Nodes (15): createEntrega(), NovaEntregaForm(), EnderecoResumo, NovaEntregaPage(), load(), OpenGroup, clienteComEndereco, clientes (+7 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "clientes/route.ts"
Cohesion: 0.26
Nodes (10): CIDADES_ATENDIDAS, ClienteExterno, getAdminClient(), POST(), safeEqual(), sleep(), consultaCep(), EnderecoTratado (+2 more)

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 40 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 41 - "createClient"
Cohesion: 0.19
Nodes (15): CadastrosPage(), applyAddressChange(), applyRouteChange(), assignEntregador(), confirmarRetorno(), persistColumnState(), releaseRoute(), updateEntregaStatus() (+7 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "pesquisar-entrega-dialog.tsx"
Cohesion: 0.11
Nodes (40): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), Filtro, AddEnderecoForm() (+32 more)

### Community 53 - "enderecos-sem-gps/page.tsx"
Cohesion: 0.17
Nodes (19): ClienteResumo, ClientesPage(), Filtro, AddressFields, EnderecoSemGpsKind, ClienteSemEndereco, EnderecosSemGpsPage(), Row (+11 more)

### Community 62 - "sidebar-nav.tsx"
Cohesion: 0.18
Nodes (10): PesquisarEntregaDialogProps, DashboardLayout(), AppShell(), adminLinks, ctaLink, vendedorLinks, profile, mockedUseTheme (+2 more)

### Community 63 - "backfill-geocode.mjs"
Cohesion: 0.67
Nodes (3): buscarNominatim(), geocode(), supabase

### Community 64 - "local-dialog.test.tsx"
Cohesion: 0.15
Nodes (11): createLocal(), LocalFormData, readLocalForm(), updateLocal(), handleSubmit(), field(), fillRequired(), mockedCreateLocal (+3 more)

## Knowledge Gaps
- **217 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 318 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `local-dialog.test.tsx`, `database.ts`, `PesquisarEntregaDialog`, `entregador/layout.tsx`, `kanban-board.tsx`, `entregador/actions.ts`, `relatorios/page.tsx`, `utils.ts`, `pesquisar-entrega-dialog.tsx`, `cn`, `entregador-nav.tsx`, `enderecos-sem-gps/page.tsx`, `EditEntregaView`, `sidebar-nav.tsx`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `entregador/layout.tsx`, `kanban-board.tsx`, `utils.ts`, `pesquisar-entrega-dialog.tsx`, `entregador-nav.tsx`, `enderecos-sem-gps/page.tsx`, `sidebar-nav.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `geocode()` connect `utils.ts` to `local-dialog.test.tsx`, `clientes/route.ts`, `createClient`, `pesquisar-entrega-dialog.tsx`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._