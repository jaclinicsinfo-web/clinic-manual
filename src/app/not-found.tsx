import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Este tópico não está no manual</h1>
      <p className="mt-2 text-sm text-muted-foreground">Volte ao início e escolha um módulo do menu.</p>
      <Link href="/" className="mt-6 inline-block text-sm font-medium text-primary">
        Ir para o início
      </Link>
    </div>
  );
}
