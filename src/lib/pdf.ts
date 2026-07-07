// ══════════════════════════════════════════════════════════════
// Gera o PDF a partir do HTML do relatório.
// Detecta automaticamente o ambiente: na Vercel (produção) usa
// puppeteer-core + @sparticuz/chromium (leve, compatível com
// serverless). Em dev local, usa o pacote "puppeteer" completo
// (já baixa um Chromium próprio). Não precisa trocar nada na mão.
// ══════════════════════════════════════════════════════════════

export async function gerarPdfDeHtml(html: string): Promise<Buffer> {
  const rodandoNaVercel = !!process.env.VERCEL;

  let browser: any;

  if (rodandoNaVercel) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = await import("puppeteer-core");
    const executablePath = await chromium.executablePath();

    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 794, height: 1123 },
      executablePath,
      headless: true,
    });
  } else {
    const puppeteer = await import("puppeteer");
    browser = await puppeteer.launch({ headless: true });
  }

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
