import fs from "fs";
import path from "path";
import { ResultadoRaioX } from "./scoring";
import { PILARES_LABEL, PilarId } from "./questions";

function lerLogoBase64(arquivo: string): string {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public", arquivo));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

// Lido uma vez por processo (cache de módulo)
const LOGO_DARK_SRC = lerLogoBase64("logo-azumi-dark.png");   // branca — para fundos escuros (header/footer do PDF)
const LOGO_LIGHT_SRC = lerLogoBase64("logo-azumi-light.png"); // colorida — para fundos claros

export interface DadosRelatorio {
  protocolo: string;
  empresa: string;
  segmento?: string;
  referencia: string;
  sumarioExecutivo: string;
  prioridades: { titulo: string; descricao: string }[];
  parecer: string;
  modeloRecomendado: string;
  trilhaIndicada: string;
  ofertaTexto: string;
  ofertaValidade: string;
  resultado: ResultadoRaioX;
}

const ORDEM_PILARES_RELATORIO: PilarId[] = ["estrategia", "processos", "pessoas", "performance"];

function romano(n: number): string {
  return ["I", "II", "III", "IV"][n - 1] || String(n);
}

function blocoPilar(pilar: PilarId, resultado: ResultadoRaioX, indice: number): string {
  const p = resultado.pilares[pilar];
  const dotsAtivos = p.nivel;
  const dots = Array.from({ length: 5 }, (_, i) =>
    `<div class="r-dot${i < dotsAtivos ? " active" : ""}"></div>`
  ).join("");

  return `
    <div class="r-pilar">
      <div class="r-pilar-head">
        <div class="r-pilar-name">${romano(indice)}. ${PILARES_LABEL[pilar].toUpperCase()}</div>
        <div class="r-pilar-level">
          <div class="r-level-dots">${dots}</div>
          <span class="r-level-label">Nível ${p.nivel}/5 — ${p.classificacao}</span>
        </div>
      </div>
      <div class="r-pilar-body">
        <div class="r-pilar-row"><div class="r-pilar-row-label">Diagnóstico</div><div class="r-pilar-row-text">${p.diagnostico}</div></div>
        <div class="r-pilar-row"><div class="r-pilar-row-label">Evidência Técnica</div><div class="r-pilar-row-text">${p.evidencia || "—"}</div></div>
      </div>
    </div>`;
}

function blocoTecnologia(resultado: ResultadoRaioX): string {
  const t = resultado.tecnologia;
  return `
    <div class="r-section">
      <div class="r-sec-title">Maturidade Digital &amp; IA</div>
      <div class="r-pilar" style="border-color:#034C8B">
        <div class="r-pilar-head">
          <div class="r-pilar-name">USO DE TECNOLOGIA E IA</div>
          <div class="r-pilar-level"><span class="r-level-label">Nível ${t.nota}/5</span></div>
        </div>
        <div class="r-pilar-body">
          <div class="r-pilar-row"><div class="r-pilar-row-text">${t.resumo || "Sem informações complementares."}</div></div>
        </div>
      </div>
      <p class="r-nota-rodape">
        Este bloco reflete o compromisso da Azumi RH em avaliar não só processos de pessoas, mas também a maturidade tecnológica da operação — não entra na nota geral dos 4 pilares.
      </p>
    </div>`;
}

export function gerarHtmlRelatorio(d: DadosRelatorio): string {
  const pilaresHtml = ORDEM_PILARES_RELATORIO.map((p, i) => blocoPilar(p, d.resultado, i + 1)).join("\n");
  const prioridadesHtml = d.prioridades
    .map(
      (pr, i) => `
      <div class="r-priority">
        <div class="r-priority-num">${i + 1}</div>
        <div><div class="r-priority-name">${pr.titulo}</div><div class="r-priority-text">${pr.descricao}</div></div>
      </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Raio-X ${d.protocolo}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400&family=Sora:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
:root{
  --ocean:#031D38;--blue:#034C8B;--blue2:#3B82F6;--ice:#93C5FD;
  --gray:#778082;--border:#EDEDED;--text:#222222;
  --gm:linear-gradient(135deg,#031D38 0%,#034C8B 55%,#3B82F6 100%);
  --gh:linear-gradient(135deg,#031D38 0%,#034C8B 55%,#3B82F6 100%);
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Space Grotesk',sans-serif;background:#DDE5F0;color:var(--text)}
.logo-dark .logo-azumi{font-family:'Poppins',sans-serif;font-weight:600;color:#fff}
.logo-dark .logo-rh{font-family:'Poppins',sans-serif;font-style:italic;font-weight:400;color:#93C5FD;margin-left:1px}
.paper{width:794px;min-height:1123px;background:#fff;margin:0 auto}
.r-hero{background:var(--gh);position:relative;padding:38px 48px 34px;overflow:hidden}
.r-hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#031D38,#034C8B,#3B82F6)}
.r-logo{display:inline-flex;align-items:center;gap:9px;margin-bottom:22px;font-size:26px}
.r-doc-title{font-family:'Sora',sans-serif;font-weight:800;font-size:17px;color:#fff;margin-bottom:20px;text-transform:uppercase}
.r-meta-grid{display:grid;grid-template-columns:repeat(3,auto);gap:6px 28px}
.r-meta-label{font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:600;text-transform:uppercase;color:rgba(147,197,253,.75);margin-bottom:2px}
.r-meta-value{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;color:#fff}
.r-body{padding:34px 48px 46px}
.r-section{margin-bottom:26px}
.r-sec-title{font-family:'Sora',sans-serif;font-weight:800;font-size:12px;color:var(--blue);text-transform:uppercase;margin-bottom:10px;padding-bottom:7px;border-bottom:2px solid #3B82F6}
.r-summary-text{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:300;line-height:1.85}
.r-pilares-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.r-pilar{border:1px solid var(--border);border-radius:10px;overflow:hidden}
.r-pilar-head{background:var(--gh);padding:10px 14px;display:flex;flex-direction:column;gap:6px}
.r-pilar-name{font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:#fff}
.r-pilar-level{display:flex;align-items:center;gap:6px}
.r-level-dots{display:flex;gap:3px}
.r-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.2)}
.r-dot.active{background:var(--ice)}
.r-level-label{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:500;color:rgba(255,255,255,.85)}
.r-pilar-body{padding:12px 14px}
.r-pilar-row{margin-bottom:9px}
.r-pilar-row:last-child{margin-bottom:0}
.r-pilar-row-label{font-family:'Space Grotesk',sans-serif;font-size:9.5px;font-weight:700;text-transform:uppercase;color:var(--blue)}
.r-pilar-row-text{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:300;color:var(--text);line-height:1.65}
.r-nota-rodape{font-family:'Space Grotesk',sans-serif;font-size:11px;color:#778082;font-style:italic;margin-top:8px}
.r-priorities{display:flex;flex-direction:column;gap:10px}
.r-priority{display:flex;gap:14px;align-items:flex-start;background:#F4F7FC;border:1px solid var(--border);border-radius:10px;padding:12px 14px}
.r-priority-num{width:28px;height:28px;background:var(--gm);color:#fff;border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-weight:800;font-size:12px;flex-shrink:0}
.r-priority-name{font-family:'Sora',sans-serif;font-size:11px;font-weight:700;color:var(--ocean);text-transform:uppercase;margin-bottom:3px}
.r-priority-text{font-family:'Space Grotesk',sans-serif;font-size:12.5px;font-weight:300;line-height:1.65}
.r-parecer-box{background:var(--gh);border-radius:10px;padding:18px 20px;margin-bottom:14px}
.r-parecer-box p{font-family:'Space Grotesk',sans-serif;font-size:12.5px;font-weight:300;color:rgba(255,255,255,.9);line-height:1.75}
.r-model-row{display:flex;gap:12px;margin-bottom:8px}
.r-model-badge{background:#F4F7FC;border:1px solid var(--border);border-radius:8px;padding:10px 14px;flex:1}
.r-model-badge-label{font-family:'Space Grotesk',sans-serif;font-size:9.5px;font-weight:700;text-transform:uppercase;color:var(--blue)}
.r-model-badge-val{font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:var(--ocean)}
.r-oferta{background:var(--gh);border-radius:10px;padding:18px 20px}
.r-oferta-title{font-family:'Sora',sans-serif;font-size:11px;font-weight:700;color:var(--ice);text-transform:uppercase;margin-bottom:8px}
.r-oferta p{font-family:'Space Grotesk',sans-serif;font-size:12.5px;font-weight:300;color:rgba(255,255,255,.9);line-height:1.7;margin-bottom:10px}
.r-oferta-badge{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);color:#fff;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600;padding:5px 16px;border-radius:100px}
.r-footer{background:var(--gh);padding:20px 48px;display:flex;align-items:center;justify-content:space-between}
.rf-contact{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:300;color:rgba(255,255,255,.7);text-align:right;line-height:1.6}
.rf-tagline{font-family:'Space Grotesk',sans-serif;font-size:10px;font-style:italic;color:rgba(147,197,253,.6);margin-top:2px}
@page{margin:0;size:A4}
</style>
</head>
<body>
  <div class="paper">
    <div class="r-hero">
      <img src="${LOGO_DARK_SRC}" alt="Azumi RH" style="height:42px;width:auto;object-fit:contain;display:block;margin-bottom:22px">
      <div class="r-doc-title">Relatório de Diagnóstico | Raio-X : Maturidade do Capital Humano</div>
      <div class="r-meta-grid">
        <div><div class="r-meta-label">Empresa</div><div class="r-meta-value">${d.empresa}</div></div>
        <div><div class="r-meta-label">Elaborado por</div><div class="r-meta-value">Azumi RH — Inteligência Estratégica</div></div>
        <div><div class="r-meta-label">Referência</div><div class="r-meta-value">${d.referencia}</div></div>
        <div style="margin-top:6px"><div class="r-meta-label">Código do Documento</div><div class="r-meta-value">${d.protocolo}</div></div>
        <div style="margin-top:6px"><div class="r-meta-label">Segmento</div><div class="r-meta-value">${d.segmento || "—"}</div></div>
        <div style="margin-top:6px"><div class="r-meta-label">Nota Geral</div><div class="r-meta-value">${d.resultado.notaGeral}/5</div></div>
      </div>
    </div>

    <div class="r-body">
      <div class="r-section">
        <div class="r-sec-title">1. Sumário Executivo</div>
        <p class="r-summary-text">${d.sumarioExecutivo}</p>
      </div>

      <div class="r-section">
        <div class="r-sec-title">2. Análise por Pilar Estratégico</div>
        <div class="r-pilares-grid">${pilaresHtml}</div>
      </div>

      ${blocoTecnologia(d.resultado)}

      <div class="r-section">
        <div class="r-sec-title">3. Diretrizes de Intervenção — Top 3 Prioridades</div>
        <div class="r-priorities">${prioridadesHtml}</div>
      </div>

      <div class="r-section">
        <div class="r-sec-title">4. Parecer Técnico e Recomendação</div>
        <div class="r-parecer-box"><p>${d.parecer}</p></div>
        <div class="r-model-row">
          <div class="r-model-badge">
            <div class="r-model-badge-label">Modelo Recomendado (Azumi RH)</div>
            <div class="r-model-badge-val">${d.modeloRecomendado}</div>
          </div>
          <div class="r-model-badge">
            <div class="r-model-badge-label">Trilha Indicada</div>
            <div class="r-model-badge-val">${d.trilhaIndicada}</div>
          </div>
        </div>
      </div>

      <div class="r-section">
        <div class="r-oferta">
          <div class="r-oferta-title">⭐ Oferta Exclusiva</div>
          <p>${d.ofertaTexto}</p>
          <span class="r-oferta-badge">Válido por ${d.ofertaValidade}</span>
        </div>
      </div>

      <div style="margin-top:16px;padding-top:12px;border-top:1px solid #EDEDED">
        <p style="font-family:'Space Grotesk',sans-serif;font-size:10px;color:#778082;line-height:1.7;font-style:italic">
          AVISO LEGAL: Este documento contém informações estratégicas e confidenciais fundamentadas na metodologia proprietária da Azumi RH. A eficácia das sugestões depende da implementação rigorosa e do acompanhamento contínuo dos rituais propostos.
        </p>
      </div>
    </div>

    <div class="r-footer">
      <img src="${LOGO_DARK_SRC}" alt="Azumi RH" style="height:32px;width:auto;object-fit:contain;display:block">
      <div>
        <div class="rf-contact">(41) 98835-0743 · contato@azumirh.com.br · azumirh.com.br</div>
        <div class="rf-tagline">Cuidar de pessoas é estratégico.</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
