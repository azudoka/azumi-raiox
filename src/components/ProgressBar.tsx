"use client";

interface ProgressBarProps {
  etapaAtual: number; // 1-indexed
  totalEtapas: number;
  labelEtapa: string;
}

export function ProgressBar({ etapaAtual, totalEtapas, labelEtapa }: ProgressBarProps) {
  const percentual = Math.round((etapaAtual / totalEtapas) * 100);

  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: "var(--gray-500)",
          marginBottom: 8,
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
            transition: "width .3s ease",
          }}
        />
      </div>
    </div>
  );
}
