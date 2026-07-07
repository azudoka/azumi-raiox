// ══════════════════════════════════════════════════════════════
// Gera o PDF a partir do HTML do relatório.
// Em produção (Vercel) usa puppeteer-core + @sparticuz/chromium
// (o Chrome "normal" não roda em serverless). Em dev local, se
// preferir, pode instalar "puppeteer" completo e trocar o import
// abaixo — deixei os dois caminhos comentados pra facilitar.
// ══════════════════════════════════════════════════════════════

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function gerarPdfDeHtml(html: string): Promise<Buffer> {
  const executablePath = await chromium.executablePath();

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 794, height: 1123 },
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

/*
─────────────────────────────────────────────────────────────────
DEV LOCAL: se `chromium.executablePath()` falhar na sua máquina
(comum fora da Vercel), troque temporariamente por:

  import puppeteer from "puppeteer"; // pacote completo, já no devDependencies
  const browser = await puppeteer.launch({ headless: true });

E lembre de trocar de volta antes de fazer deploy — em produção
precisa ser puppeteer-core + @sparticuz/chromium, senão o build
da Vercel fica gigante ou nem sobe (limite de tamanho de função).
─────────────────────────────────────────────────────────────────
*/
