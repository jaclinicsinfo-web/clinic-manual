const fs = require("node:fs");
const path = require("node:path");

const apiDir = path.resolve(__dirname, "..", "..", "clinic-api");
const jwt = require(path.join(apiDir, "node_modules", "jsonwebtoken"));
const { PrismaClient } = require(path.join(apiDir, "node_modules", "@prisma", "client"));

const env = Object.fromEntries(
  fs
    .readFileSync(path.join(apiDir, ".env"), "utf8")
    .split(/\r?\n/)
    .filter((linha) => linha && !linha.startsWith("#") && linha.includes("="))
    .map((linha) => {
      const indice = linha.indexOf("=");
      let valor = linha.slice(indice + 1).trim();
      if (
        (valor.startsWith('"') && valor.endsWith('"')) ||
        (valor.startsWith("'") && valor.endsWith("'"))
      ) {
        valor = valor.slice(1, -1);
      }
      return [linha.slice(0, indice).trim(), valor];
    }),
);

const prisma = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });

async function main() {
  const usuario = await prisma.usuario.findFirst({
    where: { status: "ativo", perfil: { nome: "Administrador" } },
    include: { usuarioUnidades: { include: { unidade: true } } },
  });
  if (!usuario) throw new Error("administrador ativo nao encontrado");
  const vinculo = usuario.usuarioUnidades.find((item) => item.unidade.ativo);
  if (!vinculo) throw new Error("unidade ativa nao encontrada");
  const token = jwt.sign(
    {
      sub: usuario.id,
      email: usuario.email,
      perfilId: usuario.perfilId,
      clinicaId: usuario.clinicaId,
      unidadeAtualId: vinculo.unidadeId,
    },
    env.JWT_SECRET,
    { expiresIn: "2h" },
  );
  process.stdout.write(token);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
