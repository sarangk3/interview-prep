import { callLLM } from './_llm.js';
import { createClient } from '@supabase/supabase-js';

const DIFFICULTY_CONFIG = {
  easy:   { turns:3, tone:'Be encouraging. Give hints generously if the candidate misses key components. Accept directionally correct answers.' },
  medium: { turns:5, tone:'Challenge gaps but don\'t over-hint. Expect the candidate to reason their way to components without being told directly.' },
  hard:   { turns:7, tone:'Push back sharply on incomplete or incorrect approaches. Do not validate wrong directions. Demand precision and explicit trade-off reasoning.' },
};

export default async function handler(req, res) {
  if (req.method!=='POST') return res.status(405).json({error:'Method not allowed.'});

  const authHeader = req.headers.authorization;
  let isPro = false;

  // Check auth and pro status
  if (authHeader?.startsWith('Bearer ') && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const sb = createClient(process.env.VITE_SUPABASE_URL||process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {auth:{autoRefreshToken:false,persistSession:false}});
      const { data:{ user } } = await sb.auth.getUser(authHeader.replace('Bearer ',''));
      if (user) {
        const { data: prof } = await sb.from('profiles').select('is_pro,pro_expires_at,mocks_completed').eq('id', user.id).single();
        isPro = prof?.is_pro && (!prof?.pro_expires_at || new Date(prof.pro_expires_at) > new Date());

        // Rate limit mock turns (not score requests — those are fast)
        if (req.body.mode !== 'score') {
          const today = new Date().toISOString().split('T')[0];
          const { data:usage } = await sb.from('daily_usage').select('ai_answers').eq('user_id',user.id).eq('date',today).single();
          const count = usage?.ai_answers||0;
          const limit = isPro ? 999 : 20;
          if (count >= limit) return res.status(429).json({ error:"You've used all your free AI answers for today. Upgrade to Pro for unlimited." });
          await sb.from('daily_usage').upsert({user_id:user.id,date:today,ai_answers:count+1},{onConflict:'user_id,date'});
        }

        // On final scoring, increment mocks_completed for free users
        if (req.body.mode === 'score' && !isPro) {
          await sb.from('profiles').upsert({ id: user.id, mocks_completed: (prof?.mocks_completed||0)+1 }, { onConflict:'id' });
        }
      }
    } catch(e) { console.warn('Mock auth check:', e.message); }
  }

  const {
    mode, messages, role, industry, difficulty='medium',
    turn, maxTurns, openingProblem, keyComponents, hints
  } = req.body;

  const cfg = DIFFICULTY_CONFIG[difficulty]||DIFFICULTY_CONFIG.medium;
  const industryCtx = industry&&industry!=='General'?` in the ${industry} industry`:'';

  try {
    if (mode==='score') {
      const transcript=messages.map(m=>`${m.role==='interviewer'?'Interviewer':'Candidate'}: ${m.content}`).join('\n\n');

      const scorePrompt=`You evaluated a mock interview for a ${role} role${industryCtx}.

Opening problem: "${openingProblem}"

Key components a strong answer should cover:
${(keyComponents||[]).map((c,i)=>`${i+1}. ${c}`).join('\n')}

Full conversation:
${transcript}

Score the candidate (1-10, honest and calibrated) and assess which key components they identified:
- structure: How organized and structured was their thinking?
- depth: How deep and specific were their answers?
- problem_solving: How well did they approach and break down the problem?
- adaptability: How well did they respond to follow-ups and pivot when challenged?
- communication: How clearly did they express their ideas?

Also identify which key components the candidate covered vs missed.

Reply ONLY in this JSON (no markdown):
{"structure":7,"depth":6,"problem_solving":7,"adaptability":6,"communication":8,"overall":7,"strengths":["specific s1","specific s2","specific s3"],"improvements":["specific g1","specific g2","specific g3"],"summary":"2-3 sentences on overall performance.","components_covered":["component they got right"],"components_missed":["component they missed"]}`;

      const { text } = await callLLM({ userMessages:[{role:'user',content:scorePrompt}], temperature:0.2, maxTokens:700 });
      const match=text.match(/\{[\s\S]*\}/);
      const score=JSON.parse(match?match[0]:text);
      return res.status(200).json({ score });

    } else {
      const isFinalTurn = turn>=maxTurns;
      // Pick the progressive hint for this turn number (0-indexed from hints array)
      const currentHint = hints && hints[turn-1] ? hints[turn-1] : null;

      const system=`You are a senior interviewer conducting a mock interview for a ${role} role${industryCtx}. You are steering the candidate toward a specific solution.

Opening problem you gave: "${openingProblem}"

The ideal solution has these key components — you know them, the candidate does not:
${(keyComponents||[]).map((c,i)=>`${i+1}. ${c}`).join('\n')}

Your job: ask questions that progressively reveal whether the candidate knows these components. If they miss a component, ask a question that points them toward it WITHOUT revealing the answer directly.

Difficulty: ${difficulty}. ${cfg.tone}

Turn ${turn} of ${maxTurns}.
${isFinalTurn
  ? "This is the final turn. Acknowledge their answer in one sentence, then close: 'That brings us to the end of our session — thank you for your time.' Do not ask another question."
  : `${currentHint ? `If the candidate has NOT addressed this area yet, steer toward it: "${currentHint}"` : 'Probe the most important gap in their answer so far.'}

React SPECIFICALLY to what the candidate just said. ${turn===1?'Acknowledge their opening approach in one sentence, then push on the most critical gap.':'Go deeper on a specific detail they haven\'t fully addressed.'}
2-4 sentences maximum. End with ONE sharp, specific question — not "tell me more", but a pointed question about a specific design decision or tradeoff.`}

Stay in character. Never reveal the ideal solution. Never say "good job" without following it with a harder question.`;

      const userMessages=[];
      for(let i=1;i<messages.length;i++){
        userMessages.push({
          role:messages[i].role==='candidate'?'user':'model',
          content:messages[i].content
        });
      }

      const { text } = await callLLM({ system, userMessages, temperature:0.7, maxTokens:300 });
      return res.status(200).json({ reply:text.trim() });
    }
  } catch(err) {
    console.error('Mock API error:',err);
    return res.status(502).json({ error:err.message||'AI service unavailable. Please try again.' });
  }
}
