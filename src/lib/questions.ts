// ══════════════════════════════════════════════════════════════
// Banco de perguntas do Raio-X de Maturidade
// 4 pilares (espelham a Matriz de Maturidade do RH) + 1 bloco de
// Tecnologia/IA que NÃO entra na nota geral.
// Cada pergunta tem: escala 1-5 (nota) + textarea (evidência).
// ══════════════════════════════════════════════════════════════

export type PilarId = "estrategia" | "processos" | "pessoas" | "performance";
export type BlocoId = PilarId | "tecnologia";

export interface Question {
  id: string;
  bloco: BlocoId;
  ordem: "A" | "B" | "C";
  texto: string;
  hint?: string;
  placeholder: string;
}

export const PILARES_LABEL: Record<PilarId, string> = {
  estrategia: "Estratégia",
  processos: "Processos & Fluxos",
  pessoas: "Pessoas & Liderança",
  performance: "Performance & Dados",
};

export const BLOCOS_LABEL: Record<BlocoId, string> = {
  ...PILARES_LABEL,
  tecnologia: "Maturidade Digital & IA",
};

// Ordem de exibição no wizard (um passo por bloco)
export const ORDEM_BLOCOS: BlocoId[] = [
  "estrategia",
  "processos",
  "pessoas",
  "performance",
  "tecnologia",
];

export const QUESTIONS: Question[] = [
  // ── ESTRATÉGIA (novo) ──────────────────────────────────────
  {
    id: "estrategia_participacao_decisoes",
    bloco: "estrategia",
    ordem: "A",
    texto: "O RH participa das decisões estratégicas da empresa, ou só fica sabendo depois que já foi decidido?",
    hint: "Ex: reestruturação, novo produto, corte de custos — o RH senta na mesa antes ou é avisado no final?",
    placeholder: "Descreva como isso funciona na prática hoje.",
  },
  {
    id: "estrategia_plano_medio_prazo",
    bloco: "estrategia",
    ordem: "B",
    texto: "Existe algum plano de médio prazo pra área de pessoas (crescimento do time, sucessão, estrutura futura), ou tudo é resolvido conforme a necessidade aparece?",
    placeholder: "Se não existe plano, escreva 'não existe' — isso já é uma informação relevante.",
  },
  {
    id: "estrategia_escala",
    bloco: "estrategia",
    ordem: "C",
    texto: "Se a empresa dobrasse de tamanho amanhã, o RH de hoje aguentaria o tranco, ou quebraria?",
    placeholder: "Seja honesto: o que quebraria primeiro?",
  },

  // ── PROCESSOS & FLUXOS (já existente no formulário atual) ───
  {
    id: "p2_documentos_existentes",
    bloco: "processos",
    ordem: "A",
    texto: 'O que você tem de "preto no branco" hoje?',
    hint: "Manual de conduta, fluxo de admissão, regras de férias, processo de desligamento…",
    placeholder: "Liste o que existe documentado, mesmo que não seja aplicado formalmente no dia a dia.",
  },
  {
    id: "p2_processo_selecao",
    bloco: "processos",
    ordem: "B",
    texto: 'Como vocês fecham uma vaga hoje? Existe um método padrão ou é no "feeling"?',
    placeholder: "Descreva as etapas: onde divulgam, quem entrevista, como decidem, qual o prazo médio…",
  },
  {
    id: "p2_onboarding",
    bloco: "processos",
    ordem: "C",
    texto: "Como é o onboarding de um novo colaborador? Existe um roteiro de integração estruturado ou cada gestor recebe à sua maneira?",
    placeholder: "Descreva o que acontece nos primeiros 30 dias.",
  },

  // ── PESSOAS & LIDERANÇA (já existente no formulário atual) ──
  {
    id: "p1_feedback_rotina",
    bloco: "pessoas",
    ordem: "A",
    texto: "Seus gestores têm uma rotina de feedback e 1:1, ou cada um decide e cobra do seu jeito?",
    hint: "Existe cadência definida, periodicidade, algum padrão mínimo?",
    placeholder: "Descreva como funciona hoje na prática.",
  },
  {
    id: "p1_dores_areas",
    bloco: "pessoas",
    ordem: "B",
    texto: "Quais são as 2 áreas que mais te dão dor de cabeça hoje?",
    hint: "Conflitos, rotatividade, falta de braço técnico…",
    placeholder: "Ex: Comercial tem alta rotatividade; TI sofre com ausência de liderança técnica…",
  },
  {
    id: "p1_entrevista_desligamento",
    bloco: "pessoas",
    ordem: "C",
    texto: "Quando um colaborador sai da empresa, vocês fazem entrevista de desligamento? O que costuma ser apontado como motivo de saída?",
    placeholder: "Se não fazem entrevista de desligamento, escreva 'não fazemos'.",
  },

  // ── PERFORMANCE & DADOS (já existente no formulário atual) ──
  {
    id: "p3_indicadores",
    bloco: "performance",
    ordem: "A",
    texto: "Quais números sobre o time você olha hoje — ou gostaria de olhar?",
    hint: "Ex: turnover, custo de vaga, produtividade.",
    placeholder: "Se não acompanha nenhum indicador agora, escreva 'nenhum'.",
  },
  {
    id: "p3_conduta_performance",
    bloco: "performance",
    ordem: "B",
    texto: "Quando alguém não entrega o esperado, qual é a conduta real da empresa?",
    hint: 'Plano de ação, conversa técnica, ou "deixa passar"?',
    placeholder: "Seja honesto sobre o que realmente acontece, não o que deveria acontecer.",
  },
  {
    id: "p3_metas_criterios",
    bloco: "performance",
    ordem: "C",
    texto: "Existe alguma meta ou critério claro de performance definido por cargo?",
    hint: "Os colaboradores sabem exatamente o que é esperado deles em termos de resultado?",
    placeholder: "Ex: existe OKR, meta de vendas, indicadores por área?",
  },

  // ── TECNOLOGIA / IA (novo — bloco à parte, não conta na nota geral) ──
  {
    id: "tecnologia_ferramentas",
    bloco: "tecnologia",
    ordem: "A",
    texto: "Hoje vocês usam alguma ferramenta ou sistema pra gestão de pessoas (folha, ponto, recrutamento, avaliação), ou é tudo planilha e WhatsApp?",
    placeholder: "Liste o que usam, mesmo que seja só planilha.",
  },
  {
    id: "tecnologia_ia_uso",
    bloco: "tecnologia",
    ordem: "B",
    texto: "Alguém no time já testou ou usa IA no dia a dia (elaborar textos, triagem de currículo, análise de dados, etc.)? Como isso é visto por aí?",
    hint: "Já necessário, curiosidade, ou ainda distante da realidade da empresa?",
    placeholder: "Descreva o nível de familiaridade do time com essas ferramentas.",
  },
];

export function questionsDoBloco(bloco: BlocoId): Question[] {
  return QUESTIONS.filter((q) => q.bloco === bloco).sort((a, b) => a.ordem.localeCompare(b.ordem));
}
