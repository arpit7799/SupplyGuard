import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { pathname } = useLocation()
  const [dark, setDark] = useState(true)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <nav style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 2rem', height:56,
      background:'rgba(3,7,17,0.85)', borderBottom:'1px solid var(--border)',
      backdropFilter:'blur(20px)', position:'fixed', top:0, left:0, right:0, zIndex:100,
    }}>
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
        <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#3b7ef8,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, boxShadow:'0 0 20px rgba(59,126,248,0.4)' }}>⚡</div>
        <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:17, color:'var(--text)', letterSpacing:-0.5 }}>
          Supply<span style={{ color:'var(--blue)' }}>Guard</span>
        </span>
      </Link>
      <div style={{ display:'flex', gap:2 }}>
        {[['/', 'Home'],['/dashboard','Dashboard']].map(([to, label]) => (
          <Link key={to} to={to} style={{
            padding:'6px 16px', borderRadius:8, fontSize:13, fontWeight:600,
            color: pathname===to ? '#fff' : 'var(--muted2)',
            background: pathname===to ? 'rgba(59,126,248,0.15)' : 'transparent',
            border: pathname===to ? '1px solid rgba(59,126,248,0.3)' : '1px solid transparent',
            transition:'all 0.2s', textDecoration:'none',
          }}>{label}</Link>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => setDark(d => !d)} style={{
          background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:20,
          padding:'5px 12px', cursor:'pointer', fontSize:13, color:'var(--text2)',
          display:'flex', alignItems:'center', gap:6, transition:'all 0.2s'
        }}>{dark ? '☀️ Light' : '🌙 Dark'}</button>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontFamily:'Space Mono,monospace', color:'var(--green)', fontWeight:700, letterSpacing:1 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 8px var(--green)', animation:'pulse 2s infinite' }} />
        LIVE
        </div>
      </div>
    </nav>
  )
}
