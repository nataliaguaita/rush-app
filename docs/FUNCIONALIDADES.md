# Funcionalidades

Organizado por papel de usuário (`profiles.role`). Cada seção lista a tela, o arquivo principal e o que ela faz.

## Admin

Acesso total: tudo do Vendedor, mais gestão de contas e relatórios.

| Tela | Rota | Arquivo | O que faz |
|---|---|---|---|
| Dashboard / Torre de Controle | `/dashboard` | `src/app/dashboard/page.tsx` | KPIs gerais, heatmap de entregas (`HeatmapCard`), visão consolidada do dia |
| Cadastros | `/dashboard/cadastros` | `src/app/dashboard/cadastros/page.tsx` | CRUD de usuários (vendedores e entregadores) — cria via `/api/admin/create-user`, edita via `/api/admin/update-user` |
| Relatórios | `/relatorios` | `src/app/relatorios/page.tsx` | KPIs por período, tabela por entregador (km rodado), ranking de clientes/bairros, exportação em PDF via impressão do navegador |
| Configurações | `/configuracoes` | `src/app/configuracoes/page.tsx` | Edição da própria conta |

## Vendedor / Despachante

| Tela | Rota | Arquivo | O que faz |
|---|---|---|---|
| Entregas (Kanban) | `/dashboard/entregas` | `src/app/dashboard/entregas/kanban-board.tsx` | Quadro kanban por status de entrega, com drag-and-drop (dnd-kit) para mudar status/atribuir entregador. Separa entregas liberadas das novas. |
| Nova Entrega | `/dashboard/entregas/nova` | `src/app/dashboard/entregas/nova/nova-entrega-form.tsx` | Cadastra uma entrega avulsa: cliente, endereço, valor, período agendado, urgência |
| Nova Entrega em Grupo | `/dashboard/entregas/nova-grupo` | `src/app/dashboard/entregas/nova-grupo/nova-entrega-grupo-form.tsx` | Cadastra várias entregas de uma vez para múltiplos destinatários (compartilham `group_id`) |
| Detalhe da Entrega | `/dashboard/entregas/[id]` | `src/app/dashboard/entregas/[id]/page.tsx` | Ver/editar uma entrega: endereço, status, fotos de comprovação, dados do recebedor, motivo de recusa/cancelamento |
| Clientes | `/dashboard/clientes` | `src/app/dashboard/clientes/page.tsx` | Listagem e busca de clientes |
| Novo Cliente | `/dashboard/clientes/novo` | `src/app/dashboard/clientes/novo/page.tsx` | Cadastro de cliente com múltiplos endereços (`createClienteMultiEnderecos`) |
| Detalhe do Cliente | `/dashboard/clientes/[id]` | `src/app/dashboard/clientes/[id]/page.tsx` | Editar cliente, adicionar/editar/remover endereços |
| Locais Frequentes | `/dashboard/locais` | `src/app/dashboard/locais/page.tsx` | Endereços reutilizáveis não vinculados a um cliente específico (agiliza cadastro de entrega) |
| Busca Rápida de Entrega | (dialog global) | `src/components/pesquisar-entrega-dialog.tsx` | Busca por nº do pedido/cliente a partir de qualquer tela do dashboard |

## Entregador (motoboy)

Área separada, mobile-first, sem o menu lateral do dashboard.

| Tela | Rota | Arquivo | O que faz |
|---|---|---|---|
| Rota do Dia | `/entregador` | `src/app/entregador/page.tsx` | Lista as entregas atribuídas ao entregador logado, em cards (`entrega-card.tsx`, `entrega-group-card.tsx` para entregas em grupo) |
| Finalizadas | `/entregador/finalizadas` | `src/app/entregador/finalizadas/page.tsx` | Histórico de entregas já concluídas pelo entregador |

Ações disponíveis (`src/app/entregador/actions.ts`, todas Server Actions):

- **`iniciarEntrega()`** — marca entrega como `em_rota`, abre deep link para Maps/Waze
- **`registrarEntrega()`** — marca como `entregue`, salva dados do recebedor (nome, papel — `secretaria`/`porteiro`/`morador_vizinho`/`proprietario`)
- **`registrarRecusa()`** — marca como `recusada`, salva motivo
- **`confirmarRetornoEntrega()`** — confirma retorno de uma entrega `retornada`
- **`uploadFotoEntrega()` / `removerFotosEntrega()` / `copiarFotoParaEntregas()`** — gestão das fotos de comprovação no Supabase Storage
- **`tryCalculateRouteDistance()`** — ao finalizar a última entrega do período, calcula km rodado via OSRM (`calcRouteDistanceKm`) e grava em `rotas_diarias`

## Funcionalidades transversais

- **Login por username ou e-mail** — `/login`, resolvido via `/api/resolve-username`
- **PWA** — instalável (manifest em `public/`), pensado para o entregador usar no celular
- **Tema claro/escuro** — via `next-themes`
- **Busca de endereço com autocomplete** — seleção de endereço local com busca (usado no cadastro de entrega)

## Ambiente de teste

- `POST /api/test/seed` — popula o banco com usuários/clientes/endereços de teste
- `POST /api/test/cleanup` — limpa os dados de teste
