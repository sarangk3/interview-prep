import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_BANK, INDUSTRIES, ROLES, OPENING_PROBLEMS, MOCK_TARGETS, EXTRA_PROBLEMS } from './questions';
import { supabase } from './supabase';

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html, body, #root { height:100%; }
    body { font-family:'DM Sans',system-ui,sans-serif; background:#F9FAFB; color:#111827; -webkit-font-smoothing:antialiased; }
    textarea,input,button { font-family:inherit; } textarea { resize:none; } textarea:focus,input:focus { outline:none; }
    ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:#E5E7EB; border-radius:4px; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
    @keyframes spin { to{transform:rotate(360deg);} }
    @keyframes recPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4);}50%{box-shadow:0 0 0 6px rgba(239,68,68,0);} }
    .fu{animation:fadeUp .3s ease both;} .d1{animation-delay:.05s} .d2{animation-delay:.1s} .d3{animation-delay:.15s} .d4{animation-delay:.2s}
    .spinner{display:inline-block;width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
    .card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;}
    .bp{background:#6366F1;color:#fff;border:none;cursor:pointer;border-radius:10px;font-weight:600;transition:background .15s;}
    .bp:hover:not(:disabled){background:#4F46E5;} .bp:disabled{opacity:.4;cursor:not-allowed;}
    .bg{background:#fff;color:#6B7280;border:1px solid #E5E7EB;cursor:pointer;border-radius:10px;font-weight:500;transition:background .15s;}
    .bg:hover{background:#F9FAFB;}
    .ni{display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;border-radius:8px;border:none;cursor:pointer;font-size:14px;text-align:left;transition:all .15s;background:transparent;color:#6B7280;}
    .ni:hover{background:#F9FAFB;color:#374151;} .ni.on{background:#EEF2FF;color:#4F46E5;font-weight:600;}
    .rc{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:18px 20px;cursor:pointer;transition:all .2s;}
    .rc:hover{border-color:#A5B4FC;box-shadow:0 4px 20px rgba(99,102,241,.1);transform:translateY(-2px);}
    .mo{padding:14px 18px;border-radius:12px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .18s;border:1px solid #E5E7EB;background:#fff;}
    .mo:hover{border-color:#A5B4FC;background:#F5F3FF;} .mo.sel{border-color:#6366F1;background:#EEF2FF;}
    .chip{padding:6px 16px;border-radius:20px;border:1px solid #E5E7EB;background:#fff;color:#6B7280;font-size:13px;cursor:pointer;transition:all .15s;font-weight:500;}
    .chip.on{border-color:#6366F1;background:#EEF2FF;color:#4F46E5;font-weight:600;} .chip:hover:not(.on){border-color:#A5B4FC;}
    .mic-live{animation:recPulse 1.4s ease-in-out infinite;}
    .msg-interviewer{background:#F3F4F6;color:#111827;border-radius:4px 18px 18px 18px;align-self:flex-start;max-width:75%;}
    .msg-candidate{background:#6366F1;color:#fff;border-radius:18px 4px 18px 18px;align-self:flex-end;max-width:75%;}
    .thinking-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#9CA3AF;animation:bounce .9s ease-in-out infinite;}
    @keyframes bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}
    @media(max-width:768px){
      .sb{display:none!important;} .isp{flex-direction:column!important;}
      .ap{width:100%!important;border-left:none!important;border-top:1px solid #E5E7EB!important;}
      .mp{padding:20px 16px!important;} .s4{grid-template-columns:repeat(2,1fr)!important;}
      .s2{grid-template-columns:1fr!important;} .rg{grid-template-columns:1fr!important;}
    }
  `}</style>
);

const ROLE_CFG = {
  'AI Solutions Architect':           {color:'#7C3AED',bg:'#F5F3FF',border:'#DDD6FE',icon:'🧠',label:'LLMs, RAG & AI Systems',   short:'AI Architect', card:'AI Solutions Architect'},
  'Forward Deployed Engineer':        {color:'#2563EB',bg:'#EFF6FF',border:'#BFDBFE',icon:'⚙️',label:'Embedded Customer Builds', short:'FD Engineer', card:'FD Engineer'},
  'Forward Deployed Product Manager': {color:'#D97706',bg:'#FFFBEB',border:'#FDE68A',icon:'📋',label:'Customer-Embedded PM',     short:'FD PM', card:'FD Product Manager'},
  'Technical Program Manager':                              {color:'#DC2626',bg:'#FEF2F2',border:'#FECACA',icon:'📊',label:'Programs & Delivery',      short:'Tech PM', card:'Tech Program Manager'},
};

/* Pick a question not recently shown — cycles through all before repeating */
const getNextQuestion = (bank, key) => {
  const used = JSON.parse(localStorage.getItem(`q_${key}`) || '[]');
  const available = bank.map((_,i)=>i).filter(i=>!used.includes(i));
  const pool = available.length > 0 ? available : bank.map((_,i)=>i);
  const idx = pool[Math.floor(Math.random() * pool.length)];
  const newUsed = available.length > 1 ? [...used, idx] : [idx];
  localStorage.setItem(`q_${key}`, JSON.stringify(newUsed));
  return { q: bank[idx], idx };
};

/* Shuffle array for full-interview mode */
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const IND_ICONS = {General:'🌐',Healthcare:'🏥',Fintech:'💳','E-commerce':'🛒'};
const TIPS = {
  'AI Solutions Architect':           "Focus on trade-offs between RAG, fine-tuning, and prompting — not just what you'd build.",
  'Forward Deployed Engineer':        "Start with discovery and observation. Interviewers want your process, not just the solution.",
  'Forward Deployed Product Manager': "Show how you balance one customer's needs against a generalizable product direction.",
  'Technical Program Manager':                              "Demonstrate how you create clarity from ambiguity. Name specific artifacts and stakeholders.",
};

const ScorePill = ({ label, value }) => {
  const c=value>=8?'#059669':value>=6?'#2563EB':'#D97706';
  const bg=value>=8?'#ECFDF5':value>=6?'#EFF6FF':'#FFFBEB';
  const bd=value>=8?'#BBF7D0':value>=6?'#BFDBFE':'#FDE68A';
  return (
    <div style={{textAlign:'center',padding:'14px 8px',background:bg,borderRadius:10,border:`1px solid ${bd}`}}>
      <div style={{fontSize:24,fontWeight:700,color:c,marginBottom:2}}>{value}</div>
      <div style={{fontSize:11,color:'#9CA3AF',fontWeight:500}}>{label}</div>
    </div>
  );
};

const TrendChart = ({ data }) => {
  const W=580,H=180,pL=30,pR=12,pT=12,pB=24,pw=W-pL-pR,ph=H-pT-pB,n=data.length;
  const x=i=>n===1?pL+pw/2:pL+(i*pw)/(n-1), y=s=>pT+ph-(s/10)*ph;
  const line=data.map((d,i)=>`${i===0?'M':'L'} ${x(i).toFixed(1)} ${y(d.score).toFixed(1)}`).join(' ');
  const area=`${line} L ${x(n-1).toFixed(1)} ${pT+ph} L ${x(0).toFixed(1)} ${pT+ph} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity=".2"/><stop offset="100%" stopColor="#6366F1" stopOpacity="0"/></linearGradient></defs>
      {[0,2.5,5,7.5,10].map(g=>(
        <g key={g}><line x1={pL} y1={y(g)} x2={W-pR} y2={y(g)} stroke="#F3F4F6" strokeWidth="1"/>
        <text x={pL-6} y={y(g)+4} fill="#9CA3AF" fontSize="10" textAnchor="end">{g}</text></g>
      ))}
      {n>1&&<path d={area} fill="url(#tg)"/>}
      {n>1&&<path d={line} fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
      {data.map((d,i)=><circle key={i} cx={x(i)} cy={y(d.score)} r={4} fill={d.color||'#6366F1'} stroke="#fff" strokeWidth="2"/>)}
    </svg>
  );
};

/* Sidebar defined OUTSIDE main component — stable reference, never remounts */
const Sidebar = ({ page, setPage, interviews, user, onLogout, onSignIn }) => {
  const st=interviews.length;
  const avg=st?Math.round(interviews.reduce((s,i)=>s+i.score,0)/st):null;
  return (
    <div className="sb" style={{width:220,background:'#fff',borderRight:'1px solid #E5E7EB',display:'flex',flexDirection:'column',padding:'0 10px',flexShrink:0}}>
      <div style={{padding:'20px 6px 20px',borderBottom:'1px solid #F3F4F6'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>⚡</div>
          <span style={{fontWeight:700,fontSize:15,color:'#111827'}}>Interview Prep</span>
        </div>
      </div>
      <div style={{padding:'14px 0',flex:1}}>
        <p style={{fontSize:11,fontWeight:600,color:'#9CA3AF',padding:'0 12px',marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>Practice</p>
        {[{id:'home',label:'Question Bank',icon:'📚'},{id:'dashboard',label:'My Progress',icon:'📈'}].map(item=>(
          <button key={item.id} className={`ni ${page===item.id?'on':''}`} onClick={()=>setPage(item.id)}>
            <span style={{fontSize:16}}>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      {st>0&&(
        <div style={{margin:'0 0 12px',background:'#F9FAFB',borderRadius:10,border:'1px solid #E5E7EB',padding:'12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
            <span style={{fontSize:12,color:'#9CA3AF'}}>Sessions</span>
            <span style={{fontSize:12,fontWeight:600,color:'#374151'}}>{st}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:12,color:'#9CA3AF'}}>Avg score</span>
            <span style={{fontSize:12,fontWeight:600,color:'#6366F1'}}>{avg}/10</span>
          </div>
        </div>
      )}
      <div style={{padding:'0 0 16px'}}>
        {user ? (
          <div style={{marginBottom:10,padding:'10px 12px',background:'#F9FAFB',borderRadius:10,border:'1px solid #E5E7EB'}}>
            <p style={{fontSize:11,color:'#9CA3AF',marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.email}</p>
            <button onClick={onLogout} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,color:'#DC2626',fontWeight:500,padding:0}}>Sign out</button>
          </div>
        ) : (
          <button onClick={()=>onSignIn()} style={{width:'100%',marginBottom:10,padding:'10px 12px',background:'#EEF2FF',border:'1px solid #C7D2FE',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:600,color:'#4F46E5',textAlign:'left'}}>
            Sign in / Create account →
          </button>
        )}
        <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:10,padding:'10px 12px'}}>
          <p style={{fontSize:12,fontWeight:600,color:'#15803D',marginBottom:2}}>Free Plan</p>
          <p style={{fontSize:11,color:'#6B7280'}}>Unlimited MC · 20 AI/day</p>
        </div>
      </div>
    </div>
  );
};

export default function InterviewPrepApp() {
  const [page,setPage]             = useState('home');
  const [user,setUser]             = useState(null);
  const [authLoading,setAuthLoading] = useState(true);
  const [authMode,setAuthMode]     = useState('signup'); // default to signup on results gate
  const [authEmail,setAuthEmail]   = useState('');
  const [authPassword,setAuthPassword] = useState('');
  const [authError,setAuthError]   = useState('');
  const [authWorking,setAuthWorking] = useState(false);
  const [pendingInterview,setPendingInterview] = useState(null); // holds completed interview for anonymous users
  const [interviews,setInterviews] = useState([]);
  const [format,setFormat]         = useState('text');
  const [difficulty,setDifficulty] = useState('medium');
  const [mockMessages,setMockMessages]   = useState([]);
  const [mockTurnCount,setMockTurnCount] = useState(0);
  const [mockThinking,setMockThinking]   = useState(false);
  const [mockScore,setMockScore]         = useState(null);
  const [errorMsg,setErrorMsg]           = useState('');
  const [confirmExit,setConfirmExit]     = useState(false);
  const [openingProblem,setOpeningProblem] = useState(null);
  const [industry,setIndustry]     = useState('General');
  const [role,setRole]             = useState(null);
  const [mode,setMode]             = useState(null);
  const [qIndex,setQIndex]         = useState(0);
  const [response,setResponse]     = useState('');
  const [mcChoice,setMcChoice]     = useState(null);
  const [submitting,setSubmitting] = useState(false);
  const [results,setResults]       = useState(null);
  const [allResponses,setAllResponses] = useState([]);
  const [sessionQs,setSessionQs]   = useState([]);
  const [sessionMeta,setSessionMeta] = useState({});
  const [barsAnim,setBarsAnim]     = useState(false);
  const [elapsed,setElapsed]       = useState(0);
  const [listening,setListening]   = useState(false);
  const recRef = useRef(null);
  const chatEndRef = useRef(null);
  const speechOk = typeof window!=='undefined'&&!!(window.SpeechRecognition||window.webkitSpeechRecognition);

  // Supabase auth state + interview loading
  useEffect(()=>{
    supabase.auth.getSession().then(({ data:{ session } })=>{
      setUser(session?.user ?? null);
      if(session?.user) loadInterviews(session.user.id);
      setAuthLoading(false);
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_evt, session)=>{
      setUser(session?.user ?? null);
      if(session?.user) loadInterviews(session.user.id);
      else { setInterviews([]); setPage('home'); }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  const loadInterviews = async (userId) => {
    const { data } = await supabase.from('interviews').select('*').eq('user_id', userId).order('created_at',{ascending:false});
    if(data) setInterviews(data);
  };

  const saveInterview = async (iv) => {
    if(!user) return;
    const { data } = await supabase.from('interviews').insert([{
      user_id: user.id, role: iv.role, industry: iv.industry, format: iv.format,
      mode: iv.mode, difficulty: iv.difficulty||null, score: iv.score,
      problem_title: iv.problemTitle||null, responses: iv.responses,
    }]).select().single();
    if(data) setInterviews(prev=>[data,...prev]);
  };

  // Auth handlers
  const handleAuth = async (onSuccess) => {
    if(!authEmail.trim()||!authPassword.trim()) return setAuthError('Please enter your email and password.');
    setAuthWorking(true); setAuthError('');
    try {
      let result;
      if(authMode==='signup') {
        result = await supabase.auth.signUp({ email:authEmail.trim(), password:authPassword });
        if(!result.error && result.data.user && !result.data.session) {
          setAuthError('Check your email to confirm your account, then log in.');
          setAuthMode('login'); setAuthWorking(false); return;
        }
      } else {
        result = await supabase.auth.signInWithPassword({ email:authEmail.trim(), password:authPassword });
      }
      if(result.error) { setAuthError(result.error.message); setAuthWorking(false); return; }
      // Save pending interview if coming from results gate
      if(result.data.user && pendingInterview) {
        const u = result.data.user;
        await supabase.from('interviews').insert([{
          user_id: u.id, role: pendingInterview.role, industry: pendingInterview.industry,
          format: pendingInterview.format, mode: pendingInterview.mode,
          difficulty: pendingInterview.difficulty||null, score: pendingInterview.score,
          problem_title: pendingInterview.problemTitle||null, responses: pendingInterview.responses,
        }]);
        setPendingInterview(null);
        setPage('results');
      }
      if(onSuccess) onSuccess();
    } catch(e) { setAuthError('Something went wrong. Please try again.'); }
    setAuthWorking(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setInterviews([]); };

  const handleForgotPassword = async () => {
    if(!authEmail.trim()) return setAuthError('Enter your email address first.');
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail.trim());
    setAuthError(error ? error.message : 'Password reset email sent — check your inbox.');
  };
  useEffect(()=>{ if(page==='results'){const t=setTimeout(()=>setBarsAnim(true),400);return()=>clearTimeout(t);} setBarsAnim(false); },[page]);
  useEffect(()=>{ if(page!=='interview'){setElapsed(0);return;} const t=setInterval(()=>setElapsed(e=>e+1),1000);return()=>clearInterval(t); },[page]);
  useEffect(()=>setElapsed(0),[qIndex]);
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:'smooth'}); },[mockMessages,mockThinking]);
  useEffect(()=>()=>{try{recRef.current?.stop();}catch(e){}},[qIndex,page]);

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const wc=response.trim().split(/\s+/).filter(Boolean).length;

  const MOCK_TURNS = { easy:3, medium:5, hard:7 };

  const startInterview=(r,m)=>{
    setRole(r);setMode(m);
    setAllResponses([]);setResponse('');setMcChoice(null);
    setResults(null);
    setMockScore(null);setMockTurnCount(0);setMockThinking(false);
    setErrorMsg('');setConfirmExit(false);

    if(format==='mock'){
      // Build pool: original problem + extras for this role/industry
      const base = OPENING_PROBLEMS[r]?.[industry] || OPENING_PROBLEMS[r]?.['General'];
      const baseTarget = MOCK_TARGETS[r]?.[industry] || MOCK_TARGETS[r]?.['General'];
      const extras = EXTRA_PROBLEMS?.[r]?.[industry] || EXTRA_PROBLEMS?.[r]?.['General'] || [];
      const allProblems = [
        { title: base.title, problem: base.problem, keyComponents: baseTarget?.keyComponents||[], hints: baseTarget?.hints||[], idealSolution: baseTarget?.idealSolution||'' },
        ...extras.map(e => ({ title: e.title, problem: e.problem, keyComponents: e.keyComponents||[], hints: e.hints||[], idealSolution: e.idealSolution||'' })),
      ];
      // Rotate: avoid repeating until all problems shown
      const storageKey = `mock_${r}_${industry}`;
      const used = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const available = allProblems.map((_,i)=>i).filter(i=>!used.includes(i));
      const pool = available.length > 0 ? available : allProblems.map((_,i)=>i);
      const idx = pool[Math.floor(Math.random() * pool.length)];
      const newUsed = available.length > 1 ? [...used, idx] : [idx];
      localStorage.setItem(storageKey, JSON.stringify(newUsed));
      const prob = allProblems[idx];
      setOpeningProblem(prob.problem);
      setMockMessages([{role:'interviewer',content:prob.problem}]);
      setSessionMeta({role:r,mode:'mock',format:'mock',industry,sessionId:Math.random().toString(36).slice(2),
        problemTitle:prob.title,keyComponents:prob.keyComponents,
        hints:prob.hints,idealSolution:prob.idealSolution});
    } else {
      const bank=QUESTION_BANK[industry][r][format];
      const key=`${r}-${industry}-${format}`;
      const qs=m==='full'?shuffle(bank):[getNextQuestion(bank,key).q];
      setQIndex(0);setSessionQs(qs);
      setSessionMeta({role:r,mode:m,format,industry,sessionId:Math.random().toString(36).slice(2)});
    }
    setPage('interview');
  };

  const submitMockResponse=async()=>{
    if(!response.trim()||mockThinking)return;
    const newTurn=mockTurnCount+1;
    const maxTurns=MOCK_TURNS[difficulty]||5;
    const candidateMsg={role:'candidate',content:response.trim()};
    const updatedMessages=[...mockMessages,candidateMsg];
    setMockMessages(updatedMessages);
    setResponse('');
    setMockThinking(true);

    try{
      // Get next interviewer response
      const { data:{ session:msess } } = await supabase.auth.getSession();
      const mockHeaders={'Content-Type':'application/json',...(msess?.access_token?{'Authorization':`Bearer ${msess.access_token}`}:{})};
      const res=await fetch('/api/mock',{method:'POST',headers:mockHeaders,
        body:JSON.stringify({mode:'turn',messages:updatedMessages,role,industry,difficulty,turn:newTurn,maxTurns,
          openingProblem,keyComponents:sessionMeta.keyComponents||[],hints:sessionMeta.hints||[]})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Failed.');
      const withReply=[...updatedMessages,{role:'interviewer',content:data.reply}];
      setMockMessages(withReply);
      setMockTurnCount(newTurn);

      // If this was the final turn, get scores
      if(newTurn>=maxTurns){
        const scoreRes=await fetch('/api/mock',{method:'POST',headers:mockHeaders,
          body:JSON.stringify({mode:'score',messages:withReply,role,industry,difficulty,
            openingProblem,keyComponents:sessionMeta.keyComponents||[]})});
        const scoreData=await scoreRes.json();
        if(scoreRes.ok&&scoreData.score){
          setMockScore(scoreData.score);
          const iv={role,mode:'mock',format:'mock',industry,difficulty,
            date:new Date().toISOString(),score:scoreData.score.overall,
            problemTitle:sessionMeta.problemTitle,messages:withReply,mockScore:scoreData.score};
          if(user){ saveInterview(iv); setPage('results'); }
          else { setPendingInterview(iv); setPage('results-gate'); }
        }
      }
    }catch(err){setErrorMsg(typeof err==='string'?err:(err?.message||'Error. Please try again.'));}
    finally{setMockThinking(false);}
  };

  const toggleListening=()=>{
    if(!speechOk)return;
    if(listening){recRef.current?.stop();return;}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();rec.continuous=true;rec.interimResults=false;rec.lang='en-US';
    rec.onresult=e=>{let c='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)c+=e.results[i][0].transcript;if(c)setResponse(p=>(p?p.trimEnd()+' ':'')+c.trim());};
    rec.onend=()=>setListening(false);rec.onerror=()=>setListening(false);
    recRef.current=rec;rec.start();setListening(true);
  };

  const submitText=async()=>{
    if(!response.trim())return;
    setSubmitting(true);
    const q=sessionQs[qIndex];
    try{
      const { data:{ session:sess } } = await supabase.auth.getSession();
      const res=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json',...(sess?.access_token?{'Authorization':`Bearer ${sess.access_token}`}:{})},
        body:JSON.stringify({meta:{role,industry,question:q,sessionId:sessionMeta.sessionId},answer:response})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Request failed.');
      let fb;
      try{const raw=data.content[0].text;const m2=raw.match(/\{[\s\S]*\}/);fb=JSON.parse(m2?m2[0]:raw);}
      catch{fb={technical_depth:5,communication_clarity:5,structure:5,approach:5,overall:5,strengths:['Some relevant points'],improvements:['Add more specifics','Use a framework'],feedback:'Needs more depth.',key_points:['Use a clear framework','Cover trade-offs','Concrete examples']};}
      const next=[...allResponses,{question:q,answer:response,feedback:fb}];
      setAllResponses(next);
      if(qIndex+1<sessionQs.length){setQIndex(qIndex+1);setResponse('');}
      else finishInterview(next,'text');
    }catch(err){setErrorMsg((typeof err==='string'?err:err?.message)||'Error getting feedback. Try Multiple Choice mode which works offline.');}
    finally{setSubmitting(false);}
  };

  const submitMC=()=>{
    if(mcChoice===null)return;
    const q=sessionQs[qIndex];const ok=mcChoice===q.correct;
    const next=[...allResponses,{question:q.q,options:q.options,chosen:mcChoice,correct:q.correct,isCorrect:ok,explanation:q.explanation}];
    setAllResponses(next);
    fetch('/api/log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:sessionMeta.sessionId,role,industry,format:'mc',question:q.q,options:q.options,chosenIndex:mcChoice,correctIndex:q.correct,isCorrect:ok,explanation:q.explanation})}).catch(()=>{});
    if(qIndex+1<sessionQs.length){setQIndex(qIndex+1);setMcChoice(null);}
    else finishInterview(next,'mc');
  };

  const finishInterview=(responses,fmt2)=>{
    const score=fmt2==='mc'?Math.round((responses.filter(r=>r.isCorrect).length/responses.length)*10):Math.round(responses.reduce((s,r)=>s+r.feedback.overall,0)/responses.length);
    const iv={role,mode,format:fmt2,industry,date:new Date().toISOString(),score,responses};
    setResults(responses);
    if(user){ saveInterview(iv); setPage('results'); }
    else { setPendingInterview(iv); setPage('results-gate'); }
  };

  const buildTranscript=()=>{
    const isMC=results[0]&&'isCorrect' in results[0];
    let out=`INTERVIEW PREP — SESSION SUMMARY\n${'='.repeat(34)}\nRole: ${sessionMeta.role}\nIndustry: ${sessionMeta.industry}\nDate: ${new Date().toLocaleString()}\n${user?.email?`Email: ${user.email}\n`:''}\n`;
    results.forEach((r,i)=>{
      out+=`--- Q${i+1} ---\n${r.question}\n\n`;
      if(isMC){r.options.forEach((o,j)=>{out+=`  ${String.fromCharCode(65+j)}. ${o}${j===r.correct?' [CORRECT]':j===r.chosen?' [YOUR PICK]':''}\n`;});out+=`\nResult: ${r.isCorrect?'Correct':'Incorrect'}\nWhy: ${r.explanation}\n\n`;}
      else{out+=`YOUR ANSWER:\n${r.answer}\n\nScores: Tech ${r.feedback.technical_depth} · Clarity ${r.feedback.communication_clarity} · Structure ${r.feedback.structure} · Approach ${r.feedback.approach} · Overall ${r.feedback.overall}\n${r.feedback.feedback}\n\n`;}
    });
    return out;
  };
  const downloadCopy=()=>{
    const blob=new Blob([buildTranscript()],{type:'text/plain'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download=`interview-${(sessionMeta.role||'session').replace(/[^a-z]/gi,'')}-${Date.now()}.txt`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  };

  const stats=()=>{
    if(!interviews.length)return null;
    const avg=Math.round(interviews.reduce((s,i)=>s+i.score,0)/interviews.length);
    const byRole={};interviews.forEach(i=>{byRole[i.role]=(byRole[i.role]||0)+1;});
    return{total:interviews.length,avg,byRole};
  };

  /* ── Current question & config for interview page ── */
  const q   = sessionQs[qIndex];
  const cfg = role ? ROLE_CFG[role] : null;
  const isLast = qIndex===sessionQs.length-1;
  const isMC = format==='mc';

  /* ── Reusable auth form ── */
  const renderAuthForm = (onSuccessNav) => (
    <div className="card" style={{padding:28}}>
      <div style={{display:'flex',gap:0,marginBottom:20,background:'#F3F4F6',borderRadius:10,padding:4}}>
        {['signup','login'].map(m=>(
          <button key={m} onClick={()=>{setAuthMode(m);setAuthError('');}} style={{flex:1,padding:'8px',border:'none',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:600,background:authMode===m?'#fff':'transparent',color:authMode===m?'#111827':'#9CA3AF',boxShadow:authMode===m?'0 1px 3px rgba(0,0,0,0.1)':'none',transition:'all .15s'}}>
            {m==='signup'?'Create account':'Sign in'}
          </button>
        ))}
      </div>
      {authError&&<div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:8,padding:'10px 14px',marginBottom:14,fontSize:13,color:'#991B1B'}}>{authError}</div>}
      <div style={{marginBottom:12}}>
        <label style={{fontSize:13,fontWeight:500,color:'#374151',display:'block',marginBottom:5}}>Email</label>
        <input type="email" placeholder="you@company.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAuth(onSuccessNav)} style={{width:'100%',padding:'10px 14px',border:'1px solid #E5E7EB',borderRadius:8,fontSize:14,color:'#111827',background:'#F9FAFB'}}/>
      </div>
      <div style={{marginBottom:18}}>
        <label style={{fontSize:13,fontWeight:500,color:'#374151',display:'block',marginBottom:5}}>Password</label>
        <input type="password" placeholder="••••••••" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAuth(onSuccessNav)} style={{width:'100%',padding:'10px 14px',border:'1px solid #E5E7EB',borderRadius:8,fontSize:14,color:'#111827',background:'#F9FAFB'}}/>
      </div>
      <button className="bp" onClick={()=>handleAuth(onSuccessNav)} disabled={authWorking} style={{width:'100%',padding:'12px',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
        {authWorking?<><span className="spinner"/>Working…</>:authMode==='signup'?'Create account & see results →':'Sign in & see results →'}
      </button>
      {authMode==='login'&&<button onClick={handleForgotPassword} style={{background:'none',border:'none',cursor:'pointer',width:'100%',marginTop:10,fontSize:13,color:'#9CA3AF',textAlign:'center'}}>Forgot password?</button>}
    </div>
  );

  return (
    <>
      <G/>

      {/* ── Loading spinner (brief, while checking session) ── */}
      {authLoading && (
        <div style={{position:'fixed',inset:0,background:'#F9FAFB',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000}}>
          <div style={{textAlign:'center'}}>
            <div style={{width:40,height:40,borderRadius:12,background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,margin:'0 auto 16px'}}>⚡</div>
            <p style={{color:'#9CA3AF',fontSize:14}}>Loading…</p>
          </div>
        </div>
      )}

      {/* ── Main app — always shown once loading is done ── */}
      {!authLoading && (<>
      {/* ── Inline error banner ── */}
      {errorMsg && (
        <div style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,background:'#FEF2F2',borderBottom:'1px solid #FECACA',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:16}}>⚠️</span>
            <p style={{fontSize:14,color:'#991B1B',fontWeight:500}}>{errorMsg}</p>
          </div>
          <button onClick={()=>setErrorMsg('')} style={{background:'none',border:'none',cursor:'pointer',color:'#DC2626',fontSize:18,lineHeight:1,padding:'0 4px'}}>✕</button>
        </div>
      )}
      {/* ── Exit confirmation modal ── */}
      {confirmExit && (
        <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
          <div style={{background:'#fff',borderRadius:16,padding:32,maxWidth:380,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
            <p style={{fontSize:18,fontWeight:700,color:'#111827',marginBottom:8}}>Leave this interview?</p>
            <p style={{fontSize:14,color:'#6B7280',marginBottom:24,lineHeight:1.6}}>Your progress will be lost and this session won't be saved.</p>
            <div style={{display:'flex',gap:10}}>
              <button className="bg" onClick={()=>setConfirmExit(false)} style={{flex:1,padding:'11px',fontSize:14}}>Keep going</button>
              <button className="bp" onClick={()=>{setConfirmExit(false);setPage('home');setMockMessages([]);setResponse('');}} style={{flex:1,padding:'11px',fontSize:14,background:'#DC2626'}}>Leave</button>
            </div>
          </div>
        </div>
      )}
      <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>
        <Sidebar page={page} setPage={setPage} interviews={interviews} user={user} onLogout={handleLogout} onSignIn={()=>{setAuthMode('signup');setAuthError('');setPage('signin');}}/>
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

          {/* ── Auth modal (standalone sign in page) ── */}
          {page==='signin' && (
            <div style={{flex:1,overflowY:'auto',display:'flex',alignItems:'center',justifyContent:'center',padding:24,background:'#F9FAFB'}}>
              <div style={{width:'100%',maxWidth:400}}>
                <div style={{textAlign:'center',marginBottom:28}}>
                  <h2 style={{fontSize:22,fontWeight:700,color:'#111827',marginBottom:6}}>Welcome back</h2>
                  <p style={{color:'#9CA3AF',fontSize:14}}>Sign in or create an account to track your progress.</p>
                </div>
                {renderAuthForm(()=>setPage('home'))}
                <button onClick={()=>setPage('home')} style={{background:'none',border:'none',cursor:'pointer',width:'100%',marginTop:14,fontSize:13,color:'#9CA3AF',textAlign:'center'}}>
                  ← Continue without signing in
                </button>
              </div>
            </div>
          )}

          {/* ════ INTERVIEW ════ */}
          {page==='interview' && format==='mock' && (
            <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden',background:'#F9FAFB'}}>
              {/* Header */}
              <div style={{background:'#fff',borderBottom:'1px solid #E5E7EB',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
                <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                  <button className="bg" onClick={()=>setPage('home')} style={{padding:'5px 12px',fontSize:13}}>← Back</button>
                  {role&&ROLE_CFG[role]&&<div style={{padding:'3px 10px',borderRadius:20,background:ROLE_CFG[role].bg,border:`1px solid ${ROLE_CFG[role].border}`,fontSize:12,fontWeight:600,color:ROLE_CFG[role].color}}>{role}</div>}
                  <div style={{padding:'3px 10px',borderRadius:20,background:'#F9FAFB',border:'1px solid #E5E7EB',fontSize:12,color:'#6B7280'}}>{industry}</div>
                  <div style={{padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600,
                    background:difficulty==='easy'?'#F0FDF4':difficulty==='medium'?'#FFFBEB':'#FEF2F2',
                    color:difficulty==='easy'?'#059669':difficulty==='medium'?'#D97706':'#DC2626'}}>
                    {difficulty.charAt(0).toUpperCase()+difficulty.slice(1)}
                  </div>
                </div>
                <div style={{fontSize:13,color:'#9CA3AF',flexShrink:0}}>Round {mockTurnCount} of {MOCK_TURNS[difficulty]||5}</div>
              </div>
              {/* Progress */}
              <div style={{height:3,background:'#F3F4F6',flexShrink:0}}>
                <div style={{height:'100%',background:'#6366F1',width:`${(mockTurnCount/(MOCK_TURNS[difficulty]||5))*100}%`,transition:'width .5s ease'}}/>
              </div>
              {/* Chat messages */}
              <div style={{flex:1,overflowY:'auto',padding:'24px',display:'flex',flexDirection:'column',gap:16}}>
                {mockMessages.map((msg,i)=>(
                  <div key={i} style={{display:'flex',flexDirection:'column',alignItems:msg.role==='candidate'?'flex-end':'flex-start'}}>
                    <div style={{fontSize:11,color:'#9CA3AF',marginBottom:4,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',padding:'0 4px'}}>
                      {msg.role==='interviewer'?'Interviewer':'You'}
                    </div>
                    <div className={`msg-${msg.role}`} style={{padding:'14px 18px',fontSize:14,lineHeight:1.7}}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {mockThinking&&(
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
                    <div style={{fontSize:11,color:'#9CA3AF',marginBottom:4,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',padding:'0 4px'}}>Interviewer</div>
                    <div className="msg-interviewer" style={{padding:'14px 18px',display:'flex',gap:5,alignItems:'center'}}>
                      <span className="thinking-dot" style={{animationDelay:'0s'}}/>
                      <span className="thinking-dot" style={{animationDelay:'.2s'}}/>
                      <span className="thinking-dot" style={{animationDelay:'.4s'}}/>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>
              {/* Input area */}
              {mockTurnCount<(MOCK_TURNS[difficulty]||5)&&!mockThinking&&(
                <div style={{background:'#fff',borderTop:'1px solid #E5E7EB',padding:'16px 24px',flexShrink:0}}>
                  <div style={{position:'relative'}}>
                    <textarea value={response} onChange={e=>setResponse(e.target.value)}
                      onKeyDown={e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey))submitMockResponse();}}
                      placeholder="Type your response here... (Cmd+Enter to submit)"
                      style={{width:'100%',minHeight:100,padding:'14px',paddingBottom:48,border:'1px solid #E5E7EB',borderRadius:12,fontSize:14,
                        lineHeight:1.6,color:'#111827',background:'#F9FAFB',display:'block',
                        borderColor:response.length>50?'#A5B4FC':'#E5E7EB',transition:'border-color .2s'}}/>
                    {speechOk&&(
                      <button className={`bg ${listening?'mic-live':''}`} onClick={toggleListening}
                        style={{position:'absolute',left:12,bottom:10,display:'flex',alignItems:'center',gap:6,padding:'5px 10px',fontSize:12,fontWeight:600,
                          borderColor:listening?'#FCA5A5':'#E5E7EB',color:listening?'#EF4444':'#9CA3AF'}}>
                        🎤 {listening?'Listening…':'Speak'}
                      </button>
                    )}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                    <span style={{fontSize:12,color:'#D1D5DB'}}>{response.trim().split(/\s+/).filter(Boolean).length} words · Cmd+Enter to send</span>
                    <button className="bp" onClick={submitMockResponse} disabled={response.trim().length<5||mockThinking}
                      style={{padding:'10px 24px',fontSize:14}}>
                      Respond →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {page==='interview' && format!=='mock' && q && cfg && (
            <div className="isp" style={{display:'flex',flex:1,overflow:'hidden'}}>
              {/* Left — question (stable, no key that changes) */}
              <div style={{flex:1,padding:'28px 32px',overflowY:'auto',borderRight:'1px solid #E5E7EB',background:'#F9FAFB'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18,flexWrap:'wrap'}}>
                  <button className="bg" onClick={()=>setPage('home')} style={{padding:'5px 12px',fontSize:13}}>← Back</button>
                  <div style={{padding:'3px 10px',borderRadius:20,background:cfg.bg,border:`1px solid ${cfg.border}`,fontSize:12,fontWeight:600,color:cfg.color}}>{role}</div>
                  <div style={{padding:'3px 10px',borderRadius:20,background:'#F9FAFB',border:'1px solid #E5E7EB',fontSize:12,color:'#6B7280'}}>{industry}</div>
                  <span style={{fontSize:12,color:'#9CA3AF',marginLeft:'auto'}}>Q{qIndex+1} of {sessionQs.length}</span>
                </div>
                <div style={{height:4,background:'#E5E7EB',borderRadius:4,marginBottom:24}}>
                  <div style={{height:'100%',borderRadius:4,background:'#6366F1',width:`${(qIndex/sessionQs.length)*100}%`,transition:'width .5s ease'}}/>
                </div>
                <div className="card" style={{padding:'24px',marginBottom:16}}>
                  <p style={{fontSize:11,fontWeight:600,color:'#9CA3AF',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:14}}>Question {qIndex+1}</p>
                  <p style={{fontSize:18,lineHeight:1.65,color:'#111827'}}>{isMC?q.q:q}</p>
                </div>
                {TIPS[role]&&(
                  <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:10,padding:'12px 16px',display:'flex',gap:10}}>
                    <span style={{flexShrink:0}}>💡</span>
                    <p style={{fontSize:13,color:'#92400E',lineHeight:1.5}}><strong>Tip:</strong> {TIPS[role]}</p>
                  </div>
                )}
              </div>

              {/* Right — answer */}
              <div className="ap" style={{width:400,padding:'28px',display:'flex',flexDirection:'column',background:'#fff',overflowY:'auto',flexShrink:0}}>
                {isMC ? (
                  <>
                    <p style={{fontSize:14,fontWeight:600,color:'#374151',marginBottom:14}}>Select the best answer</p>
                    <div style={{display:'flex',flexDirection:'column',gap:10,flex:1}}>
                      {q.options.map((opt,i)=>(
                        <div key={i} className={`mo ${mcChoice===i?'sel':''}`} onClick={()=>setMcChoice(i)}>
                          <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,
                            background:mcChoice===i?'#6366F1':'#F9FAFB',color:mcChoice===i?'#fff':'#6B7280',border:`1.5px solid ${mcChoice===i?'#6366F1':'#E5E7EB'}`}}>
                            {mcChoice===i?'✓':String.fromCharCode(65+i)}
                          </div>
                          <span style={{fontSize:14,color:mcChoice===i?'#111827':'#4B5563',lineHeight:1.5}}>{opt}</span>
                        </div>
                      ))}
                    </div>
                    <button className="bp" onClick={submitMC} disabled={mcChoice===null} style={{marginTop:18,width:'100%',padding:'13px',fontSize:15}}>
                      {isLast?'Finish & See Results →':'Next Question →'}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                      <p style={{fontSize:14,fontWeight:600,color:'#374151'}}>Your Answer</p>
                      <div style={{display:'flex',alignItems:'center',gap:6,background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:8,padding:'5px 10px'}}>
                        <span style={{fontSize:12}}>⏱</span>
                        <span style={{fontSize:13,fontWeight:600,color:'#374151',fontVariantNumeric:'tabular-nums'}}>{fmt(elapsed)}</span>
                      </div>
                    </div>
                    <div style={{position:'relative',flex:1,display:'flex',flexDirection:'column'}}>
                      <textarea value={response} onChange={e=>setResponse(e.target.value)}
                        placeholder="Walk through your approach here. Think out loud — how you structure your answer matters as much as the content..."
                        style={{flex:1,minHeight:260,padding:'16px',paddingBottom:52,border:'1px solid #E5E7EB',borderRadius:12,fontSize:14,
                          lineHeight:1.7,color:'#111827',background:'#F9FAFB',transition:'border-color .2s',display:'block',width:'100%',
                          borderColor:listening?'#FCA5A5':response.length>100?'#A5B4FC':'#E5E7EB'}}
                      />
                      {speechOk&&(
                        <button className={`bg ${listening?'mic-live':''}`} onClick={toggleListening}
                          style={{position:'absolute',left:12,bottom:12,display:'flex',alignItems:'center',gap:6,padding:'6px 12px',fontSize:12,fontWeight:600,
                            borderColor:listening?'#FCA5A5':'#E5E7EB',color:listening?'#EF4444':'#9CA3AF'}}>
                          🎤 {listening?'Listening…':'Speak'}
                        </button>
                      )}
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8,marginBottom:12}}>
                      <span style={{fontSize:12,color:wc>50?'#9CA3AF':'#D1D5DB'}}>{wc} words{wc>0&&wc<50?' — try to elaborate':''}</span>
                      {wc===0&&<span style={{fontSize:12,color:'#D1D5DB'}}>Type your answer to continue</span>}
                    </div>
                    <button className="bp" onClick={submitText} disabled={submitting||response.trim().length<3}
                      style={{width:'100%',padding:'13px',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                      {submitting?(<><span className="spinner"/>Analyzing…</>):isLast?'Finish Interview →':'Next Question →'}
                    </button>
                    <button className="bg" onClick={()=>setConfirmExit(true)} style={{marginTop:8,width:'100%',padding:'11px',fontSize:14}}>Cancel</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ════ SCROLLABLE PAGES ════ */}
          {page!=='interview' && page!=='signin' && (
            <div style={{flex:1,overflowY:'auto'}}>

              {/* ── RESULTS GATE (anonymous user completed an interview) ── */}
              {page==='results-gate' && pendingInterview && (
                <div style={{maxWidth:480,margin:'0 auto',padding:'48px 24px'}}>
                  {/* Score teaser */}
                  <div style={{textAlign:'center',marginBottom:32}}>
                    <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 20px',boxShadow:'0 8px 32px rgba(99,102,241,.3)'}}>🎯</div>
                    <h1 style={{fontSize:26,fontWeight:700,color:'#111827',marginBottom:8}}>Your results are ready</h1>
                    <p style={{color:'#6B7280',fontSize:15,lineHeight:1.6}}>
                      You just completed a <strong>{pendingInterview.role}</strong> interview in <strong>{pendingInterview.industry}</strong>.
                      Create a free account to see your full score, feedback, and coaching.
                    </p>
                  </div>
                  {/* What they'll see */}
                  <div className="card" style={{padding:'16px 20px',marginBottom:20,background:'#F5F3FF',border:'1px solid #DDD6FE'}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#6D28D9',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:10}}>You'll unlock</p>
                    {['Detailed score across 4 dimensions','Specific strengths and areas to improve','Expert coaching on what a strong answer covers','Full session history across devices','Score trend over time'].map((item,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:7}}>
                        <span style={{color:'#7C3AED',fontWeight:700,flexShrink:0}}>✓</span>
                        <span style={{fontSize:13,color:'#4C1D95'}}>{item}</span>
                      </div>
                    ))}
                  </div>
                  {renderAuthForm(null)}
                  <button onClick={()=>setPage('home')} style={{background:'none',border:'none',cursor:'pointer',width:'100%',marginTop:14,fontSize:13,color:'#9CA3AF',textAlign:'center'}}>
                    Skip for now — practice another question
                  </button>
                </div>
              )}

              {/* ── HOME ── */}
              {page==='home' && (
                <div className="mp" style={{maxWidth:820,margin:'0 auto',padding:'36px 32px'}}>
                  <div className="fu" style={{marginBottom:28}}>
                    <h1 style={{fontSize:26,fontWeight:700,color:'#111827',marginBottom:6}}>Practice Interviews</h1>
                    <p style={{color:'#6B7280',fontSize:15}}>Choose your format and industry, then pick a role to begin.</p>
                  </div>
                  {/* Format */}
                  <div className="fu d1" style={{marginBottom:24}}>
                    <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:10}}>Answer format</p>
                    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                      {[{id:'text',label:'Written Response',desc:'AI scores your answer in depth'},
                        {id:'mc',  label:'Multiple Choice',  desc:'Instant scoring, works offline'},
                        {id:'mock',label:'Mock Interview',    desc:'Dynamic back-and-forth with an AI interviewer'}].map(f=>(
                        <div key={f.id} onClick={()=>setFormat(f.id)} style={{flex:1,minWidth:180,padding:'14px 16px',borderRadius:10,cursor:'pointer',
                          border:format===f.id?'2px solid #6366F1':'1px solid #E5E7EB',background:format===f.id?'#F5F3FF':'#fff',transition:'all .15s'}}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                            <span style={{fontSize:14,fontWeight:600,color:format===f.id?'#4F46E5':'#111827'}}>{f.label}</span>
                            {format===f.id&&<div style={{width:16,height:16,borderRadius:'50%',background:'#6366F1',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff'}}>✓</div>}
                          </div>
                          <p style={{fontSize:12,color:'#9CA3AF'}}>{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Difficulty — only for mock */}
                  {format==='mock'&&(
                    <div className="fu d1" style={{marginBottom:24}}>
                      <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:10}}>Difficulty</p>
                      <div style={{display:'flex',gap:8}}>
                        {[{id:'easy',label:'Easy',desc:'3 rounds · Supportive'},
                          {id:'medium',label:'Medium',desc:'5 rounds · Challenging'},
                          {id:'hard',label:'Hard',desc:'7 rounds · Rigorous'}].map(d=>(
                          <div key={d.id} onClick={()=>setDifficulty(d.id)} style={{flex:1,padding:'12px 14px',borderRadius:10,cursor:'pointer',transition:'all .15s',
                            border:difficulty===d.id?`2px solid ${d.id==='easy'?'#059669':d.id==='medium'?'#D97706':'#DC2626'}`:'1px solid #E5E7EB',
                            background:difficulty===d.id?`${d.id==='easy'?'#F0FDF4':d.id==='medium'?'#FFFBEB':'#FEF2F2'}`:'#fff'}}>
                            <p style={{fontSize:13,fontWeight:600,color:difficulty===d.id?(d.id==='easy'?'#059669':d.id==='medium'?'#D97706':'#DC2626'):'#374151',marginBottom:2}}>{d.label}</p>
                            <p style={{fontSize:11,color:'#9CA3AF'}}>{d.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Industry */}
                  <div className="fu d2" style={{marginBottom:28}}>
                    <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:10}}>Industry focus</p>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      {INDUSTRIES.map(ind=>(
                        <button key={ind} className={`chip ${industry===ind?'on':''}`} onClick={()=>setIndustry(ind)}>
                          {IND_ICONS[ind]} {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Full mock */}
                  <div className="fu d3" style={{marginBottom:28}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                      <h2 style={{fontSize:16,fontWeight:600,color:'#111827'}}>{format==='mock'?'Mock Interview':'Full Mock Interview'}</h2>
                      <span style={{fontSize:11,background:'#F3F4F6',color:'#6B7280',padding:'3px 10px',borderRadius:20}}>{format==='mock'?`${MOCK_TURNS[difficulty]||5} rounds`:'5 questions'}</span>
                    </div>
                    <div className="rg" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
                      {ROLES.map(r=>{
                        const c=ROLE_CFG[r];
                        const prob=format==='mock'?(OPENING_PROBLEMS[r]?.[industry]||OPENING_PROBLEMS[r]?.['General']):null;
                        return (
                          <div key={r} className="rc" onClick={()=>startInterview(r,'full')}>
                            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
                              <div style={{width:36,height:36,borderRadius:8,background:c.bg,border:`1px solid ${c.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{c.icon}</div>
                              <span style={{fontSize:11,color:'#9CA3AF',background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:20,padding:'3px 10px'}}>{format==='mock'?`${MOCK_TURNS[difficulty]||5} rounds`:'5 Qs'}</span>
                            </div>
                            <p style={{fontWeight:600,fontSize:14,color:'#111827',marginBottom:4}}>{c.card||r}</p>
                            {prob?<p style={{fontSize:12,color:'#9CA3AF',marginBottom:14,lineHeight:1.4}}>{prob.title}</p>:<p style={{fontSize:12,color:'#9CA3AF',marginBottom:14}}>{c.label}</p>}
                            <span style={{fontSize:12,color:'#6366F1',fontWeight:600}}>Start →</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Quick practice — hidden for mock */}
                  {format!=='mock'&&(
                  <div className="fu d4">
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                      <h2 style={{fontSize:16,fontWeight:600,color:'#111827'}}>Quick Practice</h2>
                      <span style={{fontSize:11,background:'#F3F4F6',color:'#6B7280',padding:'3px 10px',borderRadius:20}}>1 question</span>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10}}>
                      {ROLES.map(r=>{
                        const c=ROLE_CFG[r];
                        return (
                          <div key={r} className="rc" onClick={()=>startInterview(r,'deep')} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px'}}>
                            <div>
                              <div style={{width:6,height:6,borderRadius:'50%',background:c.color,marginBottom:8}}/>
                              <p style={{fontSize:13,fontWeight:600,color:'#374151'}}>{c.short}</p>
                            </div>
                            <span style={{color:'#D1D5DB',fontSize:18}}>›</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  )}
                </div>
              )}

              {/* ── MOCK RESULTS ── */}
              {page==='results' && format==='mock' && mockScore && (()=>{
                const cfgR=role?ROLE_CFG[role]:null;
                const oc=mockScore.overall>=8?'#059669':mockScore.overall>=6?'#2563EB':'#D97706';
                const ol=mockScore.overall>=8?'Excellent':mockScore.overall>=6?'Good':mockScore.overall>=4?'Developing':'Needs Work';
                return (
                  <div className="mp" style={{maxWidth:760,margin:'0 auto',padding:'36px 32px'}}>
                    <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:16}}>
                      <div>
                        <button className="bg" onClick={()=>setPage('home')} style={{padding:'5px 12px',fontSize:13,marginBottom:12}}>← Home</button>
                        <h1 style={{fontSize:22,fontWeight:700,color:'#111827',marginBottom:8}}>Mock Interview Feedback</h1>
                        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                          {cfgR&&<span style={{fontSize:12,background:cfgR.bg,border:`1px solid ${cfgR.border}`,color:cfgR.color,padding:'3px 10px',borderRadius:20,fontWeight:600}}>{role}</span>}
                          <span style={{fontSize:12,background:'#F9FAFB',border:'1px solid #E5E7EB',color:'#6B7280',padding:'3px 10px',borderRadius:20}}>{industry}</span>
                          <span style={{fontSize:12,padding:'3px 10px',borderRadius:20,fontWeight:600,
                            background:difficulty==='easy'?'#F0FDF4':difficulty==='medium'?'#FFFBEB':'#FEF2F2',
                            color:difficulty==='easy'?'#059669':difficulty==='medium'?'#D97706':'#DC2626'}}>
                            {difficulty.charAt(0).toUpperCase()+difficulty.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="card" style={{textAlign:'center',padding:'16px 28px'}}>
                        <div style={{fontSize:40,fontWeight:700,color:oc,lineHeight:1}}>{mockScore.overall}</div>
                        <div style={{fontSize:12,color:'#9CA3AF',marginTop:2}}>out of 10</div>
                        <div style={{fontSize:12,fontWeight:600,color:oc,marginTop:4}}>{ol}</div>
                      </div>
                    </div>
                    {/* 5-dimension scores */}
                    <div className="card fu d1" style={{padding:'20px 24px',marginBottom:14,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
                      {[{k:'structure',l:'Structure'},{k:'depth',l:'Depth'},{k:'problem_solving',l:'Problem Solving'},{k:'adaptability',l:'Adaptability'},{k:'communication',l:'Communication'}].map(d=>(
                        <ScorePill key={d.k} label={d.l} value={mockScore[d.k]}/>
                      ))}
                    </div>
                    {/* Summary */}
                    <div className="card fu d2" style={{padding:'20px 24px',marginBottom:14}}>
                      <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:8}}>Overall Assessment</p>
                      <p style={{fontSize:14,color:'#4B5563',lineHeight:1.7}}>{mockScore.summary}</p>
                    </div>
                    {/* Strengths + improvements */}
                    <div className="s2 fu d3" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                      <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:12,padding:'16px 18px'}}>
                        <p style={{fontSize:11,fontWeight:700,color:'#15803D',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}>Strengths</p>
                        {mockScore.strengths.map((s,j)=><div key={j} style={{display:'flex',gap:8,marginBottom:8}}><span style={{color:'#22C55E',fontWeight:700,flexShrink:0}}>+</span><p style={{fontSize:13,color:'#166534',lineHeight:1.5}}>{s}</p></div>)}
                      </div>
                      <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:12,padding:'16px 18px'}}>
                        <p style={{fontSize:11,fontWeight:700,color:'#B45309',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}>To Improve</p>
                        {mockScore.improvements.map((s,j)=><div key={j} style={{display:'flex',gap:8,marginBottom:8}}><span style={{color:'#F59E0B',fontWeight:700,flexShrink:0}}>→</span><p style={{fontSize:13,color:'#78350F',lineHeight:1.5}}>{s}</p></div>)}
                      </div>
                    </div>
                    {/* Components covered vs missed */}
                    {(mockScore.components_covered?.length>0||mockScore.components_missed?.length>0)&&(
                      <div className="s2 fu d3" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                        {mockScore.components_covered?.length>0&&(
                          <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:12,padding:'16px 18px'}}>
                            <p style={{fontSize:11,fontWeight:700,color:'#15803D',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}>✓ What you identified</p>
                            {mockScore.components_covered.map((c,j)=><div key={j} style={{display:'flex',gap:8,marginBottom:6}}><span style={{color:'#22C55E',fontWeight:700,flexShrink:0}}>+</span><p style={{fontSize:13,color:'#166534',lineHeight:1.5}}>{c}</p></div>)}
                          </div>
                        )}
                        {mockScore.components_missed?.length>0&&(
                          <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:12,padding:'16px 18px'}}>
                            <p style={{fontSize:11,fontWeight:700,color:'#B45309',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}>✗ What you missed</p>
                            {mockScore.components_missed.map((c,j)=><div key={j} style={{display:'flex',gap:8,marginBottom:6}}><span style={{color:'#F59E0B',fontWeight:700,flexShrink:0}}>→</span><p style={{fontSize:13,color:'#78350F',lineHeight:1.5}}>{c}</p></div>)}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Ideal solution */}
                    {sessionMeta.idealSolution&&(
                      <div className="card fu" style={{padding:'20px 24px',marginBottom:14,background:'#EFF6FF',border:'1px solid #BFDBFE'}}>
                        <p style={{fontSize:12,fontWeight:700,color:'#1D4ED8',marginBottom:12,textTransform:'uppercase',letterSpacing:'.05em',display:'flex',alignItems:'center',gap:6}}>
                          💡 Model Answer — What a Strong Response Covers
                        </p>
                        <p style={{fontSize:14,color:'#1E40AF',lineHeight:1.8}}>{sessionMeta.idealSolution}</p>
                      </div>
                    )}
                    <div className="card fu d4" style={{padding:'20px 24px',marginBottom:14}}>
                      <p style={{fontSize:14,fontWeight:600,color:'#111827',marginBottom:16}}>Full Conversation</p>
                      <div style={{display:'flex',flexDirection:'column',gap:14}}>
                        {mockMessages.map((msg,i)=>(
                          <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',flexDirection:msg.role==='candidate'?'row-reverse':'row'}}>
                            <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,
                              background:msg.role==='candidate'?'#6366F1':'#F3F4F6',color:msg.role==='candidate'?'#fff':'#9CA3AF'}}>
                              {msg.role==='candidate'?'Y':'I'}
                            </div>
                            <div style={{flex:1,padding:'12px 16px',borderRadius:msg.role==='candidate'?'18px 4px 18px 18px':'4px 18px 18px 18px',
                              background:msg.role==='candidate'?'#EEF2FF':'#F9FAFB',
                              border:`1px solid ${msg.role==='candidate'?'#C7D2FE':'#E5E7EB'}`}}>
                              <p style={{fontSize:13,color:'#374151',lineHeight:1.6}}>{msg.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Email + CTAs */}
                    <div className="card" style={{padding:'20px 24px',marginBottom:14}}>
                                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                        <div>
                          <p style={{fontSize:14,fontWeight:600,color:'#111827',marginBottom:2}}>Download your results</p>
                          <p style={{fontSize:13,color:'#9CA3AF'}}>Full transcript with questions, answers, and feedback.</p>
                        </div>
                        <button className="bp" onClick={downloadCopy} style={{padding:'10px 20px',fontSize:14,flexShrink:0}}>⬇ Download</button>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:10}}>
                      <button className="bp" onClick={()=>startInterview(role,'full')} style={{flex:1,padding:'13px',fontSize:14}}>Try Again</button>
                      <button className="bg" onClick={()=>setPage('home')} style={{flex:1,padding:'13px',fontSize:14}}>Choose Another Role</button>
                    </div>
                  </div>
                );
              })()}
              {/* ── RESULTS ── */}
              {page==='results' && results && format!=='mock' && (()=>{
                const isMCr=results[0]&&'isCorrect' in results[0];
                const cfgR=role?ROLE_CFG[role]:null;
                const avg=isMCr?Math.round((results.filter(r=>r.isCorrect).length/results.length)*10):Math.round(results.reduce((s,r)=>s+r.feedback.overall,0)/results.length);
                const oc=avg>=8?'#059669':avg>=6?'#2563EB':'#D97706';
                const ol=avg>=8?'Excellent':avg>=6?'Good':avg>=4?'Developing':'Needs Work';
                const ad=d=>Math.round(results.reduce((s,r)=>s+r.feedback[d],0)/results.length);
                return (
                  <div className="mp" style={{maxWidth:760,margin:'0 auto',padding:'36px 32px'}}>
                    <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:16}}>
                      <div>
                        <button className="bg" onClick={()=>setPage('home')} style={{padding:'5px 12px',fontSize:13,marginBottom:12}}>← Home</button>
                        <h1 style={{fontSize:22,fontWeight:700,color:'#111827',marginBottom:8}}>Interview Feedback</h1>
                        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                          {cfgR&&<span style={{fontSize:12,background:cfgR.bg,border:`1px solid ${cfgR.border}`,color:cfgR.color,padding:'3px 10px',borderRadius:20,fontWeight:600}}>{role}</span>}
                          <span style={{fontSize:12,background:'#F9FAFB',border:'1px solid #E5E7EB',color:'#6B7280',padding:'3px 10px',borderRadius:20}}>{industry} · {isMCr?'MC':'Written'}</span>
                        </div>
                      </div>
                      <div className="card" style={{textAlign:'center',padding:'16px 28px'}}>
                        <div style={{fontSize:40,fontWeight:700,color:oc,lineHeight:1}}>{avg}</div>
                        <div style={{fontSize:12,color:'#9CA3AF',marginTop:2}}>out of 10</div>
                        <div style={{fontSize:12,fontWeight:600,color:oc,marginTop:4}}>{ol}</div>
                      </div>
                    </div>
                    {!isMCr&&(
                      <div className="card fu d1 s4" style={{padding:'20px 24px',marginBottom:14,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                        <ScorePill label="Technical" value={ad('technical_depth')}/>
                        <ScorePill label="Clarity"   value={ad('communication_clarity')}/>
                        <ScorePill label="Structure" value={ad('structure')}/>
                        <ScorePill label="Approach"  value={ad('approach')}/>
                      </div>
                    )}
                    {isMCr&&(
                      <div className="card fu d1" style={{padding:'16px 20px',marginBottom:14,background:'#F0FDF4',border:'1px solid #BBF7D0'}}>
                        <p style={{fontSize:14,color:'#166534'}}>You answered <strong>{results.filter(r=>r.isCorrect).length}</strong> of {results.length} correctly.</p>
                      </div>
                    )}
                    {results.map((r,i)=>(
                      <div key={i} className="card fu" style={{padding:'22px 24px',marginBottom:14,animationDelay:`${i*.05+.1}s`}}>
                        <p style={{fontSize:11,fontWeight:600,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:10}}>Question {i+1}</p>
                        <p style={{fontSize:15,color:'#374151',lineHeight:1.6,marginBottom:18}}>{isMCr?r.question:`"${r.question}"`}</p>
                        {isMCr?(
                          <>
                            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:14}}>
                              {r.options.map((opt,j)=>{
                                const ic=j===r.correct,ic2=j===r.chosen;
                                return (
                                  <div key={j} style={{padding:'12px 16px',borderRadius:10,display:'flex',alignItems:'center',gap:12,
                                    background:ic?'#F0FDF4':ic2?'#FEF2F2':'#F9FAFB',border:`1px solid ${ic?'#BBF7D0':ic2?'#FECACA':'#E5E7EB'}`}}>
                                    <div style={{width:24,height:24,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,
                                      background:ic?'#22C55E':ic2?'#EF4444':'#E5E7EB',color:'#fff'}}>
                                      {ic?'✓':ic2?'✕':String.fromCharCode(65+j)}
                                    </div>
                                    <span style={{fontSize:13,color:ic?'#166534':ic2?'#991B1B':'#6B7280',lineHeight:1.4}}>{opt}</span>
                                  </div>
                                );
                              })}
                            </div>
                            <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:10,padding:'12px 16px'}}>
                              <span style={{fontSize:12,fontWeight:600,color:'#1D4ED8'}}>Why: </span>
                              <span style={{fontSize:13,color:'#1E40AF'}}>{r.explanation}</span>
                            </div>
                          </>
                        ):(
                          <>
                            <details style={{marginBottom:14}}>
                              <summary style={{fontSize:13,color:'#9CA3AF',fontWeight:600,cursor:'pointer',listStyle:'none',display:'flex',alignItems:'center',gap:6}}>
                                <span>›</span>Your answer
                              </summary>
                              <p style={{marginTop:10,fontSize:13,color:'#6B7280',lineHeight:1.7,padding:'14px',background:'#F9FAFB',borderRadius:8}}>{r.answer}</p>
                            </details>
                            <div className="s4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>
                              {[{k:'technical_depth',l:'Technical'},{k:'communication_clarity',l:'Clarity'},{k:'structure',l:'Structure'},{k:'approach',l:'Approach'}].map(d=>(
                                <ScorePill key={d.k} label={d.l} value={r.feedback[d.k]}/>
                              ))}
                            </div>
                            <div className="s2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                              <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:10,padding:'14px 16px'}}>
                                <p style={{fontSize:11,fontWeight:700,color:'#15803D',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}>What worked</p>
                                {r.feedback.strengths.map((s,j)=><div key={j} style={{display:'flex',gap:8,marginBottom:6}}><span style={{color:'#22C55E',fontWeight:700,flexShrink:0}}>+</span><p style={{fontSize:13,color:'#166534',lineHeight:1.5}}>{s}</p></div>)}
                              </div>
                              <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:10,padding:'14px 16px'}}>
                                <p style={{fontSize:11,fontWeight:700,color:'#B45309',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}>To improve</p>
                                {r.feedback.improvements.map((s,j)=><div key={j} style={{display:'flex',gap:8,marginBottom:6}}><span style={{color:'#F59E0B',fontWeight:700,flexShrink:0}}>→</span><p style={{fontSize:13,color:'#78350F',lineHeight:1.5}}>{s}</p></div>)}
                              </div>
                            </div>
                            <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:10,padding:'14px 16px',marginBottom:14}}>
                              <p style={{fontSize:13,color:'#374151',lineHeight:1.7}}>{r.feedback.feedback}</p>
                            </div>
                            {r.feedback.key_points?.length>0&&(
                              <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:10,padding:'14px 16px'}}>
                                <p style={{fontSize:11,fontWeight:700,color:'#1D4ED8',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}>💡 What a strong answer covers</p>
                                {r.feedback.key_points.map((kp,j)=><div key={j} style={{display:'flex',gap:10,marginBottom:6}}><span style={{fontWeight:700,color:'#3B82F6',flexShrink:0}}>{j+1}.</span><p style={{fontSize:13,color:'#1E40AF',lineHeight:1.5}}>{kp}</p></div>)}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    {/* Download */}
                    <div className="card" style={{padding:'22px 24px',marginBottom:14}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                        <div>
                          <p style={{fontSize:14,fontWeight:600,color:'#111827',marginBottom:2}}>Download your results</p>
                          <p style={{fontSize:13,color:'#9CA3AF'}}>Full transcript with questions, answers, and feedback.</p>
                        </div>
                        <button className="bp" onClick={downloadCopy} style={{padding:'10px 20px',fontSize:14,flexShrink:0}}>⬇ Download</button>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:10}}>
                      <button className="bp" onClick={()=>startInterview(role,mode)} style={{flex:1,padding:'13px',fontSize:14}}>Retry {role?.split(' ')[0]}</button>
                      <button className="bg" onClick={()=>setPage('home')} style={{flex:1,padding:'13px',fontSize:14}}>Choose Another Role</button>
                    </div>
                  </div>
                );
              })()}

              {/* ── DASHBOARD ── */}
              {page==='dashboard' && (()=>{
                const st=stats();
                const recent=[...interviews].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8);
                const maxC=st?Math.max(...Object.values(st.byRole),1):1;
                return (
                  <div className="mp" style={{maxWidth:820,margin:'0 auto',padding:'36px 32px'}}>
                    <div className="fu" style={{marginBottom:28,display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16}}>
                      <div>
                        <h1 style={{fontSize:26,fontWeight:700,color:'#111827',marginBottom:6}}>Your Progress</h1>
                        <p style={{color:'#6B7280',fontSize:15}}>Track your improvement across roles and sessions.</p>
                      </div>
                      {interviews.length>0&&(
                        <button className="bg" onClick={()=>{if(window.confirm('Clear all session history? This cannot be undone.')){
              setInterviews([]);
              if(user) supabase.from('interviews').delete().eq('user_id',user.id).then(()=>{});
            }}} style={{padding:'8px 14px',fontSize:13,color:'#DC2626',borderColor:'#FECACA',flexShrink:0,marginTop:4}}>Clear history</button>
                      )}
                    </div>
                    {!st?(
                      <div style={{textAlign:'center',padding:'60px 0'}}>
                        {!user ? (
                          <>
                            <p style={{fontSize:40,marginBottom:16}}>🔒</p>
                            <p style={{fontSize:18,fontWeight:600,color:'#374151',marginBottom:8}}>Sign in to track your progress</p>
                            <p style={{color:'#9CA3AF',marginBottom:24,fontSize:14}}>Create a free account to save your history and see your score trends.</p>
                            <button className="bp" onClick={()=>{setAuthMode('signup');setAuthError('');setPage('signin');}} style={{padding:'12px 28px',fontSize:15}}>Create free account →</button>
                          </>
                        ) : (
                          <>
                            <p style={{fontSize:40,marginBottom:16}}>📈</p>
                            <p style={{fontSize:18,fontWeight:600,color:'#374151',marginBottom:8}}>No sessions yet</p>
                            <p style={{color:'#9CA3AF',marginBottom:8,fontSize:14}}>Complete your first interview to start tracking your progress.</p>
                            <p style={{color:'#D1D5DB',marginBottom:24,fontSize:13}}>You'll see your score trends, practice breakdown by role, and session history here.</p>
                            <button className="bp" onClick={()=>setPage('home')} style={{padding:'12px 28px',fontSize:15}}>Start Practicing</button>
                          </>
                        )}
                      </div>
                    ):(
                      <>
                        <div className="fu d1" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
                          {[{l:'Total Sessions',v:st.total,c:'#6366F1'},{l:'Average Score',v:`${st.avg}/10`,c:'#059669'},{l:'Roles Practiced',v:Object.keys(st.byRole).length,c:'#D97706'}].map(s=>(
                            <div key={s.l} className="card" style={{padding:'20px 22px'}}>
                              <p style={{fontSize:12,color:'#9CA3AF',marginBottom:6,fontWeight:500}}>{s.l}</p>
                              <p style={{fontSize:32,fontWeight:700,color:s.c}}>{s.v}</p>
                            </div>
                          ))}
                        </div>
                        {interviews.length>=2&&(
                          <div className="card fu d2" style={{padding:'22px 24px',marginBottom:16}}>
                            <p style={{fontSize:15,fontWeight:600,color:'#111827',marginBottom:4}}>Score Trend</p>
                            <p style={{fontSize:13,color:'#9CA3AF',marginBottom:16}}>Overall score across sessions, oldest to newest.</p>
                            <TrendChart data={[...interviews].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(iv=>({score:iv.score,color:ROLE_CFG[iv.role]?.color||'#6366F1'}))}/>
                          </div>
                        )}
                        <div className="card fu d3" style={{padding:'22px 24px',marginBottom:16}}>
                          <p style={{fontSize:15,fontWeight:600,color:'#111827',marginBottom:20}}>Practice by Role</p>
                          {ROLES.map(r=>{
                            const c=ROLE_CFG[r];const count=st.byRole[r]||0;
                            return (
                              <div key={r} style={{marginBottom:16}}>
                                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                                  <span style={{fontSize:13,color:'#374151'}}>{r}</span>
                                  <span style={{fontSize:13,fontWeight:600,color:count>0?c.color:'#D1D5DB'}}>{count} session{count!==1?'s':''}</span>
                                </div>
                                <div style={{height:6,background:'#F3F4F6',borderRadius:4,overflow:'hidden'}}>
                                  <div style={{height:'100%',borderRadius:4,background:c.color,width:`${(count/maxC)*100}%`,transition:'width .8s ease'}}/>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="card fu d4" style={{padding:'22px 24px'}}>
                          <p style={{fontSize:15,fontWeight:600,color:'#111827',marginBottom:16}}>Recent Sessions</p>
                          <div style={{display:'flex',flexDirection:'column',gap:8}}>
                            {recent.map(s=>{
                              const c2=ROLE_CFG[s.role];const sc=s.score>=8?'#059669':s.score>=6?'#2563EB':'#D97706';
                              return (
                                <div key={s.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:'#F9FAFB',borderRadius:10,border:'1px solid #F3F4F6'}}>
                                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                                    <div style={{width:8,height:8,borderRadius:'50%',background:c2?.color||'#6366F1',flexShrink:0}}/>
                                    <div>
                                      <p style={{fontSize:14,fontWeight:500,color:'#111827'}}>{s.role}{s.industry&&s.industry!=='General'?` · ${s.industry}`:''}</p>
                                      <p style={{fontSize:12,color:'#9CA3AF',marginTop:1}}>{new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · {s.format==='mc'?'MC':'Text'} · {s.mode==='full'?'5 Q':'1 Q'}</p>
                                    </div>
                                  </div>
                                  <span style={{fontSize:20,fontWeight:700,color:sc}}>{s.score}/10</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

            </div>
          )}
        </div>
      </div>
      </>)}
    </>
  );
}
