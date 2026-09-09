# Graph Report - rush-app  (2026-09-09)

## Corpus Check
- 141 files · ~56,630 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 781 nodes · 1859 edges · 64 communities (34 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `109454dd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pesquisar-entrega-dialog.tsx
- status.ts
- database.ts
- utils.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- button.tsx
- clientes/[id]/page.tsx
- Design System & UX/UI Master Guide
- clientes/actions.ts
- relatorios/page.tsx
- NovaEntregaGrupoForm
- kanban-board.tsx
- Arquitetura
- manifest.json
- cn
- app/layout.tsx
- cliente-edit-form.test.tsx
- seed/route.ts
- CLAUDE.md
- callback/route.ts
- Profile
- delete-endereco/route.ts
- cleanup/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- eslint-config-next
- PesquisarEntregaDialog
- sidebar-nav.tsx
- local-dialog.test.tsx
- package.json
- scripts
- NovoClientePage
- createClient
- jest.config.js
- eslint
- husky
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- app-shell.tsx
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- nova-grupo/page.tsx
- @types/node
- @types/react-dom
- dashboard/layout.tsx
- dotenv
- @playwright/test
- @testing-library/dom
- @types/react
- sidebar-nav.test.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 109 edges
2. `createClient()` - 83 edges
3. `Button()` - 36 edges
4. `formatOrderNumber()` - 26 edges
5. `Input()` - 25 edges
6. `Card()` - 20 edges
7. `CardContent()` - 20 edges
8. `toTitleCase()` - 20 edges
9. `Label()` - 17 edges
10. `Profile` - 17 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts
- `SheetHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts
- `SheetFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts
- `SheetDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (64 total, 24 thin omitted)

### Community 0 - "pesquisar-entrega-dialog.tsx"
Cohesion: 0.13
Nodes (17): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), mockedCreateUser, Select() (+9 more)

### Community 1 - "status.ts"
Cohesion: 0.16
Nodes (12): StaleEntregasBanner(), StatusBadge(), mockedUseStaleEntregas, mockedCreateClient, sampleEntrega, StaleEntrega, useStaleEntregas(), EntregaStatus (+4 more)

### Community 2 - "database.ts"
Cohesion: 0.25
Nodes (8): Cliente, ClienteWithEnderecos, Database, DeliveryAction, Endereco, EntregaFoto, RotaDiaria, UserRole

### Community 3 - "utils.ts"
Cohesion: 0.26
Nodes (12): getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient(), POST(), isValidUsername(), normalizeUsername() (+4 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (47): @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, gsap (+39 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "devDependencies"
Cohesion: 0.15
Nodes (13): @commitlint/cli, @commitlint/config-conventional, jest-environment-jsdom, devDependencies, @commitlint/cli, @commitlint/config-conventional, jest, jest-environment-jsdom (+5 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "button.tsx"
Cohesion: 0.12
Nodes (26): AddEnderecoForm(), EditEnderecoForm(), EnderecoCard(), EnderecoForm, darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa() (+18 more)

### Community 9 - "clientes/[id]/page.tsx"
Cohesion: 0.07
Nodes (61): Filtro, EntregaResumo, OrdemEntregas, Filtro, assignEntregador(), AssignEntregadorSelect(), handleAssign(), actionLabels (+53 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "clientes/actions.ts"
Cohesion: 0.23
Nodes (10): addEndereco(), createCliente(), createClienteMultiEnderecos(), geocodeExistingAddresses(), updateEndereco(), handleSubmit(), handleSubmit(), CreateEntregaGrupoParams (+2 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.11
Nodes (9): HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange(), RelatorioEntrega, RelatoriosPage(), DeliveryPeriod (+1 more)

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.18
Nodes (9): createEntregaGrupo(), DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit() (+1 more)

### Community 14 - "kanban-board.tsx"
Cohesion: 0.06
Nodes (37): applyAddressChange(), applyRouteChange(), cancelEntrega(), persistColumnState(), releaseRoute(), updateEntrega(), EditEntregaView(), handleCancelEntrega() (+29 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "cn"
Cohesion: 0.06
Nodes (38): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+30 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "cliente-edit-form.test.tsx"
Cohesion: 0.28
Nodes (8): updateCliente(), ClienteEditForm(), handleSubmit(), cliente, mockedUpdateCliente, Select(), handleSelect(), SelectItem()

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 23 - "Profile"
Cohesion: 0.28
Nodes (9): PesquisarEntregaDialogProps, logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname, profile (+1 more)

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (12): createEntrega(), NovaEntregaForm(), NovaEntregaPage(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega (+4 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 37 - "local-dialog.test.tsx"
Cohesion: 0.15
Nodes (12): createLocal(), LocalFormData, readLocalForm(), updateLocal(), LocalDialog(), handleSubmit(), field(), fillRequired() (+4 more)

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
Cohesion: 0.11
Nodes (16): CadastrosPage(), deleteEndereco(), ClienteDetailPage(), handleDeleteEndereco(), ClientesPage(), confirmarRetorno(), updateEntregaStatus(), EntregasPage() (+8 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "app-shell.tsx"
Cohesion: 0.17
Nodes (9): AppShell(), profile, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+1 more)

### Community 63 - "sidebar-nav.test.tsx"
Cohesion: 0.29
Nodes (5): SidebarNav(), adminProfile, mockedLogout, mockedUsePathname, vendedorProfile

## Knowledge Gaps
- **203 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+198 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 312 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `pesquisar-entrega-dialog.tsx`, `PesquisarEntregaDialog`, `status.ts`, `local-dialog.test.tsx`, `button.tsx`, `clientes/[id]/page.tsx`, `clientes/actions.ts`, `relatorios/page.tsx`, `NovaEntregaGrupoForm`, `kanban-board.tsx`, `cliente-edit-form.test.tsx`, `nova-grupo/page.tsx`, `Profile`, `dashboard/layout.tsx`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `pesquisar-entrega-dialog.tsx`, `status.ts`, `sidebar-nav.tsx`, `utils.ts`, `button.tsx`, `clientes/[id]/page.tsx`, `kanban-board.tsx`, `app-shell.tsx`, `dashboard/layout.tsx`, `Profile`, `sidebar-nav.test.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `pesquisar-entrega-dialog.tsx`, `sidebar-nav.tsx`, `clientes/[id]/page.tsx`, `relatorios/page.tsx`, `kanban-board.tsx`, `app-shell.tsx`, `cn`, `Profile`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _203 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pesquisar-entrega-dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._