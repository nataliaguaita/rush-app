# Ideias e Alterações Pendentes

Lista de ideias, melhorias e alterações para o app. Toda ideia nova entra aqui.
Antes de implementar algo, consultar esta lista para decidir prioridade.

Status: `[ ]` pendente · `[x]` feito (mover pra baixo ou apagar depois de feito, se quiser manter a lista enxuta)

## Prioridade alta


## Prioridade média

- [ ] **Visão mobile (vendedor/adm) — Torre de Controle:** alinhar os KPIs em grid 2 linhas x 2 colunas (em vez da linha única atual); deixar o botão "Nova Entrega" completo (ícone + texto) ocupando toda a largura da página, abaixo dos demais botões.
- [ ] **Visão mobile (vendedor/adm) — Endereços fixos:** corrigir a coluna de endereço da tabela/lista, que quebra o layout no mobile; avaliar remover essa coluna na visão mobile, deixando só nome e status.
- [ ] **Visão mobile (vendedor/adm) — Cadastro de nova entrega e entrega em grupo:** formulário deve ocupar toda a largura da página no mobile (hoje sobra espaço nas laterais).
- [ ] **Compilar/reorganizar botões** da página de Organizar Entregas e da Torre de Controle — hoje estão muito espalhados/duplicados; pensar num agrupamento melhor (ex.: menu de ações, dropdown) antes de mexer no layout.
- [ ] **Visão do motoboy — aba de devoluções pendentes:** nova aba listando as devoluções que ele precisa entregar no dia seguinte; o item só sai da lista quando o admin marcar como concluído (não deve sumir sozinho).
- [x] **Notificação para o motoboy quando a rota é liberada** para a entrega. Feito como toast in-app (som/vibração) reaproveitando o realtime já existente na tela do entregador; push real (com app fechado) fica para depois, se necessário.
- [ ] **Notificação/moderação de entregas esquecidas.** Entregas criadas ou "em rota" há muito tempo sem finalização precisam de um fluxo de moderação (vendedor e/ou admin) para não ficarem em aberto indefinidamente no sistema. Avaliar quem modera e como.
- [x] **Entregas esquecidas** As entregas ficam aparecendo no topo da página, mas ao mudar a data ao editar a entrega ela continua aparecendo como esquecida, deveria sair dessa listagem e voltar para o kambam organizador. Ao excluir ela some da listagem, mas acontece algo meio estranho ao clicar em excluir entrega e confirmar, a confirmação vem e carrega automaticamente a própria página da entrega que foi excluida. Aqui acho que deveria voltar para ultima página antes da edição e exclusão da entrega. Corrigido: a checagem de "esquecida" usava `created_at` (nunca muda); passou a usar `updated_at`, que a própria trigger do banco já atualiza a cada edição — qualquer edição salva tira a entrega da lista. O kanban também filtrava por `created_at` em vez de `scheduled_date`, então editar a data não movia a entrega pra coluna certa — corrigido. E o botão Excluir Entrega agora navega de volta (`router.back()`) em vez de recarregar a própria entrega excluída.
- [x] **Separadores nas colunas dos entregadores** Coluna do entregador agora separa Manhã (borda âmbar) / Tarde (borda azul) / Em rota (borda cinza, sempre por último), cada turno pendente com seu próprio botão de liberar. Otimizar rota também passou a ordenar por turno (manhã antes de tarde) com urgente sempre primeiro dentro do turno — antes misturava tudo numa lista só.

## Prioridade baixa / ideias soltas

- [ ] **Enumeração de usernames em `/api/resolve-username`.** Endpoint público (necessário para o login por usuário) confirma se um username existe, retornando o e-mail sintético (`usuario@rushapp.local`) quando existe e `null` quando não. O e-mail é 100% determinístico a partir do username, então não vaza nada extra, mas permite descobrir por tentativa quais usernames são válidos no sistema. Não corrigido para não quebrar o login — mitigar com rate limiting na borda (Vercel/Cloudflare) se virar preocupação. Encontrado na revisão de segurança de 2026-09-10.
- [ ] **Limpar dívida técnica de lint não relacionada a segurança.** `npm run lint` ainda acusa 31 erros e 49 avisos pré-existentes (`@typescript-eslint/no-explicit-any`, `react-hooks/set-state-in-effect`, `react-hooks/immutability`, `react-hooks/exhaustive-deps`, variáveis não usadas, `window.location.href` em vez de navegação do Next). Ficaram de fora da tarefa de configuração do `eslint-plugin-security` (2026-09-10) por não terem relação com segurança.
- [x] **Animações / microinterações** para deixar a usabilidade mais fluida e leve. Feito com CSS puro (sem lib nova): shake em campo inválido, spring/tilt no drag do kanban, highlight âmbar quando o status muda via realtime, bump no contador da coluna, count-up nos números do dashboard, e spinner nos estados de carregamento/salvamento.
