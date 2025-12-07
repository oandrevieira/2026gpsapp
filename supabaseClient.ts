import { createClient } from '@supabase/supabase-js';

// Usando as credenciais fornecidas no prompt
const SUPABASE_URL = 'https://tkxphruahlrpglntifva.supabase.co';
const SUPABASE_KEY = 'sb_publishable_K_2cSuPBkW8LSgxHZiFNAQ_bKJD5p32';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);