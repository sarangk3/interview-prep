/**
 * Shared LLM helper — two providers:
 * 1. Gemini 1.5 Flash (primary   — free, fast)
 * 2. Groq Llama 3.3  (fallback   — 14,400 req/day free)
 */

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent`;
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * callLLM({ system, userMessages, temperature, maxTokens })
 * Returns: { text: string, provider: string }
 */
export async function callLLM({ system, userMessages, temperature = 0.4, maxTokens = 600 }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey   = process.env.GROQ_API_KEY;

  /* ── 1. Gemini ──────────────────────────────────────────────
     v1 API doesn't support system_instruction field, so we
     prepend the system prompt to the first user message instead.
  ────────────────────────────────────────────────────────────── */
  if (geminiKey) {
    try {
      // Merge system prompt into first user message
      const msgs = [...userMessages];
      if (system && msgs.length > 0 && msgs[0].role === 'user') {
        msgs[0] = { ...msgs[0], content: `${system}\n\n${msgs[0].content}` };
      } else if (system) {
        msgs.unshift({ role: 'user', content: system });
      }

      // Convert to Gemini content format (alternating user/model)
      const contents = msgs.map(m => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const res = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
      });

      const data = await res.json();

      if (res.status === 429 || res.status >= 500) {
        console.warn(`Gemini rate-limited/unavailable (${res.status}), falling back to Groq`);
        throw new Error('retry_groq');
      }
      if (!res.ok) {
        const msg = data?.error?.message || `Gemini HTTP ${res.status}`;
        console.warn(`Gemini error: ${msg}, falling back to Groq`);
        throw new Error('retry_groq');
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('retry_groq');

      console.log('Served by: gemini');
      return { text, provider: 'gemini' };

    } catch (err) {
      if (err.message !== 'retry_groq') {
        console.warn(`Gemini unexpected error: ${err.message}, falling back to Groq`);
      }
    }
  }

  /* ── 2. Groq ────────────────────────────────────────────── */
  if (!groqKey) throw new Error('No AI API keys configured.');

  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push(...userMessages.map(m => ({
    role: m.role === 'model' ? 'assistant' : m.role,
    content: m.content,
  })));

  const res = await fetch(GROQ_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      temperature,
      messages,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Groq HTTP ${res.status}`);
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty Groq response');

  console.log('Served by: groq');
  return { text, provider: 'groq' };
}
