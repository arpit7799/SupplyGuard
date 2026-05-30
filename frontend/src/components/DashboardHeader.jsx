import React from 'react';

export default function DashboardHeader({ onSearch, onRefresh }) {
  return (
    <div style={{ position:'fixed', top:56, left:0, right:0, zIndex:50, background:'rgba(3,7,17,0.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', padding:'10px 2rem', display:'flex', alignItems:'center', gap:16 }}>
      <input type="text" placeholder="Search events, countries..."
        onChange={e => onSearch && onSearch(e.target.value)}
        style={{ flex:1, maxWidth:360, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'7px 14px', fontSize:13, color:'var(--text)', outline:'none', fontFamily:'Inter,sans-serif' }}
        onFocus={e=>e.target.style.borderColor='rgba(59,126,248,0.5)'}
        onBlur={e=>e.target.style.borderColor='var(--border)'}
      />
      <button onClick={onRefresh} style={{ padding:'7px 18px', borderRadius:8, fontSize:12, fontWeight:700, background:'var(--surface)', border:'1px solid var(--border2)', color:'var(--blue)', cursor:'pointer', fontFamily:'Space Mono,monospace', letterSpacing:0.5, transition:'all 0.2s' }}
        onMouseEnter={e=>e.currentTarget.style.borderColor='var(--blue)'}
        onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border2)'}>
        ↺ REFRESH
      </button>
    </div>
  );
}
