# Graph Report - rush-app  (2026-09-10)

## Corpus Check
- 145 files · ~59,398 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 800 nodes · 1922 edges · 60 communities (32 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f75de02`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- local-dialog.test.tsx
- dashboard/page.tsx
- cadastro-dialog.test.tsx
- RelatoriosPage
- dependencies
- compilerOptions
- devDependencies
- components.json
- button.tsx
- kanban-board.tsx
- Design System & UX/UI Master Guide
- cn
- database.ts
- sidebar-nav.test.tsx
- create-user/route.ts
- Arquitetura
- manifest.json
- app/layout.tsx
- seed/route.ts
- CLAUDE.md
- Profile
- delete-endereco/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- eslint-config-next
- PesquisarEntregaDialog
- sidebar-nav.tsx
- heatmap.tsx
- package.json
- scripts
- NovoClientePage
- createClient
- jest.config.js
- eslint
- dashboard/layout.tsx
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- app-shell.tsx
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- @types/node
- check-security-lint.mjs
- @commitlint/config-conventional
- dotenv
- @playwright/test
- eslint-plugin-security
- @types/react
- jest-environment-jsdom
- @types/leaflet

## God Nodes (most connected - your core abstractions)
1. `cn()` - 109 edges
2. `createClient()` - 84 edges
3. `Button()` - 36 edges
4. `formatOrderNumber()` - 28 edges
5. `Input()` - 25 edges
6. `Card()` - 21 edges
7. `CardContent()` - 21 edges
8. `toTitleCase()` - 20 edges
9. `Profile` - 18 edges
10. `Badge()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `createUser()`  [EXTRACTED]
  src/app/dashboard/cadastros/cadastro-dialog.tsx → src/app/dashboard/cadastros/actions.ts
- `handleSubmit()` --calls--> `addEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/add-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `DashboardPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/page.tsx → src/lib/supabase/client.ts
- `EntregadorPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/entregador/page.tsx → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (60 total, 22 thin omitted)

### Community 0 - "local-dialog.test.tsx"
Cohesion: 0.08
Nodes (17): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor() (+9 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.07
Nodes (36): darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), EntregaDevolucao, EntregaDetailPage(), copyAddress() (+28 more)

### Community 2 - "cadastro-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 3 - "RelatoriosPage"
Cohesion: 0.25
Nodes (3): computeCoreStats(), pctChange(), RelatoriosPage()

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

### Community 8 - "button.tsx"
Cohesion: 0.12
Nodes (32): createUser(), updateProfile(), EditProfileDialog(), handleSubmit(), AddEnderecoForm(), handleSubmit(), EnderecoCard(), EnderecoForm (+24 more)

### Community 9 - "kanban-board.tsx"
Cohesion: 0.06
Nodes (67): Filtro, EntregaResumo, OrdemEntregas, ClienteResumo, Filtro, actionLabels, haversine(), KanbanBoardProps (+59 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "cn"
Cohesion: 0.05
Nodes (44): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+36 more)

### Community 12 - "database.ts"
Cohesion: 0.14
Nodes (10): brl, RelatorioEntrega, Database, DeliveryAction, DeliveryPeriod, DeliveryStatus, EntregaFoto, RotaDiaria (+2 more)

### Community 13 - "sidebar-nav.test.tsx"
Cohesion: 0.29
Nodes (5): SidebarNav(), adminProfile, mockedLogout, mockedUsePathname, vendedorProfile

### Community 14 - "create-user/route.ts"
Cohesion: 0.20
Nodes (15): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+7 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 23 - "Profile"
Cohesion: 0.21
Nodes (10): PesquisarEntregaDialogProps, EntregadorLayout(), logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname (+2 more)

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (13): NovaEntregaForm(), EnderecoResumo, NovaEntregaPage(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega (+5 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 37 - "heatmap.tsx"
Cohesion: 0.40
Nodes (4): HeatmapCard(), renderHeat(), LeafletHeat, HeatmapCard

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
Nodes (54): CadastrosPage(), addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco() (+46 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 44 - "dashboard/layout.tsx"
Cohesion: 0.32
Nodes (3): DashboardLayout(), Home(), Spinner()

### Community 48 - "app-shell.tsx"
Cohesion: 0.17
Nodes (9): AppShell(), profile, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+1 more)

## Knowledge Gaps
- **214 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+209 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 319 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `local-dialog.test.tsx`, `dashboard/page.tsx`, `PesquisarEntregaDialog`, `RelatoriosPage`, `button.tsx`, `kanban-board.tsx`, `cn`, `dashboard/layout.tsx`, `database.ts`, `Profile`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dashboard/page.tsx`, `sidebar-nav.tsx`, `button.tsx`, `kanban-board.tsx`, `createClient`, `dashboard/layout.tsx`, `sidebar-nav.test.tsx`, `app-shell.tsx`, `Profile`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `dashboard/page.tsx`, `sidebar-nav.tsx`, `kanban-board.tsx`, `cn`, `database.ts`, `app-shell.tsx`, `Profile`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _214 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `local-dialog.test.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07586206896551724 - nodes in this community are weakly interconnected._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06766917293233082 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._