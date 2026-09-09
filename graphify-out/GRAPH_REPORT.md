# Graph Report - rush-app  (2026-09-09)

## Corpus Check
- 139 files · ~55,127 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 764 nodes · 1802 edges · 63 communities (35 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7e08acaa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- kanban-board.tsx
- client.ts
- database.ts
- create-user/route.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- button.tsx
- cn
- Design System & UX/UI Master Guide
- cadastro-dialog.test.tsx
- relatorios/page.tsx
- NovaEntregaGrupoForm
- createClient
- Arquitetura
- manifest.json
- dropdown-menu.tsx
- app/layout.tsx
- NovoClientePage
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
- dashboard/page.tsx
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
- sidebar-nav.test.tsx
- @types/node
- @types/react-dom
- tabs.tsx
- dotenv
- @playwright/test
- @testing-library/dom
- @types/react

## God Nodes (most connected - your core abstractions)
1. `cn()` - 107 edges
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
- `handleSubmit()` --calls--> `createUser()`  [EXTRACTED]
  src/app/dashboard/cadastros/cadastro-dialog.tsx → src/app/dashboard/cadastros/actions.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `DashboardPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/page.tsx → src/lib/supabase/client.ts
- `EntregadorPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/entregador/page.tsx → src/lib/supabase/client.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (63 total, 22 thin omitted)

### Community 0 - "kanban-board.tsx"
Cohesion: 0.07
Nodes (52): OrdemEntregas, actionLabels, haversine(), KanbanBoardProps, nearestNeighborSort(), optimizeVisualRoute(), VisualItem, confirmarRetornoEntrega() (+44 more)

### Community 1 - "client.ts"
Cohesion: 0.19
Nodes (16): Filtro, Filtro, darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), pendencyBadges() (+8 more)

### Community 2 - "database.ts"
Cohesion: 0.15
Nodes (14): Cliente, ClienteWithEnderecos, Database, DeliveryAction, DeliveryPeriod, DeliveryStatus, Endereco, Entrega (+6 more)

### Community 3 - "create-user/route.ts"
Cohesion: 0.33
Nodes (10): getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient(), POST(), isValidUsername(), normalizeUsername() (+2 more)

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

### Community 8 - "button.tsx"
Cohesion: 0.12
Nodes (35): createUser(), updateProfile(), EditProfileDialog(), handleSubmit(), AddEnderecoForm(), EditEnderecoForm(), EnderecoCard(), EnderecoForm (+27 more)

### Community 9 - "cn"
Cohesion: 0.14
Nodes (18): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+10 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "cadastro-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.12
Nodes (6): HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange(), RelatoriosPage()

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.15
Nodes (9): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor() (+1 more)

### Community 14 - "createClient"
Cohesion: 0.05
Nodes (57): CadastrosPage(), addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco() (+49 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 23 - "entregador-nav.tsx"
Cohesion: 0.26
Nodes (8): EntregadorLayout(), logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname, profile

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (11): NovaEntregaForm(), NovaEntregaPage(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill (+3 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "dashboard/page.tsx"
Cohesion: 0.08
Nodes (30): EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp(), CardPreview(), GroupCardContent(), SortableCard(), PesquisarEntregaDialog() (+22 more)

### Community 34 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 37 - "local-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): field(), fillRequired(), mockedCreateLocal, mockedUpdateLocal, mockedUseCep, PointerEventPolyfill

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

### Community 52 - "sidebar-nav.test.tsx"
Cohesion: 0.29
Nodes (5): SidebarNav(), adminProfile, mockedLogout, mockedUsePathname, vendedorProfile

### Community 55 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

## Knowledge Gaps
- **205 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+200 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 308 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `kanban-board.tsx`, `client.ts`, `dashboard/page.tsx`, `button.tsx`, `app-shell.tsx`, `relatorios/page.tsx`, `NovaEntregaGrupoForm`, `entregador-nav.tsx`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `kanban-board.tsx`, `dashboard/page.tsx`, `client.ts`, `toast.tsx`, `button.tsx`, `sheet.tsx`, `createClient`, `sidebar-nav.tsx`, `dropdown-menu.tsx`, `sidebar-nav.test.tsx`, `tabs.tsx`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `kanban-board.tsx`, `client.ts`, `dashboard/page.tsx`, `toast.tsx`, `sheet.tsx`, `app-shell.tsx`, `cn`, `relatorios/page.tsx`, `sidebar-nav.tsx`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _205 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `kanban-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07108478341355054 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._