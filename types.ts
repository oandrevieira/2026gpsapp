export interface User {
  id: string;
  email: string;
}

export type GoalCategory = 'finance' | 'body' | 'mind' | 'custom';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  type: GoalCategory;
  target_value: number; // Usado para financeiro (valor) ou contagem de dias
  current_value: number;
  daily_action: string; // Armazena o subtipo (para body) ou a configuração (para mind) ou texto livre (custom)
  last_completed_at: string | null; // ISO Date
}

// Global definition for canvas-confetti loaded via CDN
declare global {
  interface Window {
    confetti: any;
  }
}