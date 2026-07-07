"use client";

interface LevelSelectorProps {
  value: number | null;
  onChange: (nota: number) => void;
}

export function LevelSelector({ value, onChange }: LevelSelectorProps) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
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
              padding: "8px 4px",
              border: `1.5px solid ${selecionado ? "transparent" : "var(--border)"}`,
              borderRadius: 100,
              background: selecionado ? "var(--gm)" : "#fff",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              color: selecionado ? "#fff" : "var(--gray-500)",
              cursor: "pointer",
              textAlign: "center",
              boxShadow: selecionado ? "0 2px 8px rgba(59,130,246,.3)" : "none",
            }}
          >
            {n}/5
          </button>
        );
      })}
    </div>
  );
}
