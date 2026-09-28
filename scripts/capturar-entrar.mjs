import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const base = "http://localhost:3000";
const pasta = path.join(process.cwd(), "public", "prints");

const emailExemplo = "maria.silva@clinica.com.br";
const senhaExemplo = "Senha1234";

function cnpjExemplo() {
  const baseCnpj = "112223330001";
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digito = (valor, pesos) => {
    const soma = valor.split("").reduce((acc, item, indice) => acc + Number(item) * pesos[indice], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const primeiro = digito(baseCnpj, pesos1);
  const segundo = digito(`${baseCnpj}${primeiro}`, pesos2);
  return `${baseCnpj}${primeiro}${segundo}`;
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

async function novaPagina(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    localStorage.setItem("clinicerp.tema", "claro");
    localStorage.removeItem("clinicerp.token");
    sessionStorage.removeItem("clinicerp.token.temp");
  });
  return page;
}

async function esperarFormulario(page) {
  await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  const limite = Date.now() + 20000;
  while (Date.now() < limite) {
    const girando = await page.locator(".animate-spin").count();
    if (girando === 0) return;
    await page.waitForTimeout(200);
  }
}

async function foto(page, arquivo) {
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" }).catch(() => {});
  await page.screenshot({ path: path.join(pasta, arquivo), fullPage: false });
  console.log(`ok ${arquivo}`);
}

const browser = await abrirNavegador();
await mkdir(pasta, { recursive: true });

const login = await novaPagina(browser);
await login.goto(`${base}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await login.getByRole("heading", { name: "Entrar" }).waitFor({ timeout: 30000 });
await esperarFormulario(login);
await login.locator("#email").fill(emailExemplo);
await login.locator("#senha").fill(senhaExemplo);
await login.locator("#lembrar").check();
await foto(login, "entrar.png");

const esqueci = await novaPagina(browser);
await esqueci.goto(`${base}/esqueci-senha`, { waitUntil: "domcontentloaded", timeout: 60000 });
await esqueci.getByRole("heading", { name: "Esqueci minha senha" }).waitFor({ timeout: 30000 });
await esperarFormulario(esqueci);
await esqueci.locator("#email").fill(emailExemplo);
await foto(esqueci, "esqueci-senha.png");
await esqueci.getByRole("button", { name: "Enviar link" }).click();
await esqueci.getByRole("heading", { name: "Verifique seu e-mail" }).waitFor({ timeout: 30000 });
await foto(esqueci, "esqueci-senha-enviado.png");

const novaSenha = await novaPagina(browser);
await novaSenha.goto(`${base}/redefinir-senha?token=exemplo-do-manual`, {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await novaSenha.getByRole("heading", { name: "Nova senha" }).waitFor({ timeout: 30000 });
await esperarFormulario(novaSenha);
await novaSenha.locator("#senha").fill(senhaExemplo);
await novaSenha.locator("#confirmarSenha").fill(senhaExemplo);
await foto(novaSenha, "nova-senha.png");

const linkInvalido = await novaPagina(browser);
await linkInvalido.goto(`${base}/redefinir-senha`, { waitUntil: "domcontentloaded", timeout: 60000 });
await linkInvalido.getByRole("heading", { name: "Link inválido" }).waitFor({ timeout: 30000 });
await foto(linkInvalido, "link-invalido.png");

const setup = await novaPagina(browser);
await setup.route("**/api/setup/status", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ precisaSetup: true }),
  }),
);
await setup.goto(`${base}/setup`, { waitUntil: "domcontentloaded", timeout: 60000 });
await setup.getByRole("heading", { name: "Configurar a clínica" }).waitFor({ timeout: 30000 });
await setup.locator("#nomeFantasia").fill("Clínica Vida Integrada");
await setup.locator("#razaoSocial").fill("Clínica Vida Integrada LTDA");
await setup.locator("#cnpj").fill(cnpjExemplo());
await setup.locator("#telefone").fill("1633214500");
await setup.locator("#emailClinica").fill("contato@clinicavida.com.br");
await foto(setup, "setup-clinica.png");
await setup.getByRole("button", { name: "Continuar" }).click();
await setup.locator("#unidadeNome").waitFor({ timeout: 10000 });
await setup.locator("#unidadeNome").fill("Sede Franca");
await setup.locator("#unidadeCidade").fill("Franca");
await foto(setup, "setup-unidade.png");
await setup.getByRole("button", { name: "Continuar" }).click();
await setup.locator("#adminNome").waitFor({ timeout: 10000 });
await setup.locator("#adminNome").fill("Maria Silva");
await setup.locator("#adminEmail").fill(emailExemplo);
await setup.locator("#senha").fill(senhaExemplo);
await setup.locator("#confirmarSenha").fill(senhaExemplo);
await setup.locator("#adminNome").click();
await setup.waitForTimeout(300);
await setup.locator("#senha, #confirmarSenha").evaluateAll((campos) => {
  for (const campo of campos) {
    if (campo.getAttribute("aria-invalid") === "true") continue;
    campo.style.setProperty("border-color", "#d6dce4", "important");
    campo.style.setProperty("box-shadow", "none", "important");
    campo.style.setProperty("outline", "none", "important");
  }
});
await foto(setup, "setup-administrador.png");

const unidade = await novaPagina(browser);
await unidade.route("**/api/auth/login", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      token: "print-manual",
      usuario: {
        id: "11111111-1111-1111-1111-111111111111",
        nome: "Maria Silva",
        email: emailExemplo,
        perfilId: "22222222-2222-2222-2222-222222222222",
        perfilNome: "Recepção",
        unidadesAcesso: [
          "fc52a9ad-d553-423a-a22a-7028730c8df8",
          "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        ],
        status: "ativo",
        tema: "claro",
      },
      unidades: [
        {
          id: "fc52a9ad-d553-423a-a22a-7028730c8df8",
          nome: "Sede Franca",
          cidade: "Franca",
          ativo: true,
        },
        {
          id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          nome: "Unidade Centro",
          cidade: "Franca",
          ativo: true,
        },
      ],
      unidadeAtualId: null,
      clinicaNome: "Luna - Centro de Desenvolvimento Infantil",
      perfil: { id: "22222222-2222-2222-2222-222222222222", nome: "Recepção", permissoes: [] },
      plano: {
        codigo: "ilimitado",
        nome: "Ilimitado",
        limiteUsuarios: null,
        limiteUnidades: null,
        modulos: ["dashboard"],
      },
      usoUsuarios: { usados: 1, limite: null },
    }),
  }),
);
await unidade.goto(`${base}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await unidade.getByRole("heading", { name: "Entrar" }).waitFor({ timeout: 30000 });
await unidade.locator("#email").fill(emailExemplo);
await unidade.locator("#senha").fill(senhaExemplo);
await unidade.getByRole("button", { name: "Entrar" }).click();
await unidade.getByRole("heading", { name: "Selecionar unidade" }).waitFor({ timeout: 30000 });
await foto(unidade, "selecionar-unidade.png");

await browser.close();
