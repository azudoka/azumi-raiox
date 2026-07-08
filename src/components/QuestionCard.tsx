"use client";

import { Question } from "@/lib/questions";
import { QUESTION_LABELS } from "@/lib/questionLabels";
import { LevelSelector } from "./LevelSelector";

interface QuestionCardProps {
  question: Question;
  nota: number | null;
  texto: string;
  onNotaChange: (nota: number) => void;
  onTextoChange: (texto: string) => void;
}

function renderDestaque(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="highlight">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function QuestionCard({ question, nota, texto, onNotaChange, onTextoChange }: QuestionCardProps) {
  return (
    <div
      className="fade-slide-in"
      style={{
        background: "#fff",
        border: "1.5px solid var(--border)",
        borderRadius: 18,
        padding: "28px 28px 24px",
        marginBottom: 18,
        boxShadow: "0 2px 16px rgba(3,29,56,.05)",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <p
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: 15.5,
            fontWeight: 400,
            color: "var(--text)",
            lineHeight: 1.65,
            marginBottom: question.hint ? 8 : 0,
          }}
        >
          {renderDestaque(question.texto)}
        </p>
        {question.hint && (
          <p
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: 12.5,
              fontWeight: 300,
              color: "var(--gray-500)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            {question.hint}
          </p>
        )}
      </div>

      <LevelSelector
        value={nota}
        onChange={onNotaChange}
        labels={QUESTION_LABELS[question.id]}
      />

      <textarea
        value={texto}
        onChange={(e) => onTextoChange(e.target.value)}
        placeholder={question.placeholder}
        rows={3}
        style={{
          width: "100%",
          border: "1.5px solid #EEF2F8",
          borderRadius: 12,
          padding: "13px 16px",
          fontSize: 13.5,
          fontWeight: 300,
          color: "var(--text)",
          background: "var(--offwhite)",
          resize: "vertical",
          outline: "none",
          lineHeight: 1.7,
          fontFamily: "var(--font-poppins)",
          transition: "border-color .2s",
        }}
      />
    </div>
  );
}
