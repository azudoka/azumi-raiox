import { Wizard } from "@/components/Wizard";
import { Logo } from "@/components/Logo";

export default function QuestionarioPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--offwhite)" }}>
      <div style={{ background: "var(--gh)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Logo variant="dark" size={22} />
        </div>
      </div>
      <Wizard />
    </div>
  );
}
