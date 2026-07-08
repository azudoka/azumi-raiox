import Link from "next/link";
import Image from "next/image";
import { BarChart3, Target, FileDown, Sparkles, ClipboardEdit, LineChart, Send } from "lucide-react";
import { Logo } from "@/components/Logo";
import heroRaioX from "@/heroraiox.png";

const ENTREGAS = [
  {
    icon: BarChart3,
    titulo: "Nota por pilar",
    descricao: "Estratégia, Processos, Pessoas e Performance avaliados separadamente, com base na Matriz de Maturidade da Azumi.",
  },
  {
    icon: Target,
    titulo: "Top 3 prioridades",
    descricao: "As oportunidades mais urgentes pra evoluir, em ordem, com uma sugestão prática pra cada uma.",
  },
  {
    icon: Sparkles,
    titulo: "Leitura de Tecnologia & IA",
    descricao: "Um retrato de quão preparada sua operação de RH está pra usar tecnologia a favor do time.",
  },
  {
    icon: FileDown,
    titulo: "PDF completo, na hora",
    descricao: "Relatório pronto pra baixar assim que você termina — sem espera, sem burocracia.",
  },
];

const ETAPAS = [
  { icon: ClipboardEdit, titulo: "Responda", descricao: "20 perguntas objetivas sobre a realidade do seu RH hoje. Leva cerca de 10 minutos." },
  { icon: LineChart, titulo: "Nós calculamos", descricao: "Cruzamos suas respostas com a Matriz de Maturidade da Azumi RH, sem achismo." },
  { icon: Send, titulo: "Você recebe", descricao: "Nota geral, diagnóstico por pilar e um plano de ação — pronto pra baixar." },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--lightbg)" }}>
      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "0 24px" }}>
        <div
          className="blob-float"
          style={{
            position: "absolute",
            top: -120,
            right: -100,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,.16) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="blob-float"
          style={{
            position: "absolute",
            bottom: -140,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,.13) 0%, transparent 70%)",
            pointerEvents: "none",
            animationDelay: "3s",
          }}
        />

        <div
          className="hero-grid"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            padding: "44px 0 64px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div>
            <Logo variant="light" size={26} />

            <div
              style={{
                display: "inline-block",
                background: "rgba(59,130,246,.08)",
                border: "1px solid rgba(59,130,246,.2)",
                color: "var(--blue)",
                fontFamily: "var(--font-sora)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                padding: "6px 14px",
                borderRadius: 100,
                margin: "28px 0 18px",
              }}
            >
              Diagnóstico Estratégico · Gratuito
            </div>

            <h1
              style={{
                fontFamily: "var(--font-sora)",
                fontWeight: 800,
                fontSize: "clamp(30px, 4.5vw, 44px)",
                color: "var(--ocean)",
                lineHeight: 1.18,
                marginBottom: 18,
              }}
            >
              Descubra o nível de{" "}
              <span
                style={{
                  background: "var(--gm)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                maturidade
              </span>{" "}
              do RH da sua empresa
            </h1>

            <p
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: 15,
                fontWeight: 300,
                color: "var(--gray-500)",
                lineHeight: 1.8,
                maxWidth: 460,
                marginBottom: 32,
              }}
            >
              Em cerca de 10 minutos, você responde um questionário objetivo e recebe um
              diagnóstico completo — nota por pilar, prioridades e plano de ação — gerado na
              hora, sem espera.
            </p>

            <Link
              href="/questionario"
              className="cta-button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "var(--gm)",
                color: "#fff",
                padding: "16px 34px",
                borderRadius: 100,
                fontFamily: "var(--font-sora)",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(59,130,246,.3)",
                transition: "transform .25s ease, box-shadow .25s ease",
              }}
            >
              Começar meu Raio-X →
            </Link>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: "-16px",
                borderRadius: 28,
                background: "var(--gm)",
                opacity: 0.12,
                transform: "rotate(-2deg)",
              }}
            />
            <div
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: 24,
                padding: 10,
                boxShadow: "0 24px 60px -20px rgba(3,29,56,.25)",
                border: "1px solid var(--border)",
              }}
            >
              <Image
                src={heroRaioX}
                alt="Raio-X de Maturidade Azumi RH"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 18,
                  display: "block",
                }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── O QUE VOCÊ RECEBE ── */}
      <section style={{ padding: "20px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-sora)",
              fontWeight: 700,
              fontSize: 24,
              color: "var(--ocean)",
              marginBottom: 36,
              textAlign: "center",
            }}
          >
            O que você recebe
          </h2>
          <div className="entregas-grid">
            {ENTREGAS.map((item) => (
              <div
                key={item.titulo}
                className="card-hover"
                style={{
                  background: "#fff",
                  border: "1.5px solid var(--border)",
                  borderRadius: 18,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--gm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <item.icon size={20} color="#fff" strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-sora)",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--ocean)",
                    marginBottom: 8,
                  }}
                >
                  {item.titulo}
                </h3>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 300, color: "var(--gray-500)", lineHeight: 1.7 }}>
                  {item.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section style={{ padding: "0 24px 90px", position: "relative", overflow: "hidden" }}>
        <div
          className="blob-float"
          style={{
            position: "absolute",
            top: "10%",
            left: "-6%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,.10) 0%, transparent 70%)",
            pointerEvents: "none",
            animationDelay: "1.5s",
          }}
        />
        <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-sora)",
              fontWeight: 700,
              fontSize: 24,
              color: "var(--ocean)",
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            Como funciona
          </h2>

          <div className="etapas-row">
            <div className="etapas-linha" />
            {ETAPAS.map((etapa, i) => (
              <div
                key={etapa.titulo}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--gm)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-sora)",
                    fontWeight: 800,
                    fontSize: 15,
                    boxShadow: "0 4px 14px rgba(59,130,246,.3)",
                    marginBottom: 16,
                  }}
                >
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 16, color: "var(--ocean)", marginBottom: 8 }}>
                  {etapa.titulo}
                </h3>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13.5, fontWeight: 300, color: "var(--gray-500)", lineHeight: 1.7, maxWidth: 260 }}>
                  {etapa.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ background: "var(--gh)", padding: "70px 24px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 50% 100% at 90% 30%, rgba(139,92,246,.2), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 26, color: "#fff", marginBottom: 14 }}>
            Pronto pra ver onde seu RH está?
          </h2>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,.7)", marginBottom: 32, lineHeight: 1.7 }}>
            É gratuito, leva 10 minutos e o relatório fica pronto na hora.
          </p>
          <Link
            href="/questionario"
            className="cta-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#fff",
              color: "var(--blue)",
              padding: "16px 34px",
              borderRadius: 100,
              fontFamily: "var(--font-sora)",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              transition: "transform .25s ease, box-shadow .25s ease",
            }}
          >
            Começar meu Raio-X →
          </Link>
        </div>
      </section>
    </div>
  );
}
