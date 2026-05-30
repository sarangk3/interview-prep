import { callLLM } from './_llm.js';

const DIFFICULTY_CONFIG = {
  easy:   { turns:3, tone:'Be encouraging and supportive. Give gentle hints if stuck. Accept high-level answers and build constructively. One clarifying question per turn.' },
  medium: { turns:5, tone:'Push for specifics where vague. Challenge one key assumption per turn. Expect trade-off discussion and structured thinking.' },
  hard:   { turns:7, tone:'Aggressively probe weak points. Challenge assumptions immediately. Expect depth, precision, and explicit trade-off reasoning. Do not accept vague answers.' },
};

export default async function handler(req, res) {
  if (req.method!=='POST') return res.status(405).json({error:'Method not allowed.'});

  const { mode, messages, role, industry, difficulty='medium', turn, maxTurns, openingProblem } = req.body;
  const cfg = DIFFICULTY_CONFIG[difficulty]||DIFFICULTY_CONFIG.medium;
  const industryCtx = industry&&industry!=='General'?` in the ${industry} industry`:'';

  try {
    if (mode==='score') {
      const transcript=messages.map(m=>`${m.role==='interviewer'?'Interviewer':'Candidate'}: ${m.content}`).join('\n\n');
      const scorePrompt=`You evaluated a mock interview for a ${role} role${industryCtx}.

Opening problem: "${openingProblem}"

Full conversation:
${transcript}

Score the candidate (1-10, honest and calibrated):
- structure: How organized and structured was their thinking?
- depth: How deep and specific were their answers?
- problem_solving: How well did they approach and break down the problem?
- adaptability: How well did they respond to follow-ups and pivot when challenged?
- communication: How clearly did they express their ideas?

Reply ONLY in JSON (no markdown):
{"structure":7,"depth":6,"problem_solving":7,"adaptability":6,"communication":8,"overall":7,"strengths":["s1","s2","s3"],"improvements":["g1","g2","g3"],"summary":"2-3 sentences summarizing performance and the most important thing to work on."}`;

      const { text } = await callLLM({ userMessages:[{role:'user',content:scorePrompt}], temperature:0.2, maxTokens:500 });
      const match=text.match(/\{[\s\S]*\}/);
      const score=JSON.parse(match?match[0]:text);
      return res.status(200).json({ score });

    } else {
      const isFinalTurn = turn>=maxTurns;
      const system=`You are a senior interviewer conducting a mock interview for a ${role} role${industryCtx}.

The opening problem you gave: "${openingProblem}"

Difficulty: ${difficulty}. ${cfg.tone}

Turn ${turn} of ${maxTurns}.
${isFinalTurn
  ? "This is the final turn. Acknowledge the answer briefly (1 sentence) then say: 'That brings us to the end of our session — thank you for your time.' Do not ask another question."
  : `React SPECIFICALLY to what the candidate just said — not a generic follow-up.
${turn===1?'Acknowledge briefly (1 sentence), then probe the most important gap or assumption.':'Go deeper on a specific detail from their last response.'}
Keep to 2-4 sentences ending with ONE clear probing question.`}

Stay in character as the interviewer. Never break character.`;

      // Build conversation: skip index 0 (opening problem), alternate user/model
      const userMessages=[];
      for(let i=1;i<messages.length;i++){
        userMessages.push({role:messages[i].role==='candidate'?'user':'model',content:messages[i].content});
      }

      const { text } = await callLLM({ system, userMessages, temperature:0.7, maxTokens:300 });
      return res.status(200).json({ reply:text.trim() });
    }
  } catch(err) {
    console.error('Mock API error:',err);
    return res.status(502).json({ error:err.message||'AI service unavailable. Please try again.' });
  }
}
