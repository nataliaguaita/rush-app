# Graph Report - rush-app  (2026-09-09)

## Corpus Check
- 137 files · ~54,772 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 757 nodes · 1795 edges · 53 communities (29 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf55b04b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- entregas/[id]/page.tsx
- local-dialog.test.tsx
- database.ts
- utils.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- clientes/[id]/page.tsx
- cn
- Design System & UX/UI Master Guide
- cadastro-dialog.test.tsx
- NovaEntregaGrupoForm
- kanban-board.tsx
- Arquitetura
- manifest.json
- PesquisarEntregaDialog
- app/layout.tsx
- seed/route.ts
- CLAUDE.md
- callback/route.ts
- sheet.tsx
- delete-endereco/route.ts
- cleanup/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- dropdown-menu.tsx
- createClient
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
- `updateEntregaStatus()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `confirmarRetorno()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `CardPreview()` --calls--> `formatOrderNumber()`  [EXTRACTED]
  src/app/dashboard/entregas/kanban-board.tsx → src/lib/status.ts
- `DropdownMenuContent()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (53 total, 20 thin omitted)

### Community 0 - "entregas/[id]/page.tsx"
Cohesion: 0.09
Nodes (39): actionLabels, confirmarRetornoEntrega(), copiarFotoParaEntregas(), iniciarEntrega(), registrarEntrega(), registrarRecusa(), removerFotosEntrega(), tryCalculateRouteDistance() (+31 more)

### Community 1 - "local-dialog.test.tsx"
Cohesion: 0.15
Nodes (12): createLocal(), LocalFormData, readLocalForm(), updateLocal(), LocalDialog(), handleSubmit(), field(), fillRequired() (+4 more)

### Community 2 - "database.ts"
Cohesion: 0.05
Nodes (38): logout(), HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange(), RelatoriosPage(), AppShell() (+30 more)

### Community 3 - "utils.ts"
Cohesion: 0.08
Nodes (36): getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient(), POST(), addEndereco(), createCliente() (+28 more)

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

### Community 8 - "clientes/[id]/page.tsx"
Cohesion: 0.11
Nodes (45): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), Filtro, AddEnderecoForm() (+37 more)

### Community 9 - "cn"
Cohesion: 0.13
Nodes (19): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+11 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "cadastro-dialog.test.tsx"
Cohesion: 0.22
Nodes (4): mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.22
Nodes (6): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor()

### Community 14 - "kanban-board.tsx"
Cohesion: 0.07
Nodes (28): applyAddressChange(), applyRouteChange(), cancelEntrega(), confirmarRetorno(), persistColumnState(), releaseRoute(), updateEntrega(), updateEntregaStatus() (+20 more)

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

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 23 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (12): createEntrega(), NovaEntregaForm(), NovaEntregaPage(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega (+4 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 32 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 33 - "createClient"
Cohesion: 0.05
Nodes (52): CadastrosPage(), deleteEndereco(), ClienteDetailPage(), handleDeleteEndereco(), load(), ClientesPage(), darBaixaDevolucao(), desfazerBaixaDevolucao() (+44 more)

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
- **202 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+197 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 303 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `entregas/[id]/page.tsx`, `local-dialog.test.tsx`, `database.ts`, `utils.ts`, `clientes/[id]/page.tsx`, `kanban-board.tsx`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `entregas/[id]/page.tsx`, `createClient`, `database.ts`, `dropdown-menu.tsx`, `toast.tsx`, `utils.ts`, `clientes/[id]/page.tsx`, `tabs.tsx`, `kanban-board.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `Button()` connect `clientes/[id]/page.tsx` to `entregas/[id]/page.tsx`, `createClient`, `database.ts`, `toast.tsx`, `cn`, `kanban-board.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _202 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `entregas/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09061224489795919 - nodes in this community are weakly interconnected._
- **Should `local-dialog.test.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._
- **Should `database.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052403846153846155 - nodes in this community are weakly interconnected._