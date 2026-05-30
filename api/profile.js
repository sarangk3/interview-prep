import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  // Upsert ensures a profile exists
  const { data: profile } = await supabase.from('profiles')
    .upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true })
    .select()
    .single();

  const { data: fresh } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  // Auto-expire one-time Pro if past expiry date
  if (fresh?.is_pro && fresh?.pro_expires_at && new Date(fresh.pro_expires_at) < new Date()) {
    await supabase.from('profiles').update({ is_pro: false }).eq('id', user.id);
    fresh.is_pro = false;
  }

  return res.status(200).json({ profile: fresh || { id: user.id, is_pro: false, mocks_completed: 0 } });
}
