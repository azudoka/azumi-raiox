export async function gerarPdfDeHtml(html: string): Promise<Buffer> {
  const rodandoNaVercel = !!process.env.VERCEL;

  let browser: any;

  if (rodandoNaVercel) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = await import("puppeteer-core");

    // v5+ API: desativa gráficos GPU desnecessários para geração de PDF
    chromium.setHeadlessMode = true;
    chromium.setGraphicsMode = false;

    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 794, height: 1123 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
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
