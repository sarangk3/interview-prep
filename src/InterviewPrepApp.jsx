import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_BANK, INDUSTRIES, ROLES } from './questions';

/* ─── Global Styles ─────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { font-family: 'DM Sans', system-ui, sans-serif; background: #F9FAFB; color: #111827; -webkit-font-smoothing: antialiased; }
    textarea, input, button { font-family: inherit; }
    textarea { resize: none; } textarea:focus, input:focus { outline: none; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes recPulse { 0%,100% { box-shadow:0 0 0 0 rgba(239,68,68,.4); } 50% { box-shadow:0 0 0 6px rgba(239,68,68,0); } }
    .fade-up { animation: fadeUp .35s ease both; }
    .d1{animation-delay:.05s} .d2{animation-delay:.1s} .d3{animation-delay:.15s} .d4{animation-delay:.2s} .d5{animation-delay:.25s}
    .spinner { display:inline-block; width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
    .card { background:#fff; border:1px solid #E5E7EB; border-radius:14px; }
    .btn-primary { background:#6366F1; color:#fff; border:none; cursor:pointer; border-radius:10px; font-weight:600; transition:background .15s,transform .1s; }
    .btn-primary:hover:not(:disabled) { background:#4F46E5; } .btn-primary:disabled { opacity:.4; cursor:not-allowed; }
    .btn-ghost { background:#fff; color:#6B7280; border:1px solid #E5E7EB; cursor:pointer; border-radius:10px; font-weight:500; transition:background .15s; }
    .btn-ghost:hover { background:#F9FAFB; }
    .nav-item { display:flex; align-items:center; gap:10px; width:100%; padding:9px 12px; border-radius:8px; border:none; cursor:pointer; font-size:14px; text-align:left; transition:all .15s; }
    .nav-item:hover { background:#F9FAFB; color:#374151; }
    .nav-item.active { background:#EEF2FF; color:#4F46E5; font-weight:600; }
    .role-card { background:#fff; border:1px solid #E5E7EB; border-radius:12px; padding:18px 20px; cursor:pointer; transition:all .2s; }
    .role-card:hover { border-color:#A5B4FC; box-shadow:0 4px 20px rgba(99,102,241,.1); transform:translateY(-2px); }
    .mc-opt { padding:14px 18px; border-radius:12px; display:flex; align-items:center; gap:14px; cursor:pointer; transition:all .18s; border:1px solid #E5E7EB; background:#fff; }
    .mc-opt:hover { border-color:#A5B4FC; background:#F5F3FF; }
    .mc-opt.selected { border-color:#6366F1; background:#EEF2FF; }
    .chip { padding:6px 16px; border-radius:20px; border:1px solid #E5E7EB; background:#fff; color:#6B7280; font-size:13px; cursor:pointer; transition:all .15s; font-weight:500; }
    .chip.active { border-color:#6366F1; background:#EEF2FF; color:#4F46E5; font-weight:600; }
    .chip:hover:not(.active) { border-color:#A5B4FC; }
    .mic-live { animation: recPulse 1.4s ease-in-out infinite; }
    @media(max-width:768px) {
      .sidebar { display:none !important; }
      .interview-split { flex-direction:column !important; }
      .answer-panel { width:100% !important; border-left:none !important; border-top:1px solid #E5E7EB !important; }
      .main-pad { padding:20px 16px !important; }
      .score-4col { grid-template-columns:repeat(2,1fr) !important; }
      .two-col { grid-template-columns:1fr !important; }
      .role-grid { grid-template-columns:1fr !important; }
    }
  `}</style>
);

/* ─── Constants ─────────────────────────────────────────────────── */
const ROLE_CFG = {
  'AI Solutions Architect':           { color:'#7C3AED', bg:'#F5F3FF', border:'#DDD6FE', icon:'🧠', label:'LLMs, RAG & AI Systems'   },
  'Forward Deployed Engineer':        { color:'#2563EB', bg:'#EFF6FF', border:'#BFDBFE', icon:'⚙️', label:'Embedded Customer Builds' },
  'Forward Deployed Product Manager': { color:'#D97706', bg:'#FFFBEB', border:'#FDE68A', icon:'📋', label:'Customer-Embedded PM'     },
  'TPM':                              { color:'#DC2626', bg:'#FEF2F2', border:'#FECACA', icon:'📊', label:'Programs & Delivery'      },
};
const INDUSTRY_ICONS = { General:'🌐', Healthcare:'🏥', Fintech:'💳', 'E-commerce':'🛒' };
const ROLE_TIPS = {
  'AI Solutions Architect':           'Focus on trade-offs between RAG, fine-tuning, and prompting — not just what you\'d build.',
  'Forward Deployed Engineer':        'Start with discovery and observation. Interviewers want to see your process, not just the solution.',
  'Forward Deployed Product Manager': 'Show how you balance one customer\'s needs against a generalizable product direction.',
  'TPM':                              'Demonstrate how you create clarity from ambiguity. Name specific artifacts and stakeholders.',
};

/* ─── Sub-components ────────────────────────────────────────────── */
const ScorePill = ({ label, value }) => {
  const c = value >= 8 ? '#059669' : value >= 6 ? '#2563EB' : '#D97706';
  const bg = value >= 8 ? '#ECFDF5' : value >= 6 ? '#EFF6FF' : '#FFFBEB';
  const bd = value >= 8 ? '#BBF7D0' : value >= 6 ? '#BFDBFE' : '#FDE68A';
  return (
    <div style={{ textAlign:'center', padding:'14px 8px', background:bg, borderRadius:10, border:`1px solid ${bd}` }}>
      <div style={{ fontSize:24, fontWeight:700, color:c, marginBottom:2 }}>{value}</div>
      <div style={{ fontSize:11, color:'#9CA3AF', fontWeight:500 }}>{label}</div>
    </div>
  );
};

const ScoreBar = ({ score, color }) => (
  <div style={{ height:5, background:'#F3F4F6', borderRadius:4, overflow:'hidden', marginTop:6 }}>
    <div style={{ height:'100%', borderRadius:4, background:color, width:`${score*10}%`, transition:'width .8s ease' }} />
  </div>
);

const ScoreTrendChart = ({ data }) => {
  const W=580, H=180, pL=30, pR=12, pT=12, pB=24;
  const pw=W-pL-pR, ph=H-pT-pB, n=data.length;
  const x = i => n===1 ? pL+pw/2 : pL+(i*pw)/(n-1);
  const y = s => pT+ph-(s/10)*ph;
  const line = data.map((d,i)=>`${i===0?'M':'L'} ${x(i).toFixed(1)} ${y(d.score).toFixed(1)}`).join(' ');
  const area = `${line} L ${x(n-1).toFixed(1)} ${pT+ph} L ${x(0).toFixed(1)} ${pT+ph} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
      <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity=".2"/><stop offset="100%" stopColor="#6366F1" stopOpacity="0"/></linearGradient></defs>
      {[0,2.5,5,7.5,10].map(g=>(
        <g key={g}>
          <line x1={pL} y1={y(g)} x2={W-pR} y2={y(g)} stroke="#F3F4F6" strokeWidth="1"/>
          <text x={pL-6} y={y(g)+4} fill="#9CA3AF" fontSize="10" textAnchor="end">{g}</text>
        </g>
      ))}
      {n>1 && <path d={area} fill="url(#tg)"/>}
      {n>1 && <path d={line} fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
      {data.map((d,i)=><circle key={i} cx={x(i)} cy={y(d.score)} r={4} fill={d.color||'#6366F1'} stroke="#fff" strokeWidth="2"/>)}
    </svg>
  );
};

const Sidebar = ({ page, setPage, interviews, savedEmail }) => {
  const st = interviews.length;
  const avg = st ? Math.round(interviews.reduce((s,i)=>s+i.score,0)/st) : null;
  const items = [
    { id:'home',      label:'Question Bank', icon:'📚' },
    { id:'dashboard', label:'My Progress',   icon:'📈' },
  ];
  return (
    <div className="sidebar" style={{ width:220, background:'#fff', borderRight:'1px solid #E5E7EB', display:'flex', flexDirection:'column', padding:'0 10px', flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:'20px 6px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#6366F1,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>⚡</div>
          <span style={{ fontWeight:700, fontSize:15, color:'#111827' }}>Interview Prep</span>
        </div>
      </div>
      {/* Nav */}
      <div style={{ padding:'14px 0', flex:1 }}>
        <p style={{ fontSize:11, fontWeight:600, color:'#9CA3AF', padding:'0 12px', marginBottom:6, textTransform:'uppercase', letterSpacing:'.06em' }}>Practice</p>
        {items.map(item=>(
          <button key={item.id} className={`nav-item ${page===item.id?'active':''}`} onClick={()=>setPage(item.id)}
            style={{ background: page===item.id?'#EEF2FF':'transparent', color: page===item.id?'#4F46E5':'#6B7280', fontWeight: page===item.id?600:400 }}>
            <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      {/* Stats strip */}
      {st > 0 && (
        <div style={{ margin:'0 0 12px', background:'#F9FAFB', borderRadius:10, border:'1px solid #E5E7EB', padding:'12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
            <span style={{ fontSize:12, color:'#9CA3AF' }}>Sessions</span>
            <span style={{ fontSize:12, fontWeight:600, color:'#374151' }}>{st}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, color:'#9CA3AF' }}>Avg score</span>
            <span style={{ fontSize:12, fontWeight:600, color:'#6366F1' }}>{avg}/10</span>
          </div>
        </div>
      )}
      {/* Plan badge */}
      <div style={{ padding:'0 0 16px' }}>
        <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:'10px 12px' }}>
          <p style={{ fontSize:12, fontWeight:600, color:'#15803D', marginBottom:2 }}>Free Plan</p>
          <p style={{ fontSize:11, color:'#6B7280' }}>Unlimited MC · 20 AI/day</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Main App ───────────────────────────────────────────────────── */
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
  const [elapsed, setElapsed]         = useState(0);
  const [listening, setListening]     = useState(false);
  const recognitionRef = useRef(null);
  const speechSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    const saved = localStorage.getItem('ipData');
    if (saved) { const d = JSON.parse(saved); setInterviews(d.interviews||[]); setSavedEmail(d.email||null); }
  }, []);
  useEffect(() => {
    if (page==='results') { const t=setTimeout(()=>setBarsAnimated(true),400); return ()=>clearTimeout(t); }
    setBarsAnimated(false);
  }, [page]);
  useEffect(() => {
    if (page!=='interview') { setElapsed(0); return; }
    const t = setInterval(()=>setElapsed(e=>e+1), 1000);
    return ()=>clearInterval(t);
  }, [page, qIndex]);
  useEffect(() => { setElapsed(0); }, [qIndex]);
  useEffect(() => {
    return () => { if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e){} } };
  }, [qIndex, page]);

  const persist = (ivs, email) => localStorage.setItem('ipData', JSON.stringify({ interviews:ivs, email:email??savedEmail }));
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const startInterview = (r, m) => {
    const bank = QUESTION_BANK[industry][r][format];
    const qs = m==='full' ? bank : [bank[Math.floor(Math.random()*bank.length)]];
    setRole(r); setMode(m); setQIndex(0); setSessionQs(qs);
    setSessionMeta({ role:r, mode:m, format, industry, sessionId:Math.random().toString(36).slice(2) });
    setAllResponses([]); setResponse(''); setMcChoice(null);
    setResults(null); setEmailDone(false); setEmailInput('');
    setPage('interview');
  };

  const toggleListening = () => {
    if (!speechSupported) return;
    if (listening) { recognitionRef.current?.stop(); return; }
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec = new SR(); rec.continuous=true; rec.interimResults=false; rec.lang='en-US';
    rec.onresult = e => { let chunk=''; for(let i=e.resultIndex;i<e.results.length;i++) if(e.results[i].isFinal) chunk+=e.results[i][0].transcript; if(chunk) setResponse(p=>(p?p.trimEnd()+' ':'')+chunk.trim()); };
    rec.onend = ()=>setListening(false); rec.onerror = ()=>setListening(false);
    recognitionRef.current=rec; rec.start(); setListening(true);
  };

  const submitText = async () => {
    if (!response.trim()) return;
    setSubmitting(true);
    const q = sessionQs[qIndex];
    try {
      const res = await fetch('/api/feedback', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ meta:{ role, industry, question:q, sessionId:sessionMeta.sessionId }, answer:response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||'Request failed.');
      let fb;
      try { const raw=data.content[0].text; const m2=raw.match(/\{[\s\S]*\}/); fb=JSON.parse(m2?m2[0]:raw); }
      catch { fb={technical_depth:5,communication_clarity:5,structure:5,approach:5,overall:5,strengths:['Some relevant points'],improvements:['Add more specifics','Use a framework'],feedback:'Answer needs more depth.',key_points:['Use a clear framework','Cover trade-offs','Give concrete examples']}; }
      const next = [...allResponses,{question:q,answer:response,feedback:fb}];
      setAllResponses(next);
      if (qIndex+1<sessionQs.length) { setQIndex(qIndex+1); setResponse(''); }
      else finishInterview(next,'text');
    } catch(err) { alert((typeof err==='string'?err:err?.message)||'Error getting feedback. Try Multiple Choice mode which works offline.'); }
    finally { setSubmitting(false); }
  };

  const submitMC = () => {
    if (mcChoice===null) return;
    const q = sessionQs[qIndex]; const ok = mcChoice===q.correct;
    const next = [...allResponses,{question:q.q,options:q.options,chosen:mcChoice,correct:q.correct,isCorrect:ok,explanation:q.explanation}];
    setAllResponses(next);
    fetch('/api/log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:sessionMeta.sessionId,role,industry,format:'mc',question:q.q,options:q.options,chosenIndex:mcChoice,correctIndex:q.correct,isCorrect:ok,explanation:q.explanation})}).catch(()=>{});
    if (qIndex+1<sessionQs.length) { setQIndex(qIndex+1); setMcChoice(null); }
    else finishInterview(next,'mc');
  };

  const finishInterview = (responses, fmt2) => {
    let score = fmt2==='mc' ? Math.round((responses.filter(r=>r.isCorrect).length/responses.length)*10) : Math.round(responses.reduce((s,r)=>s+r.feedback.overall,0)/responses.length);
    const iv = {id:Date.now(),role,mode,format:fmt2,industry,date:new Date().toISOString(),score,responses};
    const updated = [...interviews,iv]; setInterviews(updated); persist(updated);
    setResults(responses); setPage('results');
  };

  const buildTranscript = () => {
    const isMC = results[0]&&'isCorrect' in results[0];
    let out = `INTERVIEW PREP — SESSION SUMMARY\n${'='.repeat(34)}\nRole: ${sessionMeta.role}\nIndustry: ${sessionMeta.industry}\nFormat: ${isMC?'Multiple Choice':'Text'}\nDate: ${new Date().toLocaleString()}\n${emailInput?`Email: ${emailInput}\n`:''}\n`;
    results.forEach((r,i)=>{
      out+=`--- Q${i+1} ---\n${r.question}\n\n`;
      if(isMC){ r.options.forEach((o,j)=>{ out+=`  ${String.fromCharCode(65+j)}. ${o}${j===r.correct?' [CORRECT]':j===r.chosen?' [YOUR PICK]':''}\n`; }); out+=`\nResult: ${r.isCorrect?'Correct':'Incorrect'}\nWhy: ${r.explanation}\n\n`; }
      else { out+=`YOUR ANSWER:\n${r.answer}\n\nSCORES: Tech ${r.feedback.technical_depth} · Clarity ${r.feedback.communication_clarity} · Structure ${r.feedback.structure} · Approach ${r.feedback.approach} · Overall ${r.feedback.overall}\nStrengths: ${r.feedback.strengths.join('; ')}\nImprove: ${r.feedback.improvements.join('; ')}\nFeedback: ${r.feedback.feedback}\n\n`; }
    });
    return out;
  };

  const downloadCopy = () => {
    const blob=new Blob([buildTranscript()],{type:'text/plain'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a');
    a.href=url; a.download=`interview-${(sessionMeta.role||'session').replace(/[^a-z]/gi,'')}-${Date.now()}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const submitEmail = () => {
    if (!emailInput.trim()) return;
    setSavedEmail(emailInput.trim()); persist(interviews, emailInput.trim());
    setEmailDone(true); downloadCopy();
  };

  const stats = () => {
    if (!interviews.length) return null;
    const avg=Math.round(interviews.reduce((s,i)=>s+i.score,0)/interviews.length);
    const byRole={}; interviews.forEach(i=>{byRole[i.role]=(byRole[i.role]||0)+1;});
    return { total:interviews.length, avg, byRole };
  };

  /* ═══════════════════════════════════════════════════
     HOME
  ═══════════════════════════════════════════════════ */
  const HomePage = () => (
    <div className="main-pad" style={{ maxWidth:820, margin:'0 auto', padding:'36px 32px' }}>
      <div className="fade-up" style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:700, color:'#111827', marginBottom:6 }}>Practice Interviews</h1>
        <p style={{ color:'#6B7280', fontSize:15 }}>Choose your format and industry, then pick a role to begin.</p>
      </div>

      {/* Format */}
      <div className="fade-up d1" style={{ marginBottom:24 }}>
        <p style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:10 }}>Answer format</p>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {[{id:'text',label:'Written Response',desc:'AI scores your answer in depth'},
            {id:'mc',  label:'Multiple Choice',  desc:'Instant scoring, works offline'}].map(f=>(
            <div key={f.id} onClick={()=>setFormat(f.id)} style={{ flex:1, minWidth:200, padding:'14px 16px', borderRadius:10, cursor:'pointer',
              border:format===f.id?'2px solid #6366F1':'1px solid #E5E7EB', background:format===f.id?'#F5F3FF':'#fff', transition:'all .15s' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:14, fontWeight:600, color:format===f.id?'#4F46E5':'#111827' }}>{f.label}</span>
                {format===f.id && <div style={{ width:16, height:16, borderRadius:'50%', background:'#6366F1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#fff' }}>✓</div>}
              </div>
              <p style={{ fontSize:12, color:'#9CA3AF' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Industry */}
      <div className="fade-up d2" style={{ marginBottom:28 }}>
        <p style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:10 }}>Industry focus</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {INDUSTRIES.map(ind=>(
            <button key={ind} className={`chip ${industry===ind?'active':''}`} onClick={()=>setIndustry(ind)}>
              {INDUSTRY_ICONS[ind]} {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Full interview */}
      <div className="fade-up d3" style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <h2 style={{ fontSize:16, fontWeight:600, color:'#111827' }}>Full Mock Interview</h2>
          <span style={{ fontSize:11, background:'#F3F4F6', color:'#6B7280', padding:'3px 10px', borderRadius:20, fontWeight:500 }}>5 questions</span>
        </div>
        <div className="role-grid" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
          {ROLES.map(r=>{
            const cfg=ROLE_CFG[r];
            return (
              <div key={r} className="role-card" onClick={()=>startInterview(r,'full')}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:cfg.bg, border:`1px solid ${cfg.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{cfg.icon}</div>
                  <span style={{ fontSize:11, color:'#9CA3AF', background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:20, padding:'3px 10px' }}>5 Qs</span>
                </div>
                <p style={{ fontWeight:600, fontSize:14, color:'#111827', marginBottom:4 }}>{r}</p>
                <p style={{ fontSize:12, color:'#9CA3AF', marginBottom:14 }}>{cfg.label}</p>
                <span style={{ fontSize:12, color:'#6366F1', fontWeight:600 }}>Start →</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick practice */}
      <div className="fade-up d4">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <h2 style={{ fontSize:16, fontWeight:600, color:'#111827' }}>Quick Practice</h2>
          <span style={{ fontSize:11, background:'#F3F4F6', color:'#6B7280', padding:'3px 10px', borderRadius:20, fontWeight:500 }}>1 question</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
          {ROLES.map(r=>{
            const cfg=ROLE_CFG[r];
            return (
              <div key={r} className="role-card" onClick={()=>startInterview(r,'deep')}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px' }}>
                <div>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:cfg.color, marginBottom:8 }}/>
                  <p style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{r.split(' ')[0]}</p>
                </div>
                <span style={{ color:'#D1D5DB', fontSize:16 }}>›</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     INTERVIEW
  ═══════════════════════════════════════════════════ */
  const InterviewPage = () => {
    const q = sessionQs[qIndex]; const cfg = ROLE_CFG[role];
    const isLast = qIndex===sessionQs.length-1;
    const wc = response.trim().split(/\s+/).filter(Boolean).length;
    return (
      <div className="interview-split" style={{ display:'flex', flex:1, height:'100%', overflow:'hidden' }}>
        {/* Left — question */}
        <div style={{ flex:1, padding:'32px', overflowY:'auto', borderRight:'1px solid #E5E7EB' }}>
          {/* Breadcrumb + progress */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, flexWrap:'wrap' }}>
            <button className="btn-ghost" onClick={()=>setPage('home')} style={{ padding:'5px 12px', fontSize:13 }}>← Back</button>
            <span style={{ color:'#E5E7EB' }}>|</span>
            <div style={{ padding:'3px 10px', borderRadius:20, background:cfg.bg, border:`1px solid ${cfg.border}`, fontSize:12, fontWeight:600, color:cfg.color }}>{role}</div>
            <div style={{ padding:'3px 10px', borderRadius:20, background:'#F9FAFB', border:'1px solid #E5E7EB', fontSize:12, color:'#6B7280' }}>{industry}</div>
            <span style={{ fontSize:12, color:'#9CA3AF', marginLeft:'auto' }}>Q{qIndex+1} of {sessionQs.length}</span>
          </div>
          {/* Progress bar */}
          <div style={{ height:4, background:'#F3F4F6', borderRadius:4, marginBottom:24 }}>
            <div style={{ height:'100%', borderRadius:4, background:'#6366F1', width:`${((qIndex)/sessionQs.length)*100}%`, transition:'width .5s ease' }}/>
          </div>

          {/* Question card */}
          <div className="fade-up card" key={`q-${qIndex}`} style={{ padding:'24px', marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:600, color:'#9CA3AF', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:16 }}>Question {qIndex+1}</p>
            <p style={{ fontSize:18, lineHeight:1.65, color:'#111827' }}>{format==='mc'?q.q:q}</p>
          </div>

          {/* Tip */}
          {ROLE_TIPS[role] && (
            <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, padding:'12px 16px', display:'flex', gap:10 }}>
              <span style={{ flexShrink:0 }}>💡</span>
              <p style={{ fontSize:13, color:'#92400E', lineHeight:1.5 }}><strong>Tip:</strong> {ROLE_TIPS[role]}</p>
            </div>
          )}
        </div>

        {/* Right — answer */}
        <div className="answer-panel" style={{ width:400, padding:'32px 28px', display:'flex', flexDirection:'column', background:'#fff', overflowY:'auto', flexShrink:0 }}>
          {format==='mc' ? (
            <>
              <p style={{ fontSize:14, fontWeight:600, color:'#374151', marginBottom:16 }}>Select the best answer</p>
              <div style={{ display:'flex', flexDirection:'column', gap:10, flex:1 }}>
                {q.options.map((opt,i)=>(
                  <div key={i} className={`mc-opt ${mcChoice===i?'selected':''}`} onClick={()=>setMcChoice(i)}
                    style={{ borderColor:mcChoice===i?'#6366F1':'#E5E7EB', background:mcChoice===i?'#EEF2FF':'#fff' }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700,
                      background:mcChoice===i?'#6366F1':'#F9FAFB', color:mcChoice===i?'#fff':'#6B7280', border:`1.5px solid ${mcChoice===i?'#6366F1':'#E5E7EB'}` }}>
                      {mcChoice===i?'✓':String.fromCharCode(65+i)}
                    </div>
                    <span style={{ fontSize:14, color:mcChoice===i?'#111827':'#4B5563', lineHeight:1.5 }}>{opt}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={submitMC} disabled={mcChoice===null} style={{ marginTop:20, width:'100%', padding:'13px', fontSize:15 }}>
                {isLast?'Finish & See Results →':'Next Question →'}
              </button>
            </>
          ) : (
            <>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <p style={{ fontSize:14, fontWeight:600, color:'#374151' }}>Your Answer</p>
                <div style={{ display:'flex', alignItems:'center', gap:6, background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:8, padding:'5px 10px' }}>
                  <span style={{ fontSize:12 }}>⏱</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#374151', fontVariantNumeric:'tabular-nums' }}>{fmt(elapsed)}</span>
                </div>
              </div>
              <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column' }}>
                <textarea
                  value={response} onChange={e=>setResponse(e.target.value)}
                  placeholder="Walk through your approach here. Think out loud — how you structure your answer matters as much as the content..."
                  style={{ flex:1, minHeight:280, padding:'16px', paddingBottom:52, border:'1px solid #E5E7EB', borderRadius:12, fontSize:14, lineHeight:1.7,
                    color:'#111827', background:'#F9FAFB', transition:'border-color .2s', display:'block', width:'100%',
                    borderColor: listening?'#FCA5A5': response.length>100?'#A5B4FC':'#E5E7EB' }}
                />
                {speechSupported && (
                  <button className={`btn-ghost ${listening?'mic-live':''}`} onClick={toggleListening}
                    style={{ position:'absolute', left:12, bottom:12, display:'flex', alignItems:'center', gap:6, padding:'6px 12px', fontSize:12, fontWeight:600,
                      borderColor:listening?'#FCA5A5':'#E5E7EB', color:listening?'#EF4444':'#9CA3AF' }}>
                    🎤 {listening?'Listening…':'Speak'}
                  </button>
                )}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8, marginBottom:12 }}>
                <span style={{ fontSize:12, color: wc>50?'#9CA3AF':'#D1D5DB' }}>{wc} words{wc>0&&wc<50?' — try to elaborate':''}</span>
              </div>
              <button className="btn-primary" onClick={submitText} disabled={submitting||response.trim().length<10} style={{ width:'100%', padding:'13px', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {submitting?(<><span className="spinner"/>Analyzing…</>):isLast?'Finish Interview →':'Next Question →'}
              </button>
              <button className="btn-ghost" onClick={()=>setPage('home')} style={{ marginTop:8, width:'100%', padding:'11px', fontSize:14 }}>Cancel</button>
            </>
          )}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════
     RESULTS
  ═══════════════════════════════════════════════════ */
  const ResultsPage = () => {
    if (!results) return null;
    const cfg = ROLE_CFG[role];
    const isMC = results[0]&&'isCorrect' in results[0];
    const avg = isMC ? Math.round((results.filter(r=>r.isCorrect).length/results.length)*10) : Math.round(results.reduce((s,r)=>s+r.feedback.overall,0)/results.length);
    const oc = avg>=8?'#059669':avg>=6?'#2563EB':'#D97706';
    const ol = avg>=8?'Excellent':avg>=6?'Good':avg>=4?'Developing':'Needs Work';
    const avgDim = d => Math.round(results.reduce((s,r)=>s+r.feedback[d],0)/results.length);
    return (
      <div className="main-pad" style={{ maxWidth:760, margin:'0 auto', padding:'36px 32px', overflowY:'auto' }}>
        {/* Header */}
        <div className="fade-up" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:16 }}>
          <div>
            <button className="btn-ghost" onClick={()=>setPage('home')} style={{ padding:'5px 12px', fontSize:13, marginBottom:12 }}>← Home</button>
            <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:4 }}>Interview Feedback</h1>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <span style={{ fontSize:12, background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.color, padding:'3px 10px', borderRadius:20, fontWeight:600 }}>{role}</span>
              <span style={{ fontSize:12, background:'#F9FAFB', border:'1px solid #E5E7EB', color:'#6B7280', padding:'3px 10px', borderRadius:20 }}>{industry} · {isMC?'Multiple Choice':'Written'}</span>
            </div>
          </div>
          <div className="card" style={{ textAlign:'center', padding:'16px 28px', borderRadius:14 }}>
            <div style={{ fontSize:40, fontWeight:700, color:oc, lineHeight:1 }}>{avg}</div>
            <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>out of 10</div>
            <div style={{ fontSize:12, fontWeight:600, color:oc, marginTop:4 }}>{ol}</div>
          </div>
        </div>

        {/* Score breakdown */}
        {!isMC && (
          <div className="card fade-up d1 score-4col" style={{ padding:'20px 24px', marginBottom:16, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            <ScorePill label="Technical"  value={avgDim('technical_depth')}      />
            <ScorePill label="Clarity"    value={avgDim('communication_clarity')} />
            <ScorePill label="Structure"  value={avgDim('structure')}             />
            <ScorePill label="Approach"   value={avgDim('approach')}              />
          </div>
        )}
        {isMC && (
          <div className="card fade-up d1" style={{ padding:'18px 24px', marginBottom:16, background:'#F0FDF4', border:'1px solid #BBF7D0' }}>
            <p style={{ fontSize:14, color:'#166534' }}>You answered <strong>{results.filter(r=>r.isCorrect).length}</strong> of {results.length} correctly. Review the explanations below to understand the reasoning.</p>
          </div>
        )}

        {/* Per-question */}
        {results.map((r,i)=>(
          <div key={i} className={`card fade-up d${Math.min(i+2,5)}`} style={{ padding:'22px 24px', marginBottom:14 }}>
            <p style={{ fontSize:11, fontWeight:600, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:10 }}>Question {i+1}</p>
            <p style={{ fontSize:15, color:'#374151', lineHeight:1.6, marginBottom:18, fontStyle:isMC?'normal':'italic' }}>{isMC?r.question:`"${r.question}"`}</p>
            {isMC ? (
              <>
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                  {r.options.map((opt,j)=>{
                    const isCorr=j===r.correct, isChosen=j===r.chosen;
                    return (
                      <div key={j} style={{ padding:'12px 16px', borderRadius:10, display:'flex', alignItems:'center', gap:12,
                        background:isCorr?'#F0FDF4':isChosen?'#FEF2F2':'#F9FAFB',
                        border:`1px solid ${isCorr?'#BBF7D0':isChosen?'#FECACA':'#E5E7EB'}` }}>
                        <div style={{ width:24, height:24, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700,
                          background:isCorr?'#22C55E':isChosen?'#EF4444':'#E5E7EB', color:'#fff' }}>
                          {isCorr?'✓':isChosen?'✕':String.fromCharCode(65+j)}
                        </div>
                        <span style={{ fontSize:13, color:isCorr?'#166534':isChosen?'#991B1B':'#6B7280', lineHeight:1.4 }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:10, padding:'12px 16px' }}>
                  <span style={{ fontSize:12, fontWeight:600, color:'#1D4ED8' }}>Why: </span>
                  <span style={{ fontSize:13, color:'#1E40AF' }}>{r.explanation}</span>
                </div>
              </>
            ) : (
              <>
                <details style={{ marginBottom:16 }}>
                  <summary style={{ fontSize:13, color:'#9CA3AF', fontWeight:600, cursor:'pointer', userSelect:'none', listStyle:'none', display:'flex', alignItems:'center', gap:6 }}>
                    <span>›</span> Your answer
                  </summary>
                  <p style={{ marginTop:10, fontSize:13, color:'#6B7280', lineHeight:1.7, padding:'14px', background:'#F9FAFB', borderRadius:8, borderLeft:`3px solid ${cfg.color}` }}>{r.answer}</p>
                </details>
                <div className="score-4col" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
                  {[{k:'technical_depth',l:'Technical'},{k:'communication_clarity',l:'Clarity'},{k:'structure',l:'Structure'},{k:'approach',l:'Approach'}].map(d=>(
                    <ScorePill key={d.k} label={d.l} value={r.feedback[d.k]}/>
                  ))}
                </div>
                <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                  <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:'14px 16px' }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#15803D', marginBottom:10, textTransform:'uppercase', letterSpacing:'.05em' }}>What worked</p>
                    {r.feedback.strengths.map((s,j)=><div key={j} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:'#22C55E', fontWeight:700, flexShrink:0 }}>+</span><p style={{ fontSize:13, color:'#166534', lineHeight:1.5 }}>{s}</p></div>)}
                  </div>
                  <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, padding:'14px 16px' }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#B45309', marginBottom:10, textTransform:'uppercase', letterSpacing:'.05em' }}>To improve</p>
                    {r.feedback.improvements.map((s,j)=><div key={j} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:'#F59E0B', fontWeight:700, flexShrink:0 }}>→</span><p style={{ fontSize:13, color:'#78350F', lineHeight:1.5 }}>{s}</p></div>)}
                  </div>
                </div>
                <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', marginBottom:14 }}>
                  <p style={{ fontSize:13, color:'#374151', lineHeight:1.7 }}>{r.feedback.feedback}</p>
                </div>
                {r.feedback.key_points?.length>0 && (
                  <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:10, padding:'14px 16px' }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#1D4ED8', marginBottom:10, textTransform:'uppercase', letterSpacing:'.05em', display:'flex', alignItems:'center', gap:6 }}>💡 What a strong answer covers</p>
                    {r.feedback.key_points.map((kp,j)=><div key={j} style={{ display:'flex', gap:10, marginBottom:6 }}><span style={{ fontWeight:700, color:'#3B82F6', flexShrink:0 }}>{j+1}.</span><p style={{ fontSize:13, color:'#1E40AF', lineHeight:1.5 }}>{kp}</p></div>)}
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {/* Email + download */}
        <div className="card fade-up" style={{ padding:'22px 24px', marginBottom:14 }}>
          {!emailDone ? (
            <>
              <p style={{ fontSize:15, fontWeight:600, color:'#111827', marginBottom:4 }}>Get a copy of your results</p>
              <p style={{ fontSize:13, color:'#9CA3AF', marginBottom:16 }}>Enter your email to download a full transcript of this session.</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <input type="email" placeholder="you@email.com" value={emailInput} onChange={e=>setEmailInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submitEmail()}
                  style={{ flex:1, minWidth:180, padding:'10px 14px', border:'1px solid #E5E7EB', borderRadius:8, fontSize:14, color:'#111827', background:'#F9FAFB' }}/>
                <button className="btn-primary" onClick={submitEmail} disabled={!emailInput.trim()} style={{ padding:'10px 20px', fontSize:14 }}>Download</button>
              </div>
            </>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'#F0FDF4', border:'1px solid #BBF7D0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✅</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:600, color:'#111827' }}>Download started</p>
                <p style={{ fontSize:13, color:'#9CA3AF', marginTop:2 }}>Check your downloads folder.</p>
              </div>
              <button className="btn-ghost" onClick={downloadCopy} style={{ padding:'8px 16px', fontSize:13 }}>Download again</button>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn-primary" onClick={()=>startInterview(role,mode)} style={{ flex:1, padding:'13px', fontSize:14 }}>Retry {role.split(' ')[0]}</button>
          <button className="btn-ghost" onClick={()=>setPage('home')} style={{ flex:1, padding:'13px', fontSize:14 }}>Choose Another Role</button>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════
     DASHBOARD
  ═══════════════════════════════════════════════════ */
  const DashboardPage = () => {
    const st = stats();
    const recent = [...interviews].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8);
    const maxCount = st ? Math.max(...Object.values(st.byRole),1) : 1;
    return (
      <div className="main-pad" style={{ maxWidth:820, margin:'0 auto', padding:'36px 32px' }}>
        <div className="fade-up" style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:26, fontWeight:700, color:'#111827', marginBottom:6 }}>Your Progress</h1>
          <p style={{ color:'#6B7280', fontSize:15 }}>Track your improvement across roles and sessions.</p>
        </div>
        {!st ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <p style={{ fontSize:40, marginBottom:12 }}>📭</p>
            <p style={{ color:'#9CA3AF', marginBottom:20 }}>No sessions yet. Start practicing!</p>
            <button className="btn-primary" onClick={()=>setPage('home')} style={{ padding:'12px 28px', fontSize:15 }}>Start Practicing</button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="fade-up d1" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
              {[{l:'Total Sessions',v:st.total,c:'#6366F1'},{l:'Average Score',v:`${st.avg}/10`,c:'#059669'},{l:'Roles Practiced',v:Object.keys(st.byRole).length,c:'#D97706'}].map(s=>(
                <div key={s.l} className="card" style={{ padding:'20px 22px' }}>
                  <p style={{ fontSize:12, color:'#9CA3AF', marginBottom:6, fontWeight:500 }}>{s.l}</p>
                  <p style={{ fontSize:32, fontWeight:700, color:s.c }}>{s.v}</p>
                </div>
              ))}
            </div>
            {/* Trend chart */}
            {interviews.length>=2 && (
              <div className="card fade-up d2" style={{ padding:'22px 24px', marginBottom:16 }}>
                <p style={{ fontSize:15, fontWeight:600, color:'#111827', marginBottom:4 }}>Score Trend</p>
                <p style={{ fontSize:13, color:'#9CA3AF', marginBottom:16 }}>Overall score across sessions, oldest to newest.</p>
                <ScoreTrendChart data={[...interviews].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(iv=>({score:iv.score,color:ROLE_CFG[iv.role]?.color||'#6366F1'}))}/>
              </div>
            )}
            {/* By role */}
            <div className="card fade-up d3" style={{ padding:'22px 24px', marginBottom:16 }}>
              <p style={{ fontSize:15, fontWeight:600, color:'#111827', marginBottom:20 }}>Practice by Role</p>
              {ROLES.map(r=>{
                const cfg=ROLE_CFG[r]; const count=st.byRole[r]||0;
                return (
                  <div key={r} style={{ marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:13, color:'#374151' }}>{r}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:count>0?cfg.color:'#D1D5DB' }}>{count} session{count!==1?'s':''}</span>
                    </div>
                    <div style={{ height:6, background:'#F3F4F6', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:4, background:cfg.color, width:`${(count/maxCount)*100}%`, transition:'width .8s ease' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Recent */}
            <div className="card fade-up d4" style={{ padding:'22px 24px' }}>
              <p style={{ fontSize:15, fontWeight:600, color:'#111827', marginBottom:16 }}>Recent Sessions</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {recent.map(s=>{
                  const cfg2=ROLE_CFG[s.role]; const sc=s.score>=8?'#059669':s.score>=6?'#2563EB':'#D97706';
                  return (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'#F9FAFB', borderRadius:10, border:'1px solid #F3F4F6' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:cfg2?.color||'#6366F1', flexShrink:0 }}/>
                        <div>
                          <p style={{ fontSize:14, fontWeight:500, color:'#111827' }}>{s.role}{s.industry&&s.industry!=='General'?` · ${s.industry}`:''}</p>
                          <p style={{ fontSize:12, color:'#9CA3AF', marginTop:1 }}>
                            {new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · {s.format==='mc'?'MC':'Text'} · {s.mode==='full'?'5 Q':'1 Q'}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize:20, fontWeight:700, color:sc }}>{s.score}/10</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════
     LAYOUT
  ═══════════════════════════════════════════════════ */
  return (
    <>
      <G />
      <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
        <Sidebar page={page} setPage={setPage} interviews={interviews} savedEmail={savedEmail}/>
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {page==='interview' ? (
            <InterviewPage/>
          ) : (
            <div style={{ flex:1, overflowY:'auto' }}>
              {page==='home'      && <HomePage/>}
              {page==='results'   && <ResultsPage/>}
              {page==='dashboard' && <DashboardPage/>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
