# Graph Report - rush-app  (2026-09-10)

## Corpus Check
- 144 files · ~58,039 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 791 nodes · 1875 edges · 62 communities (34 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b626cfd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cadastro-dialog.test.tsx
- dashboard/page.tsx
- database.ts
- create-user/route.ts
- dependencies
- compilerOptions
- devDependencies
- components.json
- clientes/[id]/page.tsx
- entregas/[id]/page.tsx
- Design System & UX/UI Master Guide
- cn
- relatorios/page.tsx
- NovaEntregaGrupoForm
- createClient
- Arquitetura
- manifest.json
- kanban-board.tsx
- app/layout.tsx
- EditEntregaView
- seed/route.ts
- CLAUDE.md
- Profile
- delete-endereco/route.ts
- RelatoriosPage
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- eslint-config-next
- PesquisarEntregaDialog
- sidebar-nav.tsx
- package.json
- scripts
- NovoClientePage
- jest.config.js
- eslint
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- app-shell.tsx
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- local-dialog.test.tsx
- @types/node
- check-security-lint.mjs
- @commitlint/config-conventional
- dotenv
- @playwright/test
- eslint-plugin-security
- @types/react
- sidebar-nav.test.tsx
- jest-environment-jsdom
- @types/leaflet

## God Nodes (most connected - your core abstractions)
1. `cn()` - 109 edges
2. `createClient()` - 81 edges
3. `Button()` - 36 edges
4. `formatOrderNumber()` - 26 edges
5. `Input()` - 25 edges
6. `Card()` - 20 edges
7. `CardContent()` - 20 edges
8. `toTitleCase()` - 20 edges
9. `Label()` - 17 edges
10. `Profile` - 17 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `createUser()`  [EXTRACTED]
  src/app/dashboard/cadastros/cadastro-dialog.tsx → src/app/dashboard/cadastros/actions.ts
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `ClientesPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/clientes/page.tsx → src/lib/supabase/client.ts
- `updateEntregaStatus()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (62 total, 22 thin omitted)

### Community 0 - "cadastro-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.08
Nodes (32): ClienteDetailPage(), handleDeleteEndereco(), EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp(), CardPreview(), GroupCardContent() (+24 more)

### Community 2 - "database.ts"
Cohesion: 0.25
Nodes (7): Database, DeliveryAction, Endereco, EntregaFoto, ReceiverRole, RotaDiaria, UserRole

### Community 3 - "create-user/route.ts"
Cohesion: 0.22
Nodes (14): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, INVALID_CREDENTIALS, POST() (+6 more)

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

### Community 8 - "clientes/[id]/page.tsx"
Cohesion: 0.10
Nodes (50): EditProfileDialog(), handleSubmit(), CadastrosPage(), Filtro, AddEnderecoForm(), EditEnderecoForm(), EntregaResumo, OrdemEntregas (+42 more)

### Community 9 - "entregas/[id]/page.tsx"
Cohesion: 0.09
Nodes (38): actionLabels, confirmarRetornoEntrega(), copiarFotoParaEntregas(), iniciarEntrega(), registrarEntrega(), registrarRecusa(), removerFotosEntrega(), tryCalculateRouteDistance() (+30 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "cn"
Cohesion: 0.06
Nodes (38): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+30 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.16
Nodes (6): HeatmapCard(), brl, HeatmapCard, RelatorioEntrega, DeliveryPeriod, DeliveryStatus

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 14 - "createClient"
Cohesion: 0.06
Nodes (44): createUser(), updateProfile(), addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente() (+36 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "kanban-board.tsx"
Cohesion: 0.09
Nodes (25): applyAddressChange(), applyRouteChange(), assignEntregador(), confirmarRetorno(), persistColumnState(), releaseRoute(), updateEntregaStatus(), AssignEntregadorSelect() (+17 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "EditEntregaView"
Cohesion: 0.28
Nodes (5): cancelEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 23 - "Profile"
Cohesion: 0.23
Nodes (10): PesquisarEntregaDialogProps, EntregadorLayout(), logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname (+2 more)

### Community 25 - "RelatoriosPage"
Cohesion: 0.25
Nodes (3): computeCoreStats(), pctChange(), RelatoriosPage()

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.10
Nodes (10): NovaEntregaForm(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill, Select() (+2 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 40 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "app-shell.tsx"
Cohesion: 0.17
Nodes (9): AppShell(), profile, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+1 more)

### Community 52 - "local-dialog.test.tsx"
Cohesion: 0.17
Nodes (7): field(), fillRequired(), mockedCreateLocal, mockedUpdateLocal, mockedUseCep, PointerEventPolyfill, LocalFrequente

### Community 63 - "sidebar-nav.test.tsx"
Cohesion: 0.29
Nodes (5): SidebarNav(), adminProfile, mockedLogout, mockedUsePathname, vendedorProfile

## Knowledge Gaps
- **209 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+204 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 318 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `dashboard/page.tsx`, `PesquisarEntregaDialog`, `clientes/[id]/page.tsx`, `entregas/[id]/page.tsx`, `relatorios/page.tsx`, `kanban-board.tsx`, `EditEntregaView`, `Profile`, `RelatoriosPage`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dashboard/page.tsx`, `sidebar-nav.tsx`, `clientes/[id]/page.tsx`, `entregas/[id]/page.tsx`, `createClient`, `app-shell.tsx`, `kanban-board.tsx`, `Profile`, `sidebar-nav.test.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Button()` connect `clientes/[id]/page.tsx` to `dashboard/page.tsx`, `sidebar-nav.tsx`, `entregas/[id]/page.tsx`, `cn`, `relatorios/page.tsx`, `createClient`, `app-shell.tsx`, `kanban-board.tsx`, `Profile`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _209 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08055152394775036 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._