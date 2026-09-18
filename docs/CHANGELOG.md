# Changelog da Documentação

Registro de mudanças relevantes na aplicação. Adicione uma linha aqui sempre que uma funcionalidade for criada, alterada ou removida — não é um changelog de todo commit, é um resumo do que muda para quem usa/mantém o sistema.

## 2026-09-17

- Sincronização com o sistema de vendas não sobrescreve mais endereço já geocodificado manualmente.
- Filtro e busca de clientes agora persistem ao navegar para a ficha do cliente e voltar.
- Fallback de geocodificação: tenta o endereço sem número quando a busca completa falha (aplicado também no script de backfill, cobrindo todo o banco).
- Exclusão de cliente (admin) — exige código interno no cadastro; cliente excluído manualmente não volta na próxima sincronização.
- Busca de clientes agora pagina corretamente além do limite de 1000 linhas do Supabase.
- Endereços importados do sistema de vendas passam a ser geocodificados.
- Cliente pode ser buscado e é exibido pelo código interno.

## 2026-09-14

- Endpoint de integração com o sistema de vendas (`/api/integracoes/vendas`) para importar clientes/endereços automaticamente.
- Cliente fora da região atendida não é mais descartado na importação — é marcado como inativo para revisão manual.

## 2026-09-11

- Fila offline para o entregador conseguir finalizar entregas sem internet.

## 2026-09-10

- Corrigida enumeração de usernames em `/api/resolve-username` (endpoint removido; `/api/login` faz a autenticação no servidor sem confirmar se o username existe).
- Melhorias na visão mobile (torre de controle, endereços fixos, formulários) e nova aba de devoluções pendentes para o motoboy.
- Card do motoboy passou a mostrar devolução, interessado e observação.
- Limpeza de dívida técnica de lint não relacionada a segurança.

## 2026-09-09

- Documentação inicial criada (`docs/README.md`, `ARQUITETURA.md`, `FUNCIONALIDADES.md`), cobrindo o estado atual da aplicação: papéis (admin/vendedor/entregador), modelo de dados, fluxo de auth, telas e ações principais.

## Histórico anterior (resumo, a partir do git log)

- Kanban de entregas passou a separar entregas liberadas das novas, com exibição aprimorada.
- Adicionado cancelamento de entrega com registro de motivo (`cancel_reason`).
- Adicionada gestão de "Locais Frequentes" (endereços fixos reutilizáveis).
- Adicionado fluxo de "Entrega em Grupo" (`group_id`, múltiplos destinatários em uma única criação).
- Adicionado compartilhamento de foto de comprovação entre entregas do mesmo grupo.
- Adicionado tratamento de mudança de rota (`route_change_type`) e confirmação de retorno de entrega.
- Adicionado heatmap de entregas no dashboard (`HeatmapCard`).
