# Graph Report - rush-app  (2026-09-10)

## Corpus Check
- 144 files · ~58,322 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 796 nodes · 1890 edges · 65 communities (37 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0e80a012`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- local-dialog.tsx
- dashboard/page.tsx
- database.ts
- entregador/actions.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- kanban-board.tsx
- EntregaCard
- Design System & UX/UI Master Guide
- cn
- relatorios/page.tsx
- NovaEntregaGrupoForm
- create-user/route.ts
- Arquitetura
- manifest.json
- KanbanBoard
- app/layout.tsx
- EditEntregaView
- seed/route.ts
- CLAUDE.md
- client.ts
- entregador-nav.tsx
- delete-endereco/route.ts
- cliente-edit-form.test.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- eslint-config-next
- PesquisarEntregaDialog
- sidebar-nav.tsx
- heatmap.tsx
- package.json
- scripts
- NovoClientePage
- createClient
- jest.config.js
- eslint
- Profile
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- app-shell.tsx
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- assignEntregador
- @types/node
- check-security-lint.mjs
- @commitlint/config-conventional
- dotenv
- @playwright/test
- eslint-plugin-security
- @types/react
- jest-environment-jsdom
- @types/leaflet

## God Nodes (most connected - your core abstractions)
1. `cn()` - 109 edges
2. `createClient()` - 80 edges
3. `Button()` - 35 edges
4. `formatOrderNumber()` - 26 edges
5. `Input()` - 25 edges
6. `Card()` - 20 edges
7. `CardContent()` - 20 edges
8. `toTitleCase()` - 20 edges
9. `Profile` - 18 edges
10. `Label()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `addEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/add-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `updateCliente()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/cliente-edit-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `updateEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/edit-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts

## Import Cycles
- None detected.

## Communities (65 total, 22 thin omitted)

### Community 0 - "local-dialog.tsx"
Cohesion: 0.07
Nodes (30): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), mockedCreateUser, Select() (+22 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.09
Nodes (27): ClienteDetailPage(), handleDeleteEndereco(), EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp(), CardPreview(), GroupCardContent() (+19 more)

### Community 2 - "database.ts"
Cohesion: 0.19
Nodes (10): NovaEntregaGrupoPage(), Cliente, ClienteWithEnderecos, Database, DeliveryAction, EntregaFoto, LocalFrequente, ReceiverRole (+2 more)

### Community 3 - "entregador/actions.ts"
Cohesion: 0.24
Nodes (9): confirmarRetornoEntrega(), copiarFotoParaEntregas(), registrarEntrega(), tryCalculateRouteDistance(), VALID_ROLES, handleRegistrarBatch(), ORIGIN_LAT, ORIGIN_LNG (+1 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (47): @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, gsap (+39 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "devDependencies"
Cohesion: 0.15
Nodes (13): @commitlint/cli, husky, devDependencies, @commitlint/cli, husky, jest, @testing-library/dom, @types/react-dom (+5 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "kanban-board.tsx"
Cohesion: 0.10
Nodes (50): AddEnderecoForm(), handleSubmit(), EditEnderecoForm(), handleSubmit(), EntregaResumo, OrdemEntregas, EnderecoCard(), EnderecoForm (+42 more)

### Community 9 - "EntregaCard"
Cohesion: 0.12
Nodes (19): iniciarEntrega(), registrarRecusa(), removerFotosEntrega(), uploadFotoEntrega(), EntregaCard(), clearPersistedState(), compressImage(), handleFoto() (+11 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "cn"
Cohesion: 0.05
Nodes (53): CadastrosPage(), Filtro, ClienteResumo, ClientesPage(), Filtro, LocaisPage(), AlertDialogMedia(), AlertDialogOverlay() (+45 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.12
Nodes (8): brl, computeCoreStats(), pctChange(), RelatorioEntrega, RelatoriosPage(), DeliveryPeriod, DeliveryStatus, RotaDiaria

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 14 - "create-user/route.ts"
Cohesion: 0.20
Nodes (15): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+7 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "KanbanBoard"
Cohesion: 0.28
Nodes (7): applyRouteChange(), persistColumnState(), releaseRoute(), KanbanBoard(), expandToEntregaIds(), handleDragEnd(), toGroupId()

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "EditEntregaView"
Cohesion: 0.28
Nodes (5): cancelEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 22 - "client.ts"
Cohesion: 0.26
Nodes (8): darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), EntregaDevolucao, pendencyBadges(), Entrega

### Community 23 - "entregador-nav.tsx"
Cohesion: 0.18
Nodes (12): logout(), EntregadorBottomNav(), EntregadorHeader(), links, SidebarNav(), mockedLogout, mockedUsePathname, profile (+4 more)

### Community 25 - "cliente-edit-form.test.tsx"
Cohesion: 0.29
Nodes (7): ClienteEditForm(), handleSubmit(), cliente, mockedUpdateCliente, Select(), handleSelect(), SelectItem()

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (13): NovaEntregaForm(), EnderecoResumo, NovaEntregaPage(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega (+5 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 37 - "heatmap.tsx"
Cohesion: 0.40
Nodes (4): HeatmapCard(), renderHeat(), LeafletHeat, HeatmapCard

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
Cohesion: 0.18
Nodes (21): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), applyAddressChange() (+13 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 44 - "Profile"
Cohesion: 0.21
Nodes (6): PesquisarEntregaDialogProps, DashboardLayout(), EntregadorLayout(), Home(), Spinner(), Profile

### Community 48 - "app-shell.tsx"
Cohesion: 0.17
Nodes (9): AppShell(), profile, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+1 more)

### Community 52 - "assignEntregador"
Cohesion: 0.67
Nodes (3): assignEntregador(), AssignEntregadorSelect(), handleAssign()

## Knowledge Gaps
- **213 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+208 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 319 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `local-dialog.tsx`, `dashboard/page.tsx`, `database.ts`, `PesquisarEntregaDialog`, `entregador/actions.ts`, `kanban-board.tsx`, `EntregaCard`, `cn`, `Profile`, `relatorios/page.tsx`, `KanbanBoard`, `EditEntregaView`, `assignEntregador`, `client.ts`, `entregador-nav.tsx`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `local-dialog.tsx`, `dashboard/page.tsx`, `sidebar-nav.tsx`, `kanban-board.tsx`, `createClient`, `Profile`, `app-shell.tsx`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Button()` connect `kanban-board.tsx` to `local-dialog.tsx`, `dashboard/page.tsx`, `sidebar-nav.tsx`, `cn`, `relatorios/page.tsx`, `app-shell.tsx`, `client.ts`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _213 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `local-dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07102040816326531 - nodes in this community are weakly interconnected._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08748615725359911 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._