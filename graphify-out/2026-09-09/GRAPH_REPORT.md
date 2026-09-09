# Graph Report - rush-app  (2026-09-09)

## Corpus Check
- 139 files · ~55,061 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 762 nodes · 1800 edges · 54 communities (27 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7e08acaa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- kanban-board.tsx
- client.ts
- database.ts
- create-user/route.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- entregas/[id]/page.tsx
- cn
- Design System & UX/UI Master Guide
- local-dialog.tsx
- relatorios/page.tsx
- NovaEntregaGrupoForm
- createClient
- Arquitetura
- manifest.json
- use-stale-entregas.ts
- app/layout.tsx
- NovoClientePage
- seed/route.ts
- CLAUDE.md
- callback/route.ts
- @commitlint/config-conventional
- delete-endereco/route.ts
- cleanup/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- eslint-config-next
- formatOrderNumber
- jest
- package.json
- scripts
- jest.config.js
- eslint
- husky
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
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

## Communities (54 total, 21 thin omitted)

### Community 0 - "kanban-board.tsx"
Cohesion: 0.07
Nodes (51): OrdemEntregas, haversine(), KanbanBoardProps, nearestNeighborSort(), optimizeVisualRoute(), VisualItem, confirmarRetornoEntrega(), copiarFotoParaEntregas() (+43 more)

### Community 1 - "client.ts"
Cohesion: 0.10
Nodes (22): CadastrosPage(), Filtro, ClientesPage(), Filtro, NovaEntregaGrupoPage(), LocalDialog(), LocaisPage(), field() (+14 more)

### Community 2 - "database.ts"
Cohesion: 0.05
Nodes (43): DashboardLayout(), EntregadorLayout(), logout(), AppShell(), EntregadorBottomNav(), EntregadorHeader(), links, adminLinks (+35 more)

### Community 3 - "create-user/route.ts"
Cohesion: 0.33
Nodes (10): getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient(), POST(), isValidUsername(), normalizeUsername() (+2 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (47): @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, gsap (+39 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "devDependencies"
Cohesion: 0.15
Nodes (13): @commitlint/cli, jest-environment-jsdom, devDependencies, @commitlint/cli, jest-environment-jsdom, @playwright/test, @testing-library/dom, @types/leaflet (+5 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "entregas/[id]/page.tsx"
Cohesion: 0.12
Nodes (33): AddEnderecoForm(), handleSubmit(), EditEnderecoForm(), handleSubmit(), EnderecoCard(), EnderecoForm, darBaixaDevolucao(), desfazerBaixaDevolucao() (+25 more)

### Community 9 - "cn"
Cohesion: 0.06
Nodes (37): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+29 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "local-dialog.tsx"
Cohesion: 0.12
Nodes (18): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), mockedCreateUser, Select() (+10 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.12
Nodes (6): HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange(), RelatoriosPage()

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 14 - "createClient"
Cohesion: 0.06
Nodes (53): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), ClienteEditForm() (+45 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "use-stale-entregas.ts"
Cohesion: 0.24
Nodes (7): StaleEntregasBanner(), mockedUseStaleEntregas, mockedCreateClient, sampleEntrega, StaleEntrega, useStaleEntregas(), STALE_STATUSES

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (11): NovaEntregaForm(), NovaEntregaPage(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill (+3 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "formatOrderNumber"
Cohesion: 0.10
Nodes (21): DevolucoesPage(), handleBaixa(), handleDesfazer(), pendencyBadges(), EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp() (+13 more)

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

## Knowledge Gaps
- **204 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+199 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 307 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `kanban-board.tsx`, `client.ts`, `formatOrderNumber`, `database.ts`, `entregas/[id]/page.tsx`, `local-dialog.tsx`, `relatorios/page.tsx`, `use-stale-entregas.ts`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `kanban-board.tsx`, `client.ts`, `database.ts`, `entregas/[id]/page.tsx`, `local-dialog.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `Button()` connect `entregas/[id]/page.tsx` to `kanban-board.tsx`, `client.ts`, `database.ts`, `cn`, `local-dialog.tsx`, `relatorios/page.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _204 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `kanban-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06846635367762129 - nodes in this community are weakly interconnected._
- **Should `client.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0957983193277311 - nodes in this community are weakly interconnected._
- **Should `database.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05446853516657853 - nodes in this community are weakly interconnected._