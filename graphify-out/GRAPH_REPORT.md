# Graph Report - rush-app  (2026-09-22)

## Corpus Check
- 171 files · ~68,982 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 890 nodes · 2266 edges · 66 communities (38 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `99f8ea9b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NovaEntregaGrupoForm
- EditEntregaView
- cadastro-dialog.test.tsx
- entregas/page.tsx
- dependencies
- compilerOptions
- devDependencies
- components.json
- kanban-board.tsx
- createClient
- clsx
- @dnd-kit/sortable
- database.ts
- @dnd-kit/utilities
- create-user/route.ts
- Arquitetura
- manifest.json
- RelatoriosPage
- app/layout.tsx
- client.ts
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
- createClienteMultiEnderecos
- entregas/actions.ts
- jest.config.js
- next
- next-themes
- react
- react-dom
- sonner
- cn
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- Profile
- enderecos-sem-gps/page.tsx
- check-security-lint.mjs
- heatmap.tsx
- cliente-edit-form.test.tsx
- finalizarPeloPainel
- spinner.tsx
- sidebar-nav.tsx
- backfill-geocode.mjs
- local-dialog.test.tsx
- delete-cliente/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 101 edges
2. `createClient()` - 97 edges
3. `Button()` - 37 edges
4. `Input()` - 28 edges
5. `formatOrderNumber()` - 28 edges
6. `geocode()` - 25 edges
7. `toTitleCase()` - 24 edges
8. `Card()` - 23 edges
9. `CardContent()` - 23 edges
10. `Label()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `createUser()`  [EXTRACTED]
  src/app/dashboard/cadastros/cadastro-dialog.tsx → src/app/dashboard/cadastros/actions.ts
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `updateEntregaStatus()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `confirmarRetorno()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `load()` --calls--> `fetchAll()`  [EXTRACTED]
  src/app/dashboard/entregas/nova/page.tsx → src/lib/fetch-all.ts

## Import Cycles
- None detected.

## Communities (66 total, 22 thin omitted)

### Community 0 - "NovaEntregaGrupoForm"
Cohesion: 0.18
Nodes (9): createEntregaGrupo(), DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit() (+1 more)

### Community 1 - "EditEntregaView"
Cohesion: 0.28
Nodes (5): cancelEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 2 - "cadastro-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 3 - "entregas/page.tsx"
Cohesion: 0.08
Nodes (19): EntregasPage(), StaleEntregasBanner(), mockedUseStaleEntregas, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel() (+11 more)

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
Cohesion: 0.07
Nodes (62): deleteCliente(), deleteEndereco(), ClienteDetailPage(), handleDeleteCliente(), handleDeleteEndereco(), EntregaResumo, OrdemEntregas, EntregaDevolucao (+54 more)

### Community 9 - "createClient"
Cohesion: 0.06
Nodes (65): darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), DashboardPage(), applyConfirmarRetorno(), applyCopiarFoto() (+57 more)

### Community 12 - "database.ts"
Cohesion: 0.15
Nodes (9): brl, RelatorioEntrega, Database, DeliveryAction, DeliveryPeriod, DeliveryStatus, EntregaFoto, RotaDiaria (+1 more)

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

### Community 19 - "client.ts"
Cohesion: 0.22
Nodes (10): cachedProfile(), EntregadorLayout(), loadProfile(), logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout (+2 more)

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 23 - "geocode"
Cohesion: 0.18
Nodes (12): addEndereco(), createCliente(), geocodeExistingAddresses(), updateEndereco(), AddEnderecoForm(), handleSubmit(), handleSubmit(), CreateEntregaGrupoParams (+4 more)

### Community 25 - "sidebar-nav.test.tsx"
Cohesion: 0.29
Nodes (5): SidebarNav(), adminProfile, mockedLogout, mockedUsePathname, vendedorProfile

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.08
Nodes (16): NovaEntregaForm(), EnderecoResumo, NovaEntregaPage(), load(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco (+8 more)

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

### Community 40 - "createClienteMultiEnderecos"
Cohesion: 0.33
Nodes (5): createClienteMultiEnderecos(), emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 41 - "entregas/actions.ts"
Cohesion: 0.12
Nodes (20): applyAddressChange(), applyRouteChange(), assignEntregador(), confirmarRetorno(), createEntrega(), FinalizacaoPainel, persistColumnState(), releaseRoute() (+12 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "cn"
Cohesion: 0.07
Nodes (64): createUser(), updateProfile(), EditProfileDialog(), handleSubmit(), EditEnderecoForm(), EnderecoCard(), EnderecoForm, EnderecoPicker() (+56 more)

### Community 52 - "Profile"
Cohesion: 0.33
Nodes (5): PesquisarEntregaDialogProps, DashboardLayout(), AppShell(), profile, Profile

### Community 53 - "enderecos-sem-gps/page.tsx"
Cohesion: 0.11
Nodes (32): CadastrosPage(), Filtro, ClienteResumo, ClientesPage(), Filtro, AddressFields, EnderecoSemGpsKind, resgatarClienteExcluido() (+24 more)

### Community 55 - "heatmap.tsx"
Cohesion: 0.40
Nodes (4): HeatmapCard(), renderHeat(), LeafletHeat, HeatmapCard

### Community 59 - "cliente-edit-form.test.tsx"
Cohesion: 0.28
Nodes (8): updateCliente(), ClienteEditForm(), handleSubmit(), cliente, mockedUpdateCliente, Select(), handleSelect(), SelectItem()

### Community 60 - "finalizarPeloPainel"
Cohesion: 0.40
Nodes (3): finalizarPeloPainel(), FinalizarPainelCard(), submit()

### Community 62 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 63 - "backfill-geocode.mjs"
Cohesion: 0.67
Nodes (3): buscarNominatim(), geocode(), supabase

### Community 64 - "local-dialog.test.tsx"
Cohesion: 0.15
Nodes (11): createLocal(), LocalFormData, readLocalForm(), updateLocal(), handleSubmit(), field(), fillRequired(), mockedCreateLocal (+3 more)

## Knowledge Gaps
- **220 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+215 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 327 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `NovaEntregaGrupoForm`, `EditEntregaView`, `entregas/page.tsx`, `kanban-board.tsx`, `database.ts`, `RelatoriosPage`, `client.ts`, `geocode`, `sidebar-nav.test.tsx`, `nova-entrega-form.test.tsx`, `PesquisarEntregaDialog`, `createClienteMultiEnderecos`, `entregas/actions.ts`, `cn`, `Profile`, `enderecos-sem-gps/page.tsx`, `cliente-edit-form.test.tsx`, `finalizarPeloPainel`, `spinner.tsx`, `sidebar-nav.tsx`, `local-dialog.test.tsx`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `entregas/page.tsx`, `kanban-board.tsx`, `client.ts`, `enderecos-sem-gps/page.tsx`, `sidebar-nav.test.tsx`, `spinner.tsx`, `sidebar-nav.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `geocode()` connect `geocode` to `NovaEntregaGrupoForm`, `local-dialog.test.tsx`, `clientes/route.ts`, `createClienteMultiEnderecos`, `entregas/actions.ts`, `cn`, `enderecos-sem-gps/page.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _220 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `entregas/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08387096774193549 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._