"use client";

import { useEffect, useState } from "react";
import { PILARES_LABEL, PilarId } from "@/lib/questions";
import Image from "next/image";

interface ResultadoSalvo {
  protocolo: string;
  pdfUrl: string;
  notaGeral: number;
  pilares: Record<PilarId, { nota: number; nivel: number; classificacao: string }>;
}

const ORDEM: PilarId[] = ["estrategia", "processos", "pessoas", "performance"];

export default function ObrigadoPage() {
  const [resultado, setResultado] = useState<ResultadoSalvo | null>(null);
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [statusEmail, setStatusEmail] = useState<"idle" | "sucesso" | "erro">("idle");

  useEffect(() => {
    const raw = sessionStorage.getItem("raiox_resultado");
    if (raw) setResultado(JSON.parse(raw));
  }, []);

  async function enviarPorEmail() {
    if (!resultado || !email) return;
    setEnviandoEmail(true);
    setStatusEmail("idle");
    try {
      const resp = await fetch("/api/enviar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protocolo: resultado.protocolo, destinatario: email }),
      });
      if (!resp.ok) throw new Error();
      setStatusEmail("sucesso");
    } catch {
      setStatusEmail("erro");
    } finally {
      setEnviandoEmail(false);
    }
  }

  if (!resultado) {
    return (
      <div style={{ padding: 60, textAlign: "center", fontFamily: "var(--font-space-grotesk)" }}>
        <p>Não encontramos os dados do seu diagnóstico nesta sessão.</p>
        <a href="/questionario" style={{ color: "var(--blue2)" }}>
          Fazer o Raio-X novamente
        </a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--gh)", display: "flex", alignItems: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="fade-slide-in"
        style={{
          maxWidth: 540,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 24,
          padding: "44px 36px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 24px 60px rgba(0,0,0,.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <Image
            src="/logo-azumi-light.png"
            alt="Azumi RH"
            width={0}
            height={0}
            sizes="200px"
            style={{ height: 48, width: "auto", objectFit: "contain" }}
          />
        </div>

        <div
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "var(--blue2)",
            marginBottom: 8,
          }}
        >
          Protocolo {resultado.protocolo}
        </div>

        <h1 style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 26, color: "var(--ocean)", marginBottom: 4 }}>
          Seu Raio-X está pronto!
        </h1>

        <div
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: 4,
            background: "var(--gm)",
            borderRadius: 100,
            padding: "10px 28px",
            margin: "20px 0",
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 800, fontFamily: "var(--font-sora)", color: "#fff" }}>
            {resultado.notaGeral}
          </span>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,.7)" }}>/5</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "24px 0", textAlign: "left" }}>
          {ORDEM.map((p) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12, fontWeight: 600, width: 150, flexShrink: 0 }}>
                {PILARES_LABEL[p]}
              </span>
              <div style={{ flex: 1, height: 7, background: "var(--border)", borderRadius: 100, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(resultado.pilares[p].nota / 5) * 100}%`,
                    background: "var(--gm)",
                    transition: "width .6s ease",
                  }}
                />
              </div>
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, color: "var(--gray-500)", width: 28 }}>
                {resultado.pilares[p].nota}/5
              </span>
            </div>
          ))}
        </div>

        <a
          href={resultado.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
          style={{
            display: "block",
            background: "var(--gm)",
            color: "#fff",
            padding: "15px",
            borderRadius: 100,
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            marginBottom: 10,
            boxShadow: "0 6px 20px rgba(59,130,246,.3)",
            transition: "transform .25s ease, box-shadow .25s ease",
          }}
        >
          Baixar meu Raio-X completo (PDF) →
        </a>

        {!mostrarEmail && (
          <button
            type="button"
            onClick={() => setMostrarEmail(true)}
            style={{
              display: "block",
              width: "100%",
              background: "#fff",
              color: "var(--blue)",
              padding: "13px",
              borderRadius: 100,
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              fontSize: 13.5,
              border: "1.5px solid var(--border)",
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            Enviar por e-mail
          </button>
        )}

        {mostrarEmail && (
          <div style={{ marginBottom: 16, textAlign: "left" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{
                  flex: 1,
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  padding: "11px 14px",
                  fontSize: 13.5,
                  fontFamily: "var(--font-space-grotesk)",
                  background: "var(--offwhite)",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={enviarPorEmail}
                disabled={!email || enviandoEmail}
                style={{
                  padding: "11px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: "var(--gm)",
                  color: "#fff",
                  fontFamily: "var(--font-space-grotesk)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: email && !enviandoEmail ? "pointer" : "default",
                  opacity: email && !enviandoEmail ? 1 : 0.5,
                  whiteSpace: "nowrap",
                }}
              >
                {enviandoEmail ? "Enviando…" : "Enviar"}
              </button>
            </div>
            {statusEmail === "sucesso" && (
              <p style={{ fontSize: 12, color: "#1b8a5a", marginTop: 8, fontFamily: "var(--font-space-grotesk)" }}>
                Enviado! Confere sua caixa de entrada.
              </p>
            )}
            {statusEmail === "erro" && (
              <p style={{ fontSize: 12, color: "#b91c1c", marginTop: 8, fontFamily: "var(--font-space-grotesk)" }}>
                Não conseguimos enviar agora — tenta o download direto.
              </p>
            )}
          </div>
        )}

        <a
          href="https://azumirh.com.br/contato"
          style={{ display: "block", fontFamily: "var(--font-space-grotesk)", fontSize: 12, color: "var(--gray-500)" }}
        >
          Quer conversar com a equipe sobre os resultados?
        </a>
      </div>
    </div>
  );
}
