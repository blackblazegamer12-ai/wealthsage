import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.startsWith('your_'));

export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'https://localhost.invalid',
  isConfigured ? SUPABASE_ANON_KEY : 'demo-mode-disabled'
);
