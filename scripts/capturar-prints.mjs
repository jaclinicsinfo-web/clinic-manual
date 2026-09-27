import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const base = (process.env.APP_URL ?? "https://clinic-web-app-q4mc.onrender.com").replace(/\/$/, "");
const email = process.env.MANUAL_EMAIL ?? "";
const senha = process.env.MANUAL_SENHA ?? "";
const pasta = path.join(process.cwd(), "public", "prints");

const publicas = [
  { rota: "/login", arquivo: "entrar.png", texto: "Entrar" },
  { rota: "/esqueci-senha", arquivo: "esqueci-senha.png", texto: "senha" },
];

const internas = [
  { rota: "/dashboard", arquivo: "dashboard.png", texto: "Dashboard" },
  { rota: "/pacientes", arquivo: "pacientes.png", texto: "Pacientes" },
  { rota: "/agenda", arquivo: "agenda.png", texto: "Agenda" },
  { rota: "/profissionais", arquivo: "profissionais.png", texto: "Profissionais" },
  { rota: "/financeiro", arquivo: "financeiro.png", texto: "Financeiro" },
  { rota: "/financeiro/contas-a-receber", arquivo: "contas-a-receber.png", texto: "Contas a receber" },
  { rota: "/financeiro/contas-a-pagar", arquivo: "contas-a-pagar.png", texto: "Contas a pagar" },
  { rota: "/financeiro/fluxo-de-caixa", arquivo: "fluxo-de-caixa.png", texto: "Fluxo de caixa" },
  { rota: "/financeiro/convenios", arquivo: "faturamento-convenios.png", texto: "convênio" },
  { rota: "/financeiro/comissoes", arquivo: "comissoes.png", texto: "Comissões" },
  { rota: "/convenios", arquivo: "convenios.png", texto: "Convênios" },
  { rota: "/estoque", arquivo: "estoque.png", texto: "Estoque" },
  { rota: "/rh", arquivo: "rh.png", texto: "RH" },
  { rota: "/rh/ponto", arquivo: "ponto.png", texto: "ponto" },
  { rota: "/rh/holerites", arquivo: "holerites.png", texto: "Holerite" },
  { rota: "/relatorios", arquivo: "relatorios.png", texto: "Relatórios" },
  { rota: "/integracoes", arquivo: "integracoes.png", texto: "Integrações" },
  { rota: "/integracoes/configuracoes", arquivo: "integracoes-config.png", texto: "Configurações" },
  { rota: "/integracoes/lembretes", arquivo: "lembretes.png", texto: "Lembretes" },
  { rota: "/integracoes/historico", arquivo: "historico-envios.png", texto: "Histórico" },
  { rota: "/power-bi", arquivo: "power-bi.png", texto: "Power BI" },
  { rota: "/agente-ia", arquivo: "agente-ia.png", texto: "Agente de IA" },
  { rota: "/configuracoes/clinica", arquivo: "clinica.png", texto: "clínica" },
  { rota: "/configuracoes/usuarios", arquivo: "usuarios.png", texto: "Usuários" },
  { rota: "/configuracoes/permissoes", arquivo: "permissoes.png", texto: "Permissões" },
  { rota: "/configuracoes/procedimentos", arquivo: "procedimentos.png", texto: "Procedimentos" },
  { rota: "/configuracoes/pagamentos", arquivo: "pagamentos.png", texto: "pagamento" },
  { rota: "/configuracoes/estilizacao", arquivo: "estilizacao.png", texto: "Estilização" },
];

async function abrirNavegador() {
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      // tenta o próximo navegador já instalado no Windows
    }
  }
  return chromium.launch({ headless: true });
}

async function esperarPainel(page) {
  for (let tentativa = 1; tentativa <= 12; tentativa += 1) {
    const resposta = await page.goto(`${base}/login`, { waitUntil: "domcontentloaded", timeout: 120000 });
    const titulo = await page.title();
    const status = resposta ? resposta.status() : 0;
    if (status === 200 && !titulo.toLowerCase().includes("render")) return;
    console.log(`painel acordando (${tentativa}): ${status} ${titulo}`);
    await page.waitForTimeout(8000);
  }
}

async function esperarTelaPronta(page) {
  await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  const limite = Date.now() + 45000;
  while (Date.now() < limite) {
    const pendente = await page
      .locator("main .animate-spin, main .animate-pulse")
      .count()
      .catch(() => 0);
    const texto = await page.locator("main").innerText().catch(() => "");
    if (pendente === 0 && !/carregando/i.test(texto)) return;
    await page.waitForTimeout(400);
  }
  console.log("aviso: a tela ainda carregava ao fotografar");
}

async function capturar(page, item) {
  await page.goto(`${base}${item.rota}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  try {
    await page.getByText(item.texto, { exact: false }).first().waitFor({ timeout: 30000 });
  } catch {
    console.log(`pulado ${item.arquivo}: texto "${item.texto}" não apareceu`);
    return false;
  }
  await esperarTelaPronta(page);
  await page.screenshot({ path: path.join(pasta, item.arquivo), fullPage: false });
  console.log(`ok ${item.arquivo}`);
  return true;
}

const browser = await abrirNavegador();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await mkdir(pasta, { recursive: true });

console.log(`painel: ${base}`);
await esperarPainel(page);
for (const item of publicas) {
  await capturar(page, item);
}

if (email && senha) {
  await page.goto(`${base}/login`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.locator("#email").waitFor({ timeout: 90000 });
  await page.locator("#email").fill(email);
  await page.locator("#senha").fill(senha);
  await page.getByRole("button", { name: "Entrar" }).click();
  const unidade = page.getByRole("button", { name: "Continuar" });
  const destino = page.waitForURL(/\/(dashboard|pacientes|agenda)/, { timeout: 90000 }).catch(() => null);
  const escolha = unidade.waitFor({ state: "visible", timeout: 90000 }).catch(() => null);
  await Promise.race([destino, escolha]);
  if (await unidade.isVisible().catch(() => false)) {
    await unidade.click();
    await page.waitForURL(/\/(dashboard|pacientes|agenda)/, { timeout: 90000 });
  }
  if (page.url().includes("/login")) {
    const aviso = await page.locator("body").innerText();
    console.log("login nao entrou:", aviso.slice(0, 400).replace(/\s+/g, " "));
  } else {
    console.log("sessao em", page.url());
    for (const item of internas) {
      await capturar(page, item);
    }
  }
} else {
  console.log("sem MANUAL_EMAIL/MANUAL_SENHA: telas internas não foram capturadas");
}

await browser.close();
