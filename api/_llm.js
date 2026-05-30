/**
 * Shared LLM helper — three providers in priority order:
 * 1. Gemini Flash  (primary   — 1,500 req/day free)
 * 2. Groq          (secondary — 14,400 req/day free)
 * 3. OpenRouter    (tertiary  — free models, extra buffer)
 *
 * Auto-falls-through on 429 or 5xx. Users see nothing.
 */

const GEMINI_URL = model =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

const GROQ_URL       = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Best free model on OpenRouter — high quality, no cost
const OPENROUTER_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

/**
 * callLLM({ system, userMessages, temperature, maxTokens })
 * userMessages: [{ role: 'user'|'assistant'|'model', content: string }]
 * Returns: { text: string, provider: string }
 */
export async function callLLM({ system, userMessages, temperature = 0.4, maxTokens = 600 }) {
  const geminiKey    = process.env.GEMINI_API_KEY;
  const groqKey      = process.env.GROQ_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  const errors = [];

  /* ── 1. Gemini Flash ──────────────────────────────────────── */
  if (geminiKey) {
    try {
      const contents = userMessages.map(m => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
      const body = { contents, generationConfig: { temperature, maxOutputTokens: maxTokens } };
      if (system) body.system_instruction = { parts: [{ text: system }] };

      const res  = await fetch(GEMINI_URL('gemini-2.0-flash-lite'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.status === 429 || res.status >= 500) {
        const reason = data?.error?.message || res.status;
        errors.push(`Gemini: ${reason}`);
        console.warn(`Gemini unavailable (${reason}), trying OpenRouter…`);
      } else if (!res.ok) {
        throw new Error(data?.error?.message || `Gemini HTTP ${res.status}`);
      } else {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Empty Gemini response');
        return { text, provider: 'gemini' };
      }
    } catch (err) {
      if (!errors.some(e => e.startsWith('Gemini'))) errors.push(`Gemini: ${err.message}`);
      console.warn('Gemini error, trying OpenRouter:', err.message);
    }
  }

  /* ── 2. OpenRouter (free Llama 3.3 70B) ──────────────────── */
  if (openrouterKey) {
    try {
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      messages.push(...userMessages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })));

      const res  = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterKey}`,
          'HTTP-Referer': 'https://ai-interview.solutions',
          'X-Title': 'AI Interview Prep',
        },
        body: JSON.stringify({ model: OPENROUTER_MODEL, max_tokens: maxTokens, temperature, messages }),
      });
      const data = await res.json();

      if (res.status === 429 || res.status >= 500) {
        const reason = data?.error?.message || res.status;
        errors.push(`OpenRouter: ${reason}`);
        console.warn(`OpenRouter unavailable (${reason}), trying Groq…`);
      } else if (!res.ok) {
        throw new Error(data?.error?.message || `OpenRouter HTTP ${res.status}`);
      } else {
        const text = data?.choices?.[0]?.message?.content;
        if (!text) throw new Error('Empty OpenRouter response');
        console.log('Served by: openrouter');
        return { text, provider: 'openrouter' };
      }
    } catch (err) {
      if (!errors.some(e => e.startsWith('OpenRouter'))) errors.push(`OpenRouter: ${err.message}`);
      console.warn('OpenRouter error, trying Groq:', err.message);
    }
  }

  /* ── 3. Groq (Llama 3.3 70B) ─────────────────────────────── */
  if (groqKey) {
    try {
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      messages.push(...userMessages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })));

      const res  = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: maxTokens, temperature, messages }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error?.message || `Groq HTTP ${res.status}`);
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty Groq response');
      console.log('Served by: groq');
      return { text, provider: 'groq' };
    } catch (err) {
      errors.push(`Groq: ${err.message}`);
      console.error('Groq error:', err.message);
    }
  }

  /* ── All providers failed ────────────────────────────────── */
  throw new Error(`All AI providers unavailable. ${errors.join(' | ')}`);
}
