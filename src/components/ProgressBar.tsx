"use client";

interface ProgressBarProps {
  etapaAtual: number;
  totalEtapas: number;
  labelEtapa: string;
}

export function ProgressBar({ etapaAtual, totalEtapas, labelEtapa }: ProgressBarProps) {
  const percentual = Math.round((etapaAtual / totalEtapas) * 100);

  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-space-grotesk)",
          fontSize: 10.5,
          fontWeight: 500,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: "var(--gray-500)",
          marginBottom: 10,
        }}
      >
        <span>
          Etapa {etapaAtual} de {totalEtapas} — {labelEtapa}
        </span>
        <span>{percentual}%</span>
      </div>
      <div style={{ height: 6, background: "var(--border)", borderRadius: 100, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${percentual}%`,
            background: "var(--gm)",
            transition: "width .4s ease",
          }}
        />
      </div>
    </div>
  );
}
