"use client";

interface LevelSelectorProps {
  value: number | null;
  onChange: (nota: number) => void;
}

const LABELS: Record<number, string> = {
  1: "Não existe",
  2: "Iniciando",
  3: "Parcial",
  4: "Avançado",
  5: "Excelente",
};

export function LevelSelector({ value, onChange }: LevelSelectorProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
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
                padding: "16px 4px 14px",
                border: `2px solid ${selecionado ? "transparent" : "var(--border)"}`,
                borderRadius: 14,
                background: selecionado ? "var(--gm)" : "#fff",
                fontFamily: "var(--font-sora)",
                fontSize: 20,
                fontWeight: 800,
                color: selecionado ? "#fff" : "var(--gray-500)",
                cursor: "pointer",
                textAlign: "center",
                boxShadow: selecionado ? "0 4px 16px rgba(59,130,246,.35)" : "0 1px 4px rgba(3,29,56,.05)",
                transition: "all .18s ease",
                lineHeight: 1,
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "var(--font-poppins)",
              fontSize: 9.5,
              fontWeight: value === n ? 600 : 400,
              color: value === n ? "var(--blue)" : "var(--gray-500)",
              letterSpacing: 0.2,
              transition: "color .18s ease",
            }}
          >
            {LABELS[n]}
          </div>
        ))}
      </div>
    </div>
  );
}
