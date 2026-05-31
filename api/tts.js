// ElevenLabs TTS endpoint - streams audio back to the browser
// Voice IDs: Rachel (21m00Tcm4TlvDq8ikWAM) - warm, professional female
//            Adam (pNInz6obpgDQGcFmaJgB) - confident, clear male
//            Josh (TxGEqnHWrfWFTfGW9XjX) - friendly male

// User's own ElevenLabs voices (free tier compatible)
const VOICES = [
  's3TPKV1kjDlVtZbl4Ksh',
  'NDTYOmYEjbDIVCKB35i3',
  '8Ln42OXYupYsag45MAUy',
  'QTGiyJvep6bcx4WD1qAq',
  'bbGtsRRKUfYO634UxSjz',
  'vZzlAds9NzvLsFSWp0qk',
];

// Assign voices by role — consistent per role, varies by company
const ROLE_VOICE = {
  'AI Solutions Architect':           VOICES[0],
  'Forward Deployed Engineer':        VOICES[1],
  'Forward Deployed Product Manager': VOICES[2],
  'Technical Program Manager':        VOICES[3],
};

const COMPANY_VOICE_OFFSET = {
  Anthropic: 0, OpenAI: 1, Google: 2, Meta: 3, Microsoft: 4, Amazon: 5, Nvidia: 0,
};

const DEFAULT_VOICE = VOICES[0];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, role, company } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY not set');
    return res.status(500).json({ error: 'ElevenLabs not configured' });
  }

  const baseVoice = ROLE_VOICE[role] || DEFAULT_VOICE;
  const offset = COMPANY_VOICE_OFFSET[company] || 0;
  const baseIdx = VOICES.indexOf(baseVoice);
  const voiceId = VOICES[(baseIdx + offset) % VOICES.length];
  console.log(`TTS: role=${role}, company=${company}, voice=${voiceId}, chars=${text?.length}`);

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
