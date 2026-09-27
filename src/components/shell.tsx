"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { BookOpen, Menu, Search, X } from "lucide-react";

import { capitulos, grupos } from "@/lib/manual";

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const termo = busca.trim().toLowerCase();

  const filtrados = useMemo(() => {
    if (!termo) return capitulos;
    return capitulos.filter((item) => {
      const texto = [item.titulo, item.resumo, item.acesso, ...item.passos.map((passo) => `${passo.titulo} ${passo.texto}`)]
        .join(" ")
        .toLowerCase();
      return texto.includes(termo);
    });
  }, [termo]);

  const menu = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-sidebar-border px-4 py-5">
        <Link href="/" className="flex items-center gap-3" onClick={() => setAberto(false)}>
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">Manual J.A. Clinics</span>
            <span className="block text-xs text-sidebar-muted">Passo a passo das telas</span>
          </span>
        </Link>
        <label className="mt-4 flex items-center gap-2 rounded-lg bg-sidebar-active px-3 py-2 text-sidebar-foreground">
          <Search className="size-4 shrink-0 text-sidebar-muted" />
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar no manual"
            className="w-full bg-transparent text-sm outline-none placeholder:text-sidebar-muted"
          />
        </label>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {filtrados.length === 0 ? (
          <p className="px-2 text-sm text-sidebar-muted">Nenhum tópico encontrado.</p>
        ) : (
          grupos.map((grupo) => {
            const itens = filtrados.filter((item) => item.grupo === grupo);
            if (itens.length === 0) return null;
            return (
              <div key={grupo} className="mb-5">
                <p className="px-2 pb-2 text-[11px] font-semibold tracking-wide text-sidebar-muted uppercase">{grupo}</p>
                <ul className="space-y-1">
                  {itens.map((item) => {
                    const ativo = pathname === `/${item.slug}`;
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/${item.slug}`}
                          onClick={() => setAberto(false)}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            ativo
                              ? "bg-white/10 font-medium text-white"
                              : "text-sidebar-foreground hover:bg-white/5"
                          }`}
                        >
                          {item.titulo}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        )}
      </nav>
    </div>
  );

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden w-72 shrink-0 bg-sidebar text-sidebar-foreground lg:block">{menu}</aside>
      {aberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/40" aria-label="Fechar menu" onClick={() => setAberto(false)} />
          <aside className="relative h-full w-72 bg-sidebar text-sidebar-foreground">{menu}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setAberto(true)}
            className="rounded-lg border border-border p-2 text-foreground"
            aria-label="Abrir menu"
          >
            {aberto ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <p className="text-sm font-semibold">Manual J.A. Clinics</p>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
