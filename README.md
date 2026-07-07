# Raio-X de Maturidade — Azumi RH

Projeto novo e independente do `azumi-site-v1` e do Azumi Forms.
Stack: Next.js 14 (App Router) + Supabase + Resend + Puppeteer (PDF).

## O que este projeto já faz (MVP v1)

1. Cliente responde o questionário (14 perguntas: 4 pilares que espelham a
   Matriz de Maturidade do RH + bloco de Tecnologia/IA à parte).
2. Ao enviar, a API (`/api/submit`) calcula a nota de cada pilar de forma
   **determinística** (não usa IA pra pontuar — só médias das escalas 1-5
   escolhidas pelo cliente).
3. Gera o relatório em HTML (visual idêntico ao seu "Gerador de Relatório"
   manual) e converte pra PDF via Puppeteer.
4. Sobe o PDF pro Supabase Storage e salva o lead completo (respostas +
   notas + PDF) na tabela `raiox_leads`.
5. Envia e-mail pra você (`AZUMI_NOTIFICATION_EMAIL`) com o resumo do lead
   e o link do PDF.
6. O cliente cai numa página de obrigado que já mostra a nota geral e o
   botão de download do PDF — sem precisar esperar e-mail.

**Fase 2 (não implementada ainda, não bloqueia o lançamento):** envio
automático do PDF por e-mail pro próprio cliente.

## Setup

```bash
npm install
cp .env.example .env.local   # preencha com as credenciais reais
```

### 1. Supabase
- Crie um projeto novo no Supabase (separado do projeto do Azumi Forms).
- Rode o arquivo `supabase/schema.sql` inteiro no SQL Editor.
- Copie a URL do projeto, a `anon key` e a `service_role key` pro `.env.local`.

### 2. Resend
- Verifique o domínio `azumirh.com.br` (ou subdomínio) no Resend, se ainda
  não estiver verificado.
- Gere uma API key e coloque em `RESEND_API_KEY`.
- Defina `AZUMI_NOTIFICATION_EMAIL` com o e-mail que deve receber os leads.

### 3. Rodar localmente

```bash
npm run dev
```

⚠️ **Puppeteer local:** `@sparticuz/chromium` é otimizado pra rodar na
Vercel (serverless) e pode falhar na sua máquina local. Se `gerarPdfDeHtml`
der erro localmente, troque temporariamente em `src/lib/pdf.ts` pelo
pacote `puppeteer` completo (já está no `devDependencies`) — instruções
comentadas no próprio arquivo. Lembre de reverter antes do deploy.

### 4. Deploy (Vercel)
- Conecte o repositório à Vercel.
- Configure as mesmas variáveis de ambiente do `.env.local` no painel da
  Vercel (Production + Preview).
- Aponte o domínio `raiox.azumirh.com.br` (ou o subdomínio escolhido) pro
  projeto.

### 5. Conectar ao site institucional
No `azumi-site-v1`, o botão "Fazer meu Raio X" (hoje abre o `RaioXModal`)
deve passar a ser um link direto pra `https://raiox.azumirh.com.br` —
igual já estava decidido. Isso é uma mudança pequena no
`RaioXButton.tsx`/`RaioXPopup.tsx`, não incluída neste projeto (é no
outro repo). Me chama quando for a hora de fazer essa alteração lá.

## Decisões já tomadas (não precisa repensar)

- **Pontuação é determinística**, nunca decidida por IA — só a escala
  1-5 que o cliente escolhe em cada pergunta.
- **4 pilares** (Estratégia, Processos & Fluxos, Pessoas & Liderança,
  Performance & Dados) espelham exatamente a Matriz de Maturidade do RH.
- **Tecnologia/IA** é um bloco separado, não entra na nota geral.
- Textos de "Diagnóstico" e "Classificação" vêm **literalmente** da
  Matriz de Maturidade (`src/lib/matrizMaturidade.ts`) — não são gerados
  por IA nem inventados no momento.
- Sumário, Top 3 Prioridades e Parecer Técnico são gerados por
  **templates** (`src/lib/gerarConteudoRelatorio.ts`), não por IA — mais
  barato, mais previsível, mais fácil de revisar.

## Pendências / próximos passos sugeridos

1. **Testar o fluxo ponta a ponta** com dados reais antes de divulgar o
   link (preencher o form, conferir o PDF gerado, conferir o e-mail).
2. **Anti-spam básico:** hoje `/api/submit` é uma rota pública sem
   nenhuma proteção. Vale adicionar um honeypot simples ou reCAPTCHA/
   Turnstile antes do lançamento público, pra evitar leads falsos.
3. **Revisar os textos gerados automaticamente** (sumário, top 3,
   parecer) com respostas de teste reais — são templates, então às vezes
   o texto pode ficar repetitivo; ajustar o tom em
   `gerarConteudoRelatorio.ts` é rápido.
4. **Fase 2:** e-mail automático pro cliente com o PDF anexado (dá pra
   reaproveitar `src/lib/email.ts`, só adicionar uma segunda função e
   chamar ela em `/api/submit`).
5. **Ajustar o pacote sugerido (`calcularPacote` em `scoring.ts`)** — a
   regra que está lá é um ponto de partida razoável, mas vale você
   revisar os limites/faixas com calma, é a parte mais "comercial" da
   lógica.
