/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // puppeteer-core / @sparticuz/chromium não devem ser empacotados pelo bundler de rotas de API
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
};

module.exports = nextConfig;
