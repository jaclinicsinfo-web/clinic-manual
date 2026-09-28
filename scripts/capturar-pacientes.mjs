import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pasta = path.join(process.cwd(), "public", "prints");
const escolhido = { id: null };

const rotulosPaciente = new Map();
const rotulosProf = new Map();

function rotuloPaciente(id) {
  if (!id) return "Paciente teste";
  if (id === escolhido.id) return "Paciente teste";
  if (!rotulosPaciente.has(id)) {
    rotulosPaciente.set(id, `Paciente teste ${rotulosPaciente.size + 2}`);
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

function valorDemo(valor) {
  return typeof valor === "number" && valor > 0 ? 150 : valor;
}

function limparPaciente(paciente, tinhaSaldo = false) {
  if (!paciente || typeof paciente !== "object") return;
  const id = paciente.id;
  paciente.nome = rotuloPaciente(id);
  paciente.cpf = "00000000000";
  paciente.rg = "";
  paciente.dataNascimento = "1990-05-15";
  paciente.profissao = "";
  paciente.telefone = "16900000000";
  paciente.whatsapp = "16900000000";
  paciente.email = "paciente.teste@clinic.local";
  if (paciente.endereco) {
    paciente.endereco.cep = "14400000";
    paciente.endereco.rua = "Rua Exemplo";
    paciente.endereco.numero = "100";
    paciente.endereco.complemento = "";
    paciente.endereco.bairro = "Centro";
    paciente.endereco.cidade = "Franca";
    paciente.endereco.uf = "SP";
  }
  if (paciente.numeroCarteirinha) paciente.numeroCarteirinha = "000000";
  if (paciente.responsavel) {
    paciente.responsavel.nome = "Responsável teste";
    paciente.responsavel.cpf = "00000000000";
    paciente.responsavel.telefone = "16900000000";
  }
  const demonstrarClinico = id === escolhido.id;
  paciente.alergias = paciente.alergias?.length || demonstrarClinico ? ["Dipirona"] : [];
  paciente.condicoesPreexistentes = paciente.condicoesPreexistentes?.length || demonstrarClinico ? ["Hipertensão"] : [];
  paciente.medicacoesEmUso = paciente.medicacoesEmUso?.length || demonstrarClinico ? ["Losartana"] : [];
  paciente.profissionalPreferidoNome = paciente.profissionalPreferidoNome
    ? rotuloProf(paciente.profissionalPreferidoNome)
    : paciente.profissionalPreferidoNome;
  paciente.observacoes = paciente.observacoes ? "Observação de exemplo." : paciente.observacoes;
  paciente.saldoDevedor = tinhaSaldo || id === escolhido.id ? 150 : 0;
}

function limparAgendamento(item) {
  if (!item) return;
  item.pacienteNome = rotuloPaciente(item.pacienteId);
  item.profissionalNome = rotuloProf(item.profissionalNome);
  item.valor = valorDemo(item.valor);
  item.observacoes = item.observacoes ? "Observação de exemplo." : item.observacoes;
}

function limparAtendimento(item) {
  if (!item) return;
  item.profissionalNome = rotuloProf(item.profissionalNome);
  if (item.evolucao) item.evolucao = "Registro de exemplo do atendimento.";
  if (item.queixaPrincipal) item.queixaPrincipal = "Queixa de exemplo.";
  if (item.quadroClinico) item.quadroClinico = "Quadro estável, sem piora.";
  if (item.conduta) item.conduta = "Orientação e retorno.";
  if (Array.isArray(item.anexos)) {
    item.anexos.forEach((anexo, indice) => {
      anexo.nome = `Documento de exemplo ${indice + 1}.pdf`;
    });
  }
}

function limparAcompanhamento(item) {
  if (!item) return;
  item.profissionalNome = rotuloProf(item.profissionalNome);
  item.titulo = "Acompanhamento de exemplo";
  if (item.queixaInicial) item.queixaInicial = "Queixa de exemplo.";
  if (item.quadroInicial) item.quadroInicial = "Quadro inicial de exemplo.";
  if (item.objetivo) item.objetivo = "Acompanhar a evolução.";
  if (item.resumoAlta) item.resumoAlta = "Alta de exemplo.";
}

function limparCobranca(item, pacienteId) {
  if (!item) return;
  item.pacienteNome = "Paciente teste";
  item.pacienteId = pacienteId ?? item.pacienteId;
  item.descricao = "Consulta de exemplo";
  item.valor = 150;
  if (typeof item.valorAberto === "number" && item.valorAberto > 0) item.valorAberto = 150;
  if (Array.isArray(item.parcelas)) {
    item.parcelas.forEach((parcela) => {
      parcela.valor = 150;
    });
  }
}

function cobrarDemo(pacienteId) {
  return {
    id: "demo-cobranca-manual",
    pacienteId,
    pacienteNome: "Paciente teste",
    descricao: "Consulta de exemplo",
    valor: 150,
    formaPagamento: null,
    convenioId: null,
    status: "pendente",
    vencimento: "2026-10-10",
    parcelas: [],
    criadoEm: "2026-09-01T12:00:00.000Z",
  };
}

function limparLista(json) {
  if (Array.isArray(json.pacientes)) {
    json.pacientes.forEach((paciente) => {
      const tinhaSaldo = Number(paciente.saldoDevedor) > 0;
      limparPaciente(paciente, tinhaSaldo);
    });
  }
  if (Array.isArray(json.profissionais)) {
    json.profissionais.forEach((item) => {
      item.nome = rotuloProf(item.nome);
    });
  }
  if (json.resumo && Array.isArray(json.pacientes)) {
    const comSaldo = json.pacientes.filter((paciente) => paciente.saldoDevedor > 0).length;
    json.resumo.comPendencia = comSaldo;
    json.resumo.valorEmAberto = comSaldo * 150;
  }
}

function limparDetalhe(json) {
  limparPaciente(json.paciente, true);
  json.paciente.saldoDevedor = 150;
  for (const lista of ["proximosAgendamentos", "agendamentos"]) {
    if (Array.isArray(json[lista])) json[lista].forEach(limparAgendamento);
  }
  if (Array.isArray(json.atendimentos)) json.atendimentos.forEach(limparAtendimento);
  if (Array.isArray(json.acompanhamentos)) json.acompanhamentos.forEach(limparAcompanhamento);
  if (Array.isArray(json.cobrancas)) {
    json.cobrancas.forEach((item) => limparCobranca(item, json.paciente?.id));
    const aberta = json.cobrancas.some((item) =>
      ["pendente", "atrasado", "parcelado"].includes(item.status),
    );
    if (!aberta) json.cobrancas.unshift(cobrarDemo(json.paciente?.id));
  }
  if (Array.isArray(json.documentos)) {
    json.documentos.forEach((item, indice) => {
      item.nome = `Documento de exemplo ${indice + 1}.pdf`;
    });
  }
}

function limparOpcoes(json) {
  if (Array.isArray(json.profissionais)) {
    json.profissionais.forEach((item) => {
      item.nome = rotuloProf(item.nome);
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

async function escolherPaciente(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const lista = await fetch("http://localhost:3001/api/pacientes", { headers });
  if (!lista.ok) throw new Error(`lista recusada: ${lista.status}`);
  const json = await lista.json();
  const ids = (json.pacientes ?? []).map((item) => item.id);
  let melhor = ids[0] ?? null;
  let melhorNota = -1;
  for (const id of ids.slice(0, 20)) {
    const resposta = await fetch(`http://localhost:3001/api/pacientes/${id}`, { headers });
    if (!resposta.ok) continue;
    const detalhe = await resposta.json();
    const aberta = (detalhe.cobrancas ?? []).some((item) =>
      ["pendente", "atrasado", "parcelado"].includes(item.status),
    );
    const nota =
      (detalhe.agendamentos?.length ?? 0) +
      (detalhe.acompanhamentos?.length ?? 0) * 3 +
      (detalhe.atendimentos?.length ?? 0) * 2 +
      (detalhe.documentos?.length ?? 0) * 2 +
      (detalhe.proximosAgendamentos?.length ?? 0) +
      (aberta ? 5 : 0);
    if (nota > melhorNota) {
      melhorNota = nota;
      melhor = id;
    }
  }
  console.log(`pacientes na lista: ${ids.length}; ficha escolhida pela quantidade de abas preenchidas`);
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
  return texto.replace(/\s+\n/g, "\n").slice(0, 1800);
}

async function novaPagina(browser, acesso) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route("**/api/auth/me", async (route) => {
    const resposta = await route.fetch();
    const json = await resposta.json();
    if (json.usuario) json.usuario.nome = "Usuário teste";
    await route.fulfill({ response: resposta, json });
  });
  await page.route("**/api/pacientes**", async (route) => {
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
    else if (json.paciente) limparDetalhe(json);
    else if (Array.isArray(json.pacientes)) limparLista(json);
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
  await page.getByRole("heading", { name: "Pacientes", exact: true }).waitFor({ timeout: 30000 });
  await page.getByRole("link", { name: "Novo paciente" }).waitFor({ timeout: 30000 });
  const limite = Date.now() + 25000;
  while (Date.now() < limite) {
    const texto = await page.locator("main").innerText().catch(() => "");
    if (!/carregando/i.test(texto) && /Total de pacientes/.test(texto)) return;
    await page.waitForTimeout(250);
  }
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
  await page.locator("#nome").fill("Paciente teste");
  await page.locator("#cpf").fill("00000000000");
  await page.locator("#rg").fill("00.000.000-0");
  await page.locator("#dataNascimento").fill("1990-05-15");
  await escolherOpcao(page, "Sexo", "Feminino");
  await escolherOpcao(page, "Estado civil", "Casado(a)");
  await page.locator("#profissao").fill("Autônomo");
  await page.locator("#telefone").fill("16900000000");
  await page.locator("#whatsapp").fill("16900000000");
  await page.locator("#email").fill("paciente.teste@clinic.local");
  await page.locator("#cep").fill("14400350");
  await page.locator("#cep").blur();
  await page.waitForTimeout(1200);
  const rua = await page.locator("#rua").inputValue();
  if (!rua) await page.locator("#rua").fill("Rua Exemplo");
  await page.locator("#numero").fill("100");
  await page.locator("#complemento").fill("Sala 1");
  const bairro = await page.locator("#bairro").inputValue();
  if (!bairro) await page.locator("#bairro").fill("Centro");
  const cidade = await page.locator("#cidade").inputValue();
  if (!cidade) await page.locator("#cidade").fill("Franca");
  const uf = await page.locator("#uf").inputValue();
  if (!uf) await page.locator("#uf").fill("SP");

  await page.getByRole("combobox", { name: "Convênio" }).click();
  const opcoesConvenio = await page.getByRole("option").allInnerTexts();
  console.log(`convenios: ${opcoesConvenio.join(" | ")}`);
  if (opcoesConvenio.length > 1) await page.getByRole("option").nth(1).click();
  else await page.keyboard.press("Escape");
  if (await page.locator("#numeroCarteirinha").count()) {
    await page.locator("#numeroCarteirinha").fill("000000");
    await page.locator("#validadeCarteirinha").fill("2027-12-31");
  }

  await page.locator("#temResponsavel").click();
  await page.locator("#responsavelNome").fill("Responsável teste");
  await page.locator("#responsavelCpf").fill("00000000000");
  await page.locator("#responsavelParentesco").fill("Mãe");
  await page.locator("#responsavelTelefone").fill("16900000000");

  await page.locator("#alergias").fill("Dipirona");
  await page.locator("#alergias").press("Enter");
  await page.locator("#condicoes").fill("Hipertensão");
  await page.locator("#condicoes").press("Enter");
  await page.locator("#medicacoes").fill("Losartana 50mg");
  await page.locator("#medicacoes").press("Enter");

  await page.getByRole("combobox", { name: "Profissional preferido" }).click();
  const opcoesProf = await page.getByRole("option").allInnerTexts();
  console.log(`profissionais: ${opcoesProf.join(" | ")}`);
  const preferido = opcoesProf.find((item) => item !== "Sem preferência");
  if (preferido) await page.getByRole("option", { name: preferido, exact: true }).click();
  else await page.keyboard.press("Escape");

  await page.locator("#observacoes").fill("Observação de exemplo.");
  await page.locator("#consentimentoLgpd").click();
  await page.locator("#autorizacaoImagem").click();
}

async function preencherEvolucao(page) {
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Queixa / motivo").fill("Dor no joelho ao caminhar");
  await dialog.locator("#quadro").fill("Paciente estável, sem piora desde a última visita.");
  await dialog.locator("#evolucao").fill("Registro de exemplo do atendimento.");
  await dialog.locator("#conduta").fill("Orientação e retorno em duas semanas.");
  await dialog.locator("#dor").fill("3");
  if (await dialog.locator("#retorno").count()) {
    await dialog.locator("#retorno").fill("2026-10-15");
  }
  const melhorou = dialog.getByText("Melhorou", { exact: true });
  if (await melhorou.count()) await melhorou.click();
}

const base = await acharBase();
const tokens = tokensPorPerfil();
escolhido.id = await escolherPaciente(tokens.Administrador);
if (!escolhido.id) throw new Error("nenhum paciente para abrir a ficha");

const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });
console.log(`painel: ${base}`);

const page = await novaPagina(browser, await sessaoDe(tokens.Administrador));

await page.goto(`${base}/pacientes`, { waitUntil: "domcontentloaded", timeout: 60000 });
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
console.log(`\n--- lista ---\n${await textoMain(page)}\n`);
await foto(page, "pacientes.png");

await page.goto(`${base}/pacientes/novo`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByRole("heading", { name: "Novo paciente", exact: true }).waitFor({ timeout: 30000 });
await page.locator("#nome").waitFor({ timeout: 30000 });
await preencherCadastro(page);

const secoes = [
  ["Dados pessoais", "pacientes-pessoais.png"],
  ["Contato e endereço", "pacientes-contato.png"],
  ["Convênio", "pacientes-convenio.png"],
  ["Responsável", "pacientes-responsavel.png"],
  ["Dados clínicos gerais", "pacientes-clinicos.png"],
  ["Preferências", "pacientes-preferencias.png"],
  ["Consentimentos", "pacientes-consentimentos.png"],
];
for (const [titulo, arquivo] of secoes) {
  await irParaSecao(page, titulo);
  console.log(`\n--- ${titulo} ---\n${await textoMain(page)}\n`);
  await foto(page, arquivo);
}

async function abrirFicha(caminho, prova) {
  await page.goto(`${base}/pacientes/${escolhido.id}${caminho}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await prova.waitFor({ timeout: 30000 });
  await page.waitForTimeout(500);
}

await abrirFicha("", page.getByRole("heading", { name: "Próximos agendamentos" }));
console.log(`\n--- visao ---\n${await textoMain(page)}\n`);
await foto(page, "pacientes-visao.png");

await abrirFicha(
  "/prontuario",
  page.getByRole("heading", { name: /Evolução clínica|Linha do tempo clínica/ }),
);
console.log(`\n--- prontuario ---\n${await textoMain(page)}\n`);
await foto(page, "pacientes-prontuario.png");

const botaoEvolucao = page.getByRole("button", { name: /Nova evolução|Acompanhamento encerrado/ });
if (await botaoEvolucao.count()) {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await botaoEvolucao.first().click();
  await page.getByRole("dialog").waitFor({ timeout: 10000 });
  await preencherEvolucao(page);
  await page.evaluate(() => {
    const corpo = document.querySelector("[data-slot='dialog-content'] .overflow-y-auto");
    if (corpo) corpo.scrollTop = 0;
  });
  await page.waitForTimeout(300);
  console.log(`\n--- evolucao ---\n${await page.getByRole("dialog").innerText()}\n`);
  await foto(page, "pacientes-evolucao.png");
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
} else {
  console.log("sem botao de evolucao");
}

await abrirFicha("/historico", page.getByPlaceholder("Buscar por procedimento ou profissional..."));
console.log(`\n--- historico ---\n${await textoMain(page)}\n`);
await foto(page, "pacientes-historico.png");

await abrirFicha("/documentos", page.getByRole("heading", { name: "Documentos e anexos" }));
console.log(`\n--- documentos ---\n${await textoMain(page)}\n`);
await foto(page, "pacientes-documentos.png");

await page.getByRole("button", { name: "Anexar documento" }).first().click();
await page.getByRole("dialog").waitFor({ timeout: 10000 });
const dialogAnexo = page.getByRole("dialog");
await dialogAnexo.getByRole("combobox", { name: "Tipo de documento" }).click();
const tipos = await page.getByRole("option").allInnerTexts();
console.log(`tipos de documento: ${tipos.join(" | ")}`);
await page.getByRole("option", { name: "Laudo", exact: true }).click();
await dialogAnexo.locator('input[type="file"]').setInputFiles({
  name: "exame-exemplo.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.1\n"),
});
await page.waitForTimeout(300);
console.log(`\n--- anexar ---\n${await dialogAnexo.innerText()}\n`);
await foto(page, "pacientes-anexar.png");
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

await abrirFicha("/financeiro", page.getByRole("button", { name: "Gerar cobrança" }));
console.log(`\n--- financeiro ---\n${await textoMain(page)}\n`);
await foto(page, "pacientes-financeiro.png");

await page.getByRole("button", { name: "Gerar cobrança" }).click();
const dialogCobranca = page.getByRole("dialog");
await dialogCobranca.waitFor({ timeout: 10000 });
await dialogCobranca.locator("#pac-cob-desc").fill("Consulta de exemplo");
await dialogCobranca.locator('input[inputmode="numeric"]').fill("15000");
await dialogCobranca.locator("#pac-cob-venc").fill("2026-10-10");
await page.waitForTimeout(200);
console.log(`\n--- cobranca ---\n${await dialogCobranca.innerText()}\n`);
await foto(page, "pacientes-cobranca.png");
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

const receber = page.getByRole("button", { name: "Receber" }).first();
if (await receber.count()) {
  await receber.click();
  const dialogReceber = page.getByRole("dialog");
  await dialogReceber.waitFor({ timeout: 10000 });
  await page.waitForTimeout(200);
  console.log(`\n--- recebimento ---\n${await dialogReceber.innerText()}\n`);
  await foto(page, "pacientes-recebimento.png");
  await page.keyboard.press("Escape");
}

await browser.close();
