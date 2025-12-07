/*
  INSTRUÇÕES SQL PARA O SUPABASE:
  
  Execute este SQL no SQL Editor do seu projeto Supabase para criar as tabelas necessárias:

  -- Tabela de Metas
  create table public.goals (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    title text not null,
    type text not null,
    target_value numeric default 0,
    current_value numeric default 0,
    daily_action text,
    last_completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Políticas de Segurança (RLS)
  alter table public.goals enable row level security;

  create policy "Users can view their own goals" 
  on public.goals for select 
  using (auth.uid() = user_id);

  create policy "Users can insert their own goals" 
  on public.goals for insert 
  with check (auth.uid() = user_id);

  create policy "Users can update their own goals" 
  on public.goals for update 
  using (auth.uid() = user_id);

  ---------------------------------------------------------
  IMPORTANTE - CONFIGURAÇÃO DE AUTH (LOGIN AUTOMÁTICO):
  ---------------------------------------------------------
  Para que o usuário entre direto após criar a conta (sem confirmar e-mail):
  1. Vá no Painel do Supabase -> Authentication -> Providers -> Email.
  2. DESMARQUE a opção "Confirm email".
  3. Salve as alterações.
*/

export const SUCCESS_SOUND_B64 = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; // Short blip placeholder

export const TARGET_YEAR = 2026;
export const END_DATE = new Date('2026-12-31T23:59:59');