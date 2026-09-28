const fs = require("node:fs");
const path = require("node:path");

const apiDir = path.resolve(__dirname, "..", "..", "clinic-api");
const jwt = require(path.join(apiDir, "node_modules", "jsonwebtoken"));
const bcrypt = require(path.join(apiDir, "node_modules", "bcryptjs"));
const { PrismaClient } = require(path.join(apiDir, "node_modules", "@prisma", "client"));

const env = Object.fromEntries(
  fs
    .readFileSync(path.join(apiDir, ".env"), "utf8")
    .split(/\r?\n/)
    .filter((linha) => linha && !linha.startsWith("#") && linha.includes("="))
    .map((linha) => {
      const indice = linha.indexOf("=");
      let valor = linha.slice(indice + 1).trim();
      if ((valor.startsWith('"') && valor.endsWith('"')) || (valor.startsWith("'") && valor.endsWith("'"))) {
        valor = valor.slice(1, -1);
      }
      return [linha.slice(0, indice).trim(), valor];
    }),
);

const prisma = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
const NOME = "Usuário teste";
const EMAIL = "usuario.teste@clinic.local";

function tokenDe(usuario, unidadeId) {
  return jwt.sign(
    {
      sub: usuario.id,
      email: usuario.email,
      perfilId: usuario.perfilId,
      clinicaId: usuario.clinicaId,
      unidadeAtualId: unidadeId,
    },
    env.JWT_SECRET,
    { expiresIn: "2h" },
  );
}

async function garantirProfissionalDeSaude(clinicaId, unidadeIds) {
  let usuario = await prisma.usuario.findFirst({
    where: { email: EMAIL },
    include: { perfil: true, usuarioUnidades: true },
  });

  if (!usuario) {
    const perfil = await prisma.perfilAcesso.findFirst({
      where: { clinicaId, nome: "Profissional de saúde" },
    });
    if (!perfil) throw new Error("perfil Profissional de saúde nao encontrado");
    const senhaHash = await bcrypt.hash("manual-teste-8", 10);
    usuario = await prisma.usuario.create({
      data: {
        clinicaId,
        nome: NOME,
        email: EMAIL,
        senhaHash,
        perfilId: perfil.id,
        status: "ativo",
        usuarioUnidades: { create: unidadeIds.map((unidadeId) => ({ unidadeId })) },
      },
      include: { perfil: true, usuarioUnidades: true },
    });
  }

  const profissional = await prisma.profissional.findFirst({
    where: { clinicaId, status: "ativo" },
    orderBy: { criadoEm: "asc" },
  });
  if (profissional && !profissional.usuarioId) {
    await prisma.profissional.update({
      where: { id: profissional.id },
      data: { usuarioId: usuario.id },
    });
  }

  return usuario;
}

async function main() {
  const admin = await prisma.usuario.findFirst({
    where: { status: "ativo", perfil: { nome: "Administrador" } },
    include: { perfil: true, usuarioUnidades: { include: { unidade: true } } },
  });
  if (!admin) throw new Error("administrador ativo nao encontrado");
  const unidadeId = admin.usuarioUnidades.find((item) => item.unidade.ativo)?.unidadeId;
  if (!unidadeId) throw new Error("unidade ativa nao encontrada");

  await garantirProfissionalDeSaude(
    admin.clinicaId,
    admin.usuarioUnidades.map((item) => item.unidadeId),
  );

  const perfis = ["Administrador", "Gestor", "Financeiro", "Recepção", "Profissional de saúde"];
  const tokens = {};
  for (const nome of perfis) {
    const usuario = await prisma.usuario.findFirst({
      where: { status: "ativo", clinicaId: admin.clinicaId, perfil: { nome } },
      include: { usuarioUnidades: { include: { unidade: true } } },
      orderBy: { criadoEm: "asc" },
    });
    if (!usuario) throw new Error(`sem usuario ativo no perfil ${nome}`);
    const unidade = usuario.usuarioUnidades.find((item) => item.unidade.ativo)?.unidadeId ?? unidadeId;
    tokens[nome] = tokenDe(usuario, unidade);
  }

  process.stdout.write(JSON.stringify(tokens));
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
