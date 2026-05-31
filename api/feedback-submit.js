export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, message, email, page } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

  const token  = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) return res.status(500).json({ error: 'Airtable not configured' });

  const now = new Date();
  const timestamp = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' });

  try {
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/Feedback`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            Type:      type || 'General',
            Message:   message.trim(),
            Email:     email?.trim() || '',
            Page:      page || '',
            Timestamp: timestamp,
          },
        }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Airtable feedback error:', JSON.stringify(data));
      return res.status(500).json({ error: data?.error?.message || 'Could not save feedback' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Feedback submit error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
