# Plano de atualização do manual

O manual publicado em `clinic-manual` precisa acompanhar o painel como ele está hoje: o passo a passo, os campos dos formulários e as capturas de tela.

Texto de cada capítulo: `src/lib/manual.ts`.
Imagens: `public/prints/` (a pasta veio vazia neste clone; o capítulo só mostra a figura se o arquivo existir).
Script atual de captura: `scripts/capturar-prints.mjs`. Ele abre a rota e fotografa a lista. Não abre diálogo, painel lateral nem formulário de cadastro.

Fonte da verdade: a tela do painel no momento da captura. O briefing antigo em `clinic-web-app/docs/manual-usuario.md` não é atualizado junto, a menos que você peça.

## Como pedir o próximo módulo

Mande só o nome, por exemplo: **atualiza o módulo Pacientes**.

Cada capítulo é escrito como um primeiro acesso: a ordem é a de quem faz aquilo pela primeira vez, e as figuras mostram o formulário com os campos já preenchidos. A explicação numerada fica logo acima da imagem daquele passo, não num bloco separado no final.

Em cada módulo eu faço, nesta ordem:

1. Abro as telas no painel e confiro rótulos, campos obrigatórios, botões e status.
2. Tiro print da lista e de cada formulário ou diálogo listado abaixo.
3. Reescrevo o passo a passo e as legendas em `src/lib/manual.ts` para bater com o que apareceu.
4. Marco o módulo como feito nesta tabela.

Prints em tema claro, largura de desktop (1440). Dados de paciente, CPF e valores sensíveis ficam de fora do enquadramento quando der para evitar.

Para as telas internas, o painel precisa estar no ar e com um usuário administrador. Login e recuperação de senha não precisam de conta.

## Ordem sugerida

Do começo do uso até a configuração, para o texto de um módulo poder citar o anterior já revisado.

| # | Módulo | Capítulo | Status |
|---|--------|----------|--------|
| 1 | Entrar | `entrar` | feito |
| 2 | O painel | `painel` | feito |
| 3 | Perfis de acesso | `perfis` | feito |
| 4 | Planos | `planos` | feito |
| 5 | Dashboard | `dashboard` | feito |
| 6 | Pacientes | `pacientes` | feito |
| 7 | Agenda | `agenda` | feito |
| 8 | Profissionais | `profissionais` | feito |
| 9 | Financeiro | `financeiro` | feito |
| 10 | Convênios | `convenios` | feito |
| 11 | Estoque | `estoque` | feito |
| 12 | RH | `rh` | feito |
| 13 | Relatórios | `relatorios` | feito |
| 14 | Integrações e lembretes | `integracoes` | feito |
| 15 | Power BI e Agente de IA | `em-breve` | feito |
| 16 | Configurações | `configuracoes` | feito |

## O que fotografar em cada módulo

O que já existe no script está marcado como lista. O restante é formulário, aba ou diálogo que o manual cita e o script ainda não captura.

### 1. Entrar

Feito. O capítulo começa pelo primeiro acesso (clínica, unidade e administrador) e segue para o login, a escolha de unidade, o pedido de link, a nova senha e o link inválido. Figuras em `public/prints`.

### 2. O painel

Feito. Menu aberto, menu recolhido, menu no celular, unidade, sino, conta, lista com busca, colunas e ações da linha. Figuras `painel-*.png`. A explicação numerada fica acima de cada imagem.

### 3. Perfis de acesso

Feito. Matriz em Configurações › Perfis e permissões, sempre com os treze módulos. A quarta coluna na tela se chama Desativar. No Essencial e no Profissional, a linha fora do contrato fica com cadeado e as caixas desligadas. Figuras `permissoes.png` (Administrador), `permissoes-plano.png` (cadeado no Essencial), `permissoes-financeiro.png`, `permissoes-gestor.png`, `permissoes-profissional.png` e `permissoes-recepcao.png`. Sem formulário separado.

### 4. Planos

Feito. O contrato desta clínica é Ilimitado, então o menu real não tem cadeado. Figuras `planos-menu.png`, `planos-essencial.png` (balão Disponível no plano Profissional), `planos-bloqueado.png`, `planos-profissional.png` (balão Disponível no plano Ilimitado), `planos-power-bi.png`, `planos-agente.png`, `planos-usuarios.png`, `planos-unidades.png` e `planos-unidade-essencial.png`.

### 5. Dashboard

Feito. Sem formulário. Figuras `dashboard.png` (administrador; gestor e financeiro iguais), `dashboard-listas.png`, `dashboard-recepcao.png` e `dashboard-profissional.png` (os dois sem cards de dinheiro; no profissional a fileira tem os quatro cards da operação). O nome nas figuras é Usuário teste.

### 6. Pacientes

Feito. A lista é `pacientes.png`. O cadastro está em `pacientes-pessoais.png`, `pacientes-contato.png`, `pacientes-convenio.png` e `pacientes-responsavel.png`. Dados clínicos, preferências e consentimentos cabem no mesmo quadro: `pacientes-clinicos.png`. A ficha está em `pacientes-visao.png`, `pacientes-prontuario.png`, `pacientes-historico.png`, `pacientes-documentos.png` e `pacientes-financeiro.png`. Os diálogos são `pacientes-evolucao.png`, `pacientes-anexar.png`, `pacientes-cobranca.png` e `pacientes-recebimento.png`. O nome nas figuras é Paciente teste. Carteirinha e validade aparecem fora de Particular e não são obrigatórias. Sem acompanhamento formal, Nova evolução abre em Avaliação inicial.

### 7. Agenda

Feito. A grade do dia é `agenda.png`. Semana e mês mudam o layout: `agenda-semana.png` e `agenda-mes.png`. O cadastro está em `agenda-novo.png`, `agenda-novo-atendimento.png` e `agenda-novo-convenio.png`. O painel do horário é `agenda-horario.png`, com o selo Confirmado e os botões Check-in, Cancelado e Faltou. O bloqueio é `agenda-bloqueio.png` e a lista de espera é `agenda-espera.png`. O nome na grade é Paciente teste. Particular começa ligado; desmarcar abre o convênio, por exemplo Unimed. Sala é opcional. Ao marcar Atendido, a cobrança é gerada se ainda não existir.

### 8. Profissionais

Feito. A lista é `profissionais.png`. O nome nas figuras é Profissional teste. O cadastro está em `profissionais-pessoais.png` (a conta de login fica nesta seção e, nesta clínica, permanece em Sem vínculo de login), `profissionais-dados.png`, `profissionais-vinculo.png`, `profissionais-comissao.png`, `profissionais-horarios.png` e `profissionais-procedimentos.png`. O perfil está em `profissionais-visao.png`, `profissionais-agenda.png`, `profissionais-pacientes.png`, `profissionais-comissoes.png` e `profissionais-documentos.png`. Na lista a pessoa é CLT e Fixo, então a comissão fica em traço e a aba de comissões fica vazia. O formulário novo abre em PJ e Comissão, com o percentual em 40. Consulta é o procedimento marcado. Enviar documento ainda responde que o envio fica disponível em breve.

### 9. Financeiro

Feito. A visão geral é `financeiro.png` e o trecho de baixo, com o DRE e as inadimplências, é `financeiro-dre.png`. As listas são `contas-a-receber.png`, `contas-a-pagar.png`, `fluxo-de-caixa.png`, `faturamento-convenios.png` e `comissoes.png`. Os diálogos são `financeiro-cobranca.png`, `financeiro-recebimento.png`, `financeiro-parcelas.png`, `financeiro-despesa.png`, `financeiro-baixa.png`, `financeiro-lote.png`, `financeiro-reconciliacao.png` e `financeiro-folha.png`. O nome nas cobranças é Paciente teste. A despesa de exemplo na lista é Outros, Fornecedor teste, Mensal e Vencido. O lote desta clínica ainda não existe: a lista diz Nenhum lote encontrado, e a reconciliação da figura está em Enviado, operadora Unimed, competência set/2026. As comissões da competência estão vazias. No diálogo de baixa o valor continua com o rótulo Valor recebido.

### 10. Convênios

Feito. A lista é `convenios.png`. O nome nas figuras é Unimed, com registro 393321, contato Central de Relacionamento e telefone (16) 3000-0000. O cadastro está em `convenios-novo.png`: Ativo, prazo de 30 dias, portal de exemplo e autorização prévia ligada. A ficha está em `convenios-tabela.png`, com Avaliação a R$ 150,00 no particular e Consulta a R$ 200,00. Os dois valores do convênio estão em R$ 120,00, a diferença em -R$ 30,00 e -R$ 80,00, e a lista ainda diz 0 na tabela porque o preço não foi gravado. Não há paciente vinculado nem portal nesta ficha. A inativação é `convenios-inativar.png`. A trilha da ficha mostra o nome da operadora.

### 11. Estoque

Feito. A lista, com o alerta, é `estoque.png`. Os produtos são Higiene (Descartáveis, rolo, 2 no saldo e mínimo 3, custo R$ 12,00) e Produto de Limpeza (Escritório, frasco, saldo igual ao mínimo 3, custo R$ 4,50). O fornecedor nas figuras é Fornecedor teste. O valor em estoque é R$ 37,50 e a reposição estimada é R$ 12,00. O cadastro está em `estoque-novo.png`: Luva de procedimento, Descartáveis, caixa, quantidade 20, mínimo 5 e custo R$ 12,50. A saída está em `estoque-movimentacao.png`, produto Higiene, quantidade 2, data 27/09/2026, procedimento Consulta, e o saldo previsto vai a 0. As abas vazias são `estoque-movimentacoes.png` e `estoque-consumo.png`. A inativação é `estoque-inativar.png`.

### 12. RH

Feito. A visão geral é `rh.png`: 0 presentes, 8 usuários ativos, 8 ausentes, 0 em aberto e 0 holerites em setembro de 2026. A lista de ponto é `ponto.png`, de 01/09/2026 a 30/09/2026, com o botão Bater entrada e o título Nenhum ponto no período. O lançamento está em `ponto-lancar.png`: Usuário teste, 27/09/2026, entrada 08:00, intervalo de 12:00 a 13:00, saída 18:00 e observação Ajuste manual do dia. Os holerites são `holerites.png`, competência setembro de 2026, ainda sem arquivo. O envio está em `holerite-enviar.png`, arquivo contracheque.pdf. Não há linha nesta clínica, então Editar e Excluir não aparecem na lista.

### 13. Relatórios

Feito. Sem formulário. A primeira aba é `relatorios.png`: Faturamento em Este mês, setembro de 2026, total R$ 360,00, 2 atendimentos, ticket médio R$ 180,00 e 1 convênio ativo. A quebra fica em `relatorios-faturamento.png`, Particular e Valor Alterado (Avaliação). O seletor é `relatorios-periodo.png`. As outras abas são `relatorios-atendimentos.png`, `relatorios-inadimplencia.png` (R$ 300,00, Paciente teste e Paciente teste 2), `relatorios-pacientes.png` (aba Novos x recorrentes), `relatorios-produtividade.png` (Pediatria, ocupação 100,0%) e `relatorios-comissoes.png` (Sem dados no período). A inadimplência não acompanha o período. O nome nas figuras é Profissional teste e Paciente teste.

### 14. Integrações e lembretes

Feito. O plano desta clínica é Ilimitado, então o módulo abre. O dashboard é `integracoes.png`: de 01/10/2026 a 02/10/2026, cards em zero e Últimos envios vazio. A configuração é `integracoes-config.png`: lembretes desligados, WhatsApp ligado, cobrança na conta da clínica e credenciais em branco. A URL do webhook fica fora de foco. As regras são `lembretes.png` e o formulário é `integracoes-regra.png` (Lembrete da véspera, 1440 minutos, Lembrete WhatsApp). Os templates são `lembretes-templates.png` e o formulário é `integracoes-template.png` (Lembrete de consulta, lembrete_consulta, pt_BR, Utility). O histórico é `historico-envios.png`, ainda sem envio. O e-mail não se configura aqui.

### 15. Power BI e Agente de IA

Feito. As duas telas continuam aviso, sem formulário. No Ilimitado o título é Em breve neste plano. Figuras `power-bi.png` e `agente-ia.png`.

### 16. Configurações

Feito. A identificação é `clinica.png` (Luna - Centro de Desenvolvimento Infantil; CNPJ, telefone e e-mail fora de foco). O endereço e a unidade são `configuracoes-unidades.png`: Franca, SP, Sede Franca, Ativo. Os diálogos são `configuracoes-unidade.png` (Unidade Centro), `configuracoes-usuario.png` (Recepção, Sede Franca), `configuracoes-perfil.png` (Gestor) e `configuracoes-procedimento.png` (Retorno, Consulta, 30 min, R$ 150,00). As listas são `usuarios.png` (Ilimitado · 7 usuários · sem limite; o nome é Usuário teste), `procedimentos.png` (Avaliação, Consulta e Valor Alterado), `pagamentos.png` (as seis formas ligadas) e `estilizacao.png` (Claro em uso). Perfis e permissões permanece no módulo 3.
