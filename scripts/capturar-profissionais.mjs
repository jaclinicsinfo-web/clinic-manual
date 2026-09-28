import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");
const escolhido = { id: null };

const rotulosProf = new Map();
const rotulosPaciente = new Map();
const rotulosUsuario = new Map();

function rotuloProf(id) {
  if (!id) return "Profissional teste";
  if (id === escolhido.id) return "Profissional teste";
  if (!rotulosProf.has(id)) rotulosProf.set(id, `Profissional teste ${rotulosProf.size + 2}`);
  return rotulosProf.get(id);
}

function rotuloPaciente(id) {
  if (!id) return "Paciente teste";
  if (!rotulosPaciente.has(id)) {
    rotulosPaciente.set(id, rotulosPaciente.size === 0 ? "Paciente teste" : `Paciente teste ${rotulosPaciente.size + 1}`);
  }
  return rotulosPaciente.get(id);
}

function rotuloUsuario(id) {
  if (!id) return "Usuário teste";
  if (!rotulosUsuario.has(id)) {
    const n = rotulosUsuario.size;
    rotulosUsuario.set(id, n === 0 ? "Usuário teste" : `Usuário teste ${n + 1}`);
  }
  return rotulosUsuario.get(id);
}

function emailUsuario(id) {
  const rotulo = rotuloUsuario(id);
  if (rotulo === "Usuário teste") return "usuario.teste@clinic.local";
  const n = rotulo.replace("Usuário teste ", "");
  return `usuario.teste.${n}@clinic.local`;
}

function limparProfissional(item) {
  if (!item || typeof item !== "object" || !item.id) return;
  item.nome = rotuloProf(item.id);
  item.cpf = "00000000000";
  item.rg = "";
  item.email = item.id === escolhido.id ? "profissional.teste@clinic.local" : "profissional.teste.2@clinic.local";
  item.telefone = "16900000000";
  item.fotoUrl = null;
  item.registroConselho = "000000";
  if (item.usuarioNome) item.usuarioNome = rotuloUsuario(item.usuarioId);
  if (typeof item.percentualComissao === "number" && item.percentualComissao > 0) item.percentualComissao = 10;
}

function limparLista(json) {
  if (Array.isArray(json.profissionais)) json.profissionais.forEach(limparProfissional);
  if (json.resumo && typeof json.resumo.comissaoMedia === "number" && json.resumo.comissaoMedia > 0) {
    json.resumo.comissaoMedia = 10;
  }
}

function limparAgendaItem(item) {
  if (!item || typeof item !== "object") return;
  item.pacienteNome = rotuloPaciente(item.pacienteId);
  item.profissionalNome = rotuloProf(item.profissionalId);
  if (typeof item.valor === "number" && item.valor > 0) item.valor = 150;
  if (item.observacoes) item.observacoes = "Observação de exemplo.";
  if (item.criadoPor) item.criadoPor = "Usuário teste";
}

function limparComissao(item) {
  if (!item || typeof item !== "object") return;
  item.profissionalNome = rotuloProf(item.profissionalId);
  if (typeof item.faturamentoGerado === "number" && item.faturamentoGerado > 0) item.faturamentoGerado = 1500;
  if (typeof item.percentual === "number" && item.percentual > 0) item.percentual = 10;
  if (typeof item.valorComissao === "number" && item.valorComissao > 0) item.valorComissao = 150;
}

function limparDetalhe(json) {
  limparProfissional(json.profissional);
  if (json.indicadores && typeof json.indicadores.faturamentoGerado === "number" && json.indicadores.faturamentoGerado > 0) {
    json.indicadores.faturamentoGerado = 1500;
  }
  if (Array.isArray(json.pacientesAtendidos)) {
    json.pacientesAtendidos.forEach((item) => {
      item.nome = rotuloPaciente(item.id);
      item.telefone = "16900000000";
    });
  }
  if (Array.isArray(json.agenda)) json.agenda.forEach(limparAgendaItem);
  if (Array.isArray(json.comissoes)) json.comissoes.forEach(limparComissao);
}

function limparOpcoes(json) {
  if (Array.isArray(json.procedimentos)) {
    json.procedimentos.forEach((item) => {
      if (typeof item.valorParticular === "number" && item.valorParticular > 0) item.valorParticular = 150;
    });
  }
  if (Array.isArray(json.usuarios)) {
    json.usuarios.forEach((item) => {
      item.nome = rotuloUsuario(item.id);
      item.email = emailUsuario(item.id);
    });
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

async function escolherProfissional(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const lista = await fetch("http://localhost:3001/api/profissionais", { headers });
  if (!lista.ok) throw new Error(`lista recusada: ${lista.status}`);
  const json = await lista.json();
  const ids = (json.profissionais ?? []).map((item) => item.id);
  let melhor = ids[0] ?? null;
  let melhorNota = -1;
  for (const id of ids.slice(0, 20)) {
    const resposta = await fetch(`http://localhost:3001/api/profissionais/${id}`, { headers });
    if (!resposta.ok) continue;
    const detalhe = await resposta.json();
    const nota =
      (detalhe.agenda?.length ?? 0) +
      (detalhe.pacientesAtendidos?.length ?? 0) * 2 +
      (detalhe.comissoes?.length ?? 0) * 3 +
      (detalhe.procedimentosHabilitados?.length ?? 0);
    if (nota > melhorNota) {
      melhorNota = nota;
      melhor = id;
    }
  }
  console.log(`profissionais na lista: ${ids.length}; perfil escolhido pela quantidade de abas preenchidas`);
  return melhor;
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
  return texto.replace(/\s+\n/g, "\n").slice(0, 2200);
}

async function novaPagina(browser, acesso) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  await page.route("**/api/auth/me", async (route) => {
    const resposta = await route.fetch();
    const json = await resposta.json();
    if (json.usuario) json.usuario.nome = "Usuário teste";
    await route.fulfill({ response: resposta, json });
  });
  await page.route("**/api/profissionais**", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    const resposta = await route.fetch();
    const tipo = resposta.headers()["content-type"] ?? "";
    if (!tipo.includes("json")) {
      await route.fulfill({ response: resposta });
      return;
    }
    const json = await resposta.json();
    const url = route.request().url();
    if (url.includes("/opcoes")) limparOpcoes(json);
    else if (json.profissional && (json.agenda || json.indicadores || json.pacientesAtendidos)) limparDetalhe(json);
    else if (json.profissional) limparProfissional(json.profissional);
    else if (Array.isArray(json.profissionais)) limparLista(json);
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

async function esperarLista(page) {
  await page.getByRole("heading", { name: "Profissionais", exact: true }).waitFor({ timeout: 30000 });
  await page.getByRole("link", { name: "Profissional teste" }).waitFor({ timeout: 30000 });
  await page.waitForTimeout(300);
}

async function irParaSecao(page, titulo) {
  const heading = page.getByRole("heading", { name: titulo, exact: true });
  await heading.waitFor({ timeout: 15000 });
  await heading.evaluate((el) => {
    let node = el.parentElement;
    while (node) {
      const estilo = getComputedStyle(node);
      if (/(auto|scroll)/.test(estilo.overflowY) && node.scrollHeight > node.clientHeight + 8) {
        const topo = el.getBoundingClientRect().top - node.getBoundingClientRect().top + node.scrollTop;
        node.scrollTop = Math.max(0, topo - 8);
        return;
      }
      node = node.parentElement;
    }
    el.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(300);
}

async function escolherOpcao(page, rotulo, nome) {
  await page.getByRole("combobox", { name: rotulo }).click();
  await page.getByRole("option", { name: nome, exact: true }).click();
}

async function preencherCadastro(page) {
  await page.locator("#nome").fill("Profissional teste");
  await page.locator("#cpf").fill("00000000000");
  await page.locator("#rg").fill("00.000.000-0");
  await page.locator("#email").fill("profissional.teste@clinic.local");
  await page.locator("#telefone").fill("16900000000");

  await page.getByRole("combobox", { name: "Conta de login" }).click();
  const logins = await page.getByRole("option").allInnerTexts();
  console.log(`contas de login: ${logins.join(" | ")}`);
  const livre = logins.find((item) => item !== "Sem vínculo de login");
  if (livre) await page.getByRole("option", { name: livre, exact: true }).click();
  else await page.keyboard.press("Escape");

  await page.locator("#fotoUrl").fill("https://exemplo.clinic/foto.png");

  const pediatria = page.locator("#especialidade-Pediatria");
  if (await pediatria.count()) await pediatria.click();
  else await page.locator('input[id^="especialidade-"]').first().click();

  await escolherOpcao(page, "Conselho de classe", "CRM");
  await page.locator("#registroConselho").fill("000000");
  await page.locator("#dataAdmissao").fill("2024-03-01");

  const consulta = page.locator("label").filter({ hasText: "Consulta" }).locator('[role="checkbox"]');
  if (await consulta.count()) await consulta.click();
  else await page.locator('[role="checkbox"]').last().click();
}

const base = await acharBase();
const tokens = tokensPorPerfil();
escolhido.id = await escolherProfissional(tokens.Administrador);
if (!escolhido.id) throw new Error("nenhum profissional para abrir o perfil");

const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
console.log(`painel: ${base}`);

const page = await novaPagina(browser, await sessaoDe(tokens.Administrador));

await page.goto(`${base}/profissionais`, { waitUntil: "domcontentloaded", timeout: 60000 });
await esperarLista(page);
await page.waitForTimeout(400);

const menu = page.getByRole("button", { name: /Ações de/ }).first();
if (await menu.count()) {
  await menu.click();
  const itens = await page.getByRole("menuitem").allInnerTexts();
  console.log(`menu da linha: ${itens.join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}

const colunas = page.getByRole("button", { name: "Colunas" });
if (await colunas.count()) {
  await colunas.click();
  const itens = await page.getByRole("menuitemcheckbox").allInnerTexts();
  console.log(`colunas: ${itens.join(" | ")}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
}

const menuLinha = page.getByRole("button", { name: /Ações de/ }).first();
await menuLinha.click();
const itensMenu = await page.getByRole("menuitem").allInnerTexts();
console.log(`menu da linha: ${itensMenu.join(" | ")}`);
await page.keyboard.press("Escape");
await page.waitForTimeout(200);

await menuLinha.click();
await page.getByRole("menuitem", { name: "Inativar" }).click();
const dialogInativar = page.getByRole("alertdialog").or(page.getByRole("dialog"));
await dialogInativar.first().waitFor({ timeout: 10000 });
console.log(`\n--- inativar ---\n${await dialogInativar.first().innerText()}\n`);
await page.keyboard.press("Escape");
await page.waitForTimeout(200);

console.log(`\n--- lista ---\n${await textoMain(page)}\n`);
await foto(page, "profissionais.png");

await page.goto(`${base}/profissionais/novo`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByRole("heading", { name: "Novo profissional", exact: true }).waitFor({ timeout: 30000 });
await page.locator("#nome").waitFor({ timeout: 30000 });
await preencherCadastro(page);

const secoes = [
  ["Dados pessoais", "profissionais-pessoais.png"],
  ["Dados profissionais", "profissionais-dados.png"],
  ["Vínculo", "profissionais-vinculo.png"],
  ["Comissionamento", "profissionais-comissao.png"],
  ["Horários de atendimento", "profissionais-horarios.png"],
  ["Procedimentos habilitados", "profissionais-procedimentos.png"],
];

for (const [titulo, arquivo] of secoes) {
  if (titulo === "Procedimentos habilitados") {
    await page.evaluate(() => {
      const heading = [...document.querySelectorAll("h2")].find((item) => item.textContent === "Procedimentos habilitados");
      const secao = heading?.closest("section");
      if (!secao || document.querySelector("[data-manual-spacer]")) return;
      const espaco = document.createElement("div");
      espaco.dataset.manualSpacer = "1";
      espaco.style.height = "720px";
      secao.parentElement?.appendChild(espaco);
    });
  }
  await irParaSecao(page, titulo);
  console.log(`\n--- ${titulo} ---\n${await textoMain(page)}\n`);
  await foto(page, arquivo);
}

await irParaSecao(page, "Dados pessoais");
const login = page.getByRole("combobox", { name: "Conta de login" });
await login.evaluate((el) => {
  let node = el.parentElement;
  while (node) {
    const estilo = getComputedStyle(node);
    if (/(auto|scroll)/.test(estilo.overflowY) && node.scrollHeight > node.clientHeight + 8) {
      const topo = el.getBoundingClientRect().top - node.getBoundingClientRect().top + node.scrollTop;
      node.scrollTop = Math.max(0, topo - 80);
      return;
    }
    node = node.parentElement;
  }
  el.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(300);
console.log(`\n--- login ---\n${await textoMain(page)}\n`);
await foto(page, "profissionais-login.png");

async function abrirPerfil(caminho, prova) {
  await page.goto(`${base}/profissionais/${escolhido.id}${caminho}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await prova.waitFor({ timeout: 30000 });
  await page.waitForTimeout(500);
}

await abrirPerfil("", page.getByRole("heading", { name: "Dados profissionais" }));
await page.setViewportSize({ width: 1440, height: 1200 });
await page.waitForTimeout(300);
console.log(`\n--- visao ---\n${await textoMain(page)}\n`);
await foto(page, "profissionais-visao.png");
await page.setViewportSize({ width: 1440, height: 900 });

await abrirPerfil("/agenda", page.getByPlaceholder("Buscar por paciente ou procedimento..."));
console.log(`\n--- agenda ---\n${await textoMain(page)}\n`);
await foto(page, "profissionais-agenda.png");

await abrirPerfil("/pacientes", page.getByPlaceholder("Buscar paciente..."));
console.log(`\n--- pacientes ---\n${await textoMain(page)}\n`);
await foto(page, "profissionais-pacientes.png");

await abrirPerfil("/comissoes", page.getByText("Comissões previstas"));
console.log(`\n--- comissoes ---\n${await textoMain(page)}\n`);
await foto(page, "profissionais-comissoes.png");

await abrirPerfil("/documentos", page.getByRole("heading", { name: "Documentos", exact: true }));
await page.setViewportSize({ width: 1440, height: 1100 });
await page.waitForTimeout(300);
console.log(`\n--- documentos ---\n${await textoMain(page)}\n`);
await foto(page, "profissionais-documentos.png");

await browser.close();
