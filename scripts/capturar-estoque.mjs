import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");

function exemploCusto(valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor === 0) return valor;
  const faixas = [4.5, 12, 18, 25, 40];
  const indice = Math.min(faixas.length - 1, Math.max(0, Math.floor(Math.log10(Math.abs(valor)))));
  return faixas[indice];
}

function limparEstoque(json) {
  if (!json || typeof json !== "object") return;
  const produtos = Array.isArray(json.produtos) ? json.produtos : [];
  console.log(
    `produtos: ${produtos
      .map((item) => `${item.nome}|${item.categoria}|${item.unidadeMedida}|q=${item.quantidadeAtual}|min=${item.estoqueMinimo}|custo=${item.custoUnitario}|ativo=${item.ativo}`)
      .join(" ; ") || "(vazio)"}`,
  );
  console.log(`movimentacoes=${json.movimentacoes?.length ?? 0} consumo=${json.consumo?.length ?? 0}`);
  if (Array.isArray(json.movimentacoes) && json.movimentacoes[0]) {
    const amostra = json.movimentacoes[0];
    console.log(`movimento exemplo tipo=${amostra.tipo} q=${amostra.quantidade} data=${amostra.data}`);
  }

  for (const produto of produtos) {
    produto.fornecedor = "Fornecedor teste";
    produto.custoUnitario = exemploCusto(produto.custoUnitario);
  }
  for (const item of json.movimentacoes ?? []) {
    item.responsavel = "Usuário teste";
    item.motivo = item.tipo === "entrada" ? "Compra de reposição" : "Consumo em procedimento";
  }
  for (const item of json.consumo ?? []) {
    const produto = produtos.find((atual) => atual.id === item.produtoId);
    if (produto) item.produtoNome = produto.nome;
  }

  const ativos = produtos.filter((item) => item.ativo !== false);
  if (json.resumo) {
    json.resumo.valorEmEstoque = ativos.reduce((total, item) => total + item.quantidadeAtual * item.custoUnitario, 0);
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
  await page.route("**/api/estoque**", async (route) => {
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
    limparEstoque(json);
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
  const alvo = textos.find((item) => item.trim().toLowerCase().includes(nome.toLowerCase()));
  if (alvo) {
    await page.getByRole("option", { name: alvo, exact: true }).click();
    return true;
  }
  await page.keyboard.press("Escape");
  return false;
}

async function preencherDinheiro(dialog, digitos) {
  const campo = dialog.locator('input[inputmode="numeric"]').first();
  await campo.click();
  await campo.fill("");
  await campo.pressSequentially(digitos, { delay: 20 });
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
const resposta = page.waitForResponse(
  (res) => res.url().includes("/api/estoque") && res.request().method() === "GET" && res.ok(),
  { timeout: 30000 },
);
await page.goto(`${base}/estoque`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByRole("heading", { name: "Estoque", exact: true }).waitFor({ timeout: 30000 });
await resposta;
await page.getByText("Itens cadastrados").waitFor({ timeout: 15000 });
await page.waitForTimeout(500);

const menu = page.getByRole("button", { name: /Ações de / }).first();
if (await menu.count()) {
  await menu.click();
  console.log(`menu linha: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}

console.log(`\n--- produtos ---\n${await textoMain(page)}\n`);
await foto(page, "estoque.png");

await page.getByRole("button", { name: "Novo produto" }).click();
const dialogProduto = page.getByRole("dialog");
await dialogProduto.getByRole("heading", { name: "Novo produto" }).waitFor({ timeout: 10000 });
await page.locator("#prod-nome").fill("Luva de procedimento");
await page.locator("#prod-fornecedor").fill("Fornecedor teste");
await escolher(page, "Categoria", "Descartáveis");
await escolher(page, "Unidade de medida", "caixa");
await page.locator("#prod-qtd").fill("20");
await page.locator("#prod-min").fill("5");
await preencherDinheiro(dialogProduto, "1250");
await page.waitForTimeout(200);
console.log(`\n--- novo ---\n${await dialogProduto.innerText()}\n`);
await foto(page, "estoque-novo.png");
await fecharDialog(page);

const registrar = page.getByRole("button", { name: "Registrar movimentação" });
const desabilitado = await registrar.isDisabled();
console.log(`registrar desabilitado=${desabilitado}`);
if (!desabilitado) {
  await registrar.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("heading", { name: "Registrar movimentação de estoque" }).waitFor({ timeout: 10000 });
  const produtoOk = await (async () => {
    await page.getByRole("combobox", { name: "Produto" }).click();
    const textos = await page.getByRole("option").allInnerTexts();
    console.log(`produtos do lançamento: ${textos.join(" | ")}`);
    const primeiro = textos.find((item) => item.trim());
    if (!primeiro) {
      await page.keyboard.press("Escape");
      return false;
    }
    await page.getByRole("option", { name: primeiro, exact: true }).click();
    return true;
  })();
  if (produtoOk) {
    await escolher(page, "Tipo de movimentação", "Saída");
    await page.locator("#quantidade").fill("2");
    const procedimento = page.getByRole("combobox", { name: "Procedimento (opcional)" });
    if (await procedimento.count()) {
      await escolher(page, "Procedimento (opcional)", "Consulta");
    }
    await page.locator("#motivo").fill("Consumo em procedimento");
    await page.waitForTimeout(200);
  }
  console.log(`\n--- movimentacao ---\n${await dialog.innerText()}\n`);
  await foto(page, "estoque-movimentacao.png");
  await fecharDialog(page);
}

await page.getByRole("tab", { name: /Movimentações/ }).click();
await page.waitForTimeout(400);
console.log(`\n--- aba movimentacoes ---\n${await textoMain(page)}\n`);
await foto(page, "estoque-movimentacoes.png");

await page.getByRole("tab", { name: /Consumo/ }).click();
await page.waitForTimeout(400);
console.log(`\n--- aba consumo ---\n${await textoMain(page)}\n`);
await foto(page, "estoque-consumo.png");

await page.getByRole("tab", { name: /Produtos e insumos/ }).click();
await page.waitForTimeout(300);
const acoes = page.getByRole("button", { name: /Ações de / }).first();
if (await acoes.count()) {
  await acoes.click();
  const item = page.getByRole("menuitem", { name: "Inativar" });
  if (await item.count()) {
    await item.click();
    const alerta = page.getByRole("dialog");
    await alerta.getByRole("heading", { name: "Inativar produto?" }).waitFor({ timeout: 10000 });
    console.log(`\n--- inativar ---\n${await alerta.innerText()}\n`);
    await foto(page, "estoque-inativar.png");
    await fecharDialog(page);
  } else {
    console.log(`menu sem inativar: ${(await page.getByRole("menuitem").allInnerTexts()).join(" | ")}`);
    await page.keyboard.press("Escape");
  }
}

await page.unrouteAll({ behavior: "ignoreErrors" }).catch(() => {});
await browser.close();
