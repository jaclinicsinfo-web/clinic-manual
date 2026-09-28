import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");

const modulos = {
  essencial: ["dashboard", "pacientes", "agenda", "profissionais", "convenios", "rh", "configuracoes"],
  profissional: [
    "dashboard",
    "pacientes",
    "agenda",
    "profissionais",
    "convenios",
    "rh",
    "configuracoes",
    "financeiro",
    "estoque",
    "relatorios",
  ],
};

function tokenDeAdministrador() {
  return execFileSync(process.execPath, ["scripts/token-administrador.cjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
  }).trim();
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

async function novaPagina(browser, acesso, plano) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  if (plano) {
    await page.route("**/api/auth/me", async (route) => {
      const resposta = await route.fetch();
      const json = await resposta.json();
      json.plano = {
        ...json.plano,
        codigo: plano.codigo,
        nome: plano.nome,
        limiteUsuarios: plano.limiteUsuarios,
        limiteUnidades: plano.limiteUnidades,
        modulos: plano.modulos,
      };
      await route.fulfill({ response: resposta, json });
    });
  }
  await page.addInitScript((dados) => {
    localStorage.setItem("clinicerp.token", dados.token);
    localStorage.setItem("clinicerp.sessao", JSON.stringify(dados.sessao));
    localStorage.setItem("clinicerp.tema", "claro");
    if (dados.sessao.plano?.codigo) localStorage.setItem("clinicerp.planoVisto", dados.sessao.plano.codigo);
  }, acesso);
  return page;
}

async function ir(page, base, rota, texto) {
  await page.goto(`${base}${rota}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.getByText(texto, { exact: false }).first().waitFor({ timeout: 30000 });
  await esperarPainel(page);
}

const base = await acharBase();
const acesso = await sessaoPronta();
const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
console.log(`painel: ${base}`);

const atual = await novaPagina(browser, acesso, null);
await ir(atual, base, "/dashboard", "Plano Ilimitado");
console.log("badge", await atual.getByLabel(/Plano /).first().innerText());
await foto(atual, "planos-menu.png");

await ir(atual, base, "/power-bi", "Em breve neste plano");
console.log("power-bi", (await atual.locator("main").innerText()).replace(/\s+/g, " ").slice(0, 500));
await foto(atual, "planos-power-bi.png");

await ir(atual, base, "/agente-ia", "Em breve neste plano");
console.log("agente", (await atual.locator("main").innerText()).replace(/\s+/g, " ").slice(0, 500));
await foto(atual, "planos-agente.png");

await ir(atual, base, "/configuracoes/usuarios", "Usuários");
await atual.getByText(/sem limite|de \d+ usuário/).first().waitFor({ timeout: 15000 });
await atual.locator("table tbody tr").first().waitFor({ timeout: 20000 });
await atual.locator("table tbody tr td:first-child").evaluateAll((celulas) => {
  for (const celula of celulas) celula.style.filter = "blur(8px)";
});
await foto(atual, "planos-usuarios.png");

await ir(atual, base, "/configuracoes/clinica", "Unidades");
await atual.locator("main form").evaluate((form) => {
  form.style.display = "none";
});
console.log("unidades", await atual.getByText("Filiais disponíveis").innerText());
await foto(atual, "planos-unidades.png");
await atual.close();

const essencial = await novaPagina(browser, acesso, {
  codigo: "essencial",
  nome: "Essencial",
  limiteUsuarios: 5,
  limiteUnidades: 1,
  modulos: modulos.essencial,
});
await ir(essencial, base, "/dashboard", "Plano Essencial");
const financeiro = essencial.getByRole("link", { name: "Financeiro" });
await financeiro.hover();
await essencial.getByRole("tooltip", { name: "Disponível no plano Profissional" }).waitFor({ timeout: 5000 });
await foto(essencial, "planos-essencial.png");

await ir(essencial, base, "/financeiro", "Disponível no plano Profissional");
console.log("bloqueado", (await essencial.locator("main").innerText()).replace(/\s+/g, " ").slice(0, 600));
await foto(essencial, "planos-bloqueado.png");

await ir(essencial, base, "/configuracoes/clinica", "inclui 1 unidade");
await essencial.locator("main form").evaluate((form) => {
  form.style.display = "none";
});
console.log("unidade essencial", await essencial.getByText("inclui 1 unidade").innerText());
await foto(essencial, "planos-unidade-essencial.png");
await essencial.close();

const profissional = await novaPagina(browser, acesso, {
  codigo: "profissional",
  nome: "Profissional",
  limiteUsuarios: 20,
  limiteUnidades: null,
  modulos: modulos.profissional,
});
await ir(profissional, base, "/dashboard", "Plano Profissional");
const integracoes = profissional.getByRole("link", { name: "Integrações e lembretes" });
await integracoes.hover();
await profissional.getByRole("tooltip", { name: "Disponível no plano Ilimitado" }).waitFor({ timeout: 5000 });
await foto(profissional, "planos-profissional.png");
await profissional.close();

await browser.close();
