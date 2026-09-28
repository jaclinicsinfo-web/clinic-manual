import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");

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

const base = await acharBase();
const acesso = await sessaoPronta();
const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript((dados) => {
  localStorage.setItem("clinicerp.token", dados.token);
  localStorage.setItem("clinicerp.sessao", JSON.stringify(dados.sessao));
  localStorage.setItem("clinicerp.tema", "claro");
  if (dados.sessao.plano?.codigo) localStorage.setItem("clinicerp.planoVisto", dados.sessao.plano.codigo);
}, acesso);

await page.goto(`${base}/configuracoes/permissoes`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByRole("heading", { name: "Perfis e permissões" }).waitFor({ timeout: 30000 });
await esperarPainel(page);
await page.getByRole("combobox", { name: "Perfil" }).waitFor({ timeout: 15000 });

const seletor = page.getByRole("combobox", { name: "Perfil" });
await seletor.click();
const nomes = await page.getByRole("option").allTextContents();
await page.keyboard.press("Escape");

const arquivos = {
  Administrador: "permissoes.png",
  Financeiro: "permissoes-financeiro.png",
  Gestor: "permissoes-gestor.png",
  "Profissional de saúde": "permissoes-profissional.png",
  Recepção: "permissoes-recepcao.png",
};

await seletor.click();
await page.getByRole("option", { name: "Administrador", exact: true }).click();
await page.getByRole("combobox", { name: "Perfil" }).filter({ hasText: "Administrador" }).waitFor();

const falta = await page.evaluate(() => {
  const rolagem = [...document.querySelectorAll("main *")].find(
    (el) => el.scrollHeight > el.clientHeight + 8 && getComputedStyle(el).overflowY !== "visible",
  );
  if (!rolagem) return 0;
  return rolagem.scrollHeight - rolagem.clientHeight;
});
if (falta > 0) {
  await page.setViewportSize({ width: 1440, height: 900 + falta + 24 });
  await page.waitForTimeout(300);
}

await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" }).catch(() => {});

for (const nome of nomes) {
  await seletor.click();
  await page.getByRole("option", { name: nome, exact: true }).click();
  await page.getByRole("combobox", { name: "Perfil" }).filter({ hasText: nome }).waitFor({ timeout: 5000 });
  await page.waitForTimeout(200);
  const arquivo = arquivos[nome];
  if (!arquivo) {
    console.log(`sem arquivo para ${nome}`);
    continue;
  }
  await page.screenshot({ path: path.join(pasta, arquivo), fullPage: false });
  console.log(`ok ${arquivo}`, page.viewportSize());
}

await page.route("**/api/auth/me", async (route) => {
  const resposta = await route.fetch();
  const json = await resposta.json();
  json.plano = {
    ...json.plano,
    codigo: "essencial",
    nome: "Essencial",
    limiteUsuarios: 5,
    limiteUnidades: 1,
    modulos: ["dashboard", "pacientes", "agenda", "profissionais", "convenios", "rh", "configuracoes"],
  };
  await route.fulfill({ response: resposta, json });
});

await page.goto(`${base}/configuracoes/permissoes`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByRole("heading", { name: "Perfis e permissões" }).waitFor({ timeout: 30000 });
await esperarPainel(page);
await page.getByText("Disponível no plano Profissional").first().waitFor({ timeout: 15000 });
await page.getByRole("combobox", { name: "Perfil" }).click();
await page.getByRole("option", { name: "Administrador", exact: true }).click();
await page.getByText("não entram ao salvar").waitFor({ timeout: 10000 });

const faltaPlano = await page.evaluate(() => {
  const rolagem = [...document.querySelectorAll("main *")].find(
    (el) => el.scrollHeight > el.clientHeight + 8 && getComputedStyle(el).overflowY !== "visible",
  );
  if (!rolagem) return 0;
  return rolagem.scrollHeight - rolagem.clientHeight;
});
if (faltaPlano > 0) {
  const atual = page.viewportSize();
  await page.setViewportSize({ width: 1440, height: (atual?.height ?? 900) + faltaPlano + 24 });
  await page.waitForTimeout(300);
}

await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" }).catch(() => {});
await page.screenshot({ path: path.join(pasta, "permissoes-plano.png"), fullPage: false });
console.log("ok permissoes-plano.png", page.viewportSize());

await browser.close();
