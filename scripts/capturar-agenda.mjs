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
    const n = rotulosPaciente.size;
    rotulosPaciente.set(id, n === 0 ? "Paciente teste" : `Paciente teste ${n + 1}`);
  }
  return rotulosPaciente.get(id);
}

function rotuloProf(nome) {
  if (!nome || typeof nome !== "string") return nome;
  if (!rotulosProf.has(nome)) {
    const n = rotulosProf.size;
    rotulosProf.set(nome, n === 0 ? "Usuário teste" : `Usuário teste ${n + 1}`);
  }
  return rotulosProf.get(nome);
}

function limparPaciente(item) {
  if (!item || typeof item !== "object" || !item.id) return;
  item.nome = rotuloPaciente(item.id);
  item.cpf = "00000000000";
  item.telefone = "16900000000";
  item.dataNascimento = "1990-05-15";
  item.alergias = item.alergias?.length ? ["Dipirona"] : [];
}

function limparProfissional(item) {
  if (!item || typeof item !== "object") return;
  item.nome = rotuloProf(item.nome);
  if (item.usuarioNome) item.usuarioNome = rotuloProf(item.usuarioNome);
  item.cpf = "00000000000";
  item.rg = "";
  item.email = "usuario.teste@clinic.local";
  item.telefone = "16900000000";
  item.registroConselho = "000000";
  if (typeof item.percentualComissao === "number" && item.percentualComissao > 0) {
    item.percentualComissao = 10;
  }
}

function limparAgendamento(item) {
  if (!item || typeof item !== "object") return;
  item.pacienteNome = rotuloPaciente(item.pacienteId);
  item.profissionalNome = rotuloProf(item.profissionalNome);
  item.valor = 150;
  item.observacoes = item.observacoes ? "Observação de exemplo." : item.observacoes;
  item.criadoPor = "Usuário teste";
}

function limparEspera(item) {
  if (!item || typeof item !== "object") return;
  item.pacienteNome = rotuloPaciente(item.pacienteId);
  item.telefone = "16900000000";
}

function limparBloqueio(item) {
  if (!item || typeof item !== "object") return;
  item.motivo = "Almoço";
}

function limparProcedimento(item) {
  if (!item || typeof item !== "object") return;
  item.valorParticular = 150;
  if (Array.isArray(item.valoresPorConvenio)) {
    item.valoresPorConvenio.forEach((valor) => {
      valor.valor = 150;
    });
  }
}

function alinharAgendamentos(json) {
  const procedimentos = Array.isArray(json.procedimentos) ? json.procedimentos : [];
  const consulta = procedimentos.find((item) => item.nome === "Consulta") ?? procedimentos[0];
  const ids = new Set(procedimentos.map((item) => item.id));
  for (const item of json.agendamentos ?? []) {
    if (consulta && item.procedimentoId && !ids.has(item.procedimentoId)) {
      item.procedimentoId = consulta.id;
      item.procedimentoNome = consulta.nome;
    }
    if (item.status === "atendido" || item.status === "cancelado" || item.status === "faltou") {
      item.status = "confirmado";
    }
  }
}

function limparAgenda(json) {
  if (Array.isArray(json.agendamentos)) {
    json.agendamentos.forEach((item) => rotuloPaciente(item.pacienteId));
  }
  if (Array.isArray(json.pacientes)) json.pacientes.forEach(limparPaciente);
  if (Array.isArray(json.ultimosPacientes)) json.ultimosPacientes.forEach(limparPaciente);
  if (json.ultimosPacientesPorProfissional && typeof json.ultimosPacientesPorProfissional === "object") {
    Object.values(json.ultimosPacientesPorProfissional).forEach((lista) => {
      if (Array.isArray(lista)) lista.forEach(limparPaciente);
    });
  }
  if (Array.isArray(json.profissionais)) json.profissionais.forEach(limparProfissional);
  if (Array.isArray(json.agendamentos)) json.agendamentos.forEach(limparAgendamento);
  if (Array.isArray(json.listaEspera)) json.listaEspera.forEach(limparEspera);
  if (Array.isArray(json.bloqueios)) json.bloqueios.forEach(limparBloqueio);
  if (Array.isArray(json.procedimentos)) json.procedimentos.forEach(limparProcedimento);
  alinharAgendamentos(json);
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

async function escolherDia(token) {
  const resposta = await fetch("http://localhost:3001/api/agenda?de=2025-01-01&ate=2026-12-31", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) throw new Error(`agenda recusada: ${resposta.status}`);
  const json = await resposta.json();
  const porData = new Map();
  for (const item of json.agendamentos ?? []) {
    const lista = porData.get(item.data) ?? [];
    lista.push({ status: item.status, hora: item.horaInicio });
    porData.set(item.data, lista);
  }
  let melhor = null;
  for (const [data, lista] of porData) {
    const manha = lista.filter((item) => item.hora < "13:00").length;
    const agendado = lista.some((item) => item.status === "agendado");
    const nota = lista.length + manha * 2 + (agendado ? 8 : 0);
    if (!melhor || nota > melhor.nota) {
      melhor = { data, nota, lista };
    }
  }
  const statuses = {};
  for (const item of json.agendamentos ?? []) {
    statuses[item.status] = (statuses[item.status] ?? 0) + 1;
  }
  console.log(
    `horarios: ${json.agendamentos?.length ?? 0}; bloqueios: ${json.bloqueios?.length ?? 0}; espera: ${json.listaEspera?.length ?? 0}; status: ${JSON.stringify(statuses)}`,
  );
  if (melhor) {
    console.log(`dia escolhido ${melhor.data} com ${melhor.lista.length} horarios`);
  } else {
    console.log("nenhum horario no periodo; a grade do dia atual sera fotografada");
  }
  return {
    data: melhor?.data ?? null,
    espera: json.listaEspera?.length ?? 0,
    salas: json.salas ?? [],
    convenios: (json.convenios ?? []).map((item) => item.nome),
    procedimentos: (json.procedimentos ?? []).map((item) => `${item.nome} · ${item.duracaoPadraoMin} min`),
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
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await page.screenshot({ path: path.join(pasta, arquivo), fullPage: false });
  console.log(`ok ${arquivo}`);
}

async function novaPagina(browser, acesso) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route("**/api/auth/me", async (route) => {
    const resposta = await route.fetch();
    const json = await resposta.json();
    if (json.usuario) {
      json.usuario.nome = "Usuário teste";
      json.usuario.tema = "claro";
    }
    await route.fulfill({ response: resposta, json });
  });
  await page.route("**/api/agenda**", async (route) => {
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
    if (Array.isArray(json.agendamentos) || Array.isArray(json.pacientes)) limparAgenda(json);
    await route.fulfill({ response: resposta, json });
  });
  await page.route("**/api/procedimentos**", async (route) => {
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
    if (Array.isArray(json.procedimentos)) json.procedimentos.forEach(limparProcedimento);
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

async function esperarGrade(page) {
  await page.getByRole("heading", { name: "Agenda", exact: true }).waitFor({ timeout: 30000 });
  await page.getByRole("button", { name: "Novo agendamento" }).waitFor({ timeout: 30000 });
  const limite = Date.now() + 25000;
  while (Date.now() < limite) {
    const texto = await page.locator("main").innerText().catch(() => "");
    if (!/carregando/i.test(texto) && /Atendimentos do dia/.test(texto)) return;
    await page.waitForTimeout(250);
  }
}

async function mostrarHorario(page) {
  await page.evaluate(() => {
    const grade = document.querySelector("main .overflow-auto.rounded-xl");
    const cartao = grade?.querySelector("button.z-20");
    if (!grade || !cartao) return;
    grade.scrollTop = Math.max(0, cartao.offsetTop - 36);
  });
  await page.waitForTimeout(250);
}

async function rolarSheet(page, titulo) {
  await page.evaluate((titulo) => {
    const drawer = document.querySelector("[data-slot='drawer-content']");
    const corpo = drawer?.querySelector(".overflow-y-auto");
    if (!corpo) return;
    const alvo = [...corpo.querySelectorAll("h2")].find((el) => el.textContent?.trim() === titulo);
    if (!alvo) return;
    const topo = alvo.getBoundingClientRect().top - corpo.getBoundingClientRect().top + corpo.scrollTop;
    corpo.scrollTop = Math.max(0, topo - 8);
  }, titulo);
  await page.waitForTimeout(250);
}

async function escolherOpcao(page, rotulo, nome) {
  const sheet = page.locator("[data-slot='drawer-content']");
  await sheet.getByRole("combobox", { name: rotulo }).click();
  if (nome) {
    await page.getByRole("option", { name: nome, exact: true }).click();
    return;
  }
  const opcoes = await page.getByRole("option").allInnerTexts();
  console.log(`${rotulo}: ${opcoes.join(" | ")}`);
  await page.getByRole("option").first().click();
  return opcoes;
}

const base = await acharBase();
const tokens = tokensPorPerfil();
const contexto = await escolherDia(tokens.Administrador);
console.log(`salas: ${contexto.salas.join(" | ")}`);
console.log(`convenios: ${contexto.convenios.join(" | ")}`);
console.log(`procedimentos: ${contexto.procedimentos.join(" | ")}`);

const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
console.log(`painel: ${base}`);

const page = await novaPagina(browser, await sessaoDe(tokens.Administrador));
const rota = contexto.data ? `${base}/agenda?data=${contexto.data}` : `${base}/agenda`;
await page.goto(rota, { waitUntil: "domcontentloaded", timeout: 60000 });
await esperarGrade(page);
await mostrarHorario(page);
console.log(`\n--- dia ---\n${(await page.locator("main").innerText()).slice(0, 2200)}\n`);
await foto(page, "agenda.png");

await page.getByRole("button", { name: "Semana", exact: true }).click();
await page.waitForTimeout(600);
console.log(`\n--- semana ---\n${(await page.locator("main").innerText()).slice(0, 1600)}\n`);
await foto(page, "agenda-semana.png");

await page.getByRole("button", { name: "Mês", exact: true }).click();
await page.waitForTimeout(600);
console.log(`\n--- mes ---\n${(await page.locator("main").innerText()).slice(0, 1600)}\n`);
await foto(page, "agenda-mes.png");

await page.getByRole("button", { name: "Dia", exact: true }).click();
await page.waitForTimeout(400);
await mostrarHorario(page);

const cartao = page.locator("main button.z-20").first();
if (await cartao.count()) {
  await cartao.click();
  const sheet = page.locator("[data-slot='drawer-content']");
  await sheet.getByRole("heading", { name: "Editar agendamento" }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(300);
  console.log(`\n--- horario ---\n${await sheet.innerText()}\n`);
  await foto(page, "agenda-horario.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
} else {
  console.log("sem cartao na grade para abrir o painel do horario");
}

await page.getByRole("button", { name: "Novo agendamento" }).click();
const novo = page.locator("[data-slot='drawer-content']");
await novo.getByRole("heading", { name: "Novo agendamento" }).waitFor({ timeout: 10000 });
const cadastrar = await novo.getByRole("button", { name: "Cadastrar novo" }).count();
console.log(`cadastrar novo visivel antes do paciente: ${cadastrar}`);
await escolherOpcao(page, "Profissional");
await page.waitForTimeout(400);
const busca = novo.getByPlaceholder("Buscar paciente...");
if (await busca.count()) {
  await busca.fill("Paciente teste");
  await page.waitForTimeout(300);
}
const cards = novo.locator(".max-h-56 button");
const totalCards = await cards.count();
let card = cards.first();
for (let indice = 0; indice < totalCards; indice += 1) {
  const texto = await cards.nth(indice).innerText();
  if (texto.startsWith("Paciente teste\n") || texto.startsWith("Paciente teste ")) {
    card = cards.nth(indice);
    break;
  }
}
if (totalCards) await card.click();
else console.log("nenhum paciente na busca");
await page.waitForTimeout(300);
await rolarSheet(page, "Paciente");
console.log(`\n--- novo paciente ---\n${await novo.innerText()}\n`);
await foto(page, "agenda-novo.png");
await escolherOpcao(page, "Procedimento");
await page.waitForTimeout(200);
await escolherOpcao(page, "Sala", "Consultório 1");
await novo.locator("#observacoes").fill("Encaixe de exemplo, com autorização já conferida.");
await page.waitForTimeout(200);
await rolarSheet(page, "Atendimento");

await rolarSheet(page, "Atendimento");
console.log(`\n--- novo atendimento ---\n${await novo.innerText()}\n`);
await foto(page, "agenda-novo-atendimento.png");

await rolarSheet(page, "Convênio e valor");
const particular = novo.locator("#particular");
if (await particular.isChecked()) {
  await particular.click();
  await page.waitForTimeout(200);
  await novo.getByRole("combobox", { name: "Convênio" }).click();
  const convenios = await page.getByRole("option").allInnerTexts();
  console.log(`convenio no form: ${convenios.join(" | ")}`);
  if (convenios.length) await page.getByRole("option").first().click();
  else await page.keyboard.press("Escape");
}
await rolarSheet(page, "Convênio e valor");
console.log(`\n--- novo convenio ---\n${await novo.innerText()}\n`);
await page.setViewportSize({ width: 1440, height: 1100 });
await foto(page, "agenda-novo-convenio.png");
await page.setViewportSize({ width: 1440, height: 900 });
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

await page.getByRole("button", { name: "Bloquear horário" }).click();
const bloqueio = page.getByRole("dialog");
await bloqueio.getByRole("heading", { name: "Bloquear horário" }).waitFor({ timeout: 10000 });
await bloqueio.getByRole("combobox", { name: "Profissional" }).click();
const profsBloqueio = await page.getByRole("option").allInnerTexts();
console.log(`profissionais no bloqueio: ${profsBloqueio.join(" | ")}`);
await page.getByRole("option").first().click();
await bloqueio.locator("#bloqueio-motivo").fill("Almoço");
await page.waitForTimeout(200);
console.log(`\n--- bloqueio ---\n${await bloqueio.innerText()}\n`);
await foto(page, "agenda-bloqueio.png");
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

await page.getByRole("button", { name: /Lista de espera/ }).click();
const espera = page.getByRole("dialog");
await espera.getByRole("heading", { name: "Lista de espera", exact: true }).waitFor({ timeout: 10000 });
await espera.getByRole("combobox", { name: "Paciente da lista de espera" }).click();
const pacientesEspera = await page.getByRole("option").allInnerTexts();
console.log(`pacientes na espera: ${pacientesEspera.length}`);
await page.getByRole("option", { name: "Paciente teste", exact: true }).click();
await espera.getByRole("combobox", { name: "Período preferido" }).click();
const periodos = await page.getByRole("option").allInnerTexts();
console.log(`periodos: ${periodos.join(" | ")}`);
await page.getByRole("option", { name: "Manhã", exact: true }).click();
await espera.getByRole("combobox", { name: "Profissional preferido" }).click();
await page.getByRole("option", { name: "Usuário teste", exact: true }).click();
await espera.getByRole("combobox", { name: "Procedimento da espera" }).click();
const procedimentosEspera = await page.getByRole("option").allInnerTexts();
console.log(`procedimentos na espera: ${procedimentosEspera.join(" | ")}`);
await page.getByRole("option", { name: "Consulta", exact: true }).click();
await page.waitForTimeout(200);
console.log(`\n--- espera ---\n${await espera.innerText()}\n`);
await foto(page, "agenda-espera.png");
await page.keyboard.press("Escape");

await browser.close();
