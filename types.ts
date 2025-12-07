export interface User {
  id: string;
  email: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  type: 'Financeiro' | 'Saúde' | 'Estudos' | 'Outro';
  target_value: number; // Ex: 10000 (reais), 365 (dias), etc.
  current_value: number;
  daily_action: string;
  last_completed_at: string | null; // ISO Date
}

// Global definition for canvas-confetti loaded via CDN
declare global {
  interface Window {
    confetti: any;
  }
}
