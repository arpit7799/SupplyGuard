import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STATS = [
  { value:'10K+', label:'Headlines Analyzed' },
  { value:'190',  label:'Countries Monitored' },
  { value:'99%',  label:'Uptime' },
  { value:'<1s',  label:'Detection Speed' },
]
const EVENTS = [
  { flag:'🇨🇳', country:'China',   event:'Port shutdown — Yangtze flooding',    risk:'high',   time:'2m ago' },
  { flag:'🇹🇼', country:'Taiwan',  event:'Military drills, Strait tensions',     risk:'high',   time:'14m ago' },
  { flag:'🇩🇪', country:'Germany', event:'Rotterdam dock worker strike',          risk:'high',   time:'1h ago' },
  { flag:'🇮🇳', country:'India',   event:'Monsoon delays logistics network',      risk:'medium', time:'2h ago' },
  { flag:'🇺🇦', country:'Ukraine', event:'Grain corridor partially restored',     risk:'medium', time:'3h ago' },
]
const RC = { high:'#ef4444', medium:'#f59e0b', low:'#10b981' }
const RL = { high:'CRITICAL', medium:'WARNING', low:'STABLE' }

export default function Home() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])



  return (
    <div style={{ paddingTop:56, minHeight:'100vh', background:'var(--bg)', overflow:'hidden', position:'relative' }}>
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(59,126,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,126,248,0.03) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
      <div style={{ position:'fixed', top:'10%', left:'50%', transform:'translateX(-50%)', width:600, height:300, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(59,126,248,0.07) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'calc(100vh - 56px)', alignItems:'center', maxWidth:1400, margin:'0 auto', padding:'0 3rem' }}>

        <div style={{ padding:'3rem 3rem 3rem 0', opacity:visible?1:0, transform:visible?'none':'translateY(24px)', transition:'all 0.7s ease' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:'2rem', background:'rgba(59,126,248,0.08)', border:'1px solid rgba(59,126,248,0.2)', padding:'5px 14px 5px 8px', borderRadius:50, fontSize:11, fontFamily:'Space Mono,monospace', color:'var(--blue)', letterSpacing:1 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 8px var(--green)', animation:'pulse 2s infinite' }} />
            AI-POWERED RISK INTELLIGENCE
          </div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(2.8rem,4.5vw,4.5rem)', fontWeight:900, lineHeight:1.0, letterSpacing:-2, marginBottom:'1.5rem', color:'var(--text)' }}>
            Know supply<br/>chain risks<br/>
            <span style={{ background:'linear-gradient(135deg,#3b7ef8,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>before they hit.</span>
          </h1>
          <p style={{ fontSize:16, color:'var(--text2)', lineHeight:1.8, marginBottom:'2.5rem', maxWidth:400 }}>
            Real-time AI scans global headlines, classifies threats by severity, and maps disruptions across 190 countries.
          </p>
          <div style={{ display:'flex', gap:12, marginBottom:'3rem' }}>
            <button onClick={()=>navigate('/dashboard')} style={{ padding:'13px 28px', background:'linear-gradient(135deg,#3b7ef8,#06b6d4)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, boxShadow:'0 8px 32px rgba(59,126,248,0.35)', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(59,126,248,0.5)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 8px 32px rgba(59,126,248,0.35)'}}>
              Launch Dashboard →
            </button>
            <button onClick={()=>navigate('/dashboard')} style={{ padding:'13px 24px', background:'transparent', color:'var(--text2)', border:'1px solid var(--border2)', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--blue)';e.currentTarget.style.color='var(--text)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--text2)'}}>
              View Live Feed
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {STATS.map((s,i)=>(
              <div key={s.label} style={{ opacity:visible?1:0, transform:visible?'none':'translateY(10px)', transition:`all 0.5s ease ${0.3+i*0.1}s` }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:24, fontWeight:900, color:'var(--blue)', letterSpacing:-1 }}>{s.value}</div>
                <div style={{ fontSize:11, color:'var(--muted2)', marginTop:3, fontWeight:500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:'relative', height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', perspective:'1200px' }}>

          {/* 3D Video Globe Card */}
          <div style={{
            position:'relative', width:'92%', flex:1,
            transform:'rotateY(-8deg) rotateX(4deg) scale(1.02)',
            transformStyle:'preserve-3d',
            transition:'transform 0.6s ease',
            borderRadius:20,
            boxShadow:'0 40px 120px rgba(59,126,248,0.35), 0 0 0 1px rgba(59,126,248,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
            overflow:'hidden',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='rotateY(-3deg) rotateX(2deg) scale(1.04)' }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='rotateY(-8deg) rotateX(4deg) scale(1.02)' }}
          >
            {/* Video */}
            <video
              src="/globe-bg.mp4"
              autoPlay loop muted playsInline
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:20 }}
            />

            {/* Blue gradient overlay */}
            <div style={{
              position:'absolute', inset:0, borderRadius:20,
              background:'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(59,126,248,0.08) 50%, rgba(0,0,0,0.4) 100%)',
              pointerEvents:'none'
            }}/>

            {/* Scanline shimmer */}
            <div style={{
              position:'absolute', inset:0, borderRadius:20,
              backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59,126,248,0.02) 2px, rgba(59,126,248,0.02) 4px)',
              pointerEvents:'none'
            }}/>

            {/* Top-left label */}
            <div style={{
              position:'absolute', top:16, left:16,
              display:'flex', alignItems:'center', gap:8,
              background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)',
              border:'1px solid rgba(59,126,248,0.3)', borderRadius:8,
              padding:'6px 12px', fontSize:10,
              fontFamily:'Space Mono,monospace', color:'#3b7ef8', letterSpacing:1.5
            }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#3b7ef8', boxShadow:'0 0 8px #3b7ef8', animation:'pulse 2s infinite' }}/>
              LIVE · GLOBAL RISK MAP
            </div>

            {/* Corner glow accents */}
            <div style={{ position:'absolute', top:0, right:0, width:120, height:120, background:'radial-gradient(circle at top right, rgba(59,126,248,0.25), transparent 70%)', pointerEvents:'none', borderRadius:20 }}/>
            <div style={{ position:'absolute', bottom:0, left:0, width:120, height:120, background:'radial-gradient(circle at bottom left, rgba(6,182,212,0.2), transparent 70%)', pointerEvents:'none', borderRadius:20 }}/>

            {/* 3D edge highlight (simulates depth) */}
            <div style={{
              position:'absolute', inset:0, borderRadius:20,
              border:'1px solid rgba(255,255,255,0.07)',
              pointerEvents:'none'
            }}/>
          </div>

          {/* Live Threat Feed below video */}
          <div style={{ width:'90%', marginBottom:'1.5rem', marginTop:'1rem', background:'rgba(15,20,35,0.8)', backdropFilter:'blur(12px)', border:'1px solid rgba(59,126,248,0.15)', borderRadius:12, overflow:'hidden',
            transform:'rotateY(-8deg) rotateX(2deg)', transformStyle:'preserve-3d',
            boxShadow:'0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,126,248,0.1)'
          }}>
            <div style={{ padding:'8px 14px', borderBottom:'1px solid rgba(59,126,248,0.1)', display:'flex', alignItems:'center', gap:8, fontSize:10, fontFamily:'Space Mono,monospace', color:'var(--muted2)', letterSpacing:1 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--red)', boxShadow:'0 0 6px var(--red)', animation:'pulse 1.5s infinite' }} />
              LIVE THREAT FEED
            </div>
            {EVENTS.map((e,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 14px', borderBottom:i<EVENTS.length-1?'1px solid rgba(59,126,248,0.08)':'none', opacity:visible?1:0, transition:`opacity 0.4s ease ${0.3+i*0.1}s` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:14 }}>{e.flag}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--text)', lineHeight:1.3 }}>{e.event}</div>
                    <div style={{ fontSize:10, color:'var(--muted2)', fontFamily:'Space Mono,monospace' }}>{e.country} · {e.time}</div>
                  </div>
                </div>
                <span style={{ fontSize:9, fontFamily:'Space Mono,monospace', fontWeight:700, padding:'3px 8px', borderRadius:4, letterSpacing:0.5, background:`${RC[e.risk]}18`, color:RC[e.risk], border:`1px solid ${RC[e.risk]}40` }}>{RL[e.risk]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}