import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const base = "http://localhost:3000";
const pasta = path.join(process.cwd(), "public", "prints");

function tokenDeAdministrador() {
  return execFileSync(process.execPath, ["scripts/token-administrador.cjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
  }).trim();
}

async function sessaoPronta() {
  const token = tokenDeAdministrador();
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
      nome: usuario.nome,
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

async function novaPagina(browser, acesso, viewport) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript((dados) => {
    localStorage.setItem("clinicerp.token", dados.token);
    localStorage.setItem("clinicerp.sessao", JSON.stringify(dados.sessao));
    localStorage.setItem("clinicerp.tema", "claro");
    if (dados.sessao.plano?.codigo) localStorage.setItem("clinicerp.planoVisto", dados.sessao.plano.codigo);
  }, acesso);
  return page;
}

async function esperarPainel(page) {
  await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  const limite = Date.now() + 25000;
  while (Date.now() < limite) {
    const girando = await page.locator("main .animate-spin").count();
    const texto = await page.locator("main").innerText().catch(() => "");
    if (girando === 0 && !/carregando/i.test(texto)) return;
    await page.waitForTimeout(250);
  }
}

async function foto(page, arquivo) {
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" }).catch(() => {});
  await page.screenshot({ path: path.join(pasta, arquivo), fullPage: false });
  console.log(`ok ${arquivo}`);
}

const acesso = await sessaoPronta();
const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });

const desktop = { width: 1440, height: 900 };
const painel = await novaPagina(browser, acesso, desktop);
await painel.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded", timeout: 60000 });
await painel.getByRole("heading", { name: "Dashboard" }).waitFor({ timeout: 30000 });
await esperarPainel(painel);
await foto(painel, "painel-menu.png");

await painel.getByRole("button", { name: "Recolher menu" }).click();
await painel.getByRole("button", { name: "Expandir menu" }).waitFor({ timeout: 5000 });
await foto(painel, "painel-recolhido.png");

await painel.getByRole("button", { name: "Expandir menu" }).click();
await painel.getByLabel("Unidade").click();
await painel.getByRole("option").first().waitFor({ timeout: 5000 });
await foto(painel, "painel-unidade.png");
await painel.keyboard.press("Escape");

await painel.getByRole("button", { name: "Notificações" }).click();
await painel.getByText("Notificações", { exact: true }).waitFor({ timeout: 5000 });
await foto(painel, "painel-sino.png");
await painel.keyboard.press("Escape");

await painel.locator("header").getByRole("button").last().click();
await painel.getByRole("menuitem", { name: "Sair" }).waitFor({ timeout: 5000 });
await painel.locator("[role='menu']").evaluate((menu) => {
  for (const no of menu.querySelectorAll("div, span, p")) {
    if (no.childElementCount === 0 && no.textContent?.includes("@")) {
      no.style.filter = "blur(6px)";
    }
  }
});
await foto(painel, "painel-conta.png");
await painel.keyboard.press("Escape");

const lista = await novaPagina(browser, acesso, desktop);
await lista.goto(`${base}/pacientes`, { waitUntil: "domcontentloaded", timeout: 60000 });
await lista.getByRole("heading", { name: "Pacientes", exact: true }).waitFor({ timeout: 30000 });
await esperarPainel(lista);
const busca = lista.getByRole("textbox", { name: "Buscar por nome, CPF ou telefone..." });
const primeiraAcao = lista.getByRole("button", { name: /^Ações de / }).first();
await primeiraAcao.waitFor({ timeout: 20000 });
const rotulo = await primeiraAcao.getAttribute("aria-label");
const termo = (rotulo ?? "Maria").replace(/^Ações de /, "").split(" ")[0];
await busca.fill(termo);
await lista.waitForTimeout(400);
const esconderTelefones = () =>
  lista.locator("table tbody tr td:nth-child(2)").evaluateAll((celulas) => {
    for (const celula of celulas) celula.style.filter = "blur(6px)";
  });
await esconderTelefones();
await foto(lista, "painel-lista.png");

await lista.getByRole("button", { name: "Colunas" }).click();
await lista.getByText("Exibir colunas").waitFor({ timeout: 5000 });
await esconderTelefones();
await foto(lista, "painel-colunas.png");
await lista.keyboard.press("Escape");

const acao = lista.getByRole("button", { name: /^Ações de / }).first();
if (await acao.count()) {
  await acao.click();
  await lista.getByRole("menuitem", { name: "Ver perfil" }).waitFor({ timeout: 5000 });
  await esconderTelefones();
  await foto(lista, "painel-acoes.png");
} else {
  console.log("pulado painel-acoes.png: lista sem registros");
}

const celular = await novaPagina(browser, acesso, { width: 390, height: 844 });
await celular.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded", timeout: 60000 });
await celular.getByRole("heading", { name: "Dashboard" }).waitFor({ timeout: 30000 });
await esperarPainel(celular);
await celular.getByRole("button", { name: "Abrir menu" }).click();
await celular.getByRole("button", { name: "Recolher menu" }).waitFor({ timeout: 5000 });
await foto(celular, "painel-celular.png");

await browser.close();
