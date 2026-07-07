interface LogoProps {
  variant?: "dark" | "light";
  size?: number;
}

// Mesmo SVG usado no site institucional e nos artefatos HTML do Raio-X
// (dois círculos sobrepostos com gradiente da paleta oficial).
export function Logo({ variant = "dark", size = 28 }: LogoProps) {
  const corAzumi = variant === "dark" ? "#fff" : "var(--blue)";
  const corRH = variant === "dark" ? "var(--ice)" : undefined;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <svg viewBox="0 0 120 96" width={size * 1.25} height={size} fill="none">
        <defs>
          <linearGradient id="azumiLogoGradient" x1="0" y1="0" x2="120" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#031D38" />
            <stop offset="50%" stopColor="#034C8B" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <circle cx="44" cy="48" r="34" fill="url(#azumiLogoGradient)" opacity="0.9" />
        <circle cx="76" cy="48" r="34" fill="url(#azumiLogoGradient)" opacity="0.7" />
      </svg>
      <span style={{ display: "inline-flex", fontSize: size, lineHeight: 1 }}>
        <span style={{ fontFamily: "var(--font-poppins)", fontWeight: 600, color: corAzumi, letterSpacing: "-0.01em" }}>
          azumi
        </span>
        {variant === "dark" ? (
          <span style={{ fontFamily: "var(--font-poppins)", fontStyle: "italic", fontWeight: 400, color: corRH, marginLeft: 1 }}>
            RH
          </span>
        ) : (
          <span
            style={{
              fontFamily: "var(--font-poppins)",
              fontStyle: "italic",
              fontWeight: 400,
              marginLeft: 1,
              background: "var(--gm)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            RH
          </span>
        )}
      </span>
    </div>
  );
}
