# Graph Report - rush-app  (2026-09-09)

## Corpus Check
- 140 files · ~55,676 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 767 nodes · 1817 edges · 68 communities (40 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `99e39716`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- kanban-board.tsx
- createClient
- database.ts
- utils.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- dashboard/page.tsx
- entregador/actions.ts
- Design System & UX/UI Master Guide
- cadastro-dialog.test.tsx
- relatorios/page.tsx
- clientes/actions.ts
- entregas/actions.ts
- Arquitetura
- manifest.json
- cn
- app/layout.tsx
- dropdown-menu.tsx
- seed/route.ts
- CLAUDE.md
- callback/route.ts
- entregador-nav.tsx
- delete-endereco/route.ts
- cleanup/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- eslint-config-next
- PesquisarEntregaDialog
- toast.tsx
- local-dialog.test.tsx
- package.json
- scripts
- sheet.tsx
- app-shell.tsx
- jest.config.js
- eslint
- husky
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- sidebar-nav.tsx
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- EditEntregaView
- @types/node
- @types/react-dom
- cliente-edit-form.test.tsx
- dotenv
- @playwright/test
- @testing-library/dom
- @types/react
- entregador/layout.tsx
- locais/actions.ts
- tabs.tsx
- ClienteDetailPage
- assignEntregador

## God Nodes (most connected - your core abstractions)
1. `cn()` - 109 edges
2. `createClient()` - 81 edges
3. `Button()` - 36 edges
4. `formatOrderNumber()` - 26 edges
5. `Input()` - 25 edges
6. `Card()` - 20 edges
7. `CardContent()` - 20 edges
8. `toTitleCase()` - 20 edges
9. `Label()` - 17 edges
10. `Badge()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `addEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/add-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `updateEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/edit-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `updateEntregaStatus()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `confirmarRetorno()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (68 total, 22 thin omitted)

### Community 0 - "kanban-board.tsx"
Cohesion: 0.11
Nodes (48): Filtro, OrdemEntregas, Filtro, actionLabels, KanbanBoardProps, VisualItem, Destinatario, PesquisarEntregaDialogProps (+40 more)

### Community 1 - "createClient"
Cohesion: 0.15
Nodes (14): CadastrosPage(), ClientesPage(), darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), pendencyBadges() (+6 more)

### Community 2 - "database.ts"
Cohesion: 0.20
Nodes (11): Cliente, ClienteWithEnderecos, Database, DeliveryAction, DeliveryPeriod, Endereco, Entrega, EntregaFoto (+3 more)

### Community 3 - "utils.ts"
Cohesion: 0.26
Nodes (12): getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient(), POST(), isValidUsername(), normalizeUsername() (+4 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (47): @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, gsap (+39 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "devDependencies"
Cohesion: 0.15
Nodes (13): @commitlint/cli, @commitlint/config-conventional, jest-environment-jsdom, devDependencies, @commitlint/cli, @commitlint/config-conventional, jest, jest-environment-jsdom (+5 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "dashboard/page.tsx"
Cohesion: 0.07
Nodes (35): emptyEndereco(), EnderecoForm, NovoClientePage(), addEndereco(), handleSubmit(), EntregaDetailPage(), copyAddress(), formatEndereco() (+27 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.09
Nodes (29): confirmarRetornoEntrega(), copiarFotoParaEntregas(), iniciarEntrega(), registrarEntrega(), registrarRecusa(), removerFotosEntrega(), tryCalculateRouteDistance(), uploadFotoEntrega() (+21 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "cadastro-dialog.test.tsx"
Cohesion: 0.14
Nodes (10): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), mockedCreateUser, Select() (+2 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.12
Nodes (6): HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange(), RelatoriosPage()

### Community 13 - "clientes/actions.ts"
Cohesion: 0.22
Nodes (11): addEndereco(), createCliente(), createClienteMultiEnderecos(), geocodeExistingAddresses(), updateEndereco(), createEntregaGrupo(), CreateEntregaGrupoParams, DestinatarioData (+3 more)

### Community 14 - "entregas/actions.ts"
Cohesion: 0.14
Nodes (15): applyAddressChange(), applyRouteChange(), confirmarRetorno(), persistColumnState(), releaseRoute(), updateEntregaStatus(), haversine(), KanbanBoard() (+7 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "cn"
Cohesion: 0.15
Nodes (17): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+9 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 23 - "entregador-nav.tsx"
Cohesion: 0.18
Nodes (12): logout(), EntregadorBottomNav(), EntregadorHeader(), links, SidebarNav(), mockedLogout, mockedUsePathname, profile (+4 more)

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (12): createEntrega(), NovaEntregaForm(), NovaEntregaPage(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega (+4 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.38
Nodes (5): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), selectCliente()

### Community 34 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 37 - "local-dialog.test.tsx"
Cohesion: 0.06
Nodes (22): AddEnderecoForm(), handleSubmit(), EditEnderecoForm(), handleSubmit(), EnderecoCard(), DestinatarioRow(), handleClickOutside(), emptyDestinatario() (+14 more)

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 40 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 41 - "app-shell.tsx"
Cohesion: 0.39
Nodes (4): DashboardLayout(), AppShell(), profile, Profile

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 52 - "EditEntregaView"
Cohesion: 0.27
Nodes (6): cancelEntrega(), updateEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 55 - "cliente-edit-form.test.tsx"
Cohesion: 0.28
Nodes (8): updateCliente(), ClienteEditForm(), handleSubmit(), cliente, mockedUpdateCliente, Select(), handleSelect(), SelectItem()

### Community 63 - "entregador/layout.tsx"
Cohesion: 0.32
Nodes (3): EntregadorLayout(), Home(), Spinner()

### Community 64 - "locais/actions.ts"
Cohesion: 0.53
Nodes (5): createLocal(), LocalFormData, readLocalForm(), updateLocal(), handleSubmit()

### Community 65 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 66 - "ClienteDetailPage"
Cohesion: 0.50
Nodes (4): deleteEndereco(), ClienteDetailPage(), handleDeleteEndereco(), load()

### Community 67 - "assignEntregador"
Cohesion: 0.67
Nodes (3): assignEntregador(), AssignEntregadorSelect(), handleAssign()

## Knowledge Gaps
- **205 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+200 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 309 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `kanban-board.tsx`, `locais/actions.ts`, `ClienteDetailPage`, `assignEntregador`, `local-dialog.test.tsx`, `dashboard/page.tsx`, `app-shell.tsx`, `entregador/actions.ts`, `cadastro-dialog.test.tsx`, `relatorios/page.tsx`, `clientes/actions.ts`, `entregas/actions.ts`, `EditEntregaView`, `entregador-nav.tsx`, `cliente-edit-form.test.tsx`, `nova-entrega-form.test.tsx`, `entregador/layout.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `kanban-board.tsx`, `tabs.tsx`, `toast.tsx`, `utils.ts`, `dashboard/page.tsx`, `sheet.tsx`, `sidebar-nav.tsx`, `dropdown-menu.tsx`, `entregador-nav.tsx`, `entregador/layout.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `Button()` connect `kanban-board.tsx` to `toast.tsx`, `dashboard/page.tsx`, `app-shell.tsx`, `sheet.tsx`, `relatorios/page.tsx`, `sidebar-nav.tsx`, `cn`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _205 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `kanban-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11158921399885255 - nodes in this community are weakly interconnected._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._