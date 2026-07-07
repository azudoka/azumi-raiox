// ══════════════════════════════════════════════════════════════
// Motor de pontuação do Raio-X
// A NOTA é 100% determinística (média das escalas escolhidas pelo
// cliente) — nenhuma IA decide pontuação. O texto de diagnóstico
// vem literalmente da Matriz de Maturidade, costurado com um trecho
// da resposta aberta do cliente pra virar "Evidência Técnica".
// ══════════════════════════════════════════════════════════════

import { PilarId, QUESTIONS, questionsDoBloco } from "./questions";
import { obterNivelMaturidade } from "./matrizMaturidade";

export interface RespostaCliente {
  nota: number; // 1 a 5
  texto: string; // resposta livre (textarea)
}

export type RespostasMap = Record<string, RespostaCliente>;

export interface ResultadoPilar {
  nota: number; // média das 3 perguntas, com 1 casa decimal
  nivel: number; // nível inteiro 1-5 usado na Matriz
  classificacao: string;
  diagnostico: string;
  evidencia: string;
}

export interface ResultadoRaioX {
  pilares: Record<PilarId, ResultadoPilar>;
  tecnologia: { nota: number; resumo: string };
  notaGeral: number; // média dos 4 pilares (SEM tecnologia)
  trilha: "Estruturar RH" | "Fortalecer RH" | "Elevar Nível";
  pacoteSugerido: "Start" | "Ongoing" | "Growth";
}

const PILARES: PilarId[] = ["estrategia", "processos", "pessoas", "performance"];

function media(valores: number[]): number {
  const soma = valores.reduce((a, b) => a + b, 0);
  return Math.round((soma / valores.length) * 10) / 10;
}

// Resume uma resposta longa pra virar "Evidência Técnica" sem citar tudo
// literalmente. MVP: trunca com bom senso; pode evoluir pra reescrita
// leve depois, mas o corte aqui já evita duplicar o texto integral.
function resumirResposta(texto: string, maxChars = 220): string {
  const limpo = texto.trim();
  if (limpo.length <= maxChars) return limpo;
  const cortado = limpo.slice(0, maxChars);
  const ultimoEspaco = cortado.lastIndexOf(" ");
  return cortado.slice(0, ultimoEspaco > 0 ? ultimoEspaco : maxChars) + "…";
}

function calcularPilar(pilar: PilarId, respostas: RespostasMap): ResultadoPilar {
  const perguntas = questionsDoBloco(pilar);
  const notas = perguntas.map((q) => respostas[q.id]?.nota ?? 1);
  const nota = media(notas);
  const { nivel, classificacaoGeral, criterio } = obterNivelMaturidade(pilar, nota);

  // Evidência: usa a resposta da pergunta com a nota mais baixa desse pilar,
  // por ser a mais reveladora do gap.
  const perguntaMaisCritica = perguntas.reduce((pior, atual) => {
    const notaPior = respostas[pior.id]?.nota ?? 1;
    const notaAtual = respostas[atual.id]?.nota ?? 1;
    return notaAtual < notaPior ? atual : pior;
  }, perguntas[0]);
  const textoEvidencia = respostas[perguntaMaisCritica.id]?.texto ?? "";

  return {
    nota,
    nivel,
    classificacao: classificacaoGeral,
    diagnostico: criterio,
    evidencia: resumirResposta(textoEvidencia),
  };
}

function calcularTecnologia(respostas: RespostasMap): { nota: number; resumo: string } {
  const perguntas = questionsDoBloco("tecnologia");
  const notas = perguntas.map((q) => respostas[q.id]?.nota ?? 1);
  const nota = media(notas);
  const textos = perguntas.map((q) => respostas[q.id]?.texto ?? "").filter(Boolean);
  return { nota, resumo: resumirResposta(textos.join(" "), 300) };
}

function calcularTrilha(notaGeral: number): ResultadoRaioX["trilha"] {
  if (notaGeral < 2.5) return "Estruturar RH";
  if (notaGeral < 3.75) return "Fortalecer RH";
  return "Elevar Nível";
}

// Tamanho da empresa manda mais que a nota de maturidade — decisão
// confirmada: empresa grande sempre indica Growth, empresa média
// sempre indica Ongoing, independente da nota. A nota só decide o
// pacote quando a empresa é pequena (1-10 colaboradores).
function calcularPacote(
  notaGeral: number,
  totalColaboradores: string
): ResultadoRaioX["pacoteSugerido"] {
  const faixaGrande = /51-200|201-500|500\+/.test(totalColaboradores);
  const faixaMedia = /11-50/.test(totalColaboradores);

  if (faixaGrande) return "Growth";
  if (faixaMedia) return "Ongoing";
  // faixa pequena (1-10) ou não informado — aqui a nota decide
  return notaGeral < 2 ? "Start" : "Ongoing";
}

export function calcularResultado(
  respostas: RespostasMap,
  totalColaboradores: string
): ResultadoRaioX {
  const pilares = Object.fromEntries(
    PILARES.map((p) => [p, calcularPilar(p, respostas)])
  ) as Record<PilarId, ResultadoPilar>;

  const notaGeral = media(PILARES.map((p) => pilares[p].nota));

  return {
    pilares,
    tecnologia: calcularTecnologia(respostas),
    notaGeral,
    trilha: calcularTrilha(notaGeral),
    pacoteSugerido: calcularPacote(notaGeral, totalColaboradores),
  };
}

// Validação simples: garante que todas as 14 perguntas foram respondidas
// com nota entre 1 e 5 antes de mandar pro motor de pontuação.
export function validarRespostas(respostas: RespostasMap): string | null {
  for (const q of QUESTIONS) {
    const r = respostas[q.id];
    if (!r || typeof r.nota !== "number" || r.nota < 1 || r.nota > 5) {
      return `Resposta inválida ou faltando para a pergunta "${q.id}".`;
    }
  }
  return null;
}
