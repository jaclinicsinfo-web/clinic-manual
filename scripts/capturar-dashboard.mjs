import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");

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

function rotuloTeste(vistos, nome) {
  if (!nome) return nome;
  if (!vistos.has(nome)) {
    vistos.set(nome, vistos.size === 0 ? "Usuário teste" : `Usuário teste ${vistos.size + 1}`);
  }
  return vistos.get(nome);
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

async function esperarPainel(page) {
  await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  const limite = Date.now() + 25000;
  while (Date.now() < limite) {
    const girando = await page.locator("main .animate-spin, main .animate-pulse").count();
    const texto = await page.locator("main").innerText().catch(() => "");
    if (girando === 0 && !/carregando/i.test(texto) && /Atendimentos hoje/.test(texto)) return;
    await page.waitForTimeout(250);
  }
}

async function foto(page, arquivo) {
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" }).catch(() => {});
  await page.screenshot({ path: path.join(pasta, arquivo), fullPage: false });
  console.log(`ok ${arquivo}`);
}

async function novaPagina(browser, acesso) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route("**/api/auth/me", async (route) => {
    const resposta = await route.fetch();
    const json = await resposta.json();
    if (json.usuario) json.usuario.nome = "Usuário teste";
    await route.fulfill({ response: resposta, json });
  });
  await page.route("**/api/dashboard", async (route) => {
    const resposta = await route.fetch();
    const json = await resposta.json();
    const vistos = new Map();
    if (Array.isArray(json.atendimentosPorProfissional)) {
      for (const item of json.atendimentosPorProfissional) item.profissional = rotuloTeste(vistos, item.profissional);
    }
    if (Array.isArray(json.proximos)) {
      for (const item of json.proximos) {
        item.pacienteNome = "Paciente teste";
        item.profissionalNome = rotuloTeste(vistos, item.profissionalNome);
      }
    }
    if (Array.isArray(json.aniversariantes)) {
      for (const item of json.aniversariantes) item.nome = "Paciente teste";
    }
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

async function abrirDashboard(page, base) {
  await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.getByRole("heading", { name: "Dashboard", exact: true }).waitFor({ timeout: 30000 });
  await esperarPainel(page);
  await page.getByText("Usuário teste").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
}

const base = await acharBase();
const tokens = tokensPorPerfil();
const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
console.log(`painel: ${base}`);

const admin = await novaPagina(browser, await sessaoDe(tokens.Administrador));
await abrirDashboard(admin, base);
console.log("---ADMIN---");
console.log(await admin.locator("main").innerText());
await foto(admin, "dashboard.png");
await admin.getByRole("heading", { name: "Próximos atendimentos", exact: true }).scrollIntoViewIfNeeded();
await admin.waitForTimeout(300);
await foto(admin, "dashboard-listas.png");
await admin.close();

const recepcao = await novaPagina(browser, await sessaoDe(tokens["Recepção"]));
await abrirDashboard(recepcao, base);
console.log("---RECEPCAO---");
console.log(await recepcao.locator("main").innerText());
console.log("ver relatorios", await recepcao.getByRole("link", { name: "Ver relatórios" }).count());
await foto(recepcao, "dashboard-recepcao.png");
await recepcao.close();

const profissional = await novaPagina(browser, await sessaoDe(tokens["Profissional de saúde"]));
await abrirDashboard(profissional, base);
console.log("---PROFISSIONAL---");
console.log(await profissional.locator("main").innerText());
console.log("faturamento", await profissional.getByText("Faturamento do mês").count());
await foto(profissional, "dashboard-profissional.png");
await profissional.close();

for (const perfil of ["Gestor", "Financeiro"]) {
  const page = await novaPagina(browser, await sessaoDe(tokens[perfil]));
  await abrirDashboard(page, base);
  const texto = await page.locator("main").innerText();
  console.log(`---${perfil}---`);
  console.log("ver relatorios", await page.getByRole("link", { name: "Ver relatórios" }).count());
  console.log("faturamento", texto.includes("Faturamento do mês"));
  console.log("alertas", texto.includes("Alertas"));
  await page.close();
}

await browser.close();
