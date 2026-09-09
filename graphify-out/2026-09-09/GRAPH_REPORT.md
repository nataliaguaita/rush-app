# Graph Report - rush-app  (2026-09-09)

## Corpus Check
- 133 files · ~51,763 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 717 nodes · 1730 edges · 54 communities (30 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf55b04b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- entregador/actions.ts
- kanban-board.tsx
- database.ts
- utils.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- button.tsx
- cn
- Design System & UX/UI Master Guide
- NovoClientePage
- NovaEntregaGrupoForm
- createClient
- Arquitetura
- manifest.json
- PesquisarEntregaDialog
- app/layout.tsx
- relatorios/page.tsx
- seed/route.ts
- CLAUDE.md
- callback/route.ts
- sheet.tsx
- delete-endereco/route.ts
- cleanup/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- NovaEntregaForm
- Ideias e Alterações Pendentes
- dropdown-menu.tsx
- formatOrderNumber
- toast.tsx
- package.json
- scripts
- tabs.tsx
- jest.config.js
- eslint
- husky
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- @testing-library/dom
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- @types/leaflet
- @types/node
- @types/react-dom
- typescript

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
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `ClientesPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/clientes/page.tsx → src/lib/supabase/client.ts
- `LocaisPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/locais/page.tsx → src/lib/supabase/client.ts
- `handleRecusarBatch()` --calls--> `registrarRecusa()`  [EXTRACTED]
  src/app/entregador/entrega-group-card.tsx → src/app/entregador/actions.ts

## Import Cycles
- None detected.

## Communities (54 total, 20 thin omitted)

### Community 0 - "entregador/actions.ts"
Cohesion: 0.09
Nodes (25): confirmarRetornoEntrega(), copiarFotoParaEntregas(), registrarEntrega(), tryCalculateRouteDistance(), VALID_ROLES, EntregaCard(), clearPersistedState(), compressImage() (+17 more)

### Community 1 - "kanban-board.tsx"
Cohesion: 0.11
Nodes (41): CadastrosPage(), Filtro, OrdemEntregas, ClientesPage(), Filtro, actionLabels, haversine(), KanbanBoardProps (+33 more)

### Community 2 - "database.ts"
Cohesion: 0.06
Nodes (37): NovaEntregaGrupoPage(), DashboardLayout(), EntregadorLayout(), logout(), AppShell(), EntregadorBottomNav(), EntregadorHeader(), links (+29 more)

### Community 3 - "utils.ts"
Cohesion: 0.25
Nodes (11): getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient(), POST(), isValidUsername(), normalizeUsername() (+3 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (47): @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, gsap (+39 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "devDependencies"
Cohesion: 0.15
Nodes (13): @commitlint/cli, @commitlint/config-conventional, eslint-config-next, jest-environment-jsdom, devDependencies, @commitlint/cli, @commitlint/config-conventional, eslint-config-next (+5 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "button.tsx"
Cohesion: 0.11
Nodes (34): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), AddEnderecoForm(), EditEnderecoForm() (+26 more)

### Community 9 - "cn"
Cohesion: 0.13
Nodes (19): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+11 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 12 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 14 - "createClient"
Cohesion: 0.05
Nodes (54): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), handleSubmit() (+46 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "PesquisarEntregaDialog"
Cohesion: 0.38
Nodes (5): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), selectCliente()

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "relatorios/page.tsx"
Cohesion: 0.12
Nodes (6): HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange(), RelatoriosPage()

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 23 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 30 - "NovaEntregaForm"
Cohesion: 0.17
Nodes (3): NovaEntregaForm(), NovaEntregaPage(), OpenGroup

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 32 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 33 - "formatOrderNumber"
Cohesion: 0.10
Nodes (26): ClienteDetailPage(), handleDeleteEndereco(), load(), EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp(), CardPreview() (+18 more)

### Community 35 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, prepare, start, test, test:watch

### Community 41 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

## Knowledge Gaps
- **192 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+187 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 280 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `entregador/actions.ts`, `kanban-board.tsx`, `database.ts`, `formatOrderNumber`, `button.tsx`, `relatorios/page.tsx`, `NovaEntregaForm`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dropdown-menu.tsx`, `formatOrderNumber`, `database.ts`, `kanban-board.tsx`, `toast.tsx`, `utils.ts`, `button.tsx`, `tabs.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `kanban-board.tsx`, `database.ts`, `toast.tsx`, `cn`, `relatorios/page.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _192 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `entregador/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08712121212121213 - nodes in this community are weakly interconnected._
- **Should `kanban-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10819672131147541 - nodes in this community are weakly interconnected._
- **Should `database.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0649895178197065 - nodes in this community are weakly interconnected._