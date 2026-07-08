import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram } from "lucide-react";

export function Navbar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: "0 24px",
        pointerEvents: "none",
      }}
    >
      <header
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 28px",
          borderRadius: 100,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(3,29,56,0.08)",
          boxShadow: "0 4px 28px rgba(3,29,56,0.09)",
          pointerEvents: "all",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Image
            src="/logo-azumi-light.png"
            alt="Azumi RH"
            width={0}
            height={0}
            sizes="160px"
            style={{ objectFit: "contain", height: 54, width: "auto" }}
            priority
          />
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a
            href="https://azumirh.com.br/quem-somos"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ocean)",
              textDecoration: "none",
              opacity: 0.85,
              transition: "opacity .2s",
            }}
          >
            Quem somos
          </a>
          <a
            href="https://www.linkedin.com/company/azumirh/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn da Azumi RH"
            style={{ color: "var(--ocean)", display: "flex", alignItems: "center", opacity: 0.7, transition: "opacity .2s" }}
          >
            <Linkedin size={17} />
          </a>
          <a
            href="https://www.instagram.com/azumirh/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Azumi RH"
            style={{ color: "var(--ocean)", display: "flex", alignItems: "center", opacity: 0.7, transition: "opacity .2s" }}
          >
            <Instagram size={17} />
          </a>
        </nav>
      </header>
    </div>
  );
}
