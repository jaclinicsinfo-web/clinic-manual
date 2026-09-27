export type Print = {
  arquivo: string;
  alt: string;
  legenda: string;
};

export type Passo = {
  titulo: string;
  texto: string;
};

export type Capitulo = {
  slug: string;
  titulo: string;
  grupo: "Começar" | "Operação" | "Gestão" | "Avançado" | "Sistema";
  resumo: string;
  acesso: string;
  passos: Passo[];
  prints: Print[];
  dicas?: string[];
};

export const capitulos: Capitulo[] = [
  {
    slug: "entrar",
    titulo: "Como entrar",
    grupo: "Começar",
    resumo: "Login, escolha da unidade e recuperação de senha.",
    acesso: "Qualquer pessoa com usuário ativo na clínica.",
    prints: [
      {
        arquivo: "entrar.png",
        alt: "Tela de login do J.A. Clinics",
        legenda: "Tela de entrada: e-mail, senha, manter conectado e o link Esqueci minha senha.",
      },
      {
        arquivo: "esqueci-senha.png",
        alt: "Tela de recuperação de senha",
        legenda: "Informe o e-mail da conta para receber o link de nova senha.",
      },
    ],
    passos: [
      {
        titulo: "Abra o painel e entre",
        texto: "Na tela Entrar, informe o e-mail e a senha que o administrador criou para você. Marque Manter conectado se este for o computador da clínica e você quiser permanecer logado. Clique em Entrar.",
      },
      {
        titulo: "Escolha a unidade, se o sistema pedir",
        texto: "Se a sua conta tiver mais de uma unidade, o sistema mostra a lista antes de abrir o painel. Escolha a unidade do dia e clique em Continuar. Tudo que você vê em seguida (agenda, pacientes, financeiro) vale para essa unidade.",
      },
      {
        titulo: "Recupere a senha",
        texto: "Se não lembrar a senha, clique em Esqueci minha senha, informe o e-mail da conta e envie. Quando o e-mail da clínica estiver configurado, chega um link para definir uma nova senha, com no mínimo 8 caracteres. O link vale por tempo limitado e só pode ser usado uma vez.",
      },
      {
        titulo: "Primeiro acesso da clínica",
        texto: "Na primeira vez, antes de existir qualquer usuário, um assistente cria a clínica em três passos: dados da clínica, a primeira unidade e o administrador (nome, e-mail e senha). Essa conta nasce como Administrador. Os demais usuários são criados depois em Configurações.",
      },
    ],
    dicas: [
      "Conta inativa não entra. Peça ao administrador para reativar em Configurações › Usuários.",
      "O cadastro de novos usuários não fica na tela de login. Só o administrador cria contas.",
    ],
  },
  {
    slug: "painel",
    titulo: "O painel",
    grupo: "Começar",
    resumo: "Menu, unidade, notificações, tema e o padrão das listas.",
    acesso: "Todos os perfis, com o menu limitado ao que cada um pode ver.",
    prints: [
      {
        arquivo: "dashboard.png",
        alt: "Painel após o login, com menu e barra superior",
        legenda: "Depois de entrar, o menu fica à esquerda e a unidade, o sino e o seu nome ficam na barra superior.",
      },
    ],
    passos: [
      {
        titulo: "Use o menu da esquerda",
        texto: "O menu fica agrupado em Operação, Gestão, Avançado e Sistema. No topo aparece o nome da clínica. Você pode recolher o menu para ver só os ícones. No celular, ele abre pelo botão de menu da barra superior. Itens que o seu perfil não pode ver simplesmente não aparecem.",
      },
      {
        titulo: "Troque a unidade na barra superior",
        texto: "Se você atua em mais de uma unidade, o seletor fica na barra de cima. Ao trocar, a agenda, os pacientes e o financeiro passam a mostrar a unidade escolhida.",
      },
      {
        titulo: "Leia o sino de notificações",
        texto: "O sino mostra um ponto e a quantidade de avisos não lidos. Clique em um aviso para marcá-lo como lido e ir à tela relacionada (estoque baixo, conta vencida, carteirinha perto do vencimento). Marcar lidas limpa a lista.",
      },
      {
        titulo: "Alterne o tema e saia com segurança",
        texto: "O ícone de sol ou lua na barra superior alterna entre tema claro e escuro. A preferência também pode ser escolhida em Configurações › Estilização e fica salva na sua conta. Para encerrar, abra o menu do seu nome e clique em Sair.",
      },
      {
        titulo: "Trabalhe nas listas do mesmo jeito",
        texto: "Quase toda listagem tem busca, filtros, escolha de colunas, ordenação pelo cabeçalho e paginação. Exportar baixa um CSV das linhas filtradas, só com as colunas visíveis, para abrir no Excel. O menu de três pontos da linha concentra as ações daquele registro, como ver, editar ou arquivar.",
      },
    ],
    dicas: [
      "Se um módulo sumiu do menu, em geral é perfil ou plano, não um defeito. Confira os capítulos Perfis de acesso e Planos.",
    ],
  },
  {
    slug: "perfis",
    titulo: "Perfis de acesso",
    grupo: "Começar",
    resumo: "O que cada perfil vê no menu e o que pode fazer.",
    acesso: "A matriz vale para toda a clínica. Só o administrador altera perfis.",
    prints: [
      {
        arquivo: "permissoes.png",
        alt: "Tela de perfis e permissões",
        legenda: "O administrador marca visualizar, criar, editar e excluir em cada módulo.",
      },
    ],
    passos: [
      {
        titulo: "Entenda os cinco perfis de fábrica",
        texto: "Administrador vê tudo, inclusive usuários e permissões. Gestor opera a clínica, sem configurações. Recepção cuida de pacientes, agenda e recebimentos. Profissional de saúde vê a própria agenda e os próprios pacientes. Financeiro cuida de caixa, convênios e relatórios, sem prontuário.",
      },
      {
        titulo: "Confira o menu padrão",
        texto: "Dashboard, Pacientes e Agenda aparecem para todos. Profissionais some para o profissional de saúde. Financeiro some para o profissional de saúde e, para a recepção, fica limitado a recebimentos. Estoque e Relatórios não aparecem para a recepção. Configurações fica só com o administrador.",
      },
      {
        titulo: "Respeite as regras extras",
        texto: "Prontuário e documentos clínicos do paciente só aparecem para administrador, gestor e profissional de saúde. Recepção e financeiro não veem essas abas. O profissional de saúde precisa ter o login vinculado ao cadastro em Profissionais; sem isso a agenda e a lista de pacientes ficam vazias. Não dá para inativar a própria conta nem o último administrador.",
      },
    ],
    dicas: [
      "Usuários e Perfis e permissões só o administrador abre, mesmo que Configurações esteja visível.",
      "Mudar a matriz em Perfis e permissões vale para todas as contas daquele perfil. O perfil Administrador não pode ser reduzido.",
    ],
  },
  {
    slug: "planos",
    titulo: "Planos",
    grupo: "Começar",
    resumo: "Por que um módulo aparece com cadeado ou nem entra no menu.",
    acesso: "O plano é da clínica, definido no contrato. O usuário não troca o plano dentro do painel.",
    prints: [],
    passos: [
      {
        titulo: "Essencial",
        texto: "Inclui dashboard, pacientes, agenda, profissionais, convênios, RH e configurações. Até 5 usuários ativos e uma unidade. Financeiro, estoque e relatórios ficam de fora.",
      },
      {
        titulo: "Profissional",
        texto: "Inclui tudo do Essencial mais financeiro, estoque e relatórios. Até 20 usuários ativos e mais de uma unidade.",
      },
      {
        titulo: "Ilimitado",
        texto: "Inclui também Integrações e lembretes, Power BI e Agente de IA, sem teto de usuários. Power BI e Agente de IA ainda aparecem como área reservada: o plano libera o item, mas a tela completa entra nas próximas entregas.",
      },
    ],
    dicas: [
      "Se o menu mostra um cadeado e o texto Disponível no plano Profissional ou Ilimitado, a tela existe, mas o contrato atual não inclui o módulo.",
      "Ao estourar o limite de usuários, o administrador precisa inativar uma conta para criar outra. Nada é apagado sozinho.",
    ],
  },
  {
    slug: "dashboard",
    titulo: "Dashboard",
    grupo: "Operação",
    resumo: "Visão do dia e do mês logo depois do login.",
    acesso: "Todos os perfis. Indicadores financeiros só aparecem para quem tem o módulo Financeiro.",
    prints: [
      {
        arquivo: "dashboard.png",
        alt: "Dashboard da clínica",
        legenda: "Visão do dia e do mês, com atalhos para a agenda e para os relatórios.",
      },
    ],
    passos: [
      {
        titulo: "Leia os atalhos do topo",
        texto: "Ver relatórios abre a visão gerencial, se o seu perfil tiver esse módulo. Abrir agenda leva direto para a grade do dia.",
      },
      {
        titulo: "Acompanhe os cards",
        texto: "Você vê atendimentos de hoje, taxa de ocupação, taxa de faltas e novos pacientes do mês. Com permissão financeira também aparecem faturamento do mês, previsto para hoje, a receber em 7 dias e a pagar em 7 dias.",
      },
      {
        titulo: "Use as listas do dia",
        texto: "Próximos atendimentos mostra horário, paciente, procedimento, profissional, sala e status. Clique no nome para abrir a ficha. Aniversariantes do mês também abre a ficha da pessoa. Alertas de gestão (estoque, documentos, financeiro) só aparecem para quem vê o financeiro.",
      },
    ],
    dicas: [
      "O profissional de saúde não vê faturamento, contas nem gráficos financeiros no dashboard.",
    ],
  },
  {
    slug: "pacientes",
    titulo: "Pacientes",
    grupo: "Operação",
    resumo: "Cadastro, ficha, prontuário, documentos e extrato do paciente.",
    acesso: "Administrador, gestor e recepção criam e editam. Profissional de saúde vê e edita só os próprios pacientes. Financeiro consulta.",
    prints: [
      {
        arquivo: "pacientes.png",
        alt: "Listagem de pacientes",
        legenda: "Busca, filtros e o botão Novo paciente.",
      },
    ],
    passos: [
      {
        titulo: "Encontre um paciente",
        texto: "Em Pacientes, busque por nome, CPF ou telefone. Filtre por status (ativo, inativo, arquivado), convênio ou particular, profissional preferido e faixa etária. Clique na linha ou em Ver perfil para abrir a ficha. Exportar gera pacientes.csv.",
      },
      {
        titulo: "Cadastre um paciente novo",
        texto: "Clique em Novo paciente. Preencha dados pessoais (nome, CPF, data de nascimento e sexo são obrigatórios), contato (telefone obrigatório) e endereço. O CEP preenche logradouro, bairro, cidade e UF. Escolha Particular ou um convênio; no convênio, carteirinha e validade são obrigatórias. O aceite LGPD é obrigatório para salvar.",
      },
      {
        titulo: "Complete o que for opcional",
        texto: "Você pode informar responsável (menores ou dependentes), alergias, condições, medicações, profissional preferido, forma de contato preferida e autorização de uso de imagem. Alergia aparece em destaque na lista e na agenda.",
      },
      {
        titulo: "Navegue pelas abas da ficha",
        texto: "Visão geral mostra próximos agendamentos, últimas visitas e pendências. Acompanhamento é o prontuário. Histórico lista as consultas. Documentos guarda exames, laudos, receitas e termos (PDF, JPG ou PNG, até 10 MB). Financeiro mostra cobranças, gerar cobrança e registrar pagamento. Prontuário e documentos só aparecem para administrador, gestor e profissional de saúde.",
      },
      {
        titulo: "Registre o acompanhamento",
        texto: "No prontuário, abra ou crie um acompanhamento com queixa, quadro e objetivo. Cada registro pode ser avaliação inicial, evolução, retorno ou alta, com conduta, resposta ao tratamento e próximo retorno. Quem registra é o mesmo grupo que vê o prontuário.",
      },
      {
        titulo: "Arquive quando a pessoa não for mais atendida",
        texto: "No menu da linha, Arquivar pede confirmação e vale para paciente ativo, se você puder editar. O cadastro não é apagado: o status passa a Arquivado e some dos filtros de ativos.",
      },
    ],
    dicas: [
      "Agendar, na ficha ou no menu da linha, abre a agenda já com o paciente escolhido. Não dá para criar o paciente de dentro da agenda.",
      "O profissional de saúde só vê pacientes em que é o preferido ou que já atendeu.",
    ],
  },
  {
    slug: "agenda",
    titulo: "Agenda",
    grupo: "Operação",
    resumo: "Grade do dia, novo horário, status, bloqueio e lista de espera.",
    acesso: "Quem tem Agenda no perfil. O profissional de saúde vê somente a própria grade.",
    prints: [
      {
        arquivo: "agenda.png",
        alt: "Agenda da clínica",
        legenda: "Grade do dia, com lista de espera e bloqueio de horário.",
      },
    ],
    passos: [
      {
        titulo: "Escolha o período e os filtros",
        texto: "Alterne entre Dia, Semana e Mês e avance ou volte o período. Filtre por profissional, sala e status. As cores dos cartões seguem o status do horário. No dia, a grade se organiza em colunas por profissional.",
      },
      {
        titulo: "Marque um horário",
        texto: "Abra um horário vazio ou use Novo agendamento. O paciente já precisa existir em Pacientes: busque por nome, CPF ou telefone. Escolha profissional, procedimento, data, início e término. A duração padrão do procedimento preenche o fim. Informe a sala, particular ou convênio e as observações da recepção. O valor sai da tabela particular ou do convênio.",
      },
      {
        titulo: "Avance o status do atendimento",
        texto: "O caminho normal é Agendado, Confirmado, Check-in, Em atendimento e Atendido. Também é possível marcar Cancelado ou Faltou. Ao marcar Atendido, o sistema gera a cobrança se ela ainda não existir.",
      },
      {
        titulo: "Bloqueie um horário",
        texto: "Use Bloquear horário para almoço, folga ou indisponibilidade. Informe profissional, data, início, término e o motivo. O horário deixa de ficar livre para novos encaixes.",
      },
      {
        titulo: "Use a lista de espera",
        texto: "Em Lista de espera, registre paciente, período preferido (manhã, tarde ou qualquer), profissional e procedimento. Quando abrir um horário, encaixe a pessoa a partir dessa lista.",
      },
    ],
    dicas: [
      "Reagendar pode ser feito no painel do horário e, quando a visão permitir, arrastando o cartão.",
      "O lembrete de consulta sai pelo módulo Integrações, no plano Ilimitado. Sem esse módulo, o indicador de lembrete não dispara WhatsApp nem e-mail.",
    ],
  },
  {
    slug: "profissionais",
    titulo: "Profissionais",
    grupo: "Operação",
    resumo: "Cadastro de quem atende, grade, comissão e vínculo com o login.",
    acesso: "Administrador e gestor criam e editam. Recepção e financeiro só visualizam. O profissional de saúde não abre este módulo.",
    prints: [
      {
        arquivo: "profissionais.png",
        alt: "Listagem de profissionais",
        legenda: "Cadastro de quem atende, com especialidade, vínculo e comissão.",
      },
    ],
    passos: [
      {
        titulo: "Localize o profissional",
        texto: "Busque por nome, e-mail ou registro do conselho. Filtre por especialidade e status. A lista mostra vínculo (CLT, PJ ou autônomo) e o percentual de comissão. Exportar gera profissionais.csv.",
      },
      {
        titulo: "Cadastre quem atende",
        texto: "Em Novo profissional, preencha nome e contato, ao menos uma especialidade, conselho e número do registro. Defina o vínculo, a data de admissão e a forma de remuneração: fixo, comissão ou misto. Se houver comissão, o percentual é obrigatório.",
      },
      {
        titulo: "Monte a grade e os procedimentos",
        texto: "Em cada dia da semana, marque se atende e informe início e fim. É obrigatório ao menos um dia, e o fim precisa ser depois do início. Marque também os procedimentos que essa pessoa pode realizar: a agenda só oferece esses serviços para ela.",
      },
      {
        titulo: "Vincule o login, se for o caso",
        texto: "O cadastro clínico é diferente da conta de acesso. Para o perfil Profissional de saúde ver só a própria agenda e os próprios pacientes, associe a conta de usuário neste cadastro.",
      },
      {
        titulo: "Abra o perfil",
        texto: "As abas mostram visão geral, agenda da pessoa, pacientes atendidos, comissões da competência e documentos (contrato, conselho, certificações). Cada lista tem busca e exportação em CSV.",
      },
    ],
  },
  {
    slug: "financeiro",
    titulo: "Financeiro",
    grupo: "Gestão",
    resumo: "Receber, pagar, fluxo de caixa, lotes de convênio e comissões.",
    acesso: "Plano Profissional ou Ilimitado. Administrador, gestor e financeiro operam. Recepção registra recebimentos. Profissional de saúde não entra neste módulo.",
    prints: [
      { arquivo: "financeiro.png", alt: "Visão geral do financeiro", legenda: "Resumo de receber, pagar, fluxo e atalhos das subtelas." },
      { arquivo: "contas-a-receber.png", alt: "Contas a receber", legenda: "Cobranças dos pacientes, com baixa e geração de cobrança." },
      { arquivo: "contas-a-pagar.png", alt: "Contas a pagar", legenda: "Despesas da clínica e baixa de pagamento." },
      { arquivo: "fluxo-de-caixa.png", alt: "Fluxo de caixa", legenda: "Entradas e saídas já baixadas no período." },
      { arquivo: "faturamento-convenios.png", alt: "Faturamento de convênios", legenda: "Lotes por operadora e competência." },
      { arquivo: "comissoes.png", alt: "Comissões", legenda: "Cálculo, aprovação e fechamento da folha de comissões." },
    ],
    passos: [
      {
        titulo: "Comece pela visão geral",
        texto: "Os cards resumem o que está em aberto, atrasado, recebido e a vencer, tanto a receber quanto a pagar. Abaixo ficam o gráfico de fluxo de caixa, o DRE simplificado, a lista de inadimplentes e os atalhos das subtelas.",
      },
      {
        titulo: "Receba uma cobrança",
        texto: "Em Contas a receber, busque por paciente ou descrição e filtre por status, origem e forma de pagamento. Gerar cobrança pede paciente, descrição, valor, vencimento, particular ou convênio e o número de parcelas. Registrar pagamento faz a baixa em dinheiro, PIX, cartão, boleto ou convênio. Cobrança pendente com vencimento passado aparece como Atrasado. O atendimento marcado como Atendido também gera cobrança sozinho.",
      },
      {
        titulo: "Lance uma despesa",
        texto: "Em Contas a pagar, use Nova despesa: descrição, categoria, fornecedor, valor, vencimento e se é recorrente. Dar baixa registra o pagamento. Status possíveis: A pagar, Pago e Vencido.",
      },
      {
        titulo: "Leia o fluxo de caixa",
        texto: "Fluxo de caixa mostra o que realmente entrou e saiu, com base nas baixas, não no que ainda está previsto. Você vê o saldo do período e o gráfico diário ou mensal.",
      },
      {
        titulo: "Feche o lote do convênio",
        texto: "Em Faturamento de convênios, crie um lote com a operadora e a competência. Envie o lote e, na conciliação, informe o valor glosado e o valor recebido. Quando o lote é pago, as cobranças daquele lote são baixadas.",
      },
      {
        titulo: "Feche as comissões",
        texto: "Em Comissões, escolha a competência e clique em Calcular. O valor usa o percentual do cadastro do profissional sobre os atendimentos realizados. Depois aprove, pague e feche a folha. O fechamento gera uma despesa na categoria Comissões.",
      },
    ],
    dicas: [
      "O extrato financeiro dentro da ficha do paciente é outra tela: a recepção e o profissional de saúde podem ver o saldo daquela pessoa mesmo sem o menu Financeiro completo.",
    ],
  },
  {
    slug: "convenios",
    titulo: "Convênios",
    grupo: "Gestão",
    resumo: "Operadoras, prazo, autorização e tabela de preços.",
    acesso: "Administrador, gestor e financeiro criam e editam. Recepção e profissional de saúde só consultam. Disponível em todos os planos.",
    prints: [
      {
        arquivo: "convenios.png",
        alt: "Listagem de convênios",
        legenda: "Operadoras cadastradas, com registro ANS e status.",
      },
    ],
    passos: [
      {
        titulo: "Cadastre a operadora",
        texto: "Em Novo convênio, informe nome, registro ANS, prazo médio de pagamento (1 a 180 dias), se exige autorização prévia, contato e, se quiser, o endereço do portal. Deixe ativo para usar em pacientes e na agenda.",
      },
      {
        titulo: "Monte a tabela de preços",
        texto: "Abra o convênio e ajuste o valor de cada procedimento. Essa tabela é a que a agenda usa quando o atendimento não é particular. O preço particular continua em Configurações › Procedimentos.",
      },
      {
        titulo: "Veja quem está vinculado",
        texto: "O detalhe lista os pacientes daquela operadora e os indicadores da tabela. O faturamento em lote não fica aqui: ele é feito em Financeiro › Faturamento de convênios.",
      },
    ],
  },
  {
    slug: "estoque",
    titulo: "Estoque",
    grupo: "Gestão",
    resumo: "Produtos, entradas, saídas e itens abaixo do mínimo.",
    acesso: "Plano Profissional ou Ilimitado. Administrador e gestor movimentam. Profissional de saúde e financeiro só consultam. Recepção não vê o módulo.",
    prints: [
      {
        arquivo: "estoque.png",
        alt: "Estoque de produtos e insumos",
        legenda: "Itens, valor em estoque e alerta de quantidade abaixo do mínimo.",
      },
    ],
    passos: [
      {
        titulo: "Acompanhe os cards",
        texto: "A tela mostra itens ativos, valor em estoque, itens abaixo do mínimo e saídas do período. Produto abaixo do mínimo também dispara aviso no sino para quem pode ver o estoque.",
      },
      {
        titulo: "Cadastre o produto",
        texto: "Na aba Produtos e insumos, informe nome, categoria, unidade, quantidade, estoque mínimo, custo e fornecedor. Inativar tira o item das novas movimentações, sem apagar o histórico.",
      },
      {
        titulo: "Registre entrada ou saída",
        texto: "Em Movimentações, escolha o produto, o tipo, a quantidade, a data e o motivo. Saída pode ser ligada a um procedimento. O saldo não fica negativo.",
      },
      {
        titulo: "Consulte o consumo",
        texto: "A aba Consumo agrupa as saídas por produto, com a quantidade total e quantas vezes saiu. Cada aba exporta o próprio CSV.",
      },
    ],
  },
  {
    slug: "rh",
    titulo: "RH",
    grupo: "Gestão",
    resumo: "Ponto do dia e holerites da equipe.",
    acesso: "Disponível em todos os planos. Administrador e gestor veem a equipe. Os demais registram o próprio ponto e veem os próprios holerites.",
    prints: [
      { arquivo: "rh.png", alt: "Visão geral de RH", legenda: "Atalhos para o ponto e para os holerites." },
      { arquivo: "ponto.png", alt: "Controle de ponto", legenda: "Batidas de entrada, intervalo e saída." },
      { arquivo: "holerites.png", alt: "Holerites", legenda: "Contracheques por competência." },
    ],
    passos: [
      {
        titulo: "Abra a visão geral",
        texto: "RH resume o ponto e os holerites. Quem não é administrador ou gestor vê apenas o próprio dia e o atalho Meus holerites. A gestão vê a equipe e os botões Holerites e Controle de ponto.",
      },
      {
        titulo: "Bata o ponto",
        texto: "Em Controle de ponto (ou Meu ponto), o botão segue a sequência do dia: Entrada, Início do intervalo, Retorno do intervalo e Saída. Quando o dia fecha, o botão mostra Ponto completo. Você só registra o próprio horário. Ajuste manual de outra pessoa fica com quem tem permissão de editar o RH.",
      },
      {
        titulo: "Consulte o holerite",
        texto: "Em Holerites, filtre a competência. A equipe vê os contracheques enviados. Quem não gere o RH vê só os arquivos disponibilizados para a própria conta, com a situação Disponível ou Aguardando.",
      },
    ],
    dicas: [
      "O ponto é da conta de usuário, não do cadastro clínico em Profissionais. A pessoa precisa ter login ativo.",
    ],
  },
  {
    slug: "relatorios",
    titulo: "Relatórios",
    grupo: "Gestão",
    resumo: "Faturamento, atendimentos, inadimplência, pacientes, produtividade e comissões.",
    acesso: "Plano Profissional ou Ilimitado. Administrador, gestor e financeiro. Recepção e profissional de saúde não veem no padrão de fábrica.",
    prints: [
      {
        arquivo: "relatorios.png",
        alt: "Relatórios gerenciais",
        legenda: "Período, abas e exportação em CSV.",
      },
    ],
    passos: [
      {
        titulo: "Escolha o período",
        texto: "No topo, selecione este mês, mês anterior, últimos 30 dias, últimos 12 meses ou o ano corrente. O período vale para a aba aberta.",
      },
      {
        titulo: "Troque a aba",
        texto: "Faturamento mostra total, quantidade, ticket médio e a quebra por profissional, convênio e procedimento. Atendimentos mostra realizados, cancelados e faltas. Inadimplência lista cobranças vencidas. Novos × recorrentes compara cadastros novos com quem já frequentava. Produtividade resume cada profissional. Comissões lista o extrato do período.",
      },
      {
        titulo: "Exporte a tabela",
        texto: "Cada bloco tem gráfico, tabela e Exportar. O arquivo é CSV, com o nome do relatório, para abrir no Excel. Não é um PDF da tela.",
      },
    ],
  },
  {
    slug: "integracoes",
    titulo: "Integrações e lembretes",
    grupo: "Avançado",
    resumo: "WhatsApp oficial, e-mail e regras de lembrete da agenda.",
    acesso: "Plano Ilimitado. Fora desse plano o menu mostra cadeado. A configuração é do administrador ou de quem pode editar o módulo.",
    prints: [
      { arquivo: "integracoes.png", alt: "Dashboard de integrações", legenda: "Envios, custos e taxas do período." },
      { arquivo: "integracoes-config.png", alt: "Configuração de WhatsApp e e-mail", legenda: "Canais oficiais e conta de cobrança dos lembretes." },
      { arquivo: "lembretes.png", alt: "Regras de lembrete", legenda: "Regras e textos ligados aos agendamentos." },
      { arquivo: "historico-envios.png", alt: "Histórico de envios", legenda: "Auditoria de cada mensagem, com status e erro." },
    ],
    passos: [
      {
        titulo: "Leia o dashboard",
        texto: "A primeira tela resume envios, custos, sucesso, falha e agendamentos impactados. Filtre por período, canal, status e tipo. O atalho Histórico abre a auditoria; Configurações abre o cadastro dos canais.",
      },
      {
        titulo: "Configure WhatsApp e e-mail",
        texto: "Em Configurações, informe os dados da conta oficial da Meta (token, Phone Number ID, WABA e webhook) e o SMTP do e-mail. Escolha a conta de cobrança: conta da clínica, em que o pagamento fica no Gerenciador da Meta, ou repasse da plataforma, em que o custo é faturado depois. Ative ou desative os lembretes. A tabela de custo é só consulta.",
      },
      {
        titulo: "Crie a regra e o texto",
        texto: "Em Lembretes, cadastre regras como 24 horas antes, 2 horas antes, confirmação e cancelamento, sempre ligadas a um agendamento. O template é a mensagem daquele canal. Sem regra ativa, a agenda não dispara sozinha.",
      },
      {
        titulo: "Confira o histórico",
        texto: "Histórico de envios mostra paciente, profissional, canal, status, custo e, se falhou, o erro. Use essa tela quando alguém disser que não recebeu o lembrete.",
      },
    ],
    dicas: [
      "Não existe gateway de pagamento nem calendário externo neste módulo. O lembrete só sai para consultas que já estão na agenda.",
    ],
  },
  {
    slug: "em-breve",
    titulo: "Power BI e Agente de IA",
    grupo: "Avançado",
    resumo: "Itens visíveis no menu que ainda não operam no dia a dia.",
    acesso: "Aparecem para administrador e gestor. No plano abaixo do Ilimitado, a tela explica o cadeado. No Ilimitado, a tela avisa que a função entra nas próximas entregas.",
    prints: [
      { arquivo: "power-bi.png", alt: "Tela reservada do Power BI", legenda: "O item existe no menu, mas o painel externo ainda não está embutido." },
      { arquivo: "agente-ia.png", alt: "Tela reservada do Agente de IA", legenda: "O assistente ainda não responde dentro do sistema." },
    ],
    passos: [
      {
        titulo: "Power BI",
        texto: "O item reserva a conexão com painéis de agenda, faturamento e produtividade. Hoje a tela não embute o relatório. Enquanto isso, use Relatórios dentro do próprio sistema.",
      },
      {
        titulo: "Agente de IA",
        texto: "O item reserva um assistente para dúvidas da recepção. Ele ainda não responde no painel e não substitui o prontuário. Dúvidas de uso continuam neste manual.",
      },
    ],
    dicas: [
      "Se a equipe achar que o módulo quebrou, mostre esta tela: o cadeado ou o aviso Em breve é o comportamento esperado.",
    ],
  },
  {
    slug: "configuracoes",
    titulo: "Configurações",
    grupo: "Sistema",
    resumo: "Clínica, usuários, permissões, procedimentos, pagamentos e tema.",
    acesso: "Em geral só o administrador. Usuários e Perfis e permissões são exclusivos do administrador.",
    prints: [
      { arquivo: "clinica.png", alt: "Dados da clínica", legenda: "Identificação, endereço, logo e unidades." },
      { arquivo: "usuarios.png", alt: "Usuários", legenda: "Contas de acesso, perfil e unidades liberadas." },
      { arquivo: "procedimentos.png", alt: "Procedimentos", legenda: "Catálogo usado pela agenda, com duração e valor particular." },
      { arquivo: "pagamentos.png", alt: "Formas de pagamento", legenda: "Canais ativos e taxa informativa." },
      { arquivo: "estilizacao.png", alt: "Estilização", legenda: "Tema claro ou escuro da conta." },
    ],
    passos: [
      {
        titulo: "Atualize os dados da clínica",
        texto: "Em Dados da clínica, edite nome fantasia, razão social, CNPJ, telefone, e-mail e endereço. O CEP completa o logradouro. A logo aceita JPG, PNG ou WebP até 2 MB. O nome fantasia é o que aparece no menu.",
      },
      {
        titulo: "Cuide das unidades",
        texto: "Na mesma tela, cadastre nome e cidade de cada unidade. Dá para editar, inativar e reativar. A clínica precisa manter ao menos uma unidade ativa. Unidade nova fica liberada para os administradores e passa a aparecer no seletor da barra superior.",
      },
      {
        titulo: "Crie um usuário",
        texto: "Em Usuários, clique em novo e informe nome, e-mail (este é o login e não pode repetir), senha de no mínimo 8 caracteres, perfil e ao menos uma unidade. Ativar e inativar fica no menu da linha. Não inative a si mesmo nem o último administrador. Se o plano estiver no limite, inative outra conta antes de criar.",
      },
      {
        titulo: "Ajuste permissões",
        texto: "Em Perfis e permissões, escolha o perfil e marque Visualizar, Criar, Editar e Excluir em cada módulo. Salvar vale para todo mundo daquele perfil. Sem Visualizar, o módulo some do menu. O perfil Administrador permanece com acesso total.",
      },
      {
        titulo: "Mantenha o catálogo",
        texto: "Procedimentos define nome, categoria, duração (10 a 240 minutos), valor particular e status. A agenda usa a duração para fechar o horário. Formas de pagamento liga ou desliga dinheiro, PIX, cartões, boleto e convênio e guarda a taxa percentual só como informação. Clique em Salvar.",
      },
      {
        titulo: "Escolha o tema",
        texto: "Em Estilização, escolha Claro ou Escuro. A preferência fica na sua conta e vale em outro computador quando você entrar de novo. O mesmo controle existe no ícone da barra superior.",
      },
    ],
  },
];

export const grupos = ["Começar", "Operação", "Gestão", "Avançado", "Sistema"] as const;

export function capituloPorSlug(slug: string) {
  return capitulos.find((item) => item.slug === slug);
}
