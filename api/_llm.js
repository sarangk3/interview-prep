/**
 * Shared LLM helper.
 * Primary:  Gemini 2.0 Flash via v1beta (free with billing enabled)
 * Fallback: Claude Haiku 4.5 (paid, ~$0.003/call — last resort only)
 * Emergency: Groq Llama 3.3 (free, if both above fail)
 *
 * COST CONTROL: All AI features are gated behind login in the frontend.
 * Anonymous users can only use MC mode (no API calls).
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';

export async function callLLM({ system, userMessages, temperature = 0.4, maxTokens = 600 }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  const groqKey   = process.env.GROQ_API_KEY;

  /* ── 1. Gemini 2.0 Flash (free tier primary) ─────────────────── */
  if (geminiKey) {
    try {
      // Embed system prompt into first user message (most compatible approach)
      const msgs = [...userMessages];
      if (system && msgs.length > 0 && msgs[0].role === 'user') {
        msgs[0] = { ...msgs[0], content: `${system}\n\n---\n\n${msgs[0].content}` };
      } else if (system) {
        msgs.unshift({ role: 'user', content: system });
      }

      const contents = [];
      for (const m of msgs) {
        const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
        // Gemini requires alternating user/model — merge consecutive same-role messages
        if (contents.length > 0 && contents[contents.length-1].role === role) {
          contents[contents.length-1].parts[0].text += '\n\n' + m.content;
        } else {
          contents.push({ role, parts: [{ text: m.content }] });
        }
      }

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
        console.warn(`Gemini unavailable (${res.status}), falling back to Claude`);
        throw new Error('retry');
      }
      if (!res.ok) {
        console.warn(`Gemini error: ${data?.error?.message}, falling back to Claude`);
        throw new Error('retry');
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('retry');

      console.log('Served by: gemini-2.0-flash');
      return { text, provider: 'gemini' };

    } catch (err) {
      if (err.message !== 'retry') console.warn('Gemini unexpected error, trying Claude:', err.message);
    }
  }

  /* ── 2. Claude Haiku (paid fallback — only if Gemini fails) ─── */
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
        method:  'POST',
        headers: { 'Content-Type':'application/json', 'x-api-key':claudeKey, 'anthropic-version':'2023-06-01' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.status === 429 || res.status >= 500) { console.warn('Claude rate limited, trying Groq'); throw new Error('retry'); }
      if (!res.ok) throw new Error(data?.error?.message || `Claude HTTP ${res.status}`);

      const text = data?.content?.[0]?.text;
      if (!text) throw new Error('Empty Claude response');
      console.log('Served by: claude-haiku (fallback)');
      return { text, provider: 'claude-haiku' };

    } catch (err) {
      if (err.message !== 'retry') console.warn('Claude error, trying Groq:', err.message);
    }
  }

  /* ── 3. Groq (emergency fallback, free) ────────────────────── */
  if (!groqKey) throw new Error('No AI providers configured.');

  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push(...userMessages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })));

  const res = await fetch(GROQ_URL, {
    method:  'POST',
    headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${groqKey}` },
    body: JSON.stringify({ model:'llama-3.3-70b-versatile', max_tokens:maxTokens, temperature, messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Groq error');
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty Groq response');
  console.log('Served by: groq (emergency fallback)');
  return { text, provider: 'groq' };
}
