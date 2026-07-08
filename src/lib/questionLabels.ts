// Legendas contextuais para cada pergunta no seletor de nota (1-5).
// Cada tupla corresponde a [nota1, nota2, nota3, nota4, nota5].
export const QUESTION_LABELS: Record<string, [string, string, string, string, string]> = {

  // ── ESTRATÉGIA ────────────────────────────────────────────────
  estrategia_participacao_decisoes: [
    "Nunca",        // 1 — RH fica sabendo depois
    "Raramente",    // 2 — chamado de vez em quando
    "Às vezes",     // 3 — depende do tema
    "Frequente",    // 4 — participa da maioria
    "Sempre",       // 5 — está na mesa das decisões
  ],

  estrategia_plano_medio_prazo: [
    "Não existe",   // 1 — zero planejamento
    "Esboçado",     // 2 — ideia, não formalizado
    "Parcial",      // 3 — existe mas incompleto
    "Estruturado",  // 4 — plano real e comunicado
    "Consolidado",  // 5 — revisado e executado
  ],

  estrategia_escala: [
    "Quebraria",    // 1 — sem estrutura nenhuma
    "Sob risco",    // 2 — sofreria muito
    "Com esforço",  // 3 — passaria, mas sofrendo
    "Quase lá",     // 4 — faltam poucos ajustes
    "Aguentaria",   // 5 — RH está pronto
  ],

  estrategia_participacao_pessoas: [
    "Sem critério", // 1 — cada um decide como quer
    "Informal",     // 2 — existe, mas na cabeça
    "Parcial",      // 3 — alguns critérios, não todos
    "Definido",     // 4 — critério existe e é usado
    "Claro",        // 5 — processo transparente
  ],

  // ── PROCESSOS & FLUXOS ────────────────────────────────────────
  p2_documentos_existentes: [
    "Nada",         // 1 — zero documentação
    "Muito pouco",  // 2 — um ou dois documentos
    "Alguns",       // 3 — processos principais cobertos
    "Bastante",     // 4 — maioria documentada
    "Completo",     // 5 — tudo formalizado
  ],

  p2_processo_selecao: [
    "No feeling",   // 1 — sem método definido
    "Informal",     // 2 — existe, mas na cabeça
    "Parcial",      // 3 — algumas etapas definidas
    "Estruturado",  // 4 — processo claro e repetível
    "Padronizado",  // 5 — todos seguem o mesmo método
  ],

  p2_onboarding: [
    "Não existe",   // 1 — cada gestor recebe do seu jeito
    "Básico",       // 2 — checklist simples
    "Parcial",      // 3 — roteiro existe mas incompleto
    "Estruturado",  // 4 — programa definido
    "Completo",     // 5 — imersão planejada e medida
  ],

  p2_dependencia_pessoa_chave: [
    "Para tudo",    // 1 — processo só existe na cabeça dela
    "Difícil",      // 2 — consegue continuar, mas sofrendo
    "Com esforço",  // 3 — funciona com ajuda de outros
    "Quase sim",    // 4 — processo documentado, falta pouco
    "Sobrevive",    // 5 — processo independe de pessoas
  ],

  p2_mudanca_regra: [
    "Nunca",        // 1 — fica só na conversa
    "Raramente",    // 2 — eventualmente anota
    "Às vezes",     // 3 — depende de quem lembra
    "Frequente",    // 4 — quase sempre formaliza
    "Sempre",       // 5 — toda mudança vira procedimento
  ],

  // ── PESSOAS & LIDERANÇA ───────────────────────────────────────
  p1_feedback_rotina: [
    "Não existe",   // 1 — cada gestor faz do seu jeito
    "Raramente",    // 2 — acontece quando tem conflito
    "Às vezes",     // 3 — alguns gestores têm rotina
    "Frequente",    // 4 — maioria tem cadência
    "Estruturado",  // 5 — padrão definido e acompanhado
  ],

  p1_dores_areas: [
    "Não sei",      // 1 — não tenho clareza
    "Suspeito",     // 2 — tenho hipóteses
    "Conheço",      // 3 — sei quais são
    "Monitoro",     // 4 — acompanho com dados
    "Gerencio",     // 5 — tenho plano de ação ativo
  ],

  p1_entrevista_desligamento: [
    "Nunca",        // 1 — não fazemos
    "Raramente",    // 2 — só em casos especiais
    "Às vezes",     // 3 — depende do gestor
    "Frequente",    // 4 — fazemos na maioria
    "Sempre",       // 5 — processo padrão
  ],

  p1_desenvolvimento_promocao: [
    "Só o cargo",   // 1 — título muda, nada mais
    "Muito pouco",  // 2 — orientação básica
    "Parcialmente", // 3 — algum suporte, sem estrutura
    "Bastante",     // 4 — treinamento e acompanhamento
    "Total",        // 5 — programa estruturado de liderança
  ],

  p1_conflitos: [
    "Sem padrão",   // 1 — cada lider age como quer
    "Informal",     // 2 — conversa ad hoc
    "Às vezes",     // 3 — RH entra quando explode
    "Com suporte",  // 4 — RH apoia quando acionado
    "Padronizado",  // 5 — caminho claro e preventivo
  ],

  // ── PERFORMANCE & DADOS ───────────────────────────────────────
  p3_indicadores: [
    "Nenhum",       // 1 — zero métricas
    "1 ou 2",       // 2 — turnover, talvez headcount
    "Alguns",       // 3 — 3-5 indicadores
    "Vários",       // 4 — painel estruturado
    "Dashboard",    // 5 — dados em tempo real
  ],

  p3_conduta_performance: [
    "Ignora",       // 1 — deixa passar
    "Conversa",     // 2 — papo informal, sem registro
    "Às vezes",     // 3 — depende do gestor
    "Plano de ação",// 4 — formaliza e acompanha
    "Processo",     // 5 — protocolo claro e justo
  ],

  p3_metas_criterios: [
    "Não existe",   // 1 — sem metas definidas
    "Informal",     // 2 — expectativas na cabeça do gestor
    "Parcial",      // 3 — algumas funções têm metas
    "Estruturado",  // 4 — maioria dos cargos tem critério
    "Por cargo",    // 5 — cada função tem meta clara
  ],

  p3_indicadores_conectados_negocio: [
    "Nenhum",       // 1 — diretoria não olha RH
    "Isolados",     // 2 — números sem contexto de negócio
    "Alguns",       // 3 — ligados a custo ou headcount
    "Conectados",   // 4 — ligados a metas de negócio
    "Integrados",   // 5 — RH e negócio falam a mesma língua
  ],

  // ── TECNOLOGIA & IA ──────────────────────────────────────────
  tecnologia_ferramentas: [
    "Só planilha",  // 1 — Excel e WhatsApp
    "Básico",       // 2 — 1 ferramenta pontual
    "Algumas",      // 3 — 2-3 ferramentas sem integração
    "Boas tools",   // 4 — ferramentas integradas
    "Integrado",    // 5 — stack completo e conectado
  ],

  tecnologia_ia_uso: [
    "Ninguém",      // 1 — IA é distante
    "Raramente",    // 2 — 1 ou 2 tentativas
    "Alguns",       // 3 — parte do time testa
    "Boa parte",    // 4 — uso frequente por vários
    "Time todo",    // 5 — faz parte da rotina
  ],
};
