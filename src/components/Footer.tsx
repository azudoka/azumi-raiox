import Image from "next/image";
import { Mail, Phone, Linkedin, Instagram, ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--ocean)", color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 0" }}>
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr",
            gap: 48,
            paddingBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <Image
              src="/logo-azumi-dark.png"
              alt="Azumi RH"
              width={0}
              height={0}
              sizes="160px"
              style={{ objectFit: "contain", height: 90, width: "auto" }}
            />
            <p
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: 13,
                fontWeight: 300,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.75,
                maxWidth: 280,
                marginTop: 18,
              }}
            >
              Somos uma HRaaS Estratégica para empresas que querem crescer com constância.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <a
                href="https://www.linkedin.com/company/azumirh/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <Linkedin size={15} />
              </a>
              <a
                href="https://www.instagram.com/azumirh/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--ice)",
                marginBottom: 20,
              }}
            >
              Contato
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <a
                href="mailto:contato@azumirh.com.br"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--font-poppins)",
                  fontSize: 13,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                }}
              >
                <Mail size={15} /> contato@azumirh.com.br
              </a>
              <a
                href="https://wa.me/5541988350743?text=Oi!%20Vim%20pelo%20Raio-X%20da%20Azumi%20RH."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--font-poppins)",
                  fontSize: 13,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                }}
              >
                <Phone size={15} /> +55 41 98835-0743
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--ice)",
                marginBottom: 20,
              }}
            >
              Azumi RH
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Site oficial", href: "https://azumirh.com.br" },
                { label: "Quem somos", href: "https://azumirh.com.br/quem-somos" },
                { label: "Política de Privacidade", href: "https://azumirh.com.br/privacidade" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--font-poppins)",
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                  }}
                >
                  {link.label} <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "24px 0",
            textAlign: "center",
            fontFamily: "var(--font-poppins)",
            fontSize: 11,
            fontWeight: 300,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          © {year} Azumi RH. Todos os direitos reservados. · Curitiba, PR
        </div>
      </div>
    </footer>
  );
}
