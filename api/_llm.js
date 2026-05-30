/**
 * LLM helper — Claude Haiku primary, Groq fallback.
 * Gemini removed: AQ. key format incompatible with REST API after extensive debugging.
 */

const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';

export async function callLLM({ system, userMessages, temperature = 0.4, maxTokens = 600 }) {
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  const groqKey   = process.env.GROQ_API_KEY;

  /* ── 1. Claude Haiku (primary, best quality) ─────────────── */
  if (claudeKey) {
    try {
      const body = {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        messages: userMessages.map(m => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.content,
        })),
      };
      if (system) body.system = system;

      const res = await fetch(CLAUDE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.status === 429 || res.status >= 500) {
        console.warn(`Claude rate limited (${res.status}), falling back to Groq`);
        throw new Error('retry');
      }
      if (!res.ok) throw new Error(data?.error?.message || `Claude HTTP ${res.status}`);

      const text = data?.content?.[0]?.text;
      if (!text) throw new Error('Empty Claude response');
      console.log('Served by: claude-haiku');
      return { text, provider: 'claude-haiku' };

    } catch (err) {
      if (err.message !== 'retry') console.warn('Claude error, falling back to Groq:', err.message);
    }
  }

  /* ── 2. Groq (free fallback) ─────────────────────────────── */
  if (!groqKey) throw new Error('No AI providers configured.');

  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push(...userMessages.map(m => ({
    role: m.role === 'model' ? 'assistant' : m.role,
    content: m.content,
  })));

  const res = await fetch(GROQ_URL, {
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
}
