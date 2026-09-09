# Ideias e Alterações Pendentes

Lista de ideias, melhorias e alterações para o app. Toda ideia nova entra aqui.
Antes de implementar algo, consultar esta lista para decidir prioridade.

Status: `[ ]` pendente · `[x]` feito (mover pra baixo ou apagar depois de feito, se quiser manter a lista enxuta)

## Prioridade alta


## Prioridade média

- [x] **Notificação para o motoboy quando a rota é liberada** para a entrega. Feito como toast in-app (som/vibração) reaproveitando o realtime já existente na tela do entregador; push real (com app fechado) fica para depois, se necessário.
- [ ] **Notificação/moderação de entregas esquecidas.** Entregas criadas ou "em rota" há muito tempo sem finalização precisam de um fluxo de moderação (vendedor e/ou admin) para não ficarem em aberto indefinidamente no sistema. Avaliar quem modera e como.
- [x] **Entregas esquecidas** As entregas ficam aparecendo no topo da página, mas ao mudar a data ao editar a entrega ela continua aparecendo como esquecida, deveria sair dessa listagem e voltar para o kambam organizador. Ao excluir ela some da listagem, mas acontece algo meio estranho ao clicar em excluir entrega e confirmar, a confirmação vem e carrega automaticamente a própria página da entrega que foi excluida. Aqui acho que deveria voltar para ultima página antes da edição e exclusão da entrega. Corrigido: a checagem de "esquecida" usava `created_at` (nunca muda); passou a usar `updated_at`, que a própria trigger do banco já atualiza a cada edição — qualquer edição salva tira a entrega da lista. O kanban também filtrava por `created_at` em vez de `scheduled_date`, então editar a data não movia a entrega pra coluna certa — corrigido. E o botão Excluir Entrega agora navega de volta (`router.back()`) em vez de recarregar a própria entrega excluída.
- [x] **Separadores nas colunas dos entregadores** Coluna do entregador agora separa Manhã (borda âmbar) / Tarde (borda azul) / Em rota (borda cinza, sempre por último), cada turno pendente com seu próprio botão de liberar. Otimizar rota também passou a ordenar por turno (manhã antes de tarde) com urgente sempre primeiro dentro do turno — antes misturava tudo numa lista só.

## Prioridade baixa / ideias soltas

- [x] **Animações / microinterações** para deixar a usabilidade mais fluida e leve. Feito com CSS puro (sem lib nova): shake em campo inválido, spring/tilt no drag do kanban, highlight âmbar quando o status muda via realtime, bump no contador da coluna, count-up nos números do dashboard, e spinner nos estados de carregamento/salvamento.
