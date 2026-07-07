import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ background: "var(--gh)", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 40px" }}>
        <div className="logo-dark" style={{ display: "inline-flex", gap: 9, marginBottom: 28, fontSize: 26 }}>
          <span className="logo-azumi">azumi</span>
          <span className="logo-rh">RH</span>
        </div>

        <div
          style={{
            display: "inline-block",
            background: "rgba(147,197,253,.12)",
            border: "1px solid rgba(147,197,253,.25)",
            color: "var(--ice)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            padding: "5px 14px",
            borderRadius: 100,
            marginBottom: 16,
          }}
        >
          Diagnóstico Estratégico · Gratuito
        </div>

        <h1
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: 34,
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: 14,
          }}
        >
          Raio-X de Maturidade
          <br />
          de Capital Humano
        </h1>

        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 14,
            fontWeight: 300,
            color: "rgba(255,255,255,.7)",
            lineHeight: 1.8,
            maxWidth: 560,
            marginBottom: 32,
          }}
        >
          Em cerca de 10 minutos, você recebe um diagnóstico completo do nível de maturidade
          do RH da sua empresa — com nota por pilar, prioridades e um plano de ação, gerado na
          hora.
        </p>

        <Link
          href="/questionario"
          style={{
            display: "inline-block",
            background: "var(--gm)",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 100,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Começar meu Raio-X →
        </Link>
      </div>
    </div>
  );
}
