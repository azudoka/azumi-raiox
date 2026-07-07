"use client";

import { useEffect, useState } from "react";
import { PILARES_LABEL, PilarId } from "@/lib/questions";

interface ResultadoSalvo {
  protocolo: string;
  pdfUrl: string;
  notaGeral: number;
  pilares: Record<PilarId, { nota: number; nivel: number; classificacao: string }>;
}

const ORDEM: PilarId[] = ["estrategia", "processos", "pessoas", "performance"];

export default function ObrigadoPage() {
  const [resultado, setResultado] = useState<ResultadoSalvo | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("raiox_resultado");
    if (raw) setResultado(JSON.parse(raw));
  }, []);

  if (!resultado) {
    return (
      <div style={{ padding: 60, textAlign: "center", fontFamily: "'Space Grotesk', sans-serif" }}>
        <p>Não encontramos os dados do seu diagnóstico nesta sessão.</p>
        <a href="/questionario" style={{ color: "var(--blue2)" }}>
          Fazer o Raio-X novamente
        </a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--gh)", display: "flex", alignItems: "center", padding: "40px 20px" }}>
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 20,
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--blue2)",
            marginBottom: 8,
          }}
        >
          Protocolo {resultado.protocolo}
        </div>

        <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 24, color: "var(--ocean)", marginBottom: 4 }}>
          Seu Raio-X está pronto!
        </h1>

        <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: "var(--blue2)", margin: "16px 0" }}>
          {resultado.notaGeral}
          <span style={{ fontSize: 20, color: "var(--gray-500)" }}>/5</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "24px 0", textAlign: "left" }}>
          {ORDEM.map((p) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, width: 150, flexShrink: 0 }}>{PILARES_LABEL[p]}</span>
              <div style={{ flex: 1, height: 6, background: "var(--border)", borderRadius: 100, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(resultado.pilares[p].nota / 5) * 100}%`,
                    background: "var(--gm)",
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: "var(--gray-500)" }}>{resultado.pilares[p].nota}/5</span>
            </div>
          ))}
        </div>

        <a
          href={resultado.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            background: "var(--gm)",
            color: "#fff",
            padding: "14px",
            borderRadius: 100,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          Baixar meu Raio-X completo (PDF) →
        </a>

        <a
          href="https://azumirh.com.br/contato"
          style={{ display: "block", fontSize: 12, color: "var(--gray-500)" }}
        >
          Quer conversar com a equipe sobre os resultados?
        </a>
      </div>
    </div>
  );
}
