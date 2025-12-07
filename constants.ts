/*
  INSTRUÇÕES SQL PARA O SUPABASE:
  
  O schema permanece o mesmo, mas a coluna 'type' agora receberá valores fixos:
  'finance', 'body', 'mind', 'custom'.

  A coluna 'daily_action' agora armazena configurações dependendo do tipo:
  - Finance: (ignorado)
  - Body: 'lose_weight' ou 'hypertrophy'
  - Mind: 'Nome do Hábito|Minutos'
  - Custom: 'Texto da ação'

  -- Tabela de Metas (Caso precise recriar)
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
*/

export const SUCCESS_SOUND_B64 = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; // Short blip placeholder

export const TARGET_YEAR = 2026;
export const END_DATE = new Date('2026-12-31T23:59:59');

// --- LÓGICA HARDCODED PARA SAÚDE ---

export const WEIGHT_LOSS_TASKS = [
  "🚫 Zero Açúcar: Corte doces, refri e sucos hoje.",
  "💧 Hidratação Suprema: Beba 500ml de água antes de cada refeição.",
  "🏃 Cardio Flash: 30 minutos de caminhada rápida ou corrida.",
  "🥗 Jantar Leve: Apenas proteína (frango/ovo) e salada verde.",
  "⏳ Jejum Intermitente: Tente jantar cedo e só comer amanhã.",
  "🚶 Movimento: Troque elevador por escada ou caminhe enquanto fala ao telefone.",
  "🥦 Verde Obrigatório: Metade do prato deve ser vegetais no almoço."
];

export const HYPERTROPHY_TASKS = [
  "🥩 Proteína Alta: Bata sua meta de 2g/kg hoje sem falhar.",
  "🏋️ Falha Mecânica: No treino de hoje, vá até não aguentar mais repetições.",
  "😴 Sono Anabólico: Garanta pelo menos 7h30 de sono hoje.",
  "💊 Creatina: Tome sua dose diária (3g-5g) mesmo sem treino.",
  "🍗 Pós-Treino: Refeição sólida rica em carbo e proteína pós exercício.",
  "💧 Hidratação Muscular: 45ml de água por kg corporal hoje.",
  "🧘 Descanso Ativo: Se não treinar hoje, faça alongamento pesado."
];