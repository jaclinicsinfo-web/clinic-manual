import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";

import type { Capitulo } from "@/lib/manual";

function printDisponivel(arquivo: string) {
  return existsSync(path.join(process.cwd(), "public", "prints", arquivo));
}

function Figura({ arquivo, alt, legenda }: { arquivo: string; alt: string; legenda: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/prints/${arquivo}`} alt={alt} className="w-full bg-muted" />
      <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{legenda}</figcaption>
    </figure>
  );
}

export function Artigo({ capitulo }: { capitulo: Capitulo }) {
  const prints = capitulo.prints.filter((print) => printDisponivel(print.arquivo));
  const porArquivo = new Map(prints.map((print) => [print.arquivo, print]));
  const usados = new Set(capitulo.passos.flatMap((passo) => passo.imagens ?? []));
  const soltos = prints.filter((print) => !usados.has(print.arquivo));
  const passosComImagem = capitulo.passos.some((passo) => (passo.imagens?.length ?? 0) > 0);

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">{capitulo.grupo}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{capitulo.titulo}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{capitulo.resumo}</p>

      <div className="mt-6 rounded-xl border border-border bg-primary-subtle px-4 py-3 text-sm text-foreground">
        <span className="font-semibold">Quem acessa. </span>
        {capitulo.acesso}
      </div>

      {!passosComImagem && soltos.length > 0 && (
        <div className="mt-8 space-y-6">
          {soltos.map((print) => (
            <Figura key={print.arquivo} {...print} />
          ))}
        </div>
      )}

      <ol className="mt-10 space-y-12">
        {capitulo.passos.map((passo, index) => {
          const figuras = (passo.imagens ?? [])
            .map((arquivo) => porArquivo.get(arquivo))
            .filter((print) => print !== undefined);
          return (
            <li key={passo.titulo} className="space-y-4">
              <div className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-base font-semibold">{passo.titulo}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{passo.texto}</p>
                </div>
              </div>
              {figuras.map((print) => (
                <Figura key={print.arquivo} {...print} />
              ))}
            </li>
          );
        })}
      </ol>

      {capitulo.dicas && capitulo.dicas.length > 0 && (
        <div className="mt-10 rounded-xl border border-border bg-card px-5 py-4">
          <h2 className="text-sm font-semibold">Antes de chamar o suporte</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {capitulo.dicas.map((dica) => (
              <li key={dica}>{dica}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-10 text-sm text-muted-foreground">
        <Link href="/" className="font-medium text-primary">
          Voltar ao início
        </Link>
      </p>
    </article>
  );
}
