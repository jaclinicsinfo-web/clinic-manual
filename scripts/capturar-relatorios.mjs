import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");
const rotulosPaciente = new Map();
const rotulosProf = new Map();

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

function limparItem(item, chavePai) {
  if (Array.isArray(item)) return item.map((filho) => limparItem(filho, chavePai));
  if (!item || typeof item !== "object") return item;
  const copia = { ...item };
  if ((chavePai === "porProfissional" || chavePai === "produtividade") && copia.nome) {
    copia.nome = rotuloProf(copia.id);
  }
  if (chavePai === "pacientes" && copia.nome) {
    copia.nome = rotuloPaciente(copia.id);
  }
  if (copia.profissionalNome) {
    copia.profissionalNome = rotuloProf(copia.profissionalId);
  }
  for (const [chave, valor] of Object.entries(copia)) {
    if (valor && typeof valor === "object") copia[chave] = limparItem(valor, chave);
  }
  return copia;
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
  return texto.replace(/\s+\n/g, "\n");
}

async function novaPagina(browser, acesso) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  await page.route("**/api/auth/me", async (route) => {
    const resposta = await route.fetch();
    const json = await resposta.json();
    if (json.usuario) json.usuario.nome = "Usuário teste";
    await route.fulfill({ response: resposta, json });
  });
  await page.route("**/api/relatorios**", async (route) => {
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
    const json = limparItem(await resposta.json(), "");
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

async function rolarAte(page, locator) {
  const el = locator.first();
  if (!(await el.count())) return false;
  await el.evaluate((node) => {
    let pai = node.parentElement;
    while (pai) {
      const estilo = getComputedStyle(pai);
      if (/(auto|scroll)/.test(estilo.overflowY) && pai.scrollHeight > pai.clientHeight + 8) {
        const topo = node.getBoundingClientRect().top - pai.getBoundingClientRect().top + pai.scrollTop;
        pai.scrollTop = Math.max(0, topo - 24);
        return;
      }
      pai = pai.parentElement;
    }
    node.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(400);
  return true;
}

async function abrirAba(page, base, periodo, tipo, titulo) {
  const resposta = page.waitForResponse(
    (res) => res.url().includes("/api/relatorios") && res.request().method() === "GET" && res.ok(),
    { timeout: 30000 },
  );
  await page.goto(`${base}/relatorios?periodo=${periodo}&tipo=${tipo}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.getByRole("heading", { name: "Relatórios", exact: true }).waitFor({ timeout: 30000 });
  await resposta;
  await page.getByRole("heading", { name: titulo, exact: true }).waitFor({ timeout: 20000 });
  await page.waitForTimeout(600);
}

const base = await acharBase();
const tokens = tokensPorPerfil();
const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
console.log(`painel: ${base}`);

const page = await novaPagina(browser, await sessaoDe(tokens.Administrador));

await abrirAba(page, base, "mes", "faturamento", "Faturamento");
console.log(`\n--- faturamento ---\n${await textoMain(page)}\n`);
await foto(page, "relatorios.png");

const porConvenio = page.getByRole("heading", { name: "Por convênio", exact: true });
if (await rolarAte(page, porConvenio)) {
  console.log(`\n--- faturamento baixo ---\n${await textoMain(page)}\n`);
  await foto(page, "relatorios-faturamento.png");
}

await page.evaluate(() => {
  const main = document.querySelector("main");
  let node = main;
  while (node) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) {
      node.scrollTop = 0;
      return;
    }
    node = node.parentElement;
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(200);
const periodo = page.getByRole("combobox", { name: "Período do relatório" });
await periodo.click();
await page.getByRole("option").first().waitFor({ timeout: 10000 });
console.log(`opções de período: ${(await page.getByRole("option").allInnerTexts()).join(" | ")}`);
await foto(page, "relatorios-periodo.png");
await page.keyboard.press("Escape");
await page.waitForTimeout(200);

const abas = [
  ["atendimentos", "Atendimentos", "relatorios-atendimentos.png"],
  ["inadimplencia", "Inadimplência", "relatorios-inadimplencia.png"],
  ["pacientes", "Novos pacientes x recorrentes", "relatorios-pacientes.png"],
  ["produtividade", "Produtividade por profissional", "relatorios-produtividade.png"],
  ["comissoes", "Comissões", "relatorios-comissoes.png"],
];

for (const [tipo, titulo, arquivo] of abas) {
  await abrirAba(page, base, "mes", tipo, titulo);
  console.log(`\n--- ${tipo} ---\n${await textoMain(page)}\n`);
  await foto(page, arquivo);
}

await page.unrouteAll({ behavior: "ignoreErrors" }).catch(() => {});
await browser.close();
