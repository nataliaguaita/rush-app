# Graph Report - rush-app  (2026-09-09)

## Corpus Check
- 117 files · ~48,466 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 656 nodes · 1630 edges · 33 communities (24 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4aa1a1d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- entregador/actions.ts
- kanban-board.tsx
- database.ts
- sidebar-nav.tsx
- dependencies
- compilerOptions
- devDependencies
- components.json
- button.tsx
- cn
- Design System & UX/UI Master Guide
- create-user/route.ts
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
- app-shell.tsx
- delete-endereco/route.ts
- cleanup/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- NovaEntregaForm
- Ideias e Alterações Pendentes
- dashboard/page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 106 edges
2. `createClient()` - 80 edges
3. `Button()` - 36 edges
4. `Input()` - 25 edges
5. `formatOrderNumber()` - 25 edges
6. `Card()` - 20 edges
7. `CardContent()` - 20 edges
8. `toTitleCase()` - 19 edges
9. `Label()` - 17 edges
10. `Badge()` - 16 edges

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

## Communities (33 total, 8 thin omitted)

### Community 0 - "entregador/actions.ts"
Cohesion: 0.09
Nodes (23): confirmarRetornoEntrega(), removerFotosEntrega(), tryCalculateRouteDistance(), VALID_ROLES, EntregaCard(), clearPersistedState(), compressImage(), handleFoto() (+15 more)

### Community 1 - "kanban-board.tsx"
Cohesion: 0.09
Nodes (46): CadastrosPage(), Filtro, OrdemEntregas, ClientesPage(), Filtro, actionLabels, haversine(), KanbanBoardProps (+38 more)

### Community 2 - "database.ts"
Cohesion: 0.15
Nodes (14): Cliente, ClienteWithEnderecos, Database, DeliveryAction, DeliveryPeriod, DeliveryStatus, Endereco, Entrega (+6 more)

### Community 3 - "sidebar-nav.tsx"
Cohesion: 0.18
Nodes (11): EntregadorLayout(), logout(), EntregadorBottomNav(), EntregadorHeader(), links, adminLinks, ctaLink, SidebarNav() (+3 more)

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

### Community 8 - "button.tsx"
Cohesion: 0.14
Nodes (29): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), AddEnderecoForm(), handleSubmit() (+21 more)

### Community 9 - "cn"
Cohesion: 0.06
Nodes (39): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+31 more)

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
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 14 - "createClient"
Cohesion: 0.06
Nodes (50): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), ClienteDetailPage() (+42 more)

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
Cohesion: 0.11
Nodes (7): HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange(), RelatoriosPage(), AppShell()

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 23 - "app-shell.tsx"
Cohesion: 0.21
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "dashboard/page.tsx"
Cohesion: 0.08
Nodes (35): ClienteEditForm(), handleSubmit(), DevolucoesPage(), handleBaixa(), handleDesfazer(), pendencyBadges(), EntregaDetailPage(), copyAddress() (+27 more)

## Knowledge Gaps
- **165 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+160 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 248 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `entregador/actions.ts`, `kanban-board.tsx`, `dashboard/page.tsx`, `sidebar-nav.tsx`, `button.tsx`, `relatorios/page.tsx`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `kanban-board.tsx`, `dashboard/page.tsx`, `sidebar-nav.tsx`, `button.tsx`, `app-shell.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `kanban-board.tsx`, `dashboard/page.tsx`, `sidebar-nav.tsx`, `cn`, `relatorios/page.tsx`, `app-shell.tsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _165 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `entregador/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Should `kanban-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0945273631840796 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._