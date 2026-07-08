"use client";

interface LevelSelectorProps {
  value: number | null;
  onChange: (nota: number) => void;
  labels?: [string, string, string, string, string];
}

const DEFAULT_LABELS: [string, string, string, string, string] = [
  "Nunca", "Raramente", "Às vezes", "Frequente", "Sempre",
];

export function LevelSelector({ value, onChange, labels }: LevelSelectorProps) {
  const legendas = labels ?? DEFAULT_LABELS;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const selecionado = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              style={{
                flex: 1,
                minWidth: 0,
                padding: "15px 4px",
                border: `2px solid ${selecionado ? "transparent" : "var(--border)"}`,
                borderRadius: 12,
                background: selecionado ? "var(--gm)" : "#fff",
                fontFamily: "var(--font-sora)",
                fontSize: 22,
                fontWeight: 800,
                color: selecionado ? "#fff" : "var(--gray-500)",
                cursor: "pointer",
                textAlign: "center",
                boxShadow: selecionado
                  ? "0 4px 16px rgba(59,130,246,.35)"
                  : "0 1px 4px rgba(3,29,56,.05)",
                transition: "all .15s ease",
                lineHeight: 1,
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
        {legendas.map((legenda, i) => {
          const n = i + 1;
          const selecionado = value === n;
          return (
            <div
              key={n}
              style={{
                flex: 1,
                minWidth: 0,
                textAlign: "center",
                fontFamily: "var(--font-poppins)",
                fontSize: 9,
                fontWeight: selecionado ? 600 : 400,
                color: selecionado ? "var(--blue)" : "var(--gray-500)",
                lineHeight: 1.25,
                minHeight: 26,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                wordBreak: "break-word",
                hyphens: "auto",
                transition: "color .15s ease, font-weight .15s ease",
              }}
            >
              {legenda}
            </div>
          );
        })}
      </div>
    </div>
  );
}
