import { execFileSync } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");
const arquivoExemplo = path.join(os.tmpdir(), "contracheque.pdf");

const CAMPOS_NOME = new Set(["nome", "usuarioNome", "registradoPorNome", "criadoPorNome"]);
const CAMPOS_EMAIL = new Set(["email", "usuarioEmail"]);

let adminOriginal = "";
const mapaNomes = new Map();
let arquivos = 0;

function nomePublico(valor) {
  if (typeof valor !== "string" || !valor.trim()) return valor;
  if (adminOriginal && valor === adminOriginal) return "Usuário teste";
  if (!mapaNomes.has(valor)) {
    mapaNomes.set(valor, `Usuário teste ${mapaNomes.size + 2}`);
  }
  return mapaNomes.get(valor);
}

function arquivoSeguro(nome) {
  arquivos += 1;
  const extBruta = typeof nome === "string" && nome.includes(".") ? nome.slice(nome.lastIndexOf(".")).toLowerCase() : ".pdf";
  const ext = [".pdf", ".png", ".jpg", ".jpeg"].includes(extBruta) ? extBruta : ".pdf";
  return arquivos === 1 ? `contracheque${ext}` : `contracheque-${arquivos}${ext}`;
}

function limparRh(valor, chave) {
  if (Array.isArray(valor)) return valor.map((item) => limparRh(item));
  if (valor && typeof valor === "object") {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, limparRh(v, k)]));
  }
  if (typeof valor === "string" && chave && CAMPOS_NOME.has(chave)) return nomePublico(valor);
  if (typeof valor === "string" && chave && CAMPOS_EMAIL.has(chave)) return "usuario.teste@clinic.local";
  if (typeof valor === "string" && chave === "nomeArquivo") return arquivoSeguro(valor);
  if (chave === "observacao" && typeof valor === "string" && valor.trim()) return "Ajuste de horário";
  return valor;
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
  adminOriginal = usuario.nome;
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
  return texto.replace(/\s+\n/g, "\n").slice(0, 4000);
}

async function novaPagina(browser, acesso) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  await page.route("**/api/auth/me", async (route) => {
    const resposta = await route.fetch();
    const json = await resposta.json();
    if (json.usuario?.nome) {
      adminOriginal = json.usuario.nome;
      json.usuario.nome = "Usuário teste";
    }
    await route.fulfill({ response: resposta, json });
  });
  await page.route("**/api/rh**", async (route) => {
    if (route.request().method() !== "GET") {
      await route.abort();
      return;
    }
    if (route.request().url().includes("/arquivo")) {
      await route.abort();
      return;
    }
    const resposta = await route.fetch();
    const tipo = resposta.headers()["content-type"] ?? "";
    if (!tipo.includes("json")) {
      await route.fulfill({ response: resposta });
      return;
    }
    const json = limparRh(await resposta.json());
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

async function escolherUsuario(page) {
  const combo = page.getByRole("combobox", { name: "Usuário" });
  await combo.click();
  await page.getByRole("option").first().waitFor({ timeout: 10000 });
  const textos = await page.getByRole("option").allInnerTexts();
  console.log(`opções de Usuário: ${textos.join(" | ")}`);
  const opcao = page.getByRole("option", { name: "Usuário teste", exact: true }).first();
  if (await opcao.count()) {
    await opcao.click();
  } else {
    await page.getByRole("option").first().click();
  }
  await page.getByRole("listbox").waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});
  return true;
}

async function fecharDialog(page) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
}

async function abrirRota(page, base, rota, titulo) {
  const resposta = page.waitForResponse(
    (res) => res.url().includes("/api/rh") && res.request().method() === "GET" && res.ok(),
    { timeout: 30000 },
  );
  await page.goto(`${base}${rota}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.getByRole("heading", { name: titulo, exact: true }).waitFor({ timeout: 30000 });
  await resposta;
  await page.waitForTimeout(500);
}

const pdfMinimo = `%PDF-1.1
1 0 obj<<>>endobj
trailer<<>>
%%EOF`;

await writeFile(arquivoExemplo, pdfMinimo);
const base = await acharBase();
const tokens = tokensPorPerfil();
const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
console.log(`painel: ${base}`);

const page = await novaPagina(browser, await sessaoDe(tokens.Administrador));

await abrirRota(page, base, "/rh", "RH");
console.log(`\n--- visao ---\n${await textoMain(page)}\n`);
await foto(page, "rh.png");

await abrirRota(page, base, "/rh/ponto", "Controle de ponto");
const colunasPonto = page.getByRole("button", { name: "Colunas" });
if (await colunasPonto.count()) {
  await colunasPonto.click();
  console.log(`colunas ponto: ${(await page.getByRole("menuitemcheckbox").allInnerTexts()).join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}
const menuPonto = page.getByRole("button", { name: /Ações de / }).first();
if (await menuPonto.count()) {
  await menuPonto.click();
  console.log(`menu ponto: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}
console.log(`\n--- ponto ---\n${await textoMain(page)}\n`);
await foto(page, "ponto.png");

const lancar = page.getByRole("button", { name: "Lançar ponto" });
if (await lancar.count()) {
  await lancar.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("heading", { name: "Lançar ponto" }).waitFor({ timeout: 10000 });
  await escolherUsuario(page);
  await page.locator("#ponto-entrada").fill("08:00");
  await page.locator("#ponto-intervalo").fill("12:00");
  await page.locator("#ponto-retorno").fill("13:00");
  await page.locator("#ponto-saida").fill("18:00");
  await page.locator("#ponto-obs").fill("Ajuste manual do dia");
  await page.waitForTimeout(200);
  console.log(`\n--- lancar ---\n${await dialog.innerText()}\n`);
  await foto(page, "ponto-lancar.png");
  await fecharDialog(page);
}

if (await menuPonto.count()) {
  await menuPonto.click();
  const editar = page.getByRole("menuitem", { name: "Editar" });
  if (await editar.count()) {
    await editar.click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("heading", { name: "Editar ponto" }).waitFor({ timeout: 10000 });
    console.log(`\n--- editar ---\n${await dialog.innerText()}\n`);
    await foto(page, "ponto-editar.png");
    await fecharDialog(page);
  }
  const excluirItem = page.getByRole("menuitem", { name: "Excluir" });
  if (await page.getByRole("dialog").count() === 0 && (await menuPonto.count())) {
    await menuPonto.click();
  }
  if (await page.getByRole("menuitem", { name: "Excluir" }).count()) {
    await page.getByRole("menuitem", { name: "Excluir" }).click();
    const alerta = page.getByRole("dialog");
    await alerta.getByRole("heading", { name: "Excluir registro de ponto?" }).waitFor({ timeout: 10000 });
    console.log(`\n--- excluir ponto ---\n${await alerta.innerText()}\n`);
    await foto(page, "ponto-excluir.png");
    await fecharDialog(page);
  } else if (await excluirItem.count()) {
    console.log("menu de excluir ponto fechou antes do clique");
  }
}

await abrirRota(page, base, "/rh/holerites", "Holerites");
const colunasHolerite = page.getByRole("button", { name: "Colunas" });
if (await colunasHolerite.count()) {
  await colunasHolerite.click();
  console.log(`colunas holerite: ${(await page.getByRole("menuitemcheckbox").allInnerTexts()).join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}
console.log(`\n--- holerites ---\n${await textoMain(page)}\n`);
await foto(page, "holerites.png");

const enviar = page.getByRole("button", { name: "Enviar holerite" });
if (await enviar.count()) {
  await enviar.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("heading", { name: "Enviar holerite" }).waitFor({ timeout: 10000 });
  await escolherUsuario(page);
  await page.locator("#holerite-arquivo").setInputFiles(arquivoExemplo);
  await page.waitForTimeout(200);
  console.log(`\n--- enviar ---\n${await dialog.innerText()}\n`);
  await foto(page, "holerite-enviar.png");
  await fecharDialog(page);
}

const menuHolerite = page.getByRole("button", { name: /Ações de / }).first();
if (await menuHolerite.count()) {
  await menuHolerite.click();
  console.log(`menu holerite: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
  const excluir = page.getByRole("menuitem", { name: "Excluir" });
  if (await excluir.count()) {
    await excluir.click();
    const alerta = page.getByRole("dialog");
    await alerta.getByRole("heading", { name: "Excluir holerite?" }).waitFor({ timeout: 10000 });
    console.log(`\n--- excluir holerite ---\n${await alerta.innerText()}\n`);
    await foto(page, "holerite-excluir.png");
    await fecharDialog(page);
  } else {
    await page.keyboard.press("Escape");
  }
}

await page.unrouteAll({ behavior: "ignoreErrors" }).catch(() => {});
await browser.close();
await rm(arquivoExemplo, { force: true });
