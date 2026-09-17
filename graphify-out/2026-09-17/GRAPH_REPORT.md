# Graph Report - rush-app  (2026-09-17)

## Corpus Check
- 153 files · ~62,857 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 851 nodes · 2055 edges · 66 communities (36 shown, 24 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7765aa81`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NovaEntregaGrupoForm
- use-stale-entregas.ts
- button.tsx
- cadastros/page.tsx
- dependencies
- compilerOptions
- devDependencies
- components.json
- kanban-board.tsx
- entregador/actions.ts
- Design System & UX/UI Master Guide
- cn
- relatorios/page.tsx
- database.ts
- create-user/route.ts
- Arquitetura
- manifest.json
- entregas/page.tsx
- app/layout.tsx
- utils.ts
- seed/route.ts
- CLAUDE.md
- toast.tsx
- entregador-nav.tsx
- delete-endereco/route.ts
- heatmap.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- eslint-config-next
- PesquisarEntregaDialog
- clientes/route.ts
- NovaEntregaForm
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
- Profile
- @testing-library/jest-dom
- @testing-library/react
- @types/jest
- nova/page.tsx
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 109 edges
2. `createClient()` - 84 edges
3. `Button()` - 36 edges
4. `formatOrderNumber()` - 28 edges
5. `Input()` - 25 edges
6. `Card()` - 21 edges
7. `CardContent()` - 21 edges
8. `toTitleCase()` - 20 edges
9. `geocode()` - 18 edges
10. `Profile` - 18 edges

## Surprising Connections (you probably didn't know these)
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `createClienteMultiEnderecos()`  [EXTRACTED]
  src/app/dashboard/clientes/novo/page.tsx → src/app/dashboard/clientes/actions.ts
- `ClientesPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/clientes/page.tsx → src/lib/supabase/client.ts
- `EntregasPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/page.tsx → src/lib/supabase/client.ts
- `LocaisPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/locais/page.tsx → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (66 total, 24 thin omitted)

### Community 0 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 1 - "use-stale-entregas.ts"
Cohesion: 0.24
Nodes (7): StaleEntregasBanner(), mockedUseStaleEntregas, mockedCreateClient, sampleEntrega, StaleEntrega, useStaleEntregas(), STALE_STATUSES

### Community 2 - "button.tsx"
Cohesion: 0.07
Nodes (39): createUser(), updateProfile(), CadastroDialog(), handleSubmit(), EditProfileDialog(), handleSubmit(), mockedCreateUser, Select() (+31 more)

### Community 3 - "cadastros/page.tsx"
Cohesion: 0.23
Nodes (14): CadastrosPage(), Filtro, ClienteResumo, ClientesPage(), Filtro, LocaisPage(), Table(), TableBody() (+6 more)

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
Cohesion: 0.07
Nodes (62): ClienteDetailPage(), EntregaResumo, OrdemEntregas, EntregaDevolucao, actionLabels, EntregaDetailPage(), copyAddress(), formatEndereco() (+54 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.06
Nodes (61): applyConfirmarRetorno(), applyCopiarFoto(), applyIniciar(), applyOp(), applyRegistrarEntrega(), applyRegistrarRecusa(), applyRemoverFotos(), applyUploadFoto() (+53 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "cn"
Cohesion: 0.12
Nodes (23): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+15 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.22
Nodes (4): brl, RelatorioEntrega, DeliveryPeriod, DeliveryStatus

### Community 13 - "database.ts"
Cohesion: 0.25
Nodes (7): Database, DeliveryAction, EntregaFoto, ReceiverRole, RotaDiaria, RouteChangeType, UserRole

### Community 14 - "create-user/route.ts"
Cohesion: 0.20
Nodes (15): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+7 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "entregas/page.tsx"
Cohesion: 0.13
Nodes (12): EntregasPage(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+4 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "utils.ts"
Cohesion: 0.24
Nodes (6): adminLinks, ctaLink, vendedorLinks, mockedUseTheme, ThemeToggle(), TITLE_CASE_LOWERCASE_WORDS

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 22 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 23 - "entregador-nav.tsx"
Cohesion: 0.16
Nodes (12): logout(), EntregadorBottomNav(), EntregadorHeader(), links, SidebarNav(), mockedLogout, mockedUsePathname, profile (+4 more)

### Community 25 - "heatmap.tsx"
Cohesion: 0.40
Nodes (4): HeatmapCard(), renderHeat(), LeafletHeat, HeatmapCard

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.18
Nodes (8): clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill, Select(), handleSelect(), SelectItem()

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "clientes/route.ts"
Cohesion: 0.27
Nodes (9): CIDADES_ATENDIDAS, ClienteExterno, getAdminClient(), POST(), safeEqual(), consultaCep(), EnderecoTratado, parseTextoEndereco() (+1 more)

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
Cohesion: 0.05
Nodes (58): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), handleSubmit() (+50 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 44 - "RelatoriosPage"
Cohesion: 0.25
Nodes (3): computeCoreStats(), pctChange(), RelatoriosPage()

### Community 48 - "Profile"
Cohesion: 0.15
Nodes (11): PesquisarEntregaDialogProps, AppShell(), profile, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+3 more)

### Community 52 - "nova/page.tsx"
Cohesion: 0.33
Nodes (4): EnderecoResumo, NovaEntregaPage(), OpenGroup, Endereco

## Knowledge Gaps
- **222 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+217 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 327 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `PesquisarEntregaDialog`, `button.tsx`, `cadastros/page.tsx`, `use-stale-entregas.ts`, `kanban-board.tsx`, `entregador/actions.ts`, `relatorios/page.tsx`, `RelatoriosPage`, `entregas/page.tsx`, `nova/page.tsx`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `button.tsx`, `cadastros/page.tsx`, `kanban-board.tsx`, `createClient`, `Profile`, `entregas/page.tsx`, `utils.ts`, `toast.tsx`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `cadastros/page.tsx`, `kanban-board.tsx`, `cn`, `relatorios/page.tsx`, `Profile`, `entregas/page.tsx`, `utils.ts`, `toast.tsx`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _222 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07283702213279677 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._