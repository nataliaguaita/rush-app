# Graph Report - rush-app  (2026-09-09)

## Corpus Check
- 111 files · ~47,125 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 634 nodes · 1564 edges · 36 communities (27 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c886ce99`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- entregador/actions.ts
- kanban-board.tsx
- utils.ts
- database.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- local-dialog.tsx
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
- cadastros/page.tsx
- delete-endereco/route.ts
- cleanup/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- KanbanBoard
- EditEntregaView
- locais/actions.ts
- EntregaDetailPage
- route-distance.ts
- assignEntregador

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
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `addEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/add-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `updateEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/edit-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `ClientesPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/clientes/page.tsx → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (36 total, 8 thin omitted)

### Community 0 - "entregador/actions.ts"
Cohesion: 0.10
Nodes (26): confirmarRetornoEntrega(), copiarFotoParaEntregas(), iniciarEntrega(), registrarEntrega(), registrarRecusa(), removerFotosEntrega(), tryCalculateRouteDistance(), uploadFotoEntrega() (+18 more)

### Community 1 - "kanban-board.tsx"
Cohesion: 0.10
Nodes (52): ClienteEditForm(), OrdemEntregas, EnderecoForm, actionLabels, CardPreview(), GroupCardContent(), KanbanBoardProps, SortableCard() (+44 more)

### Community 2 - "utils.ts"
Cohesion: 0.23
Nodes (15): addEndereco(), createCliente(), createClienteMultiEnderecos(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), handleSubmit(), applyAddressChange() (+7 more)

### Community 3 - "database.ts"
Cohesion: 0.06
Nodes (34): NovaEntregaGrupoPage(), EntregadorLayout(), logout(), EntregadorBottomNav(), EntregadorHeader(), links, adminLinks, ctaLink (+26 more)

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

### Community 8 - "local-dialog.tsx"
Cohesion: 0.20
Nodes (14): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), Dialog(), DialogContent() (+6 more)

### Community 9 - "cn"
Cohesion: 0.06
Nodes (37): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+29 more)

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
Cohesion: 0.08
Nodes (16): AddEnderecoForm(), handleSubmit(), EditEnderecoForm(), handleSubmit(), EnderecoCard(), DestinatarioRow(), handleClickOutside(), emptyDestinatario() (+8 more)

### Community 14 - "createClient"
Cohesion: 0.11
Nodes (15): deleteEndereco(), ClienteDetailPage(), handleDeleteEndereco(), load(), confirmarRetorno(), updateEntregaStatus(), NovaEntregaPage(), OpenGroup (+7 more)

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

### Community 23 - "cadastros/page.tsx"
Cohesion: 0.25
Nodes (13): CadastrosPage(), Filtro, ClientesPage(), Filtro, LocaisPage(), Table(), TableBody(), TableCaption() (+5 more)

### Community 30 - "KanbanBoard"
Cohesion: 0.20
Nodes (10): applyRouteChange(), persistColumnState(), releaseRoute(), haversine(), KanbanBoard(), expandToEntregaIds(), handleDragEnd(), nearestNeighborSort() (+2 more)

### Community 31 - "EditEntregaView"
Cohesion: 0.27
Nodes (6): cancelEntrega(), updateEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 32 - "locais/actions.ts"
Cohesion: 0.53
Nodes (5): createLocal(), LocalFormData, readLocalForm(), updateLocal(), handleSubmit()

### Community 33 - "EntregaDetailPage"
Cohesion: 0.67
Nodes (4): EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp()

### Community 35 - "assignEntregador"
Cohesion: 0.67
Nodes (3): assignEntregador(), AssignEntregadorSelect(), handleAssign()

## Knowledge Gaps
- **161 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+156 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 241 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `locais/actions.ts`, `kanban-board.tsx`, `utils.ts`, `assignEntregador`, `EntregaDetailPage`, `database.ts`, `entregador/actions.ts`, `local-dialog.tsx`, `relatorios/page.tsx`, `cadastros/page.tsx`, `KanbanBoard`, `EditEntregaView`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `kanban-board.tsx`, `utils.ts`, `database.ts`, `local-dialog.tsx`, `cadastros/page.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Button()` connect `kanban-board.tsx` to `database.ts`, `local-dialog.tsx`, `cn`, `relatorios/page.tsx`, `cadastros/page.tsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _161 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `entregador/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1032258064516129 - nodes in this community are weakly interconnected._
- **Should `kanban-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09860443834362846 - nodes in this community are weakly interconnected._
- **Should `database.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06207482993197279 - nodes in this community are weakly interconnected._