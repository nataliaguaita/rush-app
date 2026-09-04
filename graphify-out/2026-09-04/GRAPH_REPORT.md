# Graph Report - rush-app  (2026-09-04)

## Corpus Check
- 107 files · ~45,029 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 605 nodes · 1534 edges · 33 communities (24 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0cd43248`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- kanban-board.tsx
- entregas/[id]/page.tsx
- createClient
- database.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- pesquisar-entrega-dialog.tsx
- cn
- Design System & UX/UI Master Guide
- create-user/route.ts
- NovoClientePage
- NovaEntregaGrupoForm
- dropdown-menu.tsx
- README.md
- manifest.json
- PesquisarEntregaDialog
- app/layout.tsx
- AGENTS.md
- seed/route.ts
- CLAUDE.md
- callback/route.ts
- utils.ts
- delete-endereco/route.ts
- cleanup/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- toast.tsx
- sheet.tsx
- tabs.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 106 edges
2. `createClient()` - 73 edges
3. `Button()` - 35 edges
4. `Input()` - 25 edges
5. `formatOrderNumber()` - 21 edges
6. `toTitleCase()` - 19 edges
7. `Card()` - 18 edges
8. `CardContent()` - 18 edges
9. `Label()` - 17 edges
10. `SelectValue()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `DropdownMenuContent()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (33 total, 8 thin omitted)

### Community 0 - "kanban-board.tsx"
Cohesion: 0.05
Nodes (70): deleteEndereco(), ClienteDetailPage(), handleDeleteEndereco(), load(), OrdemEntregas, EntregaDetailPage(), copyAddress(), formatEndereco() (+62 more)

### Community 1 - "entregas/[id]/page.tsx"
Cohesion: 0.17
Nodes (22): AddEnderecoForm(), EditEnderecoForm(), EnderecoCard(), EnderecoForm, actionLabels, Destinatario, Button(), buttonVariants (+14 more)

### Community 2 - "createClient"
Cohesion: 0.06
Nodes (50): CadastrosPage(), addEndereco(), createCliente(), createClienteMultiEnderecos(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), handleSubmit() (+42 more)

### Community 3 - "database.ts"
Cohesion: 0.05
Nodes (32): DashboardLayout(), EntregadorLayout(), logout(), HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange() (+24 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (47): @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, gsap (+39 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "devDependencies"
Cohesion: 0.07
Nodes (27): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/leaflet (+19 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "pesquisar-entrega-dialog.tsx"
Cohesion: 0.23
Nodes (13): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), PesquisarEntregaDialogProps, Dialog() (+5 more)

### Community 9 - "cn"
Cohesion: 0.14
Nodes (18): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+10 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "create-user/route.ts"
Cohesion: 0.33
Nodes (10): getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient(), POST(), isValidUsername(), normalizeUsername() (+2 more)

### Community 12 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.14
Nodes (10): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor() (+2 more)

### Community 14 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 15 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "PesquisarEntregaDialog"
Cohesion: 0.38
Nodes (5): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), selectCliente()

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 23 - "utils.ts"
Cohesion: 0.12
Nodes (16): Filtro, Filtro, NovaEntregaForm(), NovaEntregaPage(), OpenGroup, Badge(), badgeVariants, Table() (+8 more)

### Community 30 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 31 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 32 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

## Knowledge Gaps
- **141 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+136 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 222 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `kanban-board.tsx`, `entregas/[id]/page.tsx`, `database.ts`, `pesquisar-entrega-dialog.tsx`, `NovaEntregaGrupoForm`, `utils.ts`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `kanban-board.tsx`, `entregas/[id]/page.tsx`, `tabs.tsx`, `database.ts`, `pesquisar-entrega-dialog.tsx`, `dropdown-menu.tsx`, `utils.ts`, `toast.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `Button()` connect `entregas/[id]/page.tsx` to `kanban-board.tsx`, `database.ts`, `pesquisar-entrega-dialog.tsx`, `cn`, `utils.ts`, `toast.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _141 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `kanban-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.051770451770451774 - nodes in this community are weakly interconnected._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.06101190476190476 - nodes in this community are weakly interconnected._
- **Should `database.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05388471177944862 - nodes in this community are weakly interconnected._