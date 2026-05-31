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
      const transcript = messages
        .filter(m => m.role !== 'system')
        .map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
        .join('\n\n');

      const scorePrompt = `You scored a mock ${role} interview${industryCtx} at ${company}.

Opening problem: "${openingProblem}"

Key components a strong answer should cover:
${(keyComponents || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

Full transcript:
${transcript}

Score honestly (1-10). Do not inflate. A candidate who identified 2 of 5 key components gets a 4-5, not a 7.

Reply ONLY in this JSON (no markdown):
{"structure":0,"depth":0,"problem_solving":0,"adaptability":0,"communication":0,"overall":0,"strengths":["s1","s2","s3"],"improvements":["g1","g2","g3"],"summary":"2-3 honest sentences on performance.","components_covered":["what they got right"],"components_missed":["what they missed"]}`;

      const text = await callMockLLM({
        system: 'You are a strict, honest interviewer scoring a mock interview. Return only valid JSON.',
        messages: [{ role: 'user', content: scorePrompt }],
        temperature: 0.2,
        maxTokens: 600,
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
        turnInstruction = `This is the opening turn. The candidate has just given their first response. 
Acknowledge one specific thing they said (quote a phrase back to them to show you listened), then identify the MOST important gap in their answer and probe it with one sharp question.
Keep your response to 3-4 sentences maximum. End with exactly one question.`;

      } else if (isFinalTurn) {
        const missed = uncoveredComponents.slice(0, 2).join(' and ');
        turnInstruction = `This is the final turn (${turn} of ${MAX_TURNS}).
After the candidate answers, do this in order:
1. Acknowledge their final point in one sentence.
2. Give a brief honest debrief (2-3 sentences): what they handled well, and — critically — what key element was missing from their answer. Be specific: name the concept they should have raised.
3. Close warmly: "That's all the time we have. Thank you for walking me through this."

${missed ? `The candidate has not yet addressed: ${missed}. Name this specifically in your debrief.` : 'The candidate covered the key components well — acknowledge this.'}

This debrief is the most valuable part of the interview for the candidate. Be direct and honest, not vague.`;

      } else if (isSecondToLast) {
        const hint = hints && hints[turn - 1] ? hints[turn - 1] : null;
        const missed = uncoveredComponents[0];
        turnInstruction = `This is turn ${turn} of ${MAX_TURNS} — the second-to-last round.
The candidate is running out of turns and has not yet addressed: ${missed || 'key depth in their approach'}.

You must now guide them directly toward it. Do NOT just ask a vague follow-up.
${hint ? `Ask directly: "${hint}"` : `Tell them: "You haven't addressed [specific component] yet — how would you handle that?" Name the exact gap.`}

Be direct. This is their last real chance to demonstrate they understand the full problem.
2-3 sentences, end with one specific question.`;

      } else {
        const hint = hints && hints[turn - 1] ? hints[turn - 1] : null;
        turnInstruction = `This is turn ${turn} of ${MAX_TURNS}.
Build on what the candidate just said — reference something specific from their last response before asking your question. Do NOT repeat questions you already asked.

${uncoveredComponents.length > 0
          ? `The candidate has not addressed: ${uncoveredComponents[0]}. Steer toward this area.`
          : 'Probe for more depth on what they have covered.'}

${hint ? `If they haven't touched on it: "${hint}"` : ''}

Keep it conversational and specific. 2-4 sentences, one question at the end.`;
      }

      const system = `You are a senior interviewer at ${company} conducting a structured mock interview for a ${role} role${industryCtx}.

${cfg.style}

The opening problem you presented: "${openingProblem}"

Key components a strong answer must cover (you know these, the candidate does not):
${(keyComponents || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

INTERVIEW CONDUCT RULES:
- React specifically to what the candidate just said in their most recent response. Always.
- Never reveal the key components list directly.
- Never say "great answer" or be sycophantic. Acknowledge, then push deeper.
- Your tone: warm but rigorous. Like a good mentor who tells you the truth.
- If the candidate is on the right track, confirm it briefly and push to the next level.
- If the candidate is off-track, redirect clearly without being harsh.

${turnInstruction}`;

      const convMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'interviewer' ? 'assistant' : 'user',
          content: m.content,
        }));

      const text = await callMockLLM({ system, messages: convMessages, temperature: 0.7, maxTokens: 350 });
      return res.status(200).json({ reply: text.trim() });
    }
  } catch (err) {
    console.error('Mock API error:', err);
    return res.status(502).json({ error: err.message || 'AI service unavailable. Please try again.' });
  }
}
