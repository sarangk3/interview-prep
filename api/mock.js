/**
 * Mock interview API — two modes:
 * 1. "turn":   Generate next interviewer follow-up based on conversation so far
 * 2. "score":  Generate holistic score for the completed conversation
 */

const DIFFICULTY_CONFIG = {
  easy:   { turns: 3, tone: 'Be encouraging and supportive. Give gentle hints if the candidate seems stuck. Accept high-level answers and build on them constructively. Ask one clarifying question per turn.' },
  medium: { turns: 5, tone: 'Push for specifics where the candidate is vague. Challenge one key assumption per turn. Expect trade-off discussion and structured thinking.' },
  hard:   { turns: 7, tone: 'Aggressively probe weak points immediately. Challenge assumptions. Expect depth, precision, and explicit trade-off reasoning on every point. Do not accept vague answers — push back directly.' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' });

  const { mode, messages, role, industry, difficulty = 'medium', turn, maxTurns, openingProblem } = req.body;
  const cfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const industryCtx = industry && industry !== 'General' ? ` in the ${industry} industry` : '';

  try {
    if (mode === 'score') {
      /* ── Holistic scoring of the full conversation ── */
      const transcript = messages.map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n\n');

      const scorePrompt = `You evaluated a mock interview for a ${role} role${industryCtx}.

Opening problem: "${openingProblem}"

Full conversation:
${transcript}

Score the candidate across these 5 dimensions (1-10, be honest and calibrated):
- structure: How organized and structured was their thinking?
- depth: How deep and specific were their answers?
- problem_solving: How well did they approach and break down the problem?
- adaptability: How well did they respond to follow-up questions and pivot when challenged?
- communication: How clearly did they express their ideas?

Reply ONLY in this JSON (no markdown):
{"structure":7,"depth":6,"problem_solving":7,"adaptability":6,"communication":8,"overall":7,"strengths":["specific strength 1","specific strength 2","specific strength 3"],"improvements":["specific gap 1","specific gap 2","specific gap 3"],"summary":"2-3 sentences summarizing the candidate's performance and the most important thing to work on."}`;

      const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 500,
          temperature: 0.2,
          messages: [{ role: 'user', content: scorePrompt }],
        }),
      });
      const data = await upstream.json();
      if (!upstream.ok) return res.status(upstream.status).json({ error: data?.error?.message || 'AI error.' });
      const raw = data.choices?.[0]?.message?.content || '';
      const match = raw.match(/\{[\s\S]*\}/);
      const score = JSON.parse(match ? match[0] : raw);
      return res.status(200).json({ score });

    } else {
      /* ── Generate next interviewer response ── */
      const isFinalTurn = turn >= maxTurns;
      const systemPrompt = `You are a senior interviewer conducting a mock interview for a ${role} role${industryCtx}.

The opening problem you gave the candidate: "${openingProblem}"

Difficulty level: ${difficulty}
Behavior: ${cfg.tone}

Turn ${turn} of ${maxTurns}.

${isFinalTurn
  ? 'This is the final turn. Acknowledge the candidate\'s answer briefly (1 sentence), then say "That brings us to the end of our session — thank you for your time." Do not ask another question.'
  : `React SPECIFICALLY to what the candidate just said — not a generic follow-up.
${turn === 1 ? 'Acknowledge their approach briefly (1 sentence), then probe the most important gap or assumption in their answer.' : 'Go deeper on a specific detail from their last response. Push further into the technical or strategic complexity.'}
Keep your response to 2-4 sentences ending with ONE clear probing question.`}

Stay in character as the interviewer at all times. Never break character or explain what you are doing.`;

      // Build conversation for Groq — candidate=user, interviewer=assistant
      // Skip the first message (opening problem, already shown) and build alternating turns
      const groqMessages = [];
      // messages[0] is the opening problem (interviewer), skip it
      // then alternate: candidate (user), interviewer (assistant), ...
      for (let i = 1; i < messages.length; i++) {
        groqMessages.push({
          role: messages[i].role === 'candidate' ? 'user' : 'assistant',
          content: messages[i].content,
        });
      }

      const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 300,
          temperature: 0.7,
          messages: [
            { role: 'system', content: systemPrompt },
            ...groqMessages,
          ],
        }),
      });
      const data = await upstream.json();
      if (!upstream.ok) return res.status(upstream.status).json({ error: data?.error?.message || 'AI error.' });
      const reply = data.choices?.[0]?.message?.content?.trim() || 'Could you elaborate on that?';
      return res.status(200).json({ reply });
    }
  } catch (err) {
    console.error('Mock API error:', err);
    return res.status(502).json({ error: 'Failed to reach AI service. Please try again.' });
  }
}
