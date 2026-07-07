import { createClient } from "@supabase/supabase-js";

// ATENÇÃO: este cliente usa a service_role key — só pode ser importado
// dentro de API routes (código que roda no servidor), NUNCA em
// componentes client ("use client"). A service_role ignora RLS.
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados no .env"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
