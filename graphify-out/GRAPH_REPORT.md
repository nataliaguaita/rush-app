# Graph Report - rush-app  (2026-09-04)

## Corpus Check
- 101 files · ~41,849 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 574 nodes · 1411 edges · 29 communities (19 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `563e7525`
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
- username.ts
- NovoClientePage
- NovaEntregaGrupoForm
- RelatoriosPage
- README.md
- manifest.json
- formatOrderNumber
- app/layout.tsx
- AGENTS.md
- seed/route.ts
- CLAUDE.md
- callback/route.ts
- delete-endereco/route.ts
- cleanup/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 106 edges
2. `createClient()` - 67 edges
3. `Button()` - 33 edges
4. `Input()` - 23 edges
5. `formatOrderNumber()` - 21 edges
6. `Card()` - 18 edges
7. `CardContent()` - 18 edges
8. `Label()` - 16 edges
9. `SelectValue()` - 16 edges
10. `SelectTrigger()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `ClientesPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/clientes/page.tsx → src/lib/supabase/client.ts
- `handleRecusarBatch()` --calls--> `registrarRecusa()`  [EXTRACTED]
  src/app/entregador/entrega-group-card.tsx → src/app/entregador/actions.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (29 total, 9 thin omitted)

### Community 0 - "kanban-board.tsx"
Cohesion: 0.07
Nodes (60): CadastrosPage(), Filtro, OrdemEntregas, ClientesPage(), Filtro, haversine(), KanbanBoardProps, nearestNeighborSort() (+52 more)

### Community 1 - "entregas/[id]/page.tsx"
Cohesion: 0.16
Nodes (22): AddEnderecoForm(), EditEnderecoForm(), EnderecoCard(), EnderecoForm, actionLabels, Destinatario, brl, Button() (+14 more)

### Community 2 - "createClient"
Cohesion: 0.05
Nodes (44): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), handleSubmit() (+36 more)

### Community 3 - "database.ts"
Cohesion: 0.06
Nodes (35): NovaEntregaGrupoPage(), DashboardLayout(), EntregadorLayout(), logout(), AppShell(), EntregadorBottomNav(), EntregadorHeader(), links (+27 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (43): @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, gsap (+35 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "pesquisar-entrega-dialog.tsx"
Cohesion: 0.14
Nodes (19): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), PesquisarEntregaDialogProps, StatusBadge() (+11 more)

### Community 9 - "cn"
Cohesion: 0.06
Nodes (37): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+29 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "username.ts"
Cohesion: 0.33
Nodes (10): getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient(), POST(), isValidUsername(), normalizeUsername() (+2 more)

### Community 12 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.24
Nodes (6): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor()

### Community 15 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "formatOrderNumber"
Cohesion: 0.07
Nodes (25): EditEntregaView(), handleSubmit(), parseValor(), EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp(), CardPreview() (+17 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

## Knowledge Gaps
- **136 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+131 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 211 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `pesquisar-entrega-dialog.tsx`, `kanban-board.tsx`, `database.ts`, `entregas/[id]/page.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `kanban-board.tsx`, `entregas/[id]/page.tsx`, `database.ts`, `pesquisar-entrega-dialog.tsx`, `RelatoriosPage`, `formatOrderNumber`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `Button()` connect `entregas/[id]/page.tsx` to `pesquisar-entrega-dialog.tsx`, `kanban-board.tsx`, `database.ts`, `cn`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _136 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `kanban-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.05222734254992319 - nodes in this community are weakly interconnected._
- **Should `database.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05957767722473605 - nodes in this community are weakly interconnected._