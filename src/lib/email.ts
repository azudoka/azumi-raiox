import { Resend } from "resend";
import { ResultadoRaioX } from "./scoring";
import { PILARES_LABEL } from "./questions";

export async function enviarNotificacaoLead(params: {
  protocolo: string;
  nomeResponsavel: string;
  empresa: string;
  email: string;
  whatsapp: string;
  resultado: ResultadoRaioX;
  pdfUrl: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { protocolo, nomeResponsavel, empresa, email, whatsapp, resultado, pdfUrl } = params;

  const linhasPilares = (Object.keys(resultado.pilares) as (keyof typeof resultado.pilares)[])
    .map((p) => `<li><strong>${PILARES_LABEL[p]}:</strong> ${resultado.pilares[p].nota}/5 — ${resultado.pilares[p].classificacao}</li>`)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; color:#222; line-height:1.6">
      <h2 style="color:#034C8B">Novo Raio-X recebido — ${protocolo}</h2>
      <p><strong>Empresa:</strong> ${empresa}<br/>
      <strong>Responsável:</strong> ${nomeResponsavel}<br/>
      <strong>E-mail:</strong> ${email}<br/>
      <strong>WhatsApp:</strong> ${whatsapp}</p>

      <p><strong>Nota geral:</strong> ${resultado.notaGeral}/5<br/>
      <strong>Trilha recomendada:</strong> ${resultado.trilha}<br/>
      <strong>Pacote sugerido:</strong> ${resultado.pacoteSugerido}</p>

      <ul>${linhasPilares}</ul>

      <p><a href="${pdfUrl}" style="background:#3B82F6;color:#fff;padding:10px 18px;border-radius:20px;text-decoration:none">Baixar relatório completo (PDF)</a></p>
    </div>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "raiox@azumirh.com.br",
    to: process.env.AZUMI_NOTIFICATION_EMAIL || "contato@azumirh.com.br",
    subject: `Novo Raio-X: ${empresa} — nota ${resultado.notaGeral}/5 (${protocolo})`,
    html,
  });
}
