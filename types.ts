export interface User {
  id: string;
  email: string;
}

export type GoalCategory = 'finance' | 'body' | 'mind' | 'custom';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: GoalCategory; // Mudou de 'type' para 'category' para evitar conflitos de palavra reservada SQL se necessário, ou manter coerência
  focus_area: string | null; // 'weight_loss', 'muscle', 'anxiety', 'study'
  target_value: number; 
  current_value: number;
  custom_action: string | null; // Apenas para custom
  last_completed_at: string | null;
}

declare global {
  interface Window {
    confetti: any;
  }
}