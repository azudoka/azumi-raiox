import { Wizard } from "@/components/Wizard";

export default function QuestionarioPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--offwhite)" }}>
      <div style={{ background: "var(--gh)", padding: "24px 20px" }}>
        <div className="logo-dark" style={{ display: "inline-flex", gap: 8, maxWidth: 640, margin: "0 auto", width: "100%" }}>
          <span className="logo-azumi" style={{ fontSize: 20 }}>azumi</span>
          <span className="logo-rh" style={{ fontSize: 20 }}>RH</span>
        </div>
      </div>
      <Wizard />
    </div>
  );
}
