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

const TOTAL_ETAPAS = ORDEM_BLOCOS.length + 1; // 5 blocos + 1 etapa de contato

export function Wizard() {
  const router = useRouter();
  const [etapa, setEtapa] = useState(1); // 1-indexed
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
      !!contato.whatsapp &&
      !!contato.totalColaboradores
    );
  }

  async function avancar() {
    if (etapa <= ORDEM_BLOCOS.length) {
      setEtapa((e) => e + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // última etapa: enviar
    await enviar();
  }

  function voltar() {
    setEtapa((e) => Math.max(1, e - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 80px" }}>
      <ProgressBar etapaAtual={etapa} totalEtapas={TOTAL_ETAPAS} labelEtapa={labelEtapaAtual} />

      {blocoAtual && (
        <div>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: "var(--ocean)",
              marginBottom: 18,
            }}
          >
            {BLOCOS_LABEL[blocoAtual]}
          </h2>
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
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 20, color: "var(--ocean)", marginBottom: 18 }}>
            Últimos dados pra gerar seu relatório
          </h2>
          <div style={{ display: "grid", gap: 14 }}>
            <Campo label="Nome do Responsável" value={contato.nomeResponsavel} onChange={(v) => setContato({ ...contato, nomeResponsavel: v })} />
            <Campo label="Empresa" value={contato.empresa} onChange={(v) => setContato({ ...contato, empresa: v })} />
            <Campo label="E-mail" value={contato.email} onChange={(v) => setContato({ ...contato, email: v })} type="email" />
            <Campo label="WhatsApp" value={contato.whatsapp} onChange={(v) => setContato({ ...contato, whatsapp: v })} />
            <Campo label="Total de colaboradores" value={contato.totalColaboradores} onChange={(v) => setContato({ ...contato, totalColaboradores: v })} placeholder="Ex: 1-10, 11-50, 51-200..." />
            <Campo label="Principais áreas / segmento" value={contato.principaisAreas} onChange={(v) => setContato({ ...contato, principaisAreas: v })} />
            <Campo label="Contratações últimos 6 meses" value={contato.contratacoes6m} onChange={(v) => setContato({ ...contato, contratacoes6m: v })} />
            <Campo label="Desligamentos últimos 6 meses" value={contato.desligamentos6m} onChange={(v) => setContato({ ...contato, desligamentos6m: v })} />
          </div>
        </div>
      )}

      {erro && <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 12 }}>{erro}</p>}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
        <button
          type="button"
          onClick={voltar}
          disabled={etapa === 1 || enviando}
          style={{
            padding: "12px 24px",
            borderRadius: 100,
            border: "1.5px solid var(--border)",
            background: "#fff",
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
            padding: "12px 32px",
            borderRadius: 100,
            border: "none",
            background: "var(--gm)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: podeAvancar && !enviando ? "pointer" : "default",
            opacity: podeAvancar && !enviando ? 1 : 0.5,
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
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontFamily: "'JetBrains Mono', monospace",
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
          borderRadius: 8,
          padding: "10px 13px",
          fontSize: 13,
          background: "var(--offwhite)",
          outline: "none",
        }}
      />
    </div>
  );
}
