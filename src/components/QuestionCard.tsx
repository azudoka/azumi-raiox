"use client";

import { Question } from "@/lib/questions";
import { LevelSelector } from "./LevelSelector";

interface QuestionCardProps {
  question: Question;
  nota: number | null;
  texto: string;
  onNotaChange: (nota: number) => void;
  onTextoChange: (texto: string) => void;
}

export function QuestionCard({ question, nota, texto, onNotaChange, onTextoChange }: QuestionCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid var(--border)",
        borderRadius: 12,
        padding: "20px 22px",
        marginBottom: 16,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>
          {question.texto}
        </div>
        {question.hint && (
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12.5, color: "var(--gray-500)" }}>
            {question.hint}
          </div>
        )}
      </div>

      <LevelSelector value={nota} onChange={onNotaChange} />

      <textarea
        value={texto}
        onChange={(e) => onTextoChange(e.target.value)}
        placeholder={question.placeholder}
        rows={3}
        style={{
          width: "100%",
          border: "1.5px solid #EEF2F8",
          borderRadius: 8,
          padding: "11px 14px",
          fontSize: 13,
          fontWeight: 300,
          color: "var(--text)",
          background: "var(--offwhite)",
          resize: "vertical",
          outline: "none",
          lineHeight: 1.7,
        }}
      />
    </div>
  );
}
