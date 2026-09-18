# Graph Report - rush-app  (2026-09-18)

## Corpus Check
- 162 files · ~65,768 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 870 nodes · 2182 edges · 65 communities (37 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5c54d53d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NovaEntregaGrupoForm
- utils.ts
- edit-profile-dialog.tsx
- client.ts
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
- cn
- app/layout.tsx
- Profile
- seed/route.ts
- CLAUDE.md
- leaflet
- EditEntregaView
- delete-endereco/route.ts
- heatmap.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- database.ts
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
- nova-entrega-form.tsx
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- use-stale-entregas.ts
- enderecos-sem-gps/page.tsx
- check-security-lint.mjs
- NovaEntregaForm
- cliente-edit-form.test.tsx
- geocode
- sidebar-nav.tsx
- backfill-geocode.mjs
- local-dialog.tsx
- delete-cliente/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 101 edges
2. `createClient()` - 92 edges
3. `Button()` - 36 edges
4. `formatOrderNumber()` - 28 edges
5. `Input()` - 26 edges
6. `geocode()` - 25 edges
7. `Card()` - 22 edges
8. `CardContent()` - 22 edges
9. `toTitleCase()` - 22 edges
10. `Badge()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `load()` --calls--> `fetchAll()`  [EXTRACTED]
  src/app/dashboard/entregas/nova/page.tsx → src/lib/fetch-all.ts
- `EntregasPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/page.tsx → src/lib/supabase/client.ts
- `LocaisPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/locais/page.tsx → src/lib/supabase/client.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (65 total, 22 thin omitted)

### Community 0 - "NovaEntregaGrupoForm"
Cohesion: 0.18
Nodes (9): createEntregaGrupo(), DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit() (+1 more)

### Community 1 - "utils.ts"
Cohesion: 0.18
Nodes (12): addEndereco(), createCliente(), createClienteMultiEnderecos(), geocodeExistingAddresses(), updateEndereco(), handleSubmit(), handleSubmit(), handleSubmit() (+4 more)

### Community 2 - "edit-profile-dialog.tsx"
Cohesion: 0.11
Nodes (18): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), mockedCreateUser, Select() (+10 more)

### Community 3 - "client.ts"
Cohesion: 0.31
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

### Community 8 - "kanban-board.tsx"
Cohesion: 0.07
Nodes (70): deleteCliente(), deleteEndereco(), ClienteDetailPage(), handleDeleteCliente(), handleDeleteEndereco(), EntregaResumo, OrdemEntregas, EntregaDevolucao (+62 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.06
Nodes (60): applyConfirmarRetorno(), applyCopiarFoto(), applyIniciar(), applyOp(), applyRegistrarEntrega(), applyRegistrarRecusa(), applyRemoverFotos(), applyUploadFoto() (+52 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.12
Nodes (8): brl, computeCoreStats(), pctChange(), RelatorioEntrega, RelatoriosPage(), DeliveryPeriod, DeliveryStatus, RotaDiaria

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
Nodes (39): EntregasPage(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+31 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "Profile"
Cohesion: 0.18
Nodes (13): PesquisarEntregaDialogProps, logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname, profile (+5 more)

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 23 - "EditEntregaView"
Cohesion: 0.27
Nodes (6): cancelEntrega(), updateEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 25 - "heatmap.tsx"
Cohesion: 0.40
Nodes (4): HeatmapCard(), renderHeat(), LeafletHeat, HeatmapCard

### Community 30 - "database.ts"
Cohesion: 0.09
Nodes (21): EnderecoResumo, NovaEntregaPage(), load(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega (+13 more)

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
Cohesion: 0.50
Nodes (3): emptyEndereco(), NovoClientePage(), addEndereco()

### Community 41 - "createClient"
Cohesion: 0.12
Nodes (22): darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), applyAddressChange(), applyRouteChange(), assignEntregador() (+14 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "nova-entrega-form.tsx"
Cohesion: 0.23
Nodes (12): AddEnderecoForm(), EditEnderecoForm(), EnderecoForm, Destinatario, GeocodeWarning(), Checkbox(), Label(), Separator() (+4 more)

### Community 52 - "use-stale-entregas.ts"
Cohesion: 0.24
Nodes (7): StaleEntregasBanner(), mockedUseStaleEntregas, mockedCreateClient, sampleEntrega, StaleEntrega, useStaleEntregas(), STALE_STATUSES

### Community 53 - "enderecos-sem-gps/page.tsx"
Cohesion: 0.14
Nodes (26): CadastrosPage(), Filtro, ClienteResumo, ClientesPage(), Filtro, AddressFields, EnderecoSemGpsKind, retryGeocode() (+18 more)

### Community 59 - "cliente-edit-form.test.tsx"
Cohesion: 0.28
Nodes (8): updateCliente(), ClienteEditForm(), handleSubmit(), cliente, mockedUpdateCliente, Select(), handleSelect(), SelectItem()

### Community 60 - "geocode"
Cohesion: 0.42
Nodes (4): EnderecoCard(), buscarNominatim(), geocode(), useGeocodeCheck()

### Community 62 - "sidebar-nav.tsx"
Cohesion: 0.16
Nodes (11): AppShell(), adminLinks, ctaLink, SidebarNav(), vendedorLinks, profile, mockedUseTheme, ThemeToggle() (+3 more)

### Community 63 - "backfill-geocode.mjs"
Cohesion: 0.67
Nodes (3): buscarNominatim(), geocode(), supabase

### Community 64 - "local-dialog.tsx"
Cohesion: 0.16
Nodes (12): createLocal(), LocalFormData, readLocalForm(), updateLocal(), LocalDialog(), handleSubmit(), field(), fillRequired() (+4 more)

## Knowledge Gaps
- **217 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 321 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `NovaEntregaGrupoForm`, `utils.ts`, `edit-profile-dialog.tsx`, `PesquisarEntregaDialog`, `client.ts`, `local-dialog.tsx`, `kanban-board.tsx`, `entregador/actions.ts`, `relatorios/page.tsx`, `cn`, `Profile`, `use-stale-entregas.ts`, `enderecos-sem-gps/page.tsx`, `NovaEntregaForm`, `EditEntregaView`, `sidebar-nav.tsx`, `cliente-edit-form.test.tsx`, `database.ts`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `utils.ts`, `edit-profile-dialog.tsx`, `client.ts`, `kanban-board.tsx`, `nova-entrega-form.tsx`, `Profile`, `enderecos-sem-gps/page.tsx`, `sidebar-nav.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `geocode()` connect `geocode` to `NovaEntregaGrupoForm`, `utils.ts`, `clientes/route.ts`, `local-dialog.tsx`, `createClient`, `enderecos-sem-gps/page.tsx`, `NovaEntregaForm`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `edit-profile-dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11494252873563218 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._