import type { Metadata } from "next";
import { poppins, sora, spaceGrotesk } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Raio-X de Maturidade | Azumi RH",
  description: "Descubra em minutos o nível de maturidade do RH da sua empresa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${sora.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
