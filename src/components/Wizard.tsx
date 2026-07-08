"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BLOCOS_LABEL, ORDEM_BLOCOS, questionsDoBloco } from "@/lib/questions";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";

interface RespostaEstado {
  [questionId: string]: { nota: number | null; texto: string };
}

interface DadosContato {
  nomeResponsavel: string;
  empresa: string;
  email: string;
  whatsapp: string;
  totalColaboradores: string;
  principaisAreas: string;
  contratacoes6m: string;
  desligamentos6m: string;
  momentoEmpresa: string;
  juniorNoRH: string;
}

const TOTAL_ETAPAS = ORDEM_BLOCOS.length + 1;

const FAIXAS_COLABORADORES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const FAIXAS_MOVIMENTACAO = ["0", "1-5", "6-10", "11-20", "Mais de 20"];
const OPCOES_MOMENTO_EMPRESA = [
  "Estamos contratando bastante e crescendo rápido",
  "Temos o time há um tempo, mas cultura/rotina não acompanhou o crescimento",
  "Um pouco dos dois",
];
const OPCOES_JUNIOR_RH = ["Nenhum", "1-2", "3-5", "Mais de 5"];

const PILARES_INTRO = [
  { label: "Estratégia", desc: "O RH está na mesa das decisões ou só sabe depois?" },
  { label: "Processos & Fluxos", desc: "O que está documentado? O que só existe na cabeça de alguém?" },
  { label: "Pessoas & Liderança", desc: "Como gestores e times se desenvolvem na sua empresa?" },
  { label: "Performance & Dados", desc: "Quais números de pessoas a diretoria realmente acompanha?" },
  { label: "Tecnologia & IA", desc: "Bônus: como ferramentas e IA entram na equação do RH?" },
];

export function Wizard() {
  const router = useRouter();
  const [etapa, setEtapa] = useState(0);
  const [perguntaIndex, setPerguntaIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [respostas, setRespostas] = useState<RespostaEstado>({});
  const [contato, setContato] = useState<DadosContato>({
    nomeResponsavel: "",
    empresa: "",
    email: "",
    whatsapp: "",
    totalColaboradores: "",
    principaisAreas: "",
    contratacoes6m: "",
    desligamentos6m: "",
    momentoEmpresa: "",
    juniorNoRH: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const blocoAtual = etapa >= 1 && etapa <= ORDEM_BLOCOS.length ? ORDEM_BLOCOS[etapa - 1] : null;
  const perguntasDoBloco = useMemo(
    () => (blocoAtual ? questionsDoBloco(blocoAtual) : []),
    [blocoAtual]
  );

  function atualizarResposta(id: string, campo: "nota" | "texto", valor: number | string) {
    setRespostas((prev) => ({
      ...prev,
      [id]: {
        nota: campo === "nota" ? (valor as number) : prev[id]?.nota ?? null,
        texto: campo === "texto" ? (valor as string) : prev[id]?.texto ?? "",
      },
    }));
  }

  function blocoCompleto(): boolean {
    if (!blocoAtual) return true;
    return perguntasDoBloco.every((q) => respostas[q.id]?.nota != null);
  }

  function contatoCompleto(): boolean {
    return (
      !!contato.nomeResponsavel &&
      !!contato.empresa &&
      !!contato.email &&
      contato.whatsapp.replace(/\D/g, "").length >= 10 &&
      !!contato.totalColaboradores &&
      !!contato.momentoEmpresa &&
      !!contato.juniorNoRH
    );
  }

  function irPara(novaEtapa: number) {
    setEtapa(novaEtapa);
    setPerguntaIndex(0);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function avancar() {
    if (etapa === 0) {
      irPara(1);
      return;
    }
    if (isMobile && blocoAtual && perguntaIndex < perguntasDoBloco.length - 1) {
      setPerguntaIndex((p) => p + 1);
      setAnimKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (etapa <= ORDEM_BLOCOS.length) {
      irPara(etapa + 1);
      return;
    }
    await enviar();
  }

  function voltar() {
    if (isMobile && blocoAtual && perguntaIndex > 0) {
      setPerguntaIndex((p) => p - 1);
      setAnimKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    irPara(Math.max(0, etapa - 1));
  }

  function onWhatsappChange(valor: string) {
    const apenasDigitos = valor.replace(/\D/g, "").slice(0, 11);
    let formatado = apenasDigitos;
    if (apenasDigitos.length > 2) {
      formatado = `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}${apenasDigitos.length > 7 ? "-" + apenasDigitos.slice(7) : ""}`;
    }
    setContato((c) => ({ ...c, whatsapp: formatado }));
  }

  async function enviar() {
    setErro(null);
    setEnviando(true);

    const respostasFormatadas = Object.fromEntries(
      Object.entries(respostas).map(([id, r]) => [id, { nota: r.nota ?? 1, texto: r.texto }])
    );

    try {
      const resp = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contato, respostas: respostasFormatadas }),
      });

      if (!resp.ok) {
        const erroBody = await resp.json().catch(() => ({}));
        throw new Error(erroBody.erro || "Falha ao enviar o diagnóstico.");
      }

      const data = await resp.json();
      sessionStorage.setItem("raiox_resultado", JSON.stringify(data));
      router.push(`/obrigado?protocolo=${data.protocolo}`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado ao enviar.");
    } finally {
      setEnviando(false);
    }
  }

  // podeAvancar
  let podeAvancar: boolean;
  if (etapa === 0) {
    podeAvancar = true;
  } else if (isMobile && blocoAtual) {
    const q = perguntasDoBloco[perguntaIndex];
    podeAvancar = q ? respostas[q.id]?.nota != null : false;
  } else if (blocoAtual) {
    podeAvancar = blocoCompleto();
  } else {
    podeAvancar = contatoCompleto();
  }

  const labelEtapaAtual = blocoAtual ? BLOCOS_LABEL[blocoAtual] : "Seus Dados";

  let textoBotao: string;
  if (enviando) {
    textoBotao = "Gerando seu relatório…";
  } else if (etapa === 0) {
    textoBotao = "Estou pronto(a) →";
  } else if (isMobile && blocoAtual && perguntaIndex < perguntasDoBloco.length - 1) {
    textoBotao = "Próxima →";
  } else if (etapa <= ORDEM_BLOCOS.length) {
    textoBotao = "Avançar →";
  } else {
    textoBotao = "Gerar meu Raio-X →";
  }

  const voltarDisabled = etapa === 0 || enviando;

  // ── Tela de intro (etapa 0) ──────────────────────────────────
  if (etapa === 0) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 100px" }}>
        <div
          key={animKey}
          className="fade-slide-in"
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "44px 48px",
            boxShadow: "0 8px 40px rgba(3,29,56,.07)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(59,130,246,.07)",
              border: "1px solid rgba(59,130,246,.18)",
              color: "var(--blue)",
              fontFamily: "var(--font-sora)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: 100,
              marginBottom: 24,
            }}
          >
            Diagnóstico Gratuito
          </div>

          <h1
            style={{
              fontFamily: "var(--font-sora)",
              fontWeight: 800,
              fontSize: "clamp(24px, 4vw, 32px)",
              color: "var(--ocean)",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            Bem-vinda ao Raio-X de{" "}
            <span
              style={{
                background: "var(--gm)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Maturidade
            </span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: 15,
              fontWeight: 300,
              color: "var(--gray-500)",
              lineHeight: 1.8,
              marginBottom: 36,
              maxWidth: 560,
            }}
          >
            Este diagnóstico mapeia como o RH da sua empresa funciona <em>hoje</em> — sem julgamentos,
            sem respostas certas ou erradas. São <strong style={{ color: "var(--text)", fontWeight: 500 }}>20 perguntas</strong> organizadas em 5 pilares.
            Leva cerca de <strong style={{ color: "var(--text)", fontWeight: 500 }}>10 minutos</strong> e ao final você recebe um relatório completo em PDF, na hora.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 40,
            }}
          >
            {PILARES_INTRO.map((pilar, i) => (
              <div
                key={pilar.label}
                style={{
                  background: "var(--offwhite)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  gridColumn: i === 4 ? "1 / -1" : undefined,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-sora)",
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "var(--ocean)",
                    marginBottom: 4,
                  }}
                >
                  {pilar.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-poppins)",
                    fontSize: 12,
                    fontWeight: 300,
                    color: "var(--gray-500)",
                    lineHeight: 1.6,
                  }}
                >
                  {pilar.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => irPara(1)}
              style={{
                padding: "16px 44px",
                borderRadius: 100,
                border: "none",
                background: "var(--gm)",
                color: "#fff",
                fontFamily: "var(--font-sora)",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(59,130,246,.3)",
                transition: "transform .2s ease, box-shadow .2s ease",
              }}
            >
              Estou pronto(a) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Questionário (etapas 1-N+1) ──────────────────────────────
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px 100px" }}>
      <ProgressBar etapaAtual={etapa} totalEtapas={TOTAL_ETAPAS} labelEtapa={labelEtapaAtual} />

      <div
        key={animKey}
        className="fade-slide-in"
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "36px 40px",
          boxShadow: "0 8px 32px rgba(3,29,56,.06)",
          border: "1px solid var(--border)",
        }}
      >
        {blocoAtual && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-sora)",
                fontWeight: 800,
                fontSize: 20,
                color: "var(--ocean)",
                marginBottom: 4,
              }}
            >
              {BLOCOS_LABEL[blocoAtual]}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: 13,
                fontWeight: 300,
                color: "var(--gray-500)",
                marginBottom: 28,
              }}
            >
              Responda com a nota que melhor descreve a realidade de hoje.
            </p>

            {isMobile ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-poppins)",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--gray-500)",
                      letterSpacing: 0.5,
                    }}
                  >
                    Pergunta {perguntaIndex + 1} de {perguntasDoBloco.length}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {perguntasDoBloco.map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: i === perguntaIndex ? "var(--blue)" : i < perguntaIndex ? "var(--blue2)" : "var(--border)",
                          transition: "background .2s",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <QuestionCard
                  key={perguntasDoBloco[perguntaIndex]?.id}
                  question={perguntasDoBloco[perguntaIndex]}
                  nota={respostas[perguntasDoBloco[perguntaIndex]?.id]?.nota ?? null}
                  texto={respostas[perguntasDoBloco[perguntaIndex]?.id]?.texto ?? ""}
                  onNotaChange={(nota) => atualizarResposta(perguntasDoBloco[perguntaIndex].id, "nota", nota)}
                  onTextoChange={(texto) => atualizarResposta(perguntasDoBloco[perguntaIndex].id, "texto", texto)}
                />
              </div>
            ) : (
              perguntasDoBloco.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  nota={respostas[q.id]?.nota ?? null}
                  texto={respostas[q.id]?.texto ?? ""}
                  onNotaChange={(nota) => atualizarResposta(q.id, "nota", nota)}
                  onTextoChange={(texto) => atualizarResposta(q.id, "texto", texto)}
                />
              ))
            )}
          </div>
        )}

        {!blocoAtual && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-sora)",
                fontWeight: 800,
                fontSize: 20,
                color: "var(--ocean)",
                marginBottom: 4,
              }}
            >
              Últimos dados para gerar seu relatório
            </h2>
            <p
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: 13,
                fontWeight: 300,
                color: "var(--gray-500)",
                marginBottom: 28,
              }}
            >
              É pra onde enviamos o link do seu Raio-X e, se quiser, conversamos sobre os resultados.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Campo label="Nome do Responsável" value={contato.nomeResponsavel} onChange={(v) => setContato({ ...contato, nomeResponsavel: v })} />
              <Campo label="Empresa" value={contato.empresa} onChange={(v) => setContato({ ...contato, empresa: v })} />
              <Campo label="E-mail Corporativo" value={contato.email} onChange={(v) => setContato({ ...contato, email: v })} type="email" />
              <Campo
                label="WhatsApp"
                value={contato.whatsapp}
                onChange={onWhatsappChange}
                type="tel"
                placeholder="(00) 00000-0000"
              />
              <CampoSelect
                label="Total de colaboradores"
                value={contato.totalColaboradores}
                onChange={(v) => setContato({ ...contato, totalColaboradores: v })}
                opcoes={FAIXAS_COLABORADORES}
              />
              <Campo label="Principais áreas / segmento" value={contato.principaisAreas} onChange={(v) => setContato({ ...contato, principaisAreas: v })} />
              <CampoSelect
                label="Contratações últimos 6 meses"
                value={contato.contratacoes6m}
                onChange={(v) => setContato({ ...contato, contratacoes6m: v })}
                opcoes={FAIXAS_MOVIMENTACAO}
              />
              <CampoSelect
                label="Desligamentos últimos 6 meses"
                value={contato.desligamentos6m}
                onChange={(v) => setContato({ ...contato, desligamentos6m: v })}
                opcoes={FAIXAS_MOVIMENTACAO}
              />
              <CampoSelect
                label="Momento da empresa"
                value={contato.momentoEmpresa}
                onChange={(v) => setContato({ ...contato, momentoEmpresa: v })}
                opcoes={OPCOES_MOMENTO_EMPRESA}
              />
              <CampoSelect
                label="Júnior/estagiário no time de RH"
                value={contato.juniorNoRH}
                onChange={(v) => setContato({ ...contato, juniorNoRH: v })}
                opcoes={OPCOES_JUNIOR_RH}
              />
            </div>
          </div>
        )}

        {erro && (
          <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 16, fontFamily: "var(--font-poppins)" }}>
            {erro}
          </p>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <button
          type="button"
          onClick={voltar}
          disabled={voltarDisabled}
          style={{
            padding: "13px 26px",
            borderRadius: 100,
            border: "1.5px solid var(--border)",
            background: "#fff",
            fontFamily: "var(--font-poppins)",
            fontWeight: 500,
            fontSize: 13,
            cursor: voltarDisabled ? "default" : "pointer",
            opacity: voltarDisabled ? 0.35 : 1,
            transition: "opacity .2s",
          }}
        >
          ← Voltar
        </button>
        <button
          type="button"
          onClick={avancar}
          disabled={!podeAvancar || enviando}
          style={{
            padding: "13px 34px",
            borderRadius: 100,
            border: "none",
            background: "var(--gm)",
            color: "#fff",
            fontFamily: "var(--font-sora)",
            fontWeight: 700,
            fontSize: 13,
            cursor: podeAvancar && !enviando ? "pointer" : "default",
            opacity: podeAvancar && !enviando ? 1 : 0.45,
            boxShadow: podeAvancar && !enviando ? "0 4px 18px rgba(59,130,246,.3)" : "none",
            transition: "opacity .2s, box-shadow .2s",
          }}
        >
          {textoBotao}
        </button>
      </div>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: "var(--font-poppins)",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: "var(--gray-500)",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "1.5px solid var(--border)",
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: 13.5,
          fontFamily: "var(--font-poppins)",
          fontWeight: 300,
          background: "var(--offwhite)",
          outline: "none",
          transition: "border-color .2s",
        }}
      />
    </div>
  );
}

function CampoSelect({
  label,
  value,
  onChange,
  opcoes,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opcoes: string[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: "var(--font-poppins)",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: "var(--gray-500)",
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "1.5px solid var(--border)",
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: 13.5,
          fontFamily: "var(--font-poppins)",
          fontWeight: 300,
          background: "var(--offwhite)",
          outline: "none",
          color: value ? "var(--text)" : "var(--gray-500)",
          transition: "border-color .2s",
        }}
      >
        <option value="" disabled>
          Selecione…
        </option>
        {opcoes.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}
