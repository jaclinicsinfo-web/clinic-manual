import Link from "next/link";

import { capitulos, grupos } from "@/lib/manual";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">J.A. Clinics</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Manual do usuário</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Use este guia para entrar no painel, achar a tela certa e concluir a rotina sem esperar o suporte. Cada tópico
        explica quem acessa, o que fazer em ordem e, quando houver captura, mostra a tela real.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["1", "Ache o módulo", "O menu à esquerda segue os mesmos grupos do sistema."],
          ["2", "Siga os passos", "Cada tela descreve o botão, o filtro e o resultado esperado."],
          ["3", "Confira o print", "A imagem mostra a tela como ela aparece no painel."],
        ].map(([numero, titulo, texto]) => (
          <div key={numero} className="rounded-xl border border-border bg-card px-4 py-4">
            <p className="text-sm font-semibold text-primary">{numero}</p>
            <p className="mt-2 text-sm font-semibold">{titulo}</p>
            <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        {grupos.map((grupo) => (
          <section key={grupo}>
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{grupo}</h2>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {capitulos
                .filter((item) => item.grupo === grupo)
                .map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/${item.slug}`}
                      className="block h-full rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary"
                    >
                      <p className="font-semibold">{item.titulo}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.resumo}</p>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
