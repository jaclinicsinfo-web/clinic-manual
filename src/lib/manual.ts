export type Print = {
  arquivo: string;
  alt: string;
  legenda: string;
};

export type Passo = {
  titulo: string;
  texto: string;
  imagens?: string[];
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
    resumo: "Primeiro acesso da clínica, entrada do dia a dia e troca de senha.",
    acesso: "Na primeira abertura, quem configura a clínica. Depois, qualquer pessoa com usuário ativo.",
    prints: [
      {
        arquivo: "setup-clinica.png",
        alt: "Primeiro acesso, passo da clínica, com os campos preenchidos",
        legenda: "Passo 1 de 3. Nome fantasia, razão social, CNPJ, telefone e e-mail da clínica.",
      },
      {
        arquivo: "setup-unidade.png",
        alt: "Primeiro acesso, passo da unidade, com nome e cidade preenchidos",
        legenda: "Passo 2 de 3. Nome da unidade e cidade.",
      },
      {
        arquivo: "setup-administrador.png",
        alt: "Primeiro acesso, passo do administrador, com nome, e-mail e senha preenchidos",
        legenda: "Passo 3 de 3. Nome, e-mail de acesso e senha do administrador.",
      },
      {
        arquivo: "entrar.png",
        alt: "Tela de login com e-mail, senha e manter conectado preenchidos",
        legenda: "Nos acessos seguintes: e-mail, senha, Manter conectado e Esqueci minha senha.",
      },
      {
        arquivo: "selecionar-unidade.png",
        alt: "Escolha da unidade depois do login",
        legenda: "Quando a conta tem mais de uma unidade, escolha onde trabalhar e clique em Continuar.",
      },
      {
        arquivo: "esqueci-senha.png",
        alt: "Formulário Esqueci minha senha com o e-mail preenchido",
        legenda: "Informe o e-mail da conta e clique em Enviar link.",
      },
      {
        arquivo: "esqueci-senha-enviado.png",
        alt: "Confirmação de que o link de senha foi solicitado",
        legenda: "A tela pede para verificar o e-mail. O link vale por 1 hora.",
      },
      {
        arquivo: "nova-senha.png",
        alt: "Formulário de nova senha com os dois campos preenchidos",
        legenda: "Nova senha e a confirmação, com no mínimo 8 caracteres.",
      },
      {
        arquivo: "link-invalido.png",
        alt: "Aviso de link de recuperação inválido",
        legenda: "Se o link vier incompleto, peça outro em Pedir novo link.",
      },
    ],
    passos: [
      {
        titulo: "Abra o painel pela primeira vez",
        imagens: ["setup-clinica.png"],
        texto: "Na primeira abertura, o sistema mostra Primeiro acesso, com três etapas: Clínica, Unidade e Administrador. No passo Clínica, preencha Nome fantasia, Razão social, CNPJ, Telefone e E-mail da clínica. Todos são obrigatórios. No exemplo, o nome fantasia é Clínica Vida Integrada, a razão social é Clínica Vida Integrada LTDA, o CNPJ é 11.222.333/0001-81, o telefone é (16) 3321-4500 e o e-mail é contato@clinicavida.com.br. Clique em Continuar.",
      },
      {
        titulo: "Cadastre a primeira unidade",
        imagens: ["setup-unidade.png"],
        texto: "No passo Unidade, preencha Nome da unidade e Cidade. No exemplo, a unidade é Sede Franca e a cidade é Franca. Voltar retorna aos dados da clínica. Continuar segue para o administrador. Essa é a unidade em que a clínica começa a operar.",
      },
      {
        titulo: "Crie o administrador e entre",
        imagens: ["setup-administrador.png"],
        texto: "No passo Administrador, preencha Nome do administrador, E-mail de acesso, Senha e Confirmar senha. No exemplo, o nome é Maria Silva e o e-mail de acesso é maria.silva@clinica.com.br. A senha tem no mínimo 8 caracteres e os dois campos precisam ser iguais. O ícone do olho mostra ou oculta o que foi digitado. Clique em Criar clínica e entrar. Essa conta já abre o painel como Administrador. As outras pessoas são cadastradas depois em Configurações › Usuários.",
      },
      {
        titulo: "Entre nos próximos acessos",
        imagens: ["entrar.png"],
        texto: "A partir daí, a tela se chama Entrar. Informe o E-mail e a Senha criados no primeiro acesso. Deixe Manter conectado marcado se este for o computador da clínica e você quiser permanecer logado. Clique em Entrar. O cadastro de um colega não fica nesta tela.",
      },
      {
        titulo: "Escolha a unidade, quando houver mais de uma",
        imagens: ["selecionar-unidade.png"],
        texto: "No primeiro acesso existe só a unidade que você acabou de criar, então o painel abre direto nela. Se a conta passar a ter outra unidade, o login para em Selecionar unidade. A saudação usa o seu primeiro nome. Cada opção mostra o nome e a cidade. Escolha a unidade do dia, por exemplo Sede Franca, e clique em Continuar. Agenda, pacientes e financeiro passam a valer para essa unidade. Voltar retorna ao formulário de entrada.",
      },
      {
        titulo: "Peça o link se esquecer a senha",
        imagens: ["esqueci-senha.png", "esqueci-senha-enviado.png"],
        texto: "Em Entrar, clique em Esqueci minha senha. Preencha o E-mail da conta, o mesmo do primeiro acesso, e clique em Enviar link. A tela seguinte, Verifique seu e-mail, avisa que, se o endereço estiver cadastrado, chega um link para redefinir a senha. O link vale por 1 hora. A mensagem aparece mesmo quando o e-mail não existe, para não revelar as contas da clínica. Voltar ao login retorna à entrada.",
      },
      {
        titulo: "Grave a nova senha",
        imagens: ["nova-senha.png"],
        texto: "Abra o link recebido. A tela Nova senha pede Nova senha e Confirmar senha, as duas obrigatórias, com no mínimo 8 caracteres e iguais entre si. Clique em Salvar senha e volte a entrar com essa senha. O link só pode ser usado uma vez.",
      },
      {
        titulo: "Peça outro link se o endereço vier quebrado",
        imagens: ["link-invalido.png"],
        texto: "Se o link abrir a tela Link inválido, com o aviso de que a recuperação está incompleta, clique em Pedir novo link e repita o e-mail. Isso também vale quando a hora já passou ou o link já foi usado.",
      },
    ],
    dicas: [
      "Conta inativa não entra. O administrador reativa em Configurações › Usuários.",
      "E-mail ou senha incorretos permanecem na tela Entrar, com o aviso para conferir os dados.",
      "Sem nenhuma unidade liberada, o sistema não abre o painel e pede para falar com o administrador.",
    ],
  },
  {
    slug: "painel",
    titulo: "O painel",
    grupo: "Começar",
    resumo: "O que você encontra logo depois de entrar: menu, unidade, avisos e o jeito das listas.",
    acesso: "Todos os perfis. O menu mostra só o que a sua conta pode ver.",
    prints: [
      {
        arquivo: "painel-menu.png",
        alt: "Painel com o menu aberto e o Dashboard",
        legenda: "Menu à esquerda, com o nome da clínica e o plano. Na barra: unidade, tema, sino e o seu nome.",
      },
      {
        arquivo: "painel-recolhido.png",
        alt: "Menu recolhido, só com ícones",
        legenda: "Recolher menu deixa só os ícones e libera espaço para a tela.",
      },
      {
        arquivo: "painel-celular.png",
        alt: "Menu aberto no celular",
        legenda: "No celular, o menu abre por cima da tela, com os mesmos grupos.",
      },
      {
        arquivo: "painel-unidade.png",
        alt: "Seletor de unidade aberto na barra superior",
        legenda: "A unidade do dia fica na barra. No primeiro acesso, a lista tem a unidade que você criou.",
      },
      {
        arquivo: "painel-sino.png",
        alt: "Sino de notificações aberto",
        legenda: "O ponto no sino indica avisos não lidos. Marcar lidas zera a contagem.",
      },
      {
        arquivo: "painel-conta.png",
        alt: "Menu do usuário com Estilização, Meu perfil e Sair",
        legenda: "O menu do seu nome mostra o e-mail da conta, Estilização, Meu perfil e Sair.",
      },
      {
        arquivo: "painel-lista.png",
        alt: "Lista de pacientes com busca e filtros",
        legenda: "Busca, filtros de status, profissional e idade, além de Colunas e Exportar.",
      },
      {
        arquivo: "painel-colunas.png",
        alt: "Menu Exibir colunas da lista",
        legenda: "Cada coluna marcada aparece na tabela. Desmarque para esconder.",
      },
      {
        arquivo: "painel-acoes.png",
        alt: "Menu de ações da linha do paciente",
        legenda: "Os três pontos da linha reúnem Ver perfil, Agendar, Editar e Arquivar.",
      },
    ],
    passos: [
      {
        titulo: "Entre e olhe o menu",
        imagens: ["painel-menu.png"],
        texto: "Depois do primeiro acesso, o painel abre no Dashboard. À esquerda, o menu traz o nome da clínica e o plano, neste caso Plano Ilimitado. Os grupos são Operação (Dashboard, Pacientes, Agenda e Profissionais), Gestão (Financeiro, Convênios, Estoque, RH e Relatórios), Avançado (Integrações e lembretes, Power BI e Agente de IA) e Sistema (Configurações). Financeiro, RH, Integrações e Configurações abrem um submenu. Na barra de cima ficam o caminho da página, a unidade, o ícone de tema, o sino e o seu nome com o perfil. O que o seu perfil não pode ver não aparece.",
      },
      {
        titulo: "Recolha o menu quando quiser mais espaço",
        imagens: ["painel-recolhido.png"],
        texto: "No rodapé do menu, clique em Recolher menu. Ele vira uma faixa de ícones e a área de trabalho aumenta. O ícone de baixo volta a expandir o menu.",
      },
      {
        titulo: "Abra o menu no celular",
        imagens: ["painel-celular.png"],
        texto: "Na tela estreita, o menu não fica fixo. Toque no botão de menu da barra superior. Ele abre por cima da página, com os mesmos grupos. Recolher menu fecha essa camada.",
      },
      {
        titulo: "Confira a unidade da sessão",
        imagens: ["painel-unidade.png"],
        texto: "O seletor da barra mostra onde você está trabalhando. No primeiro acesso só existe a unidade criada no cadastro, por exemplo Sede Franca. Se a conta ganhar outra unidade, ela entra nessa lista. Ao trocar, agenda, pacientes e financeiro passam a valer para a unidade escolhida.",
      },
      {
        titulo: "Leia o sino",
        imagens: ["painel-sino.png"],
        texto: "O ponto vermelho no sino indica aviso não lido. Ao abrir, o painel mostra o título Notificações, a quantidade e o botão Marcar lidas. Cada item traz o assunto, como despesa vencida ou produto abaixo do estoque mínimo. Clique no aviso para marcá-lo como lido e ir à tela relacionada.",
      },
      {
        titulo: "Troque o tema e saia pelo seu nome",
        imagens: ["painel-conta.png"],
        texto: "O ícone de lua, ao lado do sino, muda para o tema escuro. No tema escuro, o mesmo botão vira um sol e volta ao claro. Clique no seu nome para abrir o menu da conta: o e-mail, Estilização, Meu perfil e Sair. Estilização guarda a preferência de tema. Meu perfil, para o administrador, abre a lista de usuários. Sair encerra a sessão e volta para a tela Entrar.",
      },
      {
        titulo: "Use a busca e os filtros das listas",
        imagens: ["painel-lista.png"],
        texto: "As listas seguem o mesmo desenho. Em Pacientes, a busca pede nome, CPF ou telefone. Os filtros são Todo status, Todo profissional e Toda idade. Exportar baixa um CSV das linhas filtradas, com as colunas visíveis, para abrir no Excel. O cabeçalho da coluna ordena a tabela. Embaixo ficam a contagem, por exemplo Exibindo 1–1 de 1 registro, e os botões Anterior e Próxima. Se nada corresponder, a tela diz Nenhum paciente encontrado.",
      },
      {
        titulo: "Mostre só as colunas que importam",
        imagens: ["painel-colunas.png"],
        texto: "Clique em Colunas. O menu Exibir colunas lista Paciente, Telefone, Convênio, Último atendimento, Próximo agendamento, Em aberto e Status. A caixa marcada aparece na tabela. Desmarque para esconder. O arquivo do Exportar sai só com as colunas que ficaram visíveis.",
      },
      {
        titulo: "Abra as ações da linha",
        imagens: ["painel-acoes.png"],
        texto: "Os três pontos no fim da linha concentram o que dá para fazer com aquele registro. Em Pacientes, as opções são Ver perfil, Agendar, Editar e Arquivar. Arquivar pede confirmação e não apaga o histórico. Clique na linha também abre o perfil.",
      },
    ],
    dicas: [
      "Se um módulo sumiu do menu, em geral é o perfil ou o plano, não um defeito. Os capítulos Perfis de acesso e Planos explicam isso.",
      "Os números do Dashboard, como atendimentos e faturamento, ficam no capítulo seguinte.",
    ],
  },
  {
    slug: "perfis",
    titulo: "Perfis de acesso",
    grupo: "Começar",
    resumo: "O que cada um dos cinco perfis pode visualizar, criar, editar e desativar.",
    acesso: "A matriz vale para toda a clínica. Só o administrador abre Perfis e permissões.",
    prints: [
      {
        arquivo: "permissoes.png",
        alt: "Matriz de permissões do perfil Administrador, com as quatro colunas marcadas",
        legenda: "Administrador no Plano Ilimitado. As treze linhas ficam marcadas e Salvar fica indisponível.",
      },
      {
        arquivo: "permissoes-plano.png",
        alt: "Matriz de permissões no Plano Essencial, com cadeado nas linhas fora do contrato",
        legenda: "Plano Essencial. Financeiro, Estoque e Relatórios pedem o Profissional. Integrações e lembretes, Power BI e Agente de IA pedem o Ilimitado.",
      },
      {
        arquivo: "permissoes-financeiro.png",
        alt: "Matriz de permissões do perfil Financeiro",
        legenda: "Financeiro. As quatro marcas em Financeiro; Convênios vai até Editar.",
      },
      {
        arquivo: "permissoes-gestor.png",
        alt: "Matriz de permissões do perfil Gestor",
        legenda: "Gestor. Configurações fica vazia. Agenda, RH e Integrações e lembretes têm as quatro marcas.",
      },
      {
        arquivo: "permissoes-profissional.png",
        alt: "Matriz de permissões do perfil Profissional de saúde",
        legenda: "Profissional de saúde. Pacientes tem Visualizar e Editar. Agenda tem Visualizar, Criar e Editar.",
      },
      {
        arquivo: "permissoes-recepcao.png",
        alt: "Matriz de permissões do perfil Recepção",
        legenda: "Recepção. Pacientes e Agenda têm Visualizar, Criar e Editar. Financeiro e RH têm Visualizar e Criar.",
      },
    ],
    passos: [
      {
        titulo: "Abra a matriz no perfil Administrador",
        imagens: ["permissoes.png"],
        texto: "No menu, abra Configurações e clique em Perfis e permissões. A mesma aba fica no topo da página, entre Usuários e Procedimentos. As outras abas são Dados da clínica, Procedimentos, Pagamentos e Estilização. O título é Perfis e permissões. O texto de apoio diz: Matriz de acesso por módulo: visualizar, criar, editar e desativar. As regras vêm do perfil real do usuário na clínica. O cartão Matriz de permissões abre no seletor Perfil, em Administrador, com o botão Salvar. A descrição é Acesso total ao sistema. Perfil de sistema — alterações valem para todos os usuários deste perfil. O administrador sempre tem acesso total. Desativar controla inativar, arquivar e remover. A tabela lista sempre treze linhas: Dashboard, Pacientes, Agenda, Profissionais, Financeiro, Convênios, Estoque, Relatórios, RH, Configurações, Integrações e lembretes, Power BI e Agente de IA. As colunas são Módulo, Visualizar, Criar, Editar e Desativar. Nesta clínica o plano é Ilimitado, então as quatro caixas de cada linha estão marcadas e bloqueadas. Salvar fica indisponível. Esse perfil permanece com acesso total.",
      },
      {
        titulo: "Reconheça o cadeado do plano",
        imagens: ["permissoes-plano.png"],
        texto: "A tabela continua com as treze linhas no Essencial e no Profissional. O módulo de fora do contrato permanece na lista, com cadeado. O cartão avisa: Módulo fora do plano aparece com cadeado: as caixas ficam desligadas e não entram ao salvar. A frase ao lado do cadeado é Disponível no plano Profissional ou Disponível no plano Ilimitado. As quatro caixas dessa linha ficam vazias e não aceitam clique. No Essencial, Financeiro, Estoque e Relatórios pedem o plano Profissional. Integrações e lembretes, Power BI e Agente de IA pedem o Ilimitado. No Profissional, só essas três últimas ficam com cadeado. No menu à esquerda, os mesmos módulos aparecem com cadeado. A aba Pagamentos sai no Essencial, porque depende do módulo Financeiro. Quando o módulo está no plano, Dashboard, Relatórios, Power BI e Agente de IA seguem com Criar, Editar e Desativar bloqueados: só Visualizar aceita clique.",
      },
      {
        titulo: "Veja o perfil Financeiro",
        imagens: ["permissoes-financeiro.png"],
        texto: "Abra o seletor Perfil. A lista, em ordem alfabética, é Administrador, Financeiro, Gestor, Profissional de saúde e Recepção. O menu da esquerda continua o do seu login: o seletor só troca a matriz. Escolha Financeiro. A frase passa a ser Gestão financeira e convênios, e o aviso de perfil de sistema permanece. Salvar fica disponível. Visualizar está marcado em Dashboard, Pacientes, Agenda, Profissionais, Financeiro, Convênios, Estoque, Relatórios e RH. Financeiro tem as quatro marcas. Convênios tem Visualizar, Criar e Editar. RH tem Visualizar e Criar. Configurações, Integrações e lembretes, Power BI e Agente de IA ficam com Visualizar vazio. Em Dashboard, Relatórios, Power BI e Agente de IA, Criar, Editar e Desativar ficam bloqueados em qualquer perfil: só Visualizar aceita clique.",
      },
      {
        titulo: "Veja o perfil Gestor",
        imagens: ["permissoes-gestor.png"],
        texto: "Escolha Gestor. A frase é Gerencia a operação da clínica e o perfil de outros usuários. Visualizar está marcado em todos os módulos, e Configurações fica com as quatro caixas vazias. Agenda, RH e Integrações e lembretes têm as quatro marcas. Pacientes, Profissionais, Financeiro, Convênios e Estoque têm Visualizar, Criar e Editar. Dashboard, Relatórios, Power BI e Agente de IA ficam só com Visualizar.",
      },
      {
        titulo: "Veja o perfil Profissional de saúde",
        imagens: ["permissoes-profissional.png"],
        texto: "Escolha Profissional de saúde. A frase é Atendimento clínico e agenda. Visualizar está marcado em Dashboard, Pacientes, Agenda, Convênios, Estoque e RH. Pacientes também tem Editar. Agenda também tem Criar e Editar. RH também tem Criar. Profissionais, Financeiro, Relatórios, Configurações, Integrações e lembretes, Power BI e Agente de IA ficam com Visualizar vazio, e esses módulos saem do menu de quem usa este perfil.",
      },
      {
        titulo: "Veja o perfil Recepção",
        imagens: ["permissoes-recepcao.png"],
        texto: "Escolha Recepção. A frase é Atendimento, agendamento e cadastro de pacientes. Visualizar está marcado em Dashboard, Pacientes, Agenda, Profissionais, Financeiro, Convênios e RH. Pacientes e Agenda também têm Criar e Editar. Financeiro e RH também têm Criar. Estoque, Relatórios, Configurações, Integrações e lembretes, Power BI e Agente de IA ficam com Visualizar vazio.",
      },
      {
        titulo: "Grave a alteração de um perfil",
        texto: "Fora do Administrador, marque ou desmarque uma caixa que aceite clique e clique em Salvar. O texto do cartão avisa que a alteração vale para todos os usuários daquele perfil. A linha com cadeado de plano fica de fora: Salvar mantém o que já estava gravado nela. Não há botão de perfil novo: a lista permanece nesses cinco.",
      },
    ],
    dicas: [
      "A aba Perfis e permissões só entra no menu do administrador.",
      "A marca Visualizar é a que coloca o módulo no menu. Caixa bloqueada não muda.",
      "No Essencial e no Profissional, a linha fora do contrato fica com cadeado e caixas vazias. Salvar não grava essa linha.",
    ],
  },
  {
    slug: "planos",
    titulo: "Planos",
    grupo: "Começar",
    resumo: "O que o contrato libera no menu, e a tela que abre quando o módulo está com cadeado.",
    acesso: "O plano é da clínica, definido no contrato. Ninguém troca o plano dentro do painel.",
    prints: [
      {
        arquivo: "planos-menu.png",
        alt: "Menu do Plano Ilimitado, sem cadeado",
        legenda: "O selo Plano Ilimitado fica sob o nome da clínica. Neste contrato o menu abre todos os grupos.",
      },
      {
        arquivo: "planos-essencial.png",
        alt: "Menu do Plano Essencial com cadeado em Financeiro e o texto Disponível no plano Profissional",
        legenda: "No Essencial, o balão de Financeiro diz Disponível no plano Profissional.",
      },
      {
        arquivo: "planos-bloqueado.png",
        alt: "Tela do Financeiro bloqueada no Plano Essencial",
        legenda: "Ao abrir o item com cadeado, a página pede upgrade para o Profissional.",
      },
      {
        arquivo: "planos-profissional.png",
        alt: "Menu do Plano Profissional com cadeado em Integrações e lembretes",
        legenda: "No Profissional, Financeiro abre. O cadeado fica em Integrações e lembretes, Power BI e Agente de IA.",
      },
      {
        arquivo: "planos-power-bi.png",
        alt: "Tela do Power BI com o aviso Em breve neste plano",
        legenda: "No Ilimitado, Power BI abre com o aviso Em breve neste plano.",
      },
      {
        arquivo: "planos-agente.png",
        alt: "Tela do Agente de IA com o aviso Em breve neste plano",
        legenda: "Agente de IA usa o mesmo aviso, com a lista do assistente.",
      },
      {
        arquivo: "planos-usuarios.png",
        alt: "Lista de usuários com a etiqueta Ilimitado, 7 usuários, sem limite",
        legenda: "A etiqueta do plano fica em Configurações › Usuários. Nesta clínica: Ilimitado · 7 usuários · sem limite.",
      },
      {
        arquivo: "planos-unidades.png",
        alt: "Cartão Unidades no Plano Ilimitado, com Nova unidade disponível",
        legenda: "No Ilimitado, o cartão Unidades diz que as filiais entram no seletor da barra. Nova unidade fica disponível.",
      },
      {
        arquivo: "planos-unidade-essencial.png",
        alt: "Cartão Unidades no Plano Essencial, com Nova unidade indisponível",
        legenda: "No Essencial, o texto é O plano Essencial inclui 1 unidade. Nova unidade fica indisponível.",
      },
    ],
    passos: [
      {
        titulo: "Leia o selo do plano no menu",
        imagens: ["planos-menu.png"],
        texto: "O selo fica no menu, debaixo do nome da clínica. Nesta clínica ele diz Plano Ilimitado. Os grupos Operação, Gestão, Avançado e Sistema aparecem sem cadeado. No Dashboard, o botão Ver relatórios fica ao lado de Abrir agenda, e os cards de faturamento, previsto para hoje, a receber e a pagar entram na página.",
      },
      {
        titulo: "No Essencial, passe o mouse no cadeado",
        imagens: ["planos-essencial.png"],
        texto: "Com o Plano Essencial, o selo muda e seis itens ganham cadeado: Financeiro, Estoque, Relatórios, Integrações e lembretes, Power BI e Agente de IA. O balão de Financeiro diz Disponível no plano Profissional. Estoque e Relatórios usam a mesma frase. Integrações e lembretes, Power BI e Agente de IA pedem o plano Ilimitado. Convênios e RH continuam sem cadeado. O Dashboard deixa de mostrar Ver relatórios e os cards de dinheiro.",
      },
      {
        titulo: "Abra o item com cadeado",
        imagens: ["planos-bloqueado.png"],
        texto: "Clique em Financeiro. A página mantém o título e a descrição Visão consolidada de recebimentos, despesas, convênios e comissões da clínica. No centro, o cadeado e o título Disponível no plano Profissional. O texto diz: O plano Essencial não inclui este módulo. Faça upgrade para Profissional para liberar o acesso. A lista traz Contas a receber, a pagar e fluxo de caixa, Faturamento de convênios e Comissões dos profissionais.",
      },
      {
        titulo: "No Profissional, o cadeado fica no grupo Avançado",
        imagens: ["planos-profissional.png"],
        texto: "O selo passa a Plano Profissional. Financeiro, Estoque e Relatórios perdem o cadeado e voltam a abrir submenu. Ver relatórios e os cards de dinheiro retornam ao Dashboard. Integrações e lembretes, Power BI e Agente de IA continuam com cadeado. O balão de Integrações e lembretes diz Disponível no plano Ilimitado.",
      },
      {
        titulo: "No Ilimitado, abra Power BI",
        imagens: ["planos-power-bi.png"],
        texto: "Com o Plano Ilimitado, Power BI entra no menu sem cadeado. A tela se chama Power BI, com a descrição Painéis gerenciais com os dados da clínica no Power BI. O aviso é Em breve neste plano. O texto diz: Esta área já está liberada no seu plano. A implementação entra nas próximas entregas. A lista é Conexão com o workspace da clínica, Indicadores de agenda, faturamento e produtividade, e Atualização automática dos conjuntos de dados.",
      },
      {
        titulo: "Abra o Agente de IA",
        imagens: ["planos-agente.png"],
        texto: "Agente de IA segue o mesmo aviso Em breve neste plano e a mesma frase de que a área já está liberada e a implementação entra nas próximas entregas. A descrição é Assistente da clínica para rotinas, dúvidas operacionais e apoio à recepção. A lista é Respostas sobre agenda, pacientes e procedimentos, Sugestões de encaixe e confirmação de consultas, e Apoio à equipe sem substituir o prontuário clínico.",
      },
      {
        titulo: "Conte os usuários na etiqueta do plano",
        imagens: ["planos-usuarios.png"],
        texto: "Em Configurações › Usuários, o texto de apoio diz: Contas com acesso ao painel. O limite segue o plano configurado no deploy. A etiqueta desta clínica é Ilimitado · 7 usuários · sem limite. Novo usuário fica disponível. No Essencial o teto é 5 usuários ativos. No Profissional, 20. Passou do teto, a etiqueta muda de tom e Novo usuário espera o administrador inativar o excesso. As contas permanecem.",
      },
      {
        titulo: "Veja quantas unidades o plano aceita",
        imagens: ["planos-unidades.png", "planos-unidade-essencial.png"],
        texto: "Em Configurações › Dados da clínica, o cartão Unidades muda com o contrato. No Ilimitado, a frase é Filiais disponíveis no seletor da topbar (multi-unidade). Nova unidade fica disponível. Nesta clínica a lista tem Sede Franca, cidade Franca, status Ativo. No Essencial, a frase é O plano Essencial inclui 1 unidade. Faça upgrade para cadastrar filiais. Nova unidade fica indisponível, com o aviso Limite do plano atingido. A aba Pagamentos também sai, porque depende do módulo Financeiro. No Profissional, o cartão volta ao texto de filiais, como no Ilimitado.",
      },
    ],
    dicas: [
      "O cadeado do menu aparece para administrador e gestor. Os outros perfis não veem esses itens.",
      "A matriz de permissões mostra a mesma trava, com as caixas da linha desligadas. O capítulo Perfis de acesso descreve o Salvar.",
    ],
  },
  {
    slug: "dashboard",
    titulo: "Dashboard",
    grupo: "Operação",
    resumo: "Visão do dia e do mês, e o que cada perfil enxerga.",
    acesso: "Todos os perfis. Gestor e Financeiro veem a mesma tela do administrador.",
    prints: [
      {
        arquivo: "dashboard.png",
        alt: "Dashboard do administrador, com cards de dinheiro e Ver relatórios",
        legenda: "Administrador. Gestor e Financeiro abrem esta mesma página.",
      },
      {
        arquivo: "dashboard-listas.png",
        alt: "Funil, agenda do dia, alertas e aniversariantes no dashboard",
        legenda: "Abaixo dos cards: profissional, funil, agenda do dia, alertas e aniversariantes.",
      },
      {
        arquivo: "dashboard-recepcao.png",
        alt: "Dashboard da recepção, sem o botão Ver relatórios",
        legenda: "Recepção. Sem Ver relatórios e sem os cards de dinheiro.",
      },
      {
        arquivo: "dashboard-profissional.png",
        alt: "Dashboard do profissional de saúde, sem faturamento nem alertas",
        legenda: "Profissional de saúde. Os quatro cards da operação numa fileira só.",
      },
    ],
    passos: [
      {
        titulo: "Abra a visão do administrador",
        imagens: ["dashboard.png"],
        texto: "O painel abre no Dashboard, com Ver relatórios e Abrir agenda. Os cards reúnem o dia e o mês. Faturamento alterna 30 dias e 12 meses. Ao lado, Convênio x Particular. Gestor e Financeiro veem esta mesma tela.",
      },
      {
        titulo: "Desça até a agenda e os avisos",
        imagens: ["dashboard-listas.png"],
        texto: "Abaixo ficam os atendimentos por profissional, o funil, os próximos horários, os alertas e os aniversariantes. Sem horário restante, a frase é Nenhum atendimento restante hoje. Sem aniversariante, Nenhum aniversariante neste mês.",
      },
      {
        titulo: "Compare com a recepção",
        imagens: ["dashboard-recepcao.png"],
        texto: "Na Recepção, Ver relatórios sai, junto com faturamento, contas, gráficos de dinheiro e alertas. O menu Financeiro continua, para o caixa. A fileira fica com atendimentos, ocupação, faltas e novos pacientes.",
      },
      {
        titulo: "Compare com o profissional de saúde",
        imagens: ["dashboard-profissional.png"],
        texto: "No Profissional de saúde a fileira fica com atendimentos, ocupação, faltas e novos pacientes. Sem faturamento, contas, gráficos de dinheiro nem alertas. Abaixo, a barra é só a dele e o funil da agenda dele.",
      },
    ],
    dicas: [
      "No Plano Essencial, Ver relatórios e os cards de dinheiro também saem. O capítulo Planos mostra o cadeado.",
    ],
  },
  {
    slug: "pacientes",
    titulo: "Pacientes",
    grupo: "Operação",
    resumo: "Cadastro, ficha, acompanhamento, documentos e extrato do paciente.",
    acesso: "Administrador cria, edita e arquiva. Gestor e recepção criam e editam. Profissional de saúde vê e edita só quem o tem como preferido ou já tem horário com ele. Financeiro consulta.",
    prints: [
      {
        arquivo: "pacientes.png",
        alt: "Listagem de pacientes com busca, filtros e Novo paciente",
        legenda: "Cards do cadastro, busca por nome, CPF ou telefone, e o menu da linha.",
      },
      {
        arquivo: "pacientes-pessoais.png",
        alt: "Novo paciente, seção Dados pessoais preenchida",
        legenda: "Nome completo, CPF, nascimento e sexo levam asterisco.",
      },
      {
        arquivo: "pacientes-contato.png",
        alt: "Novo paciente, contato e endereço preenchidos a partir do CEP",
        legenda: "O CEP preenche logradouro, bairro, cidade e UF.",
      },
      {
        arquivo: "pacientes-convenio.png",
        alt: "Novo paciente, convênio Unimed com carteirinha e validade",
        legenda: "Fora de Particular, aparecem número e validade da carteirinha.",
      },
      {
        arquivo: "pacientes-responsavel.png",
        alt: "Novo paciente, responsável legal e dados clínicos em etiquetas",
        legenda: "A caixa do responsável abre nome, CPF, parentesco e telefone.",
      },
      {
        arquivo: "pacientes-clinicos.png",
        alt: "Novo paciente, preferências, observações e consentimentos marcados",
        legenda: "Enter grava cada etiqueta. O aceite da LGPD precisa estar marcado para cadastrar.",
      },
      {
        arquivo: "pacientes-visao.png",
        alt: "Ficha do paciente na aba Visão geral",
        legenda: "Cabeçalho, próximos agendamentos, resumo clínico e saldo.",
      },
      {
        arquivo: "pacientes-prontuario.png",
        alt: "Aba Acompanhamento sem registros e o botão Nova evolução",
        legenda: "Sem acompanhamento formal, a aba pede a primeira avaliação.",
      },
      {
        arquivo: "pacientes-evolucao.png",
        alt: "Diálogo Registrar evolução clínica com os campos preenchidos",
        legenda: "Avaliação inicial, queixa, quadro, conduta, resposta, dor e retorno.",
      },
      {
        arquivo: "pacientes-historico.png",
        alt: "Aba Histórico com totais e a lista de atendimentos",
        legenda: "Período, status e as colunas de data, procedimento e valor.",
      },
      {
        arquivo: "pacientes-documentos.png",
        alt: "Aba Documentos sem arquivos e o botão Anexar documento",
        legenda: "A lista vazia repete o botão de anexo.",
      },
      {
        arquivo: "pacientes-anexar.png",
        alt: "Diálogo Anexar documento com tipo Laudo e um PDF escolhido",
        legenda: "Tipo obrigatório e arquivo PDF, JPG ou PNG de até 10 MB.",
      },
      {
        arquivo: "pacientes-financeiro.png",
        alt: "Aba Financeiro com cards e a lista de cobranças",
        legenda: "Saldo, recebido, em aberto e em atraso. A linha atrasada tem Receber.",
      },
      {
        arquivo: "pacientes-cobranca.png",
        alt: "Diálogo Gerar cobrança preenchido como lançamento avulso",
        legenda: "Origem Cobrança avulsa, descrição, valor e vencimento.",
      },
      {
        arquivo: "pacientes-recebimento.png",
        alt: "Diálogo Registrar recebimento com valor e PIX",
        legenda: "O valor vem da cobrança. A forma abre em PIX.",
      },
    ],
    passos: [
      {
        titulo: "Encontre um paciente",
        imagens: ["pacientes.png"],
        texto: "Em Pacientes, o texto é Cadastro, acompanhamento e situação financeira dos pacientes da clínica. Os cards são Total de pacientes, Pacientes ativos (com inativos e arquivados), Com pendência financeira e Valor em aberto. Busque por nome, CPF ou telefone. Os filtros são Todo status (Ativos, Inativos, Arquivados), Todo profissional e Toda idade (Até 17 anos, 18 a 59 anos, 60+ anos). A tabela traz Paciente, Telefone, Convênio, Último atendimento, Próximo agendamento, Em aberto e Status. Com alergia, a linha mostra Alergia em vermelho. O menu da linha tem Ver perfil, Agendar, Editar e Arquivar. Clique na linha para abrir a ficha. Exportar gera pacientes.csv.",
      },
      {
        titulo: "Preencha os dados pessoais",
        imagens: ["pacientes-pessoais.png"],
        texto: "Clique em Novo paciente. O texto pede os dados cadastrais, clínicos e os consentimentos exigidos pela LGPD. Em Dados pessoais, Nome completo, CPF, Data de nascimento e Sexo são obrigatórios. Sexo é Masculino, Feminino ou Outro. Estado civil é Solteiro(a), Casado(a), Divorciado(a), Viúvo(a) ou União estável. RG e Profissão ficam livres.",
      },
      {
        titulo: "Informe contato e endereço",
        imagens: ["pacientes-contato.png"],
        texto: "Telefone é obrigatório. WhatsApp e E-mail são livres. No CEP, a dica é O endereço é preenchido automaticamente: ao sair do campo, logradouro, bairro, cidade e UF entram sozinhos. Número é obrigatório. Complemento é livre. Cancelar volta à lista. Cadastrar paciente grava e abre a ficha.",
      },
      {
        titulo: "Escolha particular ou convênio",
        imagens: ["pacientes-convenio.png"],
        texto: "A seção diz: Opcional. Deixe como particular quando não houver plano de saúde. Convênio / plano começa em Particular e lista os convênios ativos, por exemplo Unimed. Fora de Particular, entram Número da carteirinha e Validade da carteirinha. Os dois são opcionais.",
      },
      {
        titulo: "Informe o responsável, se houver",
        imagens: ["pacientes-responsavel.png"],
        texto: "A seção Responsável diz: Obrigatório para pacientes menores de idade ou dependentes. Marque Este paciente possui responsável legal para abrir os campos. Nome do responsável passa a ser obrigatório. CPF do responsável, Parentesco (o exemplo é Mãe, pai, tutor...) e Telefone do responsável são livres.",
      },
      {
        titulo: "Feche com o clínico e os consentimentos",
        imagens: ["pacientes-clinicos.png"],
        texto: "Em Dados clínicos gerais, a dica é Pressione Enter para adicionar cada item. Os campos são Alergias, Condições preexistentes e Medicações em uso. Em Preferências, Profissional preferido começa em Sem preferência e Forma de contato preferida começa em WhatsApp (também Telefone e E-mail). Observações gerais é um texto livre. Em Consentimentos, a frase é Exigidos pela LGPD antes do primeiro atendimento. Marque O paciente aceitou o termo de tratamento de dados pessoais (LGPD). Sem essa caixa, o cadastro não salva. A autorização de imagem é opcional: O paciente autorizou o uso de imagem para fins clínicos e de divulgação. Editar, na ficha, reabre este formulário com o botão Salvar alterações.",
      },
      {
        titulo: "Leia a visão geral",
        imagens: ["pacientes-visao.png"],
        texto: "A ficha abre em Visão geral. O cabeçalho mostra o status, a idade, o CPF mascarado, o convênio, a alergia em selo vermelho e Em aberto, além de telefone, e-mail e bairro. Os botões são Editar e Agendar. As abas são Visão geral, Acompanhamento, Histórico, Documentos e Financeiro. Próximos agendamentos diz Consultas e procedimentos futuros. Sem horário, a frase é Nenhum agendamento futuro, e o texto pede o botão Agendar. Últimas visitas diz Evoluções registradas no prontuário. Sem registro, Nenhum atendimento registrado. O resumo clínico lista alergias, condições e medicações. Situação financeira mostra Saldo devedor, Cobranças em aberto e Ver extrato completo. Dados cadastrais traz nascimento, sexo, estado civil, convênio, validade da carteirinha, profissional preferido, responsável e a data de cadastro.",
      },
      {
        titulo: "Abra o acompanhamento",
        imagens: ["pacientes-prontuario.png"],
        texto: "A aba Acompanhamento é o prontuário. Sem um acompanhamento formal, o título é Linha do tempo clínica e o texto diz que os atendimentos avulsos aparecem abaixo. O vazio diz Prontuário sem registros e pede a primeira avaliação para acompanhar a evolução até a alta. O botão é Nova evolução. Quem só visualiza Pacientes vê a aba e não vê esse botão.",
      },
      {
        titulo: "Registre a evolução ou a alta",
        imagens: ["pacientes-evolucao.png"],
        texto: "Nova evolução abre Registrar evolução clínica, com o nome do paciente. Sem acompanhamento anterior, Tipo de registro abre em Avaliação inicial. As opções são Avaliação inicial, Evolução, Retorno e Alta. Procedimento realizado e Profissional responsável são obrigatórios. Preencha Queixa / motivo, Como o paciente está hoje, Evolução / observações e Conduta. Resposta ao tratamento é Melhorou, Estável, Piorou ou Resolvido. Dor (EVA 0–10) traz a dica Opcional. Útil em reabilitação. Próximo retorno sugerido é uma data. O botão é Salvar evolução. Em Alta, o título passa a Registrar alta, o quadro passa a Situação na alta, resposta e retorno saem, e o botão passa a Confirmar alta. Depois da alta, o botão da aba fica Acompanhamento encerrado.",
      },
      {
        titulo: "Consulte o histórico",
        imagens: ["pacientes-historico.png"],
        texto: "Histórico resume Atendimentos realizados, Cancelamentos, Faltas e Taxa de faltas (Sobre o total de agendamentos). Busque por procedimento ou profissional. O período é Todo o período, Últimos 30 dias, Últimos 6 meses ou Últimos 12 meses. O status é Todo status, Atendidos, Agendados, Confirmados, Cancelados ou Faltas. As colunas são Data, Tipo, Procedimento, Profissional, Origem, Valor e Status. Exportar baixa o CSV dessa lista.",
      },
      {
        titulo: "Veja os documentos",
        imagens: ["pacientes-documentos.png"],
        texto: "Documentos abre em Documentos e anexos e conta os arquivos vinculados ao paciente. Sem arquivo, o título é Nenhum documento anexado e o texto pede exames, laudos e termos assinados. Anexar documento fica no topo e de novo no vazio. Quem só visualiza Pacientes vê a lista e não vê o botão.",
      },
      {
        titulo: "Anexe um arquivo",
        imagens: ["pacientes-anexar.png"],
        texto: "O diálogo Anexar documento pede Tipo de documento e Arquivo. Os tipos são Exame laboratorial, Exame de imagem, Laudo, Receita, Atestado, Termo de consentimento e Documento pessoal. A dica do arquivo é PDF, JPG ou PNG de até 10 MB. Enviar grava. Cancelar fecha. Excluir o arquivo pede confirmação e só aparece para quem tem Desativar em Pacientes.",
      },
      {
        titulo: "Abra o extrato",
        imagens: ["pacientes-financeiro.png"],
        texto: "A aba Financeiro entra para quem tem o módulo Financeiro. O profissional de saúde não a vê. O botão é Gerar cobrança. Os cards são Saldo devedor, Recebido (com a quantidade de cobranças quitadas), Cobranças em aberto e Em atraso (com a quantidade de lançamentos). Busque por Buscar cobrança... e filtre Todo status, Pendente, Atrasado, Pago ou Parcelado. As colunas são Descrição, Valor, Forma, Status e Pago em. Na linha pendente, atrasada ou parcelada, o botão é Receber.",
      },
      {
        titulo: "Gere uma cobrança",
        imagens: ["pacientes-cobranca.png"],
        texto: "Gerar cobrança diz Lançamento avulso ou vinculado a um atendimento já realizado. Origem começa em Cobrança avulsa. Nesse caso, Descrição e Valor são obrigatórios. Vencimento também. Se a origem for um atendimento já realizado e ainda sem cobrança, descrição e valor saem e o lançamento usa o procedimento e o valor daquele horário. Gerar grava. Cancelar fecha.",
      },
      {
        titulo: "Registre o recebimento",
        imagens: ["pacientes-recebimento.png"],
        texto: "Receber abre Registrar recebimento, com a descrição da cobrança. Valor recebido vem preenchido. Forma de pagamento abre em PIX e também oferece Dinheiro, Cartão de crédito, Cartão de débito e Boleto. Confirmar recebimento grava a baixa.",
      },
    ],
    dicas: [
      "Agendar, na ficha ou no menu da linha, abre a agenda já com o paciente escolhido. O paciente precisa existir antes: a agenda não cria o cadastro.",
      "Arquivar, no menu da linha, pergunta Arquivar paciente? O histórico e o prontuário permanecem, e o status passa a Arquivado. O item só aparece para quem tem Desativar em Pacientes.",
      "A aba Financeiro segue o módulo Financeiro do plano e do perfil. Acompanhamento e Documentos seguem a permissão Visualizar de Pacientes.",
    ],
  },
  {
    slug: "agenda",
    titulo: "Agenda",
    grupo: "Operação",
    resumo: "Grade do dia, da semana e do mês, novo horário, status, bloqueio e lista de espera.",
    acesso: "Quem tem Visualizar em Agenda. Novo agendamento e Bloquear horário exigem Criar. Os botões de status e arrastar o cartão exigem Editar. O profissional de saúde vê somente a própria coluna.",
    prints: [
      {
        arquivo: "agenda.png",
        alt: "Grade do dia com um horário confirmado às 09:00",
        legenda: "Dia, cards do dia e a coluna do profissional. O cartão segue a cor do status.",
      },
      {
        arquivo: "agenda-semana.png",
        alt: "Agenda na visão Semana, de segunda a domingo",
        legenda: "Sete colunas. O dia vazio oferece Encaixar horário.",
      },
      {
        arquivo: "agenda-mes.png",
        alt: "Agenda na visão Mês, com o dia atual em destaque",
        legenda: "O mês mostra até três horários por dia. O dia de hoje fica com o número preenchido.",
      },
      {
        arquivo: "agenda-novo.png",
        alt: "Painel Novo agendamento com o paciente já escolhido",
        legenda: "Profissional, cartão do paciente e tipo Avaliação. O procedimento ainda espera a escolha.",
      },
      {
        arquivo: "agenda-novo-atendimento.png",
        alt: "Atendimento preenchido, com Particular ligado e anotações",
        legenda: "Consulta de 1h, das 09:00 às 10:00, Consultório 1 e status Agendado.",
      },
      {
        arquivo: "agenda-novo-convenio.png",
        alt: "Convênio Unimed no novo agendamento, com Particular desligado",
        legenda: "Desmarcar Particular abre o convênio. O valor previsto usa a tabela desse plano.",
      },
      {
        arquivo: "agenda-horario.png",
        alt: "Painel Editar agendamento com status Confirmado e os botões seguintes",
        legenda: "Confirmado oferece Check-in, Cancelado e Faltou.",
      },
      {
        arquivo: "agenda-bloqueio.png",
        alt: "Diálogo Bloquear horário preenchido com almoço",
        legenda: "Profissional, data, 12:00 às 13:00 e o motivo Almoço.",
      },
      {
        arquivo: "agenda-espera.png",
        alt: "Lista de espera vazia e o formulário Incluir na espera preenchido",
        legenda: "Paciente, Manhã, profissional e Consulta. Adicionar à espera grava a fila.",
      },
    ],
    passos: [
      {
        titulo: "Abra a grade do dia",
        imagens: ["agenda.png"],
        texto: "Em Agenda, o texto é Grade por profissional, confirmações, check-in e encaixes da clínica. Os botões são Lista de espera, Bloquear horário e Novo agendamento. Os dois últimos aparecem para quem tem Criar. Os cards são Atendimentos do dia, Confirmados / check-in e Em atendimento. Quem tem Financeiro também vê Previsto no dia, a soma dos horários que não estão Cancelado nem Faltou. As setas mudam o período, Hoje volta para a data atual e o título do dia aparece como Sábado, 12 De Setembro. Dia, Semana e Mês trocam a grade. Os filtros são Todos os profissionais, Todas as salas e Todo status (Agendado, Confirmado, Check-in, Em atendimento, Atendido, Cancelado e Faltou). A legenda repete essas sete cores. No Dia, cada coluna é um profissional, com a especialidade e a quantidade, por exemplo Pediatria · 1. O cartão traz o início, o nome e o procedimento. Neste exemplo, 09:00 Paciente teste e Consulta. Clique no cartão para abrir o horário. Clique num espaço vazio para marcar ali. O profissional de saúde vê só a própria coluna, e o filtro de profissional fica travado.",
      },
      {
        titulo: "Troque para semana ou mês",
        imagens: ["agenda-semana.png", "agenda-mes.png"],
        texto: "Semana abre sete colunas, de segunda a domingo. O período aparece como 07 Set – 13 Set 2026. O dia sem horário mostra Encaixar horário. O cartão traz a hora, o paciente e o profissional. Clique no cabeçalho do dia para voltar ao Dia naquela data. Mês mostra Seg, Ter, Qua, Qui, Sex, Sáb e Dom, com o título Setembro 2026. Cada dia lista até três horários, no formato 09:00 Paciente. A partir do quarto, a linha é +N atendimentos. O dia de hoje fica com o número preenchido, e os dias de fora do mês ficam esmaecidos. Clique num dia para abri-lo na visão Dia. Os cards de cima continuam contando o dia do título, mesmo em Semana e Mês.",
      },
      {
        titulo: "Escolha o paciente",
        imagens: ["agenda-novo.png"],
        texto: "Novo agendamento abre o painel com o texto Preencha os dados para encaixar o paciente na grade. Se você chegou por Agendar, em Pacientes, o cartão já entra escolhido. A seção Paciente diz Últimos 3 do profissional. Busque para encontrar outros. Profissional é obrigatório. A busca é Buscar paciente..., por nome, CPF ou telefone. Cadastrar novo abre Novo paciente. Ao escolher a pessoa, o cartão mostra telefone, idade e o selo Particular ou o nome do convênio. Com alergia, aparece Alergia em vermelho. Trocar paciente limpa a escolha. O tipo passa a Atendimento se essa pessoa já tiver sido atendida por aquele profissional; na primeira vez, fica Avaliação, como neste exemplo. Avaliação diz Primeira vez ou consulta de avaliação. Atendimento diz Consulta, retorno ou procedimento. Antes do procedimento, Início e Término abrem em 09:00 e 09:30. Cancelar fecha. Confirmar agendamento grava.",
      },
      {
        titulo: "Preencha o atendimento",
        imagens: ["agenda-novo-atendimento.png"],
        texto: "Procedimento é obrigatório e lista só os ativos habilitados para aquele profissional, por exemplo Consulta · 1h · R$ 150,00. A duração preenche o Término: Consulta de 1h leva o fim de 09:30 para 10:00. Data, Início e Término são obrigatórios. Sala / consultório é opcional: Consultório 1, Consultório 2, Consultório 3, Sala de Exames ou Sala Cirúrgica. Status inicial abre em Agendado e também oferece Confirmado e Check-in. Em Convênio e valor, o texto é Opcional. Use só se o atendimento for pelo plano. O interruptor Particular começa ligado, com a frase Desmarque apenas se quiser informar um convênio. Valor previsto usa o preço particular, neste exemplo R$ 150,00. Em Observações, Anotações da recepção aceita um texto livre, com a dica Encaixe, autorização, preferência de horário...",
      },
      {
        titulo: "Informe o convênio, se houver",
        imagens: ["agenda-novo-convenio.png"],
        texto: "Se o paciente já tem convênio, o interruptor Particular desliga sozinho e esse convênio entra selecionado. Fora isso, desmarque Particular para abrir o campo Convênio, por exemplo Unimed. Valor previsto passa a usar a tabela daquele convênio. Confirmar agendamento grava o horário na grade.",
      },
      {
        titulo: "Avance o status",
        imagens: ["agenda-horario.png"],
        texto: "O cartão abre Editar agendamento, com o nome e o intervalo, neste exemplo Paciente teste · 09:00 – 09:30. O selo mostra o status atual. Os botões ao lado aplicam o próximo passo na hora, para quem tem Editar. Em Agendado, os botões são Confirmado e Cancelado. Em Confirmado, como na figura, são Check-in, Cancelado e Faltou. Em Check-in, são Em atendimento, Cancelado e Faltou. Em Em atendimento, o botão é Atendido. Em Atendido, Cancelado ou Faltou não há botão seguinte, e o campo Status inicial fica sem a opção correspondente. Ao marcar Atendido, o sistema gera a cobrança do procedimento se ela ainda não existir. Quando o lembrete já saiu, o painel também mostra Lembrete enviado. No horário já gravado, início e término permanecem os que foram salvos; trocar o procedimento ou o início recalcula o término pela duração. Salvar alterações grava os campos. Quem só visualiza vê Fechar.",
      },
      {
        titulo: "Bloqueie um horário",
        imagens: ["agenda-bloqueio.png"],
        texto: "Bloquear horário diz Folga, almoço ou indisponibilidade do profissional na grade. Profissional, Data, Início, Término e Motivo são obrigatórios. O intervalo abre em 12:00 e 13:00, e o término precisa ser depois do início. O motivo pede ao menos três caracteres; a dica é Almoço, congresso, folga programada... Bloquear grava. Na grade do dia, o trecho aparece com cadeado, o motivo e o horário. Cancelar fecha.",
      },
      {
        titulo: "Use a lista de espera",
        imagens: ["agenda-espera.png"],
        texto: "Lista de espera diz Pacientes aguardando encaixe quando houver horário livre. Sem ninguém na fila, o título é Lista de espera vazia e o texto é Quando a agenda lotar, adicione pacientes aqui para encaixes. Incluir na espera pede Paciente. Período é Qualquer, Manhã ou Tarde. Profissional é Qualquer ou uma pessoa. Procedimento é A definir ou um procedimento ativo da clínica. Adicionar à espera fica disponível depois do paciente. Com alguém na fila, a linha mostra nome, procedimento, período, profissional quando houver, telefone e desde quando entrou. O botão da grade passa a contar essa fila. Encaixar, para quem tem Criar e Editar, tira a pessoa da lista e abre Novo agendamento já com ela: 09:00 de manhã ou em Qualquer, e 14:00 à tarde.",
      },
    ],
    dicas: [
      "Na visão Dia, quem pode editar arrasta o cartão para outro horário ou outra coluna. A duração permanece. No painel, mudar data, início, término ou profissional e clicar em Salvar alterações também reagenda.",
      "Gravar em cima de outro horário ou de um bloqueio responde: Já existe um agendamento ou bloqueio neste horário.",
      "O sino Lembrete enviado aparece no cartão quando o lembrete já saiu. O disparo fica em Integrações e lembretes, no plano Ilimitado.",
      "Sem o profissional vinculado à conta, a tela do perfil Profissional de saúde diz Cadastro clínico não vinculado.",
    ],
  },
  {
    slug: "profissionais",
    titulo: "Profissionais",
    grupo: "Operação",
    resumo: "Cadastro de quem atende, grade da semana, comissão e vínculo com o login.",
    acesso: "Administrador cria, edita e inativa. Gestor cria e edita. Recepção e financeiro só visualizam. Profissional de saúde não abre este módulo.",
    prints: [
      {
        arquivo: "profissionais.png",
        alt: "Lista de profissionais com um cadastro ativo",
        legenda: "Profissional teste, Pediatria, CLT e remuneração Fixo. A comissão fica em traço.",
      },
      {
        arquivo: "profissionais-pessoais.png",
        alt: "Dados pessoais do novo profissional, com a conta de login sem vínculo",
        legenda: "Nome, CPF, e-mail e telefone. A conta de login permanece em Sem vínculo de login.",
      },
      {
        arquivo: "profissionais-dados.png",
        alt: "Especialidade Pediatria marcada e conselho CRM",
        legenda: "Pediatria, CRM e o registro 000000.",
      },
      {
        arquivo: "profissionais-vinculo.png",
        alt: "Vínculo com contrato PJ, admissão e remuneração Comissão",
        legenda: "PJ, admissão em 01/03/2024 e remuneração Comissão.",
      },
      {
        arquivo: "profissionais-comissao.png",
        alt: "Comissionamento com percentual 40 e a tabela customizada desligada",
        legenda: "O percentual abre em 40. Comissão por procedimento começa desligada.",
      },
      {
        arquivo: "profissionais-horarios.png",
        alt: "Grade semanal com segunda a sexta das 08:00 às 18:00",
        legenda: "Domingo e sábado sem atendimento. Os dias úteis vão das 08:00 às 18:00.",
      },
      {
        arquivo: "profissionais-procedimentos.png",
        alt: "Procedimentos habilitados com Consulta marcada",
        legenda: "Avaliação, de 30 min, fica de fora. Consulta, de 1h, fica marcada.",
      },
      {
        arquivo: "profissionais-visao.png",
        alt: "Visão geral do profissional, com grade e o procedimento Consulta",
        legenda: "CLT, remuneração Fixo, admissão em 08/09/2025 e carga de 50h.",
      },
      {
        arquivo: "profissionais-agenda.png",
        alt: "Agenda do profissional no mês corrente, com dois atendimentos",
        legenda: "Dois horários de Paciente teste, os dois Atendido e Particular.",
      },
      {
        arquivo: "profissionais-pacientes.png",
        alt: "Pacientes atendidos por este profissional",
        legenda: "Paciente teste, Particular, duas visitas e a última em 12/09/2026.",
      },
      {
        arquivo: "profissionais-comissoes.png",
        alt: "Aba de comissões vazia para remuneração fixa",
        legenda: "Os três cards ficam em R$ 0,00. Remuneração fixa não gera extrato.",
      },
      {
        arquivo: "profissionais-documentos.png",
        alt: "Documentos do profissional e a área para enviar arquivo",
        legenda: "Contrato, conselho, certificações e documento pessoal, com a área de envio embaixo.",
      },
    ],
    passos: [
      {
        titulo: "Localize o profissional",
        imagens: ["profissionais.png"],
        texto: "Em Profissionais, o texto é Corpo clínico da clínica: vínculos, comissionamento e disponibilidade na agenda. Novo profissional aparece para quem tem Criar. Os cards são Total de profissionais, Profissionais ativos (com a quantidade de inativos), Especialidades atendidas e, para quem visualiza Financeiro, Comissão média, a média entre quem tem percentual maior que zero. A busca pede nome, e-mail ou registro. Os filtros são Toda especialidade, Todo vínculo (CLT, PJ e Autônomo) e Todo status (Ativos e Inativos). Colunas lista Profissional, Especialidades, Conselho, Vínculo, Comissão e Status. Exportar gera profissionais.csv. A linha traz as iniciais, o nome, o e-mail, a especialidade, o conselho com o registro, o vínculo com a remuneração embaixo, a comissão e o selo Ativo ou Inativo. Neste exemplo, Profissional teste, Pediatria, CRM 000000, CLT, Fixo e um traço na comissão, porque o percentual é zero. Clique no nome ou na linha para abrir o perfil. Os três pontos trazem Ver perfil, Ver agenda e, para quem pode, Editar. Inativar aparece para quem tem Desativar. O diálogo Inativar profissional? avisa que a pessoa deixará de receber novos agendamentos e que os atendimentos já realizados e as comissões continuam no histórico. Os botões são Cancelar e Inativar. Sem resultado, a lista diz Nenhum profissional encontrado.",
      },
      {
        titulo: "Preencha os dados pessoais",
        imagens: ["profissionais-pessoais.png"],
        texto: "Novo profissional diz Cadastre o profissional, o vínculo contratual e a disponibilidade na agenda. Voltar retorna à lista. Em Dados pessoais, o texto é Identificação e contato do profissional. Nome completo, CPF, E-mail e Telefone são obrigatórios. RG é opcional. Conta de login também é opcional e abre em Sem vínculo de login. A dica é Opcional. Vincula o cadastro clínico ao usuário com perfil de profissional de saúde. A lista só oferece contas desse perfil que ainda não estão ligadas a outro cadastro. Nesta clínica não havia conta livre, então o campo permaneceu em Sem vínculo de login. Foto pede o endereço da imagem exibida no perfil e na agenda. Cancelar volta à lista. Salvar profissional grava e abre o perfil.",
      },
      {
        titulo: "Informe especialidade e conselho",
        imagens: ["profissionais-dados.png"],
        texto: "Dados profissionais diz Especialidades e registro no conselho de classe. Especialidades é obrigatório, ao menos uma. A dica é Definem em quais agendas o profissional pode ser escalado. As opções são Clínica Geral, Cardiologia, Dermatologia, Ortopedia, Pediatria, Ginecologia, Odontologia, Nutrição, Fisioterapia e Estética. Neste exemplo, Pediatria está marcada. Conselho de classe é obrigatório: CRM, CRO, CREFITO, CRN, CRP ou COREN. Número do registro é obrigatório e pede ao menos três caracteres. Aqui, CRM e 000000.",
      },
      {
        titulo: "Defina o vínculo",
        imagens: ["profissionais-vinculo.png"],
        texto: "Vínculo diz Contrato e forma de remuneração acordada. Tipo de contrato é obrigatório e abre em PJ. As opções são CLT, PJ e Autônomo. Data de admissão é obrigatória, neste exemplo 01/03/2024. Forma de remuneração é obrigatória e abre em Comissão. As opções são Fixo, Comissão e Misto. O cadastro já gravado da lista é outro caso: CLT e Fixo, com admissão em 08/09/2025.",
      },
      {
        titulo: "Ajuste a comissão",
        imagens: ["profissionais-comissao.png"],
        texto: "Comissionamento diz Percentual aplicado sobre o faturamento gerado. A seção aparece para quem visualiza Financeiro. Percentual de comissão abre em 40 e aceita de 0 a 100, de meio em meio. Em Comissão ou Misto, o valor precisa ser maior que zero. O aviso é Informe o percentual de comissão para esta forma de remuneração. Tabela customizada traz o interruptor Comissão por procedimento, com a dica Permite definir percentuais diferentes por procedimento no fechamento da comissão. Ele começa desligado. Em Fixo, o percentual e o interruptor ficam desabilitados, e a dica passa a ser Não se aplica a profissionais com remuneração fixa. O perfil já gravado está em Fixo, por isso a comissão na visão geral é 0,0%.",
      },
      {
        titulo: "Monte a grade",
        imagens: ["profissionais-horarios.png"],
        texto: "Horários de atendimento diz Grade semanal usada para calcular a disponibilidade na agenda. Cada dia tem um interruptor. Domingo e Sábado começam desligados, com o texto Sem atendimento. Segunda, Terça, Quarta, Quinta e Sexta começam ligados, das 08:00 até as 18:00. É obrigatório ao menos um dia. Com o dia ligado, o término precisa ser depois do início. O aviso é O horário final deve ser posterior ao inicial. Sem nenhum dia, o aviso é Defina ao menos um dia de atendimento na grade semanal.",
      },
      {
        titulo: "Habilite os procedimentos",
        imagens: ["profissionais-procedimentos.png"],
        texto: "Procedimentos habilitados diz Somente os procedimentos marcados ficam disponíveis ao agendar com este profissional. A lista traz os procedimentos ativos da clínica, agrupados pela categoria, com a quantidade ao lado. Aqui, EXAME tem Avaliação, 30 min e R$ 150,00, e CONSULTA tem Consulta, 1h e R$ 150,00. Consulta está marcada. É obrigatório ao menos um. O aviso é Habilite ao menos um procedimento. Na Agenda, o procedimento do horário só lista os que ficaram marcados para essa pessoa. Salvar profissional grava. O aviso é Profissional cadastrado, e a descrição diz que a pessoa já pode receber agendamentos. Em seguida o perfil abre.",
      },
      {
        titulo: "Abra a visão geral",
        imagens: ["profissionais-visao.png"],
        texto: "O perfil mostra o nome, o selo Ativo, as especialidades, o conselho com o registro, o vínculo, o e-mail e o telefone. Editar, para quem tem Editar, reabre o mesmo formulário com o título Editar profissional e o nome da pessoa no texto de apoio. O botão de baixo passa a ser Salvar alterações. Novo agendamento, para quem cria na Agenda, abre a grade já com essa pessoa. As abas são Visão geral, Agenda, Pacientes, Comissões e Documentos. Comissões só entra para quem visualiza Financeiro. Os cards são Atendimentos no mês, Faturamento gerado, Taxa de ocupação e Pacientes atendidos, este com a taxa de faltas no mês. Neste exemplo, 2 atendimentos, R$ 1.500,00, ocupação de 0,5%, 1 paciente e 0,0% de faltas. Dados profissionais lista Vínculo, Remuneração, Admissão, Conselho, Horas semanais e Comissão. Aqui, CLT, Fixo, 08/09/2025, CRM 000000, 50 h e 0,0%. Grade de horários diz Disponibilidade semanal considerada no cálculo de ocupação. Segunda a sexta ficam das 08:00 às 18:00. Domingo e sábado dizem Sem atendimento. Embaixo, Carga semanal disponível: 50h. Procedimentos habilitados mostra Consulta.",
      },
      {
        titulo: "Consulte a agenda da pessoa",
        imagens: ["profissionais-agenda.png"],
        texto: "A aba Agenda abre em Mês corrente. O outro período pode ser Próximos 7 dias, Mês anterior ou Todo o histórico. O status começa em Todo status e também oferece Agendado, Confirmado, Check-in, Em atendimento, Atendido, Cancelado e Faltou. A busca pede paciente ou procedimento. Exportar gera agenda-do-profissional.csv. As colunas são Data, Horário, Paciente, Tipo, Procedimento, Sala, Origem, Valor e Status. Neste mês, Paciente teste aparece duas vezes, os dois Particular e Atendido: 12/09/2026, sábado, 09:00–09:30, Atendimento, sem sala; e 08/09/2026, terça-feira, 14:00–14:30, Avaliação, Consultório 1. O procedimento dos dois é Valor Alterado (Avaliação) e o valor é R$ 150,00. Sem horário no filtro, a tabela diz Nenhum atendimento no período.",
      },
      {
        titulo: "Veja os pacientes atendidos",
        imagens: ["profissionais-pacientes.png"],
        texto: "A aba Pacientes busca por paciente. Exportar gera pacientes-do-profissional.csv. As colunas são Paciente, Telefone, Convênio, Atendimentos, Última visita e Status. Neste exemplo, Paciente teste, telefone (16) 90000-0000, Particular, 2 atendimentos, última visita em 12/09/2026 e selo Ativo. Clique na linha para abrir a ficha dessa pessoa. Sem ninguém, a tabela diz Nenhum paciente vinculado.",
      },
      {
        titulo: "Acompanhe as comissões",
        imagens: ["profissionais-comissoes.png"],
        texto: "A aba Comissões só aparece para quem visualiza Financeiro. Os cards são Comissões previstas, com a dica Competência em aberto, sujeita a fechamento; Comissões aprovadas, Fechadas e aguardando pagamento; e Comissões pagas, Total já repassado ao profissional. Neste perfil os três estão em R$ 0,00, porque a remuneração é Fixo. A busca pede competência. A tabela diz Nenhuma comissão registrada e Profissionais com remuneração fixa não geram extrato de comissão. O fechamento da folha fica em Financeiro › Comissões.",
      },
      {
        titulo: "Guarde os documentos",
        imagens: ["profissionais-documentos.png"],
        texto: "Documentos diz Contrato, certificações e documentos do conselho de classe, seguido do nome da pessoa. Enviar documento fica no alto, para quem tem Editar. Cada linha traz o arquivo, o tamanho, a data de envio, a validade quando houver, e o tipo: Contrato, Conselho de classe, Certificação ou Documento pessoal. Há também baixar e excluir. A área de baixo diz Arraste arquivos para cá, PDF, JPG ou PNG de até 10 MB por arquivo, e o botão Selecionar arquivos. Enviar documento e Selecionar arquivos respondem Envio de documentos disponível em breve. O download responde Download disponível quando o armazenamento estiver conectado.",
      },
    ],
    dicas: [
      "Gravar um CPF que já existe nesta clínica responde: Já existe um profissional com este CPF nesta clínica.",
      "A conta de login precisa ser um profissional de saúde ativo e ainda sem outro cadastro. Fora isso, a resposta é: A conta vinculada precisa ser um profissional de saúde ativo desta clínica.",
      "Sem esse vínculo, a tela do perfil Profissional de saúde diz Cadastro clínico não vinculado.",
      "Quem está Inativo tem Reativar no menu da linha. O diálogo avisa que a pessoa voltará a aparecer na agenda e poderá receber novos agendamentos.",
      "Sem permissão de visualizar Financeiro, somem o card Comissão média, a coluna Comissão, a seção Comissionamento e a aba Comissões. O texto da lista passa a ser Corpo clínico da clínica: vínculos e disponibilidade na agenda.",
    ],
  },
  {
    slug: "financeiro",
    titulo: "Financeiro",
    grupo: "Gestão",
    resumo: "Receber, pagar, fluxo de caixa, lotes de convênio e comissões.",
    acesso: "Plano Profissional ou Ilimitado. Administrador e o perfil Financeiro criam, editam e desativam. Gestor cria e edita. Recepção visualiza e cria. Profissional de saúde não abre este módulo.",
    prints: [
      {
        arquivo: "financeiro.png",
        alt: "Visão geral do Financeiro com cards, gráfico e atalhos",
        legenda: "Total a receber, total a pagar, saldo do mês e inadimplência. Ao lado, os cinco atalhos.",
      },
      {
        arquivo: "financeiro-dre.png",
        alt: "DRE simplificado e a lista de maiores inadimplências",
        legenda: "Receita Particular no mês. As duas inadimplências são Paciente teste e Paciente teste 2.",
      },
      {
        arquivo: "contas-a-receber.png",
        alt: "Lista de contas a receber com quatro cobranças",
        legenda: "Consulta de Paciente teste, Particular. Duas linhas Pago em PIX e duas Atrasado.",
      },
      {
        arquivo: "financeiro-cobranca.png",
        alt: "Diálogo Nova cobrança preenchido",
        legenda: "Paciente teste, Consulta, R$ 150,00, vencimento em 15/10/2026, Particular e À vista.",
      },
      {
        arquivo: "financeiro-recebimento.png",
        alt: "Diálogo Registrar recebimento de uma cobrança atrasada",
        legenda: "Paciente teste, Consulta, vencimento em 09/09/2026. O recebimento fica em PIX.",
      },
      {
        arquivo: "financeiro-parcelas.png",
        alt: "Diálogo Parcelamento com três parcelas",
        legenda: "A primeira parcela está Paga. A segunda e a terceira ficam Pendente.",
      },
      {
        arquivo: "contas-a-pagar.png",
        alt: "Lista de contas a pagar com uma despesa vencida",
        legenda: "Outros, Fornecedor teste, recorrência Mensal e selo Vencido.",
      },
      {
        arquivo: "financeiro-despesa.png",
        alt: "Diálogo Nova despesa preenchido, com recorrência mensal ligada",
        legenda: "Aluguel da sala, categoria Aluguel, Fornecedor teste e vencimento em 10/10/2026.",
      },
      {
        arquivo: "financeiro-baixa.png",
        alt: "Diálogo Dar baixa no pagamento de uma despesa",
        legenda: "Outros, vencimento em 09/09/2026. A baixa confirma o valor em PIX.",
      },
      {
        arquivo: "fluxo-de-caixa.png",
        alt: "Fluxo de caixa dos últimos 30 dias",
        legenda: "Entradas do mês, saídas do mês e saldo. O gráfico está em 30 dias.",
      },
      {
        arquivo: "faturamento-convenios.png",
        alt: "Faturamento de convênios sem lotes",
        legenda: "Os quatro cards estão zerados. A lista diz Nenhum lote encontrado.",
      },
      {
        arquivo: "financeiro-lote.png",
        alt: "Diálogo Fechar lote de guias com Unimed e setembro de 2026",
        legenda: "Convênio Unimed e competência setembro de 2026.",
      },
      {
        arquivo: "financeiro-reconciliacao.png",
        alt: "Diálogo Reconciliação do lote enviado da Unimed",
        legenda: "Lote Enviado, três guias. Valor glosado e valor recebido prontos para conciliar.",
      },
      {
        arquivo: "comissoes.png",
        alt: "Comissões da competência sem lançamentos",
        legenda: "Calcular competência e Fechar folha de set/2026. A lista está vazia.",
      },
      {
        arquivo: "financeiro-folha.png",
        alt: "Confirmação para fechar a folha de set/2026",
        legenda: "O aviso diz que o fechamento aprova as comissões da competência de uma vez.",
      },
    ],
    passos: [
      {
        titulo: "Comece pela visão geral",
        imagens: ["financeiro.png"],
        texto: "Em Financeiro, o submenu traz Visão geral, Contas a receber, Contas a pagar, Fluxo de caixa, Faturamento de convênios e Comissões. A visão geral diz Visão consolidada de recebimentos, despesas, convênios e comissões da clínica. Os botões são Relatórios financeiros e Contas a receber. Os cards são Total a receber, Total a pagar, Saldo do mês e Inadimplência. Neste exemplo, a receber está em R$ 280,00, com 2 cobranças e R$ 0,00 que vencem em 7 dias. A pagar está em R$ 0,00, com 0 despesas. O saldo do mês é R$ 280,00, com alta de 100% vs. mês anterior. A inadimplência é R$ 560,00, com 2 pacientes com cobranças em atraso. O gráfico Fluxo de caixa começa em 30 dias, com a frase Entradas, saídas e saldo diário dos últimos 30 dias. 12 meses troca o período. A legenda é Entradas, Saídas e Saldo. Embaixo, Entradas no período, Saídas no período e Saldo acumulado. O cartão Submódulos diz Atalhos para a rotina do setor financeiro e repete as cinco telas: Contas a receber (Cobranças, baixas e parcelamentos), Contas a pagar (Despesas fixas, variáveis e fornecedores), Fluxo de caixa (Entradas x saídas e DRE simplificado), Faturamento de convênios (Lotes de guias, glosas e reconciliação) e Comissões (Cálculo e fechamento da folha do corpo clínico).",
      },
      {
        titulo: "Desça até o DRE",
        imagens: ["financeiro-dre.png"],
        texto: "Abaixo do gráfico fica o DRE simplificado, com a frase Receitas e despesas por categoria na competência atual. Receitas e Despesas ficam lado a lado. Neste exemplo a receita é Particular, R$ 280,00, 100,0% do total. Despesas diz Sem lançamentos no mês e Nenhum valor foi registrado nesta seção na competência atual. Resultado do mês traz a margem sobre a receita reconhecida, aqui 100,0% e R$ 280,00. Ao lado, Maiores inadimplências diz Pacientes com cobranças vencidas em aberto. A lista mostra o nome, o telefone e o valor. Neste exemplo, Paciente teste e Paciente teste 2, telefone (16) 90000-0000, R$ 280,00 cada um. Sem vencido em aberto, o título passa a Nenhuma inadimplência e o texto é Todas as cobranças vencidas foram liquidadas.",
      },
      {
        titulo: "Abra as contas a receber",
        imagens: ["contas-a-receber.png"],
        texto: "Contas a receber diz Cobranças de pacientes e faturamento particular da clínica. Gerar cobrança aparece para quem tem Criar. Os cards são Em aberto, Em atraso, Recebido no mês e Vence em 7 dias. Neste exemplo, em aberto e em atraso estão em R$ 280,00, o atraso com 2 cobranças, o recebido no mês em R$ 280,00 e o que vence em 7 dias em R$ 0,00, com 0 cobranças. A busca pede paciente ou descrição. Os filtros são Todo status (Pendentes, Pagas, Atrasadas, Parceladas e Canceladas), Toda origem (Particular, Todos os convênios e cada operadora, por exemplo Unimed) e Toda forma (Dinheiro, Cartão de crédito, Cartão de débito, PIX, Boleto e Convênio). Colunas lista Paciente, Descrição, Valor, Vencimento, Forma de pagamento e Status. Exportar gera contas-a-receber.csv. A linha traz o nome, Particular ou o convênio, a descrição, o valor, o vencimento, a forma e o selo. Neste exemplo, Paciente teste, Consulta, R$ 280,00. A linha paga mostra PIX e o selo Pago. A atrasada deixa a forma em traço, pinta o vencimento de vermelho e usa o selo Atrasado, como em 09/09/2026. Os três pontos trazem Registrar pagamento, Ver parcelas e Ver paciente. Registrar pagamento fica indisponível em Pago e Cancelado. Ver parcelas fica indisponível enquanto a cobrança não tem parcelas. Sem resultado, a tabela diz Nenhuma cobrança encontrada e pede para ajustar os filtros.",
      },
      {
        titulo: "Gere uma cobrança",
        imagens: ["financeiro-cobranca.png"],
        texto: "Gerar cobrança abre Nova cobrança, com o texto Lançamento avulso ou particular, com parcelamento opcional. Paciente, Descrição, Valor e Vencimento são obrigatórios. Origem e Parcelas não são. Paciente começa em Selecione. Descrição pede ao menos três caracteres. Valor começa em R$ 0,00. Vencimento abre no dia de hoje. Origem abre em Particular e também lista as operadoras, por exemplo Unimed. Parcelas abre em À vista e segue em 2x, 3x, 4x, 5x, 6x, 10x e 12x. A partir de 2x o lançamento sai parcelado. Neste exemplo, Paciente teste, Consulta, R$ 150,00, vencimento em 15/10/2026, Particular e À vista. Cancelar fecha o diálogo. Gerar cobrança grava. O atendimento marcado como Atendido na agenda também gera a cobrança, se ela ainda não existir.",
      },
      {
        titulo: "Registre o recebimento",
        imagens: ["financeiro-recebimento.png"],
        texto: "No menu da linha, Registrar pagamento abre Registrar recebimento, com o texto Dê baixa na cobrança informando o valor efetivamente recebido. O resumo traz o paciente, a descrição com a origem, o vencimento e o valor. Neste exemplo, Paciente teste, Consulta · Particular, vencimento em 09/09/2026 e R$ 280,00. Valor recebido, Data do recebimento e Forma de pagamento são obrigatórios. O valor sugerido é o da cobrança, a data abre no dia de hoje e a forma abre em PIX, ou na forma que a cobrança já tiver. As formas são Dinheiro, Cartão de crédito, Cartão de débito, PIX, Boleto e Convênio. Observações é livre. Neste exemplo a data é 27/09/2026, a forma continua PIX e a observação é Comprovante de exemplo. Cancelar fecha. Registrar pagamento fica disponível com valor maior que zero e data preenchida.",
      },
      {
        titulo: "Veja o parcelamento",
        imagens: ["financeiro-parcelas.png"],
        texto: "Ver parcelas abre Parcelamento. O texto de apoio junta o paciente e a descrição, neste exemplo Paciente teste · Consulta. Os cards são Valor total, Já recebido e Em aberto. A tabela tem Parcela, Valor, Vencimento, Pagamento e Situação. A parcela paga mostra a data em Pagamento e o selo Paga. A pendente deixa Pagamento em traço e o selo Pendente. A atrasada usa o selo Atrasada. Neste exemplo o total é R$ 450,00, já recebido R$ 150,00 e em aberto R$ 300,00, em três parcelas de R$ 150,00: 1/3 paga em 15/09/2026, 2/3 com vencimento em 15/10/2026 e 3/3 em 15/11/2026. Quando houver forma combinada, a frase de baixo é Forma de pagamento acordada, aqui PIX. Fechar volta à lista.",
      },
      {
        titulo: "Abra as contas a pagar",
        imagens: ["contas-a-pagar.png"],
        texto: "Contas a pagar diz Despesas operacionais, fornecedores e recorrências. Nova despesa aparece para quem tem Criar. Os cards são A pagar, Vencidas, Pago no mês e Vence em 7 dias. Neste exemplo, a pagar e o pago no mês estão em R$ 0,00, vencidas em R$ 450,00 com a frase 1 despesas, e o que vence em 7 dias em R$ 0,00 com 0 despesas. A busca pede despesa ou fornecedor. Os filtros são Todo status (A pagar, Pagas e Vencidas) e Toda categoria. Colunas lista Despesa, Categoria, Fornecedor, Valor, Vencimento, Recorrência e Status. Exportar gera contas-a-pagar.csv. A linha traz a descrição, a categoria, o fornecedor, o valor, o vencimento, Mensal ou Eventual, e o selo A pagar, Pago ou Vencido. Neste exemplo, Outros, Fornecedor teste, R$ 450,00, vencimento em 09/09/2026 em vermelho, Mensal e Vencido. Os três pontos trazem Dar baixa no pagamento e, para quem desativa o módulo e a despesa ainda não está paga, Excluir. Dar baixa fica indisponível quando o selo é Pago. Sem resultado, a tabela diz Nenhuma despesa encontrada.",
      },
      {
        titulo: "Cadastre a despesa",
        imagens: ["financeiro-despesa.png"],
        texto: "Nova despesa abre o diálogo com o texto Contas a pagar da clínica, fixas ou eventuais. Descrição, Categoria, Fornecedor, Valor e Vencimento são obrigatórios. Descrição pede ao menos três caracteres. Categoria abre na primeira da lista: Aluguel, Folha de pagamento, Comissões, Insumos e materiais, Energia elétrica, Água, Internet e telefonia, Software e sistemas, Marketing, Manutenção, Impostos, Limpeza e Outros. Fornecedor pede ao menos dois caracteres. Valor começa em R$ 0,00. Vencimento abre no dia de hoje. Recorrente mensal diz Marca a despesa como custo fixo da operação e começa desligado. Neste exemplo, Aluguel da sala, Aluguel, Fornecedor teste, R$ 1.500,00, vencimento em 10/10/2026 e o interruptor ligado. Cancelar fecha. Salvar grava. Na lista, a recorrência ligada aparece como Mensal.",
      },
      {
        titulo: "Dê baixa no pagamento",
        imagens: ["financeiro-baixa.png"],
        texto: "Dar baixa no pagamento abre o diálogo com o texto Confirme o valor pago e a forma utilizada para liquidar a despesa. O resumo traz a descrição, a categoria com o fornecedor, o vencimento e o valor. Neste exemplo, Outros, Outros · Fornecedor teste, vencimento em 09/09/2026 e R$ 450,00. Valor recebido, Data do pagamento e Forma de pagamento são obrigatórios. O valor sugerido é o da despesa, a data abre no dia de hoje e a forma abre em PIX. Observações é livre. Neste exemplo o valor continua R$ 450,00, a data é 27/09/2026, a forma é PIX e a observação é Pagamento de exemplo. Cancelar fecha. Confirmar baixa fica disponível com valor maior que zero e data preenchida. No mesmo menu, Excluir aparece para quem desativa o módulo, e some quando a despesa já está paga.",
      },
      {
        titulo: "Leia o fluxo de caixa",
        imagens: ["fluxo-de-caixa.png"],
        texto: "Fluxo de caixa diz Entradas, saídas e saldo da operação nos últimos 30 dias e 12 meses. Não há formulário. Os cards são Entradas do mês, Saídas do mês e Saldo do mês, cada um com a variação vs. período anterior. Neste exemplo, entradas e saldo estão em R$ 280,00, com alta de 100%, e as saídas em R$ 0,00, com 0%. O gráfico repete o título Fluxo de caixa. Em 30 dias, a frase é Entradas, saídas e saldo diário dos últimos 30 dias. Em 12 meses, passa a Entradas, saídas e saldo mensal dos últimos 12 meses. A legenda é Entradas, Saídas e Saldo. Embaixo ficam Entradas no período, Saídas no período e Saldo acumulado. Os números saem das baixas já registradas.",
      },
      {
        titulo: "Abra o faturamento de convênios",
        imagens: ["faturamento-convenios.png"],
        texto: "Faturamento de convênios diz Lotes enviados, glosas e valores recebidos das operadoras. Fechar lote aparece para quem tem Criar. Os cards são Apresentado, Glosado, Recebido e Taxa de glosa. Glosado também mostra o percentual. Taxa de glosa mostra quantos lotes estão abertos e quantos foram enviados. Neste exemplo os quatro valores estão em R$ 0,00 e 0,0%, com 0 abertos · 0 enviados. A busca pede o convênio. Os filtros são Todo convênio e Todo status (Abertos, Enviados, Pagos, Pagos parcialmente e Glosados). Colunas e Exportar ficam ao lado. Exportar gera faturamento-convenios.csv. Sem lote, o título é Nenhum lote encontrado e o texto é Ajuste os filtros de convênio ou status para ver outros lotes. Com linha, as colunas são Convênio, Competência, Guias, Apresentado, Glosado, Recebido e Status. O clique na linha abre a reconciliação.",
      },
      {
        titulo: "Feche o lote de guias",
        imagens: ["financeiro-lote.png"],
        texto: "Fechar lote abre Fechar lote de guias, com o texto Agrupa as cobranças de convênio da competência escolhida. Convênio e Competência são obrigatórios. Convênio lista as operadoras ativas. Nesta clínica a lista tem Unimed, e o campo já abre nela. Competência é o mês, neste exemplo setembro de 2026. Cancelar fecha. Gerar lote fica disponível depois do convênio. O lote reúne as cobranças daquela operadora na competência.",
      },
      {
        titulo: "Reconcilie o lote",
        imagens: ["financeiro-reconciliacao.png"],
        texto: "O clique na linha abre Reconciliação do lote. O texto de apoio junta a operadora e a competência, neste exemplo Unimed · competência set/2026. O selo e a quantidade de guias ficam no alto. O resumo lista Valor apresentado, Glosas com o percentual, Valor recebido e Saldo a reconciliar. Dois cartões mostram Envio do lote e Previsão de pagamento. Sem data de envio, o primeiro cartão diz Ainda não enviado. Neste exemplo o selo é Enviado, com 3 guias no lote, valor apresentado de R$ 450,00, glosas em 0,0%, valor recebido em R$ 0,00 e saldo a reconciliar de R$ 450,00. O envio está em 10/09/2026 e a previsão em 15/10/2026. Com o lote Enviado, entram Valor glosado e Valor recebido, aqui R$ 150,00 e R$ 300,00. Fechar volta à lista. Conciliar recebimento grava a glosa e o valor recebido. Quem só visualiza vê o resumo, sem esses dois campos nem o botão de conciliar.",
      },
      {
        titulo: "Calcule as comissões",
        imagens: ["comissoes.png"],
        texto: "Comissões diz Repasses do corpo clínico por competência, com aprovação e pagamento. Calcular competência aparece para quem tem Criar. Fechar folha, com o mês no rótulo, aparece para quem tem Editar. Neste exemplo o botão é Fechar folha de set/2026. Os cards são Previsto na competência, Aprovadas, Pagas e Profissionais. O de profissionais mostra a competência embaixo, aqui Competência 2026-09. Neste exemplo os três valores estão em R$ 0,00 e a contagem de profissionais é 0. A busca pede o profissional. Os filtros são Toda competência e Todo status (Previstas, Aprovadas e Pagas). Colunas e Exportar ficam ao lado. Exportar gera comissoes.csv. Sem lançamento, o título é Nenhuma comissão encontrada e o texto é Ajuste os filtros de competência ou status para ver outros lançamentos. Calcular competência monta a folha da competência aberta a partir dos atendimentos e do percentual do cadastro. Profissional em Fixo não entra nesse cálculo.",
      },
      {
        titulo: "Feche a folha",
        imagens: ["financeiro-folha.png"],
        texto: "Fechar folha de set/2026 abre a pergunta Fechar a folha de set/2026? O texto diz quantos profissionais e qual valor em comissões serão aprovados de uma vez, e avisa: Depois do fechamento, novos atendimentos da competência não entram mais neste cálculo. Neste exemplo, 0 profissionais e R$ 0,00. Cancelar volta à lista. Fechar folha confirma. Com linhas na tabela, o menu da linha traz Aprovar comissão, disponível em Prevista, e Registrar pagamento, disponível em Aprovada, além de Ver profissional.",
      },
    ],
    dicas: [
      "Marcar o horário como Atendido na agenda gera a cobrança se ela ainda não existir. O recebimento dessa cobrança continua em Contas a receber, ou na aba Financeiro da ficha do paciente.",
      "A aba Financeiro da ficha é outra tela. O profissional de saúde não a vê, porque não abre este módulo.",
      "Excluir despesa fica com quem tem Desativar em Financeiro. Gestor e recepção não veem esse item. A recepção também não fecha a folha nem concilia o lote, porque essas ações pedem Editar.",
    ],
  },
  {
    slug: "convenios",
    titulo: "Convênios",
    grupo: "Gestão",
    resumo: "Operadoras, prazo, autorização e tabela de preços.",
    acesso: "Administrador cria, edita e inativa. Gestor e financeiro criam e editam. Recepção e profissional de saúde só consultam. Disponível em todos os planos.",
    prints: [
      {
        arquivo: "convenios.png",
        alt: "Lista de convênios com a operadora Unimed ativa",
        legenda: "Unimed, registro 393321, prazo de 30 dias, selo Exige senha e 0 na tabela.",
      },
      {
        arquivo: "convenios-novo.png",
        alt: "Formulário de novo convênio com os campos preenchidos",
        legenda: "Unimed, registro 393321, Ativo, prazo de 30 dias e autorização prévia ligada.",
      },
      {
        arquivo: "convenios-tabela.png",
        alt: "Ficha da Unimed com a tabela de preços preenchida e nenhum paciente vinculado",
        legenda: "Avaliação e Consulta a R$ 120,00. A diferença compara com o particular.",
      },
      {
        arquivo: "convenios-inativar.png",
        alt: "Confirmação para inativar o convênio Unimed",
        legenda: "Inativar tira a operadora dos novos agendamentos. Os lotes já enviados continuam.",
      },
    ],
    passos: [
      {
        titulo: "Localize o convênio",
        imagens: ["convenios.png"],
        texto: "Em Convênios, o texto é Operadoras, tabela de preços por procedimento e regras de autorização prévia. Novo convênio aparece para quem tem Criar. Os cards são Convênios cadastrados, Ativos, Exigem autorização (com a dica Senha prévia no agendamento) e Prazo médio de pagamento. Neste exemplo, 1 cadastrado, 1 ativo, 1 que exige autorização e prazo médio de 30 dias. A busca pede nome ou registro ANS. Os filtros são Toda autorização (Exige autorização e Dispensa autorização) e Todo status (Ativos e Inativos). Colunas e Exportar ficam ao lado. Exportar gera convenios.csv. As colunas são Convênio, Registro ANS, Prazo de pagamento, Autorização prévia, Procedimentos e Status. A linha traz o nome, o contato com o telefone, o registro, o prazo, o selo Exige senha ou Dispensa, quantos procedimentos estão na tabela e o selo Ativo ou Inativo. Neste exemplo, Unimed, Central de Relacionamento, (16) 3000-0000, registro 393321, 30 dias, Exige senha, 0 na tabela e Ativo. Clique no nome ou na linha para abrir a ficha. Os três pontos trazem Ver convênio e, para quem visualiza Financeiro, Faturamento. Editar aparece para quem pode editar. Com portal preenchido, entra Abrir portal. Inativar aparece para quem tem Desativar. Sem resultado, a lista diz Nenhum convênio encontrado e Ajuste os filtros ou cadastre um novo convênio.",
      },
      {
        titulo: "Cadastre a operadora",
        imagens: ["convenios-novo.png"],
        texto: "Novo convênio diz A tabela de preços por procedimento é configurada depois, na página do convênio. Em Identificação, o texto é Dados cadastrais da operadora. Nome do convênio, Registro ANS, Status e Prazo de pagamento são obrigatórios. Status abre em Ativo e também oferece Inativo. O prazo aceita de 1 a 180 dias, abre em 30, e a dica é Prazo médio entre o envio do lote e o crédito. Neste exemplo, o nome é Unimed, o registro é 393321, o status é Ativo e o prazo é 30 dias. Em Contato e portal, o texto é Canal usado pela recepção e pelo faturamento. Contato e Telefone são obrigatórios. Portal do prestador é opcional. Aqui, o contato é Central de Relacionamento, o telefone é (16) 3000-0000 e o portal é https://portal.operadora.com.br. Em Regras de atendimento, o texto é Condições aplicadas no agendamento. O interruptor Exige autorização prévia começa desligado. A frase é A recepção precisa registrar o número da senha antes de confirmar o agendamento. Na figura ele está ligado, como nesta operadora. Cancelar fecha. Cadastrar grava. O aviso é Convênio cadastrado, e a descrição diz que a operadora já pode ser vinculada a pacientes e agendamentos.",
      },
      {
        titulo: "Monte a tabela de preços",
        imagens: ["convenios-tabela.png"],
        texto: "A ficha abre em Convênios › Unimed. O título traz o nome, o selo Ativo e, com a regra ligada, o selo Exige autorização prévia. A linha de baixo mostra o ANS, o contato com o telefone e o prazo médio. Editar, para quem tem Editar, reabre o mesmo formulário com o título Editar convênio e o texto Dados cadastrais da operadora. A tabela de preços fica na ficha do convênio. O botão passa a ser Salvar alterações. Faturamento abre Financeiro › Faturamento de convênios já com esta operadora, no plano que inclui Financeiro. Portal só entra quando o endereço foi preenchido e abre esse endereço em outra aba. Nesta ficha o portal está vazio. Os cards são Pacientes vinculados, Atendimentos no mês e, com Financeiro no plano, Faturamento do mês e Taxa de glosa. Neste exemplo, 0, 0, R$ 0,00 e 0,0%. Tabela de preços diz Valores do convênio comparados ao particular. As colunas são Procedimento, Categoria, Particular, Valor do convênio e Diferença. As linhas são os procedimentos ativos. Aqui, Avaliação, categoria Exame, particular R$ 150,00, e Consulta, categoria Consulta, particular R$ 200,00. O particular continua em Configurações › Procedimentos. O valor do convênio abre em 0,00 e a diferença em traço enquanto não houver preço gravado. Por isso a lista mostra 0 na tabela. Informe o valor, neste exemplo R$ 120,00 nos dois. A diferença sai na hora: Avaliação fica em -R$ 30,00 e Consulta em -R$ 80,00. Salvar tabela, para quem tem Editar, grava os valores maiores que zero. O aviso é Tabela atualizada. Embaixo, Pacientes vinculados diz Cadastros com este convênio como plano principal. Sem ninguém, o título é Nenhum paciente vinculado e o texto é O convênio ainda não está associado a cadastros. Com linha, aparecem o nome, a carteirinha e o selo do paciente. O clique no nome abre a ficha da pessoa. O vínculo é feito no cadastro do paciente. Na agenda, desmarcar Particular usa o valor desta tabela.",
      },
      {
        titulo: "Inative a operadora",
        imagens: ["convenios-inativar.png"],
        texto: "No menu da linha, Inativar abre a pergunta Inativar convênio? O texto diz que a operadora deixará de aparecer na criação de agendamentos e no vínculo de pacientes, e que os lotes já enviados continuam no faturamento. Cancelar volta à lista. Inativar confirma. O aviso é Convênio inativado. Quem está Inativo passa a ter Reativar. O diálogo Reativar convênio? avisa que a operadora voltará a aparecer na criação de agendamentos e no vínculo de pacientes. O botão é Reativar e o aviso é Convênio reativado.",
      },
    ],
    dicas: [
      "Gravar um nome que já existe nesta clínica responde: Já existe um convênio com este nome.",
      "O portal preenchido precisa começar com http:// ou https://. A resposta, fora isso, é: Informe uma URL válida, começando com http:// ou https://.",
      "Telefone incompleto responde: Informe um telefone válido. Prazo abaixo de 1 dia responde: O prazo deve ser de ao menos 1 dia. Prazo acima de 180 responde: O prazo máximo é de 180 dias.",
      "Valor zero não entra na tabela. A lista só passa a contar o procedimento depois de Salvar tabela.",
      "Gestor e financeiro criam e editam, e o item Inativar fica com quem tem Desativar. No padrão, só o administrador. Sem Editar, o valor do convênio fica bloqueado.",
      "No Plano Essencial a ficha mostra Pacientes vinculados e Atendimentos no mês. Faturamento do mês, Taxa de glosa e o botão Faturamento entram no plano que inclui Financeiro.",
    ],
  },
  {
    slug: "estoque",
    titulo: "Estoque",
    grupo: "Gestão",
    resumo: "Produtos, entradas, saídas e itens abaixo do mínimo.",
    acesso: "Plano Profissional ou Ilimitado. Administrador cria, edita e inativa. Gestor cria e edita. Financeiro e profissional de saúde só consultam. Recepção não vê o módulo.",
    prints: [
      {
        arquivo: "estoque.png",
        alt: "Estoque com dois produtos e o alerta de item abaixo do mínimo",
        legenda: "Higiene está com 2 rolos e o mínimo é 3. O valor em estoque é R$ 37,50.",
      },
      {
        arquivo: "estoque-novo.png",
        alt: "Formulário de novo produto com os campos preenchidos",
        legenda: "Luva de procedimento, Descartáveis, caixa, quantidade 20, mínimo 5 e custo R$ 12,50.",
      },
      {
        arquivo: "estoque-movimentacao.png",
        alt: "Registro de saída de estoque preenchido para o produto Higiene",
        legenda: "Saída de 2 rolos em 27/09/2026, ligada à Consulta. O saldo previsto vai a 0.",
      },
      {
        arquivo: "estoque-movimentacoes.png",
        alt: "Aba de movimentações vazia",
        legenda: "Nesta clínica ainda não há lançamento. O filtro é Todos os tipos.",
      },
      {
        arquivo: "estoque-consumo.png",
        alt: "Aba de consumo vazia",
        legenda: "O consumo agrupa as saídas. Sem saída, a aba diz Nenhum consumo registrado.",
      },
      {
        arquivo: "estoque-inativar.png",
        alt: "Confirmação para inativar o produto Higiene",
        legenda: "Inativar tira o item das novas movimentações.",
      },
    ],
    passos: [
      {
        titulo: "Acompanhe os cards",
        imagens: ["estoque.png"],
        texto: "Em Estoque, o texto é Insumos, saldos e movimentações de entrada e saída da clínica. Registrar movimentação fica no alto, para quem tem Criar, e só habilita quando existe produto ativo. Os cards são Itens cadastrados (com a quantidade de categorias do catálogo, aqui 6 categorias de insumos), Valor em estoque (com a dica Saldo atual avaliado pelo custo unitário), Abaixo do mínimo (com a dica Itens que precisam de reposição) e Saídas registradas (com a dica Consumo lançado no histórico de movimentações). Neste exemplo, 2 itens, R$ 37,50, 1 abaixo do mínimo e 0 saídas. O aviso 1 item abaixo do estoque mínimo estima a reposição em R$ 12,00 para voltar aos níveis mínimos definidos. A linha é Higiene, Descartáveis, Fornecedor teste, Mínimo 3 rolo e o selo 2 rolo em estoque. O sino usa o mesmo aviso para quem visualiza o estoque. As abas são Produtos e insumos (2), Movimentações (0) e Consumo (0). Em Produtos e insumos, a busca pede produto, categoria ou fornecedor. O filtro é Toda categoria e também oferece Material odontológico, Material de enfermagem, Medicamento, Estética, Descartáveis e Escritório. Abaixo do mínimo restringe a lista. Novo produto aparece para quem tem Criar. Colunas e Exportar ficam ao lado. Exportar gera estoque-produtos.csv. As colunas são Produto, Categoria, Unidade, Quantidade atual, Estoque mínimo, Custo unitário e Valor total. A linha traz o nome, o fornecedor, a categoria, a unidade, a quantidade, o mínimo, o custo e o total. Quantidade menor que o mínimo ganha o selo Estoque baixo, em vermelho. Aqui, Higiene, Fornecedor teste, Descartáveis, rolo, 2, mínimo 3, R$ 12,00 e R$ 24,00. Produto de Limpeza, Fornecedor teste, Escritório, frasco, 3, mínimo 3, R$ 4,50 e R$ 13,50. Igual ao mínimo, ele não entra no alerta. O ícone da linha abre a movimentação daquele produto. Os três pontos trazem Editar, para quem pode, e Inativar, para quem tem Desativar. Sem resultado, a lista diz Nenhum produto encontrado e Cadastre insumos para controlar saldo, mínimo e movimentações.",
      },
      {
        titulo: "Cadastre o produto",
        imagens: ["estoque-novo.png"],
        texto: "Novo produto diz Cadastre insumos com estoque mínimo para receber alerta quando o saldo ficar baixo. Nome, Fornecedor, Categoria, Unidade de medida, Quantidade inicial, Estoque mínimo e Custo unitário são obrigatórios. Categoria e unidade abrem em Selecione. As categorias são Material odontológico, Material de enfermagem, Medicamento, Estética, Descartáveis e Escritório. As unidades são unidade, caixa, frasco, litro, galão, seringa, rolo, ampola e pacote. Neste exemplo, o nome é Luva de procedimento, o fornecedor é Fornecedor teste, a categoria é Descartáveis, a unidade é caixa, a quantidade inicial é 20, o mínimo é 5 e o custo é R$ 12,50. Cancelar fecha. Salvar grava. O aviso é Produto cadastrado, com o nome na descrição. Editar produto reabre o mesmo formulário, sem o campo Quantidade inicial: o saldo muda só pela movimentação. O botão continua Salvar e o aviso passa a ser Produto atualizado.",
      },
      {
        titulo: "Registre entrada ou saída",
        imagens: ["estoque-movimentacao.png"],
        texto: "Registrar movimentação de estoque diz Lance entradas de compra ou saídas de consumo para manter o saldo dos insumos atualizado. Produto, Tipo de movimentação, Quantidade, Data e Motivo são obrigatórios. O tipo abre em Entrada e também oferece Saída. A quantidade precisa ser maior que zero. A dica mostra a unidade, aqui Unidade de medida: rolo. A data abre no dia. Procedimento (opcional) lista Não vinculado e os procedimentos ativos, Avaliação e Consulta. O motivo pede ao menos três caracteres. A dica é Compra — NF 88214, consumo em procedimento, perda por validade... Neste exemplo, o produto é Higiene, o tipo é Saída, a quantidade é 2, a data é 27/09/2026, o procedimento é Consulta e o motivo é Consumo em procedimento. O rodapé mostra Saldo atual: 2 rolo · mínimo 3 e Saldo após o lançamento: 0. O saldo previsto fica em vermelho quando fica abaixo do mínimo. Cancelar fecha. Registrar movimentação grava. O aviso é Entrada registrada ou Saída registrada, com o nome, a quantidade e a unidade. O mesmo diálogo abre pelo ícone da linha, já com aquele produto.",
      },
      {
        titulo: "Consulte as movimentações",
        imagens: ["estoque-movimentacoes.png"],
        texto: "A aba Movimentações busca por produto, motivo ou responsável. O filtro é Todos os tipos e também oferece Entradas e Saídas. Colunas e Exportar ficam ao lado. Exportar gera estoque-movimentacoes.csv. Nesta clínica o contador está em 0. O título é Nenhuma movimentação encontrada e o texto é Registre entradas de compra e saídas de consumo para acompanhar o histórico. Com linha, as colunas são Data, Produto, Tipo, Quantidade, Motivo e Responsável. Entrada usa o selo verde e a quantidade com sinal de mais. Saída usa o selo de atenção e a quantidade com sinal de menos.",
      },
      {
        titulo: "Consulte o consumo",
        imagens: ["estoque-consumo.png"],
        texto: "A aba Consumo agrupa as saídas por produto. A busca pede o produto. Colunas e Exportar ficam ao lado. Exportar gera estoque-consumo.csv. Sem saída, o título é Nenhum consumo registrado e o texto é As saídas de estoque aparecem aqui agrupadas por produto. Com linha, as colunas são Produto, Quantidade consumida e Saídas, esta última com quantas vezes o item saiu.",
      },
      {
        titulo: "Inative o produto",
        imagens: ["estoque-inativar.png"],
        texto: "No menu da linha, Inativar abre a pergunta Inativar produto? O texto diz que o item deixará de aparecer nas novas movimentações. Neste exemplo, Higiene. Cancelar volta à lista. Inativar confirma. O aviso é Produto inativado. A quantidade passa a mostrar o selo Inativo, e o ícone de movimentar sai da linha. Quem está inativo tem Reativar. O diálogo Reativar produto? avisa que o item voltará a aparecer nas movimentações. O botão é Reativar e o aviso é Produto reativado.",
      },
    ],
    dicas: [
      "Uma saída maior que o saldo responde: A saída deixa o saldo negativo. Ajuste a quantidade.",
      "O saldo do cadastro não se edita no formulário. Entrada soma e saída diminui, sempre por Registrar movimentação.",
      "Igual ao mínimo, o item fica fora do alerta e do selo Estoque baixo. O aviso considera só quem está abaixo.",
      "Inativar fica com quem tem Desativar. No padrão, só o administrador. Gestor cria, edita e lança movimentação. Sem Criar, somem Novo produto e Registrar movimentação.",
      "No Plano Essencial o menu mostra o cadeado de Estoque, com o balão Disponível no plano Profissional.",
    ],
  },
  {
    slug: "rh",
    titulo: "RH",
    grupo: "Gestão",
    resumo: "Ponto dos usuários e holerites por competência.",
    acesso: "Disponível em todos os planos. Administrador e gestor veem a equipe, lançam o ponto e enviam holerite. Financeiro, recepção e profissional de saúde batem o próprio ponto e consultam os próprios holerites.",
    prints: [
      {
        arquivo: "rh.png",
        alt: "Visão geral de RH, sem batida no dia e sem holerite no mês",
        legenda: "0 presentes, 8 ausentes e 0 holerites em setembro de 2026.",
      },
      {
        arquivo: "ponto.png",
        alt: "Controle de ponto vazio no mês de setembro de 2026",
        legenda: "O período vai de 01/09/2026 a 30/09/2026. O botão do dia é Bater entrada.",
      },
      {
        arquivo: "ponto-lancar.png",
        alt: "Formulário de lançar ponto preenchido para Usuário teste",
        legenda: "Entrada 08:00, intervalo de 12:00 a 13:00 e saída 18:00, em 27/09/2026.",
      },
      {
        arquivo: "holerites.png",
        alt: "Holerites de setembro de 2026, ainda sem arquivo",
        legenda: "0 enviados e 8 usuários ativos sem contracheque neste mês.",
      },
      {
        arquivo: "holerite-enviar.png",
        alt: "Envio de holerite preenchido com o arquivo contracheque.pdf",
        legenda: "Usuário teste, competência setembro de 2026 e o PDF de exemplo.",
      },
    ],
    passos: [
      {
        titulo: "Abra a visão geral",
        imagens: ["rh.png"],
        texto: "Em RH, no grupo Gestão, o submenu traz Visão geral, Controle de ponto e Holerites. O texto é Controle de ponto dos usuários e holerites da clínica. No alto ficam Holerites e Controle de ponto. Os cards são Presentes hoje (com a quantidade de usuários ativos), Ausentes hoje (com a dica Usuários ativos sem batida de entrada), Ponto em aberto (com a dica Entrada registrada sem horário de saída) e Holerites do mês (com quantos usuários ainda estão sem arquivo na competência). Neste exemplo, 0 presentes, 8 usuários ativos, 8 ausentes, 0 em aberto e 0 holerites em setembro de 2026. O quadro Ponto de hoje mostra a data, aqui 27/09/2026, e a frase batidas registradas nesta data. Sem batida, o título é Nenhuma batida hoje e o texto é Lance o ponto dos usuários ou registre o seu próprio horário. Submódulos reúne os atalhos da rotina de RH. Controle de ponto diz Entrada, intervalo e saída dos usuários, com 0 presentes hoje. Holerites diz Contracheques por competência, com 0 em setembro de 2026.",
      },
      {
        titulo: "Acompanhe o ponto",
        imagens: ["ponto.png"],
        texto: "Controle de ponto diz Batidas de entrada, intervalo e saída dos usuários da clínica. Bater entrada fica no alto, para quem tem Criar, e grava só o seu horário de hoje, no relógio do momento. A sequência do botão é Bater entrada, Bater início do intervalo, Bater retorno do intervalo e Bater saída. Cada batida avisa com o horário, por exemplo Entrada registrada. Quando o dia fecha, o botão mostra Ponto completo e deixa de aceitar clique. Os cards são Presentes hoje (aqui 0, com a dica 8 ainda sem entrada), Ausentes hoje (8, Usuários ativos sem batida no dia), Registros no período (0, com 0 completos · 0 em andamento) e Horas trabalhadas (0 min, Soma dos dias com entrada e saída). A busca pede usuário ou horário. O período abre no mês corrente, aqui de 01/09/2026 a 30/09/2026. O filtro é Todos os usuários. Lançar ponto aparece para administrador e gestor. Colunas lista Usuário, Data, Entrada, Intervalo, Saída, Horas e Status. Exportar gera controle-de-ponto.csv e fica indisponível enquanto a lista está vazia. Nesta clínica o título é Nenhum ponto no período e o texto é Ajuste o intervalo ou lance o primeiro registro do dia. Com linha, a tabela traz o nome com o perfil abaixo, a data, a entrada, o intervalo no formato início – retorno, a saída, as horas e o selo Completo, Em andamento ou Incompleto. Completo exige entrada e saída. Só a entrada deixa Em andamento. Os três pontos trazem Editar e Excluir.",
      },
      {
        titulo: "Lance o ponto",
        imagens: ["ponto-lancar.png"],
        texto: "Lançar ponto diz Informe os horários do dia. O intervalo é opcional para quem não sai para almoço. Usuário e Data são obrigatórios. O usuário abre em Selecione e lista quem está ativo. Entrada, Início do intervalo, Retorno do intervalo, Saída e Observação ficam livres. Neste exemplo, o usuário é Usuário teste, a data é 27/09/2026, a entrada é 08:00, o intervalo vai de 12:00 a 13:00, a saída é 18:00 e a observação é Ajuste manual do dia. Cancelar fecha. Lançar ponto grava. O aviso é Ponto lançado, com o nome na descrição. Já existir registro naquela data responde: Já existe um registro de ponto para este usuário nesta data. Intervalo sem entrada responde: Informe a entrada antes do intervalo. Retorno sem início responde: Informe o início do intervalo antes do retorno. Saída sem entrada responde: Informe a entrada antes da saída. Um horário fora de ordem responde que ele deve ser posterior ao anterior, por exemplo: O horário de saída deve ser posterior ao de retorno do intervalo. Editar ponto reabre o mesmo formulário, com Usuário e Data desabilitados. O botão passa a ser Salvar e o aviso, Ponto atualizado. Excluir pergunta Excluir registro de ponto? O texto diz que o ponto da pessoa naquela data será removido. Cancelar volta. Excluir confirma. O aviso é Ponto excluído. Nesta clínica o período ainda não tem linha, então Editar e Excluir não aparecem na lista.",
      },
      {
        titulo: "Consulte os holerites",
        imagens: ["holerites.png"],
        texto: "Holerites diz Contracheques enviados por usuário e competência. Os cards são Enviados (aqui 0, em setembro de 2026), Sem holerite (8, Usuários ativos ainda sem arquivo neste mês) e Usuários ativos (8, Base para o controle da competência). A busca pede usuário ou arquivo. A competência abre no mês corrente, aqui setembro de 2026. O filtro é Todos os usuários. Enviar holerite aparece para administrador e gestor. Colunas lista Usuário, Competência, Arquivo e Enviado por. Exportar gera holerites.csv e fica indisponível enquanto a lista está vazia. Nesta clínica o título é Nenhum holerite nesta competência e o texto é Envie o contracheque dos usuários para esta competência. Com linha, a tabela traz o nome com o perfil abaixo, a competência, o arquivo com o tamanho em KB e quem enviou, com a data. Os três pontos trazem Baixar e, para quem tem Desativar, Excluir.",
      },
      {
        titulo: "Envie o holerite",
        imagens: ["holerite-enviar.png"],
        texto: "Enviar holerite diz Anexe o contracheque do usuário na competência escolhida. Um arquivo por mês. Usuário, Competência e Arquivo são obrigatórios. A dica do arquivo é PDF, JPG ou PNG de até 10 MB. A competência abre no mês da lista. Neste exemplo, o usuário é Usuário teste, a competência é setembro de 2026 e o arquivo escolhido é contracheque.pdf. Cancelar fecha. Enviar grava. O aviso é Holerite enviado, com o nome na descrição. Repetir o mês da mesma pessoa responde: Já existe um holerite para este usuário nesta competência. Arquivo acima de 10 MB responde: O arquivo deve ter no máximo 10 MB. Outro formato responde: Envie um arquivo PDF, JPG ou PNG. Baixar baixa o arquivo da linha. Excluir pergunta Excluir holerite? O texto cita o nome e a competência. Cancelar volta. Excluir confirma. O aviso é Holerite excluído.",
      },
    ],
    dicas: [
      "O ponto é da conta de usuário, não do cadastro clínico em Profissionais. A pessoa precisa ter login ativo para entrar na lista e bater o horário.",
      "Bater entrada grava só o seu dia, na ordem entrada, início do intervalo, retorno e saída. Lançar ponto, da gestão, aceita o dia sem intervalo.",
      "Financeiro, recepção e profissional de saúde abrem Meu ponto e Meus holerites, só com os próprios registros. Lançar ponto e Enviar holerite ficam com administrador e gestor.",
      "A data inicial do período não pode ser posterior à final. O aviso é: A data inicial não pode ser posterior à final.",
      "No Plano Essencial o menu segue com RH, sem cadeado.",
    ],
  },
  {
    slug: "relatorios",
    titulo: "Relatórios",
    grupo: "Gestão",
    resumo: "Faturamento, atendimentos, inadimplência, novos x recorrentes, produtividade e comissões.",
    acesso: "Plano Profissional ou Ilimitado. Administrador, gestor e financeiro. Recepção e profissional de saúde ficam de fora no padrão de fábrica.",
    prints: [
      {
        arquivo: "relatorios.png",
        alt: "Aba Faturamento em setembro de 2026, com total, gráfico e a linha do profissional",
        legenda: "Este mês. Total R$ 360,00, dois atendimentos e ticket médio de R$ 180,00.",
      },
      {
        arquivo: "relatorios-faturamento.png",
        alt: "Quebra do faturamento por convênio e por procedimento",
        legenda: "Particular e o procedimento Valor Alterado (Avaliação), os dois com R$ 360,00.",
      },
      {
        arquivo: "relatorios-periodo.png",
        alt: "Seletor de período aberto em Este mês",
        legenda: "Este mês, Mês anterior, Últimos 30 dias, Últimos 12 meses e Ano corrente.",
      },
      {
        arquivo: "relatorios-atendimentos.png",
        alt: "Aba Atendimentos com realizados, cancelados e faltas",
        legenda: "Dois horários na agenda, os dois com status Atendido.",
      },
      {
        arquivo: "relatorios-inadimplencia.png",
        alt: "Aba Inadimplência com duas cobranças vencidas",
        legenda: "R$ 300,00 em atraso, um de cada paciente teste.",
      },
      {
        arquivo: "relatorios-pacientes.png",
        alt: "Aba Novos x recorrentes em setembro de 2026",
        legenda: "Dois cadastros novos e nenhum recorrente atendido.",
      },
      {
        arquivo: "relatorios-produtividade.png",
        alt: "Aba Produtividade com a linha do profissional",
        legenda: "Profissional teste, Pediatria, ocupação de 100,0% e faturamento de R$ 360,00.",
      },
      {
        arquivo: "relatorios-comissoes.png",
        alt: "Aba Comissões vazia em setembro de 2026",
        legenda: "Total do período em R$ 0,00 e o aviso Sem dados no período.",
      },
    ],
    passos: [
      {
        titulo: "Abra o faturamento",
        imagens: ["relatorios.png"],
        texto: "Em Relatórios, no grupo Gestão, não há submenu. O Dashboard também chega aqui por Ver relatórios, e a visão geral do Financeiro pelo botão Relatórios financeiros. O título é Relatórios. O texto de apoio, neste exemplo, é Visão gerencial de setembro 2026. Filtros de período, tabela, gráfico e exportação CSV. O seletor no alto abre em Este mês. As abas são Faturamento, Atendimentos, Inadimplência, Novos x recorrentes, Produtividade e Comissões. A primeira já vem aberta. O bloco Faturamento diz Receita dos atendimentos realizados no período, por profissional, convênio e procedimento. Exportar fica no canto. Os cards são Total, Atendimentos, Ticket médio e Convênios ativos. Aqui o total é R$ 360,00, com 2 atendimentos, ticket médio de R$ 180,00 e 1 convênio ativo. O gráfico de área usa os dias de setembro no eixo e sobe até R$ 180,00, com dois picos no mês. A tabela lista Profissional, Atendimentos e Faturamento. A linha é Profissional teste, com 2 atendimentos e R$ 360,00. O total soma só o horário marcado como Atendido. Exportar deste bloco baixa relatorio-faturamento.csv.",
      },
      {
        titulo: "Veja convênio e procedimento",
        imagens: ["relatorios-faturamento.png"],
        texto: "Role a mesma aba. Por convênio diz Distribuição particular x operadoras. O gráfico fica todo em Particular, e a tabela traz Origem, Atendimentos e Valor: Particular, 2 e R$ 360,00. Por procedimento diz Receita gerada por serviço oferecido. As colunas são Procedimento, Qtde. e Valor. A linha é Valor Alterado (Avaliação), quantidade 2 e R$ 360,00. Cada bloco tem o próprio Exportar: relatorio-faturamento-convenio.csv e relatorio-faturamento-procedimento.csv. O card Convênios ativos, no alto, conta operadoras com status Ativo nesta clínica, aqui 1. A tabela de origem mostra só o que foi atendido no período. Neste mês a receita inteira está em Particular.",
      },
      {
        titulo: "Escolha o período",
        imagens: ["relatorios-periodo.png"],
        texto: "O seletor fica no alto, à direita, com o rótulo do período aberto. Neste exemplo ele mostra Este mês, já marcado. A lista é Este mês, Mês anterior, Últimos 30 dias, Últimos 12 meses e Ano corrente. A frase abaixo do título acompanha a escolha: setembro 2026, agosto 2026, Últimos 30 dias, Últimos 12 meses ou 2026. O mesmo período vale para todas as abas. Em Este mês, Mês anterior e Últimos 30 dias o gráfico usa o dia, como 01/09. Em Últimos 12 meses e no Ano corrente o gráfico agrupa por mês, como set. Trocar o período recarrega a aba aberta.",
      },
      {
        titulo: "Conte os atendimentos",
        imagens: ["relatorios-atendimentos.png"],
        texto: "Atendimentos diz Realizados, cancelados e faltas no período selecionado. Os cards são Total na agenda, Realizados, Cancelados e Faltas. Aqui a agenda tem 2, os 2 realizados, 0 cancelados e 0 faltas. A legenda do gráfico é Realizados, Cancelados e Faltas, e as duas barras do mês são de realizados. A tabela traz Status e Quantidade: Atendido 2, Cancelado 0, Faltou 0 e, na linha seguinte, Demais 0. Demais reúne o horário que ainda não entrou nesses três status, como o que segue agendado ou confirmado. Exportar baixa relatorio-atendimentos.csv.",
      },
      {
        titulo: "Veja a inadimplência",
        imagens: ["relatorios-inadimplencia.png"],
        texto: "Inadimplência diz Pacientes com cobranças vencidas em aberto. Os cards são Valor em atraso, Cobranças e Pacientes. Neste exemplo, R$ 300,00, 2 cobranças e 2 pacientes. O gráfico de barras traz uma faixa por pessoa. A tabela lista Paciente, Cobranças e Valor: Paciente teste, 1 cobrança e R$ 150,00; Paciente teste 2, 1 cobrança e R$ 150,00. A lista olha o que está vencido e em aberto hoje. Trocar Este mês por outro período atualiza o texto do topo e as outras abas, e estes três cards permanecem. Exportar baixa relatorio-inadimplencia.csv.",
      },
      {
        titulo: "Compare novos e recorrentes",
        imagens: ["relatorios-pacientes.png"],
        texto: "A aba se chama Novos x recorrentes. O título do bloco é Novos pacientes x recorrentes, e o texto é Cadastros novos no período versus pacientes que já frequentavam a clínica. Os cards são Novos cadastros e Recorrentes atendidos. Aqui, 2 e 0. A legenda é Novos e Recorrentes, com uma barra de novos no mês. A tabela traz Período, Novos e Recorrentes, um dia por linha, de 01/09 a 30/09. Os dois cadastros caem em 08/09. Recorrente atendido é quem teve horário marcado como Atendido no período e o cadastro é anterior a esse intervalo. Exportar baixa relatorio-pacientes.csv.",
      },
      {
        titulo: "Meça a produtividade",
        imagens: ["relatorios-produtividade.png"],
        texto: "Produtividade por profissional diz Atendimentos realizados, faltas, ocupação e faturamento gerado. O gráfico de barras, série Atendidos, fica acima da tabela. As colunas são Profissional, Especialidade, Realizados, Faltas, Ocupação e Faturamento. A linha é Profissional teste, Pediatria, 2 realizados, 0 faltas, ocupação 100,0% e faturamento R$ 360,00. A ocupação divide os realizados pelos horários daquela pessoa no período. 100,0% significa que todos foram marcados como Atendido. A lista traz quem está ativo em Profissionais. Exportar baixa relatorio-produtividade.csv.",
      },
      {
        titulo: "Leia as comissões",
        imagens: ["relatorios-comissoes.png"],
        texto: "Comissões diz Extrato de comissões calculadas no período, com status de pagamento. O card é Total do período, aqui R$ 0,00. Sem linha, o título é Sem dados no período e o texto é Selecione outro período ou verifique se há lançamentos registrados. Exportar fica indisponível enquanto a tabela está vazia. Com linha, as colunas são Profissional, Competência, Atendimentos, Faturamento, Comissão e Status, e o selo é Prevista, Aprovada ou Paga. A competência entra no período quando o dia 15 daquele mês cai no intervalo escolhido. Nesta clínica setembro de 2026 ainda não tem comissão, o mesmo vazio da tela de Comissões no Financeiro. Com linha, Exportar baixa relatorio-comissoes.csv.",
      },
    ],
    dicas: [
      "No Plano Essencial o menu mostra cadeado em Relatórios. No Profissional e no Ilimitado a tela abre. Nesta clínica o plano é Ilimitado, então o item abre direto.",
      "Na matriz de permissões, Relatórios só aceita Visualizar. Criar, Editar e Desativar ficam bloqueados. Administrador, gestor e financeiro entram. Recepção e profissional de saúde ficam de fora no padrão de fábrica.",
      "O seletor de unidade da barra não recorta esta tela. Os números são da clínica inteira.",
      "Exportar baixa um CSV para abrir no Excel. O botão fica indisponível quando a tabela daquele bloco está vazia.",
    ],
  },
  {
    slug: "integracoes",
    titulo: "Integrações e lembretes",
    grupo: "Avançado",
    resumo: "WhatsApp oficial da Meta e as regras que a agenda dispara sozinha.",
    acesso: "Plano Ilimitado. Administrador e gestor, no padrão de fábrica. No Essencial e no Profissional o menu mostra o cadeado Disponível no plano Ilimitado.",
    prints: [
      {
        arquivo: "integracoes.png",
        alt: "Dashboard de integrações em outubro de 2026, sem envios",
        legenda: "De 01/10/2026 a 02/10/2026. Os cards estão em zero e o bloco Últimos envios está vazio.",
      },
      {
        arquivo: "integracoes-config.png",
        alt: "Configuração do WhatsApp, com lembretes desligados e credenciais em branco",
        legenda: "A Meta ainda aguarda configuração. O modo de cobrança é Conta Business da clínica.",
      },
      {
        arquivo: "lembretes.png",
        alt: "Lista das cinco regras de lembrete, todas ativas",
        legenda: "24 horas antes, 2 horas antes, confirmação, reagendamento e cancelamento. O canal é WhatsApp.",
      },
      {
        arquivo: "integracoes-regra.png",
        alt: "Diálogo Nova regra preenchido",
        legenda: "Lembrete da véspera, antecedência de 1440 minutos, paciente e o template Lembrete WhatsApp.",
      },
      {
        arquivo: "lembretes-templates.png",
        alt: "Aba Templates com os quatro textos padrão",
        legenda: "Lembrete, confirmação, reagendamento e cancelamento. A coluna Template Meta está em traço.",
      },
      {
        arquivo: "integracoes-template.png",
        alt: "Diálogo Novo template preenchido",
        legenda: "Nome Lembrete de consulta, template lembrete_consulta na Meta, idioma pt_BR e categoria Utility.",
      },
      {
        arquivo: "historico-envios.png",
        alt: "Histórico de envios vazio no mês corrente",
        legenda: "Nenhum envio encontrado. O filtro de canal está em Todos.",
      },
    ],
    passos: [
      {
        titulo: "Leia o dashboard",
        imagens: ["integracoes.png"],
        texto: "Em Integrações e lembretes, no grupo Avançado, o submenu traz Dashboard, Configurações, Lembretes e Histórico de envios. O título é Integrações e lembretes. O texto é Lembretes de WhatsApp gerados pela agenda. A Meta cobra a conta da clínica. Os valores abaixo são estimativa da tabela vigente. No alto ficam Histórico e Configurações. O período abre no mês corrente: De e Até, aqui 01/10/2026 e 02/10/2026. O status oferece Todos os status, Enviado, Entregue, Falhou e Pendente. O tipo oferece Todos os tipos, Antecedência, Confirmação, Reagendamento e Cancelamento. A primeira fileira é Total de envios (0, com 0 hoje), WhatsApp (0, Canal dos lembretes), Enviados (0, com 0 entregues · 0 falhos) e Pendentes (0, com 0 agendamentos impactados). A segunda é Custo total, Custo WhatsApp e Custo médio, os três em R$ 0,00. A dica dos dois primeiros é Cobrado na conta da clínica. A do médio é Por envio no período. A terceira é Taxa de sucesso e Taxa de falha, as duas em 0,0%, mais Lembretes enviados e Lembretes pendentes, os dois em 0. Envios por canal diz Volume no período filtrado e fica sem fatia quando o volume é zero. Status dos envios diz Distribuição operacional no período e desenha Enviados, Entregues, Pendentes e Falhos, todos no zero. Últimos envios diz Auditoria recente vinculada à agenda, com Ver histórico. Sem linha, o título é Nenhum envio no período e o texto é Quando a agenda gerar lembretes, eles aparecerão aqui.",
      },
      {
        titulo: "Configure o WhatsApp",
        imagens: ["integracoes-config.png"],
        texto: "Configurações de integrações diz Credenciais da Meta, ativação dos lembretes e valores de repasse. O e-mail fica só na recuperação de senha. O cartão Lembretes automáticos diz Somente agendamentos da agenda geram comunicações. O interruptor desta clínica está desligado: sem ele, a agenda não dispara. WhatsApp Business (Meta Cloud API) diz Aguardando configuração da Meta enquanto as credenciais não entram, e o interruptor do canal está ligado. Em Conta de cobrança, a frase é A Meta cobra a WhatsApp Business Account (WABA) cadastrada. O cartão ou boleto é cadastrado no Gerenciador de Negócios da Meta, não neste painel. Quem a Meta cobra abre em Conta Business da clínica (recomendado) e também oferece Conta da plataforma (repasse posterior). No modo da clínica, o texto pede o WABA e o token da própria clínica e a forma de pagamento em business.facebook.com. No modo da plataforma, o texto diz que a plataforma paga a Meta e fatura a clínica depois. Em Conta da Meta, a frase é Dados do app e do número oficial. Tokens nunca são exibidos por completo. Os campos são Phone Number ID, WhatsApp Business Account ID, Meta App ID, Ambiente, Access Token, App Secret e Verify Token. O ambiente abre em Produção e também oferece Sandbox / teste. A dica do token é Cole um token novo para substituir. Deixe a máscara para manter o atual. A do segredo é Usado para validar a assinatura do webhook. A do verify token é O mesmo valor cadastrado no painel da Meta. URL do webhook é só leitura. Número para teste traz o exemplo 5511999999999. Testar conexão só habilita com um número. Salvar WhatsApp grava. Quem só visualiza não vê esses botões.",
      },
      {
        titulo: "Veja as regras",
        imagens: ["lembretes.png"],
        texto: "Lembretes diz Regras e templates aplicados automaticamente aos agendamentos. Não é possível criar um lembrete avulso. Nova regra fica no alto, para quem tem Criar. As abas são Regras e Templates. Em Regras, a busca pede Buscar regra... e Colunas fica ao lado. As colunas são Regra, Tipo, Quando, Destinatários, Canais e Status. Nesta clínica há cinco linhas, todas Ativo, canal WhatsApp e destinatário Paciente. 24 horas antes é Antecedência e Quando mostra 1 dia antes. 2 horas antes é Antecedência e Quando mostra 2 horas antes. Confirmação para o paciente, Reagendamento e Cancelamento repetem o próprio tipo na coluna Quando. A lista diz Exibindo 1–5 de 5 registros. Clicar a linha abre Editar regra, o mesmo formulário, com Excluir. Excluir pergunta Excluir regra? e avisa que os envios já registrados permanecem no histórico.",
      },
      {
        titulo: "Crie a regra",
        imagens: ["integracoes-regra.png"],
        texto: "Nova regra diz A regra só dispara a partir de um agendamento existente. Nome, Tipo, Destinatários e Template WhatsApp são obrigatórios. Em Antecedência também entra Minutos antes. O tipo abre em Antecedência e também oferece Após confirmação, Reagendamento e Cancelamento. Os destinatários são Paciente, Profissional e Paciente e profissional. O template lista só os de WhatsApp. O interruptor Ativa começa ligado. Neste exemplo, o nome é Lembrete da véspera, o tipo é Antecedência, os minutos são 1440, o destinatário é Paciente e o template é Lembrete WhatsApp. 1440 minutos é o que a lista mostra como 1 dia antes. Fechar descarta. Salvar grava. O aviso é Regra criada. Sem template, a tela responde: Selecione o template de WhatsApp. Nome curto demais responde: Informe o nome da regra.",
      },
      {
        titulo: "Veja os templates",
        imagens: ["lembretes-templates.png"],
        texto: "A aba Templates abre o cartão Templates. A frase lista os placeholders {{paciente.nome}}, {{profissional.nome}}, {{data}}, {{horario}}, {{procedimento}} e {{unidade}}. Novo template fica no canto, para quem tem Criar. A busca pede Buscar template... As colunas são Template, Canal, Tipo, Template Meta e Status. Nesta clínica há quatro linhas, todas WhatsApp e Ativo, e Template Meta está em traço porque o nome aprovado na Meta ainda não foi gravado. Lembrete WhatsApp é Antecedência. Confirmação WhatsApp é Confirmação. Reagendamento WhatsApp é Reagendamento. Cancelamento WhatsApp é Cancelamento. A lista diz Exibindo 1–4 de 4 registros. Clicar a linha abre Editar template. Estes quatro são padrão do sistema, então o diálogo não traz Excluir.",
      },
      {
        titulo: "Grave o template",
        imagens: ["integracoes-template.png"],
        texto: "Novo template diz No WhatsApp, o nome precisa coincidir com o template aprovado na Meta. Os placeholders viram variáveis na ordem em que aparecem. Nome, Tipo de evento e Corpo são obrigatórios. O tipo abre em Antecedência e também oferece Confirmação, Reagendamento e Cancelamento. Nome do template na Meta traz a dica Ex.: lembrete_consulta (já aprovado). Idioma abre em pt_BR. Categoria abre em Utility e também oferece Marketing, Authentication e Service. O corpo já sugere Olá {{paciente.nome}}, sua consulta com {{profissional.nome}} é em {{data}} às {{horario}}. O interruptor Ativo começa ligado. Neste exemplo, o nome é Lembrete de consulta e o nome na Meta é lembrete_consulta. Fechar descarta. Salvar grava. O aviso é Template criado. Nome curto demais responde: Informe o nome. Corpo curto demais responde: Informe o conteúdo.",
      },
      {
        titulo: "Confira o histórico",
        imagens: ["historico-envios.png"],
        texto: "Histórico de envios diz Auditoria de cada tentativa: agendamento, destinatário, canal, status, custo e erro. O período usa o mesmo mês do dashboard, aqui de 01/10/2026 a 02/10/2026. O canal oferece Todos e WhatsApp. O status oferece Todos os status, Pendente, Enviado, Entregue, Lido, Falhou e Cancelado. O tipo repete Antecedência, Confirmação, Reagendamento e Cancelamento. A busca pede paciente, profissional ou destinatário. Colunas e Exportar ficam ao lado. Exportar gera historico-envios.csv e fica indisponível enquanto a lista está vazia. Nesta clínica o título é Nenhum envio encontrado e o texto é Ajuste os filtros ou aguarde a agenda gerar lembretes. Com linha, as colunas são Data, Agendamento, Paciente, Profissional, Canal, Destinatário, Tipo, Status, Custo e Erro. O custo traz o valor e, ao lado, estimado ou a faturar.",
      },
    ],
    dicas: [
      "Não existe lembrete avulso. A mensagem só sai de um horário que já está na agenda, e só com o interruptor Lembretes automáticos ligado.",
      "O e-mail não se configura nesta tela. Ele continua só na recuperação de senha.",
      "Deixe a máscara no token para manter o que já foi salvo. Colar um valor novo substitui o anterior. O campo nunca mostra o segredo inteiro.",
      "No Essencial e no Profissional o menu mostra o cadeado de Integrações e lembretes, com o balão Disponível no plano Ilimitado.",
    ],
  },
  {
    slug: "em-breve",
    titulo: "Power BI e Agente de IA",
    grupo: "Avançado",
    resumo: "Dois itens do menu que, no plano Ilimitado, ainda avisam que a função entra nas próximas entregas.",
    acesso: "Administrador e gestor. No plano abaixo do Ilimitado, a tela troca o aviso por cadeado. No Ilimitado, as duas telas dizem Em breve neste plano.",
    prints: [
      {
        arquivo: "power-bi.png",
        alt: "Tela do Power BI com o aviso Em breve neste plano",
        legenda: "O plano Ilimitado já libera a área. O painel externo ainda não está embutido.",
      },
      {
        arquivo: "agente-ia.png",
        alt: "Tela do Agente de IA com o aviso Em breve neste plano",
        legenda: "O assistente ainda não responde dentro do sistema.",
      },
    ],
    passos: [
      {
        titulo: "Abra o Power BI",
        imagens: ["power-bi.png"],
        texto: "Power BI fica no grupo Avançado, sem submenu. O título é Power BI e o texto é Painéis gerenciais com os dados da clínica no Power BI. Nesta clínica o plano é Ilimitado, então não há cadeado. O cartão diz Em breve neste plano e Esta área já está liberada no seu plano. A implementação entra nas próximas entregas. A lista reserva Conexão com o workspace da clínica, Indicadores de agenda, faturamento e produtividade e Atualização automática dos conjuntos de dados. Não há formulário nem botão de conectar. Enquanto o relatório externo não entra, use Relatórios, no grupo Gestão.",
      },
      {
        titulo: "Abra o Agente de IA",
        imagens: ["agente-ia.png"],
        texto: "Agente de IA fica logo abaixo, também sem submenu. O título é Agente de IA e o texto é Assistente da clínica para rotinas, dúvidas operacionais e apoio à recepção. O cartão repete Em breve neste plano e a mesma frase de área já liberada. A lista reserva Respostas sobre agenda, pacientes e procedimentos, Sugestões de encaixe e confirmação de consultas e Apoio à equipe sem substituir o prontuário clínico. Não há campo de pergunta. Dúvidas de uso continuam neste manual.",
      },
    ],
    dicas: [
      "No Essencial e no Profissional as duas telas trocam o aviso. O título passa a ser Disponível no plano Ilimitado e o texto pede upgrade.",
      "O cadeado ou o aviso Em breve neste plano é o comportamento esperado. A função ainda não opera no dia a dia.",
    ],
  },
  {
    slug: "configuracoes",
    titulo: "Configurações",
    grupo: "Sistema",
    resumo: "Dados da clínica, unidades, usuários, procedimentos, formas de pagamento e tema.",
    acesso: "Em geral só o administrador. Usuários e Perfis e permissões são exclusivos dele. A matriz de permissões está no capítulo Perfis de acesso.",
    prints: [
      {
        arquivo: "clinica.png",
        alt: "Dados da clínica, com logo, nome fantasia e razão social",
        legenda: "Luna - Centro de Desenvolvimento Infantil. CNPJ, telefone e e-mail ficam fora de foco.",
      },
      {
        arquivo: "configuracoes-unidades.png",
        alt: "Endereço da clínica e a unidade Sede Franca",
        legenda: "Cidade Franca e UF SP. A única unidade está Ativo.",
      },
      {
        arquivo: "configuracoes-unidade.png",
        alt: "Diálogo Nova unidade preenchido",
        legenda: "Unidade Centro, cidade Franca.",
      },
      {
        arquivo: "usuarios.png",
        alt: "Lista de usuários com a etiqueta do plano Ilimitado",
        legenda: "Ilimitado · 7 usuários · sem limite. O nome nas linhas é Usuário teste.",
      },
      {
        arquivo: "configuracoes-usuario.png",
        alt: "Diálogo Novo usuário preenchido",
        legenda: "Usuário teste, perfil Recepção e unidade Sede Franca.",
      },
      {
        arquivo: "configuracoes-perfil.png",
        alt: "Diálogo Alterar perfil com Gestor selecionado",
        legenda: "A conta de exemplo é Usuário teste 2. Salvar perfil grava a troca.",
      },
      {
        arquivo: "procedimentos.png",
        alt: "Catálogo com Avaliação, Consulta e um procedimento inativo",
        legenda: "Avaliação a R$ 150,00 e Consulta a R$ 200,00. A coluna Convênios está em 0.",
      },
      {
        arquivo: "configuracoes-procedimento.png",
        alt: "Diálogo Novo procedimento preenchido",
        legenda: "Retorno, categoria Consulta, 30 minutos e valor particular R$ 150,00.",
      },
      {
        arquivo: "pagamentos.png",
        alt: "Formas de pagamento, todas ativas",
        legenda: "Dinheiro e PIX sem taxa. Débito 1,5%, crédito 3,3% e boleto 2,5%.",
      },
      {
        arquivo: "estilizacao.png",
        alt: "Escolha de tema, com Claro em uso",
        legenda: "Claro está marcado. Escuro fica ao lado.",
      },
    ],
    passos: [
      {
        titulo: "Atualize a identificação",
        imagens: ["clinica.png"],
        texto: "Em Configurações, no grupo Sistema, o submenu e as abas do topo são os mesmos: Dados da clínica, Usuários, Perfis e permissões, Procedimentos, Pagamentos e Estilização. Dados da clínica diz Identidade, endereço e unidades usadas no seletor de contexto. O cartão Logo diz Aparece no painel e pode ser usada em documentos da clínica. Com arquivo, os botões são Trocar logo e Remover. Sem arquivo, o botão é Enviar logo. A dica é JPG, PNG ou WebP de até 2 MB. Em Identificação, a frase é Informações exibidas em documentos e no cabeçalho. Nome fantasia, Razão social, CNPJ, Telefone e E-mail são obrigatórios. O nome fantasia é o que aparece no menu. Nesta clínica, o nome fantasia é Luna - Centro de Desenvolvimento Infantil e a razão social é Luna Centro de Fisioterapia Infantil. Salvar alterações grava. O aviso é Dados da clínica salvos.",
      },
      {
        titulo: "Confira o endereço e as unidades",
        imagens: ["configuracoes-unidades.png"],
        texto: "Role a mesma tela. Endereço diz Usado em notas, contratos e comprovantes. CEP, UF, Cidade, Bairro, Logradouro e Número são obrigatórios. Complemento é opcional. Ao sair do CEP, o painel completa logradouro, bairro, cidade e UF. Nesta clínica a cidade é Franca e a UF é SP. Abaixo do formulário, o cartão Unidades muda com o contrato. No Ilimitado, a frase é Filiais disponíveis no seletor da topbar (multi-unidade) e Nova unidade fica disponível. As colunas são Unidade, Cidade e Status. A linha é Sede Franca, Franca e Ativo. Os três pontos trazem Editar e Inativar. Com uma única unidade ativa, Inativar fica indisponível: a clínica precisa manter ao menos uma. Salvar alterações, no formulário de cima, não grava a unidade. A unidade tem o próprio diálogo.",
      },
      {
        titulo: "Cadastre uma unidade",
        imagens: ["configuracoes-unidade.png"],
        texto: "Nova unidade diz Administradores passam a ter acesso automaticamente. Nome e Cidade são obrigatórios. Os exemplos do campo vazio são Unidade Centro e Ribeirão Preto. Neste preenchimento, o nome é Unidade Centro e a cidade é Franca. Cancelar fecha. Cadastrar grava e a unidade passa a aparecer no seletor da barra. O aviso é Unidade cadastrada. Editar unidade reabre o mesmo par de campos, com a frase O nome aparece no seletor de contexto da topbar, e o botão passa a ser Salvar. Inativar unidade, quando há mais de uma ativa, avisa que ela sai do seletor e que agendamentos e cadastros já feitos são mantidos. No Essencial, Nova unidade fica indisponível, com o aviso Limite do plano atingido, como no capítulo Planos.",
      },
      {
        titulo: "Veja os usuários",
        imagens: ["usuarios.png"],
        texto: "Usuários diz Contas com acesso ao painel. O limite segue o plano configurado no deploy. A etiqueta desta clínica é Ilimitado · 7 usuários · sem limite. A busca pede nome ou e-mail. O filtro é Todo status e também oferece Ativos e Inativos. Novo usuário, Colunas e Exportar ficam ao lado. Exportar gera usuarios.csv. As colunas são Usuário, Perfil, Unidades, Último acesso e Status. O usuário mostra o nome e, abaixo, o e-mail. Nesta figura o nome é Usuário teste. A primeira linha é Administrador, Sede Franca, último acesso em 27/09/2026 e Ativo. Há também Recepção, Gestor e Financeiro. Duas linhas de Financeiro estão Inativo, com último acesso em Nunca. A lista diz Exibindo 1–9 de 9 registros. A sua própria conta não traz os três pontos. Nas outras, o menu da conta ativa é Alterar perfil e Inativar. Na inativa, Inativar vira Reativar.",
      },
      {
        titulo: "Crie um usuário",
        imagens: ["configuracoes-usuario.png"],
        texto: "Novo usuário diz A conta entra no limite do plano. Envie a senha inicial ao colaborador por um canal seguro. Nome, E-mail, Senha inicial, Perfil e Unidade principal são obrigatórios. O e-mail é o login e não pode repetir. A senha tem no mínimo 8 caracteres. O perfil abre em Selecione e lista Administrador, Financeiro, Gestor, Profissional de saúde e Recepção. A unidade lista as ativas, aqui Sede Franca. Neste exemplo, o nome é Usuário teste, o e-mail é usuario.teste@clinic.local, o perfil é Recepção e a unidade é Sede Franca. Cancelar fecha. Criar usuário grava. O aviso é Usuário criado, com o e-mail na descrição. Inativar pergunta Inativar usuário? e avisa que a pessoa perde o acesso na hora, o histórico fica e a vaga do plano é liberada. Reativar avisa que a conta volta a ocupar uma vaga.",
      },
      {
        titulo: "Altere o perfil",
        imagens: ["configuracoes-perfil.png"],
        texto: "Alterar perfil diz que o acesso daquela pessoa no painel segue o perfil escolhido. Neste exemplo, Usuário teste 2. O campo Perfil é obrigatório e traz os cinco perfis. A figura troca para Gestor. Salvar perfil só habilita quando a escolha é diferente da atual. Cancelar fecha. O aviso é Perfil atualizado, com o nome e o perfil novo. A matriz do que cada perfil pode ver, criar, editar e desativar fica em Perfis e permissões, no capítulo Perfis de acesso. Não há perfil novo: a lista permanece nesses cinco.",
      },
      {
        titulo: "Mantenha os procedimentos",
        imagens: ["procedimentos.png"],
        texto: "Procedimentos diz Serviços oferecidos pela clínica: duração padrão, valor particular e vínculo com a agenda. A busca pede o procedimento. O filtro de categoria abre em Todas as categorias. O de status abre em Todo status e também oferece Ativos e Inativos. Novo procedimento, Colunas e Exportar ficam ao lado. Exportar gera procedimentos.csv. As colunas são Procedimento, Categoria, Duração, Particular, Convênios e Status. Nesta clínica, Avaliação é Exame, 30 min, R$ 150,00, 0 convênios e Ativo. Consulta é Consulta, 1h, R$ 200,00, 0 e Ativo. Valor Alterado (Avaliação) é Consulta, 30 min, R$ 180,00, 0 e Inativo. A lista diz Exibindo 1–3 de 3 registros. A duração de 60 minutos aparece como 1h. A coluna Convênios conta preços na ficha da operadora, não o valor particular. Os três pontos da linha ativa trazem Editar e Inativar. Na inativa, Inativar vira Reativar.",
      },
      {
        titulo: "Cadastre um procedimento",
        imagens: ["configuracoes-procedimento.png"],
        texto: "Novo procedimento diz Duração padrão alimenta a agenda; valores de convênio saem na ficha da operadora. Nome, Categoria, Duração padrão (min) e Valor particular são obrigatórios. A duração aceita de 10 a 240 minutos e abre em 30. A categoria abre em Selecione e lista Consulta, Exame, Procedimento cirúrgico, Odontologia, Estética e Terapia. Neste exemplo, o nome é Retorno, a categoria é Consulta, a duração é 30 e o valor particular é R$ 150,00. Cancelar fecha. Cadastrar grava. O aviso é Procedimento cadastrado, com o nome na descrição. Editar procedimento reabre o mesmo formulário, com a frase Alterações de duração passam a valer nos próximos agendamentos, e o botão passa a ser Salvar alterações. Inativar pergunta Inativar procedimento? e avisa que ele deixará de aparecer na criação de agendamentos.",
      },
      {
        titulo: "Ligue as formas de pagamento",
        imagens: ["pagamentos.png"],
        texto: "A aba Pagamentos abre Formas de pagamento. O texto é Canais aceitos no caixa e no faturamento particular. Salvar fica no alto, para quem tem Editar em Financeiro. O cartão Canais ativos diz Taxas informativas para o cálculo de líquido no financeiro. As colunas são Forma, Taxa e Ativo. Nesta clínica as seis estão ligadas. Dinheiro, PIX e Faturamento por convênio mostram Sem taxa. Cartão de débito está em 1,5%, Cartão de crédito em 3,3% e Boleto bancário em 2,5%. O interruptor da linha liga ou desliga o canal. Salvar grava. O aviso é Formas de pagamento salvas. A taxa não cobra ninguém por aqui: ela só informa o líquido no financeiro.",
      },
      {
        titulo: "Escolha o tema",
        imagens: ["estilizacao.png"],
        texto: "Estilização diz Escolha o tema visual do sistema. A preferência é salva na sua conta e vale em qualquer dispositivo. Os cartões são Claro e Escuro. Claro diz O tema atual do sistema, com fundo claro e barra lateral em teal. Escuro diz Superfícies escuras no padrão TailAdmin, com cards elevados e gráficos em alto contraste. O cartão em uso ganha a marca Em uso. Nesta figura, Claro está em uso. Clicar o outro aplica na hora, sem botão de salvar. O mesmo controle existe no ícone de tema da barra superior.",
      },
    ],
    dicas: [
      "A sua conta não aparece no menu da linha. Inativar a si mesmo responde: Você não pode alterar o status da própria conta.",
      "O último administrador ativo não sai. A tela responde: Não é possível inativar o último administrador da clínica.",
      "Duração abaixo de 10 minutos responde: Duração mínima de 10 minutos. Acima de 240 responde: Duração máxima de 240 minutos.",
      "No Plano Essencial, Nova unidade fica indisponível e a aba Pagamentos sai, porque depende do módulo Financeiro. No Profissional e no Ilimitado as duas voltam.",
      "Perfis e permissões não se repete aqui. A matriz, com Visualizar, Criar, Editar e Desativar, está no capítulo Perfis de acesso.",
    ],
  },
];

export const grupos = ["Começar", "Operação", "Gestão", "Avançado", "Sistema"] as const;

export function capituloPorSlug(slug: string) {
  return capitulos.find((item) => item.slug === slug);
}
