# Ideias e Alterações Pendentes

Lista de ideias, melhorias e alterações para o app. Toda ideia nova entra aqui.
Antes de implementar algo, consultar esta lista para decidir prioridade.

Status: `[ ]` pendente · `[x]` feito (mover pra baixo ou apagar depois de feito, se quiser manter a lista enxuta)

## Prioridade alta


## Prioridade média

- [x] **Notificação para o motoboy quando a rota é liberada** para a entrega. Feito como toast in-app (som/vibração) reaproveitando o realtime já existente na tela do entregador; push real (com app fechado) fica para depois, se necessário.
- [ ] **Notificação/moderação de entregas esquecidas.** Entregas criadas ou "em rota" há muito tempo sem finalização precisam de um fluxo de moderação (vendedor e/ou admin) para não ficarem em aberto indefinidamente no sistema. Avaliar quem modera e como.
- [ ] **Entregas esquecidas** As entregas ficam aparecendo no topo da página, mas ao mudar a data ao editar a entrega ela continua aparecendo como esquecida, deveria sair dessa listagem e voltar para o kambam organizador. Ao excluir ela some da listagem, mas acontece algo meio estranho ao clicar em excluir entrega e confirmar, a confirmação vem e carrega automaticamente a própria página da entrega que foi excluida. Aqui acho que deveria voltar para ultima página antes da edição e exclusão da entrega.
- [ ] **Separadores nas colunas dos entregadores** Quando os cards forem designados, as entregas devem ficar separadas por turno tendo um botão de liberar entrega para cada turno. Podem ficar contornadas por uma linha pontilhada suave delimitando as entregas da manha (amarelo/laranja), tarde(azul) e em rota(cinza).

## Prioridade baixa / ideias soltas

- [x] **Animações / microinterações** para deixar a usabilidade mais fluida e leve. Feito com CSS puro (sem lib nova): shake em campo inválido, spring/tilt no drag do kanban, highlight âmbar quando o status muda via realtime, bump no contador da coluna, count-up nos números do dashboard, e spinner nos estados de carregamento/salvamento.
