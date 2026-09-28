import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");
const rotulosPaciente = new Map();
const rotulosProf = new Map();
let injetarParcelas = false;
let forcarLoteEnviado = false;

function rotuloPaciente(id) {
  if (!id) return "Paciente teste";
  if (!rotulosPaciente.has(id)) {
    rotulosPaciente.set(id, rotulosPaciente.size === 0 ? "Paciente teste" : `Paciente teste ${rotulosPaciente.size + 1}`);
  }
  return rotulosPaciente.get(id);
}

function rotuloProf(id) {
  if (!id) return "Profissional teste";
  if (!rotulosProf.has(id)) {
    rotulosProf.set(id, rotulosProf.size === 0 ? "Profissional teste" : `Profissional teste ${rotulosProf.size + 1}`);
  }
  return rotulosProf.get(id);
}

function exemploValor(valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor === 0) return valor;
  const sinal = valor < 0 ? -1 : 1;
  const abs = Math.abs(valor);
  const faixas = [150, 280, 450, 800, 1200, 1500];
  const indice = Math.min(faixas.length - 1, Math.max(0, Math.floor(Math.log10(abs)) - 1));
  return sinal * faixas[indice];
}

const chavesDinheiro = new Set([
  "valor",
  "valorEmAberto",
  "valorApresentado",
  "valorGlosado",
  "valorRecebido",
  "faturamentoGerado",
  "valorComissao",
  "totalEmAberto",
  "totalAtrasado",
  "recebidoNoMes",
  "vencendo7Dias",
  "totalAPagar",
  "totalVencido",
  "pagoNoMes",
  "entradas",
  "saidas",
  "saldo",
  "entradasMes",
  "saidasMes",
  "saldoMes",
  "totalPrevisto",
  "aprovadas",
  "pagas",
]);

function limparNo(valor, chavePai) {
  if (Array.isArray(valor)) {
    if (chavePai === "pacientes") {
      valor.forEach((item) => {
        if (item?.id) item.nome = rotuloPaciente(item.id);
      });
      return;
    }
    valor.forEach((item) => limparNo(item, chavePai));
    return;
  }
  if (!valor || typeof valor !== "object") return;

  if (valor.pacienteId && valor.pacienteNome) {
    valor.pacienteNome = rotuloPaciente(valor.pacienteId);
    if (valor.descricao) valor.descricao = "Consulta";
  }
  if (valor.profissionalId && valor.profissionalNome) {
    valor.profissionalNome = rotuloProf(valor.profissionalId);
    if (typeof valor.faturamentoGerado === "number" && valor.faturamentoGerado > 0) valor.faturamentoGerado = 1500;
    if (typeof valor.percentual === "number" && valor.percentual > 0) valor.percentual = 40;
    if (typeof valor.valorComissao === "number" && valor.valorComissao > 0) valor.valorComissao = 600;
  }
  if (typeof valor.fornecedor === "string") valor.fornecedor = "Fornecedor teste";
  if (valor.categoria && valor.descricao && !valor.pacienteId) valor.descricao = valor.categoria;
  if (valor.nome && valor.telefone && valor.id) {
    valor.nome = rotuloPaciente(valor.id);
    valor.telefone = "(16) 90000-0000";
  }

  for (const [chave, item] of Object.entries(valor)) {
    if (chave === "percentual") continue;
    if (chavesDinheiro.has(chave) && typeof item === "number") {
      if (chave === "faturamentoGerado" || chave === "valorComissao") continue;
      valor[chave] = exemploValor(item);
    } else if (item && typeof item === "object") {
      limparNo(item, chave);
    }
  }
}

function prepararParcelas(json) {
  if (!injetarParcelas || !Array.isArray(json.cobrancas)) return;
  const alvo = json.cobrancas.find((item) => item.status !== "pago" && item.status !== "cancelado") ?? json.cobrancas[0];
  if (!alvo || (alvo.parcelas ?? []).length > 0) return;
  alvo.status = "parcelado";
  alvo.valor = 450;
  alvo.descricao = "Consulta";
  alvo.formaPagamento = alvo.formaPagamento ?? "pix";
  alvo.parcelas = [
    { numero: 1, valor: 150, vencimento: "2026-09-15", status: "pago", pagoEm: "2026-09-15" },
    { numero: 2, valor: 150, vencimento: "2026-10-15", status: "pendente" },
    { numero: 3, valor: 150, vencimento: "2026-11-15", status: "pendente" },
  ];
}

function prepararLote(json) {
  if (!forcarLoteEnviado || !Array.isArray(json.lotes)) return;
  if (json.lotes.length === 0) {
    const convenio = json.convenios?.[0];
    if (!convenio) return;
    json.lotes.push({
      id: "00000000-0000-4000-8000-000000000001",
      convenioId: convenio.id,
      convenioNome: convenio.nome,
      competencia: "2026-09",
      quantidadeGuias: 3,
      valorApresentado: 450,
      valorGlosado: 0,
      valorRecebido: 0,
      status: "enviado",
      enviadoEm: "2026-09-10",
      previsaoPagamento: "2026-10-15",
    });
    if (json.resumo) {
      json.resumo.lotesAguardando = 1;
    }
    return;
  }
  const alvo =
    json.lotes.find((item) => item.status === "enviado" || item.status === "parcial") ?? json.lotes[0];
  if (alvo.status === "enviado" || alvo.status === "parcial") return;
  alvo.status = "enviado";
  alvo.enviadoEm = alvo.enviadoEm || "2026-09-10";
  alvo.previsaoPagamento = alvo.previsaoPagamento || "2026-10-15";
  if (!alvo.valorGlosado) alvo.valorGlosado = 150;
  if (!alvo.valorRecebido) alvo.valorRecebido = 1200;
}

function tokensPorPerfil() {
  const saida = execFileSync(process.execPath, ["scripts/preparar-usuario-teste.cjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
  }).trim();
  return JSON.parse(saida);
}

async function acharBase() {
  for (const porta of [3003, 3000]) {
    try {
      const resposta = await fetch(`http://localhost:${porta}/login`);
      if (resposta.ok || resposta.status === 307) return `http://localhost:${porta}`;
    } catch {
      // tenta a próxima porta
    }
  }
  throw new Error("painel fora do ar nas portas 3000 e 3003");
}

async function sessaoDe(token) {
  const resposta = await fetch("http://localhost:3001/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) throw new Error(`sessao recusada: ${resposta.status}`);
  const me = await resposta.json();
  const usuario = me.usuario;
  const unidadeAtualId = me.unidadeAtualId ?? me.unidades[0]?.id;
  if (!unidadeAtualId) throw new Error("sem unidade na sessao");
  const limite = me.usoUsuarios?.limite ?? null;
  const usados = me.usoUsuarios?.usados ?? 0;
  return {
    token,
    sessao: {
      id: usuario.id,
      nome: "Usuário teste",
      email: usuario.email,
      perfil: usuario.perfilNome,
      perfilId: usuario.perfilId,
      permissoes: me.perfil.permissoes,
      unidadeAtualId,
      unidadesAcesso: usuario.unidadesAcesso,
      unidades: me.unidades,
      clinicaNome: me.clinicaNome,
      plano: me.plano,
      usoUsuarios: {
        usados,
        limite,
        podeAdicionar: limite == null || usados < limite,
      },
      planoEvento: null,
      tema: "claro",
    },
  };
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

async function textoMain(page) {
  const texto = await page.locator("main").innerText().catch(() => "");
  return texto.replace(/\s+\n/g, "\n").slice(0, 2500);
}

async function novaPagina(browser, acesso) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  await page.route("**/api/auth/me", async (route) => {
    const resposta = await route.fetch();
    const json = await resposta.json();
    if (json.usuario) json.usuario.nome = "Usuário teste";
    await route.fulfill({ response: resposta, json });
  });
  await page.route("**/api/financeiro**", async (route) => {
    if (route.request().method() !== "GET") {
      await route.abort();
      return;
    }
    const resposta = await route.fetch();
    const tipo = resposta.headers()["content-type"] ?? "";
    if (!tipo.includes("json")) {
      await route.fulfill({ response: resposta });
      return;
    }
    const json = await resposta.json();
    limparNo(json, "");
    prepararParcelas(json);
    prepararLote(json);
    await route.fulfill({ response: resposta, json });
  });
  await page.addInitScript((dados) => {
    localStorage.setItem("clinicerp.token", dados.token);
    localStorage.setItem("clinicerp.sessao", JSON.stringify(dados.sessao));
    localStorage.setItem("clinicerp.tema", "claro");
    if (dados.sessao.plano?.codigo) localStorage.setItem("clinicerp.planoVisto", dados.sessao.plano.codigo);
  }, acesso);
  return page;
}

async function esperarPronto(page, titulo) {
  await page.getByRole("heading", { name: titulo, exact: true }).waitFor({ timeout: 30000 });
  await page.waitForTimeout(700);
}

async function irPara(page, base, rota, titulo) {
  const resposta = page.waitForResponse(
    (res) => res.url().includes("/api/financeiro") && res.request().method() === "GET" && res.ok(),
    { timeout: 30000 },
  );
  await page.goto(`${base}${rota}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.getByRole("heading", { name: titulo, exact: true }).first().waitFor({ timeout: 30000 });
  await resposta.catch((erro) => console.log(`sem resposta de ${rota}: ${erro.message}`));
  const pronto = await page
    .waitForFunction(() => {
      const texto = document.querySelector("main")?.innerText ?? "";
      const linhas = texto.split("\n").map((linha) => linha.trim()).filter(Boolean);
      const rotulos = ["Total a receber", "Em aberto", "A pagar", "Entradas do mês", "Apresentado", "Previsto na competência"];
      const indice = linhas.findIndex((linha) => rotulos.includes(linha));
      const valor = linhas[indice + 1] ?? "";
      return indice >= 0 && valor.startsWith("R$");
    }, undefined, { timeout: 25000 })
    .then(() => true)
    .catch(() => false);
  if (!pronto) {
    const texto = await page.locator("main").innerText().catch(() => "");
    console.log(`ainda carregando ${rota}:\n${texto.replace(/\s+\n/g, "\n").slice(0, 800)}`);
  }
  await page.waitForTimeout(400);
}

async function preencherDinheiro(dialog, digitos) {
  const campo = dialog.locator('input[inputmode="numeric"]').first();
  await campo.click();
  await campo.fill("");
  await campo.pressSequentially(digitos, { delay: 20 });
}

async function escolher(page, rotulo, nome) {
  const combo = page.getByRole("combobox", { name: rotulo });
  await combo.click();
  await page.getByRole("option").first().waitFor({ timeout: 10000 });
  const opcao = page.getByRole("option", { name: nome, exact: true });
  if (await opcao.count()) {
    await opcao.click();
    return true;
  }
  const textos = await page.getByRole("option").allInnerTexts();
  console.log(`opções de ${rotulo}: ${textos.join(" | ")}`);
  const primeira = textos.find((item) => item.trim());
  if (primeira) await page.getByRole("option", { name: primeira, exact: true }).click();
  else await page.keyboard.press("Escape");
  return false;
}

async function fecharDialog(page) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
}

const base = await acharBase();
const tokens = tokensPorPerfil();
const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
console.log(`painel: ${base}`);

const page = await novaPagina(browser, await sessaoDe(tokens.Administrador));

await irPara(page, base, "/financeiro", "Financeiro");
console.log(`\n--- visao ---\n${await textoMain(page)}\n`);
await foto(page, "financeiro.png");

const dre = page.getByRole("heading", { name: "DRE simplificado", exact: true });
if (await dre.count()) {
  await dre.evaluate((el) => {
    let node = el.parentElement;
    while (node) {
      const estilo = getComputedStyle(node);
      if (/(auto|scroll)/.test(estilo.overflowY) && node.scrollHeight > node.clientHeight + 8) {
        const topo = el.getBoundingClientRect().top - node.getBoundingClientRect().top + node.scrollTop;
        node.scrollTop = Math.max(0, topo - 24);
        return;
      }
      node = node.parentElement;
    }
    el.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(400);
  console.log(`\n--- dre ---\n${await textoMain(page)}\n`);
  await foto(page, "financeiro-dre.png");
}

await irPara(page, base, "/financeiro/contas-a-receber", "Contas a receber");
const menuCobranca = page.getByRole("button", { name: /Ações da cobrança/ }).first();
if (await menuCobranca.count()) {
  await menuCobranca.click();
  console.log(`menu cobrança: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}
console.log(`\n--- receber ---\n${await textoMain(page)}\n`);
await foto(page, "contas-a-receber.png");

await page.getByRole("button", { name: "Gerar cobrança" }).click();
const dialogCobranca = page.getByRole("dialog");
await dialogCobranca.getByRole("heading", { name: "Nova cobrança" }).waitFor({ timeout: 10000 });
await escolher(page, "Paciente", "Paciente teste");
await page.locator("#cob-desc").fill("Consulta");
await preencherDinheiro(dialogCobranca, "15000");
await page.locator("#cob-venc").fill("2026-10-15");
await escolher(page, "Origem", "Particular");
await escolher(page, "Parcelas", "À vista");
await page.waitForTimeout(200);
console.log(`\n--- nova cobranca ---\n${await dialogCobranca.innerText()}\n`);
await foto(page, "financeiro-cobranca.png");
await fecharDialog(page);

const acoes = page.getByRole("button", { name: /Ações da cobrança/ });
const totalAcoes = await acoes.count();
let abriuRecebimento = false;
for (let i = 0; i < totalAcoes; i += 1) {
  await acoes.nth(i).click();
  const item = page.getByRole("menuitem", { name: "Registrar pagamento" });
  const desabilitado = await item.getAttribute("data-disabled");
  const aria = await item.getAttribute("aria-disabled");
  if ((await item.count()) && desabilitado == null && aria !== "true") {
    await item.click();
    abriuRecebimento = true;
    break;
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
}
if (abriuRecebimento) {
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("heading", { name: "Registrar recebimento" }).waitFor({ timeout: 10000 });
  await page.locator("#pagamento-observacoes").fill("Comprovante de exemplo.");
  await page.waitForTimeout(200);
  console.log(`\n--- recebimento ---\n${await dialog.innerText()}\n`);
  await foto(page, "financeiro-recebimento.png");
  await fecharDialog(page);
} else {
  console.log("sem cobrança em aberto para registrar pagamento");
}

let abriuParcelas = false;
for (let i = 0; i < (await acoes.count()); i += 1) {
  await acoes.nth(i).click();
  const item = page.getByRole("menuitem", { name: "Ver parcelas" });
  const desabilitado = await item.getAttribute("data-disabled");
  const aria = await item.getAttribute("aria-disabled");
  if ((await item.count()) && desabilitado == null && aria !== "true") {
    await item.click();
    abriuParcelas = true;
    break;
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
}
if (!abriuParcelas) {
  injetarParcelas = true;
  await irPara(page, base, "/financeiro/contas-a-receber", "Contas a receber");
  const botoes = page.getByRole("button", { name: /Ações da cobrança/ });
  for (let i = 0; i < (await botoes.count()); i += 1) {
    await botoes.nth(i).click();
    const item = page.getByRole("menuitem", { name: "Ver parcelas" });
    if ((await item.getAttribute("data-disabled")) == null) {
      await item.click();
      abriuParcelas = true;
      break;
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
  }
}
if (!abriuParcelas) throw new Error("não foi possível abrir o parcelamento");
const dialogParcelas = page.getByRole("dialog");
await dialogParcelas.getByRole("heading", { name: "Parcelamento" }).waitFor({ timeout: 10000 });
console.log(`\n--- parcelas ---\n${await dialogParcelas.innerText()}\n`);
await foto(page, "financeiro-parcelas.png");
await fecharDialog(page);

await irPara(page, base, "/financeiro/contas-a-pagar", "Contas a pagar");
const menuDespesa = page.getByRole("button", { name: /Ações da despesa/ }).first();
if (await menuDespesa.count()) {
  await menuDespesa.click();
  console.log(`menu despesa: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}
console.log(`\n--- pagar ---\n${await textoMain(page)}\n`);
await foto(page, "contas-a-pagar.png");

await page.getByRole("button", { name: "Nova despesa" }).click();
const dialogDespesa = page.getByRole("dialog");
await dialogDespesa.getByRole("heading", { name: "Nova despesa" }).waitFor({ timeout: 10000 });
await page.locator("#desp-desc").fill("Aluguel da sala");
await escolher(page, "Categoria", "Aluguel");
await page.locator("#desp-forn").fill("Fornecedor teste");
await preencherDinheiro(dialogDespesa, "150000");
await page.locator("#desp-venc").fill("2026-10-10");
const recorrente = dialogDespesa.getByRole("switch");
if ((await recorrente.getAttribute("data-state")) !== "checked") await recorrente.click();
await page.waitForTimeout(200);
console.log(`\n--- nova despesa ---\n${await dialogDespesa.innerText()}\n`);
await foto(page, "financeiro-despesa.png");
await fecharDialog(page);

const acoesDespesa = page.getByRole("button", { name: /Ações da despesa/ });
let abriuBaixa = false;
for (let i = 0; i < (await acoesDespesa.count()); i += 1) {
  await acoesDespesa.nth(i).click();
  const item = page.getByRole("menuitem", { name: "Dar baixa no pagamento" });
  const desabilitado = await item.getAttribute("data-disabled");
  const aria = await item.getAttribute("aria-disabled");
  if ((await item.count()) && desabilitado == null && aria !== "true") {
    await item.click();
    abriuBaixa = true;
    break;
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
}
if (abriuBaixa) {
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("heading", { name: "Dar baixa no pagamento" }).waitFor({ timeout: 10000 });
  await page.locator("#pagamento-observacoes").fill("Pagamento de exemplo.");
  await page.waitForTimeout(200);
  console.log(`\n--- baixa ---\n${await dialog.innerText()}\n`);
  await foto(page, "financeiro-baixa.png");
  await fecharDialog(page);
} else {
  console.log("sem despesa em aberto para dar baixa");
}

await irPara(page, base, "/financeiro/fluxo-de-caixa", "Fluxo de caixa");
console.log(`\n--- fluxo ---\n${await textoMain(page)}\n`);
await foto(page, "fluxo-de-caixa.png");
await page.getByRole("button", { name: "12 meses" }).click();
await page.waitForTimeout(300);
console.log(`\n--- fluxo 12m ---\n${await textoMain(page)}\n`);

await irPara(page, base, "/financeiro/convenios", "Faturamento de convênios");
console.log(`\n--- lotes ---\n${await textoMain(page)}\n`);
await foto(page, "faturamento-convenios.png");

await page.getByRole("button", { name: "Fechar lote" }).click();
const dialogLote = page.getByRole("dialog");
await dialogLote.getByRole("heading", { name: "Fechar lote de guias" }).waitFor({ timeout: 10000 });
await page.waitForTimeout(200);
console.log(`\n--- fechar lote ---\n${await dialogLote.innerText()}\n`);
const opcoesConvenio = await (async () => {
  await page.getByRole("combobox", { name: "Convênio" }).click();
  const textos = await page.getByRole("option").allInnerTexts();
  await page.keyboard.press("Escape");
  return textos;
})();
console.log(`convênios do lote: ${opcoesConvenio.join(" | ")}`);
await foto(page, "financeiro-lote.png");
await fecharDialog(page);

const linhaLote = page.locator("tbody tr").first();
if (await linhaLote.count()) {
  await linhaLote.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("heading", { name: "Reconciliação do lote" }).waitFor({ timeout: 10000 });
  console.log(`\n--- reconciliacao real ---\n${await dialog.innerText()}\n`);
  const temCampos = await dialog.getByText("Valor glosado").count();
  if (!temCampos) {
    await fecharDialog(page);
    forcarLoteEnviado = true;
    await irPara(page, base, "/financeiro/convenios", "Faturamento de convênios");
    await page.locator("tbody tr").first().click();
    await dialog.getByRole("heading", { name: "Reconciliação do lote" }).waitFor({ timeout: 10000 });
    const glosado = dialog.locator('input[inputmode="numeric"]').nth(0);
    const recebido = dialog.locator('input[inputmode="numeric"]').nth(1);
    await glosado.click();
    await glosado.fill("");
    await glosado.pressSequentially("15000", { delay: 20 });
    await recebido.click();
    await recebido.fill("");
    await recebido.pressSequentially("120000", { delay: 20 });
  }
  await page.waitForTimeout(200);
  console.log(`\n--- reconciliacao ---\n${await dialog.innerText()}\n`);
  await foto(page, "financeiro-reconciliacao.png");
  await fecharDialog(page);
} else {
  forcarLoteEnviado = true;
  await irPara(page, base, "/financeiro/convenios", "Faturamento de convênios");
  await page.locator("tbody tr").first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("heading", { name: "Reconciliação do lote" }).waitFor({ timeout: 10000 });
  const glosado = dialog.locator('input[inputmode="numeric"]').nth(0);
  const recebido = dialog.locator('input[inputmode="numeric"]').nth(1);
  await glosado.click();
  await glosado.fill("");
  await glosado.pressSequentially("15000", { delay: 20 });
  await recebido.click();
  await recebido.fill("");
  await recebido.pressSequentially("30000", { delay: 20 });
  await page.waitForTimeout(200);
  console.log(`\n--- reconciliacao exemplo ---\n${await dialog.innerText()}\n`);
  await foto(page, "financeiro-reconciliacao.png");
  await fecharDialog(page);
}

await irPara(page, base, "/financeiro/comissoes", "Comissões");
const menuComissao = page.getByRole("button", { name: /Ações da comissão/ }).first();
if (await menuComissao.count()) {
  await menuComissao.click();
  console.log(`menu comissão: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}
console.log(`\n--- comissoes ---\n${await textoMain(page)}\n`);
await foto(page, "comissoes.png");

const fecharFolha = page.getByRole("button", { name: /Fechar folha de/ });
if (await fecharFolha.count()) {
  await fecharFolha.click();
  const dialog = page.getByRole("alertdialog").or(page.getByRole("dialog"));
  await dialog.first().waitFor({ timeout: 10000 });
  console.log(`\n--- fechar folha ---\n${await dialog.first().innerText()}\n`);
  await foto(page, "financeiro-folha.png");
  await fecharDialog(page);
} else {
  console.log("botão de fechar folha não apareceu");
}

await page.unrouteAll({ behavior: "ignoreErrors" }).catch(() => {});
await browser.close();
