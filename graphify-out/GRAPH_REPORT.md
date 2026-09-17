# Graph Report - rush-app  (2026-09-17)

## Corpus Check
- 156 files · ~63,717 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 861 nodes · 2080 edges · 67 communities (37 shown, 24 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c903c10`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NovaEntregaGrupoForm
- dashboard/page.tsx
- sheet.tsx
- spinner.tsx
- dependencies
- compilerOptions
- devDependencies
- components.json
- kanban-board.tsx
- entregador/actions.ts
- Design System & UX/UI Master Guide
- tabs.tsx
- database.ts
- entregas/page.tsx
- create-user/route.ts
- Arquitetura
- manifest.json
- cn
- app/layout.tsx
- entregador-nav.tsx
- seed/route.ts
- CLAUDE.md
- toast.tsx
- sidebar-nav.tsx
- delete-endereco/route.ts
- heatmap.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- client.ts
- Ideias e Alterações Pendentes
- eslint-config-next
- PesquisarEntregaDialog
- clientes/route.ts
- local-dialog.test.tsx
- package.json
- scripts
- NovoClientePage
- createClient
- jest.config.js
- eslint
- RelatoriosPage
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- cadastro-dialog.test.tsx
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- Profile
- @types/node
- check-security-lint.mjs
- @commitlint/config-conventional
- dotenv
- @playwright/test
- eslint-plugin-security
- @types/react
- backfill-geocode.mjs
- jest-environment-jsdom
- @types/leaflet
- delete-cliente/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 109 edges
2. `createClient()` - 85 edges
3. `Button()` - 36 edges
4. `formatOrderNumber()` - 28 edges
5. `Input()` - 25 edges
6. `Card()` - 21 edges
7. `CardContent()` - 21 edges
8. `toTitleCase()` - 20 edges
9. `geocode()` - 19 edges
10. `Profile` - 18 edges

## Surprising Connections (you probably didn't know these)
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `EntregasPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/page.tsx → src/lib/supabase/client.ts
- `LocaisPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/locais/page.tsx → src/lib/supabase/client.ts
- `DashboardPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/page.tsx → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (67 total, 24 thin omitted)

### Community 0 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.07
Nodes (34): darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), EntregaDevolucao, EntregaDetailPage(), copyAddress() (+26 more)

### Community 2 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

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
Nodes (60): AddEnderecoForm(), EditEnderecoForm(), EntregaResumo, OrdemEntregas, EnderecoCard(), EnderecoForm, actionLabels, haversine() (+52 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.06
Nodes (62): applyConfirmarRetorno(), applyCopiarFoto(), applyIniciar(), applyOp(), applyRegistrarEntrega(), applyRegistrarRecusa(), applyRemoverFotos(), applyUploadFoto() (+54 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 12 - "database.ts"
Cohesion: 0.14
Nodes (10): brl, RelatorioEntrega, Database, DeliveryAction, DeliveryPeriod, DeliveryStatus, EntregaFoto, RotaDiaria (+2 more)

### Community 13 - "entregas/page.tsx"
Cohesion: 0.12
Nodes (13): EntregasPage(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+5 more)

### Community 14 - "create-user/route.ts"
Cohesion: 0.20
Nodes (15): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+7 more)

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

### Community 19 - "entregador-nav.tsx"
Cohesion: 0.21
Nodes (8): EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname, profile, mockedUseTheme, ThemeToggle()

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 22 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 23 - "sidebar-nav.tsx"
Cohesion: 0.22
Nodes (9): logout(), adminLinks, ctaLink, SidebarNav(), vendedorLinks, adminProfile, mockedLogout, mockedUsePathname (+1 more)

### Community 25 - "heatmap.tsx"
Cohesion: 0.40
Nodes (4): HeatmapCard(), renderHeat(), LeafletHeat, HeatmapCard

### Community 30 - "client.ts"
Cohesion: 0.06
Nodes (33): CadastrosPage(), Filtro, ClienteResumo, ClientesPage(), Filtro, NovaEntregaGrupoPage(), load(), NovaEntregaForm() (+25 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "clientes/route.ts"
Cohesion: 0.26
Nodes (10): CIDADES_ATENDIDAS, ClienteExterno, getAdminClient(), POST(), safeEqual(), sleep(), consultaCep(), EnderecoTratado (+2 more)

### Community 37 - "local-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): field(), fillRequired(), mockedCreateLocal, mockedUpdateLocal, mockedUseCep, PointerEventPolyfill

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 40 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 41 - "createClient"
Cohesion: 0.06
Nodes (53): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteCliente(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco() (+45 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 44 - "RelatoriosPage"
Cohesion: 0.25
Nodes (3): computeCoreStats(), pctChange(), RelatoriosPage()

### Community 48 - "cadastro-dialog.test.tsx"
Cohesion: 0.14
Nodes (10): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), mockedCreateUser, Select() (+2 more)

### Community 52 - "Profile"
Cohesion: 0.33
Nodes (5): PesquisarEntregaDialogProps, DashboardLayout(), AppShell(), profile, Profile

### Community 63 - "backfill-geocode.mjs"
Cohesion: 0.67
Nodes (3): buscarNominatim(), geocode(), supabase

## Knowledge Gaps
- **221 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+216 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 325 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `dashboard/page.tsx`, `PesquisarEntregaDialog`, `spinner.tsx`, `kanban-board.tsx`, `entregador/actions.ts`, `database.ts`, `entregas/page.tsx`, `RelatoriosPage`, `cadastro-dialog.test.tsx`, `entregador-nav.tsx`, `Profile`, `sidebar-nav.tsx`, `client.ts`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dashboard/page.tsx`, `sheet.tsx`, `spinner.tsx`, `kanban-board.tsx`, `createClient`, `tabs.tsx`, `entregas/page.tsx`, `entregador-nav.tsx`, `toast.tsx`, `sidebar-nav.tsx`, `client.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `geocode()` connect `createClient` to `clientes/route.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _221 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07058001397624039 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._