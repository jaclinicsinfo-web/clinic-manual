import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");
const rotulosPaciente = new Map();

function rotuloPaciente(id) {
  if (!id) return "Paciente teste";
  if (!rotulosPaciente.has(id)) {
    rotulosPaciente.set(id, rotulosPaciente.size === 0 ? "Paciente teste" : `Paciente teste ${rotulosPaciente.size + 1}`);
  }
  return rotulosPaciente.get(id);
}

function exemploValor(valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor === 0) return valor;
  const sinal = valor < 0 ? -1 : 1;
  const abs = Math.abs(valor);
  const faixas = [120, 150, 280, 450, 800, 1200];
  const indice = Math.min(faixas.length - 1, Math.max(0, Math.floor(Math.log10(abs))));
  return sinal * faixas[indice];
}

function limparNo(valor, chavePai) {
  if (Array.isArray(valor)) {
    valor.forEach((item) => limparNo(item, chavePai));
    return;
  }
  if (!valor || typeof valor !== "object") return;

  if (chavePai === "pacientes" && valor.id && valor.nome) {
    valor.nome = rotuloPaciente(valor.id);
    valor.numeroCarteirinha = valor.numeroCarteirinha ? "000000000000000" : null;
  }
  if (typeof valor.contatoTelefone === "string" && valor.contatoTelefone) {
    valor.contatoTelefone = "1630000000";
  }
  if (typeof valor.contatoNome === "string" && valor.contatoNome) {
    valor.contatoNome = "Central de Relacionamento";
  }
  if (typeof valor.portalUrl === "string" && valor.portalUrl) {
    valor.portalUrl = "https://portal.operadora.com.br";
  }
  if (typeof valor.registroAns === "string" && valor.registroAns) {
    valor.registroAns = "393321";
  }

  for (const [chave, item] of Object.entries(valor)) {
    if (chave === "faturamentoMes" && typeof item === "number") {
      valor[chave] = exemploValor(item);
    } else if (chave === "taxaGlosa" && typeof item === "number" && item > 0) {
      valor[chave] = 4.5;
    } else if (item && typeof item === "object") {
      limparNo(item, chave);
    }
  }
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
  return texto.replace(/\s+\n/g, "\n").slice(0, 3500);
}

async function novaPagina(browser, acesso) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  await page.route("**/api/auth/me", async (route) => {
    const resposta = await route.fetch();
    const json = await resposta.json();
    if (json.usuario) json.usuario.nome = "Usuário teste";
    await route.fulfill({ response: resposta, json });
  });
  await page.route("**/api/convenios**", async (route) => {
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
    if (Array.isArray(json.procedimentos)) {
      console.log(
        `precos: ${json.procedimentos.map((item) => `${item.nome}|${item.categoria}|${item.valorParticular}`).join(" ; ")}`,
      );
    }
    if (json.convenio) {
      console.log(
        `ficha exige=${json.convenio.exigeAutorizacaoPrevia} portal=${Boolean(json.convenio.portalUrl)} tabela=${json.convenio.tabelaPrecos?.length ?? 0}`,
      );
    }
    limparNo(json, "");
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

async function irPara(page, base, rota, titulo) {
  const resposta = page.waitForResponse(
    (res) => res.url().includes("/api/convenios") && res.request().method() === "GET" && res.ok(),
    { timeout: 30000 },
  );
  await page.goto(`${base}${rota}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.getByRole("heading", { name: titulo, exact: true }).first().waitFor({ timeout: 30000 });
  await resposta.catch((erro) => console.log(`sem resposta de ${rota}: ${erro.message}`));
  await page.waitForTimeout(500);
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
  await page.keyboard.press("Escape");
  return false;
}

async function fecharDialog(page) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
}

async function rolarAte(page, locator) {
  await locator.evaluate((el) => {
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
  await page.waitForTimeout(350);
}

const base = await acharBase();
const tokens = tokensPorPerfil();
const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
console.log(`painel: ${base}`);

const page = await novaPagina(browser, await sessaoDe(tokens.Administrador));

await irPara(page, base, "/convenios", "Convênios");
const menu = page.getByRole("button", { name: /Ações de / }).first();
if (await menu.count()) {
  await menu.click();
  console.log(`menu linha: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}
console.log(`\n--- lista ---\n${await textoMain(page)}\n`);
await foto(page, "convenios.png");

await page.getByRole("button", { name: "Novo convênio" }).click();
const dialogNovo = page.getByRole("dialog");
await dialogNovo.getByRole("heading", { name: "Novo convênio" }).waitFor({ timeout: 10000 });
await page.locator("#convenio-nome").fill("Unimed");
await page.locator("#convenio-ans").fill("393321");
await escolher(page, "Status do convênio", "Ativo");
await page.locator("#convenio-prazo").fill("30");
await page.locator("#convenio-contato").fill("Central de Relacionamento");
await page.locator("#convenio-telefone").fill("1630000000");
await page.locator("#convenio-portal").fill("https://portal.operadora.com.br");
const autorizacao = dialogNovo.getByRole("switch");
if ((await autorizacao.getAttribute("data-state")) !== "checked") await autorizacao.click();
await page.waitForTimeout(200);
console.log(`\n--- novo ---\n${await dialogNovo.innerText()}\n`);
await foto(page, "convenios-novo.png");
await fecharDialog(page);

const primeiraLinha = page.locator("tbody tr").first();
const href = await primeiraLinha.locator("a").first().getAttribute("href");
console.log(`detalhe: ${href}`);
if (!href) throw new Error("nenhum convênio na lista");

await irPara(page, base, href, "Tabela de preços");
await page.getByRole("navigation", { name: "Trilha de navegação" }).getByText("Unimed", { exact: true }).waitFor({ timeout: 10000 });
const dinheiro = page.locator("table input[inputmode='numeric']");
const totalCampos = await dinheiro.count();
const particulares = await page.locator("table tbody tr").allInnerTexts();
console.log(`linhas tabela:\n${particulares.join("\n")}`);
for (let i = 0; i < totalCampos; i += 1) {
  const atual = await dinheiro.nth(i).inputValue();
  if (atual === "0,00" || atual === "0") {
    await dinheiro.nth(i).click();
    await dinheiro.nth(i).fill("");
    await dinheiro.nth(i).pressSequentially(i === 0 ? "12000" : "12000", { delay: 15 });
  }
}
await page.locator("main").evaluate((el) => {
  el.scrollTop = 0;
  el.parentElement?.scrollTo(0, 0);
  window.scrollTo(0, 0);
});
await page.waitForTimeout(300);
console.log(`\n--- tabela ---\n${await textoMain(page)}\n`);
await foto(page, "convenios-tabela.png");

await page.getByRole("button", { name: "Editar", exact: true }).click();
const dialogEditar = page.getByRole("dialog");
await dialogEditar.getByRole("heading", { name: "Editar convênio" }).waitFor({ timeout: 10000 });
await page.waitForTimeout(400);
const interruptor = await dialogEditar.getByRole("switch").getAttribute("data-state");
const portal = await page.locator("#convenio-portal").inputValue();
console.log(`editar interruptor=${interruptor} portalPreenchido=${Boolean(portal)}`);
await fecharDialog(page);

await irPara(page, base, "/convenios", "Convênios");
const botaoInativar = page.getByRole("button", { name: /Ações de / }).first();
await botaoInativar.click();
const itemInativar = page.getByRole("menuitem", { name: "Inativar" });
if (await itemInativar.count()) {
  await itemInativar.click();
  const alerta = page.getByRole("alertdialog").or(page.getByRole("dialog"));
  await alerta.first().waitFor({ timeout: 10000 });
  console.log(`\n--- inativar ---\n${await alerta.first().innerText()}\n`);
  await foto(page, "convenios-inativar.png");
  await fecharDialog(page);
} else {
  console.log("sem item Inativar");
  await page.keyboard.press("Escape");
}

await page.unrouteAll({ behavior: "ignoreErrors" }).catch(() => {});
await browser.close();
