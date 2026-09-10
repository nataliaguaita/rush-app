# Graph Report - rush-app  (2026-09-10)

## Corpus Check
- 144 files · ~58,135 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 792 nodes · 1875 edges · 68 communities (37 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b626cfd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cadastro-dialog.test.tsx
- createClient
- database.ts
- dropdown-menu.tsx
- dependencies
- compilerOptions
- devDependencies
- components.json
- kanban-board.tsx
- entregador/actions.ts
- Design System & UX/UI Master Guide
- cn
- relatorios/page.tsx
- NovaEntregaGrupoForm
- utils.ts
- Arquitetura
- manifest.json
- KanbanBoard
- app/layout.tsx
- EditEntregaView
- seed/route.ts
- CLAUDE.md
- toast.tsx
- entregador-nav.tsx
- delete-endereco/route.ts
- NovaEntregaForm
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- eslint-config-next
- PesquisarEntregaDialog
- sidebar-nav.tsx
- Profile
- package.json
- scripts
- NovoClientePage
- entregas/actions.ts
- jest.config.js
- eslint
- dashboard/layout.tsx
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- sheet.tsx
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- local-dialog.test.tsx
- @types/node
- check-security-lint.mjs
- @commitlint/config-conventional
- dotenv
- @playwright/test
- eslint-plugin-security
- @types/react
- sidebar-nav.test.tsx
- jest-environment-jsdom
- @types/leaflet
- tabs.tsx
- LoginPage

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
10. `Profile` - 17 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `createUser()`  [EXTRACTED]
  src/app/dashboard/cadastros/cadastro-dialog.tsx → src/app/dashboard/cadastros/actions.ts
- `handleSubmit()` --calls--> `addEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/add-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `updateEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/edit-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `updateEntregaStatus()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (68 total, 25 thin omitted)

### Community 0 - "cadastro-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 1 - "createClient"
Cohesion: 0.05
Nodes (49): createUser(), updateProfile(), EditProfileDialog(), handleSubmit(), CadastrosPage(), deleteEndereco(), ClienteDetailPage(), handleDeleteEndereco() (+41 more)

### Community 2 - "database.ts"
Cohesion: 0.22
Nodes (9): KanbanBoardProps, VisualItem, Database, DeliveryAction, Entrega, EntregaFoto, EntregaWithRelations, RotaDiaria (+1 more)

### Community 3 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

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
Cohesion: 0.09
Nodes (63): Filtro, AddEnderecoForm(), handleSubmit(), EditEnderecoForm(), handleSubmit(), EntregaResumo, OrdemEntregas, EnderecoCard() (+55 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.09
Nodes (29): confirmarRetornoEntrega(), copiarFotoParaEntregas(), iniciarEntrega(), registrarEntrega(), registrarRecusa(), removerFotosEntrega(), tryCalculateRouteDistance(), uploadFotoEntrega() (+21 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "cn"
Cohesion: 0.14
Nodes (18): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+10 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.11
Nodes (9): HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange(), RelatorioEntrega, RelatoriosPage(), DeliveryPeriod (+1 more)

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 14 - "utils.ts"
Cohesion: 0.08
Nodes (39): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+31 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "KanbanBoard"
Cohesion: 0.20
Nodes (10): applyRouteChange(), persistColumnState(), releaseRoute(), haversine(), KanbanBoard(), expandToEntregaIds(), handleDragEnd(), nearestNeighborSort() (+2 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "EditEntregaView"
Cohesion: 0.27
Nodes (6): cancelEntrega(), updateEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 22 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 23 - "entregador-nav.tsx"
Cohesion: 0.33
Nodes (7): logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname, profile

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.17
Nodes (9): OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill, Select(), handleSelect() (+1 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 37 - "Profile"
Cohesion: 0.28
Nodes (7): PesquisarEntregaDialogProps, AppShell(), profile, Sheet(), SheetContent(), SheetTitle(), Profile

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 40 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 41 - "entregas/actions.ts"
Cohesion: 0.25
Nodes (7): applyAddressChange(), assignEntregador(), confirmarRetorno(), updateEntregaStatus(), AssignEntregadorSelect(), handleAssign(), RouteChangeType

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "sheet.tsx"
Cohesion: 0.25
Nodes (4): SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay()

### Community 52 - "local-dialog.test.tsx"
Cohesion: 0.17
Nodes (7): field(), fillRequired(), mockedCreateLocal, mockedUpdateLocal, mockedUseCep, PointerEventPolyfill, LocalFrequente

### Community 63 - "sidebar-nav.test.tsx"
Cohesion: 0.29
Nodes (5): SidebarNav(), adminProfile, mockedLogout, mockedUsePathname, vendedorProfile

### Community 66 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

## Knowledge Gaps
- **209 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+204 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 318 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `PesquisarEntregaDialog`, `kanban-board.tsx`, `entregas/actions.ts`, `entregador/actions.ts`, `dashboard/layout.tsx`, `relatorios/page.tsx`, `utils.ts`, `KanbanBoard`, `EditEntregaView`, `entregador-nav.tsx`, `NovaEntregaForm`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `createClient`, `sidebar-nav.tsx`, `dropdown-menu.tsx`, `tabs.tsx`, `Profile`, `kanban-board.tsx`, `dashboard/layout.tsx`, `utils.ts`, `sheet.tsx`, `toast.tsx`, `entregador-nav.tsx`, `sidebar-nav.test.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Button()` connect `kanban-board.tsx` to `createClient`, `sidebar-nav.tsx`, `Profile`, `cn`, `relatorios/page.tsx`, `sheet.tsx`, `toast.tsx`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _209 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.05063291139240506 - nodes in this community are weakly interconnected._
- **Should `dropdown-menu.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._