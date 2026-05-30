import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import CountUp from 'react-countup'
import EventList from './EventList'
import RiskMap from './RiskMap'
import { fetchNews, fetchRisk, fetchTrend } from '../services/api'

const RISK_COLOR = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }
const FLAG = { China:'🇨🇳', Germany:'🇩🇪', Netherlands:'🇳🇱', Taiwan:'🇹🇼', India:'🇮🇳', Ukraine:'🇺🇦', USA:'🇺🇸', US:'🇺🇸', Suez:'🇪🇬', Egypt:'🇪🇬', Singapore:'🇸🇬', Brazil:'🇧🇷', Japan:'🇯🇵', Global:'🌍' }

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'white', borderRadius: 14, border: '1px solid var(--border)',
      boxShadow: 'var(--shadow)', padding: '1.25rem', ...style
    }}>{children}</div>
  )
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontFamily:"'JetBrains Mono',monospace", color:'var(--muted)', letterSpacing:1.5, marginBottom:12, textTransform:'uppercase' }}>{children}</div>
}

function AISummary({ news }) {
  const high = news.filter(n => n.risk === 'high')
  const bycat = news.reduce((a,n) => { a[n.category]=(a[n.category]||0)+1; return a }, {})
  const topcat = Object.entries(bycat).sort((a,b)=>b[1]-a[1])[0]?.[0]
  const countries = [...new Set(high.map(n => n.country))].slice(0,3)

  return (
    <Card style={{ background: 'linear-gradient(135deg, #EFF6FF, #E0F2FE)', border: '1.5px solid #BFDBFE', marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>🤖</div>
        <div>
          <div style={{ fontSize: 11, fontFamily:"'JetBrains Mono',monospace", color:'var(--blue)', letterSpacing:1.5, marginBottom:8 }}>AI SUMMARY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {high.length > 0 && <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>⚠️ <strong>{high.length} critical events</strong> — highest risk in {countries.join(', ')}</div>}
            {topcat && <div style={{ fontSize: 13, color: 'var(--text2)' }}>📦 Most disruptions are <strong>{topcat}</strong>-related this cycle</div>}
            <div style={{ fontSize: 12, color: 'var(--muted2)' }}>🔒 {news.length} headlines classified locally via Llama 3.2 — no cloud data shared</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const [news, setNews]       = useState([])
  const [risks, setRisks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [time, setTime]       = useState('')

  useEffect(() => {
    Promise.all([fetchNews(), fetchRisk()]).then(([n, r]) => {
      setNews(n); setRisks(r); setLoading(false)
      setTime(new Date().toLocaleTimeString())
    })
  }, [])

  const stats = {
    high:   risks.filter(r => r.risk === 'high').length,
    medium: risks.filter(r => r.risk === 'medium').length,
    low:    risks.filter(r => r.risk === 'low').length,
  }

  const chartData = risks.map(r => ({
    name: (FLAG[r.country]||'🌐')+' '+r.country,
    risk: r.risk==='high'?3:r.risk==='medium'?2:1,
    rawRisk: r.risk,
  }))

  if (loading) return (
    <div style={{ paddingTop: 60, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:16, background:'var(--bg)' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--border2)', borderTopColor: 'var(--blue)', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily:"'JetBrains Mono',monospace", letterSpacing:1 }}>Fetching intelligence...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ paddingTop: 60, background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <h2 style={{ fontWeight:800, fontSize:24, letterSpacing:-0.5, color:'var(--text)' }}>Threat Intelligence</h2>
            <div style={{ fontSize:12, color:'var(--muted)', marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>
              Updated {time} · {risks.length} events tracked
            </div>
          </div>
          <button onClick={loadData} style={{
            padding:'8px 18px', background:'white', border:'1.5px solid var(--border2)',
            borderRadius:8, fontSize:13, fontWeight:600, color:'var(--blue)',
            boxShadow:'var(--shadow)', transition:'all 0.2s',
          }}>↺ Refresh</button>
        </div>

        {/* AI Summary */}
        <AISummary news={news} />

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
          {[
            { label:'Critical Alerts', value:stats.high,   color:'#EF4444', bg:'#FEF2F2', border:'#FECACA', icon:'🔴' },
            { label:'Elevated Risk',   value:stats.medium, color:'#D97706', bg:'#FFFBEB', border:'#FDE68A', icon:'🟡' },
            { label:'Normal',          value:stats.low,    color:'#059669', bg:'#F0FDF4', border:'#A7F3D0', icon:'🟢' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: 14, padding: '18px 22px',
              borderLeft: `4px solid ${s.color}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize:12, color:s.color, fontWeight:600, marginBottom:8 }}>{s.icon} {s.label}</div>
              <div style={{ fontSize:44, fontWeight:900, color:s.color, lineHeight:1, fontFamily:"'JetBrains Mono',monospace" }}>
                <CountUp end={s.value} duration={1.2} />
              </div>
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>active events</div>
            </div>
          ))}
        </div>

        {/* Map + Chart */}
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16, marginBottom:20 }}>
          <Card>
            <SectionLabel>🌍 Global Risk Map</SectionLabel>
            <RiskMap risks={risks} />
          </Card>
          <Card>
            <SectionLabel>📊 Risk by Country</SectionLabel>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left:0 }}>
                  <XAxis type="number" domain={[0,3]} hide />
                  <YAxis type="category" dataKey="name" tick={{ fill:'#5B82A8', fontSize:11, fontFamily:"'JetBrains Mono',monospace" }} width={95} />
                  <Tooltip
                    formatter={(v,_,p) => [p.payload.rawRisk.toUpperCase(),'Risk']}
                    contentStyle={{ background:'white', border:'1px solid var(--border2)', borderRadius:8, fontSize:12, color:'var(--text)', boxShadow:'var(--shadow2)' }}
                  />
                  <Bar dataKey="risk" radius={[0,6,6,0]}>
                    {chartData.map((e,i) => <Cell key={i} fill={RISK_COLOR[e.rawRisk]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Feed */}
        <Card>
          <SectionLabel>📡 Live Event Feed</SectionLabel>
          <EventList events={news} />
        </Card>
      </div>
    </div>
  )
}
