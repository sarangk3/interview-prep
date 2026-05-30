import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Security check — make sure this session belongs to this user
    if (session.metadata?.userId !== user.id) {
      return res.status(403).json({ error: 'Session mismatch' });
    }

    const isSubscription = session.mode === 'subscription';
    // One-time pack expires in 30 days; subscriptions have no expiry (managed by cancellation)
    const proExpiresAt = isSubscription
      ? null
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await supabase.from('profiles').upsert({
      id: user.id,
      is_pro: true,
      pro_expires_at: proExpiresAt,
      stripe_customer_id: session.customer,
      stripe_subscription_id: isSubscription ? session.subscription : null,
    }, { onConflict: 'id' });

    return res.status(200).json({ success: true, isPro: true, proExpiresAt });
  } catch (err) {
    console.error('Confirm upgrade error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
