// ══════════════════════════════════════════════════════════════
// Matriz de Maturidade do RH — Azumi RH (uso interno)
// Fonte: _INTERNO__MATRIZ_DE_MATURIDADE_DO_RH.pdf
// Esta é a régua oficial: a classificação e o texto de diagnóstico
// automático do relatório vêm DAQUI, não são inventados pelo motor.
// ══════════════════════════════════════════════════════════════

import { PilarId } from "./questions";

export interface NivelMaturidade {
  nivel: 1 | 2 | 3 | 4 | 5;
  classificacaoGeral: string; // rótulo geral da escala (mesmo pros 4 pilares)
  criterio: string; // texto específico da dimensão nesse nível
}

// Rótulo geral por nível (Escala de Maturidade do RH — vale pra qualquer dimensão)
export const CLASSIFICACAO_GERAL: Record<number, string> = {
  1: "RH Inexistente ou 100% Operacional",
  2: "RH Parcialmente Estruturado",
  3: "RH Funcional com Atuação Parcial",
  4: "RH Estruturado e Ativo na Gestão",
  5: "RH Estratégico e Parceiro do Negócio",
};

// Critério técnico específico por dimensão e nível (texto literal da Matriz)
export const MATRIZ: Record<PilarId, Record<1 | 2 | 3 | 4 | 5, string>> = {
  estrategia: {
    1: "RH atua apenas sob demanda, sem participação em decisões.",
    2: "RH presente em reuniões, mas com atuação passiva ou sem preparo.",
    3: "RH levanta demandas, mas ainda executa orientações da alta gestão.",
    4: "RH propõe estratégias de desenvolvimento, cultura e estrutura.",
    5: "RH participa ativamente do planejamento estratégico da empresa.",
  },
  processos: {
    1: "RH não possui processos formalizados.",
    2: "Processos existem, mas são inconsistentes e não padronizados.",
    3: "RH com rotinas estáveis: R&S, admissão, folha, desligamento.",
    4: "RH com processos robustos: T&D, clima, endomarketing, avaliações.",
    5: "RH com revisão contínua de processos, auditoria interna e automações.",
  },
  pessoas: {
    1: "Não há gestão ativa de pessoas.",
    2: "RH atua de forma reativa, sem plano de desenvolvimento ou liderança ativa.",
    3: "RH realiza ações pontuais de T&D, feedback e integração.",
    4: "Existe trilha de desenvolvimento e plano de sucessão.",
    5: "Cultura de desenvolvimento contínuo e protagonismo disseminada.",
  },
  performance: {
    1: "Nenhum dado ou indicador de RH é acompanhado.",
    2: "Alguns dados existem, mas são pouco utilizados.",
    3: "RH utiliza indicadores básicos: turnover, absenteísmo, custos.",
    4: "Indicadores são acompanhados, analisados e reportados com frequência.",
    5: "RH orientado por dados: metas, dashboards, decisões baseadas em evidências.",
  },
};

// Arredonda uma nota (média, pode vir com decimais) pro nível inteiro mais
// próximo da escala 1-5, sempre dentro dos limites.
export function arredondarNivel(notaMedia: number): 1 | 2 | 3 | 4 | 5 {
  const n = Math.round(notaMedia);
  return Math.min(5, Math.max(1, n)) as 1 | 2 | 3 | 4 | 5;
}

export function obterNivelMaturidade(pilar: PilarId, notaMedia: number): NivelMaturidade {
  const nivel = arredondarNivel(notaMedia);
  return {
    nivel,
    classificacaoGeral: CLASSIFICACAO_GERAL[nivel],
    criterio: MATRIZ[pilar][nivel],
  };
}
