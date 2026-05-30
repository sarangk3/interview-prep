/**
 * Shared LLM helper — Gemini primary, Groq fallback.
 * Normalizes both APIs to a single interface.
 */

const GEMINI_URL = model =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * callLLM({ system, userMessages, temperature, maxTokens })
 * userMessages: [{role:'user'|'assistant'|'model', content:string}]
 * Returns: { text: string }
 */
export async function callLLM({ system, userMessages, temperature = 0.4, maxTokens = 600 }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey   = process.env.GROQ_API_KEY;

  // ── Try Gemini first ──────────────────────────────────────────
  if (geminiKey) {
    try {
      // Convert to Gemini content format
      const contents = userMessages.map(m => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const body = {
        contents,
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      };
      if (system) {
        body.system_instruction = { parts: [{ text: system }] };
      }

      const res = await fetch(GEMINI_URL('gemini-2.0-flash'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      // Rate-limited or server error → fall through to Groq
      if (res.status === 429 || res.status >= 500) {
        console.warn('Gemini unavailable, falling back to Groq:', res.status);
        throw new Error('gemini_unavailable');
      }

      if (!res.ok) {
        const msg = data?.error?.message || 'Gemini error';
        throw new Error(msg);
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty Gemini response');
      return { text, provider: 'gemini' };

    } catch (err) {
      if (err.message !== 'gemini_unavailable' && !err.message.includes('fetch')) {
        // Real error (not rate limit), bubble up
        if (!groqKey) throw err;
        console.warn('Gemini error, falling back to Groq:', err.message);
      }
    }
  }

  // ── Fallback: Groq ────────────────────────────────────────────
  if (!groqKey) throw new Error('No AI API keys configured.');

  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push(...userMessages.map(m => ({
    role: m.role === 'model' ? 'assistant' : m.role,
    content: m.content,
  })));

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      temperature,
      messages,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Groq error');
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty Groq response');
  return { text, provider: 'groq' };
}
