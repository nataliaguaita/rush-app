# Changelog da Documentação

Registro de mudanças relevantes na aplicação. Adicione uma linha aqui sempre que uma funcionalidade for criada, alterada ou removida — não é um changelog de todo commit, é um resumo do que muda para quem usa/mantém o sistema.

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
