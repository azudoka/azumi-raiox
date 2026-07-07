"use client";

import { useMemo, useState } from "react";
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
}

const TOTAL_ETAPAS = ORDEM_BLOCOS.length + 1;

const FAIXAS_COLABORADORES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const FAIXAS_MOVIMENTACAO = ["0", "1-5", "6-10", "11-20", "Mais de 20"];

export function Wizard() {
  const router = useRouter();
  const [etapa, setEtapa] = useState(1);
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
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const blocoAtual = etapa <= ORDEM_BLOCOS.length ? ORDEM_BLOCOS[etapa - 1] : null;
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
      !!contato.totalColaboradores
    );
  }

  function irPara(novaEtapa: number) {
    setEtapa(novaEtapa);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function avancar() {
    if (etapa <= ORDEM_BLOCOS.length) {
      irPara(etapa + 1);
      return;
    }
    await enviar();
  }

  function voltar() {
    irPara(Math.max(1, etapa - 1));
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
        body: JSON.stringify({
          ...contato,
          respostas: respostasFormatadas,
        }),
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

  const labelEtapaAtual = blocoAtual ? BLOCOS_LABEL[blocoAtual] : "Seus Dados";
  const podeAvancar = blocoAtual ? blocoCompleto() : contatoCompleto();

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 100px" }}>
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
                fontSize: 22,
                color: "var(--ocean)",
                marginBottom: 6,
              }}
            >
              {BLOCOS_LABEL[blocoAtual]}
            </h2>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, color: "var(--gray-500)", marginBottom: 24 }}>
              Responda com a nota que melhor descreve a realidade de hoje, e detalhe no campo de texto.
            </p>
            {perguntasDoBloco.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                nota={respostas[q.id]?.nota ?? null}
                texto={respostas[q.id]?.texto ?? ""}
                onNotaChange={(nota) => atualizarResposta(q.id, "nota", nota)}
                onTextoChange={(texto) => atualizarResposta(q.id, "texto", texto)}
              />
            ))}
          </div>
        )}

        {!blocoAtual && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-sora)",
                fontWeight: 800,
                fontSize: 22,
                color: "var(--ocean)",
                marginBottom: 6,
              }}
            >
              Últimos dados pra gerar seu relatório
            </h2>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, color: "var(--gray-500)", marginBottom: 24 }}>
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
            </div>
          </div>
        )}

        {erro && <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 16, fontFamily: "var(--font-space-grotesk)" }}>{erro}</p>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
        <button
          type="button"
          onClick={voltar}
          disabled={etapa === 1 || enviando}
          style={{
            padding: "13px 26px",
            borderRadius: 100,
            border: "1.5px solid var(--border)",
            background: "#fff",
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 600,
            fontSize: 13,
            cursor: etapa === 1 ? "default" : "pointer",
            opacity: etapa === 1 ? 0.4 : 1,
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
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 700,
            fontSize: 13,
            cursor: podeAvancar && !enviando ? "pointer" : "default",
            opacity: podeAvancar && !enviando ? 1 : 0.5,
            boxShadow: podeAvancar && !enviando ? "0 4px 18px rgba(59,130,246,.3)" : "none",
          }}
        >
          {enviando
            ? "Gerando seu relatório…"
            : etapa <= ORDEM_BLOCOS.length
            ? "Avançar →"
            : "Gerar meu Raio-X →"}
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
          fontFamily: "var(--font-space-grotesk)",
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
          fontFamily: "var(--font-space-grotesk)",
          background: "var(--offwhite)",
          outline: "none",
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
          fontFamily: "var(--font-space-grotesk)",
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
          fontFamily: "var(--font-space-grotesk)",
          background: "var(--offwhite)",
          outline: "none",
          color: value ? "var(--text)" : "var(--gray-500)",
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
