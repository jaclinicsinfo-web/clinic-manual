import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");
const clinicaId = "11111111-1111-4111-8111-111111111111";
const unidadeId = "22222222-2222-4222-8222-222222222222";
const perfilAdmin = "33333333-3333-4333-8333-333333333333";
const perfilFinanceiro = "33333333-3333-4333-8333-333333333334";
const perfilGestor = "33333333-3333-4333-8333-333333333335";
const perfilProfissional = "33333333-3333-4333-8333-333333333336";
const perfilRecepcao = "33333333-3333-4333-8333-333333333337";

const modulos = [
  "dashboard",
  "pacientes",
  "agenda",
  "profissionais",
  "financeiro",
  "convenios",
  "estoque",
  "relatorios",
  "rh",
  "configuracoes",
  "integracoes",
  "powerbi",
  "agenteia",
];

const permissoes = modulos.map((modulo) => ({
  modulo,
  visualizar: true,
  criar: true,
  editar: true,
  excluir: true,
}));

const plano = {
  codigo: "ilimitado",
  nome: "Ilimitado",
  limiteUsuarios: null,
  limiteUnidades: null,
  modulos,
};

const unidade = { id: unidadeId, nome: "Sede Franca", cidade: "Franca", ativo: true };
const uso = { usados: 7, limite: null, podeAdicionar: true };

const perfis = [
  { id: perfilAdmin, nome: "Administrador", descricao: "Acesso total ao sistema", sistema: true, permissoes },
  { id: perfilFinanceiro, nome: "Financeiro", descricao: "Gestão financeira e convênios", sistema: true, permissoes },
  { id: perfilGestor, nome: "Gestor", descricao: "Gerencia a operação da clínica", sistema: true, permissoes },
  { id: perfilProfissional, nome: "Profissional de saúde", descricao: "Atendimento clínico e agenda", sistema: true, permissoes },
  { id: perfilRecepcao, nome: "Recepção", descricao: "Atendimento, agendamento e cadastro de pacientes", sistema: true, permissoes },
];

function usuario(id, nome, email, perfilId, perfilNome, status, ultimoAcesso) {
  return {
    id,
    nome,
    email,
    perfilId,
    perfilNome,
    unidadesAcesso: [unidadeId],
    status,
    ultimoAcesso,
    tema: "claro",
  };
}

const usuarios = [
  usuario("u1", "Usuário teste", "usuario.teste@clinic.local", perfilAdmin, "Administrador", "ativo", "2026-09-27T15:59:00.000Z"),
  usuario("u2", "Usuário teste 2", "usuario.teste.2@clinic.local", perfilRecepcao, "Recepção", "ativo", "2026-09-10T16:22:00.000Z"),
  usuario("u3", "Usuário teste 3", "usuario.teste.3@clinic.local", perfilGestor, "Gestor", "ativo", "2026-09-09T22:23:00.000Z"),
  usuario("u4", "Usuário teste 4", "usuario.teste.4@clinic.local", perfilFinanceiro, "Financeiro", "ativo", "2026-09-09T22:15:00.000Z"),
  usuario("u5", "Usuário teste 5", "usuario.teste.5@clinic.local", perfilFinanceiro, "Financeiro", "inativo", null),
  usuario("u6", "Usuário teste 6", "usuario.teste.6@clinic.local", perfilFinanceiro, "Financeiro", "inativo", null),
  usuario("u7", "Usuário teste 7", "usuario.teste.7@clinic.local", perfilAdmin, "Administrador", "ativo", "2026-09-27T16:59:00.000Z"),
  usuario("u8", "Usuário teste 8", "usuario.teste.8@clinic.local", perfilAdmin, "Administrador", "ativo", "2026-09-11T00:14:00.000Z"),
  usuario("u9", "Usuário teste 9", "usuario.teste.9@clinic.local", perfilAdmin, "Administrador", "ativo", null),
];

const eu = usuarios[0];

const clinica = {
  id: clinicaId,
  nomeFantasia: "Luna - Centro de Desenvolvimento Infantil",
  razaoSocial: "Luna Centro de Fisioterapia Infantil",
  cnpj: "00000000000191",
  telefone: "16900000000",
  email: "contato@clinic.local",
  endereco: {
    cep: "14400000",
    rua: "Rua Exemplo",
    numero: "100",
    complemento: "",
    bairro: "Centro",
    cidade: "Franca",
    uf: "SP",
  },
  temLogo: true,
  unidades: [unidade],
};

const procedimentos = [
  { id: "p1", nome: "Avaliação", categoria: "Exame", duracaoPadraoMin: 30, valorParticular: 150, valoresPorConvenio: [], status: "ativo" },
  { id: "p2", nome: "Consulta", categoria: "Consulta", duracaoPadraoMin: 60, valorParticular: 200, valoresPorConvenio: [], status: "ativo" },
  { id: "p3", nome: "Valor Alterado (Avaliação)", categoria: "Consulta", duracaoPadraoMin: 30, valorParticular: 180, valoresPorConvenio: [], status: "inativo" },
];

const categorias = ["Consulta", "Exame", "Procedimento cirúrgico", "Odontologia", "Estética", "Terapia"];

const formas = [
  { id: "f1", codigo: "dinheiro", nome: "Dinheiro", taxa: 0, ativo: true },
  { id: "f2", codigo: "pix", nome: "PIX", taxa: 0, ativo: true },
  { id: "f3", codigo: "cartao_debito", nome: "Cartão de débito", taxa: 1.5, ativo: true },
  { id: "f4", codigo: "cartao_credito", nome: "Cartão de crédito", taxa: 3.3, ativo: true },
  { id: "f5", codigo: "boleto", nome: "Boleto bancário", taxa: 2.5, ativo: true },
  { id: "f6", codigo: "convenio", nome: "Faturamento por convênio", taxa: 0, ativo: true },
];

const templates = [
  { id: "t1", canal: "whatsapp", tipo: "antecedencia", nome: "Lembrete WhatsApp", assunto: null, corpo: "Olá {{paciente.nome}}, lembrete da sua consulta com {{profissional.nome}} em {{data}} às {{horario}} ({{procedimento}}) na unidade {{unidade}}.", whatsappNomeTemplate: null, whatsappIdioma: "pt_BR", whatsappCategoria: "utility", ativo: true, sistema: true },
  { id: "t2", canal: "whatsapp", tipo: "confirmacao", nome: "Confirmação WhatsApp", assunto: null, corpo: "Consulta confirmada: {{paciente.nome}} com {{profissional.nome}} em {{data}} às {{horario}}.", whatsappNomeTemplate: null, whatsappIdioma: "pt_BR", whatsappCategoria: "utility", ativo: true, sistema: true },
  { id: "t3", canal: "whatsapp", tipo: "reagendamento", nome: "Reagendamento WhatsApp", assunto: null, corpo: "Sua consulta foi reagendada para {{data}} às {{horario}}.", whatsappNomeTemplate: null, whatsappIdioma: "pt_BR", whatsappCategoria: "utility", ativo: true, sistema: true },
  { id: "t4", canal: "whatsapp", tipo: "cancelamento", nome: "Cancelamento WhatsApp", assunto: null, corpo: "A consulta de {{paciente.nome}} em {{data}} às {{horario}} foi cancelada.", whatsappNomeTemplate: null, whatsappIdioma: "pt_BR", whatsappCategoria: "utility", ativo: true, sistema: true },
];

const regras = [
  { id: "r1", nome: "24 horas antes", tipo: "antecedencia", antecedenciaMinutos: 1440, destinatarios: "paciente", canais: ["whatsapp"], templateWhatsappId: "t1", templateEmailId: null, templateWhatsappNome: "Lembrete WhatsApp", templateEmailNome: null, ativo: true, sistema: true, ordem: 1 },
  { id: "r2", nome: "2 horas antes", tipo: "antecedencia", antecedenciaMinutos: 120, destinatarios: "paciente", canais: ["whatsapp"], templateWhatsappId: "t1", templateEmailId: null, templateWhatsappNome: "Lembrete WhatsApp", templateEmailNome: null, ativo: true, sistema: true, ordem: 2 },
  { id: "r3", nome: "Confirmação para o paciente", tipo: "confirmacao", antecedenciaMinutos: null, destinatarios: "paciente", canais: ["whatsapp"], templateWhatsappId: "t2", templateEmailId: null, templateWhatsappNome: "Confirmação WhatsApp", templateEmailNome: null, ativo: true, sistema: true, ordem: 3 },
  { id: "r4", nome: "Reagendamento", tipo: "reagendamento", antecedenciaMinutos: null, destinatarios: "paciente", canais: ["whatsapp"], templateWhatsappId: "t3", templateEmailId: null, templateWhatsappNome: "Reagendamento WhatsApp", templateEmailNome: null, ativo: true, sistema: true, ordem: 5 },
  { id: "r5", nome: "Cancelamento", tipo: "cancelamento", antecedenciaMinutos: null, destinatarios: "paciente", canais: ["whatsapp"], templateWhatsappId: "t4", templateEmailId: null, templateWhatsappNome: "Cancelamento WhatsApp", templateEmailNome: null, ativo: true, sistema: true, ordem: 6 },
];

const resumoVazio = {
  total: 0,
  hoje: 0,
  whatsapp: 0,
  email: 0,
  enviados: 0,
  entregues: 0,
  falhos: 0,
  pendentes: 0,
  cancelados: 0,
  lidos: 0,
  custoTotal: 0,
  custoWhatsapp: 0,
  custoEmail: 0,
  custoMedio: 0,
  taxaSucesso: 0,
  taxaFalha: 0,
  agendamentosImpactados: 0,
};

function corpo(url) {
  const rota = new URL(url).pathname.replace(/\/api/, "");
  if (rota === "/auth/me") {
    return {
      token: "fixture",
      usuario: eu,
      unidades: [unidade],
      unidadeAtualId: unidadeId,
      clinicaNome: clinica.nomeFantasia,
      clinicaId,
      plano,
      usoUsuarios: uso,
      permissoes,
      perfil: { id: perfilAdmin, nome: "Administrador", permissoes },
    };
  }
  if (rota === "/notificacoes") return { notificacoes: [], naoLidas: 0 };
  if (rota === "/clinica") return { clinica };
  if (rota === "/usuarios") return { usuarios, perfis, unidades: [unidade], plano, usoUsuarios: uso };
  if (rota === "/procedimentos") return { procedimentos, categorias };
  if (rota === "/formas-pagamento") return { formas };
  if (rota === "/integracoes/configuracao") {
    return {
      clinicaId,
      lembretesAtivos: false,
      webhookUrl: `http://localhost:3001/api/webhooks/whatsapp/${clinicaId}`,
      whatsapp: {
        ativo: true,
        configurado: false,
        phoneNumberId: "",
        wabaId: "",
        appId: "",
        ambiente: "producao",
        accessTokenMascarado: "",
        appSecretMascarado: "",
        verifyTokenMascarado: "",
        cobrancaModo: "conta_clinica",
      },
    };
  }
  if (rota === "/integracoes/regras") return { regras };
  if (rota === "/integracoes/templates") return { templates };
  if (rota === "/integracoes/envios") return { envios: [] };
  if (rota === "/integracoes") {
    return { resumo: resumoVazio, cobranca: { whatsapp: "conta_clinica", email: "conta_clinica" }, envios: [] };
  }
  return null;
}

async function abrirNavegador() {
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      // tenta o próximo navegador já instalado
    }
  }
  return chromium.launch({ headless: true });
}

async function foto(page, arquivo) {
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" }).catch(() => {});
  await page.screenshot({ path: path.join(pasta, arquivo), fullPage: false });
  console.log(`ok ${arquivo}`);
}

async function textoDe(alvo) {
  const texto = await alvo.innerText().catch(() => "");
  return texto.replace(/[ \t]+\n/g, "\n").trim();
}

async function escolher(page, rotulo, nome) {
  const porNome = page.getByRole("combobox", { name: rotulo });
  const combo = (await porNome.count())
    ? porNome.first()
    : page.locator("div").filter({ has: page.getByText(rotulo, { exact: true }) }).getByRole("combobox").last();
  await combo.click();
  await page.getByRole("option").first().waitFor({ timeout: 10000 });
  const opcao = page.getByRole("option", { name: nome, exact: true });
  if (await opcao.count()) {
    await opcao.click();
    return;
  }
  const textos = await page.getByRole("option").allInnerTexts();
  console.log(`opções de ${rotulo}: ${textos.join(" | ")}`);
  await page.keyboard.press("Escape");
}

async function fechar(page) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
}

async function preencherDinheiro(dialog, digitos) {
  const campo = dialog.locator('input[inputmode="numeric"]').first();
  await campo.click();
  await campo.fill("");
  await campo.pressSequentially(digitos, { delay: 20 });
}

const base = "http://localhost:3000";
const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });

await page.route("**/api/**", async (route) => {
  const pedido = route.request();
  if (pedido.method() !== "GET") {
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    return;
  }
  if (new URL(pedido.url()).pathname.endsWith("/clinica/logo")) {
    await route.fulfill({ status: 404, body: "" });
    return;
  }
  const json = corpo(pedido.url());
  if (!json) {
    console.log(`sem mock ${pedido.url()}`);
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    return;
  }
  await route.fulfill({ contentType: "application/json", body: JSON.stringify(json) });
});

await page.addInitScript((dados) => {
  localStorage.setItem("clinicerp.token", "fixture");
  localStorage.setItem("clinicerp.sessao", JSON.stringify(dados));
  localStorage.setItem("clinicerp.tema", "claro");
  localStorage.setItem("clinicerp.planoVisto", "ilimitado");
  localStorage.setItem(`clinicerp.planoVisto.${dados.clinicaId}`, "ilimitado");
}, {
  id: eu.id,
  nome: "Usuário teste",
  email: eu.email,
  perfil: "Administrador",
  perfilId: perfilAdmin,
  permissoes,
  unidadeAtualId: unidadeId,
  unidadesAcesso: [unidadeId],
  unidades: [unidade],
  clinicaNome: clinica.nomeFantasia,
  clinicaId,
  plano,
  usoUsuarios: uso,
  planoEvento: null,
  tema: "claro",
});

async function ir(rota, titulo) {
  await page.goto(`${base}${rota}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.getByRole("heading", { name: titulo, exact: true }).waitFor({ timeout: 30000 });
  await page.waitForTimeout(400);
}

await ir("/integracoes", "Integrações e lembretes");
await page.setViewportSize({ width: 1440, height: 1500 });
console.log(`\n--- dashboard ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "integracoes.png");
await page.setViewportSize({ width: 1440, height: 900 });

await ir("/integracoes/configuracoes", "Configurações de integrações");
await page.addStyleTag({ content: "#webhookUrl{filter:blur(7px)}" });
await page.setViewportSize({ width: 1440, height: 1400 });
await page.waitForTimeout(200);
console.log(`webhook=${await page.locator("#webhookUrl").inputValue().catch(() => "")}`);
console.log(`\n--- config ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "integracoes-config.png");
await page.setViewportSize({ width: 1440, height: 900 });

await ir("/integracoes/lembretes", "Lembretes");
console.log(`\n--- lembretes ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "lembretes.png");

await page.getByRole("button", { name: "Nova regra" }).click();
const dialogRegra = page.getByRole("dialog");
await dialogRegra.getByRole("heading", { name: "Nova regra" }).waitFor({ timeout: 10000 });
await page.locator("#nome").fill("Lembrete da véspera");
await page.locator("#antecedenciaMinutos").fill("1440");
await escolher(page, "Template WhatsApp", "Lembrete WhatsApp");
await page.waitForTimeout(200);
console.log(`\n--- nova regra ---\n${await textoDe(dialogRegra)}\n`);
await foto(page, "integracoes-regra.png");
await fechar(page);

await page.getByRole("tab", { name: "Templates" }).click();
await page.waitForTimeout(300);
console.log(`\n--- templates ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "lembretes-templates.png");

await page.getByRole("button", { name: "Novo template" }).click();
const dialogTemplate = page.getByRole("dialog");
await dialogTemplate.getByRole("heading", { name: "Novo template" }).waitFor({ timeout: 10000 });
await page.locator("#nome").fill("Lembrete de consulta");
await page.locator("#whatsappNomeTemplate").fill("lembrete_consulta");
await page.waitForTimeout(200);
console.log(`\n--- novo template ---\n${await textoDe(dialogTemplate)}\n`);
await foto(page, "integracoes-template.png");
await fechar(page);

await ir("/integracoes/historico", "Histórico de envios");
console.log(`\n--- historico ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "historico-envios.png");

await ir("/power-bi", "Power BI");
console.log(`\n--- power bi ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "power-bi.png");

await ir("/agente-ia", "Agente de IA");
console.log(`\n--- agente ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "agente-ia.png");

await ir("/configuracoes/clinica", "Dados da clínica");
await page.addStyleTag({
  content: "#cnpj,#telefone,#email,#cep,#rua,#numero,#complemento,#bairro{filter:blur(7px)}",
});
await page.waitForTimeout(200);
console.log(`\n--- clinica ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "clinica.png");
const rolagem = page.locator("main .overflow-y-auto").last();
await rolagem.evaluate((node) => {
  node.scrollTop = node.scrollHeight;
});
await page.waitForTimeout(300);
console.log(`\n--- unidades ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "configuracoes-unidades.png");

await page.getByRole("button", { name: "Nova unidade" }).click();
const dialogUnidade = page.getByRole("dialog");
await dialogUnidade.getByRole("heading", { name: "Nova unidade" }).waitFor({ timeout: 10000 });
await page.locator("#unidade-nome").fill("Unidade Centro");
await page.locator("#unidade-cidade").fill("Franca");
await page.waitForTimeout(200);
console.log(`\n--- nova unidade ---\n${await textoDe(dialogUnidade)}\n`);
await foto(page, "configuracoes-unidade.png");
await fechar(page);

await ir("/configuracoes/usuarios", "Usuários");
console.log(`\n--- usuarios ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "usuarios.png");

await page.getByRole("button", { name: "Novo usuário" }).click();
const dialogUsuario = page.getByRole("dialog");
await dialogUsuario.getByRole("heading", { name: "Novo usuário" }).waitFor({ timeout: 10000 });
await page.locator("#usuario-nome").fill("Usuário teste");
await page.locator("#usuario-email").fill("usuario.teste@clinic.local");
await page.locator("#usuario-senha").fill("senha-inicial-8");
await escolher(page, "Perfil", "Recepção");
await escolher(page, "Unidade", "Sede Franca");
await page.waitForTimeout(200);
console.log(`\n--- novo usuario ---\n${await textoDe(dialogUsuario)}\n`);
await foto(page, "configuracoes-usuario.png");
await fechar(page);

const acoes = page.getByRole("button", { name: "Ações de Usuário teste 2" });
await acoes.click();
console.log(`menu usuario: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
await page.getByRole("menuitem", { name: "Alterar perfil" }).click();
const dialogPerfil = page.getByRole("dialog");
await dialogPerfil.getByRole("heading", { name: "Alterar perfil" }).waitFor({ timeout: 10000 });
await escolher(page, "Perfil", "Gestor");
await page.waitForTimeout(200);
console.log(`\n--- alterar perfil ---\n${await textoDe(dialogPerfil)}\n`);
await foto(page, "configuracoes-perfil.png");
await fechar(page);

await ir("/configuracoes/procedimentos", "Procedimentos");
console.log(`\n--- procedimentos ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "procedimentos.png");
await page.getByRole("button", { name: "Novo procedimento" }).click();
const dialogProc = page.getByRole("dialog");
await dialogProc.getByRole("heading", { name: "Novo procedimento" }).waitFor({ timeout: 10000 });
await page.locator("#proc-nome").fill("Retorno");
await escolher(page, "Categoria", "Consulta");
await page.locator("#proc-duracao").fill("30");
await preencherDinheiro(dialogProc, "15000");
await page.waitForTimeout(200);
console.log(`\n--- novo procedimento ---\n${await textoDe(dialogProc)}\n`);
await foto(page, "configuracoes-procedimento.png");
await fechar(page);

const menuProc = page.getByRole("button", { name: /Ações de / }).first();
if (await menuProc.count()) {
  await menuProc.click();
  console.log(`menu procedimento: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
  await page.keyboard.press("Escape");
}

await ir("/configuracoes/pagamentos", "Formas de pagamento");
console.log(`\n--- pagamentos ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "pagamentos.png");

await ir("/configuracoes/estilizacao", "Estilização");
console.log(`\n--- estilizacao ---\n${await textoDe(page.locator("main"))}\n`);
await foto(page, "estilizacao.png");

await browser.close();
