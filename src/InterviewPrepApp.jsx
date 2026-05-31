import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_BANK, INDUSTRIES, ROLES, OPENING_PROBLEMS, MOCK_TARGETS, EXTRA_PROBLEMS, COMPANY_PERSONAS } from './questions';
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
      .qleft{max-height:40vh;overflow-y:auto;}
      .mp{padding:20px 16px!important;} .s4{grid-template-columns:repeat(2,1fr)!important;}
      .s2{grid-template-columns:1fr!important;} .rg{grid-template-columns:1fr!important;}
      .mobile-content{padding-bottom:72px!important;}
    }
    .mob-bar{display:none;}
    .mob-header{display:none;}
    @media(max-width:768px){
      .mob-bar{display:flex;position:fixed;bottom:0;left:0;right:0;height:64px;background:#fff;border-top:1px solid #E5E7EB;z-index:100;padding-bottom:env(safe-area-inset-bottom);}
      .mob-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:11px;font-weight:500;color:#9CA3AF;cursor:pointer;background:none;border:none;padding:0;transition:color .15s;}
      .mob-tab.on{color:#6366F1;}
      .mob-tab svg{width:22px;height:22px;stroke-width:1.8;fill:none;stroke:currentColor;}
      .mob-header{display:flex;background:#fff;border-bottom:1px solid #E5E7EB;padding:12px 16px;align-items:center;justify-content:space-between;flex-shrink:0;}
      .prof-sheet{position:fixed;inset:0;z-index:200;display:flex;flex-direction:column;justify-content:flex-end;}
      .prof-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.5);}
      .prof-panel{position:relative;background:#fff;border-radius:20px 20px 0 0;padding:20px 20px 36px;z-index:1;}
      .prof-handle{width:36px;height:4px;background:#E5E7EB;border-radius:2px;margin:0 auto 20px;}
    }
    @keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
    .prof-panel{animation:slideUp .25s ease;}
  `}</style>
);

const ROLE_CFG = {
  'AI Solutions Architect':           {color:'#7C3AED',bg:'#F5F3FF',border:'#DDD6FE',icon:'🧠',label:'LLMs, RAG & AI Systems',   short:'AI Architect', card:'AI Solutions Architect'},
  'Forward Deployed Engineer':        {color:'#2563EB',bg:'#EFF6FF',border:'#BFDBFE',icon:'🔧',label:'Embedded Customer Builds', short:'FD Engineer', card:'FD Engineer'},
  'Forward Deployed Product Manager': {color:'#D97706',bg:'#FFFBEB',border:'#FDE68A',icon:'📋',label:'Customer-Embedded PM',     short:'FD PM', card:'FD Product Manager'},
  'Technical Program Manager':                              {color:'#DC2626',bg:'#FEF2F2',border:'#FECACA',icon:'📊',label:'Programs & Delivery',      short:'Tech PM', card:'Tech Program Manager'},
};

/* Pick a question not recently shown, cycles through all before repeating */
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
const IND_ICONS = {General:'',Healthcare:'',Fintech:'','E-commerce':''};
const TIPS = {
  'AI Solutions Architect':           "Focus on trade-offs between RAG, fine-tuning, and prompting, not just what you'd build.",
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
  const x = (i) => n===1 ? pL + (pw/2) : pL + ((i*pw) / (n-1));
  const y = (s) => pT + ph - ((s/10) * ph);
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

/* Sidebar defined OUTSIDE main component */
function calcAvg(interviews) {
  if (!interviews.length) return null;
  const total = interviews.reduce(function(s, i) { return s + i.score; }, 0);
  return Math.round(total / interviews.length);
}

const Sidebar = ({ page, setPage, interviews, user, onLogout, onSignIn, isPro, onUpgrade }) => {
  const st = interviews.length;
  const avg = calcAvg(interviews);
  const avgLabel = avg !== null ? (avg + ' out of 10') : '';
  const planLabel = (user && isPro) ? 'Unlimited everything' : 'Unlimited MC, 5 AI per day';
  const planTitle = (user && isPro) ? 'Pro' : 'Free Plan';
  return (
    <div className="sb" style={{width:220,background:'#fff',borderRight:'1px solid #E5E7EB',display:'flex',flexDirection:'column',padding:'0 10px',flexShrink:0}}>
      <div style={{padding:'20px 6px 20px',borderBottom:'1px solid #F3F4F6'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',letterSpacing:'-0.5px'}}>AI</div>
          <span style={{fontWeight:700,fontSize:15,color:'#111827'}}>Interview Prep</span>
        </div>
      </div>
      <div style={{padding:'14px 0',flex:1}}>
        <p style={{fontSize:11,fontWeight:600,color:'#9CA3AF',padding:'0 12px',marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>Practice</p>
        {[{id:'roles',label:'Role Guides',icon:''},{id:'home',label:'Question Bank',icon:''},{id:'dashboard',label:'My Progress',icon:''}].map(item=>(
          <button key={item.id} className={`ni ${page===item.id?'on':''}`} onClick={()=>setPage(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      {st > 0 && (
        <div style={{margin:'0 0 12px',background:'#F9FAFB',borderRadius:10,border:'1px solid #E5E7EB',padding:'12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
            <span style={{fontSize:12,color:'#9CA3AF'}}>Sessions</span>
            <span style={{fontSize:12,fontWeight:600,color:'#374151'}}>{st}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:12,color:'#9CA3AF'}}>Avg score</span>
            <span style={{fontSize:12,fontWeight:600,color:'#6366F1'}}>{avgLabel}</span>
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
          <button onClick={onSignIn} style={{width:'100%',marginBottom:10,padding:'10px 12px',background:'#EEF2FF',border:'1px solid #C7D2FE',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:600,color:'#4F46E5',textAlign:'left'}}>
            Sign in or Create account
          </button>
        )}
        <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:10,padding:'10px 12px'}}>
          <p style={{fontSize:12,fontWeight:600,color:'#15803D',marginBottom:2}}>{planTitle}</p>
          <p style={{fontSize:11,color:'#6B7280'}}>{planLabel}</p>
          {user && !isPro && <button onClick={onUpgrade} style={{marginTop:6,background:'#6366F1',border:'none',borderRadius:6,color:'#fff',fontSize:11,fontWeight:600,padding:'4px 10px',cursor:'pointer',width:'100%'}}>Upgrade to Pro</button>}
        </div>
      </div>
    </div>
  );
};

export default function InterviewPrepApp() {
  const [page,setPage]             = useState('roles');
  const [user,setUser]             = useState(null);
  const [authLoading,setAuthLoading] = useState(true);
  const [authMode,setAuthMode]     = useState('signup');
  const [authEmail,setAuthEmail]   = useState('');
  const [authPassword,setAuthPassword] = useState('');
  const [authError,setAuthError]   = useState('');
  const [authWorking,setAuthWorking] = useState(false);
  const [pendingInterview,setPendingInterview] = useState(null);
  const [profile,setProfile]       = useState(null); // { is_pro, mocks_completed, pro_expires_at }
  const [showUpgrade,setShowUpgrade] = useState(false);
  const [upgradeReason,setUpgradeReason] = useState(''); // 'mock'|'hard'|'answers'
  const [upgradeWorking,setUpgradeWorking] = useState(false);
  const [interviews,setInterviews] = useState([]);
  const [format,setFormat]         = useState('text');
  const [company,setCompany]       = useState('Anthropic');
  const [selectedRole,setSelectedRole] = useState(null);
  const [showProfileSheet,setShowProfileSheet] = useState(false);
  const [activeTab,setActiveTab] = useState('role');
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

  const loadProfile = async (userId) => {
    const { data:{ session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/profile', { headers:{ 'Authorization':`Bearer ${session.access_token}` } });
      const data = await res.json();
      if (data.profile) setProfile(data.profile);
    } catch(e) { console.warn('Profile load error:', e.message); }
  };

  // Supabase auth state + interview loading
  useEffect(()=>{
    // Check for Stripe return with session_id
    const params = new URLSearchParams(window.location.search);
    const stripeSessionId = params.get('session_id');

    supabase.auth.getSession().then(async({ data:{ session } })=>{
      setUser(session?.user ?? null);
      if(session?.user) {
        loadInterviews(session.user.id);
        loadProfile(session.user.id);
        // Confirm Stripe payment if returning from checkout
        if(stripeSessionId) {
          try {
            const r = await fetch('/api/confirm-upgrade', { method:'POST',
              headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},
              body: JSON.stringify({ sessionId: stripeSessionId }) });
            const d = await r.json();
            if(d.success) { setProfile(p=>({...p, is_pro:true})); }
          } catch(e) {}
          window.history.replaceState({}, '', '/'); // clean URL
        }
      }
      setAuthLoading(false);
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_evt, session)=>{
      setUser(session?.user ?? null);
      if(session?.user) { loadInterviews(session.user.id); loadProfile(session.user.id); }
      else { setInterviews([]); setProfile(null); setPage('home'); }
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
      mode: iv.mode, difficulty: iv.company||null, score: iv.score,
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
          difficulty: pendingInterview.company||null, score: pendingInterview.score,
          problem_title: pendingInterview.problemTitle||null, responses: pendingInterview.responses,
        }]);
        setPendingInterview(null);
        setPage('results');
      }
      if(onSuccess) onSuccess();
    } catch(e) { setAuthError('Something went wrong. Please try again.'); }
    setAuthWorking(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setInterviews([]); setSelectedRole(null); };

  const handleForgotPassword = async () => {
    if(!authEmail.trim()) return setAuthError('Enter your email address first.');
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail.trim());
    setAuthError(error ? error.message : 'Password reset email sent, check your inbox.');
  };
  useEffect(()=>{ if(page==='results'){const t=setTimeout(()=>setBarsAnim(true),400);return()=>clearTimeout(t);} setBarsAnim(false); },[page]);
  useEffect(()=>{ if(page!=='interview'){setElapsed(0);return;} const t=setInterval(()=>setElapsed(e=>e+1),1000);return()=>clearInterval(t); },[page]);
  useEffect(()=>setElapsed(0),[qIndex]);
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:'smooth'}); },[mockMessages,mockThinking]);
  useEffect(()=>()=>{try{recRef.current?.stop();}catch(e){}},[qIndex,page]);

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const wc=response.trim().split(/\s+/).filter(Boolean).length;

  const isPro = profile?.is_pro && (!profile?.pro_expires_at || new Date(profile.pro_expires_at) > new Date());

  // Keep user in the app when pressing back — push a dummy history entry on mount
  // then intercept popstate to navigate within the app instead of leaving
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePop = () => {
      window.history.pushState(null, '', window.location.href);
      // Navigate back within the app based on current page
      if (page === 'interview') { setConfirmExit(true); }
      else if (page === 'results' || page === 'results-gate') { setPage('home'); }
      else if (page === 'signin') { setPage('roles'); }
      else if (selectedRole) { setSelectedRole(null); }
      else { setPage('roles'); }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [page, selectedRole]);



  const startUpgrade = async (priceId) => {
    if (!user) { setPage('signin'); setShowUpgrade(false); return; }
    setUpgradeWorking(true);
    try {
      const { data:{ session } } = await supabase.auth.getSession();
      const res = await fetch('/api/checkout', { method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},
        body: JSON.stringify({ priceId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setErrorMsg(data.error || 'Could not start checkout. Please try again.');
    } catch(e) { setErrorMsg('Checkout failed. Please try again.'); }
    setUpgradeWorking(false);
  };

  const MOCK_TURNS = 5;

  const startInterview=(r,m)=>{
    // Gate: AI features require login (cost control)
    if(!user && (format==='text' || format==='mock')) {
      setAuthMode('signup'); setAuthError(''); setPage('signin'); return;
    }
    // Gate: free trial used up — go to subscription page
    if(!hasFreeTrialLeft(format)) {
      setPage('subscribe'); return;
    }
    // Gate: More than 1 mock interview requires Pro
    if(format==='mock' && user && !isPro && (profile?.mocks_completed||0) >= 1) {
      setUpgradeReason('mock'); setShowUpgrade(true); return;
    }
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
      setSessionMeta({role:r,mode:'mock',format:'mock',industry,company,sessionId:Math.random().toString(36).slice(2),
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
    const maxTurns=MOCK_TURNS;
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
        body:JSON.stringify({mode:'turn',messages:updatedMessages,role,industry,company,turn:newTurn,maxTurns:
          openingProblem,keyComponents:sessionMeta.keyComponents||[],hints:sessionMeta.hints||[]})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Failed.');
      const withReply=[...updatedMessages,{role:'interviewer',content:data.reply}];
      setMockMessages(withReply);
      setMockTurnCount(newTurn);
      // Scoring is triggered manually via the "See my results" button
      // so the user can read the final debrief before leaving
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

  // Free trial tracking
  const FREE_KEYS = { text: 'free_written_done', mock: 'free_mock_done' };
  const hasFreeTrialLeft = (fmt) => {
    if (isPro) return true;
    if (fmt === 'mc') return true; // MC always free
    return !localStorage.getItem(FREE_KEYS[fmt] || FREE_KEYS.text);
  };
  const markFreeTrialUsed = (fmt) => {
    if (fmt === 'mc' || isPro) return;
    const key = FREE_KEYS[fmt] || FREE_KEYS.text;
    localStorage.setItem(key, '1');
  };

  const finishInterview=(responses,fmt2)=>{
    const score=fmt2==='mc'?Math.round((responses.filter(r=>r.isCorrect).length/responses.length)*10):Math.round(responses.reduce((s,r)=>s+r.feedback.overall,0)/responses.length);
    const iv={role,mode,format:fmt2,industry,date:new Date().toISOString(),score,responses};
    setResults(responses);
    markFreeTrialUsed(fmt2); // mark free trial used after completion
    if(user){ saveInterview(iv); setPage('results'); }
    else { setPendingInterview(iv); setPage('results-gate'); }
  };

  const buildTranscript=()=>{
    const isMC=results[0]&&'isCorrect' in results[0];
    let out=`INTERVIEW PREP, SESSION SUMMARY\n${'='.repeat(34)}\nRole: ${sessionMeta.role}\nIndustry: ${sessionMeta.industry}\nDate: ${new Date().toLocaleString()}\n${user?.email?`Email: ${user.email}\n`:''}\n`;
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
  const handleOAuth = async (provider) => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: 'https://ai-interview.solutions' },
    });
    if (error) setAuthError(error.message);
  };

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

      {/* OAuth buttons */}
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:18}}>
        <button onClick={()=>handleOAuth('google')} style={{width:'100%',padding:'11px',border:'1px solid #E5E7EB',borderRadius:8,background:'#fff',cursor:'pointer',fontSize:14,fontWeight:500,color:'#374151',display:'flex',alignItems:'center',justifyContent:'center',gap:10,transition:'background .15s'}}
          onMouseOver={e=>e.currentTarget.style.background='#F9FAFB'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <button onClick={()=>handleOAuth('github')} style={{width:'100%',padding:'11px',border:'1px solid #E5E7EB',borderRadius:8,background:'#fff',cursor:'pointer',fontSize:14,fontWeight:500,color:'#374151',display:'flex',alignItems:'center',justifyContent:'center',gap:10,transition:'background .15s'}}
          onMouseOver={e=>e.currentTarget.style.background='#F9FAFB'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#24292E"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          Continue with GitHub
        </button>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
        <div style={{flex:1,height:1,background:'#E5E7EB'}}/>
        <span style={{fontSize:12,color:'#9CA3AF',fontWeight:500}}>or</span>
        <div style={{flex:1,height:1,background:'#E5E7EB'}}/>
      </div>

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
            <div style={{width:40,height:40,borderRadius:12,background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',margin:'0 auto 16px'}}>AI</div>
            <p style={{color:'#9CA3AF',fontSize:14}}>Loading…</p>
          </div>
        </div>
      )}

      {/* ── Main app, always shown once loading is done ── */}
      {!authLoading && (<>
      {/* ── Inline error banner ── */}
      {errorMsg && (
        <div style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,background:'#FEF2F2',borderBottom:'1px solid #FECACA',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:16}}>️</span>
            <p style={{fontSize:14,color:'#991B1B',fontWeight:500}}>{errorMsg}</p>
          </div>
          <button onClick={()=>setErrorMsg('')} style={{background:'none',border:'none',cursor:'pointer',color:'#DC2626',fontSize:18,lineHeight:1,padding:'0 4px'}}>✕</button>
        </div>
      )}
      {/* ── Upgrade modal ── */}
      {showUpgrade && (
        <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}} onClick={()=>setShowUpgrade(false)}>
          <div style={{background:'#fff',borderRadius:20,padding:36,maxWidth:460,width:'100%',boxShadow:'0 24px 80px rgba(0,0,0,0.25)'}} onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:'center',marginBottom:24}}>
              <div style={{display:'none'}}>
                {upgradeReason==='hard'?'':upgradeReason==='mock'?'':'⚡'}
              </div>
              <h2 style={{fontSize:20,fontWeight:700,color:'#111827',marginBottom:8}}>
                {upgradeReason==='hard'?'Hard mode is Pro only':
                 upgradeReason==='mock'?"You've used your free mock interview":
                 "You've used your free answers for today"}
              </h2>
              <p style={{color:'#6B7280',fontSize:14,lineHeight:1.6}}>
                {upgradeReason==='hard'?'Upgrade to Pro to unlock unlimited mock interviews and written answers.':
                 upgradeReason==='mock'?'Upgrade to Pro for unlimited mock interviews with AI-guided feedback.':
                 'Upgrade to Pro for unlimited AI-scored written answers.'}
              </p>
            </div>
            {/* Pro benefits */}
            <div style={{background:'#F5F3FF',borderRadius:12,padding:'14px 18px',marginBottom:20}}>
              {['Unlimited AI-scored written answers','Unlimited mock interviews','All companies and interview styles','Full session history & score trends'].map((b,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:i<3?8:0}}>
                  <span style={{color:'#7C3AED',fontWeight:700,flexShrink:0}}>✓</span>
                  <span style={{fontSize:13,color:'#4C1D95'}}>{b}</span>
                </div>
              ))}
            </div>
            {/* Pricing options */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              <button onClick={()=>startUpgrade(process.env.VITE_STRIPE_PRICE_MONTHLY||'price_monthly')} disabled={upgradeWorking}
                style={{padding:'14px',background:'#6366F1',color:'#fff',border:'none',borderRadius:12,cursor:'pointer',textAlign:'center',opacity:upgradeWorking?0.6:1}}>
                <div style={{fontSize:18,fontWeight:700}}>$19</div>
                <div style={{fontSize:11,opacity:0.85}}>per month</div>
                <div style={{fontSize:11,opacity:0.7,marginTop:2}}>Cancel anytime</div>
              </button>
              <button onClick={()=>startUpgrade(process.env.VITE_STRIPE_PRICE_PACK||'price_pack')} disabled={upgradeWorking}
                style={{padding:'14px',background:'#111827',color:'#fff',border:'none',borderRadius:12,cursor:'pointer',textAlign:'center',position:'relative',opacity:upgradeWorking?0.6:1}}>
                <div style={{position:'absolute',top:-8,right:-4,background:'#F59E0B',color:'#fff',fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:10}}>BEST VALUE</div>
                <div style={{fontSize:18,fontWeight:700}}>$49</div>
                <div style={{fontSize:11,opacity:0.85}}>30-day pack</div>
                <div style={{fontSize:11,opacity:0.7,marginTop:2}}>One-time payment</div>
              </button>
            </div>
            <button onClick={()=>setShowUpgrade(false)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',color:'#9CA3AF',fontSize:13,padding:'8px 0'}}>
              Maybe later
            </button>
          </div>
        </div>
      )}
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
        <Sidebar page={page} setPage={(p)=>{setPage(p);setSelectedRole(null);setActiveTab('role');}} interviews={interviews} user={user} onLogout={handleLogout} onSignIn={()=>{setAuthMode('signup');setAuthError('');setPage('signin');}} isPro={isPro} onUpgrade={()=>{setUpgradeReason('answers');setShowUpgrade(true);}}/>

        {/* ── Right column: mobile header + page content ── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>

        {/* ── Mobile header (top bar) ── */}
        {page!=='interview' && (
          <div className="mob-header">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff'}}>AI</div>
              <span style={{fontWeight:700,fontSize:15,color:'#111827'}}>Interview Prep</span>
            </div>
            <button onClick={()=>setShowProfileSheet(true)} style={{background:'#F3F4F6',border:'none',cursor:'pointer',width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        )}

        {/* ── Profile sheet (mobile) ── */}
        {showProfileSheet && (
          <div className="prof-sheet">
            <div className="prof-backdrop" onClick={()=>setShowProfileSheet(false)}/>
            <div className="prof-panel">
              <div className="prof-handle"/>
              {user ? (
                <>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,paddingBottom:20,borderBottom:'1px solid #F3F4F6'}}>
                    <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff',flexShrink:0}}>
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <div style={{overflow:'hidden'}}>
                      <p style={{fontSize:14,fontWeight:600,color:'#111827',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user.email}</p>
                      <span style={{fontSize:12,fontWeight:600,color:isPro?'#059669':'#6366F1',background:isPro?'#F0FDF4':'#EEF2FF',padding:'2px 8px',borderRadius:10}}>{isPro?'Pro':'Free Plan'}</span>
                    </div>
                  </div>
                  {!isPro && (
                    <div style={{background:'#F5F3FF',borderRadius:12,padding:'14px 16px',marginBottom:16}}>
                      <p style={{fontSize:13,fontWeight:600,color:'#6D28D9',marginBottom:4}}>Upgrade to Pro</p>
                      <p style={{fontSize:12,color:'#7C3AED',marginBottom:12}}>Unlimited AI answers, unlimited mock interviews, full history.</p>
                      <button className="bp" onClick={()=>{setShowProfileSheet(false);setUpgradeReason('answers');setShowUpgrade(true);}} style={{width:'100%',padding:'11px',fontSize:14}}>
                        See plans →
                      </button>
                    </div>
                  )}
                  {isPro && (
                    <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:12,padding:'12px 16px',marginBottom:16}}>
                      <p style={{fontSize:13,fontWeight:600,color:'#15803D'}}>Pro plan active</p>
                      <p style={{fontSize:12,color:'#6B7280',marginTop:2}}>Unlimited everything</p>
                    </div>
                  )}
                  <button onClick={()=>{handleLogout();setShowProfileSheet(false);}} style={{width:'100%',padding:'12px',background:'none',border:'1px solid #FEE2E2',borderRadius:10,color:'#DC2626',fontSize:14,fontWeight:600,cursor:'pointer'}}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <p style={{fontSize:16,fontWeight:600,color:'#111827',marginBottom:6}}>Sign in or create account</p>
                  <p style={{fontSize:13,color:'#6B7280',marginBottom:16}}>Save your results and track your progress over time.</p>
                  <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:14}}>
                    <button onClick={()=>{setShowProfileSheet(false);handleOAuth('google');}} style={{width:'100%',padding:'12px',border:'1px solid #E5E7EB',borderRadius:10,background:'#fff',cursor:'pointer',fontSize:14,fontWeight:500,color:'#374151',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
                      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Continue with Google
                    </button>
                    <button onClick={()=>{setShowProfileSheet(false);handleOAuth('github');}} style={{width:'100%',padding:'12px',border:'1px solid #E5E7EB',borderRadius:10,background:'#fff',cursor:'pointer',fontSize:14,fontWeight:500,color:'#374151',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#24292E"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                      Continue with GitHub
                    </button>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                    <div style={{flex:1,height:1,background:'#E5E7EB'}}/><span style={{fontSize:12,color:'#9CA3AF'}}>or</span><div style={{flex:1,height:1,background:'#E5E7EB'}}/>
                  </div>
                  <button className="bp" onClick={()=>{setShowProfileSheet(false);setAuthMode('signup');setAuthError('');setPage('signin');}} style={{width:'100%',padding:'12px',fontSize:15,marginBottom:10}}>
                    Sign up with email →
                  </button>
                  <button className="bg" onClick={()=>{setShowProfileSheet(false);setAuthMode('login');setAuthError('');setPage('signin');}} style={{width:'100%',padding:'12px',fontSize:15}}>
                    Sign in with email
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Mobile bottom tab bar ── */}
        {page!=='interview' && (
          <nav className="mob-bar">
            {[
              {id:'roles',label:'Guides',icon:<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>},
              {id:'home',label:'Practice',icon:<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>},
              {id:'dashboard',label:'Progress',icon:<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>},
            ].map(tab=>(
              <button key={tab.id} className={`mob-tab ${page===tab.id?'on':''}`} onClick={()=>{setPage(tab.id);setSelectedRole(null);setActiveTab('role');}}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        )}
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

                </div>
                <div style={{fontSize:13,color:'#9CA3AF',flexShrink:0}}>Round {mockTurnCount} of {MOCK_TURNS}</div>
              </div>
              {/* Progress */}
              <div style={{height:3,background:'#F3F4F6',flexShrink:0}}>
                <div style={{height:'100%',background:'#6366F1',width:`${(mockTurnCount/(MOCK_TURNS))*100}%`,transition:'width .5s ease'}}/>
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
              {mockTurnCount<(MOCK_TURNS)&&!mockThinking&&(
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
                         {listening?'Listening…':'Speak'}
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
              {/* Finish button — shown after all rounds complete and not still thinking */}
              {mockTurnCount>=(MOCK_TURNS)&&!mockThinking&&(
                <div style={{background:'#fff',borderTop:'1px solid #E5E7EB',padding:'20px 24px',flexShrink:0}}>
                  <div style={{background:'#F5F3FF',border:'1px solid #DDD6FE',borderRadius:12,padding:'16px 20px',marginBottom:16,textAlign:'center'}}>
                    <p style={{fontSize:14,fontWeight:600,color:'#6D28D9',marginBottom:4}}>Interview complete</p>
                    <p style={{fontSize:13,color:'#7C3AED'}}>All {MOCK_TURNS} rounds done. Get your score and detailed feedback.</p>
                  </div>
                  <button className="bp" onClick={async()=>{
                    setMockThinking(true);
                    try{
                      const { data:{ session:msess } } = await supabase.auth.getSession();
                      const mockHeaders={'Content-Type':'application/json',...(msess?.access_token?{'Authorization':`Bearer ${msess.access_token}`}:{})};
                      const scoreRes=await fetch('/api/mock',{method:'POST',headers:mockHeaders,
                        body:JSON.stringify({mode:'score',messages:mockMessages,role,industry,company,
                          openingProblem,keyComponents:sessionMeta.keyComponents||[]})});
                      const scoreData=await scoreRes.json();
                      if(scoreRes.ok&&scoreData.score){
                        setMockScore(scoreData.score);
                        markFreeTrialUsed('mock');
                        const iv={role,mode:'mock',format:'mock',industry,company,
                          date:new Date().toISOString(),score:scoreData.score.overall,
                          problemTitle:sessionMeta.problemTitle,messages:mockMessages,mockScore:scoreData.score};
                        if(user){ saveInterview(iv); setPage('results'); }
                        else { setPendingInterview(iv); setPage('results-gate'); }
                      } else { setErrorMsg(scoreData.error||'Could not score interview. Please try again.'); }
                    }catch(e){ setErrorMsg(e.message||'Error scoring interview.'); }
                    finally{ setMockThinking(false); }
                  }} style={{width:'100%',padding:'14px',fontSize:16,fontWeight:700}}>
                    See my results →
                  </button>
                </div>
              )}
            </div>
          )}
          {page==='interview' && format!=='mock' && q && cfg && (
            <div className="isp" style={{display:'flex',flex:1,overflow:'hidden'}}>
              {/* Left, question */}
              <div className="qleft" style={{flex:1,padding:'28px 32px',overflowY:'auto',borderRight:'1px solid #E5E7EB',background:'#F9FAFB'}}>
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
                    <span style={{flexShrink:0}}></span>
                    <p style={{fontSize:13,color:'#92400E',lineHeight:1.5}}><strong>Tip:</strong> {TIPS[role]}</p>
                  </div>
                )}
              </div>

              {/* Right, answer */}
              <div className="ap" style={{width:400,padding:'28px',display:'flex',flexDirection:'column',background:'#fff',overflowY:'auto',flexShrink:0}}>
                {isMC ? (
                  <>
                    <p style={{fontSize:13,fontWeight:600,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:16}}>Select the best answer</p>
                    <div style={{display:'flex',flexDirection:'column',gap:12,flex:1}}>
                      {q.options.map((opt,i)=>(
                        <div key={i} className={`mo ${mcChoice===i?'sel':''}`} onClick={()=>setMcChoice(i)}
                          style={{padding:'16px 18px',alignItems:'flex-start'}}>
                          <div style={{width:30,height:30,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,marginTop:1,
                            background:mcChoice===i?'#6366F1':'#F3F4F6',color:mcChoice===i?'#fff':'#6B7280',border:`1.5px solid ${mcChoice===i?'#6366F1':'#E5E7EB'}`}}>
                            {mcChoice===i?'✓':String.fromCharCode(65+i)}
                          </div>
                          <span style={{fontSize:14,color:mcChoice===i?'#111827':'#4B5563',lineHeight:1.6}}>{opt}</span>
                        </div>
                      ))}
                    </div>
                    <button className="bp" onClick={submitMC} disabled={mcChoice===null} style={{marginTop:20,width:'100%',padding:'14px',fontSize:15}}>
                      {isLast?'Finish and see results →':'Next question →'}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                      <p style={{fontSize:14,fontWeight:600,color:'#374151'}}>Your Answer</p>
                      <div style={{display:'flex',alignItems:'center',gap:6,background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:8,padding:'5px 10px'}}>
                        <span style={{fontSize:12}}></span>
                        <span style={{fontSize:13,fontWeight:600,color:'#374151',fontVariantNumeric:'tabular-nums'}}>{fmt(elapsed)}</span>
                      </div>
                    </div>
                    <div style={{position:'relative',flex:1,display:'flex',flexDirection:'column'}}>
                      <textarea value={response} onChange={e=>setResponse(e.target.value)}
                        placeholder="Walk through your approach here. Think out loud, how you structure your answer matters as much as the content..."
                        style={{flex:1,minHeight:260,padding:'16px',paddingBottom:52,border:'1px solid #E5E7EB',borderRadius:12,fontSize:14,
                          lineHeight:1.7,color:'#111827',background:'#F9FAFB',transition:'border-color .2s',display:'block',width:'100%',
                          borderColor:listening?'#FCA5A5':response.length>100?'#A5B4FC':'#E5E7EB'}}
                      />
                      {speechOk&&(
                        <button className={`bg ${listening?'mic-live':''}`} onClick={toggleListening}
                          style={{position:'absolute',left:12,bottom:12,display:'flex',alignItems:'center',gap:6,padding:'6px 12px',fontSize:12,fontWeight:600,
                            borderColor:listening?'#FCA5A5':'#E5E7EB',color:listening?'#EF4444':'#9CA3AF'}}>
                           {listening?'Listening…':'Speak'}
                        </button>
                      )}
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8,marginBottom:12}}>
                      <span style={{fontSize:12,color:wc>50?'#9CA3AF':'#D1D5DB'}}>{wc} words{wc>0&&wc<50?', try to elaborate':''}</span>
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
            <div style={{flex:1,overflowY:'auto'}} className="mobile-content">

              {/* ── ROLES GUIDE ── */}
              {page==='roles' && (()=>{

                const INTERVIEW_GUIDES = {
                  'AI Solutions Architect': {
                    process: [
                      { stage: 'Recruiter screen', duration: '30 min', what: 'Background, motivation, why this company. Expect to explain your experience with AI systems and enterprise customers. Prepare a crisp 2-minute story of your most technical customer-facing project.' },
                      { stage: 'Technical screen', duration: '45-60 min', what: 'AI system design or RAG architecture question. You will be asked to design something end-to-end: choose a vector database, chunking strategy, embedding model, retrieval approach. Think out loud. They want your reasoning, not just the answer.' },
                      { stage: 'Case study or whiteboard', duration: '60 min', what: 'A real customer scenario: "A hospital wants to give doctors AI-assisted chart summarization. Walk us through the architecture." You are evaluated on how you handle ambiguity, ask clarifying questions, and structure a response that is both technically sound and explainable to a non-technical stakeholder.' },
                      { stage: 'Behavioral loop', duration: '3-4 rounds', what: 'Expect STAR-format questions on handling difficult customers, failed projects, and technical disagreements. Most AI SA interviews heavily weight customer-handling stories.' },
                      { stage: 'Hiring manager final', duration: '45 min', what: 'Mission alignment, team fit, and any lingering technical questions. Prepare questions about the specific deployment challenges their enterprise customers face.' },
                    ],
                    framework: {
                      name: 'DISCOVER framework for AI architecture questions',
                      steps: [
                        { label: 'D - Define the problem', desc: 'Restate what success looks like in concrete terms. "We want doctors to retrieve relevant patient history in under 2 seconds with at least 90% recall on critical diagnoses." Interviewers reward candidates who set measurable goals before picking a solution.' },
                        { label: 'I - Inventory existing systems', desc: 'Ask what data exists, in what format, and where it lives. EMR system? PDF discharge notes? Structured SQL or unstructured text? The architecture depends entirely on the answer. This question alone signals SA-level thinking.' },
                        { label: 'S - Select the approach', desc: 'Explicitly choose between RAG, fine-tuning, function calling, or hybrid. State why: "Given the volume of proprietary clinical notes and the need for real-time updates, RAG over fine-tuning because retraining costs are prohibitive and the knowledge base changes daily."' },
                        { label: 'C - Component design', desc: 'Walk through ingestion pipeline, chunking strategy, embedding model choice, vector store selection, retrieval method (dense, sparse, or hybrid), reranking, and prompt construction. Be specific about the tradeoffs at each step.' },
                        { label: 'O - Observability and evals', desc: 'Define how you will know if it is working: retrieval recall@5, answer faithfulness (RAGAS score), hallucination rate, latency p95. This separates candidates who have shipped production systems from those who have only built prototypes.' },
                        { label: 'V - Validate with stakeholders', desc: 'Explain how you would run a pilot: which user group, what success criteria, how long before you decide to expand or kill it.' },
                        { label: 'E - Edge cases and failure modes', desc: 'What happens when retrieval returns nothing relevant? When the model hallucinates a drug interaction? What are the fallback behaviors? Anthropic interviews specifically probe this step.' },
                        { label: 'R - Roadmap the next iteration', desc: 'Briefly describe what v2 looks like. Agentic retrieval? Fine-tuned reranker? This shows you think beyond the immediate deliverable.' },
                      ],
                    },
                    exampleQ: {
                      question: 'A large hospital system wants to deploy an AI assistant that can answer clinician questions using 10 years of internal clinical protocols, research papers, and patient outcome data. How would you architect this?',
                      strongAnswer: 'Start by clarifying: are we doing real-time patient queries during a clinical encounter, or asynchronous research support? That changes the latency requirement entirely. Assuming real-time: I would build a hybrid RAG system. Clinical protocols are structured and high-trust so they get chunked at the section level and stored in pgvector with metadata filters for department and version. Research papers are chunked at the paragraph level. Patient outcome data is never stored in the vector index due to PHI, instead it is queried via a secure SQL tool call. I would use a reranker (Cohere Rerank or a fine-tuned cross-encoder) to improve precision before passing retrieved context to the model. For evals, I would run RAGAS against a golden dataset of 200 clinician-verified Q&A pairs, targeting answer faithfulness above 0.85 and context recall above 0.80. I would not go to production until we hit those numbers in a 30-day pilot with 20 clinicians.',
                      why: 'This answer earns high marks because it asks a clarifying question first, makes explicit architectural choices with stated reasons, handles the PHI constraint specifically rather than ignoring it, and defines concrete eval targets before launch.',
                    },
                    reading: [
                      { title: 'Anthropic Applied AI team blog', url: 'https://www.anthropic.com/news', note: 'Read every enterprise deployment post. These are the exact use cases you will be asked to architect.' },
                      { title: 'RAGAS documentation', url: 'https://docs.ragas.io', note: 'The standard eval framework for RAG systems. Know recall, faithfulness, and context precision cold.' },
                      { title: 'IGotAnOffer: GenAI System Design', url: 'https://igotanoffer.com/en/advice/generative-ai-system-design-interview', note: 'Best free resource for AI system design interview prep. Covers RAG, agents, reliability, and evaluation.' },
                    ],
                  },
                  'Forward Deployed Engineer': {
                    process: [
                      { stage: 'Recruiter screen', duration: '30 min', what: 'Why Palantir or the specific company, what defines your job search, and which role (SWE vs FDE) fits you better. Read the Q4 shareholder letter before this call. Use the vocabulary: ontology, transforms, AIP, Phase 4 adoption. Candidates who stay abstract get filtered out here.' },
                      { stage: 'Online assessment', duration: '90 min (Palantir)', what: 'Three questions: one coding problem (medium-hard), one SQL question focused on real-world data manipulation (window functions, multi-step transforms, not textbook joins), and one API integration task. Palantir uses HackerRank. The bar is senior-engineer level.' },
                      { stage: 'Decomposition round', duration: '60 min', what: 'A Palantir-specific round that tests problem structuring. You are given a real-world messy problem (no clean requirements) and asked to break it into components, identify the core constraint, and propose a phased solution. Most candidates fail this because they try to code instead of structure.' },
                      { stage: 'Learning round', duration: '60 min', what: 'Another Palantir-specific round. You are given a real codebase or system you have never seen and asked to understand it, modify it, or debug it. Tests how quickly you learn unfamiliar systems under pressure.' },
                      { stage: 'System design', duration: '60 min', what: 'Distributed systems design at the scale Palantir operates. Correctness and fault tolerance are first-class constraints. Candidates who treat these as afterthoughts do not advance.' },
                      { stage: 'Hiring manager final', duration: '60 min', what: 'Mission alignment, project ownership mindset, and revisiting any open questions. Prepare stories about owning outcomes end-to-end, not just completing tasks.' },
                    ],
                    framework: {
                      name: 'SCOPE framework for Decomposition questions',
                      steps: [
                        { label: 'S - Situation clarity', desc: 'Spend the first 5 minutes asking questions until you can state the problem in one sentence. "A defense agency wants to reduce the time analysts spend finding relevant intelligence reports from 4 hours to 20 minutes." FDEs who jump to solutions before understanding the situation get cut.' },
                        { label: 'C - Constraints inventory', desc: 'Surface the hard constraints before proposing anything: data access restrictions, latency requirements, airgap requirements, existing systems that cannot be replaced. At Palantir, government deployments often have constraints most engineers have never encountered.' },
                        { label: 'O - Options with tradeoffs', desc: 'Propose 2-3 approaches explicitly and state what each one sacrifices. "Option A is faster to build but depends on internet connectivity. Option B works airgapped but requires 3 weeks of data engineering first." This is how senior engineers think.' },
                        { label: 'P - Phased delivery plan', desc: 'Break the solution into phases with clear milestones. Phase 1 delivers value to the customer in 2 weeks. Phase 2 adds the harder components. FDE interviewers specifically look for this because it reflects how deployments actually work.' },
                        { label: 'E - Edge cases and failure modes', desc: 'What happens when the data pipeline breaks? When the customer changes requirements mid-build? When the integration partner goes down? Anticipating failure modes is what separates FDEs from engineers who only build in clean conditions.' },
                      ],
                    },
                    exampleQ: {
                      question: 'An Airbus manufacturing facility wants to reduce unplanned downtime on their final assembly line. They have sensor data from 400 machines, maintenance logs in PDF format, and a legacy ERP system with no API. How would you approach this?',
                      strongAnswer: 'First I would spend a day on the floor understanding what "unplanned downtime" actually means to the mechanics, not the managers. Those are usually different problems. Then I would inventory what the sensor data actually looks like in practice, not in the spec, because manufacturing data is almost always messier than described. Given no ERP API, I would build a thin extraction layer using screen-scraping or direct DB access, depending on what security allows. For the PDF maintenance logs, I would run a structured extraction pipeline to pull failure codes, repair timestamps, and part numbers into a queryable format. The predictive layer would start simple: threshold-based alerts on sensor anomalies correlated with historical failure patterns, not a full ML model. Get that working and in front of mechanics in week two. The ML comes in phase two once the data pipeline is proven. I would define success as: the maintenance team acts on at least 60% of alerts and finds them useful. If they ignore the alerts, the system failed regardless of the model accuracy.',
                      why: 'This answer wins because it starts with user research not architecture, acknowledges real-world data messiness, proposes a simple phase 1 that delivers value fast, and defines success in terms of adoption rather than model metrics.',
                    },
                    reading: [
                      { title: 'Palantir Q4 2025 Shareholder Letter', url: 'https://investors.palantir.com', note: 'Required reading before any Palantir interview. Learn the vocabulary: AIP, ontology, Phase 4 adoption, 137% commercial growth.' },
                      { title: 'DataInterview: Palantir FDE Guide', url: 'https://www.datainterview.com/blog/palantir-forward-deployed-engineer-interview', note: 'The most specific public guide on the Palantir FDE interview process. Read the Decomposition and Learning round sections carefully.' },
                      { title: 'Prepfully: Palantir SWE Guide', url: 'https://prepfully.com/interview-guides/palantir-software-engineer', note: 'Covers the full onsite loop including what each round actually tests versus what candidates think it tests.' },
                    ],
                  },
                  'Forward Deployed Product Manager': {
                    process: [
                      { stage: 'Recruiter screen', duration: '30 min', what: 'Background, motivation, and a quick gut-check on consulting or product instincts. Expect: "Tell me about a time you managed a difficult stakeholder." Have a crisp, specific story ready.' },
                      { stage: 'Product case study', duration: '60 min', what: 'A real scenario: "A Fortune 500 logistics company bought our product 6 months ago. Adoption is at 12%. The account is at risk. What do you do?" This tests diagnosis (asking the right questions), prioritization (what matters most), and communication (how do you tell the customer what they do not want to hear).' },
                      { stage: 'Behavioral deep-dives', duration: '45 min x2', what: 'STAR format. Expect: managing scope creep, delivering bad news, a project that failed and what you learned, a time you disagreed with a stakeholder and what happened. Have at least 6 detailed stories prepared covering these themes.' },
                      { stage: 'Technical fluency check', duration: '45 min', what: 'Not a coding interview. Expect to discuss: how would you write requirements for an LLM feature, how would you define success metrics for a RAG deployment, what questions would you ask an engineering team to assess timeline feasibility. They want to know you will not embarrass yourself in a room with engineers.' },
                      { stage: 'Presentation or written exercise', duration: 'Take-home', what: 'Palantir sometimes asks for a written program brief (capped at 4 pages): scope a solution to a real operational problem. Amazon TPM interviews include a similar writing exercise. Clarity and precision matter more than length.' },
                    ],
                    framework: {
                      name: 'DIAGNOSE framework for PM case questions',
                      steps: [
                        { label: 'D - Define success', desc: 'Before diagnosing any problem, ask: what does success look like for this customer in concrete terms? Revenue impact? Time savings? Compliance requirement? You cannot prioritize without knowing what you are optimizing for.' },
                        { label: 'I - Identify the real problem', desc: 'Customers describe symptoms, not root causes. "Our team is not using the product" could mean: the UI is confusing, the training was inadequate, the feature does not match their workflow, or the champion who bought it left the company. Ask until you have the root cause.' },
                        { label: 'A - Assess your constraints', desc: 'What can actually be built in the time available? What is out of scope? Strong FDPMs set scope explicitly and early. Every hour you spend not saying no to something is an hour the engineering team spends building the wrong thing.' },
                        { label: 'G - Generate options', desc: 'Propose multiple paths with explicit tradeoffs. "We could build the custom export feature in 3 weeks, or we could configure the existing export to cover 80% of their use case in 3 days. I recommend the latter because the account is at risk and we need a win this week."' },
                        { label: 'N - Negotiate with all stakeholders', desc: 'The customer wants everything. Engineering wants a clean scope. Leadership wants the account saved. Your job is to find the proposal that all three can live with. State explicitly what each party is giving up.' },
                        { label: 'O - Own the outcome', desc: 'Write down what you agreed to, send it to all parties, and track it. The written record is your protection when scope creep starts. Every FDPM who has been in a disputed delivery will tell you this step matters more than any other.' },
                        { label: 'S - Show progress early', desc: 'Do not disappear for 3 weeks and resurface with a finished product. Weekly demos of incremental progress build customer trust and surface misunderstandings early when they are cheap to fix.' },
                        { label: 'E - Evaluate and close the loop', desc: 'After delivery, run a retrospective with the customer. What worked? What would they change? This feedback directly informs the product roadmap and demonstrates the relationship maturity that leads to expansion revenue.' },
                      ],
                    },
                    exampleQ: {
                      question: 'You are three weeks into a deployment. The customer\'s CTO tells you the original scope is too limited and they need three additional features to get value from the product. Your engineering team says adding even one feature will push the timeline by four weeks. What do you do?',
                      strongAnswer: 'First I would get specific: which three features, and what business problem does each one solve? In my experience, when a CTO lists three features two weeks in, at least one of them is a nice-to-have that surfaced because someone in a meeting mentioned it. I would run a quick prioritization: which single feature, if delivered, would unblock the customer\'s primary use case? Then I would go back to engineering with just that one and ask: is there a lighter version we can build in one week that gets them 80% of the value? Almost always the answer is yes. I would present the customer with a revised plan: we deliver the lightweight version of Feature A in week four, which unblocks your core workflow, and we scope Features B and C into a follow-on engagement. I would send a written summary of this agreement within 24 hours. What I would not do is agree to all three features and let the team miss the original timeline without telling anyone.',
                      why: 'This answer demonstrates scope management (pushes back without saying no), customer empathy (asks what problem they are actually solving), engineering partnership (negotiates a lighter version), and written discipline (documents the agreement).',
                    },
                    reading: [
                      { title: 'IGotAnOffer: OpenAI PM Interview', url: 'https://igotanoffer.com/en/advice/openai-product-manager-interview', note: 'Covers how OpenAI PM interviews are structured and what they weight. The metric and execution questions are relevant to FDPM roles.' },
                      { title: 'Amazon Leadership Principles', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles', note: 'Customer Obsession, Ownership, and Dive Deep are the three most tested in FDPM interviews. Prepare one specific story for each.' },
                      { title: 'Prepfully: Palantir PM Guide', url: 'https://prepfully.com/interview-questions/palantir-technologies/product-manager', note: 'Real questions submitted by recent Palantir PM candidates. Use these as a story bank for your behavioral prep.' },
                    ],
                  },
                  'Technical Program Manager': {
                    process: [
                      { stage: 'Recruiter screen', duration: '30-45 min', what: 'Role fit, level calibration, and your program management story. Be ready to describe the most complex multi-team program you have owned: how many teams, what the dependencies were, and what the outcome was. This establishes your level.' },
                      { stage: 'Technical phone screen', duration: '60 min', what: 'System design or architecture dependencies question. Amazon TPM screens specifically test: design an automated shuttle bus scheduling system, or design a system that handles hundreds of time-scheduled transactions. You do not need to code but you need to reason through the technical components clearly.' },
                      { stage: 'Program management execution round', duration: '60 min', what: 'How do you actually run a program? Expect: "Walk me through how you would launch a new API across 8 engineering teams." They are looking for: dependency mapping, risk identification, communication cadence, and go/no-go criteria. Be specific and systematic.' },
                      { stage: 'Behavioral loop (Amazon LP questions)', duration: '4-5 rounds at Amazon', what: 'Every Amazon TPM answer is judged through Leadership Principles. The most tested: Ownership ("Tell me about a time you took responsibility for something outside your role"), Dive Deep ("Tell me about a time you found a problem others had missed"), Deliver Results ("Tell me about a time you delivered under pressure"). Prepare 8-10 detailed STAR stories that cover all 14 LPs.' },
                      { stage: 'Bar Raiser (Amazon)', duration: '60 min', what: 'A senior interviewer from outside the team who can veto the hire. They are looking for signals that you raise the bar: unusually high ownership, unusually deep technical understanding, unusually crisp communication. Do not relax in this round.' },
                      { stage: 'Written program brief (Amazon)', duration: 'Take-home, max 4 pages', what: 'Scope a solution to a real operational problem. Amazon is explicit: clarity and structure matter more than length. Write in clear paragraphs, not bullet points. State your assumptions. Define success criteria. Describe risks and mitigations.' },
                    ],
                    framework: {
                      name: 'PRISM framework for program execution questions',
                      steps: [
                        { label: 'P - Program map first', desc: 'Before anything else, build the dependency map. Pull every team\'s plan. Find where Team A\'s output is Team B\'s input. Find where no one has agreed on the interface. The critical path is almost never what anyone thinks it is. State it explicitly and get alignment on it in week one.' },
                        { label: 'R - Risk register from day one', desc: 'On day one, write down every assumption the program is making and ask: what happens if this assumption is wrong? That list is your risk register. Stack-rank by probability times impact. The top 3 risks get a mitigation plan. The rest get a monitoring plan. Revisit weekly.' },
                        { label: 'I - Instrument your program', desc: 'Define how you will know the program is on track before it starts, not after it slips. What is the weekly leading indicator of health? Which team is the most likely bottleneck and how will you know 3 weeks in advance? Google and Amazon interviewers specifically probe this.' },
                        { label: 'S - Single source of truth', desc: 'Create one document that is the authoritative program state: what is done, what is in progress, what is blocked, what is at risk. Replace every competing spreadsheet with a link to this document. The biggest value a TPM provides is eliminating the coordination overhead that happens when teams have different pictures of reality.' },
                        { label: 'M - Meeting discipline', desc: 'Every meeting you run has three properties: a pre-distributed agenda, a decision or action item as the output, and a written summary within 24 hours. If a meeting produces no decision and no action, cancel it. Amazon\'s writing culture means decisions made verbally without a written record are not really decisions.' },
                      ],
                    },
                    exampleQ: {
                      question: 'You are brought onto a program that has already slipped twice. Four engineering teams are involved, each blaming the others for the delays. The VP wants a credible new date in two weeks. What do you do?',
                      strongAnswer: 'The first thing I do is not give the VP a new date. Every date that has been given so far has been wrong, and giving a new one without understanding why the old ones were wrong just creates the next slip. In week one I do three things: I talk to each team lead individually (not in the group setting where everyone is defensive) and ask them to walk me through what they have, what they are waiting for, and what they cannot do until something else happens. I build the actual dependency map, which I guarantee does not match what anyone thinks it is. And I find the critical path, not the official timeline, by identifying which single blocker is upstream of the most other blocked work. In week two I present the VP with a program brief: here is why it slipped twice (specific root causes, not blame), here is the actual critical path, here is what has to be true for us to hit a new date, and here is a realistic date with the three risks that could break it. That is a credible date. A date without that analysis is a guess.',
                      why: 'This answer scores well because it refuses to give a date without analysis (demonstrates backbone), focuses on root causes not blame (demonstrates maturity), and describes a concrete 2-week investigation plan rather than a vague process.',
                    },
                    reading: [
                      { title: 'Amazon 14 Leadership Principles', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles', note: 'Memorize all 14. Prepare one specific STAR story for each. At Amazon, every behavioral answer is scored against these explicitly.' },
                      { title: 'IGotAnOffer: Google TPM Interview', url: 'https://igotanoffer.com/blogs/tech/google-technical-program-manager-interview', note: 'The best free breakdown of how Google structures TPM interviews and what each round is actually testing.' },
                      { title: 'Mario Gerard: Amazon TPM Questions', url: 'https://www.mariogerard.com/amazon-tpm-interview-questions-with-answers/', note: 'Includes the actual Amazon written program brief exercise with a real prompt. Practice writing a 4-page brief to a real scenario before your interview.' },
                    ],
                  },
                };

                const ROLE_ARTICLES = [
                  {
                    key: 'AI Solutions Architect',
                    cfg: ROLE_CFG['AI Solutions Architect'],
                    what: "An AI Solutions Architect is a pre-sales and advisory technical role focused on helping enterprise customers integrate AI into their existing systems. At Anthropic, the Applied AI SA role is described as being a trusted technical advisor who helps large enterprises understand the value of Claude and paints the vision of how they can successfully deploy it. At AWS and Google Cloud, SAs spend most of their time in discovery and scoping, understanding a customer's data landscape, existing infrastructure, and business goals, then designing the architecture that bridges what the customer has today with what an AI system needs to work.",
                    notJust: "This role is often confused with a software engineer or a consultant. Unlike an FDE, an AI SA writes almost no production code. Unlike a consultant, they must defend technical decisions in front of engineers who will push back hard. The role lives at the intersection: deep enough to earn the respect of the engineering team, broad enough to speak the language of a CTO or VP of Product. A day is mostly meetings, discovery sessions, architecture reviews, stakeholder presentations, punctuated by document writing. The output is proposals, diagrams, and recommendations, not pull requests.",
                    dayToDay: [
                      "Technical discovery: mapping a customer's existing data sources, APIs, vector stores, and model infrastructure, what they have, what is missing, and what the gaps are",
                      "Writing architecture decision records: why RAG over fine-tuning, why pgvector over Pinecone, why Claude Sonnet over Haiku for this specific use case",
                      "Running proof-of-concept sessions alongside the customer's engineering team to validate assumptions before the FDE commits to a full build",
                      "Translating technical tradeoffs into business language for the executive sponsor: latency vs cost, accuracy vs speed, build vs buy",
                      "Defining the evaluation framework upfront: how will we know if this RAG pipeline is actually working? Retrieval recall, answer faithfulness, latency targets",
                      "Handing off a detailed technical specification to the Forward Deployed Engineer who will actually build it",
                      "Staying involved during implementation to unblock architectural decisions and prevent the build from drifting from the original design",
                    ],
                    skills: [
                      { name: 'RAG and LLM Architecture', desc: 'Fluency in retrieval-augmented generation: chunking strategies, embedding models, vector stores (Pinecone, pgvector, Weaviate), hybrid search, and reranking. Knowing when RAG beats fine-tuning and vice versa.' },
                      { name: 'Cloud Infrastructure', desc: 'Proficiency with at least one major cloud (AWS Bedrock, Google Vertex AI, Azure OpenAI) and the infrastructure required to run AI workloads at production scale.' },
                      { name: 'Evaluation and Measurement', desc: 'Defining and implementing evals: retrieval recall@k, answer faithfulness, hallucination rate, latency p95. Most teams skip this and regret it.' },
                      { name: 'Enterprise Sales Motion', desc: 'Understanding the enterprise procurement cycle: security reviews, legal, IT sign-off. AI SAs often participate in deals from first technical call through to contract close.' },
                      { name: 'Executive Communication', desc: 'Writing crisp one-pagers and presenting to C-suite stakeholders who have 20 minutes and low tolerance for jargon.' },
                      { name: 'Python Prototyping', desc: 'Not production engineering, but enough to build a working demo in a notebook during a customer workshop and demonstrate that the architecture is viable.' },
                    ],
                    teamDynamic: "On a typical enterprise AI engagement, the SA is active in weeks 1-3 (discovery and architecture), then transitions to an advisory role while the FDE builds. The FDPM manages the customer relationship and scope. The SA re-engages when technical decisions need to be escalated or when the build reveals assumptions that need revisiting. At smaller AI companies like Anthropic or Cohere, the SA and FDE roles often overlap. At larger companies like AWS or Microsoft, they are strictly separated.",
                    careerPath: "Most AI SAs come from three backgrounds: senior ML engineers who want more customer exposure; cloud solutions architects who transitioned into AI-specific work; or software engineers from AI startups who built customer-facing instincts. Compensation at top AI companies ranges from $180,000 to $325,000 total comp (Glassdoor reports OpenAI SA median at $212,000). The role is valued because production-grade technical depth combined with enterprise communication fluency is genuinely rare.",
                    sources: ["Anthropic Applied AI SA job posting (builtin.com)", "OpenAI Solutions Architect salary data (Glassdoor, Dec 2025)", "AI Engineer vs Solutions Architect (zenvanriel.com, 2026)"],
                    companiesHiring: ['Anthropic', 'OpenAI', 'Google Cloud', 'AWS', 'Microsoft', 'Databricks', 'Cohere'],
                  },
                  {
                    key: 'Forward Deployed Engineer',
                    cfg: ROLE_CFG['Forward Deployed Engineer'],
                    what: "A Forward Deployed Engineer (FDE) is a software engineer embedded directly with a specific customer to build and deploy AI solutions in that customer's environment. Palantir invented the role around 2010, until 2016 they had more FDEs than traditional software engineers. The model has spread rapidly: OpenAI, Anthropic, Ramp, Databricks, Scale AI, Stripe, and Salesforce all run FDE teams. FDE job postings grew over 800% between 2024 and 2025. a16z called it the hottest job in tech. OpenAI's international managing director explained at Fortune Brainstorm AI 2025: hiring our own engineers to deploy for our largest customers is a specific way to accelerate AI into production, bridging the gap from trial to production that AI deployments consistently struggle with.",
                    notJust: "Palantir's own job description is the clearest framing: FDE responsibilities look similar to those of a startup CTO, you work in small teams and own end-to-end execution of high-stakes projects. You are accountable for a specific customer's outcome, not a KPI on a product dashboard. Every line of code runs against real data in a production system real people depend on. Former Palantir FDE Anjor Kanekar (7 years in the role) has described working on the final assembly line at Airbus, in airgapped government environments, and in operational settings most engineers never encounter.",
                    dayToDay: [
                      "Morning: technical discovery alongside the customer's ops or engineering team, understanding the actual workflow, not the workflow described in the requirements document",
                      "Writing production-grade Python and TypeScript against the customer's actual data and systems, not a clean development environment with well-documented APIs",
                      "Attending the customer's operational stand-ups to understand what broke overnight and what decisions need to be made today",
                      "Building LLM workflows, typically RAG pipelines, agents, or structured extraction systems, tuned to the customer's specific data and edge cases",
                      "Debugging issues no remote support team could diagnose: data quality problems, legacy system quirks, integration failures in environments you did not build",
                      "Running demos and walkthroughs with customer stakeholders who range from skeptical engineers to excited executives",
                      "Evening: feeding learnings back to the product team at HQ, what is missing from the platform, what the customer will pay for next, what broke that should not have",
                    ],
                    skills: [
                      { name: 'Senior Generalist Engineering', desc: 'Comfortable in Python and TypeScript, able to read SQL, comfortable enough with infrastructure to deploy and debug independently. Most FDE listings emphasize model integration, evals, and pipeline work over greenfield framework design.' },
                      { name: 'Rapid Prototyping Under Pressure', desc: 'OpenAI requires up to 50% travel. You will be at a customer site with a deadline and ambiguous requirements. Building something working in hours, not perfect, but working, is more valuable than clean architecture.' },
                      { name: 'Model Integration and Evals', desc: 'Building RAG systems, prompt pipelines, and evaluation frameworks against customer data. Understanding why a retrieval pipeline fails on a specific customer documents.' },
                      { name: 'Hostile Environment Debugging', desc: 'Diagnosing failures in systems you did not build, with limited logging, in environments with strict security constraints. This takes real experience to develop.' },
                      { name: 'Customer Trust Building', desc: 'Customers give FDEs access to sensitive production systems. Building that trust by being technically credible and reliably honest about what is and is not feasible is central to the role.' },
                      { name: 'Product Feedback Loop', desc: 'Ramp describes FDEs as embedding within core product engineering teams. What you learn in the field shapes the roadmap. The best FDEs are engineers and product managers simultaneously.' },
                    ],
                    teamDynamic: "At companies like Palantir and OpenAI, FDEs alternate between customer engagements and core product work, field experience directly informs product decisions. At Anthropic, the Applied AI team (their version of FDEs) sits close to both the enterprise sales motion and the model team. Ramp runs around 15 FDEs in pods. In a typical AI deployment, the FDE is execution: the SA set the architecture, the FDPM manages the customer relationship, and the FDE ships the code.",
                    careerPath: "FDE compensation reflects the scarcity of the skill combination. Palantir average TC is $238,000, range $205,000 to $486,000. OpenAI and Anthropic mid-to-senior FDE packages run $350,000 to $550,000, benchmarked against researchers. Staff-level FDEs at top labs exceed $630,000. The role is a launching pad: alumni have gone on to found companies, become VPs of Engineering, and lead enterprise AI teams at Google and Microsoft.",
                    sources: ["The Pragmatic Engineer: What are FDEs and why so in demand? (Gergely Orosz, Aug 2025)", "a16z: FDE is the hottest job in tech (2025)", "Emergence Capital: AI Models are Gold, FDEs are the Gold Miners (July 2025)", "FDE job posting growth 800%+ (extern.com, 2025)", "OpenAI Fortune Brainstorm AI 2025 (Oliver Jay)"],
                    companiesHiring: ['Palantir', 'OpenAI', 'Anthropic', 'Ramp', 'Scale AI', 'Databricks', 'Salesforce'],
                  },
                  {
                    key: 'Forward Deployed Product Manager',
                    cfg: ROLE_CFG['Forward Deployed Product Manager'],
                    what: "A Forward Deployed Product Manager sits between a specific enterprise customer and the engineering team building for them. Where a traditional PM manages a roadmap for thousands of anonymous users, an FDPM is physically present in a customer's offices, talking to their department heads, understanding the operational reality the product needs to fit into. The role emerged from Palantir's deployment model and has spread across AI companies as enterprise deployments became complex enough to require dedicated product ownership per account. At its core, the FDPM answers one question repeatedly: what exactly needs to be built to make this specific customer successful, and what should we not build?",
                    notJust: "This is not a traditional PM role. There are no A/B tests, no DAU dashboards, no sprint planning for a broad user base. The job is closer to management consulting than product management: diagnosis, scoping, relationship management, and expectation-setting. The FDPM encounters the customer's stated problem (which is often not the actual problem), their internal politics (always more complicated than the org chart), and the gap between what engineering can build in the timeline and what the customer has been led to expect. Managing all three simultaneously is the job.",
                    dayToDay: [
                      "Running discovery interviews with multiple stakeholder layers: the executive sponsor who approved the budget, the operations lead who will actually use the system, and the IT team who controls the infrastructure",
                      "Writing requirements documents specific enough for an FDE to build from without needing clarifying questions every day",
                      "Scope protection: fielding customer requests for additions and deciding which belong in this engagement, which belong in a future contract, and which should never be built",
                      "Weekly customer steering meetings: translating where the engineering work actually is into language that does not cause the customer to escalate",
                      "Escalating internally when customer expectations have drifted from what was scoped, before it becomes a delivery failure",
                      "Identifying signals that a customer-specific need should be generalized into a product feature, where FDPMs directly influence roadmap",
                      "Managing the end-of-engagement transition: ensuring the customer's team can operate what was built without the deployment team present",
                    ],
                    skills: [
                      { name: 'Requirement Extraction', desc: 'Running a 2-hour discovery session with a room of stakeholders and leaving with a clear, specific list of what needs to be built, not a list of everyone\'s wishes.' },
                      { name: 'Scope Management', desc: 'Enterprise customers consistently add scope throughout a deployment. The FDPM must say no, often to people with more organizational power, in ways that preserve the relationship.' },
                      { name: 'Technical Fluency', desc: 'Not a coder, but sufficient technical understanding to know when an engineer is overcomplicating something, when a request is infeasible, and when a technical risk is being understated.' },
                      { name: 'Executive Presence', desc: 'FDPMs regularly present to VP and C-suite stakeholders at customer organizations. Communicating program status clearly, including bad news, without causing panic is a core skill.' },
                      { name: 'Consulting Instincts', desc: 'Walking into a new organization every engagement and quickly mapping how decisions get made, who the real influencers are, and where organizational resistance will come from.' },
                      { name: 'Written Precision', desc: 'Requirements docs, status updates, escalation memos, change orders. Every document must be precise enough that ambiguity cannot be weaponized later.' },
                    ],
                    teamDynamic: "The FDPM is the integrating layer of a deployment team. The SA designs the system, the FDE builds it, the TPM manages cross-team dependencies, the FDPM owns the customer relationship throughout. When the customer is unhappy, it lands on the FDPM. When engineering is being asked to do something impossible, the FDPM has that conversation with the customer. The best FDPMs create conditions where the FDE and SA can focus entirely on technical work because all relationship complexity has been absorbed.",
                    careerPath: "FDPMs typically come from management consulting (diagnosis and stakeholder management), traditional SaaS PM roles (product craft), or technical backgrounds that evolved toward product. The role is less common than FDE and SA, which makes strong FDPMs disproportionately valuable. Progression paths include Director of Product, Head of Enterprise, VP of Customer Success, or founding roles at startups where customer development is the scarcest early-team resource.",
                    sources: ["Palantir FDSE role model (multiple sources)", "MindStudio: Palantir FDE Model Drove 640% Returns (2026)", "Pragmatic Engineer FDE deep-dive (Aug 2025)"],
                    companiesHiring: ['Palantir', 'Anthropic', 'OpenAI', 'Glean', 'Scale AI', 'Cohere', 'Writer'],
                  },
                  {
                    key: 'Technical Program Manager',
                    cfg: ROLE_CFG['Technical Program Manager'],
                    what: "A Technical Program Manager drives complex, multi-team technical initiatives from ambiguity to completion. The role exists because some programs are too interdependent for any single engineering team to own, and too technical for a non-engineer to coordinate. At Google and Amazon, the two companies that have most formally defined the role, a TPM sits between senior engineering leadership and the teams executing, building the dependency maps, risk registers, and communication infrastructure that allow a 12-team program to move without constant VP intervention. Median total comp is $260,500 at Amazon and $282,000 at Google (Levels.fyi, 2025).",
                    notJust: "TPM is not project management with a technical flavor. A project manager tracks tasks. A TPM identifies the dependency that will blow up the launch 6 weeks from now and drives a cross-team resolution today. The distinction matters because the value of the role is entirely in the proactive intervention: by the time a risk becomes visible to a project manager, it is often already a crisis. The technical qualifier is also not decorative: a TPM who cannot read a technical design document, estimate engineering complexity, or push back on an unrealistic timeline does not have the standing to do the job.",
                    dayToDay: [
                      "Building the dependency map: pulling every team's plan, identifying where Team A's output is Team B's input, surfacing the places where no one has agreed on the interface",
                      "Running weekly cross-team syncs designed around blockers, not status: asking what can't you do because of something outside your control, not tell me what you did this week",
                      "Writing the single source of truth for program status that replaces five competing spreadsheets in different formats across different teams",
                      "Risk identification: asking what is the most likely reason this program misses its date and driving mitigations before the answer becomes because that thing happened",
                      "Facilitating the hard cross-team conversations where two teams have made incompatible architectural decisions and someone needs to sit in a room with both of them",
                      "Executive communication: producing the one-page program health summary a VP can absorb in 3 minutes, including honest red items that most status reports bury",
                      "Go/no-go management: defining launch criteria early, tracking against them weekly, and surfacing when a launch is not ready before it becomes a public failure",
                    ],
                    skills: [
                      { name: 'Technical Depth', desc: 'Enough engineering background to read a system design, assess timeline feasibility, and recognize when a technical risk is being minimized. Without this, the TPM cannot earn the trust of the engineering teams they coordinate.' },
                      { name: 'Dependency and Critical Path Analysis', desc: 'Modeling complex programs to find the true critical path (which is almost never what teams think it is) and identifying the single constraint that, if removed, unblocks the most downstream work.' },
                      { name: 'Structured Written Communication', desc: 'Program plans, risk registers, executive summaries, decision logs, go/no-go criteria. Amazon explicitly tests writing in TPM interviews. Each document must be precise enough that it cannot be misread.' },
                      { name: 'Influence Without Authority', desc: 'The TPM does not manage the engineers, EMs, or PMs on the program. Creating conditions where those people prioritize the program needs over their team backlog requires clarity, credibility, and occasionally executive escalation.' },
                      { name: 'Risk Surface Area Thinking', desc: 'Proactively imagining all the ways a program can fail and working backwards to determine which risks are worth mitigating now vs monitoring. This is the skill most valued at senior TPM levels.' },
                      { name: 'Ambiguity Absorption', desc: 'Programs with unclear requirements, shifting priorities, and missing owners are exactly when a TPM is most needed. Comfort operating in ambiguity while creating enough structure for teams to execute is the defining trait.' },
                    ],
                    teamDynamic: "In AI deployment programs, the TPM coordinates across the SA (architecture decisions), FDE (implementation timeline), FDPM (customer commitments), and the customer's internal teams (IT, procurement, legal). They own the integrated program plan, the risk register, and the escalation path when a dependency breaks. The TPM's domain is the whole program. A good TPM makes the SA, FDE, and FDPM more effective by absorbing coordination overhead. A bad one adds meetings without adding clarity.",
                    careerPath: "TPMs typically come from software engineering backgrounds who developed program-level thinking, or from product management with strong technical foundations. At Google and Amazon, senior TPMs with strong delivery track records are promoted into engineering director and VP of Engineering paths. Google TPM median is $282,000, Amazon is $260,500 (Levels.fyi 2025). At AI companies running large enterprise deployments, TPMs with AI-specific program experience are genuinely hard to find.",
                    sources: ["Amazon TPM median $260,500 (Levels.fyi, 2025)", "Google TPM median $282,000 (Levels.fyi, 2025)", "Google TPM role description (interviewkickstart.com)"],
                    companiesHiring: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Anthropic', 'Stripe'],
                  },
                ];

                const selected = selectedRole ? ROLE_ARTICLES.find(r => r.key === selectedRole) : null;

                return (
                  <div className="mp" style={{maxWidth:820,margin:'0 auto',padding:'36px 32px'}}>
                    {!selected ? (
                      <>
                        <div className="fu" style={{marginBottom:28}}>
                          <h1 style={{fontSize:26,fontWeight:700,color:'#111827',marginBottom:6}}>Role Guides</h1>
                          <p style={{color:'#6B7280',fontSize:15}}>Detailed breakdowns of each AI-era tech role, what they do, what skills they need, and how they work together.</p>
                        </div>
                        <div className="rg" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
                          {ROLE_ARTICLES.map(r=>(
                            <div key={r.key} className="rc" onClick={()=>setSelectedRole(r.key)} style={{padding:'24px'}}>
                              <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:14}}>
                                
                                <div>
                                  <p style={{fontWeight:700,fontSize:15,color:'#111827',marginBottom:3}}>{r.key}</p>
                                  <p style={{fontSize:12,color:r.cfg.color,fontWeight:600}}>{r.cfg.label}</p>
                                </div>
                              </div>
                              <p style={{fontSize:13,color:'#6B7280',lineHeight:1.6,marginBottom:14}}>{r.what.substring(0,140)}…</p>
                              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
                                {r.companiesHiring.slice(0,4).map(c=>(
                                  <span key={c} style={{fontSize:11,background:'#F3F4F6',color:'#6B7280',padding:'2px 8px',borderRadius:10}}>{c}</span>
                                ))}
                              </div>
                              <span style={{fontSize:13,color:'#6366F1',fontWeight:600}}>Read the guide →</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div>
                        <button className="bg" onClick={()=>{setSelectedRole(null);setActiveTab('role');}} style={{padding:'5px 12px',fontSize:13,marginBottom:20}}>← All Roles</button>
                        {/* Hero */}
                        <div style={{display:'flex',alignItems:'flex-start',gap:16,marginBottom:24}}>
                          <div style={{width:56,height:56,borderRadius:14,background:selected.cfg.bg,border:`1px solid ${selected.cfg.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:24}}>{selected.cfg.icon}</div>
                          <div>
                            <h1 style={{fontSize:26,fontWeight:700,color:'#111827',marginBottom:4}}>{selected.key}</h1>
                            <p style={{fontSize:14,color:selected.cfg.color,fontWeight:600}}>{selected.cfg.label}</p>
                          </div>
                        </div>
                        {/* Tab switcher */}
                        <div style={{display:'flex',gap:0,marginBottom:24,background:'#F3F4F6',borderRadius:10,padding:4}}>
                          {[{id:'role',label:'Role Guide'},{id:'interview',label:'Interview Guide'}].map(t=>(
                            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{flex:1,padding:'9px',border:'none',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:600,background:activeTab===t.id?'#fff':'transparent',color:activeTab===t.id?'#111827':'#9CA3AF',boxShadow:activeTab===t.id?'0 1px 3px rgba(0,0,0,0.1)':'none',transition:'all .15s'}}>
                              {t.label}
                            </button>
                          ))}
                        </div>

                        {activeTab==='role' && (<>
                        {/* What is this role */}
                        <div className="card fu" style={{padding:'24px',marginBottom:16}}>
                          <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>What is this role?</p>
                          <p style={{fontSize:14,color:'#374151',lineHeight:1.8}}>{selected.what}</p>
                        </div>
                        {/* Not just */}
                        <div className="card fu" style={{padding:'24px',marginBottom:16,background:'#FFFBEB',border:'1px solid #FDE68A'}}>
                          <p style={{fontSize:12,fontWeight:700,color:'#B45309',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>What it is NOT</p>
                          <p style={{fontSize:14,color:'#78350F',lineHeight:1.8}}>{selected.notJust}</p>
                        </div>
                        {/* Day to day */}
                        <div className="card fu" style={{padding:'24px',marginBottom:16}}>
                          <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>Day-to-day responsibilities</p>
                          {selected.dayToDay.map((item,i)=>(
                            <div key={i} style={{display:'flex',gap:10,marginBottom:10}}>
                              <div style={{width:6,height:6,borderRadius:'50%',background:selected.cfg.color,flexShrink:0,marginTop:6}}/>
                              <p style={{fontSize:14,color:'#374151',lineHeight:1.7}}>{item}</p>
                            </div>
                          ))}
                        </div>
                        {/* Skills */}
                        <div className="card fu" style={{padding:'24px',marginBottom:16}}>
                          <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>Key skills required</p>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                            {selected.skills.map((skill,i)=>(
                              <div key={i} style={{background:'#F9FAFB',borderRadius:10,padding:'14px 16px',border:'1px solid #F3F4F6'}}>
                                <p style={{fontSize:13,fontWeight:600,color:selected.cfg.color,marginBottom:5}}>{skill.name}</p>
                                <p style={{fontSize:12,color:'#6B7280',lineHeight:1.5}}>{skill.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Team dynamic */}
                        <div className="card fu" style={{padding:'24px',marginBottom:16,background:'#EFF6FF',border:'1px solid #BFDBFE'}}>
                          <p style={{fontSize:12,fontWeight:700,color:'#1D4ED8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>How this role works with the team</p>
                          <p style={{fontSize:14,color:'#1E40AF',lineHeight:1.8}}>{selected.teamDynamic}</p>
                        </div>
                        {/* Career path */}
                        <div className="card fu" style={{padding:'24px',marginBottom:16}}>
                          <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Career path</p>
                          <p style={{fontSize:14,color:'#374151',lineHeight:1.8}}>{selected.careerPath}</p>
                        </div>
                        {/* Companies hiring */}
                        <div className="card fu" style={{padding:'24px',marginBottom:16}}>
                          <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Companies hiring this role</p>
                          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                            {selected.companiesHiring.map(c=>(
                              <span key={c} style={{fontSize:13,fontWeight:500,background:selected.cfg.bg,color:selected.cfg.color,border:`1px solid ${selected.cfg.border}`,padding:'5px 14px',borderRadius:20}}>{c}</span>
                            ))}
                          </div>
                        </div>
                        {/* Sources */}
                        {selected.sources?.length>0&&(
                          <div style={{padding:'14px 16px',marginBottom:24,background:'#F9FAFB',borderRadius:10,border:'1px solid #F3F4F6'}}>
                            <p style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>Sources</p>
                            {selected.sources.map((src,i)=>(
                              <p key={i} style={{fontSize:12,color:'#9CA3AF',marginBottom:2}}>· {src}</p>
                            ))}
                          </div>
                        )}
                        {/* CTA */}
                        <button className="bp" onClick={()=>{setSelectedRole(null);setPage('home');}} style={{padding:'13px 28px',fontSize:15}}>
                          Practice {selected.key} interviews →
                        </button>
                        </>)}

                        {activeTab==='interview' && (()=>{
                          const guide = INTERVIEW_GUIDES[selected.key];
                          if(!guide) return <p style={{color:'#9CA3AF',padding:'40px 0',textAlign:'center'}}>Interview guide coming soon.</p>;
                          return (<>
                            {/* Interview process */}
                            <div className="card fu" style={{padding:'24px',marginBottom:16}}>
                              <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:16}}>The interview process</p>
                              {guide.process.map((stage,i)=>(
                                <div key={i} style={{display:'flex',gap:14,marginBottom:i<guide.process.length-1?16:0}}>
                                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                                    <div style={{width:28,height:28,borderRadius:'50%',background:selected.cfg.bg,border:`1px solid ${selected.cfg.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:selected.cfg.color}}>{i+1}</div>
                                    {i<guide.process.length-1&&<div style={{width:1,flex:1,background:'#E5E7EB',margin:'4px 0'}}/>}
                                  </div>
                                  <div style={{paddingBottom:i<guide.process.length-1?8:0}}>
                                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                                      <p style={{fontSize:13,fontWeight:600,color:'#111827'}}>{stage.stage}</p>
                                      <span style={{fontSize:11,color:'#9CA3AF',background:'#F3F4F6',padding:'2px 8px',borderRadius:10}}>{stage.duration}</span>
                                    </div>
                                    <p style={{fontSize:13,color:'#6B7280',lineHeight:1.7}}>{stage.what}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Answer framework */}
                            <div className="card fu" style={{padding:'24px',marginBottom:16,background:'#F5F3FF',border:`1px solid ${selected.cfg.border}`}}>
                              <p style={{fontSize:12,fontWeight:700,color:selected.cfg.color,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>Answer framework</p>
                              <p style={{fontSize:14,fontWeight:600,color:'#111827',marginBottom:16}}>{guide.framework.name}</p>
                              {guide.framework.steps.map((step,i)=>(
                                <div key={i} style={{marginBottom:12,paddingLeft:12,borderLeft:`2px solid ${selected.cfg.border}`}}>
                                  <p style={{fontSize:13,fontWeight:600,color:selected.cfg.color,marginBottom:3}}>{step.label}</p>
                                  <p style={{fontSize:13,color:'#374151',lineHeight:1.7}}>{step.desc}</p>
                                </div>
                              ))}
                            </div>

                            {/* Example Q&A */}
                            <div className="card fu" style={{padding:'24px',marginBottom:16}}>
                              <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>Example question and strong answer</p>
                              <div style={{background:'#F9FAFB',borderRadius:10,padding:'14px 16px',marginBottom:14,borderLeft:`3px solid ${selected.cfg.color}`}}>
                                <p style={{fontSize:12,fontWeight:600,color:'#9CA3AF',marginBottom:6}}>Question</p>
                                <p style={{fontSize:14,color:'#111827',lineHeight:1.7,fontStyle:'italic'}}>{guide.exampleQ.question}</p>
                              </div>
                              <div style={{background:'#F0FDF4',borderRadius:10,padding:'14px 16px',marginBottom:14,borderLeft:'3px solid #059669'}}>
                                <p style={{fontSize:12,fontWeight:600,color:'#059669',marginBottom:6}}>Strong answer</p>
                                <p style={{fontSize:14,color:'#111827',lineHeight:1.7}}>{guide.exampleQ.strongAnswer}</p>
                              </div>
                              <div style={{background:'#EFF6FF',borderRadius:10,padding:'12px 14px',borderLeft:'3px solid #2563EB'}}>
                                <p style={{fontSize:12,fontWeight:600,color:'#2563EB',marginBottom:4}}>Why this scores well</p>
                                <p style={{fontSize:13,color:'#1E40AF',lineHeight:1.6}}>{guide.exampleQ.why}</p>
                              </div>
                            </div>

                            {/* Reading list */}
                            <div className="card fu" style={{padding:'24px',marginBottom:24}}>
                              <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>Recommended reading</p>
                              {guide.reading.map((r,i)=>(
                                <div key={i} style={{display:'flex',gap:12,marginBottom:i<guide.reading.length-1?12:0,paddingBottom:i<guide.reading.length-1?12:0,borderBottom:i<guide.reading.length-1?'1px solid #F3F4F6':'none'}}>
                                  <div style={{width:32,height:32,borderRadius:8,background:selected.cfg.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:14,color:selected.cfg.color,fontWeight:700}}>{i+1}</div>
                                  <div>
                                    <a href={r.url} target="_blank" rel="noreferrer" style={{fontSize:13,fontWeight:600,color:selected.cfg.color,textDecoration:'none'}}>{r.title} →</a>
                                    <p style={{fontSize:12,color:'#6B7280',marginTop:2,lineHeight:1.5}}>{r.note}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button className="bp" onClick={()=>{setSelectedRole(null);setPage('home');}} style={{padding:'13px 28px',fontSize:15}}>
                              Practice {selected.key} interviews →
                            </button>
                          </>);
                        })()}
                      </div>
                    )}
                  </div>
                );
              })()}
              {/* ── SUBSCRIPTION PAGE ── */}
              {page==='subscribe' && (
                <div style={{maxWidth:520,margin:'0 auto',padding:'48px 24px'}}>
                  <div style={{textAlign:'center',marginBottom:36}}>
                    <div style={{fontSize:13,fontWeight:600,color:'#6366F1',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>You have used your free sessions</div>
                    <h1 style={{fontSize:28,fontWeight:700,color:'#111827',marginBottom:12}}>Unlock unlimited practice</h1>
                    <p style={{color:'#6B7280',fontSize:15,lineHeight:1.6}}>You have completed your free written response and mock interview. Upgrade to keep practicing with full AI feedback.</p>
                  </div>
                  <div style={{background:'#F5F3FF',border:'1px solid #DDD6FE',borderRadius:14,padding:'20px 24px',marginBottom:24}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#6D28D9',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>Pro includes</p>
                    {['Unlimited AI-scored written responses','Unlimited mock interviews across all roles','Full score breakdowns with coaching feedback','All 4 roles and all industries','Full session history and score trends'].map((item,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:i<4?10:0}}>
                        <span style={{color:'#7C3AED',fontWeight:700,flexShrink:0}}>✓</span>
                        <span style={{fontSize:14,color:'#4C1D95'}}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                    <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,padding:'20px',textAlign:'center'}}>
                      <p style={{fontSize:13,color:'#6B7280',marginBottom:6}}>Monthly</p>
                      <p style={{fontSize:32,fontWeight:700,color:'#111827',marginBottom:2}}>$19</p>
                      <p style={{fontSize:12,color:'#9CA3AF',marginBottom:16}}>per month</p>
                      <button className="bp" onClick={()=>startUpgrade('price_monthly')} style={{width:'100%',padding:'11px',fontSize:14}}>Subscribe →</button>
                    </div>
                    <div style={{background:'#111827',borderRadius:12,padding:'20px',textAlign:'center',position:'relative'}}>
                      <div style={{position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',background:'#F59E0B',color:'#fff',fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:10,whiteSpace:'nowrap'}}>BEST VALUE</div>
                      <p style={{fontSize:13,color:'#9CA3AF',marginBottom:6}}>30-day pass</p>
                      <p style={{fontSize:32,fontWeight:700,color:'#fff',marginBottom:2}}>$49</p>
                      <p style={{fontSize:12,color:'#6B7280',marginBottom:16}}>one-time</p>
                      <button onClick={()=>startUpgrade('price_pack')} style={{width:'100%',padding:'11px',fontSize:14,background:'#6366F1',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:600}}>Get access →</button>
                    </div>
                  </div>
                  <p style={{textAlign:'center',fontSize:12,color:'#D1D5DB',marginBottom:20}}>Multiple choice practice is always free and unlimited.</p>
                  <button className="bg" onClick={()=>setPage('home')} style={{width:'100%',padding:'12px',fontSize:14}}>← Back to question bank</button>
                  {!user&&(<p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:16}}>Already subscribed?{' '}<button onClick={()=>{setAuthMode('login');setAuthError('');setPage('signin');}} style={{background:'none',border:'none',cursor:'pointer',color:'#6366F1',fontWeight:600,fontSize:13}}>Sign in</button></p>)}
                </div>
              )}

              {page==='results-gate' && pendingInterview && (
                <div style={{maxWidth:480,margin:'0 auto',padding:'48px 24px'}}>
                  {/* Score teaser */}
                  <div style={{textAlign:'center',marginBottom:32}}>
                    <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#6366F1,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 20px',boxShadow:'0 8px 32px rgba(99,102,241,.3)'}}></div>
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
                    Skip for now, practice another question
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
                      {[{id:'text',label:'Written Response',desc:'AI scores your answer in depth',requiresAuth:true},
                        {id:'mc',  label:'Multiple Choice',  desc:'Instant scoring, works offline',requiresAuth:false},
                        {id:'mock',label:'Mock Interview',    desc:'Dynamic back-and-forth with an AI interviewer',requiresAuth:true}].map(f=>(
                        <div key={f.id} onClick={()=>setFormat(f.id)} style={{flex:1,minWidth:180,padding:'14px 16px',borderRadius:10,cursor:'pointer',
                          border:format===f.id?'2px solid #6366F1':'1px solid #E5E7EB',background:format===f.id?'#F5F3FF':'#fff',transition:'all .15s'}}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                            <div style={{display:'flex',alignItems:'center',gap:6}}>
                              <span style={{fontSize:14,fontWeight:600,color:format===f.id?'#4F46E5':'#111827'}}>{f.label}</span>
                              {f.requiresAuth&&!user&&<span style={{fontSize:10,fontWeight:600,color:'#9CA3AF',background:'#F3F4F6',padding:'1px 6px',borderRadius:6}}>Sign in</span>}
                            </div>
                            {format===f.id&&<div style={{width:16,height:16,borderRadius:'50%',background:'#6366F1',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff'}}>✓</div>}
                          </div>
                          <p style={{fontSize:12,color:'#9CA3AF'}}>{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Company, only for mock */}

                  {/* Industry */}
                  <div className="fu d2" style={{marginBottom:28}}>
                    <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:10}}>Industry focus</p>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      {INDUSTRIES.map(ind=>(
                        <button key={ind} className={`chip ${industry===ind?'on':''}`} onClick={()=>setIndustry(ind)}>
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Full mock */}
                  <div className="fu d3" style={{marginBottom:28}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                      <h2 style={{fontSize:16,fontWeight:600,color:'#111827'}}>{format==='mock'?'Mock Interview':'Full Mock Interview'}</h2>
                      <span style={{fontSize:11,background:'#F3F4F6',color:'#6B7280',padding:'3px 10px',borderRadius:20}}>{format==='mock'?`${MOCK_TURNS} rounds`:'5 questions'}</span>
                    </div>
                    <div className="rg" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
                      {ROLES.map(r=>{
                        const c=ROLE_CFG[r];
                        const prob=format==='mock'?(OPENING_PROBLEMS[r]?.[industry]||OPENING_PROBLEMS[r]?.['General']):null;
                        return (
                          <div key={r} className="rc" onClick={()=>startInterview(r,'full')}>
                            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
                              <div style={{width:36,height:36,borderRadius:8,background:c.bg,border:`1px solid ${c.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{c.icon}</div>
                              <span style={{fontSize:11,color:'#9CA3AF',background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:20,padding:'3px 10px'}}>{format==='mock'?`${MOCK_TURNS} rounds`:'5 Qs'}</span>
                            </div>
                            <p style={{fontWeight:600,fontSize:14,color:'#111827',marginBottom:4}}>{c.card||r}</p>
                            {prob?<p style={{fontSize:12,color:'#9CA3AF',marginBottom:14,lineHeight:1.4}}>{prob.title}</p>:<p style={{fontSize:12,color:'#9CA3AF',marginBottom:14}}>{c.label}</p>}
                            <span style={{fontSize:12,color:'#6366F1',fontWeight:600}}>Start →</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
                            <p style={{fontSize:11,fontWeight:700,color:'#B45309',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}> What you missed</p>
                            {mockScore.components_missed.map((c,j)=><div key={j} style={{display:'flex',gap:8,marginBottom:6}}><span style={{color:'#F59E0B',fontWeight:700,flexShrink:0}}>→</span><p style={{fontSize:13,color:'#78350F',lineHeight:1.5}}>{c}</p></div>)}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Ideal solution */}
                    {sessionMeta.idealSolution&&(
                      <div className="card fu" style={{padding:'20px 24px',marginBottom:14,background:'#EFF6FF',border:'1px solid #BFDBFE'}}>
                        <p style={{fontSize:12,fontWeight:700,color:'#1D4ED8',marginBottom:12,textTransform:'uppercase',letterSpacing:'.05em',display:'flex',alignItems:'center',gap:6}}>
                           Model Answer, What a Strong Response Covers
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
                        <button className="bp" onClick={downloadCopy} style={{padding:'10px 20px',fontSize:14,flexShrink:0}}> Download</button>
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
                                <p style={{fontSize:11,fontWeight:700,color:'#1D4ED8',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}> What a strong answer covers</p>
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
                        <button className="bp" onClick={downloadCopy} style={{padding:'10px 20px',fontSize:14,flexShrink:0}}> Download</button>
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
                            <p style={{fontSize:40,marginBottom:16}}></p>
                            <p style={{fontSize:18,fontWeight:600,color:'#374151',marginBottom:8}}>Sign in to track your progress</p>
                            <p style={{color:'#9CA3AF',marginBottom:24,fontSize:14}}>Create a free account to save your history and see your score trends.</p>
                            <button className="bp" onClick={()=>{setAuthMode('signup');setAuthError('');setPage('signin');}} style={{padding:'12px 28px',fontSize:15}}>Create free account →</button>
                          </>
                        ) : (
                          <>
                            <p style={{fontSize:40,marginBottom:16}}></p>
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
                                  <span style={{fontSize:20,fontWeight:700,color:sc}}>{s.score}{'/10'}</span>
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
      </div>
      </>)}
    </>
  );
}

