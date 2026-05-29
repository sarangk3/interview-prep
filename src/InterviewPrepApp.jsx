import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_BANK, INDUSTRIES, ROLES } from './questions';

/* ─── Global CSS ───────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { font-family: 'DM Sans', system-ui, sans-serif; background: #060a16; color: #e2e8f0; -webkit-font-smoothing: antialiased; min-height: 100vh; }
    .syne { font-family: 'Syne', sans-serif; }
    textarea, input, button { font-family: 'DM Sans', system-ui, sans-serif; }
    textarea { resize: none; } textarea:focus, input:focus { outline: none; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 4px; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes scalePop { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes recPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(248,113,113,0.5); } 50% { box-shadow: 0 0 0 8px rgba(248,113,113,0); } }
    .mic-live { animation: recPulse 1.4s ease-in-out infinite; }
    .fade-up { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
    .fade-in { animation: fadeIn 0.3s ease both; }
    .scale-pop { animation: scalePop 0.55s cubic-bezier(.22,.68,0,1.2) both; }
    .delay-1 { animation-delay: 0.08s; } .delay-2 { animation-delay: 0.16s; } .delay-3 { animation-delay: 0.24s; }
    .delay-4 { animation-delay: 0.32s; } .delay-5 { animation-delay: 0.40s; } .delay-6 { animation-delay: 0.48s; }
    .spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.15); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
    .role-card { cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
    .role-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .btn { cursor: pointer; border: none; transition: opacity 0.15s ease, transform 0.15s ease; font-weight: 500; }
    .btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
    .btn:active:not(:disabled) { transform: translateY(0); } .btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .nav-btn { cursor: pointer; background: none; border: none; color: #64748b; font-size: 13px; font-weight: 500; padding: 8px 14px; border-radius: 8px; transition: color 0.15s, background 0.15s; display: flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; }
    .nav-btn:hover { color: #e2e8f0; background: rgba(255,255,255,0.06); }
    .mc-option { cursor: pointer; transition: all 0.18s ease; }
    .mc-option:hover { border-color: rgba(255,255,255,0.2) !important; background: rgba(255,255,255,0.05) !important; }
    .seg { cursor: pointer; transition: all 0.2s ease; }
    .chip { cursor: pointer; transition: all 0.18s ease; }
    @media (max-width: 640px) {
      .container { padding-left: 16px !important; padding-right: 16px !important; padding-top: 28px !important; padding-bottom: 40px !important; }
      .navbar-wrap { padding-left: 16px !important; padding-right: 16px !important; }
      .hero-h    { font-size: 27px !important; }
      .q-card    { padding: 24px 20px !important; }
      .q-text    { font-size: 17px !important; }
      .stat-grid { gap: 10px !important; }
      .stat-card { padding: 14px 14px !important; }
      .stat-num  { font-size: 22px !important; }
      .score-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      .sub-grid-2   { grid-template-columns: 1fr !important; }
      .results-hero { gap: 24px !important; padding: 32px 22px !important; flex-direction: column !important; text-align: center; }
      .results-hero .dims { width: 100%; text-align: left; }
      .fmt-card  { min-width: 100% !important; }
      .ind-chip  { min-width: calc(50% - 5px) !important; }
      .full-grid, .quick-grid { grid-template-columns: 1fr !important; }
      .card-pad  { padding: 22px 18px !important; }
      .email-row { flex-direction: column !important; }
      .email-row > input, .email-row > button { width: 100% !important; }
      .nav-title { font-size: 16px !important; }
    }
    @media (max-width: 380px) {
      .ind-chip { min-width: 100% !important; }
    }
  `}</style>
);

/* ─── Role styling ─────────────────────────────────────────────────── */
const ROLE_CFG = {
  'AI Solutions Architect':           { color: '#a78bfa', glow: 'rgba(167,139,250,0.18)', label: 'LLMs, RAG & AI Systems'   },
  'Forward Deployed Engineer':        { color: '#60a5fa', glow: 'rgba(96,165,250,0.18)',  label: 'Embedded Customer Builds' },
  'Forward Deployed Product Manager': { color: '#fbbf24', glow: 'rgba(251,191,36,0.18)',  label: 'Customer-Embedded PM'     },
  'TPM':                              { color: '#f472b6', glow: 'rgba(244,114,182,0.18)', label: 'Programs & Delivery'      },
};
const INDUSTRY_LABEL = {
  'General': 'Role-general questions',
  'Healthcare': 'PHI, HIPAA, EHR/FHIR, clinical workflows',
  'Fintech': 'Ledgers, payments, fraud, compliance',
  'E-commerce': 'Checkout, inventory, peak traffic',
};

const ScoreBar = ({ score, color, animated }) => (
  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
    <div style={{ height: '100%', borderRadius: 4, background: color, width: animated ? `${score*10}%` : '0%',
      transition: 'width 0.9s cubic-bezier(.22,.68,0,1)', boxShadow: `0 0 12px ${color}60` }} />
  </div>
);
const ScoreDimension = ({ label, score, color, animated }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color }}>{score}/10</span>
    </div>
    <ScoreBar score={score} color={color} animated={animated} />
  </div>
);

/* Lightweight SVG score-trend line chart (chronological) */
const ScoreTrendChart = ({ data }) => {
  // data: [{ score, date, color }] in chronological order
  const W = 620, H = 200, padL = 34, padR = 16, padT = 16, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = data.length;
  const x = i => n === 1 ? padL + plotW / 2 : padL + (i * plotW) / (n - 1);
  const y = s => padT + plotH - (s / 10) * plotH;
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.score).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${x(n - 1).toFixed(1)} ${padT + plotH} L ${x(0).toFixed(1)} ${padT + plotH} Z`;
  const gid = 'trendGrad';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 2.5, 5, 7.5, 10].map(g => (
        <g key={g}>
          <line x1={padL} y1={y(g)} x2={W - padR} y2={y(g)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={padL - 8} y={y(g) + 4} fill="#475569" fontSize="11" textAnchor="end" fontFamily="DM Sans, sans-serif">{g}</text>
        </g>
      ))}
      {n > 1 && <path d={areaPath} fill={`url(#${gid})`} />}
      {n > 1 && <path d={linePath} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
      {data.map((d, i) => (
        <circle key={i} cx={x(i)} cy={y(d.score)} r={n === 1 ? 5 : 4} fill={d.color || '#818cf8'} stroke="#0a1020" strokeWidth="2" />
      ))}
    </svg>
  );
};

/* ─── Main App ───────────────────────────────────────────────────────── */
export default function InterviewPrepApp() {
  const [page, setPage]               = useState('home');
  const [interviews, setInterviews]   = useState([]);
  const [savedEmail, setSavedEmail]   = useState(null);
  const [format, setFormat]           = useState('text');
  const [industry, setIndustry]       = useState('General');
  const [role, setRole]               = useState(null);
  const [mode, setMode]               = useState(null);
  const [qIndex, setQIndex]           = useState(0);
  const [response, setResponse]       = useState('');
  const [mcChoice, setMcChoice]       = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [results, setResults]         = useState(null);
  const [allResponses, setAllResponses] = useState([]);
  const [sessionQs, setSessionQs]     = useState([]);
  const [sessionMeta, setSessionMeta] = useState({});
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [emailInput, setEmailInput]   = useState('');
  const [emailDone, setEmailDone]     = useState(false);

  /* ── Speech-to-text ── */
  const [listening, setListening]     = useState(false);
  const recognitionRef = useRef(null);
  const speechSupported = typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const toggleListening = () => {
    if (!speechSupported) return;
    if (listening) { recognitionRef.current && recognitionRef.current.stop(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      let chunk = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) chunk += e.results[i][0].transcript;
      }
      if (chunk) setResponse(prev => (prev ? prev.trimEnd() + ' ' : '') + chunk.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };
  // Stop listening whenever we leave the question/page
  useEffect(() => {
    return () => { if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) {} } };
  }, [qIndex, page]);

  useEffect(() => {
    const saved = localStorage.getItem('ipData');
    if (saved) { const d = JSON.parse(saved); setInterviews(d.interviews || []); setSavedEmail(d.email || null); }
  }, []);
  useEffect(() => {
    if (page === 'results') { const t = setTimeout(() => setBarsAnimated(true), 400); return () => clearTimeout(t); }
    setBarsAnimated(false);
  }, [page]);

  const persist = (ivs, email) => localStorage.setItem('ipData', JSON.stringify({ interviews: ivs, email: email ?? savedEmail }));

  const startInterview = (r, m) => {
    const bank = QUESTION_BANK[industry][r][format];
    const qs = m === 'full' ? bank : [bank[Math.floor(Math.random() * bank.length)]];
    setRole(r); setMode(m); setQIndex(0); setSessionQs(qs);
    setSessionMeta({ role: r, mode: m, format, industry });
    setAllResponses([]); setResponse(''); setMcChoice(null);
    setResults(null); setEmailDone(false); setEmailInput('');
    setPage('interview');
  };

  const submitText = async () => {
    if (!response.trim()) return;
    setSubmitting(true);
    const q = sessionQs[qIndex];
    const industryCtx = industry === 'General' ? '' : ` in the ${industry} industry`;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          messages: [{ role: 'user', content:
`You are a strict, senior interviewer at a top-tier tech company evaluating a candidate for a ${role} role${industryCtx}. You do not inflate scores. You give the score the answer actually deserves.

Scoring scale (apply rigorously):
1-3: Poor — vague, wrong, or shows little understanding
4-5: Below average — some relevant points but major gaps, no structure, or too shallow
6: Average — covers the basics but missing depth, trade-offs, or specifics
7: Good — solid answer with clear structure and relevant detail, minor gaps only
8: Strong — thorough, well-structured, covers trade-offs, shows real experience
9-10: Exceptional — reserve for answers that would impress at FAANG/top startups

A rambling or generic answer that restates the question without substance scores 3-4. Do not give a 6 out of politeness.

Question: "${q}"
Candidate's Answer: "${response}"

Evaluate ruthlessly and honestly across all four dimensions. If the answer is weak, say so clearly in the feedback.
Respond ONLY in this JSON (no markdown):
{"technical_depth":7,"communication_clarity":6,"structure":7,"approach":7,"overall":7,"strengths":["specific strength 1","specific strength 2"],"improvements":["specific gap 1","specific gap 2"],"feedback":"2-3 sentences of direct, honest feedback. Name what was missing or wrong, not just what to improve.","key_points":["A concrete point a strong answer covers","Another key point","A third key point"]}` }],
        }),
      });
      const data = await res.json();
      let fb;
      try { const raw = data.content[0].text; const m2 = raw.match(/\{[\s\S]*\}/); fb = JSON.parse(m2 ? m2[0] : raw); }
      catch { fb = { technical_depth:6, communication_clarity:6, structure:6, approach:6, overall:6,
        strengths:['Clear explanation','Relevant points'], improvements:['Add technical specifics','Use a framework'],
        feedback:'Solid response. Add concrete detail and structure.', key_points:['Lead with a clear structure or framework','Cover the key trade-offs explicitly','Ground claims in a concrete example'] }; }
      const next = [...allResponses, { question: q, answer: response, feedback: fb }];
      setAllResponses(next);
      if (qIndex + 1 < sessionQs.length) { setQIndex(qIndex + 1); setResponse(''); }
      else finishInterview(next, 'text');
    } catch { alert('Error connecting to AI. Check your API key in Vercel settings — or try Multiple Choice mode, which works offline.'); }
    finally { setSubmitting(false); }
  };

  const submitMC = () => {
    if (mcChoice === null) return;
    const q = sessionQs[qIndex];
    const ok = mcChoice === q.correct;
    const next = [...allResponses, { question: q.q, options: q.options, chosen: mcChoice, correct: q.correct, isCorrect: ok, explanation: q.explanation }];
    setAllResponses(next);
    if (qIndex + 1 < sessionQs.length) { setQIndex(qIndex + 1); setMcChoice(null); }
    else finishInterview(next, 'mc');
  };

  const finishInterview = (responses, fmt) => {
    let score;
    if (fmt === 'mc') score = Math.round((responses.filter(r => r.isCorrect).length / responses.length) * 10);
    else score = Math.round(responses.reduce((s, r) => s + r.feedback.overall, 0) / responses.length);
    const iv = { id: Date.now(), role, mode, format: fmt, industry, date: new Date().toISOString(), score, responses };
    const updated = [...interviews, iv];
    setInterviews(updated); persist(updated);
    setResults(responses); setPage('results');
  };

  const stats = () => {
    if (!interviews.length) return null;
    const avg = Math.round(interviews.reduce((s, i) => s + i.score, 0) / interviews.length);
    const byRole = {}; interviews.forEach(i => { byRole[i.role] = (byRole[i.role] || 0) + 1; });
    const top = Object.keys(byRole).sort((a,b) => byRole[b]-byRole[a])[0];
    return { total: interviews.length, avg, byRole, top };
  };

  /* download a copy of the session */
  const buildTranscript = () => {
    const isMC = results[0] && 'isCorrect' in results[0];
    let out = `INTERVIEW PREP — SESSION SUMMARY\n`;
    out += `================================\n`;
    out += `Role:     ${sessionMeta.role}\n`;
    out += `Industry: ${sessionMeta.industry}\n`;
    out += `Format:   ${isMC ? 'Multiple Choice' : 'Text Response'}\n`;
    out += `Date:     ${new Date().toLocaleString()}\n`;
    if (emailInput) out += `Email:    ${emailInput}\n`;
    const score = isMC
      ? Math.round((results.filter(r=>r.isCorrect).length/results.length)*10)
      : Math.round(results.reduce((s,r)=>s+r.feedback.overall,0)/results.length);
    out += `Overall:  ${score}/10\n\n`;
    results.forEach((r, i) => {
      out += `--- Question ${i+1} ---\n${r.question}\n\n`;
      if (isMC) {
        r.options.forEach((o, j) => {
          const tag = j === r.correct ? ' [CORRECT]' : (j === r.chosen ? ' [YOUR PICK]' : '');
          out += `  ${String.fromCharCode(65+j)}. ${o}${tag}\n`;
        });
        out += `\nResult: ${r.isCorrect ? 'Correct' : 'Incorrect'}\nWhy: ${r.explanation}\n\n`;
      } else {
        out += `YOUR ANSWER:\n${r.answer}\n\n`;
        out += `SCORES — Technical ${r.feedback.technical_depth}/10 · Communication ${r.feedback.communication_clarity}/10 · Structure ${r.feedback.structure}/10 · Approach ${r.feedback.approach}/10\n`;
        out += `Strengths: ${r.feedback.strengths.join('; ')}\n`;
        out += `Improve: ${r.feedback.improvements.join('; ')}\n`;
        out += `Feedback: ${r.feedback.feedback}\n`;
        if (r.feedback.key_points && r.feedback.key_points.length) {
          out += `What a strong answer covers:\n`;
          r.feedback.key_points.forEach((kp, j) => { out += `  ${j+1}. ${kp}\n`; });
        }
        out += `\n`;
      }
    });
    return out;
  };
  const downloadCopy = () => {
    const blob = new Blob([buildTranscript()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${sessionMeta.role.replace(/[^a-z]/gi,'')}-${Date.now()}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const submitEmail = () => {
    if (!emailInput.trim()) return;
    setSavedEmail(emailInput.trim());
    persist(interviews, emailInput.trim());
    setEmailDone(true);
    downloadCopy();
  };

  const S = {
    page:  { minHeight: '100vh', background: '#060a16' },
    card:  { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 },
    input: { width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 15 },
    tag:   { fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },
  };
  const meshBg = 'radial-gradient(ellipse 70% 50% at 15% 0%, rgba(99,102,241,0.10), transparent), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(236,72,153,0.08), transparent), #060a16';

  /* ═══ HOME ═══ */
  if (page === 'home') {
    const st = stats();
    return (
      <>
        <GlobalStyles />
        <div style={{ ...S.page, background: meshBg }}>
          <div className="navbar-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="syne" style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Interview Prep</span>
              {st && <button className="nav-btn" onClick={() => setPage('dashboard')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Dashboard
              </button>}
            </div>
          </div>

          <div className="container" style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 32px' }}>
            <div className="fade-up" style={{ marginBottom: 36 }}>
              <h2 className="syne hero-h" style={{ fontSize: 38, fontWeight: 800, color: '#f8fafc', marginBottom: 10, lineHeight: 1.1 }}>
                Practice interviews.<br/>Get real feedback.
              </h2>
              <p style={{ color: '#64748b', fontSize: 16 }}>Pick your format and industry, choose a role, and start. No signup needed.</p>
            </div>

            {/* FORMAT */}
            <div className="fade-up delay-1" style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 12, color: '#475569', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Answer format</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { id: 'text', title: 'Text Response', desc: 'Write full answers, get AI feedback on depth & structure', icon: 'M4 6h16M4 12h16M4 18h10' },
                  { id: 'mc',   title: 'Multiple Choice', desc: 'Pick the best answer, instant scoring & explanations', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' },
                ].map(f => {
                  const active = format === f.id;
                  return (
                    <div key={f.id} className="seg fmt-card" onClick={() => setFormat(f.id)}
                      style={{ flex: 1, minWidth: 240, padding: 20, borderRadius: 16,
                        background: active ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                        border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: active ? '0 0 30px rgba(99,102,241,0.15)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#818cf8' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 600, color: active ? '#f8fafc' : '#94a3b8' }}>{f.title}</span>
                        {active && <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg></div>}
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, paddingLeft: 48 }}>{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INDUSTRY */}
            <div className="fade-up delay-2" style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 12, color: '#475569', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Industry focus</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {INDUSTRIES.map(ind => {
                  const active = industry === ind;
                  return (
                    <div key={ind} className="chip ind-chip" onClick={() => setIndustry(ind)}
                      style={{ padding: '12px 18px', borderRadius: 12, minWidth: 150,
                        background: active ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.02)',
                        border: active ? '1px solid rgba(52,211,153,0.5)' : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: active ? '0 0 24px rgba(52,211,153,0.12)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        {active && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>}
                        <span style={{ fontSize: 14, fontWeight: 600, color: active ? '#f8fafc' : '#94a3b8' }}>{ind}</span>
                      </div>
                      <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.4 }}>{INDUSTRY_LABEL[ind]}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {st && (
              <div className="fade-up delay-2 stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 44 }}>
                {[{ label: 'Interviews', value: st.total }, { label: 'Avg Score', value: `${st.avg}/10` }, { label: 'Top Role', value: st.top?.split(' ')[0] || '—' }].map(s => (
                  <div key={s.label} style={{ ...S.card, padding: '20px 24px' }}>
                    <p style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                    <p className="syne" style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc' }}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* FULL */}
            <div className="fade-up delay-3" style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Full Mock Interview</h3>
                <span style={{ ...S.tag, background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>{industry} · {format === 'mc' ? 'Multiple choice' : 'Text'}</span>
              </div>
              <div className="full-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {ROLES.map((r, i) => {
                  const cfg = ROLE_CFG[r];
                  return (
                    <div key={r} className={`role-card fade-up delay-${Math.min(i+2,6)}`} onClick={() => startInterview(r, 'full')}
                      style={{ ...S.card, padding: 24, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: cfg.glow, filter: 'blur(20px)', pointerEvents: 'none' }} />
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: cfg.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: `1px solid ${cfg.color}30` }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                      </div>
                      <p style={{ fontWeight: 600, fontSize: 15, color: '#f1f5f9', marginBottom: 4 }}>{r}</p>
                      <p style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>{cfg.label}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ ...S.tag, background: cfg.glow, color: cfg.color }}>Start</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUICK */}
            <div className="fade-up delay-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Quick Practice</h3>
                <span style={{ ...S.tag, background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>1 question</span>
              </div>
              <div className="quick-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {ROLES.map(r => {
                  const cfg = ROLE_CFG[r];
                  return (
                    <div key={`q-${r}`} className="role-card" onClick={() => startInterview(r, 'deep')}
                      style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, marginBottom: 8 }} />
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{r}</p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ═══ INTERVIEW ═══ */
  if (page === 'interview') {
    const q = sessionQs[qIndex]; const cfg = ROLE_CFG[role];
    const pct = (qIndex / sessionQs.length) * 100; const isLast = qIndex === sessionQs.length - 1;
    return (
      <>
        <GlobalStyles />
        <div style={{ ...S.page, background: `radial-gradient(ellipse 60% 40% at 80% 0%, ${cfg.glow}, transparent), #060a16` }}>
          <div className="navbar-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
            <div style={{ maxWidth: 760, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="nav-btn" onClick={() => setPage('home')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span style={{ ...S.tag, background: cfg.glow, color: cfg.color }}>{role}</span>
                {industry !== 'General' && <span style={{ ...S.tag, background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>{industry}</span>}
                <span style={{ ...S.tag, background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>{format === 'mc' ? 'MC' : 'Text'}</span>
                <span style={{ fontSize: 13, color: '#475569' }}>{qIndex + 1}/{sessionQs.length}</span>
              </div>
            </div>
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.04)' }}>
            <div style={{ height: '100%', background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}aa)`, width: `${pct}%`, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${cfg.color}` }} />
          </div>

          <div className="container" style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px' }}>
            <div className="fade-up q-card" key={`q-${qIndex}`} style={{ ...S.card, padding: 40, marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: cfg.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Question {qIndex + 1}</p>
              <p className="q-text" style={{ fontSize: 20, lineHeight: 1.6, color: '#f1f5f9' }}>{format === 'mc' ? q.q : q}</p>
            </div>

            {format === 'mc' ? (
              <div className="fade-up delay-1" key={`mc-${qIndex}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {q.options.map((opt, i) => {
                    const sel = mcChoice === i;
                    return (
                      <div key={i} className="mc-option" onClick={() => setMcChoice(i)}
                        style={{ padding: '18px 20px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 16,
                          background: sel ? cfg.glow : 'rgba(255,255,255,0.02)', border: sel ? `1px solid ${cfg.color}` : '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, border: sel ? `2px solid ${cfg.color}` : '2px solid rgba(255,255,255,0.15)',
                          background: sel ? cfg.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: sel ? '#060a16' : '#475569' }}>
                          {sel ? '✓' : String.fromCharCode(65 + i)}
                        </div>
                        <span style={{ fontSize: 15, color: sel ? '#f1f5f9' : '#94a3b8', lineHeight: 1.5 }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                <button className="btn" onClick={submitMC} disabled={mcChoice === null}
                  style={{ width: '100%', padding: '15px', borderRadius: 12, background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, color: '#060a16', fontSize: 15, fontWeight: 700 }}>
                  {isLast ? 'Finish & See Results →' : 'Next Question →'}
                </button>
              </div>
            ) : (
              <div className="fade-up delay-1" key={`txt-${qIndex}`}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 24 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" style={{ marginTop: 1, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>Think out loud. Structure your answer — situation, approach, trade-offs, outcome.</p>
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea style={{ ...S.input, height: 260, fontSize: 15, lineHeight: 1.7, borderRadius: 16, padding: '20px 24px', paddingBottom: 60, background: 'rgba(255,255,255,0.03)',
                    borderColor: listening ? 'rgba(248,113,113,0.5)' : (response.length > 50 ? `${cfg.color}40` : 'rgba(255,255,255,0.08)'), transition: 'border-color 0.3s ease', display: 'block', width: '100%' }}
                    placeholder="Type your answer here, or tap the mic to speak..." value={response} onChange={e => setResponse(e.target.value)} />
                  {speechSupported && (
                    <button className={`btn ${listening ? 'mic-live' : ''}`} onClick={toggleListening} title={listening ? 'Stop recording' : 'Speak your answer'}
                      style={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10,
                        background: listening ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${listening ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.12)'}`, color: listening ? '#f87171' : '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><path d="M12 19v4M8 23h8"/>
                      </svg>
                      {listening ? 'Listening… tap to stop' : 'Speak'}
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ fontSize: 12, color: response.length > 100 ? '#475569' : '#334155' }}>{response.length} characters{response.length > 0 && response.length < 100 && ' — elaborate more'}</span>
                  <button className="btn" onClick={submitText} disabled={submitting || response.trim().length < 10}
                    style={{ padding: '14px 32px', borderRadius: 12, background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, color: '#fff', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {submitting ? (<><span className="spinner" /> Analyzing…</>) : isLast ? 'Finish Interview →' : 'Next Question →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ═══ RESULTS ═══ */
  if (page === 'results' && results) {
    const cfg = ROLE_CFG[role];
    const isMC = results[0] && 'isCorrect' in results[0];
    const avg = isMC ? Math.round((results.filter(r=>r.isCorrect).length/results.length)*10)
                     : Math.round(results.reduce((s,r)=>s+r.feedback.overall,0)/results.length);
    const oc = avg >= 8 ? '#34d399' : avg >= 6 ? '#60a5fa' : avg >= 4 ? '#fbbf24' : '#f87171';
    const ol = avg >= 8 ? 'Excellent' : avg >= 6 ? 'Good' : avg >= 4 ? 'Developing' : 'Needs Work';
    const avgDim = d => Math.round(results.reduce((s,r)=>s+r.feedback[d],0)/results.length);

    return (
      <>
        <GlobalStyles />
        <div style={{ ...S.page, background: `radial-gradient(ellipse 50% 40% at 50% 0%, ${cfg.glow}, transparent), #060a16` }}>
          <div className="navbar-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="nav-btn" onClick={() => setPage('home')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Home
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ ...S.tag, background: cfg.glow, color: cfg.color }}>{role}</span>
                {industry !== 'General' && <span style={{ ...S.tag, background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>{industry}</span>}
              </div>
            </div>
          </div>

          <div className="container" style={{ maxWidth: 800, margin: '0 auto', padding: '48px 32px' }}>
            {/* Hero */}
            <div className="fade-up results-hero" style={{ ...S.card, padding: '48px 40px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', minWidth: 140 }}>
                <div className="scale-pop" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px',
                  background: `conic-gradient(${oc} ${avg*36}deg, rgba(255,255,255,0.05) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${oc}30` }}>
                  <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#0a1020', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="syne" style={{ fontSize: 30, fontWeight: 800, color: oc, lineHeight: 1 }}>{avg}</span>
                    <span style={{ fontSize: 12, color: '#475569' }}>/10</span>
                  </div>
                </div>
                <span style={{ ...S.tag, background: `${oc}20`, color: oc }}>{ol}</span>
              </div>
              <div className="dims" style={{ flex: 1, minWidth: 240 }}>
                <h2 className="syne" style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Interview Complete</h2>
                {isMC ? (
                  <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>You answered <strong style={{ color: '#34d399' }}>{results.filter(r=>r.isCorrect).length}</strong> of {results.length} correctly. Review the explanations below.</p>
                ) : (
                  <div style={{ marginTop: 16 }}>
                    {[{key:'technical_depth',label:'Technical Depth'},{key:'communication_clarity',label:'Communication'},{key:'structure',label:'Structure'},{key:'approach',label:'Problem Approach'}].map(d => (
                      <ScoreDimension key={d.key} label={d.label} score={avgDim(d.key)} color={cfg.color} animated={barsAnimated} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Per question */}
            {results.map((r, i) => (
              <div key={i} className={`fade-up delay-${Math.min(i+1,6)}`} style={{ ...S.card, padding: 32, marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Question {i + 1}</p>
                <p style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 24 }}>{isMC ? r.question : `"${r.question}"`}</p>
                {isMC ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                      {r.options.map((opt, j) => {
                        const corr = j === r.correct, chosen = j === r.chosen;
                        let bg='rgba(255,255,255,0.02)',bd='rgba(255,255,255,0.06)',cl='#64748b',ic=String.fromCharCode(65+j);
                        if (corr){bg='rgba(52,211,153,0.08)';bd='rgba(52,211,153,0.4)';cl='#34d399';ic='✓';}
                        else if(chosen){bg='rgba(248,113,113,0.08)';bd='rgba(248,113,113,0.4)';cl='#f87171';ic='✕';}
                        return (
                          <div key={j} style={{ padding: '14px 18px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14, background: bg, border: `1px solid ${bd}` }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: cl, border: `1.5px solid ${cl}50` }}>{ic}</div>
                            <span style={{ fontSize: 14, color: corr||chosen ? '#e2e8f0' : '#64748b', lineHeight: 1.5 }}>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, borderLeft: `3px solid ${cfg.color}` }}><strong style={{ color: cfg.color }}>Why: </strong>{r.explanation}</p>
                  </>
                ) : (
                  <>
                    <details style={{ marginBottom: 24 }}>
                      <summary style={{ cursor: 'pointer', fontSize: 13, color: '#475569', fontWeight: 600, userSelect: 'none', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>Your answer</summary>
                      <p style={{ marginTop: 12, fontSize: 14, color: '#64748b', lineHeight: 1.7, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, borderLeft: `3px solid ${cfg.color}` }}>{r.answer}</p>
                    </details>
                    <div className="score-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                      {[{key:'technical_depth',label:'Technical'},{key:'communication_clarity',label:'Clarity'},{key:'structure',label:'Structure'},{key:'approach',label:'Approach'}].map(d => (
                        <div key={d.key} style={{ textAlign: 'center', padding: '14px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="syne" style={{ fontSize: 22, fontWeight: 700, color: cfg.color, lineHeight: 1, marginBottom: 6 }}>{r.feedback[d.key]}</p>
                          <p style={{ fontSize: 11, color: '#475569' }}>{d.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="sub-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                      <div style={{ padding: 16, background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)', borderRadius: 12 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#34d399', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Strengths</p>
                        {r.feedback.strengths.map((s, j) => (<p key={j} style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 6, display: 'flex', gap: 8, color: '#34d399' }}><span>+</span>{s}</p>))}
                      </div>
                      <div style={{ padding: 16, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.12)', borderRadius: 12 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#fbbf24', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Improve</p>
                        {r.feedback.improvements.map((s, j) => (<p key={j} style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 6, display: 'flex', gap: 8, color: '#fbbf24' }}><span>→</span>{s}</p>))}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, borderLeft: `3px solid ${cfg.color}40` }}>{r.feedback.feedback}</p>
                    {r.feedback.key_points && r.feedback.key_points.length > 0 && (
                      <div style={{ marginTop: 16, padding: '18px 20px', background: `${cfg.color}0d`, border: `1px solid ${cfg.color}26`, borderRadius: 12 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: cfg.color, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0012 2z"/></svg>
                          What a strong answer covers
                        </p>
                        {r.feedback.key_points.map((kp, j) => (
                          <p key={j} style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8, display: 'flex', gap: 10, color: '#cbd5e1' }}>
                            <span style={{ color: cfg.color, fontWeight: 700, flexShrink: 0 }}>{j + 1}.</span>{kp}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* EMAIL + DOWNLOAD */}
            <div className="fade-up" style={{ ...S.card, padding: 32, marginBottom: 16, marginTop: 8,
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
              {!emailDone ? (
                <>
                  <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Get a copy of your results</h3>
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
                    Add your email and we'll prepare a downloadable copy of your full session — every question, your answers, scores, and feedback.
                  </p>
                  <div className="email-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <input style={{ ...S.input, flex: 1, minWidth: 200 }} type="email" placeholder="you@email.com"
                      value={emailInput} onChange={e => setEmailInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitEmail()} />
                    <button className="btn" onClick={submitEmail} disabled={!emailInput.trim()}
                      style={{ padding: '14px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 15, fontWeight: 600 }}>
                      Get my copy
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>Your copy has downloaded</p>
                    <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Saved to {emailInput}. Check your downloads folder.</p>
                  </div>
                  <button className="btn" onClick={downloadCopy} style={{ padding: '11px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: 14, fontWeight: 600 }}>
                    Download again
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="btn" onClick={() => startInterview(role, mode)} style={{ flex: 1, padding: '15px', borderRadius: 12, background: cfg.glow, color: cfg.color, border: `1px solid ${cfg.color}30`, fontSize: 15, fontWeight: 600 }}>Retry {role}</button>
              <button className="btn" onClick={() => setPage('home')} style={{ flex: 1, padding: '15px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 15, fontWeight: 600 }}>Choose Another Role</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ═══ DASHBOARD ═══ */
  if (page === 'dashboard') {
    const st = stats();
    const recent = [...interviews].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0, 8);
    const maxCount = st ? Math.max(...Object.values(st.byRole), 1) : 1;
    return (
      <>
        <GlobalStyles />
        <div style={{ ...S.page, background: meshBg }}>
          <div className="navbar-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="nav-btn" onClick={() => setPage('home')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
              </button>
              <span className="syne" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Your Progress</span>
              <div style={{ width: 80 }} />
            </div>
          </div>
          <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px' }}>
            {!st ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontSize: 18, color: '#334155', marginBottom: 24 }}>No interviews yet.</p>
                <button className="btn" onClick={() => setPage('home')} style={{ padding: '13px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 15 }}>Start Practicing</button>
              </div>
            ) : (
              <>
                <div className="fade-up stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
                  {[{ label: 'Total Interviews', value: st.total, color: '#6366f1' },{ label: 'Average Score', value: `${st.avg}/10`, color: '#34d399' },{ label: 'Roles Practiced', value: Object.keys(st.byRole).length, color: '#f472b6' }].map(s => (
                    <div key={s.label} style={{ ...S.card, padding: '24px 28px' }}>
                      <p style={{ fontSize: 12, color: '#475569', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                      <p className="syne" style={{ fontSize: 36, fontWeight: 800, color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                {interviews.length >= 2 && (
                  <div className="fade-up delay-1 card-pad" style={{ ...S.card, padding: 32, marginBottom: 24 }}>
                    <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Score Trend</h3>
                    <p style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Your overall score across sessions, oldest to newest.</p>
                    <ScoreTrendChart data={[...interviews].sort((a,b) => new Date(a.date)-new Date(b.date)).map(iv => ({ score: iv.score, color: (ROLE_CFG[iv.role] && ROLE_CFG[iv.role].color) || '#818cf8' }))} />
                  </div>
                )}
                <div className="fade-up delay-1 card-pad" style={{ ...S.card, padding: 32, marginBottom: 24 }}>
                  <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 24 }}>Practice by Role</h3>
                  {ROLES.map(r => {
                    const cfg = ROLE_CFG[r]; const count = st.byRole[r] || 0;
                    return (
                      <div key={r} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: '#94a3b8' }}>{r}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: count > 0 ? cfg.color : '#334155' }}>{count} session{count !== 1 ? 's' : ''}</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 4, background: cfg.color, width: `${(count / maxCount) * 100}%`, transition: 'width 0.9s ease', boxShadow: count > 0 ? `0 0 8px ${cfg.color}60` : 'none' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="fade-up delay-2" style={{ ...S.card, padding: 32 }}>
                  <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 24 }}>Recent Sessions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {recent.map(s => {
                      const cfg2 = ROLE_CFG[s.role]; const sc = s.score >= 8 ? '#34d399' : s.score >= 6 ? '#60a5fa' : '#fbbf24';
                      return (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg2.color }} />
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{s.role} {s.industry && s.industry !== 'General' ? `· ${s.industry}` : ''}</p>
                              <p style={{ fontSize: 12, color: '#334155', marginTop: 2 }}>
                                {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{' · '}{s.format === 'mc' ? 'Multiple choice' : 'Text'}{' · '}{s.mode === 'full' ? '5 Q' : '1 Q'}
                              </p>
                            </div>
                          </div>
                          <span className="syne" style={{ fontSize: 20, fontWeight: 700, color: sc }}>{s.score}/10</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  return null;
}
