import { createClient } from '@supabase/supabase-js';

const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Use Sonnet for mock interviews - quality matters here
async function callMockLLM({ system, messages, temperature = 0.7, maxTokens = 400 }) {
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (claudeKey) {
    try {
      const res = await fetch(CLAUDE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': claudeKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: maxTokens,
          system,
          messages: messages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || `Claude HTTP ${res.status}`);
      const text = data?.content?.[0]?.text;
      if (!text) throw new Error('Empty response');
      console.log('Mock served by: claude-sonnet');
      return text;
    } catch (e) {
      console.warn('Sonnet failed, falling back to Groq:', e.message);
    }
  }

  // Groq fallback
  const msgs = system ? [{ role: 'system', content: system }, ...messages] : messages;
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: maxTokens, temperature, messages: msgs.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Groq error');
  console.log('Mock served by: groq (fallback)');
  return data?.choices?.[0]?.message?.content;
}

const COMPANY_CONFIG = {
  Anthropic: {
    style: `You are a senior technical interviewer at Anthropic. You think carefully about safety, tradeoffs, and second-order effects. You push back on overconfident claims. You expect candidates to reason out loud and name their assumptions. You are intellectually rigorous but not hostile.`,
    closing: `At Anthropic we weight careful reasoning and acknowledgment of uncertainty very highly.`,
  },
  OpenAI: {
    style: `You are a senior technical interviewer at OpenAI. You value decisiveness and impact. You push candidates to make concrete decisions rather than endlessly exploring options. You want to know: what would you actually ship, and by when?`,
    closing: `At OpenAI we weight speed of decision-making and practical impact orientation very highly.`,
  },
  Google: {
    style: `You are a senior technical interviewer at Google. You value structured thinking, scale, and measurement. You push for specific metrics, edge case handling, and explicit tradeoffs. You expect STAR-style structure.`,
    closing: `At Google we weight structured thinking, data-driven decisions, and scale awareness very highly.`,
  },
  Meta: {
    style: `You are a senior technical interviewer at Meta. You value pragmatism, user impact, and network effects. You push candidates to think about real user behavior and adoption rather than technical elegance.`,
    closing: `At Meta we weight user impact thinking and pragmatic delivery over perfect engineering very highly.`,
  },
  Microsoft: {
    style: `You are a senior technical interviewer at Microsoft. You value enterprise readiness, compliance awareness, and ecosystem integration. You push candidates to think about how their solution fits into existing enterprise environments.`,
    closing: `At Microsoft we weight enterprise readiness, security, and ecosystem integration very highly.`,
  },
  Amazon: {
    style: `You are a senior technical interviewer at Amazon. You anchor everything to Leadership Principles, especially Customer Obsession, Ownership, and Dive Deep. You push candidates to start with the customer and work backwards. You want specific metrics and clear ownership.`,
    closing: `At Amazon we weight customer-backward thinking, ownership, and specificity about results very highly.`,
  },
  Nvidia: {
    style: `You are a senior technical interviewer at Nvidia. You value deep technical depth, compute efficiency, and developer ecosystem thinking. You push candidates to identify performance bottlenecks and think about hardware constraints.`,
    closing: `At Nvidia we weight technical depth, compute efficiency awareness, and developer experience very highly.`,
  },
};

const MAX_TURNS = 5;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const authHeader = req.headers.authorization;
  let isPro = false;

  if (authHeader?.startsWith('Bearer ') && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const sb = createClient(
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        const { data: prof } = await sb.from('profiles').select('is_pro,pro_expires_at,mocks_completed').eq('id', user.id).single();
        isPro = prof?.is_pro && (!prof?.pro_expires_at || new Date(prof.pro_expires_at) > new Date());

        if (req.body.mode !== 'score') {
          const today = new Date().toISOString().split('T')[0];
          const { data: usage } = await sb.from('daily_usage').select('ai_answers').eq('user_id', user.id).eq('date', today).single();
          const count = usage?.ai_answers || 0;
          const limit = isPro ? 999 : 25;
          if (count >= limit) return res.status(429).json({ error: "You've used all your free AI answers for today. Upgrade to Pro for unlimited." });
          await sb.from('daily_usage').upsert({ user_id: user.id, date: today, ai_answers: count + 1 }, { onConflict: 'user_id,date' });
        }

        if (req.body.mode === 'score' && !isPro) {
          await sb.from('profiles').upsert({
            id: user.id,
            mocks_completed: (prof?.mocks_completed || 0) + 1
          }, { onConflict: 'id' });
        }
      }
    } catch (e) { console.warn('Mock auth check:', e.message); }
  }

  const { mode, messages, role, industry, company = 'Anthropic', turn, openingProblem, keyComponents, hints } = req.body;
  const cfg = COMPANY_CONFIG[company] || COMPANY_CONFIG.Anthropic;
  const industryCtx = industry && industry !== 'General' ? ` in the ${industry} industry` : '';

  try {
    if (mode === 'score') {
      // Only send last 10 messages for scoring - enough context, fewer tokens
      const recentMessages = messages.filter(m => m.role !== 'system').slice(-10);
      const transcript = recentMessages
        .map(m => `${m.role === 'interviewer' ? 'I' : 'C'}: ${m.content}`)
        .join('\n\n');

      const scorePrompt = `Score this ${role} mock interview${industryCtx} at ${company}.

Problem: "${openingProblem}"
Must-cover components:
${(keyComponents || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

Transcript (I=Interviewer, C=Candidate):
${transcript}

Score 1-10 honestly. 2 of 5 components covered = 4-5, not 7. No inflation.

JSON only:
{"structure":0,"depth":0,"problem_solving":0,"adaptability":0,"communication":0,"overall":0,"strengths":["s1","s2"],"improvements":["g1","g2"],"summary":"2 honest sentences.","components_covered":["what they got"],"components_missed":["what they missed"]}`;

      const text = await callMockLLM({
        system: 'Score this mock interview honestly. Return only valid JSON, no markdown.',
        messages: [{ role: 'user', content: scorePrompt }],
        temperature: 0.2,
        maxTokens: 500,
      });

      const match = text.match(/\{[\s\S]*\}/);
      const score = JSON.parse(match ? match[0] : text);
      return res.status(200).json({ score });

    } else {
      // Build a running summary of what candidate has covered so far
      const candidateTurns = messages.filter(m => m.role === 'candidate');
      const coveredSoFar = candidateTurns.map(m => m.content).join(' ');

      // Determine which key components are still unaddressed (rough heuristic)
      const uncoveredComponents = (keyComponents || []).filter(comp => {
        const keywords = comp.toLowerCase().split(' ').filter(w => w.length > 4);
        return !keywords.some(kw => coveredSoFar.toLowerCase().includes(kw));
      });

      const isFirstTurn = turn === 1;
      const isSecondToLast = turn === MAX_TURNS - 1;
      const isFinalTurn = turn >= MAX_TURNS;

      let turnInstruction = '';

      if (isFirstTurn) {
        turnInstruction = `Turn 1 of ${MAX_TURNS}. Quote one specific phrase from their response to show you listened. Identify the biggest gap and probe it. Max 3 sentences + 1 question.`;

      } else if (isFinalTurn) {
        const missed = uncoveredComponents.slice(0, 2).join(' and ');
        turnInstruction = `Final turn ${turn} of ${MAX_TURNS}. Acknowledge their answer in 1 sentence. Then debrief honestly: what they handled well + specifically what key concept was missing (be direct, name it). ${missed ? `They missed: ${missed}.` : 'They covered the key components well.'} Close: "That's all the time we have. Thank you."`;

      } else if (isSecondToLast) {
        const missed = uncoveredComponents[0];
        const hint = hints?.[turn - 1];
        turnInstruction = `Turn ${turn} of ${MAX_TURNS} — second to last. Candidate hasn't addressed: ${missed || 'key depth'}. Guide them directly now — don't hint, ask specifically: ${hint ? `"${hint}"` : `"You haven't addressed [${missed}] — how would you approach that?"`}. 2-3 sentences + 1 direct question.`;

      } else {
        const hint = hints?.[turn - 1];
        turnInstruction = `Turn ${turn} of ${MAX_TURNS}. Reference something specific from their last response before asking your question. ${uncoveredComponents.length > 0 ? `Steer toward: ${uncoveredComponents[0]}.` : 'Push for more depth.'} ${hint ? `If untouched: "${hint}"` : ''} 2-3 sentences + 1 question.`;
      }

      const system = `${role} interviewer at ${company}${industryCtx}. ${cfg.style}

Problem: "${openingProblem}"
Target components (candidate doesn't know these):
${(keyComponents || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

Rules: React to what candidate just said. Never reveal components. No sycophancy ("great answer!"). Warm but rigorous — you want them to succeed but won't let them off the hook. If on track say so briefly then push deeper. If off track redirect kindly.

${turnInstruction}`;

      // Only send last 4 messages — enough context for natural flow, saves tokens
      const recentMessages = messages.filter(m => m.role !== 'system').slice(-4);
      const convMessages = recentMessages.map(m => ({
        role: m.role === 'interviewer' ? 'assistant' : 'user',
        content: m.content,
      }));

      // Shorter max tokens for early turns, more for final debrief
      const maxTok = isFinalTurn ? 350 : 220;
      const text = await callMockLLM({ system, messages: convMessages, temperature: 0.7, maxTokens: maxTok });
      return res.status(200).json({ reply: text.trim() });
    }
  } catch (err) {
    console.error('Mock API error:', err);
    return res.status(502).json({ error: err.message || 'AI service unavailable. Please try again.' });
  }
}
