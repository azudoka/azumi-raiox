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
        borderRadius: 16,
        padding: "24px 26px",
        marginBottom: 18,
        boxShadow: "0 2px 12px rgba(3,29,56,.04)",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: 15,
            fontWeight: 500,
            marginBottom: 5,
            color: "var(--ocean)",
            lineHeight: 1.5,
          }}
        >
          {question.texto}
        </div>
        {question.hint && (
          <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12.5, color: "var(--gray-500)", fontStyle: "italic" }}>
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
          borderRadius: 10,
          padding: "12px 15px",
          fontSize: 13.5,
          fontWeight: 300,
          color: "var(--text)",
          background: "var(--offwhite)",
          resize: "vertical",
          outline: "none",
          lineHeight: 1.7,
          fontFamily: "var(--font-space-grotesk)",
        }}
      />
    </div>
  );
}
