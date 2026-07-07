import { ResultadoRaioX } from "./scoring";
import { PILARES_LABEL, PilarId } from "./questions";
import { DadosRelatorio } from "./reportTemplate";

const ORDEM: PilarId[] = ["estrategia", "processos", "pessoas", "performance"];

// Título curto de "prioridade" por pilar, usado no bloco Top 3.
const TITULO_PRIORIDADE: Record<PilarId, string> = {
  estrategia: "GOVERNANÇA ESTRATÉGICA DO RH",
  processos: "PADRONIZAÇÃO OPERACIONAL",
  pessoas: "ROTINA DE LIDERANÇA E DESENVOLVIMENTO",
  performance: "GESTÃO POR INDICADORES",
};

function gerarSumario(empresa: string, resultado: ResultadoRaioX): string {
  const piorPilar = ORDEM.reduce((pior, atual) =>
    resultado.pilares[atual].nota < resultado.pilares[pior].nota ? atual : pior
  );
  const melhorPilar = ORDEM.reduce((melhor, atual) =>
    resultado.pilares[atual].nota > resultado.pilares[melhor].nota ? atual : melhor
  );

  return (
    `O presente diagnóstico mensura o nível de maturidade da área de Recursos Humanos da ${empresa} ` +
    `a partir de quatro pilares estratégicos: Estratégia, Processos & Fluxos, Pessoas & Liderança e Performance & Dados. ` +
    `A nota geral identificada foi de ${resultado.notaGeral}/5. ` +
    `O pilar com maior maturidade hoje é ${PILARES_LABEL[melhorPilar]} (${resultado.pilares[melhorPilar].nota}/5), ` +
    `enquanto ${PILARES_LABEL[piorPilar]} (${resultado.pilares[piorPilar].nota}/5) representa a maior oportunidade de evolução imediata. ` +
    `As seções a seguir detalham o diagnóstico por pilar e as diretrizes de intervenção recomendadas pela Azumi RH.`
  );
}

function gerarTop3Prioridades(resultado: ResultadoRaioX): { titulo: string; descricao: string }[] {
  const ordenado = [...ORDEM].sort((a, b) => resultado.pilares[a].nota - resultado.pilares[b].nota);
  const top3 = ordenado.slice(0, 3);
  return top3.map((pilar) => ({
    titulo: TITULO_PRIORIDADE[pilar],
    descricao: `${resultado.pilares[pilar].diagnostico} Recomenda-se priorizar ações estruturantes neste pilar nos próximos ciclos.`,
  }));
}

function gerarParecer(resultado: ResultadoRaioX): string {
  const base =
    `Considerando a nota geral de ${resultado.notaGeral}/5 identificada nos quatro pilares avaliados, ` +
    `a Azumi RH recomenda a trilha de ${resultado.trilha}. `;

  const complemento: Record<ResultadoRaioX["trilha"], string> = {
    "Estruturar RH":
      "A prioridade neste momento é estabelecer processos e rotinas mínimas de RH, criando uma base sólida antes de avançar para iniciativas mais sofisticadas.",
    "Fortalecer RH":
      "A empresa já possui uma base operacional, mas precisa consolidar processos e aproximar o RH das decisões estratégicas do negócio.",
    "Elevar Nível":
      "A empresa já opera com maturidade relevante e o próximo passo é refinar governança, dados e cultura para consolidar o RH como parceiro estratégico pleno.",
  };

  return base + complemento[resultado.trilha];
}

function gerarModeloRecomendado(pacote: ResultadoRaioX["pacoteSugerido"]): string {
  const nomes: Record<ResultadoRaioX["pacoteSugerido"], string> = {
    Start: "HR-as-a-Service — Pacote START",
    Ongoing: "HR-as-a-Service — Pacote ONGOING",
    Growth: "HR-as-a-Service — Pacote GROWTH",
  };
  return nomes[pacote];
}

export function montarDadosRelatorio(params: {
  protocolo: string;
  empresa: string;
  segmento?: string;
  resultado: ResultadoRaioX;
}): DadosRelatorio {
  const { protocolo, empresa, segmento, resultado } = params;
  const hoje = new Date();
  const referencia = `${["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"][hoje.getMonth()]}/${hoje.getFullYear()}`;

  return {
    protocolo,
    empresa,
    segmento,
    referencia,
    sumarioExecutivo: gerarSumario(empresa, resultado),
    prioridades: gerarTop3Prioridades(resultado),
    parecer: gerarParecer(resultado),
    modeloRecomendado: gerarModeloRecomendado(resultado.pacoteSugerido),
    trilhaIndicada: `Trilha de ${resultado.trilha.toUpperCase()}`,
    ofertaTexto: `Na contratação do ${gerarModeloRecomendado(resultado.pacoteSugerido)}, a Azumi RH inclui, sem custo adicional, uma sessão de leitura aprofundada deste Raio-X com a equipe de liderança.`,
    ofertaValidade: "20 dias corridos",
    resultado,
  };
}
