import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Shell } from "@/components/shell";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Manual do usuário · J.A. Clinics",
    template: "%s · Manual J.A. Clinics",
  },
  description: "Passo a passo das telas do J.A. Clinics para a equipe da clínica.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="h-full overflow-hidden">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
