import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  document.getElementById('root').innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;flex-direction:column;gap:12px;color:#374151;">' +
    '<div style="font-size:18px;font-weight:600;">Configuration error</div>' +
    '<div style="font-size:14px;color:#6B7280;">VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in Vercel environment variables.</div>' +
    '</div>';
  throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
