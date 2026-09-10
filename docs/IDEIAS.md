# Ideias e Alterações Pendentes

Lista de ideias, melhorias e alterações para o app. Toda ideia nova entra aqui.
Antes de implementar algo, consultar esta lista para decidir prioridade.

Status: `[ ]` pendente · `[x]` feito (mover pra baixo ou apagar depois de feito, se quiser manter a lista enxuta)

## Prioridade alta


## Prioridade média

- [x] **Visão mobile (vendedor/adm) — Torre de Controle:** os KPIs já estavam em grid 2x2 no mobile (`grid-cols-2 lg:grid-cols-4`). Corrigido o botão "Nova Entrega": agora fica em linha própria, largura total, ícone + texto sempre visíveis, abaixo dos demais botões (que continuam na linha de cima). No desktop (`sm:` e acima) continua como antes, ao lado dos outros botões.
- [x] **Visão mobile (vendedor/adm) — Endereços fixos:** coluna "Endereço" agora escondida no mobile (`hidden sm:table-cell`), restando Nome + Status + ações.
- [x] **Visão mobile (vendedor/adm) — Cadastro de nova entrega e entrega em grupo:** formulário trocou `w-[50vw] min-w-[340px]` por `w-full sm:w-[50vw] sm:min-w-[340px]` — ocupa 100% da largura no mobile, mantém 50vw no desktop.
- [x] **Compilar/reorganizar botões** da página de Organizar Entregas e da Torre de Controle — hoje estão muito espalhados/duplicados; pensar num agrupamento melhor (ex.: menu de ações, dropdown) antes de mexer no layout.
- [x] **Visão do motoboy — aba de devoluções pendentes:** nova aba listando as devoluções que ele precisa entregar no dia seguinte; o item só sai da lista quando o admin marcar como concluído (não deve sumir sozinho). Feito: nova aba "Devoluções" no bottom nav do entregador, listagem somente leitura (sem ação do motoboy) das entregas com `nota_devolvida = false`, com badge de contador no ícone da aba; a baixa continua sendo só o admin em `/dashboard/devolucoes`.
- [x] **Adicionar botão Em Rota** na aba de organizar entregas no botão de escolhar todas/manha/tarde, adicione uma nova opção em rota. Feito: 4ª opção "Em Rota" (ícone de caminhão, cinza) no seletor de turno, filtra pelas entregas com status `rota_definida` (já liberadas), independente do turno.
- [x] **Notificação para o motoboy quando a rota é liberada** para a entrega. Feito como toast in-app (som/vibração) reaproveitando o realtime já existente na tela do entregador; push real (com app fechado) fica para depois, se necessário.
- [x] **Notificação/moderação de entregas esquecidas.** Entregas criadas ou "em rota" há muito tempo sem finalização precisam de um fluxo de moderação (vendedor e/ou admin) para não ficarem em aberto indefinidamente no sistema. Avaliar quem modera e como.
- [x] **Entregas esquecidas** As entregas ficam aparecendo no topo da página, mas ao mudar a data ao editar a entrega ela continua aparecendo como esquecida, deveria sair dessa listagem e voltar para o kambam organizador. Ao excluir ela some da listagem, mas acontece algo meio estranho ao clicar em excluir entrega e confirmar, a confirmação vem e carrega automaticamente a própria página da entrega que foi excluida. Aqui acho que deveria voltar para ultima página antes da edição e exclusão da entrega. Corrigido: a checagem de "esquecida" usava `created_at` (nunca muda); passou a usar `updated_at`, que a própria trigger do banco já atualiza a cada edição — qualquer edição salva tira a entrega da lista. O kanban também filtrava por `created_at` em vez de `scheduled_date`, então editar a data não movia a entrega pra coluna certa — corrigido. E o botão Excluir Entrega agora navega de volta (`router.back()`) em vez de recarregar a própria entrega excluída.
- [x] **Separadores nas colunas dos entregadores** Coluna do entregador agora separa Manhã (borda âmbar) / Tarde (borda azul) / Em rota (borda cinza, sempre por último), cada turno pendente com seu próprio botão de liberar. Otimizar rota também passou a ordenar por turno (manhã antes de tarde) com urgente sempre primeiro dentro do turno — antes misturava tudo numa lista só.

## Prioridade baixa / ideias soltas

- [x] **Enumeração de usernames em `/api/resolve-username`.** Endpoint público confirmava se um username existia (e-mail sintético vs. `null`), permitindo descobrir por tentativa quais usernames eram válidos. Corrigido: endpoint removido; `/api/login` (novo) faz o login direto no servidor, derivando o e-mail sintético de forma determinística (sem consulta ao banco) e respondendo sempre com a mesma mensagem genérica de erro, exista ou não o username. Encontrado na revisão de segurança de 2026-09-10.
- [x] **Limpar dívida técnica de lint não relacionada a segurança.** `npm run lint` ainda acusa 31 erros e 49 avisos pré-existentes (`@typescript-eslint/no-explicit-any`, `react-hooks/set-state-in-effect`, `react-hooks/immutability`, `react-hooks/exhaustive-deps`, variáveis não usadas, `window.location.href` em vez de navegação do Next). Ficaram de fora da tarefa de configuração do `eslint-plugin-security` (2026-09-10) por não terem relação com segurança.
- [x] **Animações / microinterações** para deixar a usabilidade mais fluida e leve. Feito com CSS puro (sem lib nova): shake em campo inválido, spring/tilt no drag do kanban, highlight âmbar quando o status muda via realtime, bump no contador da coluna, count-up nos números do dashboard, e spinner nos estados de carregamento/salvamento.
