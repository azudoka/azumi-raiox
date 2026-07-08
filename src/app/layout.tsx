import type { Metadata } from "next";
import { poppins, sora, spaceGrotesk } from "@/lib/fonts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
      <body>
        <Navbar />
        <main style={{ paddingTop: 88 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
