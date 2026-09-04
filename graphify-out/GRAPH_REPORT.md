# Graph Report - rush-app  (2026-09-04)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 560 nodes · 1401 edges · 30 communities (23 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6bd7c26a`
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
- cadastro-dialog.tsx
- cn
- dropdown-menu.tsx
- username.ts
- toast.tsx
- NovaEntregaGrupoForm
- NovaEntregaForm
- sheet.tsx
- manifest.json
- EntregaGroupCard
- app/layout.tsx
- PesquisarEntregaDialog
- seed/route.ts
- tabs.tsx
- callback/route.ts
- EntregaDetailPage
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
8. `SelectContent()` - 16 edges
9. `SelectItem()` - 16 edges
10. `SelectTrigger()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `ClientesPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/clientes/page.tsx → src/lib/supabase/client.ts
- `CardPreview()` --calls--> `formatOrderNumber()`  [EXTRACTED]
  src/app/dashboard/entregas/kanban-board.tsx → src/lib/status.ts
- `handleRecusarBatch()` --calls--> `registrarRecusa()`  [EXTRACTED]
  src/app/entregador/entrega-group-card.tsx → src/app/entregador/actions.ts
- `TableCaption()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/table.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (30 total, 6 thin omitted)

### Community 0 - "kanban-board.tsx"
Cohesion: 0.07
Nodes (59): CadastrosPage(), Filtro, OrdemEntregas, ClientesPage(), Filtro, CardPreview(), haversine(), KanbanBoardProps (+51 more)

### Community 1 - "entregas/[id]/page.tsx"
Cohesion: 0.12
Nodes (34): AddEnderecoForm(), handleSubmit(), EnderecoCard(), EnderecoForm, actionLabels, GroupCardContent(), SortableCard(), Destinatario (+26 more)

### Community 2 - "createClient"
Cohesion: 0.05
Nodes (46): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), ClienteEditForm() (+38 more)

### Community 3 - "database.ts"
Cohesion: 0.06
Nodes (30): NovaEntregaGrupoPage(), DashboardLayout(), EntregadorLayout(), logout(), brl, RelatoriosPage(), AppShell(), EntregadorBottomNav() (+22 more)

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

### Community 8 - "cadastro-dialog.tsx"
Cohesion: 0.19
Nodes (14): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), Dialog(), DialogContent() (+6 more)

### Community 9 - "cn"
Cohesion: 0.16
Nodes (16): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+8 more)

### Community 10 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 11 - "username.ts"
Cohesion: 0.33
Nodes (10): getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient(), POST(), isValidUsername(), normalizeUsername() (+2 more)

### Community 12 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.21
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 14 - "NovaEntregaForm"
Cohesion: 0.17
Nodes (3): NovaEntregaForm(), NovaEntregaPage(), OpenGroup

### Community 15 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "EntregaGroupCard"
Cohesion: 0.28
Nodes (6): EntregaGroupCard(), compressImage(), handleFoto(), handleIniciar(), handleRecusarBatch(), openNavigation()

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "PesquisarEntregaDialog"
Cohesion: 0.38
Nodes (5): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), selectCliente()

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 21 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 23 - "EntregaDetailPage"
Cohesion: 0.67
Nodes (4): EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp()

## Knowledge Gaps
- **127 isolated node(s):** `Filtro`, `OrdemEntregas`, `Filtro`, `KanbanBoardProps`, `VisualItem` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 199 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `kanban-board.tsx`, `entregas/[id]/page.tsx`, `database.ts`, `cadastro-dialog.tsx`, `dropdown-menu.tsx`, `toast.tsx`, `sheet.tsx`, `tabs.tsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `kanban-board.tsx`, `entregas/[id]/page.tsx`, `database.ts`, `cadastro-dialog.tsx`, `NovaEntregaForm`, `EntregaDetailPage`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `Button()` connect `entregas/[id]/page.tsx` to `kanban-board.tsx`, `database.ts`, `cadastro-dialog.tsx`, `cn`, `toast.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `Filtro`, `OrdemEntregas`, `Filtro` to the rest of the system?**
  _127 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `kanban-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0655631288542681 - nodes in this community are weakly interconnected._
- **Should `entregas/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12202380952380952 - nodes in this community are weakly interconnected._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.053939714436805924 - nodes in this community are weakly interconnected._