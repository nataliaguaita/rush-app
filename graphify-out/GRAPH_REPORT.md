# Graph Report - rush-app  (2026-10-22)

## Corpus Check
- 187 files · ~74,155 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 938 nodes · 2449 edges · 67 communities (40 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6cd448f7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- geocode
- NovaEntregaGrupoForm
- KanbanBoard
- cn
- dependencies
- compilerOptions
- devDependencies
- components.json
- nova-entrega-form.test.tsx
- entregador/actions.ts
- clsx
- @dnd-kit/sortable
- relatorios/page.tsx
- @dnd-kit/utilities
- schema.ts
- Arquitetura
- manifest.json
- entregas/[id]/page.tsx
- app/layout.tsx
- createClient
- dashboard/page.tsx
- CLAUDE.md
- leaflet
- EditEntregaView
- database.ts
- route-distance.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- entregas/page.tsx
- cliente-edit-form.test.tsx
- Ideias e Alterações Pendentes
- leaflet.heat
- PesquisarEntregaDialog
- clientes/route.ts
- lucide-react
- package.json
- scripts
- cadastro-dialog.test.tsx
- ClienteDetailPage
- jest.config.js
- next
- next-themes
- react
- react-dom
- sonner
- status.ts
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- assignEntregador
- backfill-rotas.mjs
- check-security-lint.mjs
- local-dialog.test.tsx
- entregador-nav.tsx
- backfill-geocode.mjs
- enderecos-sem-gps/page.tsx
- sw.js
- migrations.test.ts
- entregas/actions.ts
- NovoClientePage

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 104 edges
2. `cn()` - 101 edges
3. `Button()` - 37 edges
4. `formatOrderNumber()` - 30 edges
5. `Input()` - 28 edges
6. `geocode()` - 25 edges
7. `toTitleCase()` - 24 edges
8. `Card()` - 23 edges
9. `CardContent()` - 23 edges
10. `useUnsavedChanges()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `createUser()`  [EXTRACTED]
  src/app/dashboard/cadastros/cadastro-dialog.tsx → src/app/dashboard/cadastros/actions.ts
- `CadastrosPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/cadastros/page.tsx → src/lib/supabase/client.ts
- `confirmarRetorno()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/entregas/actions.ts → src/lib/supabase/client.ts
- `LocaisPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/dashboard/locais/page.tsx → src/lib/supabase/client.ts
- `DashboardPage()` --indirect_call--> `compareRouteOrder()`  [INFERRED]
  src/app/dashboard/page.tsx → src/lib/route-order.ts

## Import Cycles
- None detected.

## Communities (67 total, 21 thin omitted)

### Community 0 - "geocode"
Cohesion: 0.18
Nodes (13): addEndereco(), createCliente(), geocodeExistingAddresses(), updateEndereco(), handleSubmit(), handleSubmit(), createEntregaGrupo(), CreateEntregaGrupoParams (+5 more)

### Community 1 - "NovaEntregaGrupoForm"
Cohesion: 0.22
Nodes (6): DestinatarioRow(), handleClickOutside(), emptyDestinatario(), NovaEntregaGrupoForm(), addDestinatario(), formatValor()

### Community 2 - "KanbanBoard"
Cohesion: 0.16
Nodes (11): persistColumnState(), releaseRoute(), haversine(), KanbanBoard(), expandToEntregaIds(), handleDragEnd(), nearestNeighborSort(), optimizeVisualRoute() (+3 more)

### Community 3 - "cn"
Cohesion: 0.05
Nodes (44): AppShell(), profile, mockedUseTheme, ThemeToggle(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge() (+36 more)

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

### Community 8 - "nova-entrega-form.test.tsx"
Cohesion: 0.09
Nodes (15): NovaEntregaForm(), NovaEntregaPage(), load(), clienteComEndereco, clientes, clienteSemEndereco, mockedCreateEntrega, PointerEventPolyfill (+7 more)

### Community 9 - "entregador/actions.ts"
Cohesion: 0.07
Nodes (55): applyConfirmarRetorno(), applyCopiarFoto(), applyIniciar(), applyOp(), applyRegistrarEntrega(), applyRegistrarRecusa(), applyRemoverFotos(), applyUploadFoto() (+47 more)

### Community 12 - "relatorios/page.tsx"
Cohesion: 0.08
Nodes (16): HeatmapCard(), renderHeat(), LeafletHeat, EntregaConcluida, entregueNoPrazo(), intervaloMedianoEntreEntregas(), brl, CanceladasTable() (+8 more)

### Community 14 - "schema.ts"
Cohesion: 0.10
Nodes (29): getAdminClient(), POST(), VALID_ROLES, getAdminClient(), POST(), getAdminClient(), POST(), getAdminClient() (+21 more)

### Community 15 - "Arquitetura"
Cohesion: 0.06
Nodes (30): This is NOT the Next.js you know, Arquitetura, Autenticação e papéis, Convenção do repositório: `graphify`, Estrutura de pastas, Fluxo de status de uma entrega, Modelo de dados, Navegação por papel (+22 more)

### Community 16 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 17 - "entregas/[id]/page.tsx"
Cohesion: 0.09
Nodes (60): AddEnderecoForm(), ClienteEditForm(), EditEnderecoForm(), EntregaResumo, OrdemEntregas, EnderecoCard(), EnderecoForm, EnderecoPicker() (+52 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.28
Nodes (5): geistMono, inter, metadata, ThemeProvider(), Toaster()

### Community 19 - "createClient"
Cohesion: 0.16
Nodes (12): createUser(), updateProfile(), darBaixaDevolucao(), desfazerBaixaDevolucao(), DevolucoesPage(), handleBaixa(), handleDesfazer(), EntregaDevolucao (+4 more)

### Community 20 - "dashboard/page.tsx"
Cohesion: 0.16
Nodes (12): EntregaDetailPage(), copyAddress(), formatEndereco(), shareWhatsApp(), CardPreview(), GroupCardContent(), SortableCard(), DashboardPage() (+4 more)

### Community 23 - "EditEntregaView"
Cohesion: 0.28
Nodes (5): cancelEntrega(), EditEntregaView(), handleCancelEntrega(), handleSubmit(), parseValor()

### Community 24 - "database.ts"
Cohesion: 0.16
Nodes (14): KanbanBoardProps, VisualItem, DevolucoesEntregadorPage(), EntregaDevolucao, Badge(), badgeVariants, pendencyBadges(), Cliente (+6 more)

### Community 25 - "route-distance.ts"
Cohesion: 0.29
Nodes (8): applyRouteChange(), updateEntregaStatus(), ORIGIN_LAT, ORIGIN_LNG, calcRouteDistanceKm(), ordemRealizada(), SupabaseClient, tryCalculateRouteDistance()

### Community 29 - "entregas/page.tsx"
Cohesion: 0.21
Nodes (8): EntregasPage(), EntregaFinalizada, EntregasFinalizadasPage(), EntregadorPage(), readCache(), Skeleton(), Options, useRealtimeRefresh()

### Community 30 - "cliente-edit-form.test.tsx"
Cohesion: 0.29
Nodes (7): updateCliente(), handleSubmit(), cliente, mockedUpdateCliente, Select(), handleSelect(), SelectItem()

### Community 31 - "Ideias e Alterações Pendentes"
Cohesion: 0.40
Nodes (4): Ideias e Alterações Pendentes, Prioridade alta, Prioridade baixa / ideias soltas, Prioridade média

### Community 33 - "PesquisarEntregaDialog"
Cohesion: 0.12
Nodes (11): PesquisarEntregaDialog(), handleClear(), handleClienteKeyDown(), handleOpenChange(), loadClientes(), selectCliente(), mockBuilder(), builder (+3 more)

### Community 34 - "clientes/route.ts"
Cohesion: 0.16
Nodes (15): CIDADES_ATENDIDAS, ClienteExterno, getAdminClient(), mesmoEndereco(), POST(), safeEqual(), sleep(), soDigitos() (+7 more)

### Community 38 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{js,jsx,ts,tsx}, name, private, version, bash -c 'tsc --noEmit -p tsconfig.json, eslint --fix

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prepare, start, test, test:e2e (+1 more)

### Community 40 - "cadastro-dialog.test.tsx"
Cohesion: 0.18
Nodes (6): CadastroDialog(), handleSubmit(), mockedCreateUser, Select(), handleSelect(), SelectItem()

### Community 41 - "ClienteDetailPage"
Cohesion: 0.33
Nodes (5): deleteCliente(), deleteEndereco(), ClienteDetailPage(), handleDeleteCliente(), handleDeleteEndereco()

### Community 42 - "jest.config.js"
Cohesion: 0.50
Nodes (3): config, createJestConfig, nextJest

### Community 48 - "status.ts"
Cohesion: 0.16
Nodes (12): StaleEntregasBanner(), StatusBadge(), mockedUseStaleEntregas, mockedCreateClient, sampleEntrega, StaleEntrega, useStaleEntregas(), EntregaStatus (+4 more)

### Community 52 - "assignEntregador"
Cohesion: 0.67
Nodes (3): assignEntregador(), AssignEntregadorSelect(), handleAssign()

### Community 53 - "backfill-rotas.mjs"
Cohesion: 0.22
Nodes (6): comKm, DATA, DRY, FECHADAS, grupos, supabase

### Community 60 - "local-dialog.test.tsx"
Cohesion: 0.15
Nodes (11): createLocal(), LocalFormData, readLocalForm(), updateLocal(), handleSubmit(), field(), fillRequired(), mockedCreateLocal (+3 more)

### Community 62 - "entregador-nav.tsx"
Cohesion: 0.13
Nodes (20): PesquisarEntregaDialogProps, cachedProfile(), EntregadorLayout(), loadProfile(), logout(), EntregadorBottomNav(), EntregadorHeader(), links (+12 more)

### Community 63 - "backfill-geocode.mjs"
Cohesion: 0.67
Nodes (3): buscarNominatim(), geocode(), supabase

### Community 64 - "enderecos-sem-gps/page.tsx"
Cohesion: 0.10
Nodes (34): EditProfileDialog(), handleSubmit(), CadastrosPage(), Filtro, ClienteResumo, ClientesPage(), Filtro, AddressFields (+26 more)

### Community 69 - "entregas/actions.ts"
Cohesion: 0.18
Nodes (11): applyAddressChange(), confirmarRetorno(), createEntrega(), FinalizacaoPainel, finalizarPeloPainel(), resolveEnderecoId(), updateEntrega(), submit() (+3 more)

### Community 70 - "NovoClientePage"
Cohesion: 0.33
Nodes (5): createClienteMultiEnderecos(), emptyEndereco(), NovoClientePage(), addEndereco(), handleSubmit()

## Knowledge Gaps
- **234 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+229 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 348 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `geocode`, `KanbanBoard`, `nova-entrega-form.test.tsx`, `entregador/actions.ts`, `relatorios/page.tsx`, `entregas/[id]/page.tsx`, `dashboard/page.tsx`, `EditEntregaView`, `database.ts`, `route-distance.ts`, `entregas/page.tsx`, `cliente-edit-form.test.tsx`, `PesquisarEntregaDialog`, `ClienteDetailPage`, `status.ts`, `assignEntregador`, `local-dialog.test.tsx`, `entregador-nav.tsx`, `enderecos-sem-gps/page.tsx`, `entregas/actions.ts`, `NovoClientePage`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `enderecos-sem-gps/page.tsx`, `entregas/actions.ts`, `status.ts`, `entregas/[id]/page.tsx`, `createClient`, `database.ts`, `entregas/page.tsx`, `entregador-nav.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `DB_SCHEMA` connect `schema.ts` to `status.ts`, `clientes/route.ts`, `createClient`, `entregas/page.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _234 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05376972530683811 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._