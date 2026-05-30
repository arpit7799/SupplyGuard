import React from 'react';

export default function RiskAlertBanner({ alerts, onClose }) {
  if (!alerts || alerts.length === 0) return null;
  const topAlert = alerts[0];
  return (
    <div style={{ position:'fixed', top:56, left:0, right:0, zIndex:200, background:'rgba(239,68,68,0.1)', borderBottom:'1px solid rgba(239,68,68,0.3)', backdropFilter:'blur(20px)', padding:'10px 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ position:'absolute', width:20, height:20, borderRadius:'50%', background:'#ef4444', opacity:0.3, animation:'ping 1.5s ease-out infinite' }} />
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444', boxShadow:'0 0 10px #ef4444' }} />
        </div>
        <span style={{ fontSize:10, fontFamily:'Space Mono,monospace', fontWeight:700, color:'#ef4444', letterSpacing:1, background:'rgba(239,68,68,0.15)', padding:'2px 8px', borderRadius:4, border:'1px solid rgba(239,68,68,0.3)' }}>CRITICAL ALERT</span>
        <span style={{ fontSize:13, color:'var(--text)', fontWeight:500 }}>
          High risk surge detected in <strong style={{ color:'#fff' }}>{topAlert.location}</strong>
        </span>
      </div>
      <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--muted2)', cursor:'pointer', fontSize:20, lineHeight:1, padding:'0 4px' }}>×</button>
    </div>
  );
}
