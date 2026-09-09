# Ideias e Alterações Pendentes

Lista de ideias, melhorias e alterações para o app. Toda ideia nova entra aqui.
Antes de implementar algo, consultar esta lista para decidir prioridade.

Status: `[ ]` pendente · `[x]` feito (mover pra baixo ou apagar depois de feito, se quiser manter a lista enxuta)

## Prioridade alta

- [ ] **Bug: endereço alterado em entrega liberada está sendo salvo automaticamente no cadastro do cliente.** Ao editar o endereço de uma entrega já liberada, o sistema grava essa alteração no cadastro do cliente sem intenção. Conferir se há outros pontos com o mesmo comportamento indevido.

## Prioridade média

- [ ] **Notificação para o motoboy quando a rota é liberada** para a entrega.
- [ ] **Controle de devolução (admin) para entregas com nota a assinar/receber.** Toda entrega da tarde com nota gera pendência de devolução na manhã seguinte: nota assinada (caso assinatura), nota + comprovante de cartão/dinheiro (caso recebimento), ou material + nota (caso devolução). Necessário para o adm finalizar a venda no sistema de vendas da Dental. Ideia: checklist diário com as entregas dessas características, o adm confere e dá baixa final quando tudo devolvido.
- [ ] **Notificação/moderação de entregas esquecidas.** Entregas criadas ou "em rota" há muito tempo sem finalização precisam de um fluxo de moderação (vendedor e/ou admin) para não ficarem em aberto indefinidamente no sistema. Avaliar quem modera e como.

## Prioridade baixa / ideias soltas

- [ ] **Animações / microinterações** para deixar a usabilidade mais fluida e leve. Estudar opções (bibliotecas leves ou CSS puro) antes de implementar.
