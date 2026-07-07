import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { enviarRelatorioParaDestinatario } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { protocolo?: string; destinatario?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ erro: "JSON inválido." }, { status: 400 });
  }

  const { protocolo, destinatario } = body;
  if (!protocolo || !destinatario) {
    return NextResponse.json({ erro: "Protocolo e e-mail são obrigatórios." }, { status: 400 });
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destinatario);
  if (!emailValido) {
    return NextResponse.json({ erro: "E-mail inválido." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { data: lead, error } = await supabase
    .from("raiox_leads")
    .select("empresa, pdf_url, resultado")
    .eq("protocolo", protocolo)
    .single();

  if (error || !lead || !lead.pdf_url) {
    return NextResponse.json({ erro: "Relatório não encontrado pra esse protocolo." }, { status: 404 });
  }

  try {
    await enviarRelatorioParaDestinatario({
      destinatario,
      protocolo,
      empresa: lead.empresa,
      pdfUrl: lead.pdf_url,
      notaGeral: (lead.resultado as { notaGeral: number }).notaGeral,
    });
  } catch (e) {
    console.error("Erro ao enviar e-mail:", e);
    return NextResponse.json({ erro: "Falha ao enviar o e-mail." }, { status: 500 });
  }

  return NextResponse.json({ sucesso: true });
}
