# Graph Report - rush-app  (2026-09-11)

## Corpus Check
- 148 files · ~61,283 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 834 nodes · 2028 edges · 59 communities (30 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `44c9b136`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NovaEntregaGrupoForm
- dashboard/page.tsx
- cadastro-dialog.test.tsx
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
- utils.ts
- Arquitetura
- manifest.json
- local-dialog.test.tsx
- app/layout.tsx
- NovaEntregaForm
- seed/route.ts
- CLAUDE.md
- nova/page.tsx
- delete-endereco/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- nova-entrega-form.test.tsx
- Ideias e Alterações Pendentes
- eslint-config-next
- PesquisarEntregaDialog
- package.json
- scripts
- NovoClientePage
- createClient
- jest.config.js
- eslint
- lint-staged
- tailwindcss
- @tailwindcss/postcss
- Profile
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
10. `applyOp()` - 17 edges

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

## Communities (59 total, 23 thin omitted)

### Community 0 - "NovaEntregaGrupoForm"
Cohesion: 0.19
Nodes (8): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor(), handleSubmit(), parseValor()

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.08
Nodes (29): ClienteDetailPage(), handleDeleteEndereco(), EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp(), CardPreview(), GroupCardContent() (+21 more)

### Community 2 - "cadastro-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 3 - "cadastros/page.tsx"
Cohesion: 0.18
Nodes (17): EditProfileDialog(), handleSubmit(), CadastrosPage(), Filtro, ClienteResumo, ClientesPage(), Filtro, LocalDialog() (+9 more)

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
Nodes (64): createUser(), updateProfile(), AddEnderecoForm(), handleSubmit(), ClienteEditForm(), EditEnderecoForm(), handleSubmit(), EntregaResumo (+56 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.06
Nodes (62): applyConfirmarRetorno(), applyCopiarFoto(), applyIniciar(), applyOp(), applyRegistrarEntrega(), applyRegistrarRecusa(), applyRemoverFotos(), applyUploadFoto() (+54 more)

### Community 10 - "Design System & UX/UI Master Guide"
Cohesion: 0.33
Nodes (5): Claude Code System Prompt Instruction, Design Philosophy & Visual Tokens, Design System & UX/UI Master Guide, Stack Context, UX Components & Supabase States

### Community 11 - "cn"
Cohesion: 0.06
Nodes (41): EntregasPage(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+33 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.10
Nodes (12): HeatmapCard(), renderHeat(), LeafletHeat, brl, computeCoreStats(), HeatmapCard, pctChange(), RelatorioEntrega (+4 more)

### Community 13 - "database.ts"
Cohesion: 0.19
Nodes (10): NovaEntregaGrupoPage(), Cliente, ClienteWithEnderecos, Database, DeliveryAction, EntregaFoto, LocalFrequente, ReceiverRole (+2 more)

### Community 14 - "utils.ts"
Cohesion: 0.17
Nodes (16): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), VALID_ROLES, getAdminClient(), INVALID_CREDENTIALS (+8 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (29): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+21 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "local-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): field(), fillRequired(), mockedCreateLocal, mockedUpdateLocal, mockedUseCep, PointerEventPolyfill

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 20 - "seed/route.ts"
Cohesion: 0.27
Nodes (9): getAdmin(), POST(), getAdmin(), POST(), TEST_ADDRESSES, TEST_CLIENTS, TEST_USERS, rejectUnlessTestEndpointsAllowed() (+1 more)

### Community 22 - "nova/page.tsx"
Cohesion: 0.33
Nodes (4): EnderecoResumo, NovaEntregaPage(), OpenGroup, Endereco

### Community 30 - "nova-entrega-form.test.tsx"
Cohesion: 0.18
Nodes (8): clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill, Select(), handleSelect(), SelectItem()

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

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
Nodes (53): addEndereco(), createCliente(), createClienteMultiEnderecos(), deleteEndereco(), geocodeExistingAddresses(), updateCliente(), updateEndereco(), handleSubmit() (+45 more)

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "Profile"
Cohesion: 0.08
Nodes (28): PesquisarEntregaDialogProps, logout(), AppShell(), EntregadorBottomNav(), EntregadorHeader(), links, adminLinks, ctaLink (+20 more)

## Knowledge Gaps
- **217 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 321 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `dashboard/page.tsx`, `PesquisarEntregaDialog`, `cadastros/page.tsx`, `kanban-board.tsx`, `entregador/actions.ts`, `cn`, `relatorios/page.tsx`, `database.ts`, `Profile`, `nova/page.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dashboard/page.tsx`, `cadastros/page.tsx`, `kanban-board.tsx`, `createClient`, `utils.ts`, `Profile`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `Button()` connect `kanban-board.tsx` to `dashboard/page.tsx`, `cadastros/page.tsx`, `createClient`, `entregador/actions.ts`, `cn`, `relatorios/page.tsx`, `Profile`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0821256038647343 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._