// ElevenLabs TTS endpoint - streams audio back to the browser
// Voice IDs: Rachel (21m00Tcm4TlvDq8ikWAM) - warm, professional female
//            Adam (pNInz6obpgDQGcFmaJgB) - confident, clear male
//            Josh (TxGEqnHWrfWFTfGW9XjX) - friendly male

const VOICE_MAP = {
  'AI Solutions Architect':           'TxGEqnHWrfWFTfGW9XjX', // Josh - confident
  'Forward Deployed Engineer':        'TxGEqnHWrfWFTfGW9XjX', // Josh
  'Forward Deployed Product Manager': '21m00Tcm4TlvDq8ikWAM', // Rachel - warm
  'Technical Program Manager':        'pNInz6obpgDQGcFmaJgB', // Adam - authoritative
};

const DEFAULT_VOICE = 'TxGEqnHWrfWFTfGW9XjX';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, role } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ElevenLabs not configured' });

  const voiceId = VOICE_MAP[role] || DEFAULT_VOICE;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.replace(/\*\*/g,'').replace(/\*/g,'').replace(/#{1,3} /g,''),
        model_id: 'eleven_turbo_v2', // fastest, lowest latency
        voice_settings: {
          stability: 0.5,         // 0=more varied, 1=consistent
          similarity_boost: 0.75,
          style: 0.3,             // slight expressiveness
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', err);
      return res.status(500).json({ error: 'TTS failed' });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(Buffer.from(audioBuffer));

  } catch (e) {
    console.error('TTS error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
