import React, { useState, useEffect, useMemo, useCallback } from 'react';
import RiskAlertBanner from './components/RiskAlertBanner';
import DashboardHeader from './components/DashboardHeader';
import RiskMap from './components/RiskMap';
import RiskTrend from './components/RiskTrend';
import AlertCard from './components/AlertCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import CountUp from 'react-countup';
import { fetchNews, fetchRisk } from './services/api';
import AIChat from './components/AIChat';
import Skeleton from './components/Skeleton';
import ToastContainer, { toast } from './components/Toast';

const RISK_COLOR = { high:'#ef4444', medium:'#f59e0b', low:'#10b981' };
const FLAG = { China:'🇨🇳',Germany:'🇩🇪',Netherlands:'🇳🇱',Taiwan:'🇹🇼',India:'🇮🇳',Ukraine:'🇺🇦',USA:'��🇸',US:'🇺🇸',Suez:'🇪🇬',Egypt:'🇪🇬',Singapore:'🇸🇬',Brazil:'🇧🇷',Japan:'🇯🇵',Global:'🌍' };

function buildTrend(news) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return days.map((name,i) => {
    const slice = news.filter((_,idx) => idx%7===i);
    return { name, high:slice.filter(n=>n.risk==='high').length||Math.round(news.filter(n=>n.risk==='high').length*(0.1+0.15*Math.abs(Math.sin(i*1.3)))), medium:slice.filter(n=>n.risk==='medium').length||Math.round(news.filter(n=>n.risk==='medium').length*(0.1+0.15*Math.abs(Math.sin(i*0.9)))), low:slice.filter(n=>n.risk==='low').length||Math.round(news.filter(n=>n.risk==='low').length*(0.1+0.15*Math.abs(Math.sin(i*1.7)))) };
  });
}

function AISummary({ news }) {
  const high = news.filter(n=>n.risk==='high');
  const bycat = news.reduce((a,n)=>{a[n.category]=(a[n.category]||0)+1;return a},{});
  const topcat = Object.entries(bycat).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const countries = [...new Set(high.map(n=>n.country))].slice(0,3);
  return (
    <div style={{ background:'var(--surface)', border:'1px solid rgba(59,126,248,0.2)', borderRadius:14, padding:'16px 20px', marginBottom:16, display:'flex', gap:16, alignItems:'flex-start', boxShadow:'0 0 40px rgba(59,126,248,0.06)' }}>
      <div style={{ minWidth:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#3b7ef8,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:'0 4px 16px rgba(59,126,248,0.3)', flexShrink:0 }}>🤖</div>
      <div>
        <div style={{ fontSize:10, fontFamily:'Space Mono,monospace', color:'var(--blue)', letterSpacing:2, marginBottom:8 }}>AI BRIEFING</div>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {high.length>0 && <div style={{ fontSize:13, color:'var(--text)', fontWeight:500 }}>⚠️ <strong>{high.length} critical events</strong> active — highest risk in {countries.join(', ')}</div>}
          {topcat && <div style={{ fontSize:13, color:'var(--text2)' }}>📦 Dominant disruption: <strong style={{ color:'var(--text)' }}>{topcat}</strong></div>}
          <div style={{ fontSize:12, color:'var(--muted2)' }}>🔒 {news.length} headlines classified via local AI — no cloud data shared</div>
        </div>
      </div>
    </div>
  );
}

const App = () => {
  const [headlines, setHeadlines] = useState([]);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [highAlerts, setHighAlerts] = useState([]);
  const [flash, setFlash] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [news, riskData] = await Promise.all([fetchNews(), fetchRisk()]);
      setHeadlines(news); setRisks(riskData);
      setLastUpdated(new Date());
      setFlash(true); setTimeout(() => setFlash(false), 800);
      toast('Intelligence updated ✓', 'success');
      const highs = riskData.filter(r=>r.risk==='high');
      if (highs.length>0) { setHighAlerts(highs.map(h=>({location:h.country,value:'HIGH'}))); setShowAlert(true); }
    } catch(e) { console.error(e); toast('Failed to fetch data', 'error'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { const t = setInterval(loadData,30000); return ()=>clearInterval(t); }, [loadData]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return
      if (e.key === 'r' || e.key === 'R') { loadData(); toast('Refreshing...', 'info') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [loadData])

  const filteredHeadlines = useMemo(() => headlines.filter(h => h.title.toLowerCase().includes(searchTerm.toLowerCase())||(h.country||'').toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, headlines]);
  const trendData = useMemo(() => buildTrend(headlines), [headlines]);
  const chartData = risks.map(r => ({ name:(FLAG[r.country]||'🌐')+' '+r.country, risk:r.risk==='high'?3:r.risk==='medium'?2:1, rawRisk:r.risk }));
  const stats = { high:risks.filter(r=>r.risk==='high').length, medium:risks.filter(r=>r.risk==='medium').length, low:risks.filter(r=>r.risk==='low').length };

  if (loading) return <Skeleton />;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)', outline: flash ? '1.5px solid rgba(59,126,248,0.4)' : '1.5px solid transparent', transition:'outline 0.4s ease' }}>
      {showAlert && highAlerts.length>0 && <RiskAlertBanner alerts={highAlerts} onClose={()=>setShowAlert(false)} />}
      <DashboardHeader onSearch={setSearchTerm} onRefresh={loadData} />
      <main style={{ maxWidth:1400, margin:'0 auto', padding:'110px 1.5rem 2rem', display:'grid', gridTemplateColumns:'360px 1fr', gap:20 }}>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:10, fontFamily:'Space Mono,monospace', color:'var(--muted)', letterSpacing:2 }}>LIVE INTEL FEED</span>
            <span style={{ fontSize:10, fontFamily:'Space Mono,monospace', color:'var(--muted2)', background:'var(--surface)', padding:'3px 10px', borderRadius:20, border:'1px solid var(--border)' }}>{filteredHeadlines.length} EVENTS</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, overflowY:'auto', maxHeight:'calc(100vh - 130px)' }}>
            {filteredHeadlines.length===0
              ? <div style={{ textAlign:'center', color:'var(--muted)', fontSize:11, fontFamily:'Space Mono,monospace', padding:'3rem', letterSpacing:2 }}>NO EVENTS FOUND</div>
              : filteredHeadlines.map(item => <AlertCard key={item.id} item={item} />)}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <AISummary news={headlines} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[{label:'Critical Alerts',value:stats.high,color:'#ef4444',icon:'🔴'},{label:'Elevated Risk',value:stats.medium,color:'#f59e0b',icon:'🟡'},{label:'Stable',value:stats.low,color:'#10b981',icon:'🟢'}].map(s=>(
              <div key={s.label} style={{ background:'var(--surface)', borderRadius:14, padding:'16px 20px', border:`1px solid ${s.color}22`, borderLeft:`3px solid ${s.color}` }}>
                <div style={{ fontSize:11, color:s.color, fontWeight:600, marginBottom:8 }}>{s.icon} {s.label}</div>
                <div style={{ fontSize:40, fontWeight:900, color:s.color, lineHeight:1, fontFamily:'Space Mono,monospace' }}><CountUp end={s.value} duration={1.2} /></div>
                <div style={{ fontSize:11, color:'var(--muted2)', marginTop:4 }}>active events</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14 }}>
            <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', overflow:'hidden' }}>
              <div style={{ padding:'14px 16px 8px', fontSize:10, fontFamily:'Space Mono,monospace', color:'var(--muted)', letterSpacing:2 }}>🌍 GLOBAL RISK MAP</div>
              <RiskMap risks={risks} />
            </div>
            <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', padding:16 }}>
              <div style={{ fontSize:10, fontFamily:'Space Mono,monospace', color:'var(--muted)', letterSpacing:2, marginBottom:12 }}>📊 RISK BY COUNTRY</div>
              <div style={{ height:280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left:0, right:8 }}>
                    <XAxis type="number" domain={[0,3]} hide />
                    <YAxis type="category" dataKey="name" tick={{ fill:'#64748b', fontSize:10, fontFamily:'Space Mono,monospace' }} width={90} />
                    <Tooltip formatter={(v,_,p)=>[p.payload.rawRisk.toUpperCase(),'Risk']} contentStyle={{ background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:8, fontSize:11, color:'var(--text)' }} />
                    <Bar dataKey="risk" radius={[0,6,6,0]}>{chartData.map((e,i)=><Cell key={i} fill={RISK_COLOR[e.rawRisk]}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', padding:'16px 20px' }}>
            <RiskTrend data={trendData} />
          </div>
        </div>
      </main>
      <AIChat news={headlines} risks={risks} />
      <ToastContainer />
      <footer style={{ padding:'2rem', textAlign:'center' }}>
        <p style={{ fontSize:10, fontFamily:'Space Mono,monospace', color:'var(--muted)', letterSpacing:2 }}>SUPPLYGUARD · AI-POWERED RISK ARCHITECTURE · 2026</p>
      </footer>
    </div>
  );
};

export default App;
