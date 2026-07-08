-- ══════════════════════════════════════════════════════════════
-- RAIO-X DE MATURIDADE — SCHEMA SUPABASE
-- Projeto NOVO e independente do azumi-site-v1 e do Azumi Forms.
-- Rode este arquivo inteiro no SQL Editor do Supabase (projeto novo).
-- ══════════════════════════════════════════════════════════════

-- Sequence pro protocolo (RX-YYYYMMDD-NNNNN), reinicia sozinha por ser
-- baseada em contador global crescente — não precisa resetar por dia.
create sequence if not exists raiox_protocolo_seq start 1;

-- Função que gera o protocolo no formato RX-20260707-00001
create or replace function gerar_protocolo_raiox()
returns text
language plpgsql
as $$
declare
  hoje text := to_char(now(), 'YYYYMMDD');
  n int := nextval('raiox_protocolo_seq');
begin
  return 'RX-' || hoje || '-' || lpad(n::text, 5, '0');
end;
$$;

-- Tabela principal de leads/diagnósticos
create table if not exists raiox_leads (
  id uuid primary key default gen_random_uuid(),
  protocolo text unique not null,
  created_at timestamptz not null default now(),

  -- dados de contato (client-bar do formulário)
  nome_responsavel text not null,
  empresa text not null,
  email text not null,
  whatsapp text not null,

  -- dados complementares
  total_colaboradores text,
  principais_areas text,
  contratacoes_6m text,
  desligamentos_6m text,
  momento_empresa text,
  junior_no_rh text,

  -- respostas cruas: { [questionId]: { nota: number, texto: string } }
  respostas jsonb not null,

  -- resultado calculado pelo motor de pontuação (ver src/lib/scoring.ts)
  -- { pilares: { estrategia: {nota, classificacao, diagnostico, evidencia}, ... },
  --   tecnologia: {nota, ...}, notaGeral: number, trilha: string, pacoteSugerido: string }
  resultado jsonb not null,

  pdf_url text,
  email_enviado boolean not null default false
);

create index if not exists idx_raiox_leads_created_at on raiox_leads (created_at desc);
create index if not exists idx_raiox_leads_email on raiox_leads (email);

-- Storage bucket público de leitura pros PDFs gerados
insert into storage.buckets (id, name, public)
values ('raiox-relatorios', 'raiox-relatorios', true)
on conflict (id) do nothing;

-- Política: qualquer um pode LER os PDFs (necessário pro cliente baixar via link público)
create policy if not exists "Leitura pública dos relatórios"
  on storage.objects for select
  using (bucket_id = 'raiox-relatorios');

-- Política: só o service role (servidor) pode ESCREVER — nunca o client direto
-- (não precisa de policy de insert pro client porque o upload sempre passa pela API route,
--  que usa a service_role key, que ignora RLS)

alter table raiox_leads enable row level security;

-- Ninguém lê/escreve a tabela de leads direto pelo client (só a API route, com service_role)
-- Não criamos policy de select/insert pra anon/authenticated de propósito.
