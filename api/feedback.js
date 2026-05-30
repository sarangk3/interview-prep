import { callLLM } from './_llm.js';
import { createClient } from '@supabase/supabase-js';

const FREE_LIMIT = 5;   // free users: 5 AI answers/day
const PRO_LIMIT  = 999; // pro users: effectively unlimited

async function logToAirtable(record) {
  const token=process.env.AIRTABLE_TOKEN, baseId=process.env.AIRTABLE_BASE_ID, tableId=process.env.AIRTABLE_TABLE_ID||'Responses';
  if (!token||!baseId) return;
  try { await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`,{method:'POST',headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({records:[{fields:record}]})}); }
  catch(e) { console.error('Airtable error:',e.message); }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  // REQUIRE LOGIN — no anonymous AI access (prevents cost abuse)
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Please sign in to get AI feedback. Multiple choice mode works without an account.' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (error || !user) return res.status(401).json({ error: 'Session expired. Please sign in again.' });

  // Check pro status
  const { data: prof } = await supabase.from('profiles').select('is_pro,pro_expires_at').eq('id', user.id).single();
  const isPro = prof?.is_pro && (!prof?.pro_expires_at || new Date(prof.pro_expires_at) > new Date());
  const limit = isPro ? PRO_LIMIT : FREE_LIMIT;

  // Per-user daily rate limit (Supabase — survives serverless cold starts)
  const today = new Date().toISOString().split('T')[0];
  const { data: usage } = await supabase.from('daily_usage').select('ai_answers').eq('user_id', user.id).eq('date', today).single();
  const count = usage?.ai_answers || 0;

  if (count >= limit) {
    return res.status(429).json({ error: isPro
      ? 'Unusual usage detected. Please try again shortly.'
      : `You've used all ${FREE_LIMIT} free AI answers for today. Upgrade to Pro for unlimited, or use Multiple Choice mode.`
    });
  }

  await supabase.from('daily_usage').upsert({ user_id: user.id, date: today, ai_answers: count + 1 }, { onConflict: 'user_id,date' });

  const { meta = {}, answer = '' } = req.body;
  const { role = '', industry = '', question = '', sessionId = '' } = meta;
  const industryCtx = industry && industry !== 'General' ? ` in the ${industry} industry` : '';

  const prompt = `You are a strict tech interviewer. Score this ${role} answer${industryCtx} honestly. No inflation.

Scale: 1-3 poor | 4-5 below avg | 6 average | 7 good | 8 strong | 9-10 exceptional (rare)
Generic/vague answers = 3-4. Never give 6 out of politeness.

Q: "${question}"
A: "${answer}"

Reply ONLY in JSON, no markdown:
{"technical_depth":0,"communication_clarity":0,"structure":0,"approach":0,"overall":0,"strengths":["s1","s2"],"improvements":["i1","i2"],"feedback":"2-3 direct sentences naming what was missing.","key_points":["point a strong answer covers","another key point","third key point"]}`;

  try {
    const { text, provider } = await callLLM({ userMessages: [{ role: 'user', content: prompt }], temperature: 0.3, maxTokens: 600 });
    console.log(`Feedback served by: ${provider}`);

    let fb;
    try { const m = text.match(/\{[\s\S]*\}/); fb = JSON.parse(m ? m[0] : text); }
    catch { fb = { technical_depth:5, communication_clarity:5, structure:5, approach:5, overall:5, strengths:['Some relevant points'], improvements:['Add specifics','Use a framework'], feedback:'Needs more depth.', key_points:['Use a clear framework','Cover trade-offs','Concrete examples'] }; }

    logToAirtable({ 'Name':`${role} · ${industry} · ${fb.overall}/10`, 'Role':role, 'Industry':industry, 'Format':'text', 'Score':fb.overall, 'Question':question, 'Answer':answer, 'Feedback':fb.feedback, 'Session ID':sessionId, 'Timestamp':new Date().toISOString() });

    return res.status(200).json({ content: [{ text: JSON.stringify(fb) }] });
  } catch (err) {
    console.error('Feedback error:', err);
    return res.status(502).json({ error: err.message || 'AI service unavailable. Please try again.' });
  }
}
