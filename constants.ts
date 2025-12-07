/*
  INSTRUÇÕES SQL PARA O SUPABASE (ATUALIZADO):
  
  Você deve criar/atualizar a tabela 'goals' com estas colunas exatas:

  create table public.goals (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    title text not null,
    category text not null,        -- 'finance', 'body', 'mind', 'custom'
    focus_area text,               -- 'weight_loss', 'muscle', 'anxiety', 'study'
    target_value numeric default 0,
    current_value numeric default 0,
    custom_action text,            -- Para metas customizadas
    last_completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
*/

export const SUCCESS_SOUND_B64 = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; 

export const TARGET_YEAR = 2026;
export const END_DATE = new Date('2026-12-31T23:59:59');

// --- DATABASE DE INTELIGÊNCIA (FAKE AI) ---
export const TASK_DATABASE: Record<string, string[]> = {
  // --- CORPO: PERDA DE PESO ---
  'weight_loss': [
    "🚫 Desafio Zero Açúcar: Nenhum doce ou refrigerante hoje.",
    "💧 Hidratação Master: Beba 1 copo d'água 20min antes de cada refeição.",
    "🏃 Cardio Zone: 30 minutos de caminhada rápida ou corrida leve.",
    "🥗 Jantar Low Carb: Apenas proteína (ovos/carne) e salada verde.",
    "⏳ Jejum 12h: Tente jantar até às 20h e só comer às 08h.",
    "🍺 Zero Álcool: Hoje é dia de detox total para o fígado.",
    "🥔 Troca Inteligente: Substitua o carboidrato do almoço por legumes.",
    "🚶 Movimento Extra: Suba de escada ou estacione longe hoje.",
    "🍽️ Controle de Porção: Coma devagar e pare antes de se sentir cheio.",
    "🍟 Sem Beliscar: Faça apenas as 3 refeições principais, zero lanches.",
    "🥚 Proteína no Café: Comece o dia com ovos ou whey, sem pão.",
    "🥦 Vegetais Primeiro: Coma a salada antes do prato principal.",
    "👟 Desafio 10k Passos: Tente bater essa meta hoje.",
    "🍵 Chá Verde: Tome 1 xícara após o almoço (sem açúcar).",
    "😴 Sono Reparador: Desligue telas 1h antes de dormir."
  ],

  // --- CORPO: GANHO DE MASSA ---
  'muscle': [
    "🥩 Meta de Proteína: Garanta pelo menos 2g de proteína por kg hoje.",
    "🏋️ Treino de Força: Foco na falha mecânica nas últimas repetições.",
    "🍗 Pós-Treino: Carbo + Proteína logo após o exercício.",
    "💊 Creatina: Não esqueça seus 3g-5g sagrados hoje.",
    "📈 Sobrecarga Progressiva: Tente aumentar 1kg ou 1 repetição no treino.",
    "🛌 Descanso Ativo: Durma pelo menos 7h para crescer.",
    "🥤 Refeição Líquida: Adicione um shake calórico entre refeições.",
    "🛑 Zero Cardio Intenso: Poupe energia para o ferro hoje.",
    "💧 Hidratação Muscular: 4L de água para levar nutrientes.",
    "🏋️‍♂️ Foco no Composto: Agachamento, Terra ou Supino hoje."
  ],

  // --- MENTE: ANSIEDADE / ZEN ---
  'anxiety': [
    "🧘 Meditação Express: 5 minutos focando apenas na respiração.",
    "📰 Detox de Notícias: Não abra sites de notícias ou fofoca hoje.",
    "📝 Escrita Terapêutica: Escreva 3 coisas que te preocupam e rasgue o papel.",
    "🙏 Gratidão: Liste 3 coisas simples que deram certo hoje.",
    "🌬️ Respiração 4-7-8: Inspire em 4s, segure 7s, solte em 8s. Repita 4x.",
    "✈️ Modo Avião: 1 hora antes de dormir sem celular.",
    "🚿 Banho Gelado (ou morno): Foque na sensação da água, esteja presente.",
    "🌳 Caminhada sem Fone: 10 min ouvindo apenas os sons da rua/natureza.",
    "🧹 Arrumação Zen: Organize apenas uma gaveta ou mesa.",
    "🧠 Afirmação: Repita 'Eu resolvo uma coisa de cada vez' ao longo do dia."
  ],

  // --- ESTUDOS / PRODUTIVIDADE ---
  'study': [
    "🍅 Pomodoro Clássico: 25min foco total / 5min descanso. Faça 4 ciclos.",
    "📱 Celular na Gaveta: Estude com o celular em outro cômodo.",
    "🗣️ Active Recall: Tente explicar o que estudou em voz alta sem ler.",
    "🔄 Revisão Espaçada: Releia o resumo da semana passada por 10 min.",
    "✍️ Questões Práticas: Faça 10 exercícios antes de ler a teoria.",
    "🧹 Ambiente Limpo: Tire tudo da mesa que não for o material de estudo.",
    "👶 Feynman Technique: Escreva o conceito como se explicasse para uma criança.",
    "🎧 Deep Work: Use ruído branco ou binaural beats para focar.",
    "📅 Planejamento: Defina as 3 metas de estudo de amanhã hoje à noite.",
    "📵 Bloqueio: Use um app para bloquear redes sociais durante o estudo."
  ]
};