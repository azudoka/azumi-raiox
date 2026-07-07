import { NextRequest, NextResponse } from "next/server";
import { calcularResultado, validarRespostas, RespostasMap } from "@/lib/scoring";
import { montarDadosRelatorio } from "@/lib/gerarConteudoRelatorio";
import { gerarHtmlRelatorio } from "@/lib/reportTemplate";
import { gerarPdfDeHtml } from "@/lib/pdf";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { enviarNotificacaoLead } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 60; // geração de PDF pode levar alguns segundos

interface SubmitBody {
  nomeResponsavel: string;
  empresa: string;
  email: string;
  whatsapp: string;
  totalColaboradores: string;
  principaisAreas?: string;
  contratacoes6m?: string;
  desligamentos6m?: string;
  respostas: RespostasMap;
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ erro: "JSON inválido." }, { status: 400 });
  }

  const camposObrigatorios: (keyof SubmitBody)[] = [
    "nomeResponsavel",
    "empresa",
    "email",
    "whatsapp",
    "totalColaboradores",
    "respostas",
  ];
  for (const campo of camposObrigatorios) {
    if (!body[campo]) {
      return NextResponse.json({ erro: `Campo obrigatório faltando: ${campo}` }, { status: 400 });
    }
  }

  const erroValidacao = validarRespostas(body.respostas);
  if (erroValidacao) {
    return NextResponse.json({ erro: erroValidacao }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  // 1. Gera o protocolo (RX-YYYYMMDD-NNNNN) de forma atômica no banco
  const { data: protocoloData, error: protocoloError } = await supabase.rpc(
    "gerar_protocolo_raiox"
  );
  if (protocoloError || !protocoloData) {
    console.error("Erro ao gerar protocolo:", protocoloError);
    return NextResponse.json({ erro: "Falha ao gerar protocolo." }, { status: 500 });
  }
  const protocolo: string = protocoloData;

  // 2. Motor de pontuação (determinístico)
  const resultado = calcularResultado(body.respostas, body.totalColaboradores);

  // 3. Monta o conteúdo narrativo + HTML do relatório
  const dadosRelatorio = montarDadosRelatorio({
    protocolo,
    empresa: body.empresa,
    segmento: body.principaisAreas,
    resultado,
  });
  const html = gerarHtmlRelatorio(dadosRelatorio);

  // 4. Gera o PDF
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await gerarPdfDeHtml(html);
  } catch (e) {
    console.error("Erro ao gerar PDF:", e);
    return NextResponse.json({ erro: "Falha ao gerar PDF do relatório." }, { status: 500 });
  }

  // 5. Sobe o PDF pro Storage e pega a URL pública
  const nomeArquivo = `${protocolo}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("raiox-relatorios")
    .upload(nomeArquivo, pdfBuffer, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    console.error("Erro ao subir PDF:", uploadError);
    return NextResponse.json({ erro: "Falha ao salvar PDF." }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from("raiox-relatorios")
    .getPublicUrl(nomeArquivo);
  const pdfUrl = publicUrlData.publicUrl;

  // 6. Salva o lead completo no banco
  const { error: insertError } = await supabase.from("raiox_leads").insert({
    protocolo,
    nome_responsavel: body.nomeResponsavel,
    empresa: body.empresa,
    email: body.email,
    whatsapp: body.whatsapp,
    total_colaboradores: body.totalColaboradores,
    principais_areas: body.principaisAreas ?? null,
    contratacoes_6m: body.contratacoes6m ?? null,
    desligamentos_6m: body.desligamentos6m ?? null,
    respostas: body.respostas,
    resultado,
    pdf_url: pdfUrl,
    email_enviado: false,
  });

  if (insertError) {
    console.error("Erro ao salvar lead:", insertError);
    // não bloqueia o fluxo — cliente já pode baixar o PDF mesmo que o registro falhe
  }

  // 7. Notifica a Tita por e-mail (não bloqueia a resposta ao cliente se falhar)
  try {
    await enviarNotificacaoLead({
      protocolo,
      nomeResponsavel: body.nomeResponsavel,
      empresa: body.empresa,
      email: body.email,
      whatsapp: body.whatsapp,
      resultado,
      pdfUrl,
    });
    await supabase.from("raiox_leads").update({ email_enviado: true }).eq("protocolo", protocolo);
  } catch (e) {
    console.error("Erro ao enviar e-mail de notificação:", e);
  }

  return NextResponse.json({
    protocolo,
    pdfUrl,
    notaGeral: resultado.notaGeral,
    pilares: resultado.pilares,
  });
}
