import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Artigo } from "@/components/artigo";
import { capituloPorSlug, capitulos } from "@/lib/manual";

export function generateStaticParams() {
  return capitulos.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const capitulo = capituloPorSlug(slug);
  if (!capitulo) return { title: "Tópico" };
  return { title: capitulo.titulo, description: capitulo.resumo };
}

export default async function CapituloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const capitulo = capituloPorSlug(slug);
  if (!capitulo) notFound();
  return <Artigo capitulo={capitulo} />;
}
