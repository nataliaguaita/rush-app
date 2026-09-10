# Graph Report - rush-app  (2026-09-10)

## Corpus Check
- 142 files · ~56,838 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 786 nodes · 1863 edges · 66 communities (36 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aeb7f6cb`
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
- kanban-board.tsx
- entregador/actions.ts
- Design System & UX/UI Master Guide
- dropdown-menu.tsx
- relatorios/page.tsx
- NovaEntregaGrupoForm
- createClient
- Arquitetura
- manifest.json
- cn
- app/layout.tsx
- toast.tsx
- seed/route.ts
- CLAUDE.md
- callback/route.ts
- entregador-nav.tsx
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
- Profile
- package.json
- scripts
- NovoClientePage
- dashboard/layout.tsx
- jest.config.js
- eslint
- utils.ts
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- sheet.tsx
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- client.ts
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
- `handleSubmit()` --calls--> `createUser()`  [EXTRACTED]
  src/app/dashboard/cadastros/cadastro-dialog.tsx → src/app/dashboard/cadastros/actions.ts
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `addEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/add-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `updateEndereco()`  [EXTRACTED]
  src/app/dashboard/clientes/[id]/edit-endereco-form.tsx → src/app/dashboard/clientes/actions.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts

## Import Cycles
- None detected.

## Communities (66 total, 24 thin omitted)

### Community 0 - "cadastro-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.07
Nodes (34): ClienteDetailPage(), handleDeleteEndereco(), darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), pendencyBadges() (+26 more)

### Community 2 - "database.ts"
Cohesion: 0.18
Nodes (11): KanbanBoardProps, VisualItem, Database, DeliveryAction, Endereco, Entrega, EntregaFoto, EntregaWithRelations (+3 more)

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
Nodes (13): @commitlint/cli, husky, devDependencies, @commitlint/cli, husky, jest, @testing-library/dom, @types/react-dom (+5 more)

### Community 7 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "kanban-board.tsx"
Cohesion: 0.09
Nodes (57): createUser(), updateProfile(), AddEnderecoForm(), handleSubmit(), EditEnderecoForm(), handleSubmit(), EntregaResumo, OrdemEntregas (+49 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.09
Nodes (29): confirmarRetornoEntrega(), copiarFotoParaEntregas(), iniciarEntrega(), registrarEntrega(), registrarRecusa(), removerFotosEntrega(), tryCalculateRouteDistance(), uploadFotoEntrega() (+21 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.11
Nodes (9): HeatmapCard(), brl, computeCoreStats(), HeatmapCard, pctChange(), RelatorioEntrega, RelatoriosPage(), DeliveryPeriod (+1 more)

### Community 13 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 14 - "createClient"
Cohesion: 0.05
Nodes (54): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), ClienteEditForm() (+46 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "cn"
Cohesion: 0.14
Nodes (18): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+10 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 20 - "seed/route.ts"
Cohesion: 0.40
Nodes (5): getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS

### Community 23 - "entregador-nav.tsx"
Cohesion: 0.26
Nodes (8): EntregadorLayout(), logout(), EntregadorBottomNav(), EntregadorHeader(), links, mockedLogout, mockedUsePathname, profile

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (11): NovaEntregaForm(), NovaEntregaPage(), OpenGroup, clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill (+3 more)

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "sidebar-nav.tsx"
Cohesion: 0.32
Nodes (5): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle()

### Community 37 - "Profile"
Cohesion: 0.28
Nodes (7): PesquisarEntregaDialogProps, AppShell(), profile, Sheet(), SheetContent(), SheetTitle(), Profile

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 40 - "NovoClientePage"
Cohesion: 0.40
Nodes (4): emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

### Community 41 - "dashboard/layout.tsx"
Cohesion: 0.32
Nodes (3): DashboardLayout(), Home(), Spinner()

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 44 - "utils.ts"
Cohesion: 0.25
Nodes (6): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), TITLE_CASE_LOWERCASE_WORDS

### Community 48 - "sheet.tsx"
Cohesion: 0.25
Nodes (4): SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay()

### Community 52 - "client.ts"
Cohesion: 0.16
Nodes (17): EditProfileDialog(), handleSubmit(), CadastrosPage(), Filtro, ClientesPage(), Filtro, NovaEntregaGrupoPage(), LocaisPage() (+9 more)

### Community 63 - "sidebar-nav.test.tsx"
Cohesion: 0.29
Nodes (5): SidebarNav(), adminProfile, mockedLogout, mockedUsePathname, vendedorProfile

## Knowledge Gaps
- **206 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 315 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `dashboard/page.tsx`, `PesquisarEntregaDialog`, `kanban-board.tsx`, `dashboard/layout.tsx`, `entregador/actions.ts`, `relatorios/page.tsx`, `client.ts`, `entregador-nav.tsx`, `nova-entrega-form.test.tsx`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dashboard/page.tsx`, `sidebar-nav.tsx`, `Profile`, `kanban-board.tsx`, `dashboard/layout.tsx`, `dropdown-menu.tsx`, `utils.ts`, `sheet.tsx`, `toast.tsx`, `client.ts`, `entregador-nav.tsx`, `sidebar-nav.test.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Button()` connect `kanban-board.tsx` to `dashboard/page.tsx`, `sidebar-nav.tsx`, `Profile`, `relatorios/page.tsx`, `sheet.tsx`, `cn`, `toast.tsx`, `client.ts`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06753246753246753 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._