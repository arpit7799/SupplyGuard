import React from 'react';

const RC = { high:{color:'#ef4444',bg:'rgba(239,68,68,0.07)',border:'rgba(239,68,68,0.2)',label:'CRITICAL'}, medium:{color:'#f59e0b',bg:'rgba(245,158,11,0.07)',border:'rgba(245,158,11,0.2)',label:'WARNING'}, low:{color:'#10b981',bg:'rgba(16,185,129,0.07)',border:'rgba(16,185,129,0.2)',label:'STABLE'} };
const CI = { weather:'🌪', war:'⚔️', transport:'🚢', politics:'🏛' };
const FL = { China:'🇨🇳',Germany:'🇩🇪',Netherlands:'🇳🇱',Taiwan:'🇹🇼',India:'🇮🇳',Ukraine:'🇺🇦',USA:'🇺🇸',US:'🇺🇸',Suez:'🇪🇬',Egypt:'🇪🇬',Singapore:'🇸🇬',Brazil:'🇧🇷',Japan:'🇯🇵',Global:'🌍' };

export default function AlertCard({ item }) {
  const cfg = RC[item.risk] || RC.medium;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, border:`1px solid ${cfg.border}`, background:cfg.bg, cursor:'pointer', transition:'all 0.2s' }}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateX(3px)';e.currentTarget.style.borderColor=cfg.color+'55'}}
      onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor=cfg.border}}>
      <div style={{ minWidth:36, height:36, borderRadius:8, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--surface2)', border:`1px solid ${cfg.border}` }}>
        {CI[item.category]||'📡'}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.3 }}>{item.title}</div>
          {item.risk==='high' && <span style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444', flexShrink:0, boxShadow:'0 0 6px #ef4444', animation:'pulse 1.5s infinite' }} />}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:10, color:'var(--muted2)', fontFamily:'Space Mono,monospace' }}>
          <span>{FL[item.country]||'🌐'} {item.country}</span>
          <span style={{ color:'var(--muted)' }}>·</span>
          <span style={{ textTransform:'capitalize' }}>{item.category}</span>
          <span style={{ color:'var(--muted)' }}>·</span>
          <span>{item.time}</span>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, flexShrink:0 }}>
        <span style={{ fontSize:9, fontFamily:'Space Mono,monospace', fontWeight:700, padding:'3px 7px', borderRadius:4, letterSpacing:0.5, color:cfg.color, border:`1px solid ${cfg.border}`, background:'var(--bg)' }}>{cfg.label}</span>
        <div style={{ width:44, height:3, background:'var(--surface2)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:2, background:cfg.color, width:item.risk==='high'?'100%':item.risk==='medium'?'60%':'25%' }} />
        </div>
      </div>
    </div>
  );
}
