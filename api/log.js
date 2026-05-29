/**
 * Logs MC answers to Airtable.
 * Fire-and-forget from the frontend — returns immediately.
 */

async function logToAirtable(record) {
  const token   = process.env.AIRTABLE_TOKEN;
  const baseId  = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID || 'Responses';
  if (!token || !baseId) return;
  try {
    await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: [{ fields: record }] }),
    });
  } catch (e) {
    console.error('Airtable log error:', e.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { sessionId, role, industry, format, question, answer, isCorrect, explanation, options, chosenIndex, correctIndex } = req.body;

  const chosenLabel  = options?.[chosenIndex]  ? `${String.fromCharCode(65 + chosenIndex)}. ${options[chosenIndex]}`  : '';
  const correctLabel = options?.[correctIndex] ? `${String.fromCharCode(65 + correctIndex)}. ${options[correctIndex]}` : '';

  await logToAirtable({
    'Timestamp':       new Date().toISOString(),
    'Session ID':      sessionId || '',
    'Role':            role || '',
    'Industry':        industry || '',
    'Format':          format || 'mc',
    'Question':        question || '',
    'Answer':          chosenLabel,
    'Overall Score':   0,
    'Technical Depth': 0,
    'Communication':   0,
    'Structure':       0,
    'Approach':        0,
    'Feedback':        explanation || '',
    'Strengths':       correctLabel ? `Correct: ${correctLabel}` : '',
    'Improvements':    '',
    'Is Correct (MC)': !!isCorrect,
  });

  return res.status(200).json({ ok: true });
}
