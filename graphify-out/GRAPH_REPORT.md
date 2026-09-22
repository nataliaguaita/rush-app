# Graph Report - rush-app  (2026-09-22)

## Corpus Check
- 168 files · ~68,164 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 883 nodes · 2233 edges · 63 communities (36 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ed07fcd3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NovaEntregaGrupoForm
- utils.ts
- cadastro-dialog.test.tsx
- entregas/page.tsx
- dependencies
- compilerOptions
- devDependencies
- components.json
- dashboard/page.tsx
- createClient
- clsx
- @dnd-kit/sortable
- relatorios/page.tsx
- @dnd-kit/utilities
- create-user/route.ts
- Arquitetura
- manifest.json
- cn
- app/layout.tsx
- entregador-nav.tsx
- seed/route.ts
- CLAUDE.md
- leaflet
- geocode
- delete-endereco/route.ts
- login/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- leaflet.heat
- PesquisarEntregaDialog
- clientes/route.ts
- lucide-react
- package.json
- scripts
- NovoClientePage
- entregas/actions.ts
- jest.config.js
- next
- next-themes
- react
- react-dom
- sonner
- kanban-board.tsx
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- Profile
- database.ts
- check-security-lint.mjs
- cliente-edit-form.test.tsx
- sidebar-nav.tsx
- backfill-geocode.mjs
- local-dialog.test.tsx
- delete-cliente/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 101 edges
2. `createClient()` - 95 edges
3. `Button()` - 37 edges
4. `formatOrderNumber()` - 28 edges
5. `Input()` - 27 edges
6. `geocode()` - 25 edges
7. `Card()` - 23 edges
8. `CardContent()` - 23 edges
9. `toTitleCase()` - 23 edges
10. `Label()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `createUser()`  [EXTRACTED]
  src/app/dashboard/cadastros/cadastro-dialog.tsx → src/app/dashboard/cadastros/actions.ts
- `handleSubmit()` --calls--> `updateEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/edit-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `updateEntregaStatus()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `confirmarRetorno()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (63 total, 21 thin omitted)

### Community 0 - "NovaEntregaGrupoForm"
Cohesion: 0.18
Nodes (9): createEntregaGrupo(), DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit() (+1 more)

### Community 1 - "utils.ts"
Cohesion: 0.27
Nodes (9): addEndereco(), createCliente(), createClienteMultiEnderecos(), updateCliente(), updateEndereco(), handleSubmit(), handleSubmit(), TITLE_CASE_LOWERCASE_WORDS (+1 more)

### Community 2 - "cadastro-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 3 - "entregas/page.tsx"
Cohesion: 0.12
Nodes (13): EntregasPage(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+5 more)

### Community 4 - "dependencies"
Cohesion: 0.15
Nodes (13): @base-ui/react, class-variance-authority, date-fns, @dnd-kit/core, dependencies, @base-ui/react, class-variance-authority, date-fns (+5 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "devDependencies"
Cohesion: 0.04
Nodes (47): @commitlint/cli, @commitlint/config-conventional, dotenv, eslint, eslint-config-next, eslint-plugin-security, husky, jest-environment-jsdom (+39 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "dashboard/page.tsx"
Cohesion: 0.08
Nodes (29): deleteCliente(), deleteEndereco(), ClienteDetailPage(), handleDeleteCliente(), handleDeleteEndereco(), EntregaDetailPage(), copyAddress(), formatEndereco() (+21 more)

### Community 9 - "createClient"
Cohesion: 0.05
Nodes (67): CadastrosPage(), DashboardLayout(), LocaisPage(), applyConfirmarRetorno(), applyCopiarFoto(), applyIniciar(), applyOp(), applyRegistrarEntrega() (+59 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.10
Nodes (12): HeatmapCard(), renderHeat(), LeafletHeat, brl, computeCoreStats(), HeatmapCard, pctChange(), RelatorioEntrega (+4 more)

### Community 14 - "create-user/route.ts"
Cohesion: 0.34
Nodes (10): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, isValidUsername(), normalizeUsername() (+2 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (30): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+22 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "cn"
Cohesion: 0.12
Nodes (23): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+15 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "entregador-nav.tsx"
Cohesion: 0.16
Nodes (12): logout(), EntregadorBottomNav(), EntregadorHeader(), links, SidebarNav(), mockedLogout, mockedUsePathname, profile (+4 more)

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 23 - "geocode"
Cohesion: 0.19
Nodes (10): geocodeExistingAddresses(), EditEnderecoForm(), handleSubmit(), EnderecoCard(), CreateEntregaGrupoParams, DestinatarioData, buscarNominatim(), geocode() (+2 more)

### Community 25 - "login/route.ts"
Cohesion: 0.43
Nodes (5): getAdminClient(), INVALID_CREDENTIALS, POST(), GET(), createClient()

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (11): createEntrega(), NovaEntregaForm(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill (+3 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "clientes/route.ts"
Cohesion: 0.16
Nodes (14): CIDADES_ATENDIDAS, ClienteExterno, getAdminClient(), mesmoEndereco(), POST(), safeEqual(), sleep(), soDigitos() (+6 more)

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
Cohesion: 0.07
Nodes (27): applyAddressChange(), applyRouteChange(), assignEntregador(), cancelEntrega(), confirmarRetorno(), FinalizacaoPainel, finalizarPeloPainel(), persistColumnState() (+19 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "kanban-board.tsx"
Cohesion: 0.09
Nodes (62): createUser(), updateProfile(), EditProfileDialog(), handleSubmit(), AddEnderecoForm(), ClienteEditForm(), EntregaResumo, OrdemEntregas (+54 more)

### Community 52 - "Profile"
Cohesion: 0.15
Nodes (11): PesquisarEntregaDialogProps, AppShell(), profile, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+3 more)

### Community 53 - "database.ts"
Cohesion: 0.07
Nodes (51): Filtro, ClienteResumo, ClientesPage(), Filtro, darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa() (+43 more)

### Community 59 - "cliente-edit-form.test.tsx"
Cohesion: 0.40
Nodes (5): cliente, mockedUpdateCliente, Select(), handleSelect(), SelectItem()

### Community 62 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 63 - "backfill-geocode.mjs"
Cohesion: 0.67
Nodes (3): buscarNominatim(), geocode(), supabase

### Community 64 - "local-dialog.test.tsx"
Cohesion: 0.15
Nodes (12): createLocal(), LocalFormData, readLocalForm(), updateLocal(), LocalDialog(), handleSubmit(), field(), fillRequired() (+4 more)

## Knowledge Gaps
- **220 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+215 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 325 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `NovaEntregaGrupoForm`, `utils.ts`, `PesquisarEntregaDialog`, `entregas/page.tsx`, `local-dialog.test.tsx`, `dashboard/page.tsx`, `entregas/actions.ts`, `relatorios/page.tsx`, `kanban-board.tsx`, `entregador-nav.tsx`, `database.ts`, `geocode`, `sidebar-nav.tsx`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `utils.ts`, `entregas/page.tsx`, `dashboard/page.tsx`, `createClient`, `kanban-board.tsx`, `entregador-nav.tsx`, `Profile`, `database.ts`, `sidebar-nav.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `geocode()` connect `geocode` to `NovaEntregaGrupoForm`, `utils.ts`, `clientes/route.ts`, `local-dialog.test.tsx`, `entregas/actions.ts`, `database.ts`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _220 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `entregas/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._